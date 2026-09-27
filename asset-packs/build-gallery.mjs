#!/usr/bin/env node
/**
 * node asset-packs/build-gallery.mjs  — rebuilds asset-packs/index.html, a browsable gallery of
 * every pack. Run it after adding or editing assets; open index.html in a browser (no server needed).
 *
 * Every SVG's source is embedded in the page, so "Copy SVG" works offline. With --fragment <file>
 * it also writes the same page without the <!doctype>/<html> wrapper (for hosts that add their own).
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PACK_ORDER = ['ruinous', 'voracious', 'thornbound', 'bloodhaze'];
const ACCENT = { ruinous: '#e0183a', voracious: '#b62af0', thornbound: '#e0b445', bloodhaze: '#ff2e7a' };
const CATEGORIES = [
  ['corners', 'Corners', 'Drawn for the top-left corner. Mirror for the others: transform: scaleX(-1) (top-right), scaleY(-1) (bottom-left), scale(-1) (bottom-right).'],
  ['dividers', 'Dividers', 'Section breaks. Set the width and let the height follow (height: auto), or stretch with preserveAspectRatio="none" on the inline SVG.'],
  ['frames', 'Frames', 'Card frame overlay with an empty centre. As a border: border: 80px solid transparent; border-image: url(frame-card.svg) 80 stretch.'],
  ['plates', 'Plates', 'Button and tag backgrounds. The ends carry the detail and the middle is plain: border-image: url(button-plate.svg) 0 40 fill / 0 40px stretch.'],
  ['emblems', 'Emblems', 'Signature sigils and a badge ring. The -mono sigil is a single colour (currentColor): inline it, or use it as a CSS mask to tint it any colour.'],
  ['blades', 'Blades', 'Blade silhouettes and a crossed-blades emblem.'],
  ['flora', 'Flora', 'Roses, loose petals and a thorn vine.'],
  ['icons', 'Icons', 'Small marks built for 16–24px: list bullets, sparkles and an inline separator.'],
  ['patterns', 'Patterns', 'Seamless tiles on a transparent ground, shown repeated. Use as background-image with background-repeat: repeat.'],
  ['backgrounds', 'Backgrounds', 'Full-bleed 1920×1080 backdrops with a calm centre for text. Use background-size: cover.'],
  ['avatar', 'Avatar decoration', 'Animated overlay for a round avatar, 288×288 with the avatar filling the middle 240px (Discord proportions). Also in the folder: a WebM with alpha (lighter), a still PNG and a preview video.'],
  ['film', 'Film overlays', 'Layer these over any photo for the hazy red film look: clouds (screen) for the double exposure, then light leak, dust and grain (screen). bloodhaze/demo.html has the full recipe with the gradient map.'],
];
// Raster files each category shows (other formats sit beside them in the folder).
const RASTER = { avatar: (f) => f === 'avatar-decoration.apng', film: (f) => f.endsWith('.png') };
/** Width and height from a PNG/APNG header. */
const pngSize = (buf) => [buf.readUInt32BE(16), buf.readUInt32BE(20)];

const packs = PACK_ORDER.filter((id) => {
  try { return statSync(join(HERE, id)).isDirectory(); } catch { return false; }
}).map((id) => {
  const palette = JSON.parse(readFileSync(join(HERE, id, 'palette.json'), 'utf8'));
  const assets = [];
  for (const [cat] of CATEGORIES) {
    let files = [];
    try { files = readdirSync(join(HERE, id, cat)).filter((f) => (RASTER[cat] ? RASTER[cat](f) : f.endsWith('.svg'))).sort(); } catch { continue; }
    for (const f of files) {
      if (!f.endsWith('.svg')) {
        const path = join(HERE, id, cat, f);
        const buf = readFileSync(path);
        const [w, h] = pngSize(buf);
        // Raster assets are linked, not embedded: src is relative to index.html.
        assets.push({ cat, name: f.replace(/\.[a-z]+$/, ''), path: relative(dirname(HERE), path), src: relative(HERE, path), w, h, kb: +(buf.length / 1024).toFixed(1), svg: null });
        continue;
      }
      const path = join(HERE, id, cat, f);
      const svg = readFileSync(path, 'utf8').trim();
      const vb = svg.match(/viewBox="([^"]+)"/)?.[1]?.split(/[\s,]+/).map(Number) ?? [0, 0, 100, 100];
      assets.push({ cat, name: f.replace(/\.svg$/, ''), path: relative(dirname(HERE), path), w: vb[2], h: vb[3], kb: +(Buffer.byteLength(svg) / 1024).toFixed(1), svg });
    }
  }
  return { id, name: palette.name, tagline: palette.tagline, colors: palette.colors, accent: ACCENT[id] ?? '#e8e0dc', assets };
});

const total = packs.reduce((n, p) => n + p.assets.length, 0);
const data = JSON.stringify({ packs, categories: CATEGORIES.map(([id, label, note]) => ({ id, label, note })) }).replace(/</g, '\\u003c');

const page = `<title>Atakhan Asset Packs</title>
<meta name="description" content="Sharp, cyberpunk-blade SVG asset packs (Ruinous, Voracious, Thornbound) and Bloodhaze, an animated avatar decoration with film overlays.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Grenze+Gotisch:wght@500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
:root {
  color-scheme: dark;
  --ground: #0b090a;
  --panel: #141112;
  --panel-2: #1c1719;
  --line: #2e272a;
  --line-2: #463c40;
  --text: #eee7e3;
  --muted: #aba19c;
  --faint: #7a706c;
  --light-ground: #ece6e1;
  --focus: #ff9aae;
  --display: 'Grenze Gotisch', 'UnifrakturCook', Georgia, serif;
  --sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', Consolas, monospace;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--ground); color: var(--text); font: 400 15px/1.55 var(--sans); }
.wrap { max-width: 1320px; margin: 0 auto; padding-inline: max(16px, 3vw); padding-block: 40px 80px; }
h1, h2, h3 { margin: 0; text-wrap: balance; }
button { font: inherit; color: inherit; }
:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }

.masthead { display: grid; gap: 12px; margin-bottom: 32px; }
.masthead h1 { font: 700 clamp(2.6rem, 1.8rem + 3.4vw, 4.6rem)/0.95 var(--display); letter-spacing: -0.01em;
  background: linear-gradient(180deg, #fff3ea 0%, #f2b8b0 30%, #e0183a 62%, #6a0913 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.masthead p { margin: 0; max-width: 64ch; color: var(--muted); }
.masthead .meta { font: 500 12px/1.4 var(--mono); color: var(--faint); letter-spacing: 0.02em; }

.packs { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 330px), 1fr)); gap: 16px; margin-bottom: 28px; }
.pack { display: grid; gap: 12px; padding: 18px 18px 16px; border: 1px solid var(--line); background: var(--panel);
  clip-path: polygon(22px 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%, 0 22px); }
.pack header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.pack h2 { font: 700 2rem/1 var(--display); color: var(--accent); }
.pack .count { font: 500 12px/1 var(--mono); color: var(--faint); }
.pack .tag { margin: 0; color: var(--muted); font-size: 14px; }
.swatches { display: flex; flex-wrap: wrap; gap: 6px; }
.swatch { width: 26px; height: 26px; padding: 0; border: 1px solid rgba(255,255,255,0.14); background: var(--c); cursor: pointer;
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%); }
.swatch:hover { transform: scale(1.15); }
.palette-note { margin: 0; font: 400 12px/1.4 var(--mono); color: var(--faint); min-height: 1.4em; }

.toolbar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; display: flex; flex-wrap: wrap; gap: 10px 20px; align-items: center;
  margin: 0 calc(-1 * max(16px, 3vw)) 28px; padding: 12px max(16px, 3vw); background: rgba(11, 9, 10, 0.92); border-block: 1px solid var(--line);
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px); }
.group { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; }
.group > span { font: 600 11px/1 var(--sans); letter-spacing: 0.12em; text-transform: uppercase; color: var(--faint); margin-right: 4px; }
.chip { padding: 7px 12px; border: 1px solid var(--line-2); background: transparent; color: var(--muted); font-size: 13px; font-weight: 500; cursor: pointer;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px); }
.chip:hover { color: var(--text); border-color: var(--faint); }
.chip[aria-pressed="true"] { background: var(--text); border-color: var(--text); color: var(--ground); }

section.cat { margin-bottom: 44px; }
section.cat > header { display: grid; gap: 4px; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--line); }
section.cat h2 { font: 700 1.9rem/1 var(--display); }
section.cat p { margin: 0; max-width: 90ch; color: var(--muted); font-size: 13.5px; }
section.cat code { font: 500 12px var(--mono); color: var(--text); }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.grid.wide { grid-template-columns: minmax(0, 1fr); }
@media (max-width: 900px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) { .grid { grid-template-columns: minmax(0, 1fr); } }

.tile { display: grid; grid-template-rows: auto 1fr; border: 1px solid var(--line); background: var(--panel); min-width: 0; }
.tile[hidden] { display: none; }
.stage { position: relative; display: grid; place-items: center; min-height: 190px; padding: 18px; background: var(--void); overflow: hidden; }
.stage img { display: block; max-width: 100%; max-height: 240px; height: auto; }
.stage .tiled { width: 100%; height: 190px; background-repeat: repeat; }
.stage.icon img { width: 24px; height: 24px; }
.stage.icon .big { width: 72px; height: 72px; }
.stage.icon { gap: 18px; grid-auto-flow: column; }
.wide .stage img { max-height: none; width: 100%; }
body.bg-light .stage { background: var(--light-ground); }
body.bg-check .stage { background: repeating-conic-gradient(#232022 0 25%, #1a1718 0 50%) 0 0 / 20px 20px; }
.mono-ink { color: var(--accent); }
body.bg-light .mono-ink { color: #2a1418; }
.info { display: grid; gap: 10px; padding: 12px 14px 14px; border-top: 1px solid var(--line); }
.name { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: 4px 10px; }
.name b { font-weight: 600; }
.name b i { font-style: normal; color: var(--accent); }
.name small { font: 400 12px/1.3 var(--mono); color: var(--faint); font-variant-numeric: tabular-nums; }
.path { font: 400 11.5px/1.4 var(--mono); color: var(--faint); overflow-wrap: anywhere; }
.actions { display: flex; flex-wrap: wrap; gap: 8px; }
.act { padding: 6px 11px; border: 1px solid var(--line-2); background: var(--panel-2); font-size: 12.5px; font-weight: 600; cursor: pointer; }
.act:hover { border-color: var(--accent); }
.act.done { border-color: var(--accent); color: var(--accent); }
.fallback { width: 100%; min-height: 90px; font: 11px/1.4 var(--mono); background: var(--ground); color: var(--muted); border: 1px solid var(--line-2); }
.empty { color: var(--muted); }
@media (prefers-reduced-motion: reduce) { .swatch:hover { transform: none; } }
</style>

<div class="wrap">
  <header class="masthead">
    <h1>Atakhan Asset Packs</h1>
    <p>Three packs of sharp, cyberpunk-blade SVGs in the spirit of Atakhan: faceted monoblades with neon edges, chrome and circuitry, and low-poly roses. Every pack has the same pieces, so you can pick a corner from one, a divider from another, or keep to a single pack.</p>
    <p class="meta">${packs.length} packs · ${total} SVGs · files live in asset-packs/&lt;pack&gt;/&lt;category&gt;/</p>
  </header>

  <div class="packs" id="packs"></div>

  <div class="toolbar" role="region" aria-label="Filters">
    <div class="group" id="f-pack" role="group" aria-label="Pack"><span>Pack</span></div>
    <div class="group" id="f-cat" role="group" aria-label="Category"><span>Show</span></div>
    <div class="group" id="f-bg" role="group" aria-label="Preview background"><span>Behind</span></div>
  </div>

  <main id="cats"></main>
</div>

<script>
const DATA = ${data};
const state = { pack: 'all', cat: 'all', bg: 'dark' };
try { Object.assign(state, JSON.parse(localStorage.getItem('asset-gallery') || '{}')); } catch {}
const save = () => { try { localStorage.setItem('asset-gallery', JSON.stringify(state)); } catch {} };
const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v); else if (k === 'style') n.style.cssText = v; else n.setAttribute(k, v);
  }
  n.append(...kids.filter((x) => x != null));
  return n;
};
const uri = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

async function copy(text, btn, label) {
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = 'Copied'; btn.classList.add('done');
    setTimeout(() => { btn.textContent = label; btn.classList.remove('done'); }, 1400);
  } catch {
    // Clipboard refused: show the text selected so it can be copied by hand.
    const box = btn.closest('.info').querySelector('.fallback') || btn.closest('.info').appendChild(el('textarea', { class: 'fallback', readonly: '', 'aria-label': 'SVG source' }));
    box.value = text; box.focus(); box.select();
  }
}

/* Pack cards with palettes (tap a swatch to copy its hex). */
const packsEl = document.getElementById('packs');
for (const p of DATA.packs) {
  const note = el('p', { class: 'palette-note', text: 'Tap a colour to copy its hex' });
  const sw = el('div', { class: 'swatches' }, ...Object.entries(p.colors).map(([name, hex]) =>
    el('button', { class: 'swatch', style: '--c:' + hex, title: name + ' ' + hex, 'aria-label': 'Copy ' + name + ' ' + hex, onclick: async () => {
      try { await navigator.clipboard.writeText(hex); note.textContent = 'Copied ' + name + ' ' + hex; } catch { note.textContent = name + ' ' + hex; }
    } })));
  packsEl.append(el('article', { class: 'pack', style: '--accent:' + p.accent },
    el('header', {}, el('h2', { text: p.name }), el('span', { class: 'count', text: p.assets.length + ' assets' })),
    el('p', { class: 'tag', text: p.tagline }), sw, note));
}

/* Filters */
function chips(id, key, options) {
  const box = document.getElementById(id);
  const btns = options.map(([value, label]) => el('button', { class: 'chip', type: 'button', 'aria-pressed': String(state[key] === value), text: label, onclick: () => {
    state[key] = value; save(); btns.forEach((b, i) => b.setAttribute('aria-pressed', String(options[i][0] === value))); apply();
  } }));
  box.append(...btns);
}
chips('f-pack', 'pack', [['all', 'All'], ...DATA.packs.map((p) => [p.id, p.name])]);
chips('f-cat', 'cat', [['all', 'Everything'], ...DATA.categories.filter((c) => DATA.packs.some((p) => p.assets.some((a) => a.cat === c.id))).map((c) => [c.id, c.label])]);
chips('f-bg', 'bg', [['dark', 'Pack dark'], ['light', 'Light'], ['check', 'Checker']]);

/* Category sections: each asset shown from every pack side by side. */
const cats = document.getElementById('cats');
const sections = [];
for (const c of DATA.categories) {
  const names = [...new Set(DATA.packs.flatMap((p) => p.assets.filter((a) => a.cat === c.id).map((a) => a.name)))];
  if (!names.length) continue;
  const wide = c.id === 'dividers' || c.id === 'backgrounds';
  const grid = el('div', { class: 'grid' + (wide ? ' wide' : '') });
  for (const name of names) {
    for (const p of DATA.packs) {
      const a = p.assets.find((x) => x.cat === c.id && x.name === name);
      if (!a) continue;
      const src = a.svg ? uri(a.svg) : a.src;
      let stage;
      if (c.id === 'patterns' || (c.id === 'film' && name === 'grain')) {
        stage = el('div', { class: 'stage' }, el('div', { class: 'tiled', role: 'img', 'aria-label': p.name + ' ' + name + ' tiled', style: "background-image:url('" + src + "');background-size:" + (a.svg ? a.w : a.w / 2) + 'px ' + (a.svg ? a.h : a.h / 2) + 'px' }));
      } else if (c.id === 'icons') {
        stage = el('div', { class: 'stage icon' }, el('img', { src, alt: p.name + ' ' + name + ' at 24px', width: '24', height: '24' }), el('img', { src, alt: '', class: 'big', width: '72', height: '72' }));
      } else if (name.endsWith('-mono')) {
        // Mono assets use currentColor: inline them so they pick up the text colour.
        const holder = el('div', { class: 'mono-ink', role: 'img', 'aria-label': p.name + ' ' + name, style: 'width:min(100%,' + Math.min(a.w, 220) + 'px)' });
        holder.innerHTML = a.svg.replace(/<svg/, '<svg style="width:100%;height:auto;display:block"');
        stage = el('div', { class: 'stage' }, holder);
      } else {
        stage = el('div', { class: 'stage' }, el('img', { src, alt: p.name + ' ' + name, width: String(a.w), height: String(a.h), loading: 'lazy' }));
      }
      stage.style.setProperty('--void', p.colors.void);
      const info = el('div', { class: 'info' },
        el('div', { class: 'name' }, el('b', {}, el('i', { text: p.name }), ' ' + name), el('small', { text: a.w + '×' + a.h + ' · ' + a.kb + ' KB' })),
        el('div', { class: 'path', text: a.path }),
        el('div', { class: 'actions' },
          a.svg ? el('button', { class: 'act', type: 'button', text: 'Copy SVG', onclick: (e) => copy(a.svg, e.currentTarget, 'Copy SVG') }) : null,
          el('button', { class: 'act', type: 'button', text: 'Copy path', onclick: (e) => copy(a.path, e.currentTarget, 'Copy path') })));
      const tile = el('article', { class: 'tile', style: '--accent:' + p.accent }, stage, info);
      tile.dataset.pack = p.id;
      grid.append(tile);
    }
  }
  const sec = el('section', { class: 'cat', id: c.id, 'aria-labelledby': 'h-' + c.id },
    el('header', {}, el('h2', { id: 'h-' + c.id, text: c.label }), el('p', { text: c.note })), grid);
  sec.dataset.cat = c.id;
  sections.push(sec);
  cats.append(sec);
}

function apply() {
  document.body.classList.toggle('bg-light', state.bg === 'light');
  document.body.classList.toggle('bg-check', state.bg === 'check');
  for (const sec of sections) {
    sec.hidden = state.cat !== 'all' && sec.dataset.cat !== state.cat;
    for (const t of sec.querySelectorAll('.tile')) t.hidden = state.pack !== 'all' && t.dataset.pack !== state.pack;
  }
}
apply();
</script>
`;

const doc = `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${page.replace(/(<style>[\s\S]*?<\/style>)/, '$1\n</head>\n<body>')}\n</body>\n</html>\n`;
writeFileSync(join(HERE, 'index.html'), doc);
const fi = process.argv.indexOf('--fragment');
if (fi > 0 && process.argv[fi + 1]) writeFileSync(process.argv[fi + 1], page);
console.log(`asset-packs/index.html: ${packs.length} packs, ${total} assets`);
