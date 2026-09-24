/**
 * Sticky site nav + mobile drawer (spec §G0, §D6). Links exist only for sections that will render.
 */

import { h, focusHeading, trapTab } from '../lib/dom.js';
import { icon } from '../lib/icons.js';
import { asset, pad2 } from '../lib/format.js';
import { breakable, button, iconButton, socialLinks } from '../lib/ui.js';
import { hasFeatured, hasLabs, projectsAnchor } from '../lib/sections.js';
import { sectionHref } from '../router.js';
import { motionPaused, onReducedMotionChange, setMotionPaused } from '../effects/index.js';

const DESKTOP = '(min-width: 1024px)';
const SPY_MARGIN = '-45% 0px -50% 0px';

function navItems(content) {
  // 'Work' points at the featured rows, or at the project grid when nothing is featured.
  const work = hasFeatured(content) ? 'work' : projectsAnchor(content);
  return [
    { id: work, label: 'Work', show: Boolean(work) },
    { id: 'labs', label: 'Labs', show: hasLabs(content) },
    { id: 'experience', label: 'Experience', show: (content.experience ?? []).length > 0 },
    { id: 'about', label: 'About', show: true },
    { id: 'contact', label: 'Contact', show: true },
  ].filter((item) => item.show);
}

/** aria-pressed "Pause animations" toggle (WCAG 2.2.2); hidden by CSS when the OS already reduces motion. */
function motionToggle() {
  const btn = iconButton({
    icon: 'Pause',
    label: 'Pause animations',
    size: 44,
    className: 'nav-motion',
    onClick: () => setMotionPaused(!motionPaused()),
  });
  const pause = btn.querySelector('svg');
  pause?.classList.add('nav-motion-pause');
  btn.append(icon('Play', { size: Number(pause?.getAttribute('width')) || 20, className: 'nav-motion-play' }));
  const sync = () => btn.setAttribute('aria-pressed', String(motionPaused()));
  sync();
  onReducedMotionChange(sync);
  return btn;
}

function blackletter(text, className = '') {
  return h('span', { class: ['blackletter', className], 'data-text': text }, text);
}

export function renderNav(content) {
  const data = content ?? {};
  const person = data.person ?? {};
  const items = navItems(data);
  const resumeHref = person.resume?.href ? asset(person.resume.href) : null;
  const resumeLabel = person.resume?.label || 'Résumé';
  // Primary CTA: the résumé when there is one, otherwise "Get in touch" → the contact banner.
  const primaryButton = ({ onClick = null, ...opts }) =>
    resumeHref
      ? button({
          label: resumeLabel,
          href: resumeHref,
          variant: 'primary',
          icon: 'FileDown',
          external: true,
          ariaLabel: `${resumeLabel} (PDF)`,
          ...opts,
        })
      : button({ label: 'Get in touch', href: sectionHref('contact'), variant: 'primary', icon: 'Mail', onClick, ...opts });

  let onHome = true;

  /* ── Desktop bar ── */
  const deskLinks = items.map(({ id, label }) =>
    h('a', { class: 'nav-link', href: sectionHref(id), dataset: { section: id } }, label),
  );

  const menuBtn = h(
    'button',
    { type: 'button', class: 'nav-menu-btn', 'aria-controls': 'nav-drawer', 'aria-expanded': 'false', 'aria-label': 'Menu' },
    icon('Menu', { size: 22 }),
  );

  /* ── Drawer ── */
  let restoreFocus = true;

  const drawerLinks = items.map(({ id, label }, i) =>
    h(
      'a',
      { class: 'nav-drawer-link', href: sectionHref(id), dataset: { section: id }, onClick: () => onDrawerLink(id) },
      h('span', { class: 'nav-drawer-label' }, label),
      h('span', { class: 'nav-drawer-index', 'aria-hidden': 'true' }, pad2(i + 1)),
    ),
  );

  const email = person.email
    ? h(
        'a',
        { class: 'nav-drawer-email', href: `mailto:${person.email}` },
        icon('Mail', { size: 20 }),
        h('span', null, breakable(person.email)),
      )
    : null;

  const drawer = h(
    'dialog',
    { class: 'nav-drawer', id: 'nav-drawer', 'aria-label': 'Site menu' },
    h(
      'div',
      { class: 'nav-drawer-inner' },
      h(
        'div',
        { class: 'nav-drawer-head' },
        h('p', { class: 'nav-drawer-title' }, blackletter(person.handle || 'TypicalTitan')),
        iconButton({ icon: 'X', label: 'Close menu', onClick: () => closeDrawer(true), className: 'nav-drawer-close' }),
      ),
      h(
        'nav',
        { class: 'nav-drawer-nav', 'aria-label': 'Sections' },
        h('ol', { class: 'nav-drawer-links' }, drawerLinks.map((a, i) => h('li', { style: { '--i': i } }, a))),
      ),
      h(
        'div',
        { class: 'nav-drawer-foot' },
        email,
        socialLinks(person.socials, { className: 'nav-drawer-socials' }),
        primaryButton({ size: 'lg', className: 'nav-drawer-resume', onClick: () => onDrawerLink('contact') }),
      ),
    ),
  );

  const html = document.documentElement;

  function openDrawer() {
    if (drawer.open) return;
    restoreFocus = true;
    drawer.showModal();
    menuBtn.setAttribute('aria-expanded', 'true');
    html.classList.add('is-drawer-open');
  }

  // Runs synchronously on close() and again (as a no-op) on the async 'close' event.
  function onClosed() {
    if (menuBtn.getAttribute('aria-expanded') !== 'true') return;
    menuBtn.setAttribute('aria-expanded', 'false');
    html.classList.remove('is-drawer-open');
    if (restoreFocus) menuBtn.focus({ preventScroll: true });
  }

  function closeDrawer(restore) {
    restoreFocus = restore;
    if (drawer.open) drawer.close();
    onClosed();
  }

  // Close first, then let the default hash navigation run. On home the browser scrolls natively,
  // so focus follows the target section here; on other views the router moves focus.
  function onDrawerLink(id) {
    const wasHome = onHome;
    closeDrawer(false);
    if (wasHome) {
      requestAnimationFrame(() => focusHeading(document.getElementById(id)));
    }
  }

  menuBtn.addEventListener('click', openDrawer);
  drawer.addEventListener('close', onClosed);
  // Tab wraps inside the drawer (Close menu ↔ last link) instead of escaping to the browser chrome.
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') trapTab(e, drawer);
  });
  const desktop = window.matchMedia(DESKTOP);
  desktop.addEventListener('change', (e) => {
    if (e.matches && drawer.open) closeDrawer(false);
  });

  /* ── Header ── */
  const header = h(
    'header',
    { class: 'nav', id: 'nav-root' },
    h(
      'div',
      { class: 'nav-inner container--wide' },
      h(
        'a',
        { class: 'nav-brand', href: '#top', 'aria-label': `${person.name || person.handle || 'Home'} — home` },
        h('span', { class: 'nav-mark', 'aria-hidden': 'true' }, blackletter('T')),
        person.name ? h('span', { class: 'nav-name', 'aria-hidden': 'true' }, person.name) : null,
      ),
      items.length
        ? h('nav', { class: 'nav-links', 'aria-label': 'Primary' }, h('ul', null, deskLinks.map((a) => h('li', null, a))))
        : null,
      h('div', { class: 'nav-actions' }, motionToggle(), primaryButton({ size: 'sm', className: ['nav-resume', !resumeHref && 'nav-cta--contact'] }), menuBtn),
    ),
    drawer,
  );

  /* ── Solid state: transparent at the very top, solid once scrolled or on detail views ── */
  let atTop = true;
  let forceSolid = false;
  const syncSolid = () => header.classList.toggle('is-solid', forceSolid || !atTop);
  const sentinel = document.getElementById('top-sentinel');
  if (sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      atTop = entry.isIntersecting;
      syncSolid();
    }).observe(sentinel);
  } else {
    const onScroll = () => {
      atTop = window.scrollY < 8;
      syncSolid();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Scroll-spy (home only) ── */
  const allLinks = [...deskLinks, ...drawerLinks];
  let spy = null;

  const setActive = (id) => {
    for (const a of allLinks) {
      const on = a.dataset.section === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };

  const stopSpy = () => {
    spy?.disconnect();
    spy = null;
  };

  const startSpy = () => {
    stopSpy();
    const sections = items.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const inBand = new Set();
    // The hero is watched too: a jump straight to the top (Home key, reduced-motion scroll) may
    // produce no entry for the tracked sections, so the hero entering the band clears the link.
    const hero = document.getElementById('top');
    spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        }
        const hit = sections.find((section) => inBand.has(section));
        if (hit) {
          setActive(hit.id);
        } else if (hero && inBand.has(hero)) {
          setActive(null);
        } else {
          // Over an untracked section: light the last tracked section that starts above the band,
          // from geometry rather than scroll history, so the answer is the same in both directions.
          const probe = window.innerHeight * 0.45;
          const last = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= probe);
          setActive(last ? last.id : null);
        }
      },
      { rootMargin: SPY_MARGIN },
    );
    sections.forEach((section) => spy.observe(section));
    if (hero) spy.observe(hero);
    // Untracked blocks (skills, education, footer…) are watched only so a jump (End key, a tall
    // scroll step) that skips a tracked section's band still triggers the geometry fallback above.
    for (const el of document.querySelectorAll('main > section, footer')) {
      if (el !== hero && !sections.includes(el)) spy.observe(el);
    }
  };

  window.addEventListener('app:route', (e) => {
    onHome = e.detail?.name === 'home';
    if (drawer.open) closeDrawer(false);
    forceSolid = !onHome;
    if (onHome) {
      startSpy();
    } else {
      stopSpy();
      setActive(null);
    }
    syncSolid();
  });

  /* ── Skip link: focus <main> without touching the hash ── */
  const skip = document.querySelector('.skip-link');
  if (skip && !skip.dataset.bound) {
    skip.dataset.bound = 'true';
    skip.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('main')?.focus();
    });
  }

  return header;
}
