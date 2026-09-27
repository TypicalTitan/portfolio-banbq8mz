#!/usr/bin/env node
/**
 * Generates the Bloodhaze film overlays in ../film/ (no dependencies):
 *   grain.png       512×512, tiles seamlessly: soft monochrome film grain (use with mix-blend-mode: overlay)
 *   dust.png        1024×1024: dust specks, hair fibres and scratches (normal or screen blend)
 *   light-leak.png  1024×1024: a coral light leak down the left third, warm to violet (screen blend)
 *   clouds.png      1024×1024: a sea of clouds seen from above, fading to a horizon (screen blend,
 *                   for the double exposure)
 * Everything is seeded, so re-running produces the same files.
 *   node asset-packs/bloodhaze/src/film.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { crc32, deflateSync } from 'node:zlib';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'film');
mkdirSync(OUT, { recursive: true });

function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

/* ── PNG writer (RGBA, 8-bit) ── */
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td) >>> 0);
  return Buffer.concat([len, td, crc]);
}
function writePng(file, w, h, rgba) {
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) {
    const o = y * (w * 4 + 1);
    raw[o] = 1; // Sub filter: helps smooth gradients compress
    for (let x = 0; x < w * 4; x++) {
      const v = rgba[y * w * 4 + x];
      const left = x >= 4 ? rgba[y * w * 4 + x - 4] : 0;
      raw[o + 1 + x] = (v - left) & 255;
    }
  }
  const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
  writeFileSync(join(OUT, file), png);
  console.log(`${file}: ${(png.length / 1024).toFixed(0)} KB`);
}
/** Float RGBA canvas with simple compositing helpers. */
function canvas(w, h) {
  const px = new Float32Array(w * h * 4);
  return {
    w, h, px,
    // "over" one straight-alpha colour onto pixel (x, y) with coverage a.
    over(x, y, r, g, b, a) {
      if (x < 0 || y < 0 || x >= w || y >= h || a <= 0) return;
      const i = ((y | 0) * w + (x | 0)) * 4;
      const da = px[i + 3], oa = a + da * (1 - a);
      if (oa <= 0) return;
      px[i] = (r * a + px[i] * da * (1 - a)) / oa;
      px[i + 1] = (g * a + px[i + 1] * da * (1 - a)) / oa;
      px[i + 2] = (b * a + px[i + 2] * da * (1 - a)) / oa;
      px[i + 3] = oa;
    },
    bytes() {
      const out = Buffer.alloc(w * h * 4);
      for (let i = 0; i < px.length; i++) out[i] = Math.round(clamp(i % 4 === 3 ? px[i] : px[i] / 255) * 255);
      return out;
    },
  };
}
/** Soft round dab of radius r (anti-aliased), colour 0..255, alpha 0..1. */
function dab(c, cx, cy, r, col, alpha, hard = 0.6) {
  const R = Math.ceil(r + 1.5);
  for (let y = Math.floor(cy - R); y <= cy + R; y++) {
    for (let x = Math.floor(cx - R); x <= cx + R; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      const a = alpha * (1 - smooth(r * hard, r + 0.8, d));
      c.over(x, y, col[0], col[1], col[2], a);
    }
  }
}

/* ── Value noise + fbm (for grain clumps, cloud shapes) ── */
function valueNoise(seed, period = 0) {
  const r = rng(seed);
  const N = 512, perm = new Uint16Array(N * 2), vals = new Float32Array(N);
  for (let i = 0; i < N; i++) { perm[i] = i; vals[i] = r(); }
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
  for (let i = 0; i < N; i++) perm[i + N] = perm[i];
  const wrap = (v) => (period ? ((v % period) + period) % period : v) & (N - 1);
  const h = (x, y) => vals[perm[perm[wrap(x)] + wrap(y)]];
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}
function fbm(noise, x, y, oct = 5) {
  let s = 0, amp = 0.5, f = 1, norm = 0;
  for (let o = 0; o < oct; o++) { s += amp * noise(x * f, y * f); norm += amp; amp *= 0.5; f *= 2; }
  return s / norm;
}

/* ── grain.png: white noise lightly clumped, both light and dark specks, tiles by construction ── */
{
  const W = 512, r = rng(11);
  const n = new Float32Array(W * W);
  for (let i = 0; i < n.length; i++) {
    // Box-Muller gaussian
    const u = Math.max(1e-9, r()), v = r();
    n[i] = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  // Wrap-around 3×3 blur so grains clump a little, like film rather than digital noise.
  const b = new Float32Array(W * W);
  const k = [1, 2, 1];
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    let s = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      s += n[((y + dy + W) % W) * W + ((x + dx + W) % W)] * k[dx + 1] * k[dy + 1];
    }
    b[y * W + x] = s / 16;
  }
  const px = Buffer.alloc(W * W * 4);
  for (let i = 0; i < W * W; i++) {
    const g = b[i] * 1.9;                      // ~unit variance after the blur
    const light = g > 0;
    px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = light ? 255 : 0;
    px[i * 4 + 3] = Math.round(clamp(Math.abs(g) * 0.09) * 255);
  }
  writePng('grain.png', W, W, px);
}

/* ── dust.png: specks, fibres and scratches ── */
{
  const W = 1024, r = rng(23), c = canvas(W, W);
  // Specks: mostly pale, some dark, a few irregular clusters.
  for (let i = 0; i < 260; i++) {
    const x = r() * W, y = r() * W;
    const big = r() < 0.08;
    const rad = big ? 1.6 + r() * 2.6 : 0.5 + r() * 1.3;
    const light = r() < 0.78;
    const col = light ? [255, 244, 246] : [8, 2, 4];
    const alpha = light ? 0.35 + r() * 0.6 : 0.4 + r() * 0.4;
    dab(c, x, y, rad, col, alpha);
    if (big && r() < 0.6) for (let j = 0; j < 3; j++) dab(c, x + (r() - 0.5) * rad * 3, y + (r() - 0.5) * rad * 3, rad * (0.3 + r() * 0.4), col, alpha * 0.8);
  }
  // Hair fibres: thin wandering curves.
  for (let i = 0; i < 11; i++) {
    let x = r() * W, y = r() * W, a = r() * Math.PI * 2;
    const len = 30 + r() * 120, alpha = 0.35 + r() * 0.45, width = 0.5 + r() * 0.5;
    const turn = (r() - 0.5) * 0.018;
    for (let s = 0; s < len; s += 0.5) {
      a += turn + (r() - 0.5) * 0.035;
      x += Math.cos(a) * 0.5; y += Math.sin(a) * 0.5;
      dab(c, x, y, width, [255, 240, 244], alpha * (0.6 + 0.4 * Math.sin((s / len) * Math.PI)), 0.3);
    }
  }
  // Scratches: long, faint, near-vertical lines.
  for (let i = 0; i < 6; i++) {
    let x = r() * W;
    const y0 = r() * W * 0.4, y1 = y0 + W * (0.3 + r() * 0.6), alpha = 0.1 + r() * 0.22;
    for (let y = y0; y < Math.min(W, y1); y += 0.7) {
      x += (r() - 0.5) * 0.25;
      c.over(x, y, 255, 240, 244, alpha * (0.5 + 0.5 * r()));
    }
  }
  writePng('dust.png', W, W, c.bytes());
}

/* ── light-leak.png: a coral strip down the left third, warm to violet ── */
{
  const W = 1024, px = Buffer.alloc(W * W * 4), noise = valueNoise(5);
  const coral = [255, 106, 92], hot = [255, 150, 120], violet = [122, 42, 154];
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    const u = x / W, v = y / W;
    const wob = (fbm(noise, u * 3, v * 3, 3) - 0.5) * 0.08;
    const strip = Math.exp(-(((u - 0.24 + wob) / 0.13) ** 2)) * (0.7 + 0.3 * (1 - v));        // the leak
    const bloom = Math.exp(-((((u - 0.1) / 0.3) ** 2) + (((v - 0.2) / 0.45) ** 2)));                // warm top-left
    const vio = smooth(0.55, 1.0, u) * (0.55 + 0.45 * (1 - v));                                       // violet right
    const a = clamp(strip * 0.6 + bloom * 0.4 + vio * 0.35);
    const tw = strip / (strip + bloom + vio + 1e-6), tb = bloom / (strip + bloom + vio + 1e-6);
    const i = (y * W + x) * 4;
    for (let k = 0; k < 3; k++) px[i + k] = Math.round(hot[k] * tw + coral[k] * tb + violet[k] * (1 - tw - tb));
    px[i + 3] = Math.round(a * 255);
  }
  writePng('light-leak.png', W, W, px);
}

/* ── clouds.png: a sea of clouds from above, in perspective to a hazy horizon ── */
{
  const W = 1024, px = Buffer.alloc(W * W * 4);
  const n1 = valueNoise(71), n2 = valueNoise(72);
  const horizon = 0.3; // clouds start 30% down and recede toward it
  for (let y = 0; y < W; y++) {
    const v = y / W;
    const hazeBand = Math.exp(-(((v - horizon) / 0.05) ** 2)) * 0.3; // soft glow on the horizon, both sides
    if (v < horizon) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        px[i] = 255; px[i + 1] = 176; px[i + 2] = 168; px[i + 3] = Math.round(hazeBand * 255);
      }
      continue;
    }
    const depth = 1 / Math.max(0.02, (v - horizon));      // perspective: far rows are compressed
    for (let x = 0; x < W; x++) {
      const u = (x / W - 0.5) * depth * 0.55;
      const z = depth * 0.9;
      // Domain-warped fbm gives puffy, rolling cloud tops.
      const q = fbm(n1, u * 1.2, z * 1.2, 4);
      const d = fbm(n2, u * 2.2 + q * 1.8, z * 2.2 + q * 1.8, 5);
      const puff = smooth(0.46, 0.66, d);
      const shade = 0.55 + 0.45 * smooth(0.5, 0.85, d);    // brighter tops, darker valleys
      const fadeFar = smooth(horizon + 0.05, horizon + 0.25, v); // melts into the horizon haze
      const a = clamp(puff * fadeFar * 0.95);
      const haze = 1 - fadeFar;
      const i = (y * W + x) * 4;
      px[i] = Math.round(255 * shade * (1 - 0.1 * haze));
      px[i + 1] = Math.round(176 * shade);
      px[i + 2] = Math.round(168 * shade);
      px[i + 3] = Math.round(clamp(a + hazeBand) * 255);
    }
  }
  writePng('clouds.png', W, W, px);
}
