/**
 * Motion preference (live) and device performance tier.
 */

const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
const listeners = new Set();
const STORE_KEY = 'motion-paused';

// The on-page "Pause animations" override (WCAG 2.2.2), remembered per viewer when storage works.
let paused = false;
try {
  paused = localStorage.getItem(STORE_KEY) === '1';
} catch {
  paused = false;
}
if (typeof document !== 'undefined') document.documentElement.classList.toggle('motion-paused', paused);

function notify() {
  const reduced = reducedMotion();
  for (const cb of [...listeners]) cb(reduced);
}

if (mq) {
  if (mq.addEventListener) mq.addEventListener('change', notify);
  else if (mq.addListener) mq.addListener(notify);
}

/** Live read of `prefers-reduced-motion: reduce`, or the viewer's on-page pause. */
export function reducedMotion() {
  return (!!mq && mq.matches) || paused;
}

/** Live read of the OS setting alone (the pause toggle hides itself when this is on). */
export function systemReducedMotion() {
  return !!mq && mq.matches;
}

/** Whether the viewer paused animations with the on-page toggle. */
export function motionPaused() {
  return paused;
}

/** Pauses (or resumes) every looping effect: canvases drop to their still frame, CSS loops stop. */
export function setMotionPaused(on) {
  paused = !!on;
  document.documentElement.classList.toggle('motion-paused', paused);
  try {
    if (paused) localStorage.setItem(STORE_KEY, '1');
    else localStorage.removeItem(STORE_KEY);
  } catch {
    /* storage blocked: the pause still applies to this visit */
  }
  notify();
}

/** Calls `cb(reduced)` whenever the OS setting or the on-page pause flips. Returns unsubscribe(). */
export function onReducedMotionChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** 'low' on small screens, ≤4 cores, ≤4 GB memory or Save-Data; otherwise 'high'. */
export function perfTier() {
  const nav = typeof navigator === 'undefined' ? {} : navigator;
  const cores = nav.hardwareConcurrency;
  const memory = nav.deviceMemory;
  const saveData = !!(nav.connection && nav.connection.saveData);
  const narrow = typeof innerWidth === 'number' && innerWidth < 768;
  const low = (cores !== undefined && cores <= 4) || (memory !== undefined && memory <= 4) || saveData || narrow;
  return low ? 'low' : 'high';
}
