/**
 * G10 · Education & honors: school cards on the left (dusk-strip header, GPA numerals, honors,
 * coursework), awards and certifications as Playcast-rhythm rows on the right (#awards).
 */

import { h } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';
import { dateRange } from '../../lib/format.js';
import { chipList, iconTile, sectionHead, statRow } from '../../lib/ui.js';
import { projectHref } from '../../router.js';

export function renderEducation(content) {
  const schools = (content.education ?? []).filter((s) => s?.school);
  const awards = (content.awards ?? []).filter((a) => a?.title);
  if (!schools.length && !awards.length) return null;

  const copy = content.site?.sections?.education ?? {};
  const projectTitles = new Map((content.projects ?? []).map((p) => [p.slug, p.title]));
  const single = !schools.length || !awards.length;

  return h('section', { id: 'education', class: 'section hm-edu', 'aria-labelledby': 'education-title' },
    h('div', { class: 'container' },
      sectionHead({
        eyebrow: copy.eyebrow ?? null,
        title: copy.title || 'Education',
        accent: copy.accent ?? null,
        blurb: copy.blurb ?? null,
        id: 'education-title',
      }),
      h('div', { class: ['hm-edu-grid', single && 'hm-edu-grid--single'] },
        schools.length
          ? h('div', { class: 'hm-edu-schools reveal', style: { '--i': 0 } }, schools.map(schoolCard))
          : null,
        awards.length ? awardsBlock(awards, projectTitles) : null,
      ),
    ),
  );
}

function schoolCard(school) {
  const gpa = school.showGpa && school.gpa?.unweighted
    ? [
        { value: String(school.gpa.unweighted), unit: null, label: 'Unweighted GPA' },
        school.gpa.weighted ? { value: String(school.gpa.weighted), unit: null, label: 'Weighted' } : null,
      ].filter(Boolean)
    : [];

  return h('article', { class: 'hm-edu-card card' },
    h('div', { class: 'dusk-strip hm-edu-strip' },
      h('span', null, 'Education'),
      school.start || school.end
        ? h('span', { class: 'hm-edu-dates' }, dateRange(school.start, school.end, { expected: Boolean(school.expected) }))
        : null,
    ),
    h('div', { class: 'hm-edu-body' },
      h('h3', { class: 'hm-edu-school' }, school.school),
      school.program ? h('p', { class: 'hm-edu-program' }, school.program) : null,
      school.location ? h('p', { class: 'hm-edu-location' }, school.location) : null,
      gpa.length ? statRow(gpa, { className: 'hm-edu-gpa', size: 'md' }) : null,
      school.honors?.length
        ? h('ul', { class: 'hm-edu-honors', 'aria-label': 'Honors' },
            school.honors.map((honor) => h('li', null, icon('Award', { size: 16 }), h('span', null, honor))))
        : null,
      school.coursework?.length
        ? [
            h('p', { class: 'hm-edu-micro' }, 'Relevant coursework'),
            chipList(school.coursework, { brandKey: null }),
          ]
        : null,
    ),
  );
}

/** Awards first, then certifications; newest first within each. */
function awardsBlock(awards, projectTitles) {
  const rank = (a) => (a.kind === 'certification' ? 1 : 0);
  const sorted = [...awards].sort((a, b) => rank(a) - rank(b) || String(b.date ?? '').localeCompare(String(a.date ?? '')));

  return h('div', { id: 'awards', class: 'hm-awards reveal', style: { '--i': 1 } },
    h('h3', { id: 'awards-title', class: 'hm-awards-title' }, icon('Trophy', { size: 22 }), 'Awards & certifications'),
    h('ul', { class: 'hm-awards-list' }, sorted.map((award) => awardRow(award, projectTitles))),
  );
}

function awardRow(award, projectTitles) {
  const cert = award.kind === 'certification';
  const sub = [award.issuer, award.detail].filter(Boolean).join(' · ');
  const projectTitle = award.project ? projectTitles.get(award.project) : null;
  const year = String(award.date ?? '').slice(0, 4);

  return h('li', { class: 'hm-award' },
    h('span', { class: 'hm-award-year' }, year ? h('time', { datetime: award.date }, year) : null),
    iconTile(cert ? 'BadgeCheck' : 'Trophy', { variant: cert ? 'tint' : 'violet', size: 40 }),
    h('div', { class: 'hm-award-text' },
      h('p', { class: 'hm-award-title' },
        h('span', { class: 'sr-only' }, cert ? 'Certification: ' : 'Award: '), award.title),
      sub ? h('p', { class: 'hm-award-sub' }, sub) : null,
      projectTitle
        ? h('p', { class: 'hm-award-more' },
            h('a', { class: 'link-arrow', href: projectHref(award.project) },
              'See project', h('span', { class: 'sr-only' }, `: ${projectTitle}`)))
        : null,
    ),
    award.url
      ? h('a', { class: 'link-arrow hm-award-link', href: award.url, target: '_blank', rel: 'noopener' },
          'Credential',
          h('span', { class: 'sr-only' }, `: ${award.title} (opens in new tab)`))
      : null,
  );
}
