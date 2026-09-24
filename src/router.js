/**
 * Hash router (spec §C5, §D5). Only '#/…' hashes are routes; '#id' is an in-page anchor on home.
 */

import { announce, focusHeading } from './lib/dom.js';
import { destroyEffects, initReveal, reducedMotion } from './effects/index.js';

export function projectHref(slug) {
  return '#/projects/' + slug;
}

export function labHref(slug) {
  return '#/labs/' + slug;
}

export function sectionHref(id) {
  return '#' + id;
}

function decode(part) {
  try {
    return decodeURIComponent(part);
  } catch {
    return part;
  }
}

export function parseHash(hash) {
  let raw = String(hash ?? '');
  if (raw.startsWith('#')) raw = raw.slice(1);
  if (raw === '' || raw === '/') return { name: 'home' };
  if (!raw.startsWith('/')) return { name: 'home', anchor: decode(raw) };

  const parts = raw.slice(1).split('/');
  if (parts.length > 1 && parts[parts.length - 1] === '') parts.pop(); // tolerate a trailing slash
  if (parts.length > 2) return { name: '404' };
  const [section, slug] = parts.map(decode);

  if (section === 'projects') return slug ? { name: 'project', slug } : { name: 'home', anchor: 'projects' };
  if (section === 'labs') return slug ? { name: 'lab', slug } : { name: 'labs' };
  return { name: '404' };
}

/**
 * Run a scroll without the CSS smooth behaviour (route changes jump; in-page links glide).
 * Callers also pass behavior:'instant', because inside a view-transition update the inline
 * style change is not yet applied and the scroll would otherwise glide from the old position.
 */
function jump(fn) {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  fn();
  root.style.scrollBehavior = prev;
}

function afterPaint(fn) {
  requestAnimationFrame(() => requestAnimationFrame(fn));
}

function toNodes(out) {
  return (Array.isArray(out) ? out : [out]).filter((node) => node instanceof Node);
}


/**
 * views: { home(), project(slug), lab(slug), labs(), notFound() } → Node | Node[] | null.
 * homeTitle / personName are optional; they default to the document's initial title and no suffix.
 * anchorFallbacks maps a section id that may not render to one that does ({ projects: 'work' }), so
 * old or hand-typed '#projects' links still land somewhere sensible.
 *
 * Scroll memory: the list views (home and #/labs) stamp their scroll offset into their own history
 * entry (history.state.y), so Back / Forward / reload return to the exact spot. An entry without a
 * saved offset is a fresh link, so it scrolls to its '#id' anchor (or the top) instead.
 */
export function startRouter({ main, views, homeTitle = document.title, personName = '', anchorFallbacks = {} }) {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  let current = null;
  // view name → { href, index, section } of the link that last left that view.
  const returnFocus = new Map();
  let quietUntil = 0; // scroll events caused by our own restores are not recorded
  let scrollTimer = 0;

  const keepsScroll = (route) => route?.name === 'home' || route?.name === 'labs';

  const savedY = () => {
    const y = history.state?.y;
    return typeof y === 'number' && Number.isFinite(y) ? y : null;
  };

  const stamp = () => {
    try {
      history.replaceState({ ...(history.state ?? {}), y: Math.round(window.scrollY) }, '');
    } catch {
      /* some embedded browsers refuse replaceState; Back then falls back to the anchor */
    }
  };

  // Debounced recorder. It re-checks the URL, so a timer that fires after Back / Forward
  // can never stamp the entry the user just arrived at.
  window.addEventListener('scroll', () => {
    if (!keepsScroll(current) || performance.now() < quietUntil) return;
    clearTimeout(scrollTimer);
    const href = location.href;
    scrollTimer = setTimeout(() => {
      if (location.href === href && keepsScroll(current)) stamp();
    }, 120);
  }, { passive: true });

  // A hash link is about to add an entry: save this one first (the debounce may still be pending).
  document.addEventListener('click', (event) => {
    if (!keepsScroll(current)) return;
    const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;
    clearTimeout(scrollTimer);
    stamp();
  }, true);

  window.addEventListener('pagehide', () => {
    if (keepsScroll(current)) stamp();
  });

  const titleFor = (route, nodes) => {
    if (route.name === 'home') return { doc: homeTitle, spoken: homeTitle };
    const own = nodes[0]?.dataset?.title;
    if (!own) return { doc: homeTitle, spoken: homeTitle };
    return { doc: personName ? `${own} · ${personName}` : own, spoken: own };
  };

  const build = (route) => {
    const make = {
      home: () => views.home(),
      project: () => views.project(route.slug),
      lab: () => views.lab(route.slug),
      labs: () => views.labs(),
    }[route.name];
    try {
      const nodes = make ? toNodes(make()) : [];
      if (nodes.length || route.name === 'home') return { route, nodes };
    } catch (err) {
      // One malformed content field must not strand the old view half torn down.
      console.error(`Could not render the "${route.name}" view:`, err);
    }
    return { route: { name: '404' }, nodes: toNodes(views.notFound()) };
  };

  const linksTo = (href) =>
    [...main.querySelectorAll('a[href]')].filter((a) => a.getAttribute('href') === href && a.tabIndex !== -1);

  /** Focuses the link that left `view` — the same occurrence when one URL is linked more than once. */
  const focusReturn = (view) => {
    const info = returnFocus.get(view);
    if (!info) return false;
    const same = linksTo(info.href);
    const link =
      same[info.index] ??
      (info.section ? same.find((a) => a.closest('section[id]')?.id === info.section) : null) ??
      same[0];
    link?.focus({ preventScroll: true });
    return Boolean(link);
  };

  const restoreY = (y) => {
    quietUntil = performance.now() + 400;
    jump(() => window.scrollTo({ top: y, left: 0, behavior: 'instant' }));
  };

  /** Returns false when the anchor is not on the page. */
  const anchorTarget = (anchor) =>
    document.getElementById(anchor) ??
    (Object.hasOwn(anchorFallbacks, anchor) ? document.getElementById(anchorFallbacks[anchor]) : null);

  const scrollToAnchor = (anchor, { smooth }) => {
    const target = anchorTarget(anchor);
    if (!target) return false;
    if (smooth) target.scrollIntoView({ block: 'start' });
    else jump(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
    focusHeading(target);
    return true;
  };

  const position = (route, prev, spoken, initial) => {
    const y = keepsScroll(route) ? savedY() : null;
    const fromOtherView = Boolean(prev) && prev.name !== route.name;

    if (route.name === 'home') {
      if (y !== null) {
        // Back / Forward / reload: the exact spot, not the entry's anchor.
        restoreY(y);
        if (initial) afterPaint(() => restoreY(y)); // again once fonts and images have laid out
        if (fromOtherView) {
          focusReturn('home');
          announce(spoken);
        }
      } else if (route.anchor) {
        afterPaint(() => {
          if (scrollToAnchor(route.anchor, { smooth: false }) || !fromOtherView) return;
          // Stale link to a section that no longer renders: top of home, not the old offset.
          restoreY(0);
          focusHeading(main.querySelector('section[id]') ?? main);
          announce(spoken);
        });
      } else if (fromOtherView) {
        restoreY(0);
        focusReturn('home');
        announce(spoken);
      }
      return;
    }

    if (y !== null) restoreY(y);
    else jump(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }));
    if (y === null || !focusReturn(route.name)) {
      const h1 = main.querySelector('h1[tabindex="-1"]') ?? main.querySelector('h1');
      h1?.focus({ preventScroll: true });
    }
    announce(spoken);
  };

  const render = (requested, initial) => {
    const prev = current;
    clearTimeout(scrollTimer);

    if (keepsScroll(prev) && requested.name !== prev.name) {
      const active = document.activeElement;
      const href = active && main.contains(active) ? active.getAttribute('href') : null;
      if (href) {
        returnFocus.set(prev.name, {
          href,
          index: linksTo(href).indexOf(active),
          section: active.closest('section[id]')?.id ?? null,
        });
      } else {
        returnFocus.delete(prev.name);
      }
    }

    // Build first: the old view's effects go only once the new view exists (unattached
    // canvases from the build are spared by destroyEffects()).
    const { route, nodes } = build(requested);
    destroyEffects();
    current = route;
    const { doc, spoken } = titleFor(route, nodes);

    const apply = () => {
      main.replaceChildren(...nodes);
      initReveal(main);
      document.title = doc;
      window.dispatchEvent(new CustomEvent('app:route', { detail: route }));
      position(route, prev, spoken, initial);
    };

    if (!initial && typeof document.startViewTransition === 'function' && !reducedMotion()) {
      const transition = document.startViewTransition(apply);
      transition.ready.catch(() => {}); // a skipped transition still runs `apply`
    } else {
      apply();
    }
  };

  const onHashChange = () => {
    const route = parseHash(location.hash);

    if (current?.name === 'home' && route.name === 'home') {
      current = route;
      clearTimeout(scrollTimer);
      // Back / Forward between in-page anchors: with manual restoration the browser won't scroll.
      const y = savedY();
      if (y !== null) {
        restoreY(y);
        return;
      }
      // A fresh '#id' click was already scrolled by the browser (unless the id is missing and only
      // a fallback exists); '#/…' aliases need a manual scroll.
      if (!location.hash.startsWith('#/')) {
        if (route.anchor && !document.getElementById(route.anchor)) scrollToAnchor(route.anchor, { smooth: true });
        return;
      }
      if (route.anchor) scrollToAnchor(route.anchor, { smooth: true });
      else window.scrollTo({ top: 0 });
      return;
    }
    render(route, false);
  };

  window.addEventListener('hashchange', onHashChange);
  render(parseHash(location.hash), true);
}
