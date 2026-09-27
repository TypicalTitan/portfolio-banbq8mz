/**
 * Sigils: the centre mark (crimson yin-yang, or the bladed rose in the theme packs), the
 * rotating sticker disc, sparkles, the eyebrow sprig and the thorn seam. SVG built once from
 * constant path data; colours are theme tokens, so a pack switch restyles them in place.
 */
import { svgEl, decorativeSvg, curveSampler, segmentsToD, thornD, SPARK_D } from './thorns.js';

let ids = 0;
const nextId = (prefix) => `${prefix}-${++ids}`;
const f1 = (n) => Math.round(n * 10) / 10;
const fill = (token) => `fill:var(${token})`;
const stop = (offset, token) => svgEl('stop', { offset, style: `stop-color:var(${token})` });

// Circle as four cubic arcs (for sampling thorns around it).
function circleSegments(cx, cy, r) {
  const k = 0.5523 * r;
  return [
    [cx, cy - r, cx + k, cy - r, cx + r, cy - k, cx + r, cy],
    [cx + r, cy, cx + r, cy + k, cx + k, cy + r, cx, cy + r],
    [cx, cy + r, cx - k, cy + r, cx - r, cy + k, cx - r, cy],
    [cx - r, cy, cx - r, cy - k, cx - k, cy - r, cx, cy - r],
  ];
}

/* Bladed rose, drawn pointing up from the centre of a 40-unit box: eight curved blades
   (long on the cardinals, short between), a ring of five petals and a three-petal bud. */
const ROSE_BLADE_LONG = 'M0,-4 C3.4,-7.5 3.6,-13 0,-19 C-0.9,-13 -1.8,-7.5 0,-4Z';
const ROSE_BLADE_SHORT = 'M0,-4 C2.8,-6.8 3,-11 0,-15.5 C-0.8,-11 -1.5,-6.8 0,-4Z';
const ROSE_PETAL = 'M0,-1 C3.4,-3.2 3.4,-8.4 0,-10.6 C-3.4,-8.4 -3.4,-3.2 0,-1Z';

function yinYangMark(id) {
  const thorns = svgEl('g', { style: fill('--c-hot-2'), transform: 'translate(20 20)' });
  for (let i = 0; i < 10; i++) {
    thorns.append(svgEl('path', { d: 'M0,-14.5 L1.6,-18.5 L-0.6,-14.5Z', transform: `rotate(${i * 36})` }));
  }
  return svgEl('g', { class: 'fx-sigil__yy' }, [
    svgEl('defs', {}, [
      svgEl('linearGradient', { id, x1: '0.3', y1: '0', x2: '0.7', y2: '1' }, [stop('0', '--c-hot-2'), stop('1', '--c-crimson-500')]),
    ]),
    thorns,
    svgEl('circle', { cx: 20, cy: 20, r: 14, style: fill('--c-surface-1') }),
    svgEl('path', { d: 'M20 6 A14 14 0 0 1 20 34 A7 7 0 0 1 20 20 A7 7 0 0 0 20 6Z', fill: `url(#${id})` }),
    svgEl('circle', { cx: 20, cy: 13, r: 2.2, style: fill('--c-lava-hi') }),
    svgEl('circle', { cx: 20, cy: 27, r: 2.2, style: fill('--c-surface-1') }),
    svgEl('circle', { cx: 20, cy: 20, r: 14, fill: 'none', style: 'stroke:var(--c-rose)', 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }),
  ]);
}

function roseMark(id) {
  const blades = svgEl('g', { fill: `url(#${id})`, style: 'stroke:rgba(var(--ch-rose),.45)', 'stroke-width': 0.35 });
  for (let i = 0; i < 8; i++) {
    blades.append(svgEl('path', { d: i % 2 ? ROSE_BLADE_SHORT : ROSE_BLADE_LONG, transform: `rotate(${i * 45})` }));
  }
  const petals = svgEl('g', { style: `${fill('--c-crimson-900')};stroke:var(--c-hot-2)`, 'stroke-width': 0.6 });
  for (let i = 0; i < 5; i++) petals.append(svgEl('path', { d: ROSE_PETAL, transform: `rotate(${i * 72 + 36})` }));
  const bud = svgEl('g', { style: `${fill('--c-crimson-500')};stroke:var(--c-crimson-950)`, 'stroke-width': 0.5 });
  for (let i = 0; i < 3; i++) bud.append(svgEl('path', { d: ROSE_PETAL, transform: `rotate(${i * 120}) scale(.6)` }));
  return svgEl('g', { class: 'fx-sigil__rose' }, [
    svgEl('defs', {}, [
      svgEl('radialGradient', { id, cx: 0, cy: 0, r: 19, gradientUnits: 'userSpaceOnUse' }, [
        stop('0.2', '--c-crimson-700'),
        stop('0.62', '--c-crimson-500'),
        stop('1', '--c-hot-2'),
      ]),
    ]),
    svgEl('g', { transform: 'translate(20 20)' }, [
      blades,
      petals,
      bud,
      svgEl('circle', { r: 2.3, style: `${fill('--c-lava-hi')};stroke:var(--c-surface-1)`, 'stroke-width': 0.8 }),
    ]),
  ]);
}

/**
 * sigil(size) → <svg class="fx-sigil"> (viewBox 40): holds both marks, and the theme tokens
 * --sigil-yinyang / --sigil-rose decide which one shows (the crimson yin-yang with an ember eye
 * and thorn ring for Titan, the bladed rose for every other pack).
 */
export function sigil(size = 28) {
  const svg = decorativeSvg('fx-sigil', '0 0 40 40', size, size);
  svg.append(yinYangMark(nextId('fx-yy')), roseMark(nextId('fx-rose')));
  return svg;
}

/** sparkle(size) → <svg class="fx-spark">: 4-point star in currentColor (default --c-rose). */
export function sparkle(size = 14) {
  const svg = decorativeSvg('fx-spark', '-7 -7 14 14', size, size);
  svg.append(svgEl('path', { d: SPARK_D, fill: 'currentColor' }));
  return svg;
}

/**
 * stickerDisc({ text, size }) → <div class="fx-sticker" aria-hidden="true">
 * Glowing crimson disc with ring text spinning over --dur-sticker, a thorn ring, the centre
 * sigil and three twinkling sparks. Internals scale with the element, so CSS may resize it.
 */
export function stickerDisc({ text = '', size = 152 } = {}) {
  const S = size;
  const c = S / 2;
  const root = document.createElement('div');
  root.className = 'fx-sticker';
  root.setAttribute('aria-hidden', 'true');
  root.style.setProperty('--size', `${S}px`);

  const gid = nextId('fx-disc');
  const disc = decorativeSvg('fx-sticker__disc', `0 0 ${S} ${S}`);
  const ringR = 0.27 * S;
  const ringSegs = circleSegments(c, c, ringR);
  const samp = curveSampler(ringSegs);
  const thorns = svgEl('g', { class: 'fx-sticker__thorns' });
  const count = 18;
  for (let i = 0; i < count; i++) {
    thorns.append(svgEl('path', { d: thornD(samp.at((samp.length * (i + 0.5)) / count), i % 2 ? 1 : -1, i % 3 ? 3.4 : 4.4) }));
  }
  disc.append(
    svgEl('defs', {}, [
      svgEl('radialGradient', { id: gid, cx: '0.5', cy: '0.42', r: '0.6' }, [stop('0', '--c-crimson-700'), stop('1', '--c-crimson-950')]),
    ]),
    svgEl('circle', { cx: c, cy: c, r: c - 1, fill: `url(#${gid})`, style: 'stroke:var(--c-hot-2)', 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }),
    svgEl('circle', { class: 'fx-sticker__hair', cx: c, cy: c, r: f1(0.455 * S) }),
    svgEl('circle', { class: 'fx-sticker__hair', cx: c, cy: c, r: f1(0.325 * S) }),
    svgEl('path', { class: 'fx-sticker__stem', d: segmentsToD(ringSegs) }),
    thorns,
  );
  root.append(disc);

  let label = String(text).trim();
  if (label) {
    if (!/[·•|]$/.test(label)) label += ' ·';
    label += ' ';
    const pid = nextId('fx-ring');
    const r = 0.37 * S;
    const ring = decorativeSvg('fx-sticker__ring', `0 0 ${S} ${S}`);
    const textPath = svgEl('textPath', { href: `#${pid}`, startOffset: '0', textLength: f1(2 * Math.PI * r - 0.5), lengthAdjust: 'spacing' });
    textPath.textContent = label;
    const textEl = svgEl('text', { class: 'fx-sticker__text' }, [textPath]);
    // Keep the trailing separator space so the loop closes evenly.
    textEl.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
    ring.append(
      svgEl('defs', {}, [svgEl('path', { id: pid, d: `M${f1(c)} ${f1(c - r)}a${f1(r)} ${f1(r)} 0 1 1 0 ${f1(2 * r)}a${f1(r)} ${f1(r)} 0 1 1 0 ${f1(-2 * r)}` })]),
      textEl,
    );
    // Two wrappers: the outer spins forever; the inner adds speed on hover without a jump.
    const spin = document.createElement('div');
    spin.className = 'fx-sticker__spin';
    const boost = document.createElement('div');
    boost.className = 'fx-sticker__boost';
    boost.append(ring);
    spin.append(boost);
    root.append(spin);
  }

  const mark = sigil(Math.round(S * 0.38));
  mark.classList.add('fx-sticker__mark');
  root.append(mark);

  [[9, 12, 0.11], [95, 34, 0.085], [77, 95, 0.1]].forEach(([x, y, s], i) => {
    const spark = sparkle(Math.round(S * s));
    spark.classList.add('fx-sticker__spark', 'fx-twinkle');
    spark.style.left = `${x}%`;
    spark.style.top = `${y}%`;
    spark.style.width = spark.style.height = `${s * 100}%`;
    spark.style.animationDelay = `${(-i * 0.8).toFixed(1)}s`;
    root.append(spark);
  });
  return root;
}

/** sprig() → 16px <svg class="eyebrow__sprig">: a stem and three thorns in --c-hot. */
export function sprig() {
  const svg = decorativeSvg('eyebrow__sprig fx-sprig', '0 0 16 16', 16, 16);
  const segs = [[2.5, 13.5, 4.5, 9, 8, 5, 13.5, 2.5]];
  const samp = curveSampler(segs);
  const thorns = [[0.3, -1, 3.1], [0.56, 1, 3.5], [0.8, -1, 2.7]].map(([at, side, sz]) =>
    svgEl('path', { d: thornD(samp.at(samp.length * at), side, sz), fill: 'currentColor' }));
  svg.append(
    svgEl('path', { d: segmentsToD(segs), fill: 'none', stroke: 'currentColor', 'stroke-width': 1.3, 'stroke-linecap': 'round' }),
    ...thorns,
  );
  return svg;
}

/**
 * thornSeam() → <div class="fx-thorn-seam" aria-hidden="true">: a glowing thorn line
 * (CSS tile) pinned across a band's top edge, with a gothic diamond + the sigil at centre.
 */
export function thornSeam() {
  const seam = document.createElement('div');
  seam.className = 'fx-thorn-seam';
  seam.setAttribute('aria-hidden', 'true');
  const gem = document.createElement('span');
  gem.className = 'fx-thorn-seam__gem';
  const diamond = decorativeSvg('fx-thorn-seam__diamond', '0 0 28 28', 28, 28);
  diamond.append(
    svgEl('path', { d: 'M14 0.6 L15.1 2.1 L14 3.4 L12.9 2.1Z M14 27.4 L15.1 25.9 L14 24.6 L12.9 25.9Z', style: fill('--c-hot-2') }),
    svgEl('path', { d: 'M14 3.4 L24.6 14 L14 24.6 L3.4 14Z', style: `${fill('--c-surface-1')};stroke:var(--c-hot-2)`, 'stroke-width': 1 }),
    svgEl('path', { d: 'M14 7 L21 14 L14 21 L7 14Z', fill: 'none', style: 'stroke:rgba(var(--ch-rose),.3)', 'stroke-width': 0.75 }),
  );
  const mark = sigil(12);
  mark.classList.add('fx-thorn-seam__mark');
  gem.append(diamond, mark);
  seam.append(gem);
  return seam;
}
