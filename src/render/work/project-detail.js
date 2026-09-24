/**
 * Project case study route `#/projects/<slug>` (spec G14): static-lava hero with the tilted
 * cover, metrics strip, numbered write-up beside a sticky facts card, gallery + lightbox,
 * then prev/next tiles in the same order as the all-projects grid.
 */
import { h } from '../../lib/dom.js';
import { badge, backLink, button, chipList, glassPill, img, shot, stat, statRow } from '../../lib/ui.js';
import { projectsAnchor } from '../../lib/sections.js';
import { projectHref, sectionHref } from '../../router.js';
import { renderGallery } from './gallery.js';
import {
  DETAIL_TITLE_ID, detailHero, factsCard, joinMeta, numberedSections, orderProjects,
  paragraphs, prevNext, projectActions, teamLabel,
} from './shared.js';

export function renderProjectDetail(content, slug) {
  const projects = content?.projects ?? [];
  const p = projects.find((project) => project?.slug === slug);
  if (!p) return null;

  const ordered = orderProjects(projects);
  const badges = (p.badges ?? []).map((kind) => badge(kind)).filter(Boolean);
  const gallery = renderGallery(p.gallery);
  const sections = writeup(p);
  // Back to the grid when it renders; otherwise to the featured rows that stand in for it.
  const grid = projectsAnchor(content) === 'projects';
  const backHref = sectionHref(projectsAnchor(content) ?? 'top');

  const root = h('article', { class: 'wk-detail', id: 'view', 'aria-labelledby': DETAIL_TITLE_ID },
    h('div', { class: 'container wk-detail-back' }, backLink(backHref, grid ? 'All projects' : 'Work')),
    detailHero({
      theme: p.theme ?? 'lava',
      seed: p.slug,
      kicker: joinMeta([p.category, p.year]),
      title: p.title,
      lead: p.subtitle || p.summary,
      pills: [
        p.duration ? glassPill(p.duration, { icon: 'Calendar' }) : null,
        p.role ? glassPill(p.role, { icon: 'User' }) : null,
        teamLabel(p.team) ? glassPill(teamLabel(p.team), { icon: 'Users' }) : null,
      ],
      actions: projectActions(p),
      extra: badges.length ? h('div', { class: 'wk-detail-badges' }, badges) : null,
      cover: shot(p.cover, { frame: p.frame ?? 'window', label: p.slug, loading: 'eager', fetchpriority: 'high', className: 'wk-detail-shot' }),
    }),
    h('div', { class: 'container' },
      statRow(p.metrics, { className: 'wk-detail-metrics', size: 'lg' }),
      // With no write-up at all the facts card takes the row on its own (no empty article column).
      h('div', { class: ['wk-detail-body', !sections.length && 'wk-detail-body--solo'] },
        projectFacts(p, content.person?.name),
        sections.length ? h('div', { class: 'wk-detail-article prose' }, sections) : null,
      ),
    ),
    gallery ? h('div', { class: 'container wk-detail-gallery' }, gallery) : null,
    h('div', { class: 'container wk-detail-more' },
      prevNext(ordered, ordered.indexOf(p), projectHref, 'project'),
      h('div', { class: 'wk-detail-all' }, button({ label: grid ? 'All projects' : 'Back to work', href: backHref, variant: 'outline' })),
    ),
  );
  root.dataset.title = `${p.title} — Project`;
  return root;
}

/* ── Write-up: 01 Problem · 02 Process · 03 Outcome · 04 What I learned ── */

// Default section names; `writeup.headings` may rename any of them (e.g. a build log's "The parts").
const HEADINGS = { problem: 'Problem', process: 'Process', outcome: 'Outcome', lessons: 'What I learned' };

function writeup(p) {
  const w = p.writeup ?? {};
  const name = { ...HEADINGS, ...(w.headings ?? {}) };
  const hasProcess = Boolean(w.process?.intro || w.process?.steps?.length);
  const sections = numberedSections([
    w.problem?.length ? [name.problem, paragraphs(w.problem)] : null,
    hasProcess ? [name.process, processBody(w.process, p.gallery ?? [])] : null,
    w.outcome?.length ? [name.outcome, outcomeBody(w.outcome, p.metrics?.[0])] : null,
    w.lessons?.length ? [name.lessons, h('ul', { class: 'ember-list' }, w.lessons.map((lesson) => h('li', null, lesson)))] : null,
  ]);
  // No write-up yet: the card summary stands in as a one-section overview.
  if (sections.length || !p.summary) return sections;
  return numberedSections([['Overview', paragraphs(p.summary)]]);
}

function processBody(process, gallery) {
  const steps = (process.steps ?? []).filter(Boolean);
  return [
    process.intro ? h('p', null, process.intro) : null,
    steps.length
      ? h('ol', { class: 'wk-steps' }, steps.map((step) => {
          const figure = step.image != null ? gallery[step.image] : null;
          return h('li', { class: 'wk-step' },
            h('h3', { class: 'wk-step-title' }, step.title),
            step.body ? h('p', { class: 'wk-step-body' }, step.body) : null,
            figure?.src
              ? h('figure', { class: 'wk-step-fig' },
                  img(figure, { className: 'wk-step-img' }),
                  figure.caption ? h('figcaption', null, figure.caption) : null,
                )
              : null,
          );
        }))
      : null,
  ];
}

function outcomeBody(outcome, metric) {
  return [
    paragraphs(outcome),
    metric
      ? h('div', { class: 'wk-callout' },
          h('p', { class: 'wk-callout-label' }, 'Headline result'),
          stat({ value: metric.value, unit: metric.unit ?? null, label: metric.label, size: 'md' }),
        )
      : null,
  ];
}

/* ── Facts sidebar ─────────────────────────────────────────────────────── */

function projectFacts(p, name) {
  return factsCard({
    title: 'Project facts',
    pairs: [
      { term: 'Role', desc: p.role },
      { term: 'Team', desc: teamDesc(p.team, name) },
      { term: 'Timeline', desc: p.duration },
      { term: 'Context', desc: p.context },
      { term: 'Category', desc: p.category },
    ],
    groups: [
      { label: 'Tech', node: chipList(p.tags) },
      { label: 'Skills demonstrated', node: chipList(p.skills) },
    ],
    actions: projectActions(p, { className: 'wk-facts-btn' }),
  });
}

/** Team members with the student's own name in <strong>; "Solo" for one-person projects. */
function teamDesc(team, name) {
  const members = (team?.members ?? []).filter(Boolean);
  if (members.length < 2) return teamLabel(team);
  return h('span', null, members.map((member, i) => [
    i > 0 ? ', ' : null,
    member === name ? h('strong', null, member) : member,
  ]));
}
