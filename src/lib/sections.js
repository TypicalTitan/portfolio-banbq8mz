/**
 * Which home sections render for a given content object. The nav, footer, hero, proof strip,
 * 404 page and detail pages all link into home sections, so they ask here instead of guessing;
 * that way no link can ever point at a section that was hidden for being empty or redundant.
 */

/** Featured rows (and the hero collage) show at most this many projects. */
export const FEATURED_LIMIT = 3;

const list = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

/** Up to `limit` projects flagged `featured`, by `order` (content order breaks ties). */
export function featuredProjects(projects, limit = FEATURED_LIMIT) {
  const order = (p) => (Number.isFinite(p.order) ? p.order : Infinity);
  return list(projects).filter((p) => p.featured).sort((a, b) => order(a) - order(b)).slice(0, limit);
}

export function hasFeatured(content) {
  return list(content?.projects).some((p) => p.featured);
}

/**
 * The "All projects" grid renders unless it would only repeat the Featured rows: every project is
 * featured and they all fit in the featured-row limit.
 */
export function hasProjectGrid(content) {
  const projects = list(content?.projects);
  if (!projects.length) return false;
  return !(projects.every((p) => p.featured) && projects.length <= FEATURED_LIMIT);
}

export function hasLabs(content) {
  return list(content?.labs).length > 0;
}

/**
 * The best in-page target for "see the projects": the grid when it renders, else the featured
 * rows, else null (no projects at all).
 */
export function projectsAnchor(content) {
  if (hasProjectGrid(content)) return 'projects';
  if (hasFeatured(content)) return 'work';
  return null;
}

/**
 * Old or hand-typed '#id' links to sections that do not render, mapped to the closest one that
 * does (e.g. '#projects' → '#work' when the grid is folded into the featured rows).
 */
export function anchorFallbacks(content) {
  const out = {};
  const projects = projectsAnchor(content);
  if (projects && projects !== 'projects') out.projects = projects;
  if (projects && !hasFeatured(content)) out.work = projects;
  return out;
}
