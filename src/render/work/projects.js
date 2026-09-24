/**
 * All projects (spec G5): headline + category filter pills on one row, then a 3-up grid of
 * project cards. Filtering toggles `hidden` (never the URL) and replays the rise animation.
 * Not rendered when it would only repeat the Featured rows (see hasProjectGrid).
 */
import { h } from '../../lib/dom.js';
import { filterGroup, headline } from '../../lib/ui.js';
import { hasProjectGrid } from '../../lib/sections.js';
import { sprig } from '../../effects/index.js';
import { applyFilter, countBy, orderProjects, presetFilter, projectCard, recallFilter, rememberFilter } from './shared.js';

export function renderProjects(content) {
  // Skipped when every project already has a Featured row (the grid would only repeat them).
  if (!hasProjectGrid(content)) return null;
  const projects = orderProjects(content?.projects).filter(Boolean);
  if (!projects.length) return null;

  const sec = content.site?.sections?.projects ?? {};
  const titleId = 'projects-title';
  const cards = projects.map((p, i) => ({ data: p, el: projectCard(p, i) }));

  return h('section', { id: 'projects', class: 'section wk-projects', 'aria-labelledby': titleId },
    h('div', { class: 'container' },
      h('header', { class: 'wk-projects-head' },
        // Same eyebrow / headline / blurb markup sectionHead() produces, laid out beside the filters.
        h('div', { class: 'wk-projects-heading' },
          sec.eyebrow ? h('p', { class: 'eyebrow' }, sprig(), sec.eyebrow) : null,
          headline(sec.title || 'All projects', sec.accent ?? null, { id: titleId }),
          sec.blurb ? h('p', { class: 'section-head__blurb' }, sec.blurb) : null,
        ),
        categoryFilters(projects, content.site?.projectCategories, cards),
      ),
      h('div', { class: 'wk-grid' }, cards.map((card) => card.el)),
    ),
  );
}

/** "All N" + one pill per category in `projectCategories` order; empty categories are omitted. */
function categoryFilters(projects, order = [], cards) {
  const counts = countBy(projects, (p) => p.category);
  // Listed categories first, then any a project uses that the list forgot, so nothing is unreachable.
  const categories = [...new Set([...(order ?? []), ...counts.keys()])].filter((c) => counts.get(c) > 0);
  if (categories.length < 2) return null;

  const keep = (value) => (p) => value === 'all' || p.category === value;
  const value = recallFilter('projects', categories);
  if (value !== 'all') presetFilter(cards, keep(value));

  return filterGroup({
    label: 'Filter projects by category',
    noun: 'projects',
    value,
    options: [
      { value: 'all', label: 'All', count: projects.length },
      ...categories.map((c) => ({ value: c, label: c, count: counts.get(c) })),
    ],
    onChange: (next) => {
      rememberFilter('projects', next);
      applyFilter(cards, keep(next));
    },
  });
}
