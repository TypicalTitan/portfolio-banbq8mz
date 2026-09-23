/**
 * G1 · Hero: the inset lava card with the blackletter handle, real name, tagline, CTAs, a
 * three-shot project collage rising from the bottom edge and the availability sticker.
 */

import { h } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';
import { asset } from '../../lib/format.js';
import { button, glassPill, shot } from '../../lib/ui.js';
import { projectHref } from '../../router.js';
import { mountLava, mountParticles, thornCorners, stickerDisc } from '../../effects/index.js';

const COLLAGE_SLOTS = ['centre', 'left', 'right'];

export function renderHero(content) {
  const person = content.person ?? {};
  const availability = person.availability ?? {};
  const open = availability.open !== false;
  const featured = featuredProjects(content.projects);
  const sticker = open && availability.sticker ? stickerDisc({ text: availability.sticker, size: 152 }) : null;
  // The work CTA points at the first work section that renders; with none it drops out.
  const workHref = featured.length ? '#work' : content.projects?.length ? '#projects' : content.labs?.length ? '#labs' : null;

  // Thorn corners draw themselves in (they register with the reveal observer on creation).
  const card = h('div', { class: ['hm-hero-card', sticker && 'hm-hero-card--sticker'] },
    h('div', { class: 'hm-hero-scrim', 'aria-hidden': 'true' }),
    // Top corners: the project collage rising from the bottom edge would cover a bottom-right vine.
    thornCorners({ size: 220, corners: ['tl', 'tr'] }),
    heroContent(person, open ? availability.label : null, workHref),
    collage(featured),
    sticker,
  );

  // Canvases go in as the card's first children: lava at the back, then embers and far petals,
  // all under the scrim.
  mountLava(card, { preset: 'hero' });
  mountParticles(card, { embers: 'auto', petals: 8, petalLayers: 'far-mid' });

  return h('section', { id: 'top', class: 'hm-hero', 'aria-labelledby': 'hero-title' }, card);
}

function heroContent(person, statusLabel, workHref) {
  const handle = person.handle || person.name || '';
  const resume = person.resume ?? {};
  const meta = [
    person.location && [icon('MapPin', { size: 16 }), person.location],
    person.school && [icon('GraduationCap', { size: 16 }), person.school],
    person.gradYear && [`Class of ${person.gradYear}`],
  ].filter(Boolean);

  return h('div', { class: 'hm-hero-content' },
    statusLabel ? h('p', { class: 'hm-hero-status' }, glassPill(statusLabel, { dot: true })) : null,
    h('h1', { id: 'hero-title', class: 'hm-hero-title' },
      // --chars lets CSS shrink long handles so they never clip on phones.
      h('span', { class: 'blackletter hm-hero-handle', 'data-text': handle, style: { '--chars': [...handle].length || 1 } }, handle),
      person.name && person.name !== handle ? [
        h('span', { class: 'sr-only' }, ' — '),
        h('span', { class: 'hm-hero-realname' }, person.name),
      ] : null,
    ),
    person.tagline ? h('p', { class: 'hm-hero-tagline' }, person.tagline) : null,
    meta.length ? h('ul', { class: 'hm-hero-meta' }, meta.map((parts) => h('li', null, parts))) : null,
    h('div', { class: 'hm-hero-ctas' },
      button({ label: 'View my work', href: workHref, size: 'lg', iconEnd: 'ArrowDown' }),
      resume.href
        ? button({ label: resume.label || 'Résumé', href: asset(resume.href), variant: 'outline', size: 'lg', icon: 'Download', external: true })
        : null,
    ),
  );
}

/** First three featured projects by `order`; they duplicate the Featured rows, so they stay out of the a11y tree. */
function featuredProjects(projects) {
  return (projects ?? [])
    .filter((p) => p?.featured && p.cover?.src)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
    .slice(0, COLLAGE_SLOTS.length);
}

function collage(projects) {
  if (!projects.length) return null;
  return h('div', { class: 'hm-hero-collage', 'aria-hidden': 'true' },
    projects.map((p, i) => {
      const lead = i === 0;
      return h('a', {
        class: ['hm-hero-shot', `hm-hero-shot--${COLLAGE_SLOTS[i]}`],
        href: projectHref(p.slug),
        tabindex: '-1',
        'aria-hidden': 'true',
      }, shot(p.cover, {
        frame: p.frame || 'window',
        label: p.slug,
        loading: lead ? 'eager' : 'lazy',
        fetchpriority: lead ? 'high' : null,
      }));
    }),
  );
}
