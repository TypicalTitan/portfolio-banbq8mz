/**
 * Theme-pack choosers. Both are the same radio group, one option per pack in src/themes.js:
 *   themePicker()  → the desktop nav's Palette button + a popover holding the group
 *   themeOptions() → the group on its own, inline (the mobile drawer)
 * A choice applies at once (cross-faded unless motion is reduced), so arrow keys preview the packs
 * in turn. Every group follows switches made from any other.
 *
 * The popover uses the Popover API (top layer, light dismiss, focus order after the button).
 * Browsers without it get the same panel toggled with `hidden`, closed by Esc and clicks outside.
 */

import { h } from '../lib/dom.js';
import { iconButton } from '../lib/ui.js';
import { onThemeChange, reducedMotion, setThemePack, themePack, themePacks } from '../effects/index.js';

const HAS_POPOVER = typeof HTMLElement !== 'undefined' && Object.hasOwn(HTMLElement.prototype, 'popover');
const GAP = 10; // px between the button and the panel
const PANEL_W = 320; // keep in step with .theme-picker's width in chrome.css
const EDGE = 8; // px the panel keeps from the viewport edges

let seq = 0;

function option(pack, name) {
  const input = h('input', { type: 'radio', name, value: pack.id, class: 'theme-opt__input' });
  input.checked = pack === themePack();
  const [a, b, c] = pack.swatch;
  return h(
    'label',
    { class: 'theme-opt' },
    input,
    h('span', { class: 'theme-opt__swatch', 'aria-hidden': 'true', style: { '--sw-a': a, '--sw-b': b, '--sw-c': c } }),
    h('span', { class: 'theme-opt__text' }, h('span', { class: 'theme-opt__name' }, pack.name), h('span', { class: 'theme-opt__tag' }, pack.tagline)),
  );
}

/** themeOptions({ className }) → <fieldset class="theme-picker__set"> with one radio per pack. */
export function themeOptions({ className = '' } = {}) {
  const name = `theme-pack-${++seq}`;
  const set = h(
    'fieldset',
    { class: ['theme-picker__set', className] },
    h('legend', { class: 'theme-picker__title' }, 'Theme'),
    themePacks().map((pack) => option(pack, name)),
  );
  set.addEventListener('change', (e) => {
    const value = e.target?.value;
    const apply = () => setThemePack(value);
    if (typeof document.startViewTransition === 'function' && !reducedMotion()) {
      document.startViewTransition(apply).ready.catch(() => {}); // a skipped transition still applies
    } else {
      apply();
    }
  });
  onThemeChange((pack) => {
    for (const input of set.querySelectorAll('input')) input.checked = input.value === pack.id;
  });
  return set;
}

/** themePicker() → { button, panel }. Place `button` in the nav bar and `panel` anywhere in the header. */
export function themePicker() {
  const set = themeOptions();
  const panel = h('div', { class: 'theme-picker', id: `theme-picker-${seq}` }, set);
  const button = iconButton({ icon: 'Palette', label: 'Theme', className: 'nav-theme' });
  button.setAttribute('aria-controls', panel.id);
  button.setAttribute('aria-expanded', 'false');

  /* Under the button, right edges aligned, never past either side of the viewport.
     The nav is sticky, so the spot holds while the panel is open. */
  const place = () => {
    const r = button.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const width = Math.min(PANEL_W, vw - EDGE * 2);
    const right = Math.min(Math.max(EDGE, vw - r.right), vw - width - EDGE);
    panel.style.top = `${Math.round(r.bottom + GAP)}px`;
    panel.style.right = `${Math.round(right)}px`;
  };
  const isOpen = () => (HAS_POPOVER ? panel.matches(':popover-open') : !panel.hidden);
  const onResize = () => {
    if (isOpen()) place();
  };
  const opened = (open) => {
    button.setAttribute('aria-expanded', String(open));
    if (open) {
      addEventListener('resize', onResize);
      set.querySelector('input:checked')?.focus({ preventScroll: true });
    } else {
      removeEventListener('resize', onResize);
    }
  };

  if (HAS_POPOVER) {
    panel.popover = 'auto';
    button.popoverTargetElement = panel;
    panel.addEventListener('beforetoggle', (e) => {
      if (e.newState === 'open') place();
    });
    panel.addEventListener('toggle', (e) => opened(e.newState === 'open'));
  } else {
    panel.hidden = true;
    const close = (refocus) => {
      if (panel.hidden) return;
      panel.hidden = true;
      opened(false);
      if (refocus) button.focus({ preventScroll: true });
    };
    button.addEventListener('click', () => {
      if (!panel.hidden) return close(false);
      place();
      panel.hidden = false;
      opened(true);
    });
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close(true);
    });
    document.addEventListener('pointerdown', (e) => {
      if (!panel.contains(e.target) && !button.contains(e.target)) close(false);
    });
  }

  return { button, panel };
}
