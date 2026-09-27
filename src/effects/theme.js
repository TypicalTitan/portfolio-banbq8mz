/**
 * Active theme pack (src/themes.js). index.html's pre-paint script sets <html data-theme> from
 * the viewer's saved choice or site.theme; this module reads that, switches it, remembers it and
 * tells the canvases to repaint. CSS follows the attribute on its own.
 */
import { DEFAULT_THEME, THEME_PACKS } from '../themes.js';

const STORE_KEY = 'theme-pack';
const listeners = new Set();
const byId = new Map(THEME_PACKS.map((pack) => [pack.id, pack]));

const root = typeof document === 'undefined' ? null : document.documentElement;
let current = byId.get(root?.dataset.theme) ?? byId.get(DEFAULT_THEME);

function syncMeta() {
  const meta = typeof document === 'undefined' ? null : document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', current.bg);
}
syncMeta();

/** The active pack object. */
export function themePack() {
  return current;
}

/** Every pack, in picker order. */
export function themePacks() {
  return THEME_PACKS;
}

/** Switches to pack `id` (unknown ids are ignored) and remembers it for this viewer. */
export function setThemePack(id) {
  const next = byId.get(id);
  if (!next || next === current) return;
  current = next;
  if (current.id === DEFAULT_THEME) delete root.dataset.theme;
  else root.dataset.theme = current.id;
  try {
    localStorage.setItem(STORE_KEY, current.id);
  } catch {
    /* storage blocked: the pack still applies to this visit */
  }
  syncMeta();
  for (const cb of [...listeners]) cb(current);
}

/** Calls `cb(pack)` after every switch. Returns unsubscribe(). */
export function onThemeChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
