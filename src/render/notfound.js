/**
 * 404 view (spec §G0): a lava field behind "This page fell into the lava."
 */

import { h } from '../lib/dom.js';
import { button, headline } from '../lib/ui.js';
import { projectsAnchor } from '../lib/sections.js';
import { sectionHref } from '../router.js';
import { mountLava, mountParticles } from '../effects/index.js';

export function renderNotFound(content) {
  const projects = projectsAnchor(content);

  const lava = h('div', { class: 'nf-lava', 'aria-hidden': 'true' });
  // 'hero' keeps the hot band along the bottom and a cool crust under the centred copy.
  mountLava(lava, { preset: 'hero' });
  mountParticles(lava, { embers: 24 });

  const title = headline('This page fell into the lava.', 'lava.', { tag: 'h1', upright: true, id: 'nf-title' });
  title.setAttribute('tabindex', '-1');

  const root = h(
    'section',
    { class: 'nf', id: 'view', 'aria-labelledby': 'nf-title' },
    lava,
    h(
      'div',
      { class: 'nf-content' },
      h('p', { class: 'nf-code', 'aria-hidden': 'true' }, h('span', { class: 'blackletter', 'data-text': '404' }, '404')),
      title,
      h('p', { class: 'nf-lead' }, 'The link may be old or mistyped. Everything else is still standing.'),
      h(
        'div',
        { class: 'nf-actions' },
        button({ label: 'Back home', href: '#top', variant: 'primary', icon: 'ArrowLeft' }),
        projects ? button({ label: 'See projects', href: sectionHref(projects), variant: 'outline' }) : null,
      ),
    ),
  );
  root.dataset.title = 'Not found';
  return root;
}
