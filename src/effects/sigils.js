/**
 * Sigils: the crimson yin-yang mark, the rotating sticker disc, sparkles, the eyebrow
 * sprig and the thorn seam. SVG built once from constant path data.
 */
import { svgEl, decorativeSvg, curveSampler, segmentsToD, thornD, SPARK_D } from './thorns.js';

let ids = 0;
const nextId = (prefix) => `${prefix}-${++ids}`;
const f1 = (n) => Math.round(n * 10) / 10;

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

/** yinYang(size) → <svg class="fx-yinyang"> (viewBox 40): crimson/black halves, ember eye, thorn ring. */
export function yinYang(size = 28) {
  const id = nextId('fx-yy');
  const svg = decorativeSvg('fx-yinyang', '0 0 40 40', size, size);
  const thorns = svgEl('g', { fill: '#ff3b6b', transform: 'translate(20 20)' });
  for (let i = 0; i < 10; i++) {
    thorns.append(svgEl('path', { d: 'M0,-14.5 L1.6,-18.5 L-0.6,-14.5Z', transform: `rotate(${i * 36})` }));
  }
  svg.append(
    svgEl('defs', {}, [
      svgEl('linearGradient', { id, x1: '0.3', y1: '0', x2: '0.7', y2: '1' }, [
        svgEl('stop', { offset: '0', 'stop-color': '#ff3b6b' }),
        svgEl('stop', { offset: '1', 'stop-color': '#c8102e' }),
      ]),
    ]),
    thorns,
    svgEl('circle', { cx: 20, cy: 20, r: 14, fill: '#140609' }),
    svgEl('path', { d: 'M20 6 A14 14 0 0 1 20 34 A7 7 0 0 1 20 20 A7 7 0 0 0 20 6Z', fill: `url(#${id})` }),
    svgEl('circle', { cx: 20, cy: 13, r: 2.2, fill: '#ffb000' }),
    svgEl('circle', { cx: 20, cy: 27, r: 2.2, fill: '#140609' }),
    svgEl('circle', { cx: 20, cy: 20, r: 14, fill: 'none', stroke: '#ffd1dc', 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }),
  );
  return svg;
}

/** sparkle(size) → <svg class="fx-spark">: 4-point star in currentColor (default #ffd1dc). */
export function sparkle(size = 14) {
  const svg = decorativeSvg('fx-spark', '-7 -7 14 14', size, size);
  svg.append(svgEl('path', { d: SPARK_D, fill: 'currentColor' }));
  return svg;
}

/**
 * stickerDisc({ text, size }) → <div class="fx-sticker" aria-hidden="true">
 * Glowing crimson disc with ring text spinning over --dur-sticker, a thorn ring, a centre
 * yin-yang and three twinkling sparks. Internals scale with the element, so CSS may resize it.
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
      svgEl('radialGradient', { id: gid, cx: '0.5', cy: '0.42', r: '0.6' }, [
        svgEl('stop', { offset: '0', 'stop-color': '#6b0a18' }),
        svgEl('stop', { offset: '1', 'stop-color': '#1a0306' }),
      ]),
    ]),
    svgEl('circle', { cx: c, cy: c, r: c - 1, fill: `url(#${gid})`, stroke: '#ff3b6b', 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }),
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

  const mark = yinYang(Math.round(S * 0.38));
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
 * (CSS tile) pinned across a band's top edge, with a gothic diamond + yin-yang at centre.
 */
export function thornSeam() {
  const seam = document.createElement('div');
  seam.className = 'fx-thorn-seam';
  seam.setAttribute('aria-hidden', 'true');
  const gem = document.createElement('span');
  gem.className = 'fx-thorn-seam__gem';
  const diamond = decorativeSvg('fx-thorn-seam__diamond', '0 0 28 28', 28, 28);
  diamond.append(
    svgEl('path', { d: 'M14 0.6 L15.1 2.1 L14 3.4 L12.9 2.1Z M14 27.4 L15.1 25.9 L14 24.6 L12.9 25.9Z', fill: '#ff3b6b' }),
    svgEl('path', { d: 'M14 3.4 L24.6 14 L14 24.6 L3.4 14Z', fill: '#140609', stroke: '#ff3b6b', 'stroke-width': 1 }),
    svgEl('path', { d: 'M14 7 L21 14 L14 21 L7 14Z', fill: 'none', stroke: 'rgba(255,209,220,.3)', 'stroke-width': 0.75 }),
  );
  const mark = yinYang(12);
  mark.classList.add('fx-thorn-seam__mark');
  gem.append(diamond, mark);
  seam.append(gem);
  return seam;
}
