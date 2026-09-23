/**
 * Electric thorn vines: a hot stem, alternating hooked thorns, a pale crackling arc
 * and twinkling sparks. SVG built from constant/generated path data only.
 *
 * Corners and rings sample their own Bézier geometry, so their thorns exist before
 * the SVG is attached. Only thornVine(pathD) measures an arbitrary path in the DOM.
 * Draw-in is CSS (.fx-draw → .is-in via the reveal observer).
 */
import { mulberry32, noise1 } from './noise.js';
import { observeReveal } from './reveal.js';

const NS = 'http://www.w3.org/2000/svg';
export const SPARK_D = 'M0,-6 L1.2,-1.2 6,0 1.2,1.2 0,6 -1.2,1.2 -6,0 -1.2,-1.2Z';

const f1 = (n) => Math.round(n * 10) / 10;

/** SVG element with attributes (null/undefined skipped). */
export function svgEl(tag, attrs = {}, children = []) {
  const el = document.createElementNS(NS, tag);
  for (const key in attrs) if (attrs[key] != null) el.setAttribute(key, attrs[key]);
  for (const child of children) el.append(child);
  return el;
}

export function decorativeSvg(className, viewBox, width, height) {
  return svgEl('svg', {
    class: className,
    viewBox,
    width,
    height,
    'aria-hidden': 'true',
    focusable: 'false',
  });
}

/* ── Geometry ────────────────────────────────────────────────────────────── */

// A segment is [x0, y0, x1, y1, x2, y2, x3, y3] (cubic Bézier).
function cubicAt(s, t) {
  const m = 1 - t;
  const a = m * m * m;
  const b = 3 * m * m * t;
  const c = 3 * m * t * t;
  const d = t * t * t;
  return [a * s[0] + b * s[2] + c * s[4] + d * s[6], a * s[1] + b * s[3] + c * s[5] + d * s[7]];
}

export function segmentsToD(segs) {
  let d = `M${f1(segs[0][0])} ${f1(segs[0][1])}`;
  for (const s of segs) d += `C${f1(s[2])} ${f1(s[3])} ${f1(s[4])} ${f1(s[5])} ${f1(s[6])} ${f1(s[7])}`;
  return d;
}

/** Uniform Catmull-Rom through `pts` → cubic Bézier segments. */
function catmullRom(pts) {
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    segs.push([
      p1[0], p1[1],
      p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
      p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
      p2[0], p2[1],
    ]);
  }
  return segs;
}

/** Arc-length sampler over Bézier segments: { length, at(d) → {x, y, tx, ty} }. */
export function curveSampler(segs, perSeg = 40) {
  const xs = [];
  const ys = [];
  const ls = [];
  let len = 0;
  segs.forEach((s, si) => {
    for (let i = si ? 1 : 0; i <= perSeg; i++) {
      const [x, y] = cubicAt(s, i / perSeg);
      if (xs.length) len += Math.hypot(x - xs[xs.length - 1], y - ys[ys.length - 1]);
      xs.push(x);
      ys.push(y);
      ls.push(len);
    }
  });
  const last = xs.length - 1;
  return {
    length: len,
    at(d) {
      d = Math.max(0, Math.min(len, d));
      let lo = 0;
      let hi = last;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (ls[mid] < d) lo = mid;
        else hi = mid;
      }
      const span = ls[hi] - ls[lo] || 1;
      const k = (d - ls[lo]) / span;
      const dx = xs[hi] - xs[lo];
      const dy = ys[hi] - ys[lo];
      const n = Math.hypot(dx, dy) || 1;
      return { x: xs[lo] + dx * k, y: ys[lo] + dy * k, tx: dx / n, ty: dy / n };
    },
  };
}

function domSampler(path, length) {
  return {
    length,
    at(d) {
      const a = path.getPointAtLength(Math.max(0, d - 0.5));
      const b = path.getPointAtLength(Math.min(length, d + 0.5));
      const p = path.getPointAtLength(d);
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const n = Math.hypot(dx, dy) || 1;
      return { x: p.x, y: p.y, tx: dx / n, ty: dy / n };
    },
  };
}

/* ── Vine parts ──────────────────────────────────────────────────────────── */

/** Hooked rose thorn standing on the stem at p, leaning toward the growth direction. */
export function thornD(p, side, size) {
  const { x, y, tx, ty } = p;
  const nx = -ty * side;
  const ny = tx * side;
  const w = size * 0.36;
  const ax = x + nx * size + tx * size * 0.45;
  const ay = y + ny * size + ty * size * 0.45;
  const c1x = x + nx * size * 0.62 - tx * w * 0.3;
  const c1y = y + ny * size * 0.62 - ty * w * 0.3;
  const c2x = x + nx * size * 0.22 + tx * w * 0.55;
  const c2y = y + ny * size * 0.22 + ty * w * 0.55;
  return `M${f1(x - tx * w)} ${f1(y - ty * w)}Q${f1(c1x)} ${f1(c1y)} ${f1(ax)} ${f1(ay)}Q${f1(c2x)} ${f1(c2y)} ${f1(x + tx * w)} ${f1(y + ty * w)}Z`;
}

/** Jagged polyline hugging the stem: the "electric arc". */
function arcD(samp, rnd) {
  const L = samp.length;
  const n = Math.max(4, Math.round(L / 7));
  let d = '';
  for (let i = 0; i <= n; i++) {
    const p = samp.at((L * i) / n);
    const j = i === 0 || i === n ? 0 : (rnd() - 0.5) * 3.2;
    d += `${i ? 'L' : 'M'}${f1(p.x - p.ty * j)} ${f1(p.y + p.tx * j)}`;
  }
  return d;
}

/**
 * Fills <g class="fx-vine"> with stem, thorns (every ~spacing px, alternating sides,
 * smaller toward the tips) and the arc duplicate.
 */
function fillVine(g, samp, d, { spacing = 18, size = [5, 8], sw = null, seed = 1, thorns = true, arc = true } = {}) {
  const rnd = mulberry32(seed);
  if (sw != null) g.style.setProperty('--sw', `${sw}px`);
  g.append(svgEl('path', { class: 'fx-vine__stem', d, pathLength: 1 }));
  const L = samp.length;
  if (thorns && L > spacing) {
    let side = rnd() < 0.5 ? 1 : -1;
    let i = 0;
    for (let s = spacing * 0.6; s < L - spacing * 0.35; s += spacing * (0.85 + rnd() * 0.3)) {
      const taper = Math.max(0.45, Math.min(1, Math.min(s, L - s) / (L * 0.18)));
      const sz = (size[0] + rnd() * (size[1] - size[0])) * taper;
      const th = svgEl('path', { class: 'fx-vine__thorn', d: thornD(samp.at(s), side, sz) });
      th.style.setProperty('--i', i++);
      g.append(th);
      side = -side;
    }
  }
  if (arc) {
    const a = svgEl('path', { class: 'fx-vine__arc', d: arcD(samp, rnd), pathLength: 1 });
    a.style.setProperty('--arc-delay', `${(1.6 + Math.random() * 5.5).toFixed(2)}s`);
    g.append(a);
  }
  return g;
}

function vineFromSegments(segs, opts) {
  return fillVine(svgEl('g', { class: 'fx-vine' }), curveSampler(segs), segmentsToD(segs), opts);
}

/** Twinkling 4-point star placed inside an SVG. */
function sparkNode(x, y, size) {
  const star = svgEl('path', { class: 'fx-twinkle', d: SPARK_D });
  star.style.animationDelay = `${(-Math.random() * 2.4).toFixed(2)}s`;
  return svgEl('g', { class: 'fx-sparkg', transform: `translate(${f1(x)} ${f1(y)}) scale(${f1(size / 12)})` }, [star]);
}

/* ── Public builders ─────────────────────────────────────────────────────── */

/**
 * thornVine(pathD, { spacing, size, viewBox }) → <svg class="fx-vine-svg fx-draw"><g class="fx-vine">
 * Measuring needs the SVG attached: thorns are built in a rAF once `isConnected`
 * (10 frame tries, then a bounded 200ms poll for late attaches, ≤5s).
 * Without `viewBox`, one is fitted to the drawn vine.
 */
export function thornVine(pathD, { spacing = 18, size = [5, 8], viewBox = null } = {}) {
  const svg = decorativeSvg('fx-vine-svg fx-draw', viewBox);
  svg.setAttribute('overflow', 'visible');
  const g = svgEl('g', { class: 'fx-vine' });
  svg.append(g);
  let seed = 7;
  for (let i = 0; i < pathD.length; i++) seed = (seed * 31 + pathD.charCodeAt(i)) | 0;

  let tries = 0;
  const retry = () => {
    tries += 1;
    if (tries < 10) requestAnimationFrame(build);
    else if (tries < 35) setTimeout(build, 200);
  };
  const build = () => {
    if (!svg.isConnected) {
      retry();
      return;
    }
    const probe = svgEl('path', { d: pathD });
    g.append(probe);
    const length = probe.getTotalLength();
    if (!length) {
      probe.remove();
      retry();
      return;
    }
    const samp = domSampler(probe, length);
    const parts = fillVine(svgEl('g'), samp, pathD, { spacing, size, seed });
    probe.remove();
    g.append(...parts.childNodes);
    if (!viewBox) {
      const b = g.getBBox();
      const pad = size[1] + 2;
      if (b.width || b.height) svg.setAttribute('viewBox', `${f1(b.x - pad)} ${f1(b.y - pad)} ${f1(b.width + pad * 2)} ${f1(b.height + pad * 2)}`);
    }
    // If the reveal already fired, replay the draw-in from the hidden state.
    if (svg.classList.contains('is-in')) {
      svg.classList.remove('is-in');
      svg.getBoundingClientRect();
    }
    observeReveal(svg);
  };
  requestAnimationFrame(build);
  return svg;
}

// Top-left corner vine (viewBox 220): the spec path, with `S` expanded to its reflected control.
const CORNER_MAIN = [
  [8, 180, 20, 110, 40, 60, 110, 30],
  [110, 30, 180, 0, 190, 12, 212, 8],
];
const CORNER_TENDRILS = [
  [[42, 83, 58, 88, 75, 81, 76, 66], [76, 66, 77, 57, 69, 53, 64, 58]],
  [[156, 13, 162, 28, 153, 42, 141, 41], [141, 41, 134, 40.5, 133, 34, 139, 32]],
];
const CORNER_SPARKS = [[58, 118, 11], [124, 58, 14], [190, 34, 9]];

// The drawn vine is the top-left one; the other corners are reflections of it.
const CORNER_TRANSFORMS = {
  tl: null,
  tr: 'matrix(-1 0 0 1 220 0)',
  br: 'rotate(180 110 110)',
};

/**
 * thornCorners({ size, corners }) → DocumentFragment of <svg class="fx-thorn-corner fx-thorn-corner--tl|--tr|--br">.
 * corners defaults to ['tl', 'br']; pass ['tl', 'tr'] where something covers the bottom-right.
 */
export function thornCorners({ size = 220, corners = ['tl', 'br'] } = {}) {
  const frag = document.createDocumentFragment();
  corners.filter((pos) => pos in CORNER_TRANSFORMS).forEach((pos, k) => {
    const svg = decorativeSvg(`fx-thorn-corner fx-thorn-corner--${pos} fx-draw`, '0 0 220 220', size, size);
    svg.style.setProperty('--size', `${size}px`);
    const transform = CORNER_TRANSFORMS[pos];
    const root = transform ? svg.appendChild(svgEl('g', { transform })) : svg;
    root.append(
      vineFromSegments(CORNER_MAIN, { spacing: 18, size: [5, 8], sw: 1.5, seed: 11 + k * 7 }),
      ...CORNER_TENDRILS.map((segs, i) => vineFromSegments(segs, {
        spacing: 11, size: [2.4, 3.8], sw: 1, seed: 29 + i + k * 5, arc: i === 0,
      })),
      ...CORNER_SPARKS.map(([x, y, s]) => sparkNode(x, y, s)),
    );
    frag.append(svg);
    observeReveal(svg);
  });
  return frag;
}

/**
 * thornRing({ size, sparks }) → <svg class="fx-thorn-ring">: three intertwined vines around
 * r = .41·size (r = R + 7·sin(3θ+k) + 4·noise(θ), scaled to size) and orbiting sparks.
 */
export function thornRing({ size = 300, sparks = 8 } = {}) {
  const S = size;
  const c = S / 2;
  const R = 0.41 * S;
  const k = S / 300;
  const svg = decorativeSvg('fx-thorn-ring fx-draw', `0 0 ${S} ${S}`, S, S);
  svg.style.setProperty('--size', `${S}px`);
  const widths = [1.4, 2.2, 1.8];
  const tScale = Math.max(0.7, Math.min(1, k));
  for (let v = 0; v < 3; v++) {
    const start = v * (Math.PI * 2 / 3) - Math.PI / 2 + 0.35;
    const span = Math.PI * 2 * 0.86;
    const phase = v * 2.09 + 0.4;
    const n = 30;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const th = start + (span * i) / n;
      const r = R + 7 * k * Math.sin(3 * th + phase) + 4 * k * (noise1(th * 1.6 + v * 7.3 + 3) * 2 - 1);
      pts.push([c + r * Math.cos(th), c + r * Math.sin(th)]);
    }
    svg.append(vineFromSegments(catmullRom(pts), {
      spacing: 18 * Math.max(0.75, k),
      size: [5 * tScale, 8 * tScale],
      sw: widths[v],
      seed: 101 + v * 13,
    }));
  }
  const orbit = svgEl('g', { class: 'fx-thorn-ring__orbit' });
  const rnd = mulberry32(5 + sparks);
  for (let i = 0; i < sparks; i++) {
    const a = (i / Math.max(1, sparks)) * Math.PI * 2 + (rnd() - 0.5) * 0.5;
    const r = R + (i % 2 ? -13 : 16) * Math.max(0.6, k);
    orbit.append(sparkNode(c + r * Math.cos(a), c + r * Math.sin(a), (8 + rnd() * 6) * Math.max(0.6, k)));
  }
  svg.append(orbit);
  observeReveal(svg);
  return svg;
}
