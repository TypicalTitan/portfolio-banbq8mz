/**
 * Living lava field on a 2D canvas. The backing store IS the low-res buffer
 * (~180×95 for a 1440px hero); CSS bilinear upscaling does the softening.
 */
import { fbm, smoothstep } from './noise.js';
import { perfTier } from './motion.js';
import { mountCanvasEffect, effectCanvas } from './scheduler.js';

const LAVA = ['#0a0204', '#2a050c', '#6b0a18', '#c8102e', '#ff4a00', '#ffb000'];
const STOP_AT = [0, 0.35, 0.55, 0.7, 0.85, 1];
const CORE = '#fff1c2';

const PRESETS = {
  hero:    { stops: LAVA, core: true, cool: 0.7, heat: 1, speed: 0.05 },
  // Corner-biased: heat falls from the bottom-right corner (lo + span·b) instead of by row.
  fissure: { stops: LAVA, core: true, cool: 0, heat: 1.08, speed: 0.04, corner: true, lo: 0.5, span: 0.6 },
  lava:    { stops: LAVA, core: true, cool: 0.55, heat: 0.9, speed: 0.05 },
  ember:   { stops: LAVA, core: true, cool: 0.55, heat: 0.75, speed: 0.05 },
  dusk:    { stops: ['#07040a', '#1b3a55', '#4a1f4f', '#a0265f', '#ff3b6b', '#ffd1dc'], cool: 0.55, heat: 0.85, speed: 0.04 },
  violet:  { stops: ['#07030d', '#3b1a6e', '#6a1a4a', '#8a3fd1', '#ff6b8e', '#ffd1dc'], cool: 0.55, heat: 0.85, speed: 0.04 },
};

const FPS = 24;
const STILL_T = 37; // the one frame drawn for animate:false / reduced motion
const BUDGET_MS = 5; // average update cost that triggers the one-time resolution halving

// The LUT spans heat 0..1.5: the field's r² + ridge sum overshoots 1 in hot pools, and a
// soft knee above .8 rolls that off so only true peaks reach the white-hot core.
const HEAT_MAX = 1.5;
const LUT_SCALE = 255 / HEAT_MAX;
const KNEE = 0.8;

const LITTLE_ENDIAN = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;
const luts = new Map();

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function lutFor(name) {
  let lut = luts.get(name);
  if (lut) return lut;
  const { stops, core } = PRESETS[name];
  const cols = stops.map(rgb);
  const hot = rgb(CORE);
  lut = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let x = (i / 255) * HEAT_MAX;
    if (x > KNEE) x = KNEE + (1 - KNEE) * Math.tanh((x - KNEE) / 0.25);
    let k = 0;
    while (k < STOP_AT.length - 2 && x > STOP_AT[k + 1]) k++;
    const t = Math.min(1, Math.max(0, (x - STOP_AT[k]) / (STOP_AT[k + 1] - STOP_AT[k])));
    const c = [0, 1, 2].map((j) => cols[k][j] + (cols[k + 1][j] - cols[k][j]) * t);
    if (core && x >= 0.97) {
      const m = smoothstep(0.97, 1, x);
      for (let j = 0; j < 3; j++) c[j] += (hot[j] - c[j]) * m;
    }
    const [r, g, b] = c.map(Math.round);
    lut[i] = LITTLE_ENDIAN ? ((255 << 24) | (b << 16) | (g << 8) | r) >>> 0 : ((r << 24) | (g << 16) | (b << 8) | 255) >>> 0;
  }
  luts.set(name, lut);
  return lut;
}

/**
 * Heat field per the spec: domain-warped fbm (q → r → f), glowing ridges where f ≈ .5,
 * a cool crust band up top and more heat toward the bottom (or the bottom-right corner
 * for `fissure`). A separable [1 2 1] pass anti-aliases ridges thinner than a buffer pixel.
 */
function heatField(out, tmp, W, H, t, P, oct, aspect) {
  const T = t * P.speed;
  const qy = T * 0.9;
  const rx = 1.7 + T * 0.6;
  const ry = 9.2 - T * 0.4;
  const fo = T * 0.3;
  const sx = (aspect * 2.4) / W;
  const sy = 2.4 / H;
  let i = 0;
  for (let y = 0; y < H; y++) {
    const v = (y + 0.5) / H;
    const py = (y + 0.5) * sy;
    const cool = 1 - P.cool * (1 - smoothstep(0.35, 0.85, v));
    const rowK = cool * P.heat * (0.55 + 0.45 * v);
    const dv = 1 - v;
    for (let x = 0; x < W; x++) {
      const px = (x + 0.5) * sx;
      const q = fbm(px, py + qy, oct);
      const wq = 2.2 * q;
      const r = fbm(px + wq + rx, py + wq + ry, oct);
      const wr = 1.8 * r + fo;
      const f = fbm(px * 1.6 + wr, py * 1.6 + wr, oct);
      let ridge = 1 - Math.abs(2 * f - 1);
      ridge *= ridge * ridge;
      let heat = r * r * 1.1 + ridge * ridge * 0.9;
      if (P.corner) {
        const du = 1 - (x + 0.5) / W;
        const b = 1 - Math.sqrt(du * du + dv * dv);
        heat *= cool * P.heat * (P.lo + P.span * (b > 0 ? b : 0));
      } else {
        heat *= rowK;
      }
      out[i++] = heat;
    }
  }
  for (let y = 0; y < H; y++) {
    const o = y * W;
    for (let x = 0; x < W; x++) {
      const l = x > 0 ? x - 1 : 0;
      const r = x < W - 1 ? x + 1 : x;
      tmp[o + x] = (out[o + l] + 2 * out[o + x] + out[o + r]) * 0.25;
    }
  }
  for (let y = 0; y < H; y++) {
    const o = y * W;
    const u = (y > 0 ? y - 1 : 0) * W;
    const d = (y < H - 1 ? y + 1 : y) * W;
    for (let x = 0; x < W; x++) out[o + x] = (tmp[u + x] + 2 * tmp[o + x] + tmp[d + x]) * 0.25;
  }
}

const clampInt = (n, lo, hi) => Math.max(lo, Math.min(hi, Math.round(n)));

/**
 * mountLava(host, { preset, animate, t, heat }) → { destroy() }
 * Inserts <canvas class="fx-lava"> as the host's first child. Presets: hero, fissure,
 * lava, ember, dusk, violet (unknown → lava). `t` picks the still frame (default STILL_T),
 * so several static heroes sharing a preset don't paint identical fields; `heat` scales the
 * preset's heat (the detail-page stills use 1.25 so they reach the bright stops).
 */
export function mountLava(host, { preset = 'hero', animate = true, t: stillT = STILL_T, heat: heatScale = 1 } = {}) {
  const name = Object.prototype.hasOwnProperty.call(PRESETS, preset) ? preset : 'lava';
  const base = PRESETS[name];
  const P = heatScale === 1 ? base : { ...base, heat: base.heat * heatScale };
  const lut = lutFor(name);
  const canvas = effectCanvas('fx-lava');
  host.insertBefore(canvas, host.firstChild);

  const ctx = canvas.getContext('2d', { alpha: false });
  const tier = perfTier();
  const oct = tier === 'high' ? 3 : 2;

  let cssW = 0;
  let cssH = 0;
  let W = 0;
  let H = 0;
  let img = null;
  let pixels = null;
  let heat = null;
  let tmp = null;
  const still = Number.isFinite(stillT) ? stillT : STILL_T;
  let t = still;
  let halved = false;
  let costSum = 0;
  let costN = 0;

  function allocate() {
    const base = tier === 'high' ? clampInt(cssW / 8, 80, 200) : clampInt(cssW / 12, 64, 160);
    W = halved ? Math.max(32, base >> 1) : base;
    H = clampInt((W * cssH) / cssW, 8, 400);
    canvas.width = W;
    canvas.height = H;
    img = ctx.createImageData(W, H);
    pixels = new Uint32Array(img.data.buffer);
    heat = new Float32Array(W * H);
    tmp = new Float32Array(W * H);
  }

  function paint(atT) {
    const start = performance.now();
    heatField(heat, tmp, W, H, atT, P, oct, cssW / cssH);
    for (let i = 0, n = W * H; i < n; i++) {
      const v = heat[i];
      pixels[i] = lut[v <= 0 ? 0 : v >= HEAT_MAX ? 255 : (v * LUT_SCALE) | 0];
    }
    ctx.putImageData(img, 0, 0);
    return performance.now() - start;
  }

  return mountCanvasEffect({
    canvas,
    fps: FPS,
    animate: !!animate,
    resize(w, h) {
      cssW = w;
      cssH = h;
      allocate();
    },
    frame(dt) {
      t += dt;
      const cost = paint(t);
      if (halved || dt === 0) return;
      costSum += cost;
      if (++costN < 30) return;
      if (costSum / costN > BUDGET_MS) {
        halved = true;
        allocate();
        paint(t);
      }
      costSum = 0;
      costN = 0;
    },
    still() {
      paint(still);
    },
  });
}
