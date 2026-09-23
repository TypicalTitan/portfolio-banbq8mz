/**
 * G2 · Proof strip: four big thin numerals right under the hero, each linking to its evidence.
 */

import { h } from '../../lib/dom.js';
import { statRow } from '../../lib/ui.js';

export function renderProof(content) {
  const stats = Array.isArray(content.stats) ? content.stats.filter(Boolean) : autoStats(content);
  if (!stats.length) return null;

  return h('section', { id: 'proof', class: 'hm-proof', 'aria-label': 'At a glance' },
    h('div', { class: 'container' }, statRow(stats, { className: 'hm-proof-row', size: 'lg' })),
  );
}

/** Counts that are zero are dropped so a stat never links to a section that does not exist. */
function autoStats(content) {
  const projects = content.projects ?? [];
  const labs = content.labs ?? [];
  const experience = content.experience ?? [];
  const awards = content.awards ?? [];
  const school = content.education?.[0];
  const gpa = school?.showGpa ? school.gpa?.unweighted : null;

  const count = (n, one, many, href) => (n ? { value: String(n), unit: null, label: n === 1 ? one : many, href } : null);

  return [
    count(projects.length, 'Project', 'Projects', '#projects'),
    count(labs.length, 'Lab report', 'Lab reports', '#labs'),
    count(experience.length, 'Role', 'Roles', '#experience'),
    gpa
      ? { value: String(gpa), unit: null, label: 'GPA (unweighted)', href: '#education' }
      : count(awards.length, 'Award or cert', 'Awards & certs', '#education'),
  ].filter(Boolean);
}
