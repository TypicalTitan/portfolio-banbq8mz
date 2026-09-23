/**
 * Leadership & activities (spec G11): a two-column hairline list of clubs, teams and roles
 * over a low crimson pulse. Each row: icon tile · role / org / description · year range.
 */
import { h } from '../../lib/dom.js';
import { yearRange } from '../../lib/format.js';
import { sectionHead, iconTile } from '../../lib/ui.js';

const MAX_STAGGER = 5;

export function renderLeadership(content) {
  const activities = (content?.activities ?? []).filter(Boolean);
  if (!activities.length) return null;

  const sec = content.site?.sections?.leadership ?? {};
  const titleId = 'leadership-title';

  return h('section', { id: 'leadership', class: 'section xp-lead', 'aria-labelledby': titleId },
    h('div', { class: 'container' },
      sectionHead({
        eyebrow: sec.eyebrow ?? null,
        title: sec.title || 'Leadership & activities',
        accent: sec.accent ?? null,
        blurb: sec.blurb ?? null,
        id: titleId,
      }),
      // role="list" keeps list semantics in Safari once list-style is removed.
      h('ul', { class: 'xp-lead-list', role: 'list' }, activities.map(activityRow)),
    ),
  );
}

function activityRow(activity, index) {
  return h('li', { class: 'xp-lead-item reveal', style: { '--i': Math.min(index, MAX_STAGGER) } },
    iconTile(activity.icon || 'Sparkles', { variant: 'tint', size: 44 }),
    h('div', { class: 'xp-lead-text' },
      h('h3', { class: 'xp-lead-role' }, activity.role),
      activity.org ? h('p', { class: 'xp-lead-org' }, activity.org) : null,
      activity.description ? h('p', { class: 'xp-lead-desc' }, activity.description) : null,
    ),
    activity.start
      ? h('p', { class: 'xp-lead-years' }, yearRange(activity.start, activity.end ?? null))
      : null,
  );
}
