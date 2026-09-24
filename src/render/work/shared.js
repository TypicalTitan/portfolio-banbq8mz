/**
 * Work slice building blocks shared by the home sections (G4–G6), the labs index (G16) and
 * both detail views (G14, G15): display ordering, project cards, lab rows, prev/next tiles,
 * the verdict chip, filtering and the detail-page scaffolding.
 */
import { h, uid, slugify } from '../../lib/dom.js';
import { icon, brand } from '../../lib/icons.js';
import { asset, monthYear, pad2, plural } from '../../lib/format.js';
import { badge, button, chipList, dlList, img, media, shot } from '../../lib/ui.js';
import { mountLava, reducedMotion } from '../../effects/index.js';
import { projectHref, labHref } from '../../router.js';

/* ── Ordering ──────────────────────────────────────────────────────────── */

/** Project grid + project prev/next order: featured first, then newest year, then `order`; ties keep content order. */
export function orderProjects(projects) {
  const rank = (p) => (p?.featured ? 1 : 0);
  const year = (p) => Number(p?.year) || 0;
  const order = (p) => (Number.isFinite(p?.order) ? p.order : Infinity);
  // Array#sort is stable, so equal keys stay in content order. Copying keeps the input untouched.
  return [...(projects ?? [])].sort((a, b) => rank(b) - rank(a) || year(b) - year(a) || order(a) - order(b));
}

/** Featured rows (G4): up to FEATURED_LIMIT projects flagged `featured`, by `order`. */
export { featuredProjects } from '../../lib/sections.js';

/** Labs newest first (ISO dates sort correctly as strings). */
export function labsByDate(labs) {
  return (labs ?? []).filter(Boolean).sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')));
}

/** Map of key → count, in first-seen order. */
export function countBy(list, keyOf) {
  const counts = new Map();
  for (const item of list) {
    const key = keyOf(item);
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/* ── Text helpers ──────────────────────────────────────────────────────── */

export const joinMeta = (parts) => parts.filter((part) => part != null && part !== '').join(' · ');
/** 'Team of 3' | 'Solo'; null when the team is unknown (team: null), so nothing is claimed. */
export const teamLabel = (team) => (!team ? null : team.size > 1 ? `Team of ${team.size}` : 'Solo');
export const partnersLabel = (partners) => (partners?.length ? plural(partners.length, 'partner', 'partners') : 'Solo');
export const monthOf = (date) => (date ? monthYear(String(date).slice(0, 7)) : null);
export const paragraphs = (text) => [].concat(text ?? []).filter(Boolean).map((line) => h('p', null, line));

/** 'COURSE 101 · LAB 04' (the lab number is optional). */
export const labLabel = (lab) =>
  [lab.course?.toUpperCase(), lab.labNumber != null ? `LAB ${pad2(lab.labNumber)}` : null].filter(Boolean).join(' · ');

/** '9.74 m/s²', '0.7%': a no-break space before every unit except %. */
export const withUnit = (value, unit) => (!unit ? String(value) : unit === '%' ? `${value}%` : `${value} ${unit}`);

/* ── Links & buttons ───────────────────────────────────────────────────── */

const isExternal = (url) => /^https?:\/\//i.test(url ?? '');
const isGitHub = (url) => /^https?:\/\/(www\.)?github\.com\//i.test(url ?? '');

/** Absolute, in-page and mailto links pass through; content file paths go through asset(). */
export const resolveHref = (url) => (!url || isExternal(url) || /^(#|mailto:|tel:)/i.test(url) ? url : asset(url));

/** `.link-arrow` text link: [lead glyph] label [sr-only context]; base.css draws the ↗. */
export function linkArrow(label, href, { lead = null, context = null, className = '' } = {}) {
  if (!href) return null;
  const external = isExternal(href);
  const hidden = [context, external ? '(opens in new tab)' : null].filter(Boolean).join(' ');
  return h('a', {
    class: ['link-arrow', className],
    href,
    target: external ? '_blank' : null,
    rel: external ? 'noopener' : null,
  },
    lead,
    h('span', null, label),
    hidden ? h('span', { class: 'sr-only' }, ` ${hidden}`) : null,
  );
}

/** GitHub mark for GitHub repos, a generic code glyph otherwise. */
export const repoGlyph = (url, size = 16) => (isGitHub(url) ? brand('github', { size }) : icon('Code', { size }));

/** Outline "Source" button with the GitHub mark (button() also takes brand keys). */
export function repoButton(url, { size = 'md', className = '' } = {}) {
  if (!url) return null;
  return button({
    label: 'Source',
    href: resolveHref(url),
    variant: 'outline',
    size,
    icon: isGitHub(url) ? 'github' : 'Code',
    external: isExternal(url),
    className,
  });
}

/** Demo / video / source buttons for a project, only for links that exist. */
export function projectActions(p, { className = '' } = {}) {
  const { demo, video, repo } = p.links ?? {};
  return [
    demo ? button({ label: 'Live demo', href: resolveHref(demo), iconEnd: 'ExternalLink', external: true, className }) : null,
    video
      ? button({ label: 'Watch video', href: resolveHref(video), variant: demo ? 'outline' : 'primary', icon: 'Play', external: true, className })
      : null,
    repoButton(repo, { className }),
  ].filter(Boolean);
}

/* ── Project card (G5) ─────────────────────────────────────────────────── */

/** A visible duplicate of a link the keyboard already reaches (the stretched title link): out of the tab order. */
export function pointerOnly(el) {
  el?.setAttribute('tabindex', '-1');
  el?.setAttribute('aria-hidden', 'true');
  return el;
}

export function projectCard(p, index = 0) {
  const titleId = uid('wk-card');
  const href = projectHref(p.slug);
  const badges = (p.badges ?? []).map((kind) => badge(kind)).filter(Boolean);
  const repo = p.links?.repo;
  const meta = joinMeta([p.category, p.year, p.role]);

  return h('article', { class: 'wk-card reveal', style: { '--i': index % 3 }, 'aria-labelledby': titleId },
    media(p.theme ?? 'lava',
      shot(p.cover, { frame: p.frame ?? 'window', label: p.slug, className: 'wk-card-shot' }),
      { ratio: '5 / 4', className: 'wk-card-media' }),
    h('h3', { class: 'wk-card-title', id: titleId }, h('a', { href }, p.title)),
    // After the title in reading order; positioned over the media's top-right corner.
    badges.length ? h('div', { class: 'wk-card-badges' }, badges) : null,
    p.subtitle ? h('p', { class: 'wk-card-sub' }, p.subtitle) : null,
    meta ? h('p', { class: 'wk-card-meta' }, meta) : null,
    p.summary ? h('p', { class: 'wk-card-summary' }, p.summary) : null,
    chipList(p.tags?.slice(0, 4)),
    h('div', { class: 'wk-card-actions' },
      pointerOnly(button({ label: 'Case study', href, variant: 'outline', size: 'sm' })),
      repo ? linkArrow('Repo', resolveHref(repo), { lead: repoGlyph(repo), context: `for ${p.title}` }) : null,
    ),
  );
}

/* ── Lab row (G6 list, G16 grid) ───────────────────────────────────────── */

export function labRow(lab) {
  const key = lab.results?.keyValues?.[0];
  const month = monthOf(lab.date);
  const hasImage = Boolean(lab.cover?.src);

  // The ' ' text nodes keep the link's accessible name readable; flex layout ignores them.
  return h('a', { class: ['wk-lab-row', !hasImage && 'wk-lab-row--text'], href: labHref(lab.slug) },
    h('span', { class: 'wk-lab-row-text' },
      h('span', { class: 'wk-lab-row-course' }, labLabel(lab)), ' ',
      h('span', { class: 'wk-lab-row-title' }, lab.title), ' ',
      h('span', { class: 'wk-lab-row-meta' },
        month,
        key ? [month ? ' · ' : null, h('span', { class: 'wk-lab-row-value' }, withUnit(key.value, key.unit))] : null,
      ),
    ),
    // The row text already names the lab, so the thumbnail is decorative here.
    hasImage ? h('span', { class: 'wk-lab-row-media' }, img({ ...lab.cover, alt: '' }, { className: 'wk-lab-row-img' })) : null,
    h('span', { class: 'wk-lab-row-arrow', 'aria-hidden': 'true' }, icon('ArrowUpRight', { size: 18 })),
  );
}

/* ── Prev / next tiles (G14 §6, G15 §5) ────────────────────────────────── */

export function prevNext(list, index, hrefFn, kind = 'project') {
  const count = list?.length ?? 0;
  if (count < 2 || index < 0) return null;
  const isLab = kind === 'lab';
  const noun = isLab ? 'lab' : 'project';
  const prev = list[(index - 1 + count) % count];
  const next = list[(index + 1) % count];

  const tile = (item, dir) => {
    // The tile's text already names the item, so the cover is decorative here.
    const cover = item.cover?.src
      ? shot({ ...item.cover, alt: '' }, {
          frame: isLab ? 'dusk' : item.frame ?? 'window',
          label: isLab ? labLabel(item) : item.slug,
          className: 'wk-pn-shot',
        })
      : null;
    return h('a', { class: ['wk-pn', `wk-pn--${dir}`], href: hrefFn(item.slug), rel: dir },
      media(isLab ? 'dusk' : item.theme ?? 'lava', cover, { ratio: '16 / 9', className: 'wk-pn-media' }),
      h('span', { class: 'wk-pn-body' },
        h('span', { class: 'wk-pn-kicker' }, `${dir === 'prev' ? 'Previous' : 'Next'} ${noun}`), ' ',
        h('span', { class: 'wk-pn-title' }, item.title),
        icon(dir === 'prev' ? 'ArrowLeft' : 'ArrowRight', { size: 22, className: 'wk-pn-arrow' }),
      ),
    );
  };

  // With two items both neighbours are the same entry, so only "Next" is shown.
  return h('nav', { class: 'wk-prevnext', 'aria-label': `More ${noun}s` },
    prev !== next ? tile(prev, 'prev') : null,
    tile(next, 'next'),
  );
}

/* ── Verdict chip (G15) ────────────────────────────────────────────────── */

const VERDICTS = {
  supported: { icon: 'CircleCheck', text: 'Hypothesis supported' },
  partial:   { icon: 'CircleDot',   text: 'Partially supported' },
  refuted:   { icon: 'CircleX',     text: 'Not supported' },
};

export function verdictChip(verdict) {
  const v = VERDICTS[verdict];
  if (!v) return null;
  return h('div', { class: ['wk-verdict', `wk-verdict--${verdict}`] },
    icon(v.icon, { size: 18 }),
    h('span', { class: 'sr-only' }, 'Verdict: '),
    v.text,
  );
}

/* ── Filtering (G5, G16) ───────────────────────────────────────────────── */

/**
 * Hides the entries `keep` rejects and replays `.wk-rise` on the rest, inside a view
 * transition when the browser has one and motion is allowed. entries: [{ el, data }].
 */
export function applyFilter(entries, keep) {
  const update = () => {
    let shown = 0;
    for (const { el, data } of entries) {
      el.hidden = !keep(data);
      el.classList.remove('wk-rise');
      if (!el.hidden) el.style.setProperty('--rise', String(Math.min(shown++, 8)));
    }
    void entries[0]?.el.offsetWidth; // flush styles so the animation restarts
    for (const { el } of entries) if (!el.hidden) el.classList.add('wk-rise');
  };
  if (typeof document.startViewTransition === 'function' && !reducedMotion()) {
    // A rapid second click skips this transition; `update` still runs, so the rejection is noise.
    document.startViewTransition(update).ready.catch(() => {});
  } else {
    update();
  }
}

/* The last filter each list showed, kept for the session so Back returns to the same layout
   (the router restores scroll against it). Keys: 'projects', 'labs-index'. */
const filterMemory = new Map();

/** The remembered value for `key`, or 'all' when nothing was picked or that option is gone. */
export function recallFilter(key, values) {
  const value = filterMemory.get(key);
  return values.includes(value) ? value : 'all';
}

export function rememberFilter(key, value) {
  filterMemory.set(key, value);
}

/** Build-time filtering: toggles `hidden` synchronously, with no transition or rise replay. */
export function presetFilter(entries, keep) {
  for (const { el, data } of entries) el.hidden = !keep(data);
}

/* ── Detail-page scaffolding (G14, G15) ────────────────────────────────── */

export const DETAIL_TITLE_ID = 'wk-detail-title';

/** Small stable string hash (FNV-1a) → a per-page lava frame. */
const hashOf = (text) => {
  let n = 2166136261;
  for (const ch of String(text ?? '')) n = Math.imul(n ^ ch.codePointAt(0), 16777619);
  return n >>> 0;
};

/** Inset hero card on one static lava frame: text bottom-left, tilted cover right (≥1024). */
export function detailHero({ theme = 'lava', seed = '', kicker = null, title, lead = null, pills = [], actions = [], extra = null, cover = null }) {
  const pillItems = pills.filter(Boolean);
  const hero = h('header', { class: 'wk-detail-hero', dataset: { wkTheme: theme } },
    h('div', { class: 'wk-detail-scrim', 'aria-hidden': 'true' }),
    h('div', { class: 'wk-detail-text' },
      kicker ? h('p', { class: 'wk-detail-kicker' }, kicker) : null,
      h('h1', { class: 'wk-detail-title', id: DETAIL_TITLE_ID, tabindex: '-1' }, title),
      lead ? h('p', { class: 'wk-detail-lead' }, lead) : null,
      pillItems.length
        ? h('ul', { class: 'wk-detail-pills', 'aria-label': 'At a glance' }, pillItems.map((pill) => h('li', null, pill)))
        : null,
      actions.length ? h('div', { class: 'wk-detail-ctas' }, actions) : null,
      extra,
    ),
    cover ? h('div', { class: 'wk-detail-cover' }, cover) : null,
  );
  // Detail pages get one static frame and no particles; each slug gets its own frame.
  mountLava(hero, { preset: theme, animate: false, t: 37 + (hashOf(seed || title) % 60), heat: 1.25 });
  return hero;
}

/** Numbered article sections: [[title, body], …] with falsy entries skipped → "01 Problem" … */
export function numberedSections(list) {
  return list.filter(Boolean).map(([title, body], i) => {
    const id = `wk-sec-${slugify(title)}`;
    return h('section', { class: 'wk-sec reveal', 'aria-labelledby': id },
      h('header', { class: 'wk-sec-head' },
        h('span', { class: 'wk-sec-index', 'aria-hidden': 'true' }, pad2(i + 1)),
        h('h2', { class: 'wk-sec-title', id }, title),
      ),
      body,
    );
  });
}

/** Sidebar facts card: dusk-strip header, facts list, labelled chip groups, full-width links. */
export function factsCard({ title, pairs, groups = [], actions = [] }) {
  const id = uid('wk-facts');
  const shownGroups = groups.filter((group) => group.node);
  return h('aside', { class: 'wk-facts', 'aria-labelledby': id },
    h('div', { class: 'card wk-facts-card' },
      h('h2', { class: 'dusk-strip wk-facts-strip', id }, title),
      h('div', { class: 'wk-facts-body' },
        dlList(pairs, { className: 'wk-facts-dl' }),
        shownGroups.map((group) => h('div', { class: 'wk-facts-group' },
          h('h3', { class: 'wk-facts-label' }, group.label),
          group.node,
        )),
        actions.length ? h('div', { class: 'wk-facts-links' }, actions) : null,
      ),
    ),
  );
}
