/**
 * Experience (spec G7): stacked role cards on the deep crimson band.
 * Each card is a "slide": a lava-lit org panel (type pill + white logo mark) beside a
 * résumé-style body (role, org, dates, summary, achievements, skills, optional reference).
 */
import { h, uid } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';
import { dateRange } from '../../lib/format.js';
import { sectionHead, glassPill, chipList, img } from '../../lib/ui.js';
import { thornSeam } from '../../effects/index.js';

const TYPES = {
  internship: { label: 'Internship', icon: 'Briefcase' },
  job:        { label: 'Job',        icon: 'Store' },
  volunteer:  { label: 'Volunteer',  icon: 'HeartHandshake' },
  research:   { label: 'Research',   icon: 'Microscope' },
};

const MAX_ACHIEVEMENTS = 6;
const MAX_STAGGER = 5;

export function renderExperience(content) {
  // Content order (newest first), except roles with unknown dates always follow the dated ones.
  const undated = (role) => (role.start || role.end ? 0 : 1);
  const roles = (content?.experience ?? []).filter(Boolean).sort((a, b) => undated(a) - undated(b));
  if (!roles.length) return null;

  const sec = content.site?.sections?.experience ?? {};
  const titleId = 'experience-title';

  return h('section', { id: 'experience', class: 'section xp grain', 'aria-labelledby': titleId },
    thornSeam(),
    h('div', { class: 'container xp-inner' },
      sectionHead({
        eyebrow: sec.eyebrow ?? null,
        title: sec.title || 'Experience',
        accent: sec.accent ?? null,
        blurb: sec.blurb ?? null,
        id: titleId,
        split: true,
        upright: true,
      }),
      h('div', { class: 'xp-list' }, roles.map(roleCard)),
    ),
  );
}

function roleCard(role, index) {
  const titleId = uid('xp-role');
  // Summary-only roles get a shorter org panel, so the card doesn't sit half empty;
  // roles with only a title, org and dates collapse further to a compact row.
  const brief = !role.achievements?.length && !role.skills?.length && !role.quote?.text;
  const compact = brief && !role.summary;
  return h('article', {
    class: ['xp-role', brief && 'xp-role--brief', compact && 'xp-role--compact', 'reveal'],
    style: { '--i': Math.min(index, MAX_STAGGER) },
    'aria-labelledby': titleId,
  },
    orgPanel(role),
    h('div', { class: 'xp-body' },
      h('div', { class: 'xp-head' },
        h('h3', { class: 'xp-role-title', id: titleId }, role.role),
        orgLine(role),
        dates(role),
      ),
      role.summary ? h('p', { class: 'xp-summary' }, role.summary) : null,
      achievements(role.achievements),
      skills(role.skills),
      reference(role.quote),
    ),
  );
}

/* ── Org panel ─────────────────────────────────────────────────────────── */

function orgPanel(role) {
  const mark = role.logo?.src
    ? img(role.logo, { className: 'xp-logo' })
    : h('span', { class: 'xp-monogram', 'aria-hidden': 'true' }, initials(role.org));

  return h('div', { class: 'xp-org grain' },
    typePill(role.type),
    mark,
    // Visual caption only: the org name is announced once, in the body's org line.
    role.org ? h('p', { class: 'xp-org-name', 'aria-hidden': 'true' }, role.org) : null,
  );
}

function typePill(type) {
  if (!type) return null;
  const t = TYPES[type] ?? { label: type.charAt(0).toUpperCase() + type.slice(1), icon: 'Briefcase' };
  const pill = glassPill(t.label, { icon: t.icon });
  pill?.classList.add('xp-type');
  return pill;
}

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter((word) => /^[\p{L}\p{N}]/u.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

/* ── Body ──────────────────────────────────────────────────────────────── */

// Decorative middle dot; the surrounding spaces keep words apart for screen readers.
const sep = () => [' ', h('span', { class: 'xp-sep', 'aria-hidden': 'true' }, '·'), ' '];

function orgLine(role) {
  if (!role.org && !role.location) return null;
  const org = role.org && role.orgUrl ? orgLink(role.org, role.orgUrl) : role.org;
  return h('p', { class: 'xp-orgline' },
    org ? h('span', { class: 'xp-org-label' }, org) : null,
    // The dot rides inside the location's inline-block, so a wrap never leaves 'Org ·' alone.
    org && role.location ? ' ' : null,
    role.location
      ? h('span', { class: 'xp-loc' }, org ? [h('span', { class: 'xp-sep', 'aria-hidden': 'true' }, '·'), ' '] : null, role.location)
      : null,
  );
}

function orgLink(name, url) {
  const external = /^https?:\/\//i.test(url);
  return h('a', {
    class: 'xp-org-link',
    href: url,
    target: external ? '_blank' : null,
    rel: external ? 'noopener' : null,
  },
    name,
    external ? h('span', { class: 'sr-only' }, ' (opens in new tab)') : null,
    icon('ArrowUpRight', { size: 14, className: 'xp-org-arrow' }),
  );
}

function dates(role) {
  if (!role.start) return null;
  const current = role.end == null;
  return h('p', { class: ['xp-dates', current && 'is-current'] },
    current ? h('span', { class: 'xp-now', 'aria-hidden': 'true' }) : null,
    dateRange(role.start, role.end ?? null),
  );
}

function achievements(list) {
  const items = (list ?? []).filter(Boolean).slice(0, MAX_ACHIEVEMENTS);
  if (!items.length) return null;
  return h('ul', { class: 'ember-list xp-wins' }, items.map((text) => h('li', null, text)));
}

function skills(list) {
  if (!list?.length) return null;
  const ul = chipList(list);
  if (!ul) return null;
  ul.classList.add('xp-chips');
  ul.setAttribute('aria-label', 'Skills used');
  return ul;
}

function reference(quote) {
  if (!quote?.text) return null;
  return h('figure', { class: 'xp-quote' },
    icon('Quote', { size: 20, className: 'xp-quote-icon' }),
    h('blockquote', { class: 'xp-quote-text' }, h('p', null, quote.text)),
    quote.name || quote.title
      ? h('figcaption', { class: 'xp-quote-by' },
          quote.name ? h('span', { class: 'xp-quote-name' }, quote.name) : null,
          quote.name && quote.title ? sep() : null,
          quote.title ? h('span', { class: 'xp-quote-title' }, quote.title) : null,
        )
      : null,
  );
}
