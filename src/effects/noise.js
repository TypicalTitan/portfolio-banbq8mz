/**
 * Deterministic PRNG + 2D/1D value noise and fbm.
 * Pure math (no DOM), shared by the lava field, particle seeding and thorn geometry.
 */

/** mulberry32: tiny seeded PRNG → () => float in [0, 1). */
export function mulberry32(seed) {
  let a = seed | 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 256-entry permutation (doubled to skip a mask on the second lookup) + lattice values.
const PERM = new Uint8Array(512);
const VAL = new Float32Array(256);
{
  const rnd = mulberry32(0x71a7);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) { p[i] = i; VAL[i] = rnd(); }
  for (let i = 255; i > 0; i--) {
    const j = (rnd() * (i + 1)) | 0;
    const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const mix = (a, b, t) => a + (b - a) * t;
export function smoothstep(e0, e1, x) {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

/** 2D value noise with smoothstep interpolation → [0, 1]. */
export function noise2(x, y) {
  const xf = Math.floor(x);
  const yf = Math.floor(y);
  let tx = x - xf;
  let ty = y - yf;
  tx = tx * tx * (3 - 2 * tx);
  ty = ty * ty * (3 - 2 * ty);
  const xi = xf & 255;
  const yi = yf & 255;
  const a = PERM[xi] + yi;
  const b = PERM[xi + 1] + yi;
  const v00 = VAL[PERM[a]];
  const v01 = VAL[PERM[a + 1]];
  const v10 = VAL[PERM[b]];
  const v11 = VAL[PERM[b + 1]];
  const top = v00 + (v10 - v00) * tx;
  const bot = v01 + (v11 - v01) * tx;
  return top + (bot - top) * ty;
}

/** 1D value noise → [0, 1]. */
export function noise1(x) {
  const xf = Math.floor(x);
  let t = x - xf;
  t = t * t * (3 - 2 * t);
  const i = xf & 255;
  const a = VAL[PERM[i]];
  const b = VAL[PERM[i + 1]];
  return a + (b - a) * t;
}

// Octave rotation (~0.5 rad) breaks up the axis-aligned lattice look.
const RC = Math.cos(0.5);
const RS = Math.sin(0.5);

/**
 * Fractal Brownian motion → [0, 1]: gain .5, lacunarity 2.03,
 * rotated + offset between octaves.
 */
export function fbm(x, y, oct) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let i = 0; i < oct; i++) {
    sum += amp * noise2(x, y);
    norm += amp;
    const nx = (RC * x - RS * y) * 2.03 + 17.13;
    y = (RS * x + RC * y) * 2.03 + 5.71;
    x = nx;
    amp *= 0.5;
  }
  return sum / norm;
}
