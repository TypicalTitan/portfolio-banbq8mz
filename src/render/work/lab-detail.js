/**
 * Lab report route `#/labs/<slug>` (spec G15), dusk identity throughout: static dusk-lava hero,
 * key-results strip, the report itself (objective & hypothesis → verdict, method, data table +
 * figures, conclusion, error analysis) beside a sticky facts card, then prev/next labs.
 */
import { h, uid } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';
import { asset, fullDate } from '../../lib/format.js';
import { backLink, button, chipList, glassPill, shot, statRow } from '../../lib/ui.js';
import { labHref } from '../../router.js';
import { renderGallery } from './gallery.js';
import {
  DETAIL_TITLE_ID, detailHero, factsCard, labsByDate, numberedSections, paragraphs,
  partnersLabel, prevNext, verdictChip,
} from './shared.js';

export function renderLabDetail(content, slug) {
  const labs = labsByDate(content?.labs);
  const lab = labs.find((entry) => entry.slug === slug);
  if (!lab) return null;

  const root = h('article', { class: 'wk-detail wk-detail--lab', id: 'view', 'aria-labelledby': DETAIL_TITLE_ID },
    h('div', { class: 'container wk-detail-back' }, backLink('#labs', 'Lab notebook')),
    detailHero({
      theme: 'dusk',
      seed: lab.slug,
      kicker: lab.course ? `Lab report · ${lab.course}` : 'Lab report',
      title: lab.title,
      lead: lab.objective,
      pills: [
        lab.date ? glassPill(fullDate(lab.date), { icon: 'Calendar' }) : null,
        glassPill(partnersLabel(lab.partners), { icon: 'Users' }),
        lab.course ? glassPill(lab.course, { icon: 'School' }) : null,
        lab.duration ? glassPill(lab.duration, { icon: 'Clock' }) : null,
      ],
      actions: fileActions(lab.files),
      cover: shot(lab.cover, { frame: 'dusk', label: 'FIG. 1', loading: 'eager', fetchpriority: 'high', className: 'wk-detail-shot' }),
    }),
    h('div', { class: 'container' },
      // stat() renders a key value's `uncertainty` as "±0.05 m/s²" inside .stat__unit.
      statRow(lab.results?.keyValues, { className: 'wk-detail-metrics', size: 'lg' }),
      h('div', { class: 'wk-detail-body' },
        labFacts(lab),
        h('div', { class: 'wk-detail-article prose' }, report(lab)),
      ),
    ),
    h('div', { class: 'container wk-detail-more' },
      prevNext(labs, labs.indexOf(lab), labHref, 'lab'),
      h('div', { class: 'wk-detail-all' }, button({ label: 'Lab notebook', href: '#labs', variant: 'outline' })),
    ),
  );
  root.dataset.title = `${lab.title} — Lab report`;
  return root;
}

/** "Full report (PDF)" and "Raw data (CSV)", each only when its file exists. */
function fileActions(files, className = '') {
  return [
    files?.report
      ? button({ label: 'Full report (PDF)', href: asset(files.report), icon: 'FileDown', external: true, className })
      : null,
    files?.data
      ? button({ label: 'Raw data (CSV)', href: asset(files.data), variant: 'outline', icon: 'Table', download: true, className })
      : null,
  ].filter(Boolean);
}

/* ── The report ────────────────────────────────────────────────────────── */

function report(lab) {
  const steps = (lab.method?.steps ?? []).filter(Boolean);
  const materials = (lab.materials ?? []).filter(Boolean);
  const errors = (lab.errors ?? []).filter(Boolean);
  const improvements = (lab.improvements ?? []).filter(Boolean);
  const hasMethod = Boolean(lab.method?.summary || materials.length || steps.length);
  const results = lab.results ?? {};
  const figures = renderGallery(lab.figures, { heading: null });
  const table = dataTable(results.table);

  return numberedSections([
    lab.objective || lab.hypothesis ? ['Objective & hypothesis', [
      h('div', { class: 'wk-oh' },
        lab.objective ? card('Objective', lab.objective, 'objective') : null,
        lab.hypothesis ? card('Hypothesis', lab.hypothesis, 'hypothesis') : null,
      ),
      verdictChip(lab.verdict),
    ]] : null,
    hasMethod ? ['Method', [
      lab.method?.summary ? h('p', null, lab.method.summary) : null,
      materials.length ? [h('h3', { class: 'wk-sub' }, 'Materials'), chipList(materials, { glyph: 'Beaker' })] : null,
      steps.length ? [
        h('h3', { class: 'wk-sub' }, 'Procedure'),
        h('ol', { class: 'wk-method' }, steps.map((step) => h('li', null, step))),
      ] : null,
    ]] : null,
    results.summary || table || figures ? ['Results', [
      results.summary ? h('p', null, results.summary) : null,
      table,
      figures,
    ]] : null,
    lab.conclusion?.length ? ['Conclusion', paragraphs(lab.conclusion)] : null,
    errors.length || improvements.length ? ['Error analysis', h('div', { class: 'wk-reflect' },
      errors.length ? reflectList('Sources of error', errors, 'TriangleAlert', 'error') : null,
      improvements.length ? reflectList('Improvements', improvements, 'Lightbulb', 'idea') : null,
    )] : null,
  ]);
}

function card(label, text, kind) {
  return h('div', { class: ['wk-oh-card', `wk-oh-card--${kind}`] },
    h('h3', { class: 'wk-oh-label' }, label),
    h('p', null, text),
  );
}

function reflectList(title, items, iconName, kind) {
  return h('div', { class: 'wk-reflect-col' },
    h('h3', { class: 'wk-sub' }, title),
    h('ul', { class: ['wk-icon-list', `wk-icon-list--${kind}`] },
      items.map((item) => h('li', null, icon(iconName, { size: 18 }), h('span', null, item)))),
  );
}

/** Data table: strip-headed, mono cells, numeric columns right-aligned, scrolls inside its region. */
function dataTable(table) {
  const columns = table?.columns ?? [];
  const rows = table?.rows ?? [];
  if (!columns.length || !rows.length) return null;

  const captionId = uid('wk-table');
  const numeric = (col) => [col.numeric && 'is-num'];
  return h('div', { class: 'table-wrap wk-table-wrap', role: 'region', 'aria-labelledby': captionId, tabindex: '0' },
    h('table', { class: 'wk-table' },
      h('caption', { id: captionId }, table.caption || 'Data table'),
      h('thead', null, h('tr', null, columns.map((col) => h('th', { scope: 'col', class: numeric(col) },
        col.label,
        // Units keep their case ("s²", not "S²") under the uppercase header style.
        col.unit ? h('span', { class: 'wk-table-unit' }, ` (${col.unit})`) : null,
      )))),
      h('tbody', null, rows.map((row) => h('tr', null, columns.map((col, i) => h(
        i === 0 ? 'th' : 'td',
        { scope: i === 0 ? 'row' : null, class: numeric(col) },
        row[i] ?? '',
      ))))),
    ),
  );
}

/* ── Facts sidebar ─────────────────────────────────────────────────────── */

function labFacts(lab) {
  return factsCard({
    title: 'Lab facts',
    pairs: [
      { term: 'Course', desc: lab.course },
      { term: 'Subject', desc: lab.subject },
      { term: 'Instructor', desc: lab.instructor },
      { term: 'Date', desc: lab.date ? fullDate(lab.date) : null },
      { term: 'Partners', desc: lab.partners?.length ? lab.partners.join(', ') : 'Solo' },
      { term: 'Duration', desc: lab.duration },
    ],
    groups: [
      { label: 'Skills demonstrated', node: chipList(lab.skills) },
    ],
    actions: fileActions(lab.files, 'wk-facts-btn'),
  });
}
