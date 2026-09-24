/**
 * G8 · About: a glass card on the blurred-stone band, under the site's main petal storm.
 * Left: identity, pitch, bio and contact. Right: availability, strengths and quick facts.
 */

import { h } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';
import { asset, monthYear } from '../../lib/format.js';
import { button, dlList, glassPill, img, sectionHead, socialLinks } from '../../lib/ui.js';
import { mountParticles, perfTier, thornRing } from '../../effects/index.js';

export function renderAbout(content) {
  const person = content.person ?? {};
  const copy = content.site?.sections?.about ?? {};

  const card = h('div', { class: 'hm-about-card reveal' },
    h('div', { class: 'hm-about-main' },
      identity(person),
      sectionHead({ eyebrow: copy.eyebrow ?? null, title: person.pitch || 'About me', accent: copy.accent ?? null, id: 'about-title' }),
      person.bio?.length ? h('div', { class: 'hm-about-bio' }, person.bio.map((para) => h('p', null, para))) : null,
      h('div', { class: 'hm-about-ctas' },
        person.email ? button({ label: 'Email me', href: `mailto:${person.email}`, icon: 'Mail' }) : null,
        person.resume?.href
          ? button({ label: person.resume.label || 'Résumé', href: asset(person.resume.href), variant: 'outline', icon: 'Download', external: true })
          : null,
        // Socials share the CTA row so a single icon doesn't sit alone on its own line.
        person.socials?.length ? socialLinks(person.socials, { size: 40, className: 'hm-about-socials' }) : null,
      ),
    ),
    h('div', { class: 'hm-about-side' },
      availabilityBlock(person.availability),
      person.strengths?.length
        ? h('ul', { class: 'hm-about-checks' },
            person.strengths.map((item) => h('li', null, icon('CircleCheck', { size: 22 }), h('span', null, item))))
        : null,
      dlList(quickFacts(person, content.education?.[0]), { className: 'hm-about-facts' }),
    ),
  );

  const band = h('section', { id: 'about', class: 'section hm-about', 'aria-labelledby': 'about-title' },
    h('div', { class: 'hm-about-grain grain', 'aria-hidden': 'true' }),
    h('div', { class: 'container' }, card),
  );
  // The glass card covers the middle, so petals live in the gutters and lean to the bigger layers.
  mountParticles(band, { petals: perfTier() === 'low' ? 20 : 40, bias: 'edges', mix: { far: 0.3, near: 0.15 } });
  return band;
}

function identity(person) {
  const photo = person.photo?.src
    ? h('div', { class: 'hm-about-portrait' },
        h('span', { class: 'hm-about-ring', 'aria-hidden': 'true' }, thornRing({ size: 160 })),
        img(person.photo, { className: 'hm-about-photo' }))
    : null;
  return h('div', { class: 'hm-about-id' },
    photo,
    h('div', { class: 'hm-about-who' },
      person.name ? h('p', { class: 'hm-about-name' }, person.name) : null,
      person.handle ? h('p', { class: 'hm-about-aka' }, 'aka ', h('span', { class: 'hm-about-handle' }, person.handle)) : null,
      person.pronouns ? h('p', { class: 'hm-about-pronouns' }, person.pronouns) : null,
    ),
  );
}

function availabilityBlock(availability) {
  if (!availability || availability.open === false) return null;
  const text = availability.season ? `Available · ${availability.season}` : availability.label;
  if (!text) return null;
  return h('div', { class: 'hm-about-avail' },
    glassPill(text, { dot: true, icon: 'CalendarCheck' }),
    availability.detail ? h('p', { class: 'hm-about-avail-detail' }, availability.detail) : null,
  );
}

/**
 * Two-column facts grid. Interests always take a full row (a list reads badly in half a column);
 * when the short facts leave an odd one out, that last one spans the row too, so no cell sits empty.
 */
function quickFacts(person, school) {
  const graduating = school?.end ? monthYear(school.end) : person.gradYear ? String(person.gradYear) : null;
  const interests = (person.interests ?? []).map((item) => String(item ?? '').trim()).filter(Boolean);
  const short = [
    { term: 'Location', desc: person.location },
    { term: 'School', desc: person.school },
    { term: 'Graduating', desc: graduating },
    { term: 'Focus', desc: person.focus },
  ].filter((pair) => pair.desc);
  if (short.length % 2 === 1) short[short.length - 1].wide = true;
  return [
    ...short,
    interests.length ? { term: 'Interests', desc: interests.join(' · '), wide: true } : null,
  ];
}
