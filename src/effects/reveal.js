/**
 * Reveal-on-scroll: adds `.is-in` once to `.reveal` elements (and `.fx-draw` thorn
 * SVGs, which draw themselves in) as they enter the viewport.
 */
import { reducedMotion, onReducedMotionChange } from './motion.js';

const SELECTOR = '.reveal, .fx-draw';
const SAFETY_MS = 2500;
const RISE_MS = 1000; // 600ms rise + the max stagger (--i ≤ 5 × 60ms) + slack

let io = null;
let unsubscribe = null;
const pending = new Set();

function show(el) {
  pending.delete(el);
  if (io) io.unobserve(el);
  el.classList.add('is-in');
  // Once risen, hand `transition` back to the component (see effects.css).
  if (el.classList.contains('reveal')) {
    if (reducedMotion()) el.classList.add('is-done');
    else setTimeout(() => el.classList.add('is-done'), RISE_MS);
  }
}

function observer() {
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) show(entry.target);
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  }
  if (!unsubscribe) {
    unsubscribe = onReducedMotionChange((reduced) => {
      if (reduced) [...pending].forEach(show);
    });
  }
  return io;
}

function track(els) {
  const fresh = els.filter((el) => !el.classList.contains('is-in'));
  if (!fresh.length) return;
  if (reducedMotion() || typeof IntersectionObserver === 'undefined') {
    fresh.forEach(show);
    return;
  }
  const obs = observer();
  for (const el of fresh) {
    pending.add(el);
    obs.observe(el);
  }
  // Safety net: nothing stays invisible if the observer never reports it.
  setTimeout(() => {
    for (const el of fresh) if (pending.has(el)) show(el);
  }, SAFETY_MS);
}

/** Observes every `.reveal` (and `.fx-draw`) inside `root`, including root itself. */
export function initReveal(root) {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  const els = [...root.querySelectorAll(SELECTOR)];
  if (typeof root.matches === 'function' && root.matches(SELECTOR)) els.unshift(root);
  track(els);
}

/** Observes a single element (thorn SVGs register themselves at build time). */
export function observeReveal(el) {
  track([el]);
}
