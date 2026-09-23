/**
 * Featured work (spec G4): Antares-style alternating split rows for the flagship projects.
 * Text column (tile + title, meta, summary, metrics, tags, CTAs) beside a themed media stage
 * where the cover shot rises from the bottom edge, optionally with a gallery shot peeking behind.
 */
import { h } from '../../lib/dom.js';
import { button, chipList, iconTile, media, sectionHead, shot, statRow } from '../../lib/ui.js';
import { projectHref } from '../../router.js';
import { featuredProjects, joinMeta, linkArrow, repoButton, resolveHref, teamLabel } from './shared.js';

export function renderFeatured(content) {
  const projects = featuredProjects(content?.projects);
  if (!projects.length) return null;

  const sec = content.site?.sections?.work ?? {};
  const titleId = 'work-title';

  return h('section', { id: 'work', class: 'section wk-featured', 'aria-labelledby': titleId },
    h('div', { class: 'container' },
      sectionHead({
        eyebrow: sec.eyebrow ?? null,
        title: sec.title || 'Featured work',
        accent: sec.accent ?? null,
        blurb: sec.blurb ?? null,
        id: titleId,
      }),
      h('div', { class: 'wk-rows' }, projects.map(featureRow)),
    ),
  );
}

function featureRow(p, index) {
  const titleId = `wk-row-${p.slug}-title`;
  const href = projectHref(p.slug);
  const watch = p.links?.video || p.links?.demo;

  return h('article', { class: ['wk-row', index % 2 === 1 && 'wk-row--flip'], 'aria-labelledby': titleId },
    h('div', { class: 'wk-row-text reveal', style: { '--i': 0 } },
      h('div', { class: 'wk-row-title' },
        p.icon ? iconTile(p.icon, { variant: 'crimson', size: 64 }) : null,
        h('h3', { id: titleId }, p.title),
      ),
      h('p', { class: 'wk-row-meta' }, joinMeta([p.year, teamLabel(p.team), p.role])),
      p.summary ? h('p', { class: 'wk-row-summary' }, p.summary) : null,
      statRow(p.metrics?.slice(0, 3), { size: 'md', className: 'wk-row-stats' }),
      chipList(p.tags?.slice(0, 5)),
      h('div', { class: 'wk-row-ctas' },
        button({ label: 'Case study', href, iconEnd: 'ArrowRight', ariaLabel: `Case study: ${p.title}` }),
        repoButton(p.links?.repo),
        watch ? linkArrow('Watch demo', resolveHref(watch), { context: `of ${p.title}` }) : null,
      ),
    ),
    // Pointer shortcut only: the 'Case study' button is the keyboard / screen-reader stop (like the hero collage).
    h('a', { class: 'wk-row-media reveal', style: { '--i': 1 }, href, tabindex: '-1', 'aria-hidden': 'true' },
      media(p.theme ?? 'lava',
        h('div', { class: 'wk-row-shotwrap' },
          peek(p),
          shot(p.cover, { frame: p.frame ?? 'window', label: p.slug, className: 'wk-row-shot' }),
        ),
        { ratio: '16 / 10', className: 'wk-row-stage' }),
    ),
  );
}

/** gallery[0] tilted behind the cover: purely decorative, so it stays out of the a11y tree. */
function peek(p) {
  const image = p.gallery?.[0];
  if (!image?.src || image.src === p.cover?.src) return null;
  const el = shot({ ...image, alt: '' }, { frame: p.frame ?? 'window', label: '', className: 'wk-row-peek' });
  el?.setAttribute('aria-hidden', 'true');
  return el;
}
