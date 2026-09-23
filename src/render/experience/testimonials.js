/**
 * Kind words (spec G12): reference quotes from teachers and supervisors.
 * One quote is centred at max 820px; two or more flow into an auto-fit grid.
 */
import { h } from '../../lib/dom.js';
import { sectionHead } from '../../lib/ui.js';

const MAX_STAGGER = 5;

export function renderTestimonials(content) {
  const quotes = (content?.testimonials ?? []).filter((t) => t?.quote);
  if (!quotes.length) return null;

  const sec = content.site?.sections?.kindWords ?? {};
  const titleId = 'kind-words-title';

  return h('section', { id: 'kind-words', class: 'section xp-quotes', 'aria-labelledby': titleId },
    h('div', { class: 'container' },
      sectionHead({
        eyebrow: sec.eyebrow ?? null,
        title: sec.title || 'Kind words',
        accent: sec.accent ?? null,
        blurb: sec.blurb ?? null,
        id: titleId,
      }),
      h('div', { class: ['xp-quotes-grid', quotes.length === 1 && 'xp-quotes-grid--solo'] },
        quotes.map(quoteCard)),
    ),
  );
}

function quoteCard(t, index) {
  // Each part wraps as a unit, so "Teacher, 2 years" never splits across lines.
  const parts = [t.role, t.relationship].filter(Boolean);
  const meta = parts.length
    ? parts.flatMap((part, i) => [i ? ' · ' : null, h('span', null, part)])
    : null;
  return h('figure', { class: 'xp-quote-card reveal', style: { '--i': Math.min(index, MAX_STAGGER) } },
    // The one decorative blackletter glyph on the site (spec F, G12).
    h('span', { class: 'blackletter xp-quote-mark', dataset: { text: '“' }, 'aria-hidden': 'true' }, '“'),
    h('blockquote', { class: 'xp-quote-card-text' }, h('p', null, t.quote)),
    t.name || meta
      ? h('figcaption', { class: 'xp-quote-card-by' },
          t.name ? h('span', { class: 'xp-quote-card-name' }, t.name) : null,
          meta ? h('span', { class: 'xp-quote-card-meta' }, meta) : null,
        )
      : null,
  );
}
