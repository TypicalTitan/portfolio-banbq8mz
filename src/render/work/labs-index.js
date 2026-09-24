/**
 * Labs index route `#/labs` (spec G16): every lab report as a row, newest first,
 * filterable by subject. With no labs it returns null and the router shows the 404 view.
 */
import { h } from '../../lib/dom.js';
import { plural } from '../../lib/format.js';
import { backLink, filterGroup, headline } from '../../lib/ui.js';
import { applyFilter, countBy, labRow, labsByDate, presetFilter, recallFilter, rememberFilter } from './shared.js';

export function renderLabsIndex(content) {
  const labs = labsByDate(content?.labs);
  // No labs: nothing links here, so a stray #/labs gets the 404 view (the router's fallback for null).
  if (!labs.length) return null;
  const titleId = 'wk-index-title';
  const items = labs.map((lab, i) => ({
    data: lab,
    el: h('li', { class: 'wk-index-item reveal', style: { '--i': i % 4 } }, labRow(lab)),
  }));

  const title = headline('Every lab report', 'lab report', { tag: 'h1', id: titleId });
  title.setAttribute('tabindex', '-1');

  const root = h('section', { class: 'section wk-index', id: 'view', 'aria-labelledby': titleId },
    h('div', { class: 'container' },
      backLink('#labs', 'Lab notebook'),
      h('header', { class: 'wk-index-head' },
        title,
        h('p', { class: 'wk-index-count' }, plural(labs.length, 'report', 'reports')),
        subjectFilters(labs, items),
      ),
      h('ul', { class: 'wk-index-grid' }, items.map((item) => item.el)),
    ),
  );
  root.dataset.title = 'All labs';
  return root;
}

function subjectFilters(labs, items) {
  const counts = countBy(labs, (lab) => lab.subject);
  if (counts.size < 2) return null;

  const keep = (value) => (lab) => value === 'all' || lab.subject === value;
  const value = recallFilter('labs-index', [...counts.keys()]);
  if (value !== 'all') presetFilter(items, keep(value));

  return filterGroup({
    label: 'Filter labs by subject',
    noun: 'labs',
    value,
    options: [
      { value: 'all', label: 'All', count: labs.length },
      ...[...counts].map(([subject, count]) => ({ value: subject, label: subject, count })),
    ],
    onChange: (next) => {
      rememberFilter('labs-index', next);
      applyFilter(items, keep(next));
    },
  });
}
