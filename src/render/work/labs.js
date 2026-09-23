/**
 * Lab notebook (spec G6): a Riot-style featured lab (dusk-framed figure, meta, objective,
 * headline result) beside a list of the next four labs, newest first.
 */
import { h } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';
import { button, sectionHead, shot, stat } from '../../lib/ui.js';
import { labHref } from '../../router.js';
import { joinMeta, labLabel, labRow, labsByDate, linkArrow, monthOf, partnersLabel, pointerOnly } from './shared.js';

const LIST_SIZE = 4;
const INDEX_THRESHOLD = 5; // the "All labs" action appears once there are more labs than fit here

export function renderLabs(content) {
  const labs = labsByDate(content?.labs);
  if (!labs.length) return null;

  const sec = content.site?.sections?.labs ?? {};
  const titleId = 'labs-title';
  const feature = content.labs.find((lab) => lab?.featured) ?? labs[0];
  const rest = labs.filter((lab) => lab !== feature).slice(0, LIST_SIZE);

  return h('section', { id: 'labs', class: 'section wk-labs', 'aria-labelledby': titleId },
    h('div', { class: 'container' },
      sectionHead({
        eyebrow: sec.eyebrow ?? null,
        title: sec.title || 'Lab notebook',
        accent: sec.accent ?? null,
        blurb: sec.blurb ?? null,
        id: titleId,
        action: labs.length > INDEX_THRESHOLD
          ? button({ label: `All labs (${labs.length})`, href: '#/labs', variant: 'outline', size: 'sm' })
          : null,
      }),
      h('div', { class: ['wk-labs-grid', !rest.length && 'wk-labs-grid--solo'] },
        featureLab(feature),
        rest.length
          ? h('ul', { class: 'wk-lab-list', 'aria-label': 'More lab reports' },
              rest.map((lab, i) => h('li', { class: 'reveal', style: { '--i': i + 1 } }, labRow(lab))))
          : null,
      ),
    ),
  );
}

function featureLab(lab) {
  const titleId = 'wk-lab-feature-title';
  const href = labHref(lab.slug);
  const key = lab.results?.keyValues?.[0];

  return h('article', { class: 'wk-lab-feature reveal', 'aria-labelledby': titleId },
    lab.cover?.src ? shot(lab.cover, { frame: 'dusk', label: labLabel(lab), className: 'wk-lab-feature-shot' }) : null,
    h('h3', { class: 'wk-lab-feature-title', id: titleId }, h('a', { href }, lab.title)),
    h('p', { class: 'wk-lab-meta' },
      h('span', { class: 'wk-lab-meta-icon' }, icon(lab.icon || 'FlaskConical', { size: 16 })),
      h('span', null, joinMeta([lab.subject, monthOf(lab.date), partnersLabel(lab.partners)])),
    ),
    lab.objective ? h('p', { class: 'wk-lab-objective' }, lab.objective) : null,
    key
      ? h('div', { class: 'wk-lab-result' },
          stat(key, { size: 'md' }),
          key.note ? h('p', { class: 'wk-lab-note' }, key.note) : null,
        )
      : null,
    // The stretched title link is the keyboard stop; this CTA repeats it for pointers.
    pointerOnly(linkArrow('Read the lab report', href, { className: 'wk-lab-feature-link' })),
  );
}
