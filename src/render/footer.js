/**
 * Site footer (spec §G0). Static: built once from content; links to empty sections are omitted.
 */

import { h, uid } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { asset, monthYear } from '../lib/format.js';
import { socialLinks } from '../lib/ui.js';
import { featuredProjects, hasFeatured, hasLabs, hasProjectGrid } from '../lib/sections.js';
import { projectHref, sectionHref } from '../router.js';
import { reducedMotion, yinYang } from '../effects/index.js';

function linkColumn(title, links) {
  const list = links.filter(Boolean);
  if (!list.length) return null;
  const id = uid('ft-col');
  return h(
    'nav',
    { class: 'ft-col', 'aria-labelledby': id },
    h('h2', { class: 'ft-heading', id }, title),
    h(
      'ul',
      { class: 'ft-links' },
      list.map(({ label, href, external }) =>
        h(
          'li',
          null,
          h(
            'a',
            { href, target: external ? '_blank' : null, rel: external ? 'noopener' : null },
            label,
            external ? h('span', { class: 'sr-only' }, ' (opens in new tab)') : null,
          ),
        ),
      ),
    ),
  );
}

export function renderFooter(content) {
  const {
    site = {}, person = {}, experience = [], skills = [], education = [], awards = [],
  } = content ?? {};
  const social = (id) => (person.socials ?? []).find((s) => s?.id === id && s.url);
  const github = social('github');
  const linkedin = social('linkedin');
  const handle = person.handle || 'TypicalTitan';

  const cols = [
    linkColumn('Work', [
      hasFeatured(content) && { label: 'Featured', href: sectionHref('work') },
      hasProjectGrid(content) && { label: 'All projects', href: sectionHref('projects') },
      // No grid means every project is a featured row: link each case study directly instead.
      ...(hasProjectGrid(content) ? [] : featuredProjects(content.projects).map((p) => ({ label: p.title, href: projectHref(p.slug) }))),
      hasLabs(content) && { label: 'Lab notebook', href: sectionHref('labs') },
      hasLabs(content) && { label: 'Every lab', href: '#/labs' },
    ]),
    linkColumn('About', [
      { label: 'About me', href: sectionHref('about') },
      skills.length > 0 && { label: 'Skills', href: sectionHref('skills') },
      (education.length > 0 || awards.length > 0) && { label: 'Education', href: sectionHref('education') },
      experience.length > 0 && { label: 'Experience', href: sectionHref('experience') },
    ]),
    linkColumn('Contact', [
      person.email && { label: 'Email', href: `mailto:${person.email}` },
      person.resume?.href && { label: 'Résumé (PDF)', href: asset(person.resume.href), external: true },
      github && { label: github.label || 'GitHub', href: github.url, external: true },
      linkedin && { label: linkedin.label || 'LinkedIn', href: linkedin.url, external: true },
    ]),
    site.currently
      ? h(
          'div',
          { class: 'ft-col ft-col--now' },
          h('h2', { class: 'ft-heading' }, 'Currently'),
          h('p', { class: 'ft-now' }, icon('Flame', { size: 18, className: 'ft-now__icon' }), h('span', null, site.currently)),
        )
      : null,
  ];

  const legal = [
    `© ${site.copyrightYear ?? new Date().getFullYear()} ${person.name ?? ''}`.trim(),
    site.updated ? `Updated ${monthYear(site.updated)}` : null,
    'Built with Vite + vanilla JS',
  ]
    .filter(Boolean)
    .join(' · ');

  const topBtn = h(
    'button',
    {
      type: 'button',
      class: 'ft-top-btn',
      onClick: () => {
        window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
        document.getElementById('main')?.focus({ preventScroll: true });
      },
    },
    h('span', { class: 'ft-top-glyph', 'aria-hidden': 'true' }, yinYang(16)),
    h('span', null, 'Back to the surface'),
    h('span', { class: 'ft-top-caret', 'aria-hidden': 'true' }, '▲'),
  );

  return h(
    'footer',
    { class: 'ft', id: 'footer-root' },
    h(
      'div',
      { class: 'container ft-inner' },
      h(
        'div',
        { class: 'ft-top' },
        h(
          'div',
          { class: 'ft-brand' },
          h('p', { class: 'ft-wordmark' }, h('span', { class: 'blackletter', 'data-text': handle, style: { '--chars': [...handle].length || 1 } }, handle)),
          person.name ? h('p', { class: 'ft-name' }, person.name) : null,
        ),
        socialLinks(person.socials, { className: 'ft-socials' }),
      ),
      h('div', { class: 'ft-cols' }, cols),
      h('div', { class: 'ft-bottom' }, h('p', { class: 'ft-legal' }, legal), topBtn),
    ),
  );
}
