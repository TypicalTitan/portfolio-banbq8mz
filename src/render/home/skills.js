/**
 * G9 · Skills: the Riot-style slanted fan of skill groups. ≥1100px it is an arched row of skewed
 * cards; 720–1099px (or any width with more than five groups) a scroll-snap strip driven by the
 * arrow pair in the section head; below 720px a stack of clip-path slants. Each item shows its
 * level (level: null shows none) and how many projects/labs use it — but only when counts tell a
 * story (at least 3 items have one, or some item is used twice); a lone "1 use" reads as a glitch.
 */

import { h } from '../../lib/dom.js';
import { icon, brand, brandForTag } from '../../lib/icons.js';
import { sectionHead } from '../../lib/ui.js';
import { reducedMotion } from '../../effects/index.js';

// Glyphs are drawn in CSS (filled ● / half ◐ / ring ○) so all three share one size and baseline.
const LEVELS = {
  core: { label: 'Core — use weekly', sr: 'core, use weekly' },
  working: { label: 'Working knowledge', sr: 'working knowledge' },
  learning: { label: 'Learning now', sr: 'learning now' },
};
const THEMES = ['lava', 'dusk', 'crimson', 'violet', 'ember'];
const FAN_ID = 'skills-fan';
const FAN_MAX = 5; // more groups than this switch the ≥1100 arch to the scroll strip

export function renderSkills(content) {
  const groups = (content.skills ?? []).filter((g) => g?.items?.length);
  if (!groups.length) return null;

  const copy = content.site?.sections?.skills ?? {};
  const counter = usageCounter(content);
  const counts = groups.flatMap((g) => g.items).map((i) => counter(typeof i === 'string' ? i : i?.name));
  const showUses = counts.filter((n) => n > 0).length >= 3 || counts.some((n) => n >= 2);
  const uses = showUses ? counter : () => 0;
  const centre = (groups.length - 1) / 2;

  const strip = groups.length > FAN_MAX;
  const fan = h('ul', {
    class: ['hm-fan', strip && 'hm-fan--strip', groups.length === 1 && 'hm-fan--solo'],
    id: FAN_ID,
    style: { '--dmax': centre },
  }, groups.map((group, i) => fanCard(group, Math.abs(i - centre), uses)));

  return h('section', { id: 'skills', class: ['section', 'hm-skills', strip && 'hm-skills--strip'], 'aria-labelledby': 'skills-title' },
    h('div', { class: 'container' },
      sectionHead({
        eyebrow: copy.eyebrow ?? null,
        title: copy.title || 'Skills',
        accent: copy.accent ?? null,
        blurb: copy.blurb ?? null,
        id: 'skills-title',
        action: arrowControls(fan),
      }),
      h('div', { class: 'hm-fan-wrap reveal' }, fan),
      // The key only earns its place when some item actually shows a level glyph.
      groups.some((g) => g.items.some((item) => LEVELS[item?.level])) ? legend() : null,
    ),
  );
}

function fanCard(group, d, uses) {
  const theme = THEMES.includes(group.theme) ? group.theme : 'crimson';
  const items = group.items.map((item) => (typeof item === 'string' ? { name: item } : item)).filter((item) => item?.name);
  const brands = [...new Set(items.map((item) => brandForTag(item.name)).filter(Boolean))];

  return h('li', { class: ['hm-fan-card', `hm-fan-card--${theme}`, 'slant'], style: { '--d': d, '--skew': '-6deg' } },
    h('div', { class: 'slant__unskew hm-fan-body' },
      icon(group.icon || 'Layers', { size: 180, strokeWidth: 1, className: 'hm-fan-watermark' }),
      h('span', { class: 'hm-fan-icon' }, icon(group.icon || 'Layers', { size: 20 })),
      h('h3', { class: 'hm-fan-title' }, group.group),
      group.blurb ? h('p', { class: 'hm-fan-blurb' }, group.blurb) : null,
      h('ul', { class: 'hm-fan-items' }, items.map((item) => itemRow(item, uses(item.name)))),
      brands.length
        ? h('span', { class: 'hm-fan-brands', 'aria-hidden': 'true' }, brands.map((key) => brand(key, { size: 20 })))
        : null,
    ),
  );
}

function itemRow(item, count) {
  const level = LEVELS[item.level];
  return h('li', { class: 'hm-fan-item' },
    h('span', { class: 'hm-fan-name' },
      level ? levelGlyph(item.level) : null,
      h('span', null, item.name, level ? h('span', { class: 'sr-only' }, ` (${level.sr})`) : null),
    ),
    count ? h('span', { class: 'hm-fan-uses' }, `${count} ${count === 1 ? 'use' : 'uses'}`) : null,
  );
}

function legend() {
  return h('p', { class: 'hm-skills-legend' },
    Object.entries(LEVELS).map(([key, level], i) => {
      const item = h('span', { class: 'hm-skills-legend-item' }, levelGlyph(key), level.label);
      return i
        ? h('span', { class: 'hm-skills-legend-pair' }, h('span', { class: 'hm-skills-legend-sep', 'aria-hidden': 'true' }, '·'), item)
        : item;
    }),
  );
}

function levelGlyph(key) {
  return h('span', { class: ['hm-fan-level', `hm-fan-level--${key}`], 'aria-hidden': 'true' });
}

/** "Uses" = projects whose `tags` plus labs whose `skills` contain the item name (case-insensitive). */
function usageCounter(content) {
  const norm = (value) => String(value ?? '').trim().toLowerCase();
  const sets = [
    ...(content.projects ?? []).map((p) => p?.tags),
    ...(content.labs ?? []).map((lab) => lab?.skills),
  ].map((list) => new Set((list ?? []).map(norm)));
  return (name) => {
    const key = norm(name);
    return sets.reduce((total, set) => total + (set.has(key) ? 1 : 0), 0);
  };
}

/** Previous/next buttons for the scroll strip (CSS hides them elsewhere). */
function arrowControls(fan) {
  const arrow = (dir, label, name) => h('button', {
    type: 'button',
    class: 'hm-skills-arrow',
    'aria-label': label,
    'aria-controls': FAN_ID,
    onClick: (event) => {
      if (event.currentTarget.getAttribute('aria-disabled') === 'true') return;
      const card = fan.querySelector('.hm-fan-card');
      const gap = parseFloat(getComputedStyle(fan).columnGap) || 0;
      const step = card ? card.offsetWidth + gap : fan.clientWidth * 0.8;
      fan.scrollBy({ left: dir * step, behavior: reducedMotion() ? 'auto' : 'smooth' });
    },
  }, icon(name, { size: 22 }));

  const prev = arrow(-1, 'Previous skill group', 'ArrowLeft');
  const next = arrow(1, 'Next skill group', 'ArrowRight');

  const setDisabled = (btn, off) => {
    if (off) btn.setAttribute('aria-disabled', 'true');
    else btn.removeAttribute('aria-disabled');
  };
  const update = () => {
    const max = fan.scrollWidth - fan.clientWidth;
    setDisabled(prev, fan.scrollLeft <= 1);
    setDisabled(next, max <= 1 || fan.scrollLeft >= max - 1);
  };

  setDisabled(prev, true);
  fan.addEventListener('scroll', update, { passive: true });
  if (typeof ResizeObserver === 'function') {
    const ro = new ResizeObserver(update);
    ro.observe(fan);
    const release = () => {
      if (fan.isConnected) return;
      ro.disconnect();
      window.removeEventListener('app:route', release);
    };
    window.addEventListener('app:route', release);
  }

  return h('div', { class: 'hm-skills-arrows' },
    prev,
    h('span', { class: 'hm-skills-arrows-divider', 'aria-hidden': 'true' }),
    next,
  );
}
