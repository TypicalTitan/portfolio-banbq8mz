/**
 * G3 · Tools marquee: an endless, edge-faded row of tools with a pause toggle. The second list is an
 * aria-hidden clone so the -50% loop is seamless; reduced motion (CSS) drops it and wraps the list.
 */

import { h } from '../../lib/dom.js';
import { icon, brand, brandForTag } from '../../lib/icons.js';
import { button, iconButton } from '../../lib/ui.js';
import { sparkle } from '../../effects/index.js';

// One copy of the list must outrun the widest track for the -50% loop to stay seamless, so short
// lists repeat until they have at least this many items.
const MIN_LOOP_ITEMS = 10; // ~260px each → one copy ≥ 2600px, wider than any track

export function renderMarquee(content) {
  const tools = (content.site?.marquee ?? []).map((t) => String(t ?? '').trim()).filter(Boolean);
  if (!tools.length) return null;

  const reps = Math.max(1, Math.ceil(MIN_LOOP_ITEMS / tools.length));
  const list = toolList(tools, reps);
  list.setAttribute('aria-label', 'Tools and technologies');
  const clone = toolList(tools, reps);
  clone.setAttribute('aria-hidden', 'true');

  // Repeats lengthen the loop, so the duration scales with them to keep the speed constant.
  const rail = h('div', { class: 'hm-marquee-rail', style: reps > 1 ? { '--marquee-reps': reps } : null }, list, clone);
  const track = h('div', { class: 'hm-marquee-track' }, rail);

  let userPaused = false;
  let offscreen = false;
  const sync = () => track.classList.toggle('is-paused', userPaused || offscreen);

  const toggle = pauseToggle((paused) => {
    userPaused = paused;
    sync();
  });

  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver((entries) => {
      offscreen = !entries[entries.length - 1].isIntersecting;
      sync();
    });
    io.observe(track);
    // The router re-renders home on every visit; drop this observer once its track has left the page.
    const release = () => {
      if (track.isConnected) return;
      io.disconnect();
      window.removeEventListener('app:route', release);
    };
    window.addEventListener('app:route', release);
  }

  return h('section', { id: 'tools', class: 'section hm-marquee', 'aria-labelledby': 'tools-title' },
    h('div', { class: 'container hm-marquee-head' },
      h('h2', { id: 'tools-title', class: 'hm-marquee-label' }, 'Tools I build with'),
      h('div', { class: 'hm-marquee-actions' },
        toggle,
        content.skills?.some((g) => g?.items?.length) ? button({ label: 'All skills', href: '#skills', variant: 'outline', size: 'sm' }) : null,
      ),
    ),
    track,
  );
}

/** The first copy is what assistive tech reads; repeats are aria-hidden (and dropped with reduced motion). */
function toolList(tools, reps = 1) {
  const names = Array.from({ length: reps }, () => tools).flat();
  return h('ul', { class: 'hm-marquee-list' },
    names.map((name, i) => {
      const key = brandForTag(name);
      const repeat = i >= tools.length;
      return h('li', { class: ['hm-marquee-item', repeat && 'hm-marquee-item--rep'], 'aria-hidden': repeat ? 'true' : null },
        key ? brand(key, { size: 28, className: 'hm-marquee-glyph' }) : null,
        h('span', { class: 'hm-marquee-name' }, name),
        sparkle(14),
      );
    }),
  );
}

/** aria-pressed toggle; the label stays constant and the glyph swaps Pause → Play via CSS. */
function pauseToggle(onChange) {
  const btn = iconButton({
    icon: 'Pause',
    label: 'Pause scrolling tools',
    size: 36,
    className: 'hm-marquee-toggle',
    onClick: (event) => {
      const pressed = event.currentTarget.getAttribute('aria-pressed') !== 'true';
      event.currentTarget.setAttribute('aria-pressed', String(pressed));
      onChange(pressed);
    },
  });
  btn.setAttribute('aria-pressed', 'false');
  const pause = btn.querySelector('svg');
  const size = Number(pause?.getAttribute('width')) || 18;
  pause?.classList.add('hm-marquee-icon-pause');
  btn.append(icon('Play', { size, className: 'hm-marquee-icon-play' }));
  return btn;
}
