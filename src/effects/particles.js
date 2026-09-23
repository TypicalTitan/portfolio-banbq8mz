/**
 * Embers and crimson petals on a DPR-aware 2D canvas. Every glow and blur is baked
 * into sprites once; the frame loop only does drawImage (never shadowBlur).
 */
import { mulberry32 } from './noise.js';
import { perfTier } from './motion.js';
import { mountCanvasEffect, effectCanvas } from './scheduler.js';

const TAU = Math.PI * 2;
const RES = 2; // sprites are rasterised at the DPR cap

/* ── Sprites (built once, shared by every instance) ──────────────────────── */

const EMBER_PX = 32;
const EMBER_TINTS = [
  // amber · lava · hot; [core, body] as "r,g,b"
  ['255,241,194', '255,176,0', '255,74,0'],
  ['255,196,150', '255,74,0', '255,74,0'],
  ['255,200,214', '255,45,85', '255,45,85'],
];
const PETAL_PATH = 'M2 14 C8 2,26 0,38 10 C34 12,34 16,38 18 C26 28,8 26,2 14Z';
const PETAL_W = 40;
const PETAL_H = 28;
const PETAL_SCALES = [0.6, 1, 1.6];
const PETAL_BLUR = 3;
const PETAL_TINTS = [
  ['#ff3355', '#c8102e'], // tip → base
  ['#ff6682', '#9e0b24'],
];

let sprites = null;

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w));
  c.height = Math.max(1, Math.ceil(h));
  return c;
}

function canvasFilterWorks() {
  const g = makeCanvas(1, 1).getContext('2d');
  if (!g || !('filter' in g)) return false;
  g.filter = 'blur(2px)';
  return g.filter === 'blur(2px)';
}

function emberSprite([core, body, edge], soft) {
  const px = EMBER_PX * RES;
  const c = makeCanvas(px, px);
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px / 2);
  if (soft) {
    grad.addColorStop(0, `rgba(${body},.55)`);
    grad.addColorStop(0.45, `rgba(${edge},.22)`);
  } else {
    grad.addColorStop(0, `rgba(${core},1)`);
    grad.addColorStop(0.22, `rgba(${body},.92)`);
    grad.addColorStop(0.55, `rgba(${edge},.26)`);
  }
  grad.addColorStop(1, `rgba(${edge},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, px, px);
  return c;
}

function petalSprite([tip, base], scale, blurred, canFilter) {
  const pad = blurred ? PETAL_BLUR * 3 : 1;
  const w = PETAL_W * scale + pad * 2;
  const h = PETAL_H * scale + pad * 2;
  const sharp = makeCanvas(w * RES, h * RES);
  const g = sharp.getContext('2d');
  g.setTransform(RES * scale, 0, 0, RES * scale, pad * RES, pad * RES);
  const path = new Path2D(PETAL_PATH);
  const fill = g.createLinearGradient(38, 14, 2, 14);
  fill.addColorStop(0, tip);
  fill.addColorStop(1, base);
  g.fillStyle = fill;
  g.fill(path);
  const sheen = g.createRadialGradient(27, 9, 0, 27, 9, 17);
  sheen.addColorStop(0, 'rgba(255,214,222,.3)');
  sheen.addColorStop(1, 'rgba(255,214,222,0)');
  g.fillStyle = sheen;
  g.fill(path);
  g.strokeStyle = 'rgba(255,140,160,.35)';
  g.lineWidth = 0.8;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(5, 14.2);
  g.quadraticCurveTo(20, 12.4, 33, 13.6);
  g.stroke();
  if (!blurred) return { img: sharp, w, h };

  const soft = makeCanvas(w * RES, h * RES);
  const s = soft.getContext('2d');
  if (canFilter) s.filter = `blur(${PETAL_BLUR * RES}px)`;
  else s.globalAlpha = 0.55; // no ctx.filter (older Safari): lower alpha stands in for blur
  s.drawImage(sharp, 0, 0);
  return { img: soft, w, h };
}

function getSprites() {
  if (sprites) return sprites;
  const canFilter = canvasFilterWorks();
  sprites = {
    ember: EMBER_TINTS.map((t) => emberSprite(t, false)),
    emberSoft: EMBER_TINTS.map((t) => emberSprite(t, true)),
    // petal[tint][scaleIndex][blurred ? 1 : 0]
    petal: PETAL_TINTS.map((tint) => PETAL_SCALES.map((sc) => [
      petalSprite(tint, sc, false, canFilter),
      petalSprite(tint, sc, true, canFilter),
    ])),
  };
  return sprites;
}

/* ── Particle model ──────────────────────────────────────────────────────── */

// Depth layers: share of petals, sprite scale index, alpha, speed multiplier, blurred sprite.
const LAYERS = {
  far: { scale: 0, alpha: 0.45, speed: 0.7, blur: 0 },
  mid: { scale: 1, alpha: 0.8, speed: 1, blur: 0 },
  near: { scale: 2, alpha: 0.85, speed: 1.4, blur: 1 },
};
const WIND = -28;
const GUST = 12;
const GUST_W = TAU / 6;
const EDGE = 48; // off-canvas margin before a petal is recycled

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const range = (rnd, a, b) => a + (b - a) * rnd();

function resolveCount(value, area, per, lo, hi, tier) {
  if (value === 'auto') {
    const n = clamp(area / per, lo, hi);
    return Math.round(tier === 'low' ? n * 0.5 : n);
  }
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

function pickEmberTint(rnd) {
  const x = rnd();
  return x < 0.55 ? 0 : x < 0.85 ? 1 : 2; // 55% amber · 30% lava · 15% hot
}

/**
 * mountParticles(host, { embers, petals, petalLayers, spawn, bias, mix }) → { destroy() }
 * embers/petals: number or 'auto'; petalLayers: 'all' | 'far-mid'; spawn: 'bottom' | 'right'.
 * bias: 'none' | 'edges' — 'edges' seeds and re-enters petals in the outer 22% on each side
 * (the frozen frame's distribution) so bands with a centred card keep their gutters busy.
 * mix: optional { far, near } shares of the petal count (default: near 10%, far half the rest).
 * The canvas goes in front of any leading .fx-lava canvas and behind everything else.
 */
export function mountParticles(host, { embers = 0, petals = 0, petalLayers = 'all', spawn = 'bottom', bias = 'none', mix = null } = {}) {
  const canvas = effectCanvas('fx-particles');
  let ref = host.firstChild;
  while (ref && ref.nodeType === 1 && ref.classList.contains('fx-lava')) ref = ref.nextSibling;
  host.insertBefore(canvas, ref);

  const ctx = canvas.getContext('2d');
  const tier = perfTier();
  const farMid = petalLayers === 'far-mid';
  const alphaCap = farMid ? 0.6 : 1;
  const fromRight = spawn === 'right';
  const edges = bias === 'edges';

  let W = 0;
  let H = 0;
  let dpr = 1;
  let t = 0;
  let sp = null;
  let emberList = [];
  let petalList = [];

  /* Embers rise from the bottom 30% (or the bottom-right quadrant). */
  function spawnEmber(e, rnd, fresh) {
    e.x = fromRight ? range(rnd, 0.5, 1) * W : rnd() * W;
    e.y = fromRight ? range(rnd, 0.5, 1) * H : range(rnd, 0.7, 1) * H + 4;
    e.vy = -range(rnd, 18, 46);
    e.amp = range(rnd, 6, 18);
    e.freq = range(rnd, 0.3, 0.9) * TAU;
    e.ph = rnd() * TAU;
    e.life = range(rnd, 2.5, 6);
    e.age = fresh ? rnd() * e.life : 0;
    const big = rnd() < 0.08;
    const r = big ? range(rnd, 3, 4) : range(rnd, 0.8, 2.4);
    const tint = pickEmberTint(rnd);
    e.img = big ? sp.emberSoft[tint] : sp.ember[tint];
    e.size = r * 6;
    return e;
  }

  function makePetal(layer, rnd) {
    const L = LAYERS[layer];
    const tint = rnd() < 0.62 ? 0 : 1;
    return {
      L,
      sprite: sp.petal[tint][L.scale][L.blur],
      alpha: Math.min(L.alpha, alphaCap),
      x: 0,
      y: 0,
      fall: range(rnd, 15, 45),
      rot: rnd() * TAU,
      spin: range(rnd, -40, 40) * (Math.PI / 180),
      flip: range(rnd, 1.2, 3.2),
      ph: rnd() * TAU,
      sway: range(rnd, 4, 10),
    };
  }

  /* x in the outer `share` of the width on either side. */
  const edgeX = (rnd, share) => (rnd() < 0.5 ? rnd() * share : 1 - rnd() * share) * W;

  /* A petal that drifts out left/bottom re-enters through the top or right edge. */
  function recyclePetal(p, rnd) {
    if (edges) {
      p.x = edgeX(rnd, 0.22);
      p.y = -EDGE * 0.6;
    } else if (rnd() < W / (W + H)) {
      p.x = rnd() * (W + EDGE);
      p.y = -EDGE * 0.6;
    } else {
      p.x = W + EDGE * 0.6;
      p.y = range(rnd, -EDGE, H * 0.85);
    }
  }

  function seed(rnd, frozen) {
    const area = W * H;
    const nEmbers = resolveCount(embers, area, 14000, 24, 80, tier);
    const nPetals = resolveCount(petals, area, 30000, 14, 32, tier);
    emberList = [];
    for (let i = 0; i < nEmbers; i++) {
      const e = spawnEmber({}, rnd, true);
      if (frozen) e.age = range(rnd, 0.15, 0.85) * e.life;
      emberList.push(e);
    }
    petalList = [];
    const nNear = farMid ? 0 : Math.round(nPetals * (mix?.near ?? 0.1));
    const nFar = mix?.far != null ? Math.round(nPetals * mix.far) : Math.round((nPetals - nNear) / 2);
    for (let i = 0; i < nPetals; i++) {
      const p = makePetal(i < nFar ? 'far' : i < nPetals - nNear ? 'mid' : 'near', rnd);
      // Frozen frames keep petals in the outer 25% on each side so the text stays clear,
      // and never catch one edge-on mid-tumble.
      p.x = frozen ? edgeX(rnd, 0.25) : edges ? edgeX(rnd, 0.22) : rnd() * W;
      p.y = rnd() * H;
      if (frozen) p.ph = range(rnd, -0.9, 0.9) + (rnd() < 0.3 ? Math.PI : 0);
      petalList.push(p);
    }
  }

  function update(dt) {
    t += dt;
    const rnd = Math.random;
    for (const e of emberList) {
      e.age += dt;
      if (e.age >= e.life || e.y < -e.size) spawnEmber(e, rnd, false);
      e.y += e.vy * dt;
      e.x += Math.sin(t * e.freq + e.ph) * e.amp * dt;
    }
    const wind = WIND + GUST * Math.sin(t * GUST_W);
    for (const p of petalList) {
      const s = p.L.speed;
      p.x += (wind + Math.sin(t * 1.3 + p.ph) * p.sway) * s * dt;
      p.y += p.fall * s * dt;
      p.rot += p.spin * dt;
      if (p.x < -EDGE || p.y > H + EDGE) recyclePetal(p, rnd);
    }
  }

  function drawPetals(layer) {
    for (const p of petalList) {
      if (p.L !== layer) continue;
      const k = Math.cos(t * p.flip + p.ph); // tumble: scaleY
      const c = Math.cos(p.rot) * dpr;
      const s = Math.sin(p.rot) * dpr;
      ctx.globalAlpha = p.alpha * (k < 0 ? 0.78 : 1); // the back face reads a touch darker
      ctx.setTransform(c, s, -s * k, c * k, p.x * dpr, p.y * dpr);
      const { img, w, h } = p.sprite;
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
    }
  }

  function drawEmbers() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    for (const e of emberList) {
      const life = e.age / e.life;
      const a = Math.pow(Math.max(0, Math.sin(Math.PI * life)), 0.8) * (0.75 + 0.25 * Math.sin(t * 20 + e.ph));
      if (a <= 0.01) continue;
      ctx.globalAlpha = a > 1 ? 1 : a;
      ctx.drawImage(e.img, e.x - e.size / 2, e.y - e.size / 2, e.size, e.size);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPetals(LAYERS.far);
    drawEmbers();
    drawPetals(LAYERS.mid);
    drawPetals(LAYERS.near);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
  }

  return mountCanvasEffect({
    canvas,
    fps: tier === 'high' ? 60 : 30,
    animate: true,
    resize(w, h) {
      sp = getSprites();
      W = w;
      H = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      seed(Math.random, false); // re-seed rather than stretch
    },
    frame(dt) {
      if (dt > 0) update(dt);
      draw();
    },
    still() {
      t = 0;
      seed(mulberry32(7), true);
      draw();
    },
  });
}
