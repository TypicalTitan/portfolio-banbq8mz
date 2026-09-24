/**
 * G1 · Hero: the inset lava card with the blackletter handle, real name, tagline, CTAs, a
 * project collage rising from the bottom edge (one centred shot, a balanced pair, or a centre
 * shot flanked by two) and the rotating sticker disc.
 */

import { h } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';
import { asset } from '../../lib/format.js';
import { button, glassPill, shot } from '../../lib/ui.js';
import { FEATURED_LIMIT, featuredProjects, hasFeatured, hasLabs, projectsAnchor } from '../../lib/sections.js';
import { projectHref, sectionHref } from '../../router.js';
import { mountLava, mountParticles, thornCorners, stickerDisc } from '../../effects/index.js';

// Slot names by how many featured shots there are: a lone shot is centred, two stand as a
// balanced pair either side of the centre line, three are centre + flanks.
const COLLAGE_SLOTS = {
  1: ['centre'],
  2: ['pair-left', 'pair-right'],
  3: ['centre', 'left', 'right'],
};

export function renderHero(content) {
  const person = content.person ?? {};
  const availability = person.availability ?? {};
  const open = availability.open === true;
  const featured = featuredProjects(content.projects, FEATURED_LIMIT).filter((p) => p.cover?.src);
  // The sticker is decorative copy, not an availability claim, so it renders whenever it has text.
  const stickerText = typeof availability.sticker === 'string' ? availability.sticker.trim() : '';
  const sticker = stickerText ? stickerDisc({ text: availability.sticker, size: 152 }) : null;
  // The work CTA points at the first work section that renders; with none it drops out.
  const work = hasFeatured(content) ? 'work' : projectsAnchor(content) ?? (hasLabs(content) ? 'labs' : null);
  const workHref = work ? sectionHref(work) : null;

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
      // Secondary CTA: the résumé, or (with none) a way to reach the contact banner.
      resume.href
        ? button({ label: resume.label || 'Résumé', href: asset(resume.href), variant: 'outline', size: 'lg', icon: 'Download', external: true })
        : button({ label: 'Get in touch', href: sectionHref('contact'), variant: 'outline', size: 'lg', icon: 'Mail' }),
    ),
  );
}

/** The featured shots duplicate the Featured rows, so the collage stays out of the a11y tree. */
function collage(projects) {
  if (!projects.length) return null;
  const slots = COLLAGE_SLOTS[projects.length] ?? COLLAGE_SLOTS[3];
  return h('div', { class: ['hm-hero-collage', `hm-hero-collage--n${slots.length}`], 'aria-hidden': 'true' },
    projects.slice(0, slots.length).map((p, i) => {
      const lead = i === 0;
      return h('a', {
        class: ['hm-hero-shot', `hm-hero-shot--${slots[i]}`],
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
