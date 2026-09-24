#!/usr/bin/env node
/**
 * npm run check  — validates src/content.js before you build or deploy.
 *
 *  • every image / PDF / CSV path in content.js exists under public/
 *  • paths are relative (no leading "/", which breaks GitHub Pages sub-paths)
 *  • required keys are present and enum values are spelled right
 *  • slugs and ids are unique; categories, award → project links and accents resolve
 *  • image width/height match the real file's aspect ratio (prevents layout shift)
 *  • every skill / tool / tag name has a logo in src/lib/tag-glyphs.js, each mapped logo file exists
 *    in src/assets/logos/, and every logo file follows the format rules (viewBox, <title>, currentColor)
 *
 * Exits with code 1 when anything is wrong. Warnings (placeholders still in place,
 * odd-looking values) never fail the check unless you run:  npm run check -- --strict
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const STRICT = process.argv.includes('--strict');

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

let content;
try {
  content = (await import(pathToFileURL(join(ROOT, 'src', 'content.js')).href)).default;
} catch (e) {
  // A dynamic import() never says WHERE the syntax error is; `node --check` prints file:line + a caret.
  const where = spawnSync(process.execPath, ['--check', join(ROOT, 'src', 'content.js')], { encoding: 'utf8' });
  const detail = (where.stderr || '').trim().split('\n').filter((line) => !/^\s+at |^Node\.js v/.test(line)).join('\n  ');
  console.error(`\n✗ Could not load src/content.js — it has a syntax error or a bad export.\n\n  ${detail || e.message}\n`);
  console.error('  Common causes:');
  console.error('   • a missing comma at the end of the previous line');
  console.error("   • an apostrophe inside '…' text — write \"Things I've built\" or use a curly ’ instead\n");
  process.exit(1);
}
if (!content || typeof content !== 'object') {
  console.error('\n✗ src/content.js must `export default` the content object.\n');
  process.exit(1);
}

/* ── Vocabularies (keep in sync with the spec) ────────────────────────────── */
// Icon names come straight from the LUCIDE map in src/lib/icons.js, so adding an icon there is enough.
const LUCIDE = new Set(
  (readFileSync(join(ROOT, 'src', 'lib', 'icons.js'), 'utf8').match(/const LUCIDE = \{([^}]*)\}/)?.[1] ?? '')
    .split(/[\s,]+/).filter(Boolean),
);
const THEMES = ['lava', 'dusk', 'violet', 'ember'];
const SKILL_THEMES = ['lava', 'dusk', 'crimson', 'violet', 'ember'];
const FRAMES = ['window', 'plate'];
const BADGES = ['Featured', 'Award', 'Team', 'Solo', 'New', 'In progress'];
const VERDICTS = ['supported', 'partial', 'refuted'];
const XP_TYPES = ['internship', 'job', 'volunteer', 'research'];
const AWARD_KINDS = ['award', 'certification'];
const LEVELS = ['core', 'working', 'learning'];
const AWARD_STATUSES = ['earned', 'planned'];
const SOCIALS = ['github', 'linkedin', 'youtube', 'devpost', 'itchio', 'email'];
const SECTION_KEYS = ['work', 'projects', 'labs', 'experience', 'about', 'skills', 'education', 'leadership', 'kindWords', 'contact'];

/* ── Small helpers ────────────────────────────────────────────────────────── */
const isStr = (v) => typeof v === 'string' && v.trim() !== '';
const isArr = Array.isArray;
const DATE = /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/;

function need(obj, keys, where) {
  if (!obj || typeof obj !== 'object') { err(where, 'is missing'); return false; }
  for (const k of keys) if (!(k in obj)) err(where, `missing required key "${k}"`);
  return true;
}
function str(obj, key, where, { optional = false } = {}) {
  const v = obj?.[key];
  if (optional && (v === null || v === undefined || v === '')) return;
  if (!isStr(v)) err(`${where}.${key}`, optional ? 'must be text or null' : 'must be non-empty text');
}
function oneOf(v, list, where, { optional = false } = {}) {
  if (optional && (v === null || v === undefined)) return;
  if (!list.includes(v)) err(where, `"${v}" is not one of ${list.map((x) => `'${x}'`).join(' | ')}${optional ? ' (or null)' : ''}`);
}
function date(v, where, { nullable = false } = {}) {
  if (nullable && v === null) return;
  if (typeof v !== 'string' || !DATE.test(v)) err(where, `"${v}" must be 'YYYY-MM' or 'YYYY-MM-DD'${nullable ? ' (or null for "Present")' : ''}`);
}
/**
 * start + end. `unknown: true` also accepts BOTH null ("dates unknown" → hidden); a lone null start
 * is still an error, because end: null on its own means "Present".
 */
function range(obj, where, { unknown = false } = {}) {
  if (unknown && obj?.start === null && obj?.end === null) return;
  if (unknown && obj?.start === null) {
    err(`${where}.start`, `is null but end is "${obj.end}" — give a start date, or set BOTH start and end to null to hide the dates`);
    return;
  }
  date(obj?.start, `${where}.start`);
  date(obj?.end, `${where}.end`, { nullable: true });
  if (isStr(obj?.start) && isStr(obj?.end) && obj.end < obj.start) err(where, `end (${obj.end}) is before start (${obj.start})`);
}
function year(v, where, { nullable = false } = {}) {
  if (nullable && v === null) return;
  if (!Number.isInteger(v) || v < 1900 || v > 2100) err(where, `${JSON.stringify(v)} must be a year number like 2027${nullable ? ' (or null to hide it)' : ''}`);
}
function strList(v, where, { what = 'item' } = {}) {
  if (!isArr(v)) { err(where, 'must be a list ([] hides it)'); return; }
  v.forEach((x, i) => { if (!isStr(x)) err(`${where}[${i}]`, `each ${what} must be non-empty text`); });
}
function icon(v, where) {
  if (!LUCIDE.has(v)) err(where, `unknown icon "${v}" — use a name from the lucide whitelist in src/lib/icons.js (e.g. Bot, Code, Zap)`);
}
function url(v, where, { optional = true } = {}) {
  if (optional && (v === null || v === undefined || v === '')) return;
  if (typeof v !== 'string' || !/^(https?:\/\/|mailto:)/.test(v)) err(where, `"${v}" must be a full https:// link (or null to hide it)`);
  else if (/your-handle|example\.(com|org)/i.test(v)) warn(where, `"${v}" is still a placeholder link`);
}
function unique(list, key, where) {
  const seen = new Map();
  (list || []).forEach((item, i) => {
    const v = item?.[key];
    if (seen.has(v)) err(`${where}[${i}].${key}`, `"${v}" is used twice (also ${where}[${seen.get(v)}]) — it must be unique`);
    else seen.set(v, i);
  });
}
function slug(v, where) {
  if (typeof v !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(v)) err(where, `"${v}" must be lowercase-with-dashes (letters, numbers, single dashes)`);
}
function accent(title, acc, where) {
  if (acc === null || acc === undefined || acc === '') return;
  if (typeof title !== 'string' || !title.includes(acc)) err(where, `accent "${acc}" must appear exactly (case-sensitive) inside "${title}"`);
}

/* ── Local files ──────────────────────────────────────────────────────────── */
let assetCount = 0;
const checkedFiles = new Set();

/** Reads intrinsic pixel size from SVG/PNG/JPEG/GIF/WebP headers; null if unknown. */
function imageSize(file) {
  const ext = extname(file).toLowerCase();
  const buf = readFileSync(file);
  if (ext === '.svg') {
    const tag = buf.toString('utf8').match(/<svg\b[^>]*>/i)?.[0] || '';
    const w = +(tag.match(/\swidth="([\d.]+)(px)?"/)?.[1] || 0), h = +(tag.match(/\sheight="([\d.]+)(px)?"/)?.[1] || 0);
    const vb = tag.match(/viewBox="[\d.\s-]*?([\d.]+)\s+([\d.]+)"/);
    if (w && h) return { w, h, viewBox: !!vb };
    if (vb) return { w: +vb[1], h: +vb[2], viewBox: true };
    return null;
  }
  if (ext === '.png' && buf.length > 24) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (ext === '.gif' && buf.length > 10) return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  if (ext === '.webp' && buf.length > 30) {
    const kind = buf.toString('ascii', 12, 16);
    if (kind === 'VP8X') return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
    if (kind === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (kind === 'VP8L') { const b = buf.readUInt32LE(21); return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 }; }
  }
  if (ext === '.jpg' || ext === '.jpeg') {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

/** A path that must exist under public/. Returns the absolute file path or null. */
function file(p, where, { optional = false, kind = 'file' } = {}) {
  if (optional && (p === null || p === undefined || p === '')) return null;
  if (typeof p !== 'string' || !p.trim()) { err(where, `${kind} path is missing`); return null; }
  if (/^https?:\/\//.test(p)) { warn(where, `"${p}" is an external URL — local files in public/ are faster and never break`); return null; }
  if (p.startsWith('/')) { err(where, `"${p}" starts with "/" — remove it (write "${p.replace(/^\/+/, '')}") or the site breaks on GitHub Pages`); return null; }
  if (p.startsWith('public/')) { err(where, `"${p}" should not include "public/" — write "${p.slice(7)}"`); return null; }
  if (p.includes('\\')) { err(where, `"${p}" uses backslashes — use forward slashes "/"`); return null; }
  const abs = join(PUBLIC, p);
  assetCount++;
  if (!existsSync(abs) || !statSync(abs).isFile()) { err(where, `file not found: public/${p}`); return null; }
  // Windows and macOS ignore letter case; GitHub Pages does not. Compare every segment exactly.
  const real = realCase(p);
  if (real && real !== p) { err(where, `"${p}" doesn't match the real file name "${real}" — capital letters matter on GitHub Pages`); return null; }
  checkedFiles.add(abs);
  return abs;
}

/** The on-disk spelling of a public/ path (segment by segment), or null if a segment can't be read. */
function realCase(p) {
  let dir = PUBLIC;
  const out = [];
  for (const part of p.split('/')) {
    let names;
    try { names = readdirSync(dir); } catch { return null; }
    const hit = names.includes(part) ? part : names.find((n) => n.toLowerCase() === part.toLowerCase());
    if (!hit) return null;
    out.push(hit);
    dir = join(dir, hit);
  }
  return out.join('/');
}

const WEB_IMAGE = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'];
const MAX_BYTES = 500_000;
const ratioName = (r) => (r > 1.7 ? '16:9' : r > 1.4 ? '16:10' : r > 1.2 ? '4:3' : r > 0.95 ? 'square' : r > 0.7 ? '3:4 portrait' : 'tall portrait');

/** `ratio`: the shape this slot displays (e.g. 1.6 for 16:10 covers); files >10% off are cropped, so warn. */
function image(img, where, { optional = false, ratio = null } = {}) {
  if (optional && (img === null || img === undefined)) return;
  if (!need(img, ['src', 'alt', 'width', 'height'], where)) return;
  const ext = isStr(img.src) ? extname(img.src).toLowerCase() : '';
  if (isStr(img.src) && !/^https?:\/\//.test(img.src) && !WEB_IMAGE.includes(ext)) {
    err(`${where}.src`, ext === '.heic' || ext === '.heif'
      ? `"${ext}" photos don't show in Chrome/Edge — export as JPG (iPhone: Settings → Camera → Formats → Most Compatible)`
      : `"${ext || 'no extension'}" isn't a web image format — use .jpg, .png, .webp, .avif, .gif or .svg`);
    return;
  }
  const abs = file(img.src, `${where}.src`, { kind: 'image' });
  if (abs) {
    const bytes = statSync(abs).size;
    if (bytes > MAX_BYTES) warn(`${where}.src`, `is ${(bytes / 1e6).toFixed(1)} MB — resize to about 1600 px wide and compress it (e.g. squoosh.app); aim for under 300 KB`);
  }
  if (!isStr(img.alt)) err(`${where}.alt`, 'describe what the image shows (screen readers read this)');
  else if (/^(image|picture|photo|screenshot) of\b/i.test(img.alt)) warn(`${where}.alt`, `skip "${img.alt.split(' ').slice(0, 2).join(' ')}…" — just describe the content`);
  for (const k of ['width', 'height']) if (!Number.isInteger(img[k]) || img[k] <= 0) err(`${where}.${k}`, 'must be a positive whole number of pixels');
  if (!abs || !Number.isInteger(img.width) || !Number.isInteger(img.height)) return;
  if (ratio && Math.abs(img.width / img.height - ratio) / ratio > 0.1) {
    warn(where, `is ${ratioName(img.width / img.height)} (${img.width}×${img.height}) but this spot shows ${ratioName(ratio)} landscape — it will be heavily cropped; crop the file to ${ratioName(ratio)} first`);
  }
  const size = imageSize(abs);
  if (!size) {
    if (ext === '.avif') warn(`${where}.src`, "couldn't read the AVIF's size — double-check width/height by hand");
    return;
  }
  if (ext === '.svg' && !size.viewBox) warn(`${where}.src`, 'SVG has no viewBox, so it may not scale cleanly');
  if (ext !== '.svg' && size.w > 3200) warn(`${where}.src`, `is ${size.w} px wide — nothing on the page shows it wider than ~1600 px; resize it to save loading time`);
  const want = img.width / img.height, got = size.w / size.h;
  if (Math.abs(want - got) / got > 0.02) {
    err(where, `width/height (${img.width}×${img.height}) don't match the file's shape (${size.w}×${size.h}); use the file's real size to avoid layout jumps`);
  }
}

/**
 * Section ids the home page renders for this content, so stat links can be checked. Mirrors
 * src/lib/sections.js (FEATURED_LIMIT and the rule that folds the grid into the featured rows)
 * and each renderer's "empty list hides the section" rule.
 */
const FEATURED_LIMIT = 3;
let anchorsCache = null;
function renderedAnchors() {
  if (anchorsCache) return anchorsCache;
  const list = (v) => (isArr(v) ? v.filter(Boolean) : []);
  const projects = list(content.projects);
  const grid = projects.length > 0 && !(projects.every((p) => p.featured) && projects.length <= FEATURED_LIMIT);
  const ids = ['top', 'about', 'contact', 'proof'];
  if (list(content.site?.marquee).length) ids.push('tools');
  if (projects.some((p) => p.featured)) ids.push('work');
  if (grid) ids.push('projects');
  if (list(content.labs).length) ids.push('labs');
  if (list(content.experience).length) ids.push('experience');
  if (list(content.skills).some((g) => g.items?.length)) ids.push('skills');
  if (list(content.education).length || list(content.awards).length) ids.push('education');
  if (list(content.awards).length) ids.push('awards');
  if (list(content.activities).length) ids.push('leadership');
  if (list(content.testimonials).length) ids.push('kind-words');
  return (anchorsCache = new Set(ids));
}

/* ── Checks ───────────────────────────────────────────────────────────────── */
need(content, ['site', 'person', 'stats', 'education', 'projects', 'labs', 'experience', 'skills', 'awards', 'activities', 'testimonials'], 'content');

// site
const site = content.site || {};
if (need(site, ['title', 'description', 'copyrightYear', 'updated', 'currently', 'marquee', 'projectCategories', 'sections'], 'site')) {
  str(site, 'title', 'site'); str(site, 'description', 'site'); str(site, 'currently', 'site', { optional: true });
  if (!Number.isInteger(site.copyrightYear)) err('site.copyrightYear', 'must be a year number like 2026');
  date(site.updated, 'site.updated');
  if (!isArr(site.marquee)) err('site.marquee', 'must be a list ([] hides the tools strip)');
  else site.marquee.forEach((m, i) => { if (!isStr(m)) err(`site.marquee[${i}]`, 'must be non-empty text'); });
  if (!isArr(site.projectCategories) || !site.projectCategories.length) err('site.projectCategories', 'must list at least one category');
  const sec = site.sections || {};
  for (const k of SECTION_KEYS) if (!sec[k]) err(`site.sections.${k}`, 'is missing');
  for (const k of SECTION_KEYS.filter((k) => !['about', 'contact'].includes(k))) {
    if (!sec[k]) continue;
    str(sec[k], 'title', `site.sections.${k}`);
    accent(sec[k].title, sec[k].accent, `site.sections.${k}.accent`);
  }
  if (sec.contact) { str(sec.contact, 'titleLead', 'site.sections.contact'); str(sec.contact, 'titleAccent', 'site.sections.contact'); }
}

// person
const person = content.person || {};
if (need(person, ['name', 'handle', 'tagline', 'pitch', 'bio', 'photo', 'location', 'school', 'gradYear', 'focus', 'availability', 'email', 'responseTime', 'resume', 'strengths', 'socials'], 'person')) {
  for (const k of ['name', 'handle', 'tagline', 'pitch', 'location', 'school', 'focus', 'email']) str(person, k, 'person');
  str(person, 'responseTime', 'person', { optional: true }); // null hides the contact response-time line
  if ('interests' in person) strList(person.interests, 'person.interests', { what: 'interest' });
  const shown = String(person.handle || person.name || '');
  if ([...shown].length > 14) warn('person.handle', `"${shown}" is ${[...shown].length} characters — handles over ~14 are scaled down on phones to fit`);
  str(person, 'pronouns', 'person', { optional: true });
  accent(person.pitch, site.sections?.about?.accent, 'site.sections.about.accent (inside person.pitch)');
  if (!isArr(person.bio) || !person.bio.length) err('person.bio', 'needs at least one paragraph');
  image(person.photo, 'person.photo', { optional: true }); // null hides the avatar
  if (person.photo?.src === 'img/portrait.svg') warn('person.photo', 'still the placeholder portrait — add your own photo');
  year(person.gradYear, 'person.gradYear', { nullable: true }); // null hides "Class of …" and "Graduating"
  if (need(person.availability, ['open', 'label', 'season', 'detail', 'sticker'], 'person.availability')) {
    const av = person.availability;
    if (typeof av.open !== 'boolean') err('person.availability.open', 'must be true or false');
    // The pill copy is only required when the pills show; the sticker is independent of `open`.
    if (av.open) for (const k of ['label', 'season']) str(av, k, 'person.availability');
    for (const k of ['label', 'season', 'detail', 'sticker']) str(av, k, 'person.availability', { optional: true });
  }
  if (isStr(person.email) && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(person.email)) err('person.email', `"${person.email}" doesn't look like an email address`);
  if (/@example\./.test(person.email || '')) warn('person.email', 'still the placeholder address');
  // null hides every Résumé button.
  if (person.resume !== null && need(person.resume, ['href', 'label', 'fileInfo'], 'person.resume')) {
    const abs = file(person.resume.href, 'person.resume.href', { kind: 'résumé' });
    if (abs && readFileSync(abs).includes('Placeholder')) warn('person.resume.href', 'public/' + person.resume.href + ' is still the placeholder PDF');
  }
  if (!isArr(person.strengths) || person.strengths.length !== 5) err('person.strengths', `must have exactly 5 items (has ${isArr(person.strengths) ? person.strengths.length : 0})`);
  if (!isArr(person.socials)) err('person.socials', 'must be a list');
  else person.socials.forEach((s, i) => {
    const w = `person.socials[${i}]`;
    if (!need(s, ['id', 'label', 'url'], w)) return;
    oneOf(s.id, SOCIALS, `${w}.id`);
    if (s.id === 'email') { if (!/^[^@\s]+@[^@\s]+$/.test(String(s.url).replace(/^mailto:/, ''))) err(`${w}.url`, 'use an email address'); }
    else url(s.url, `${w}.url`, { optional: false });
  });
}

// stats
if (content.stats !== null && content.stats !== undefined) {
  if (!isArr(content.stats) || content.stats.length !== 4) err('stats', 'must be null (automatic) or a list of exactly 4 stats');
  else content.stats.forEach((s, i) => {
    if (!need(s, ['value', 'label'], `stats[${i}]`)) return;
    if (s.value === null || s.value === undefined || String(s.value).trim() === '') err(`stats[${i}].value`, 'must be text like "3"');
    str(s, 'label', `stats[${i}]`);
    const href = s.href;
    if (href === null || href === undefined || href === '') return;
    if (typeof href !== 'string' || !href.startsWith('#')) err(`stats[${i}].href`, `"${href}" must be an in-page link like '#experience' (or null)`);
    else if (!href.startsWith('#/') && !renderedAnchors().has(href.slice(1))) {
      err(`stats[${i}].href`, `"${href}" points at a section that isn't on the page — use one of ${[...renderedAnchors()].map((a) => `'#${a}'`).join(', ')}`);
    }
  });
}

// education
(content.education || []).forEach((e, i) => {
  const w = `education[${i}]`;
  if (!need(e, ['school', 'location', 'program', 'start', 'end', 'coursework'], w)) return;
  str(e, 'school', w); str(e, 'program', w, { optional: true }); str(e, 'location', w, { optional: true });
  range(e, w, { unknown: true });
  str(e, 'status', w, { optional: true }); // e.g. 'In progress' — shown where the dates would be
  if (e.showGpa && e.gpa && !isStr(e.gpa.unweighted)) err(`${w}.gpa.unweighted`, "must be text like '3.92'");
  if (e.honors && !isArr(e.honors)) err(`${w}.honors`, 'must be a list');
  if (e.showGpa && !e.gpa) err(`${w}.showGpa`, 'is true but gpa is null — set showGpa: false or add the GPA');
  if (!isArr(e.coursework)) err(`${w}.coursework`, 'must be a list');
});

// projects
const projects = content.projects || [];
const slugs = new Set(projects.map((p) => p?.slug));
unique(projects, 'slug', 'projects');
projects.forEach((p, i) => {
  const w = `projects[${i}]${isStr(p?.slug) ? ` (${p.slug})` : ''}`;
  if (!need(p, ['slug', 'title', 'subtitle', 'category', 'year', 'featured', 'order', 'badges', 'icon', 'theme', 'frame', 'role', 'team', 'duration', 'summary', 'cover', 'tags', 'links', 'metrics', 'writeup', 'skills', 'gallery'], w)) return;
  slug(p.slug, `${w}.slug`);
  for (const k of ['title', 'subtitle', 'summary']) str(p, k, w);
  for (const k of ['role', 'duration', 'context']) str(p, k, w, { optional: true }); // null hides
  if (!site.projectCategories?.includes(p.category)) err(`${w}.category`, `"${p.category}" is not listed in site.projectCategories`);
  year(p.year, `${w}.year`, { nullable: true });
  if (typeof p.featured !== 'boolean') err(`${w}.featured`, 'must be true or false');
  if (typeof p.order !== 'number') err(`${w}.order`, 'must be a number (1 = first)');
  (p.badges || []).forEach((b, j) => oneOf(b, BADGES, `${w}.badges[${j}]`));
  icon(p.icon, `${w}.icon`);
  oneOf(p.theme, THEMES, `${w}.theme`);
  oneOf(p.frame, FRAMES, `${w}.frame`);
  // team: null = unknown, and no "Solo" / "Team of N" is shown.
  if (p.team !== null && need(p.team, ['size', 'members'], `${w}.team`)) {
    if (!Number.isInteger(p.team.size) || p.team.size < 1) err(`${w}.team.size`, 'must be 1 or more');
    if (!isArr(p.team.members)) err(`${w}.team.members`, 'must be a list of names');
    else if (p.team.members.length !== p.team.size) warn(`${w}.team`, `size is ${p.team.size} but ${p.team.members.length} members are listed`);
  }
  image(p.cover, `${w}.cover`, { ratio: 1.6 });
  if (!isArr(p.tags) || !p.tags.length) err(`${w}.tags`, 'needs at least one tag');
  if (need(p.links, ['demo', 'repo', 'video'], `${w}.links`)) for (const k of ['demo', 'repo', 'video']) url(p.links[k], `${w}.links.${k}`);
  if (!isArr(p.metrics) || p.metrics.length > 4) err(`${w}.metrics`, 'must be a list of up to 4 items ([] hides the stats strip)');
  else if (p.metrics.length === 1) warn(`${w}.metrics`, 'one metric looks lonely in the stats strip — 2–4 read best ([] hides it)');
  if (isArr(p.metrics)) p.metrics.forEach((m, j) => { if (need(m, ['value', 'unit', 'label'], `${w}.metrics[${j}]`) && !isStr(String(m.value))) err(`${w}.metrics[${j}].value`, 'must be text'); });
  const gallery = isArr(p.gallery) ? p.gallery : [];
  if (!isArr(p.gallery)) err(`${w}.gallery`, 'must be a list ([] hides it)');
  gallery.forEach((g, j) => { image(g, `${w}.gallery[${j}]`, { ratio: g?.wide ? 2.4 : 1.6 }); if (g && !isStr(g.caption)) warn(`${w}.gallery[${j}].caption`, 'a short caption helps'); });
  const wu = p.writeup;
  if (need(wu, ['problem', 'process', 'outcome'], `${w}.writeup`)) {
    if (!isArr(wu.problem)) err(`${w}.writeup.problem`, 'must be a list of paragraphs ([] hides the section)');
    if (!isArr(wu.outcome) || !wu.outcome.length) err(`${w}.writeup.outcome`, 'needs at least one paragraph');
    // Optional renamed section headings, e.g. { process: 'The parts', outcome: 'Day to day' }.
    if (wu.headings != null) {
      if (typeof wu.headings !== 'object' || isArr(wu.headings)) err(`${w}.writeup.headings`, 'must be an object like { process: "The parts" }');
      else for (const [k, v] of Object.entries(wu.headings)) {
        if (!['problem', 'process', 'outcome', 'lessons'].includes(k)) err(`${w}.writeup.headings.${k}`, 'is not a section — use problem, process, outcome or lessons');
        else if (!isStr(v)) err(`${w}.writeup.headings.${k}`, 'must be non-empty text');
      }
    }
    if (need(wu.process, ['intro', 'steps'], `${w}.writeup.process`)) {
      (wu.process.steps || []).forEach((s, j) => {
        const sw = `${w}.writeup.process.steps[${j}]`;
        if (!need(s, ['title', 'body', 'image'], sw)) return;
        if (s.image !== null && !(Number.isInteger(s.image) && s.image >= 0 && s.image < gallery.length)) {
          err(`${sw}.image`, `must be null or a gallery index 0–${gallery.length - 1} (got ${s.image})`);
        }
      });
    }
    if (wu.lessons && !isArr(wu.lessons)) err(`${w}.writeup.lessons`, 'must be a list');
    if (wu.process && !isArr(wu.process.steps)) err(`${w}.writeup.process.steps`, 'must be a list ([] shows the intro only)');
  }
  if (!isArr(p.skills)) err(`${w}.skills`, 'must be a list');
});
if (projects.length && !projects.some((p) => p?.featured)) warn('projects', 'no project has featured: true, so the Featured section and hero collage are hidden');
const usedCategories = new Set(projects.map((p) => p?.category));
(site.projectCategories || []).forEach((c, i) => { if (!usedCategories.has(c)) warn(`site.projectCategories[${i}]`, `"${c}" has no projects, so it gets no filter pill`); });

// labs
const labs = content.labs || [];
unique(labs, 'slug', 'labs');
labs.forEach((l, i) => {
  const w = `labs[${i}]${isStr(l?.slug) ? ` (${l.slug})` : ''}`;
  if (!need(l, ['slug', 'title', 'subject', 'course', 'labNumber', 'date', 'partners', 'duration', 'icon', 'cover', 'objective', 'hypothesis', 'verdict', 'materials', 'method', 'results', 'figures', 'conclusion', 'errors', 'improvements', 'skills', 'files'], w)) return;
  slug(l.slug, `${w}.slug`);
  for (const k of ['title', 'subject', 'course', 'duration', 'objective', 'hypothesis']) str(l, k, w);
  str(l, 'instructor', w, { optional: true });
  if (l.labNumber !== null && !Number.isInteger(l.labNumber)) err(`${w}.labNumber`, 'must be a whole number or null');
  date(l.date, `${w}.date`);
  icon(l.icon, `${w}.icon`);
  oneOf(l.verdict, VERDICTS, `${w}.verdict`);
  image(l.cover, `${w}.cover`, { ratio: 16 / 9 });
  if ('featured' in l && typeof l.featured !== 'boolean') err(`${w}.featured`, 'must be true or false');
  if (!isArr(l.partners)) err(`${w}.partners`, 'must be a list ([] for solo)');
  if (need(l.method, ['summary', 'steps'], `${w}.method`) && !isArr(l.method.steps)) err(`${w}.method.steps`, 'must be a list');
  if (need(l.results, ['summary', 'keyValues', 'table'], `${w}.results`)) {
    const kv = l.results.keyValues;
    if (!isArr(kv) || kv.length < 1 || kv.length > 3) err(`${w}.results.keyValues`, 'must have 1–3 items (the first is the headline result)');
    else kv.forEach((k, j) => need(k, ['value', 'unit', 'uncertainty', 'label', 'note'], `${w}.results.keyValues[${j}]`));
    const t = l.results.table;
    if (t !== null && need(t, ['caption', 'columns', 'rows'], `${w}.results.table`)) {
      const n = isArr(t.columns) ? t.columns.length : 0;
      (t.columns || []).forEach((c, j) => need(c, ['label', 'unit', 'numeric'], `${w}.results.table.columns[${j}]`));
      (t.rows || []).forEach((r, j) => { if (!isArr(r) || r.length !== n) err(`${w}.results.table.rows[${j}]`, `must have ${n} cells (one per column)`); });
    }
  }
  (l.figures || []).forEach((f, j) => image(f, `${w}.figures[${j}]`, { ratio: 16 / 9 }));
  for (const k of ['materials', 'conclusion', 'errors', 'improvements', 'skills']) if (!isArr(l[k])) err(`${w}.${k}`, 'must be a list');
  if (need(l.files, ['report', 'data'], `${w}.files`)) {
    const rep = file(l.files.report, `${w}.files.report`, { optional: true, kind: 'report' });
    file(l.files.data, `${w}.files.data`, { optional: true, kind: 'data' });
    if (rep && readFileSync(rep).includes('Placeholder')) warn(`${w}.files.report`, `public/${l.files.report} is still the placeholder PDF`);
  }
});

if (labs.filter((l) => l?.featured === true).length > 1) warn('labs', 'more than one lab has featured: true — only the first one is shown large on the home page');

// experience
const experience = content.experience || [];
unique(experience, 'id', 'experience');
experience.forEach((x, i) => {
  const w = `experience[${i}]${isStr(x?.id) ? ` (${x.id})` : ''}`;
  if (!need(x, ['id', 'role', 'org', 'orgUrl', 'type', 'location', 'start', 'end', 'summary', 'logo', 'achievements', 'skills', 'quote'], w)) return;
  slug(x.id, `${w}.id`);
  for (const k of ['role', 'org']) str(x, k, w);
  str(x, 'summary', w, { optional: true });
  str(x, 'location', w, { optional: true });
  oneOf(x.type, XP_TYPES, `${w}.type`, { optional: true }); // null hides the type chip
  range(x, w, { unknown: true }); // both null → no date pill, listed after the dated roles
  url(x.orgUrl, `${w}.orgUrl`);
  image(x.logo, `${w}.logo`, { optional: true });
  if (!isArr(x.achievements)) err(`${w}.achievements`, 'must be a list');
  else if (x.achievements.length > 6) warn(`${w}.achievements`, `only the first 6 of ${x.achievements.length} are shown`);
  if (!isArr(x.skills)) err(`${w}.skills`, 'must be a list ([] hides it)');
  if (x.quote !== null && need(x.quote, ['text', 'name', 'title'], `${w}.quote`)) str(x.quote, 'text', `${w}.quote`);
});

// skills
const skills = content.skills || [];
unique(skills, 'id', 'skills');
skills.forEach((g, i) => {
  const w = `skills[${i}]${isStr(g?.id) ? ` (${g.id})` : ''}`;
  if (!need(g, ['id', 'group', 'icon', 'theme', 'items'], w)) return;
  icon(g.icon, `${w}.icon`);
  oneOf(g.theme, SKILL_THEMES, `${w}.theme`);
  if (!isArr(g.items) || !g.items.length) err(`${w}.items`, 'needs at least one item');
  (g.items || []).forEach((it, j) => {
    if (!need(it, ['name', 'level'], `${w}.items[${j}]`)) return;
    str(it, 'name', `${w}.items[${j}]`);
    oneOf(it.level, LEVELS, `${w}.items[${j}].level`, { optional: true }); // null shows no level glyph
  });
});
if (skills.length && (skills.length < 3 || skills.length > 5)) warn('skills', `the skills fan is designed for 4–5 groups (has ${skills.length})`);

// Skill / tool / tag logos: every name the site shows with a glyph should have an entry in
// src/lib/tag-glyphs.js (unmapped names still render, with the generic tag.svg), every entry must
// name a file in src/assets/logos/, and every logo file must follow the format rules in the README.
{
  const { TAG_GLYPHS, TAG_FALLBACK, tagGlyphSpec } = await import(pathToFileURL(join(ROOT, 'src', 'lib', 'tag-glyphs.js')).href);
  const LOGO_DIR = join(ROOT, 'src', 'assets', 'logos');
  const logoFiles = existsSync(LOGO_DIR) ? readdirSync(LOGO_DIR).filter((f) => extname(f).toLowerCase() === '.svg') : [];
  const logoKeys = new Set(logoFiles.map((f) => f.slice(0, -4)));
  const LOGO_KEY = /^[a-z0-9]+(-[a-z0-9]+)*$/;

  for (const file of logoFiles) {
    const where = `src/assets/logos/${file}`;
    const key = file.slice(0, -4);
    if (!LOGO_KEY.test(key)) err(where, 'file names must be lower-case kebab-case (e.g. claude-code.svg), with a lower-case .svg extension');
    const svg = readFileSync(join(LOGO_DIR, file), 'utf8');
    const root = svg.match(/<svg\b[^>]*>/)?.[0] ?? '';
    const attr = (name) => root.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
    if (!root) { err(where, 'is not an SVG file (no <svg> element)'); continue; }
    if (attr('xmlns') !== 'http://www.w3.org/2000/svg') err(where, 'the <svg> needs xmlns="http://www.w3.org/2000/svg"');
    const box = (attr('viewBox') ?? '').trim().split(/[\s,]+/).map(Number);
    if (box.length !== 4 || box.some((n) => !Number.isFinite(n)) || box[2] <= 0 || box[3] <= 0) err(where, 'the <svg> needs a viewBox="x y width height"');
    if (!/<title>[^<]+<\/title>/.test(svg)) err(where, 'needs a <title> with the product / concept name');
    const line = attr('fill') === 'none';
    if (line ? attr('stroke') !== 'currentColor' : attr('fill') !== 'currentColor') {
      err(where, 'the <svg> needs fill="currentColor" (filled mark) or fill="none" stroke="currentColor" (line glyph)');
    }
    const colour = svg.match(/\s(?:fill|stroke|stop-color|color)="(?!none"|currentColor")[^"]*"|(?:fill|stroke)\s*:\s*(?!none|currentColor)[^;"]+/i);
    if (colour) err(where, `hard-coded colour ${colour[0].trim()} — use currentColor so the logo takes the site's colour`);
    if (/<(script|foreignObject|image)\b|\son\w+=|href="(?!#)/i.test(svg)) err(where, 'must not contain scripts, event handlers, embedded images or external links');
  }

  const used = new Set([TAG_FALLBACK, ...SOCIALS.filter((id) => id !== 'email')]);
  for (const [name, key] of Object.entries(TAG_GLYPHS)) {
    used.add(key);
    if (!logoKeys.has(key)) err(`tag-glyphs.js "${name}"`, `no logo file src/assets/logos/${key}.svg — add the file or fix the key`);
  }
  if (!logoKeys.has(TAG_FALLBACK)) err('tag-glyphs.js TAG_FALLBACK', `no logo file src/assets/logos/${TAG_FALLBACK}.svg`);
  for (const id of SOCIALS) {
    if (id !== 'email' && !logoKeys.has(id)) err('src/assets/logos', `no logo file ${id}.svg for the "${id}" social link`);
  }
  for (const key of logoKeys) {
    if (!used.has(key)) warn(`src/assets/logos/${key}.svg`, 'is not used — map a name to it in src/lib/tag-glyphs.js, or delete it');
  }

  const list = (v) => (isArr(v) ? v.filter(Boolean) : []);
  const shown = [
    ...list(content.site?.marquee).map((n, i) => [n, `site.marquee[${i}]`]),
    ...skills.flatMap((g, i) => list(g?.items).map((it, j) => [it?.name, `skills[${i}].items[${j}]`])),
    ...list(content.experience).flatMap((x, i) => list(x?.skills).map((n, j) => [typeof n === 'string' ? n : n?.name, `experience[${i}].skills[${j}]`])),
    ...list(content.projects).flatMap((p, i) => [
      ...list(p?.tags).map((n, j) => [n, `projects[${i}].tags[${j}]`]),
      ...list(p?.skills).map((n, j) => [typeof n === 'string' ? n : n?.name, `projects[${i}].skills[${j}]`]),
    ]),
    ...list(content.labs).flatMap((l, i) => list(l?.skills).map((n, j) => [n, `labs[${i}].skills[${j}]`])),
  ];
  for (const [name, where] of shown) {
    if (isStr(name) && !tagGlyphSpec(name)) warn(where, `"${name}" has no glyph mapping, so it shows the generic tag.svg — add it to src/lib/tag-glyphs.js`);
  }
}

// awards
(content.awards || []).forEach((a, i) => {
  const w = `awards[${i}]`;
  if (!need(a, ['kind', 'title', 'issuer', 'date', 'detail', 'project', 'url'], w)) return;
  oneOf(a.kind, AWARD_KINDS, `${w}.kind`);
  oneOf(a.status ?? 'earned', AWARD_STATUSES, `${w}.status`); // missing = 'earned'
  str(a, 'title', w); str(a, 'issuer', w, { optional: true }); str(a, 'detail', w, { optional: true });
  date(a.date, `${w}.date`, { nullable: true });
  if (a.status === 'planned' && a.date) warn(`${w}.date`, 'planned items show a "Planned" tag instead of a date, so this date is not displayed');
  if (a.project !== null && !slugs.has(a.project)) err(`${w}.project`, `"${a.project}" doesn't match any project slug`);
  url(a.url, `${w}.url`);
});

// activities
(content.activities || []).forEach((a, i) => {
  const w = `activities[${i}]`;
  if (!need(a, ['role', 'org', 'start', 'end', 'description', 'icon'], w)) return;
  str(a, 'role', w); str(a, 'org', w); range(a, w); icon(a.icon, `${w}.icon`);
});

// testimonials
(content.testimonials || []).forEach((t, i) => {
  const w = `testimonials[${i}]`;
  if (need(t, ['quote', 'name', 'role', 'relationship'], w)) { str(t, 'quote', w); str(t, 'name', w); }
});

// Plain text only: flag anything that looks like HTML, and the template's fictional school.
// (The TypicalTitan handle itself is fine — it's the site owner's real display name.)
const TEMPLATE_IDENTITY = /Northgate/i;
const identityHits = [];
(function scan(v, where) {
  if (typeof v === 'string') {
    if (/<\/?[a-z][^>]*>/i.test(v)) warn(where, 'looks like HTML — content is plain text and tags will show literally');
    if (TEMPLATE_IDENTITY.test(v) && !['content.person.name', 'content.person.email'].includes(where)) identityHits.push(where.replace(/^content\./, ''));
    return;
  }
  if (isArr(v)) v.forEach((x, i) => scan(x, `${where}[${i}]`));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) scan(x, `${where}.${k}`);
})(content, 'content');

if (identityHits.length) {
  const shown = identityHits.slice(0, 6).join(', ');
  warn('content', `${identityHits.length} fields still mention the template's placeholder school (Northgate): ${shown}${identityHits.length > 6 ? ', …' : ''}`);
}

/* ── Report ───────────────────────────────────────────────────────────────── */
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
if (warnings.length) {
  console.warn(`\n${plural(warnings.length, 'warning')}:`);
  for (const w of warnings) console.warn(`  ! ${w}`);
}
if (errors.length) {
  console.error(`\n✗ content.js has ${plural(errors.length, 'problem')}:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('\nFix these in src/content.js (or add the missing files under public/), then run `npm run check` again.\n');
  process.exit(1);
}
if (STRICT && warnings.length) {
  console.error(`\n✗ --strict: ${plural(warnings.length, 'warning')} must be fixed before publishing.\n`);
  process.exit(1);
}
console.log(`\n✓ content.js OK — ${plural(projects.length, 'project')}, ${plural(labs.length, 'lab')}, ${plural(experience.length, 'role')}, ${plural(checkedFiles.size, 'file')} in public/ verified.\n`);
