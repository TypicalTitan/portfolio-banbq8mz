/**
 * One shared requestAnimationFrame loop, the start gate (load + idle), the registry
 * behind destroyEffects(), and the lifecycle shared by the lava and particle canvases.
 */
import { reducedMotion, onReducedMotionChange } from './motion.js';

const MAX_DT = 50; // ms; returning to a throttled tab never makes particles jump

/* ── Shared loop ─────────────────────────────────────────────────────────── */

const entries = new Set();
let rafId = 0;
let lastNow = 0;

function anyActive() {
  for (const e of entries) if (e.active) return true;
  return false;
}

function kick() {
  if (rafId || document.hidden || !anyActive()) return;
  lastNow = performance.now();
  rafId = requestAnimationFrame(tick);
}

function tick(now) {
  rafId = 0;
  if (document.hidden) return;
  const frame = Math.max(0, now - lastNow);
  lastNow = now;
  let running = false;
  for (const e of entries) {
    if (!e.active) continue;
    running = true;
    e.acc += frame;
    e.since += frame;
    // 1ms tolerance so 60fps effects don't drop frames to vsync jitter.
    if (e.acc < e.interval - 1) continue;
    e.acc = Math.min(Math.max(e.acc - e.interval, 0), e.interval);
    const dt = Math.min(e.since, MAX_DT) / 1000;
    e.since = 0;
    e.t += dt;
    try {
      e.step(dt, e.t);
    } catch (err) {
      e.active = false;
      entries.delete(e);
      setTimeout(() => { throw err; });
    }
  }
  if (running) rafId = requestAnimationFrame(tick);
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) { kick(); return; }
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  });
}

/**
 * register({ step(dt, t), fps }) → { setActive(bool), unregister() }
 * `dt` is seconds since this effect last stepped (≤ 50ms); `t` is its own clock.
 */
export function register({ step, fps = 60 }) {
  const e = { step, interval: 1000 / Math.max(1, fps), acc: 0, since: 0, t: 0, active: false };
  entries.add(e);
  return {
    setActive(on) {
      on = !!on;
      if (!entries.has(e) || e.active === on) return;
      e.active = on;
      if (on) {
        e.acc = e.interval; // step on the very next frame
        e.since = 0;
        kick();
      }
    },
    unregister() {
      e.active = false;
      entries.delete(e);
    },
  };
}

/* ── Start gate ──────────────────────────────────────────────────────────── */

let ready = null;

/** Resolves once after window `load` + an idle slot (≤800ms), so effects never compete with LCP. */
export function whenReady() {
  if (!ready) {
    ready = new Promise((resolve) => {
      const idle = () => {
        if (typeof requestIdleCallback === 'function') requestIdleCallback(() => resolve(), { timeout: 800 });
        else setTimeout(resolve, 300);
      };
      if (document.readyState === 'complete') idle();
      else addEventListener('load', idle, { once: true });
    });
  }
  return ready;
}

/* ── Registry ────────────────────────────────────────────────────────────── */

const live = new Set();

/**
 * Destroys every mounted lava/particle instance. An instance whose canvas has never
 * been attached is presumed to belong to the view being swapped in (renderers run
 * before the router swaps nodes), so it is spared once and destroyed on the next call
 * if it still never made it into the document.
 */
export function destroyEffects() {
  for (const inst of [...live]) {
    if (inst.canvas.isConnected || inst.seen || inst.spared) inst.destroy();
    else inst.spared = true;
  }
}

/* ── Canvas effect lifecycle ─────────────────────────────────────────────── */

/**
 * Drives a canvas effect: waits for the start gate, sizes from a ResizeObserver
 * (first size immediately, later ones debounced 150ms), runs only while within
 * 100px of the viewport, and flips between animated and a single still frame
 * whenever reduced motion changes.
 *
 * impl: {
 *   canvas, fps, animate,
 *   resize(cssW, cssH)   reallocate buffers (always called before any paint)
 *   frame(dt)            advance by dt seconds (0 = repaint only) and draw
 *   still()              draw the static frame
 * }
 */
export function mountCanvasEffect(impl) {
  const { canvas } = impl;
  const inst = { canvas, seen: false, spared: false, destroy };
  live.add(inst);

  let io = null;
  let ro = null;
  let unsubscribe = null;
  let handle = null;
  let timer = 0;
  let w = 0;
  let h = 0;
  let near = false;
  let dirty = true;
  let painted = false;
  let dead = false;

  whenReady().then(start);

  function start() {
    if (dead) return;
    unsubscribe = onReducedMotionChange(setMode);
    if (typeof ResizeObserver === 'undefined' || typeof IntersectionObserver === 'undefined') {
      near = true;
      setMode();
      apply(canvas.clientWidth, canvas.clientHeight);
      return;
    }
    ro = new ResizeObserver(onResize);
    io = new IntersectionObserver(onIntersect, { rootMargin: '100px' });
    ro.observe(canvas);
    io.observe(canvas);
    setMode();
  }

  function onResize(list) {
    const box = list[list.length - 1].contentRect;
    if (canvas.isConnected) inst.seen = true;
    const nw = Math.round(box.width);
    const nh = Math.round(box.height);
    if (!nw || !nh) return;
    clearTimeout(timer);
    if (!w) apply(nw, nh);
    else timer = setTimeout(() => apply(nw, nh), 150);
  }

  function apply(nw, nh) {
    if (dead || !nw || !nh || (nw === w && nh === h)) return;
    w = nw;
    h = nh;
    impl.resize(w, h);
    dirty = true; // resizing cleared the backing store
    sync();
  }

  function onIntersect(list) {
    const entry = list[list.length - 1];
    if (canvas.isConnected) inst.seen = true;
    else if (inst.seen) {
      destroy(); // host was removed without destroyEffects(): clean up anyway
      return;
    }
    near = entry.isIntersecting;
    sync();
  }

  function setMode() {
    if (dead) return;
    const animated = impl.animate && !reducedMotion();
    if (animated && !handle) {
      handle = register({ step: onStep, fps: impl.fps });
      dirty = true;
    } else if (!animated && handle) {
      handle.unregister();
      handle = null;
      dirty = true;
    }
    sync();
  }

  function onStep(dt) {
    impl.frame(dt);
    dirty = false;
    markReady();
  }

  function sync() {
    if (dead || !w) return;
    if (handle) {
      handle.setActive(near);
      if (near && dirty) onStep(0); // paint now rather than show a cleared canvas for a frame
    } else if (near && dirty) {
      impl.still();
      dirty = false;
      markReady();
    }
  }

  function markReady() {
    if (painted) return;
    painted = true;
    canvas.classList.add('is-ready');
  }

  function destroy() {
    if (dead) return;
    dead = true;
    live.delete(inst);
    clearTimeout(timer);
    if (io) io.disconnect();
    if (ro) ro.disconnect();
    if (unsubscribe) unsubscribe();
    if (handle) handle.unregister();
    handle = null;
    canvas.remove();
  }

  return { destroy };
}

/** Creates the shared canvas element for an effect. */
export function effectCanvas(className) {
  const canvas = document.createElement('canvas');
  canvas.className = className;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = 1;
  canvas.height = 1;
  return canvas;
}
