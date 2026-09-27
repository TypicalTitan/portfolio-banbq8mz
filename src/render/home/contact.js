/**
 * G13 · Contact: the Riot diagonal banner. A crimson panel on the left carries the pitch, contact
 * tiles and the big CTA; a lava fissure with the rotating yin-yang sigil burns on the right, split
 * by a molten seam. Below 1024px the lava becomes a strip across the top.
 */

import { h } from '../../lib/dom.js';
import { icon, brand } from '../../lib/icons.js';
import { asset } from '../../lib/format.js';
import { breakable, button, copyEmailButton } from '../../lib/ui.js';
import { mountLava, mountParticles, sprig, thornSeam, yinYang } from '../../effects/index.js';

export function renderContact(content) {
  const person = content.person ?? {};
  const copy = content.site?.sections?.contact ?? {};
  const email = person.email || null;
  const accent = copy.titleAccent || 'something.';

  const lava = h('div', { class: 'hm-contact-lava', 'aria-hidden': 'true' },
    h('div', { class: 'hm-contact-sigil' }, yinYang(240)));
  mountLava(lava, { preset: 'fissure' });
  mountParticles(lava, { embers: 40, spawn: 'bottom' });

  const tiles = contactTiles(person, email);

  return h('section', { id: 'contact', class: 'section hm-contact', 'aria-labelledby': 'contact-title' },
    thornSeam(),
    lava,
    h('div', { class: 'hm-contact-panel grain', 'aria-hidden': 'true' }),
    h('div', { class: 'hm-contact-seam', 'aria-hidden': 'true' }),
    h('div', { class: 'container hm-contact-inner' },
      h('div', { class: 'hm-contact-body reveal' },
        copy.eyebrow ? h('p', { class: 'eyebrow' }, sprig(), copy.eyebrow) : null,
        h('h2', { id: 'contact-title', class: 'headline headline--upright hm-contact-title' },
          copy.titleLead ? `${copy.titleLead} ` : null,
          h('span', { class: 'blackletter hm-contact-accent', 'data-text': accent }, accent),
        ),
        copy.blurb ? h('p', { class: 'hm-contact-blurb' }, copy.blurb) : null,
        tiles.length ? h('ul', { class: 'hm-contact-tiles' }, tiles) : null,
        email || person.responseTime
          ? h('div', { class: 'hm-contact-actions' },
              email ? button({ label: 'Email me', href: `mailto:${email}`, size: 'lg', icon: 'Mail', className: 'hm-contact-cta' }) : null,
              person.responseTime
                ? h('p', { class: 'hm-contact-response' }, icon('Clock', { size: 16 }), person.responseTime)
                : null,
            )
          : null,
      ),
    ),
  );
}

/** Email (value is the mailto link, plus a copy button), LinkedIn, GitHub and Résumé; missing ones drop out. */
function contactTiles(person, email) {
  const social = (id) => (person.socials ?? []).find((s) => s?.id === id && s.url);
  const linkedin = social('linkedin');
  const github = social('github');
  const resume = person.resume?.href ? person.resume : null;

  return [
    email ? emailTile(email) : null,
    linkedin ? linkTile({ glyph: brand('linkedin', { size: 22 }), label: linkedin.label || 'LinkedIn', value: linkedin.handle || 'View profile', href: linkedin.url }) : null,
    github ? linkTile({ glyph: brand('github', { size: 22 }), label: github.label || 'GitHub', value: github.handle || 'View profile', href: github.url }) : null,
    resume ? linkTile({ glyph: icon('FileDown', { size: 22 }), label: resume.label || 'Résumé', value: resume.fileInfo || 'Download PDF', href: asset(resume.href) }) : null,
  ].filter(Boolean);
}

function emailTile(email) {
  return h('li', null,
    h('div', { class: 'hm-contact-tile hm-contact-tile--email' },
      h('div', { class: 'hm-contact-tile-top' },
        icon('Mail', { size: 22, className: 'hm-contact-tile-glyph' }),
        copyEmailButton(email, { variant: 'ghost', size: 'sm' }),
      ),
      h('p', { class: 'hm-contact-tile-label' }, 'Email'),
      h('a', { class: 'hm-contact-tile-value', href: `mailto:${email}` }, breakable(email)),
    ),
  );
}

function linkTile({ glyph, label, value, href }) {
  glyph.classList.add('hm-contact-tile-glyph');
  return h('li', null,
    h('a', { class: 'hm-contact-tile hm-contact-tile--link', href, target: '_blank', rel: 'noopener' },
      h('span', { class: 'hm-contact-tile-top' }, glyph, icon('ArrowUpRight', { size: 18, className: 'hm-contact-tile-arrow' })),
      h('span', { class: 'hm-contact-tile-label' }, label),
      ' ',
      h('span', { class: 'hm-contact-tile-value' }, value),
      h('span', { class: 'sr-only' }, ' (opens in new tab)'),
    ),
  );
}
