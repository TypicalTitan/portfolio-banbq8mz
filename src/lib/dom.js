/**
 * Tiny DOM builders (spec §C1). All content goes through text nodes; there is no HTML parsing here.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

function isChildLike(value) {
  return typeof value === 'string' || typeof value === 'number' || Array.isArray(value) || value instanceof Node;
}

function applyProps(el, props) {
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;

    if (key === 'class' || key === 'className') {
      const cls = Array.isArray(value) ? value.flat(Infinity).filter(Boolean).join(' ') : String(value);
      if (cls) el.setAttribute('class', cls);
    } else if (key === 'style') {
      if (typeof value === 'string') {
        el.style.cssText = value;
      } else {
        for (const [prop, v] of Object.entries(value)) {
          if (v === undefined || v === null || v === false) continue;
          // Custom props and dashed names need setProperty; camelCase works as a property.
          if (prop.includes('-')) el.style.setProperty(prop, String(v));
          else el.style[prop] = v;
        }
      }
    } else if (key === 'dataset') {
      for (const [k, v] of Object.entries(value)) {
        if (v === undefined || v === null || v === false) continue;
        el.dataset[k] = v === true ? '' : String(v);
      }
    } else if (key === 'text') {
      el.textContent = String(value);
    } else if (key.startsWith('on') && key.length > 2 && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value === true ? '' : String(value));
    }
  }
}

function appendChildren(parent, children) {
  for (const child of children) {
    if (child === null || child === undefined || child === false || child === true) continue;
    if (Array.isArray(child)) appendChildren(parent, child);
    else if (child instanceof Node) parent.appendChild(child);
    else parent.appendChild(document.createTextNode(String(child)));
  }
  return parent;
}

function build(el, props, children) {
  // Allow h('p', 'text') / h('ul', [items]) when props are omitted.
  if (props !== null && props !== undefined && isChildLike(props)) {
    children.unshift(props);
    props = null;
  }
  if (props) applyProps(el, props);
  return appendChildren(el, children);
}

/** Create an HTML element. See §C1 for the props rules. */
export function h(tag, props = null, ...children) {
  return build(document.createElement(tag), props, children);
}

/** Create an SVG-namespace element with the same props rules as h(). */
export function s(tag, props = null, ...children) {
  return build(document.createElementNS(SVG_NS, tag), props, children);
}

export function frag(...children) {
  return appendChildren(document.createDocumentFragment(), children);
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Wrap the first case-sensitive occurrence of `accent` in <span class="accent">. */
export function splitAccent(text, accent) {
  const str = text === null || text === undefined ? '' : String(text);
  if (!accent) return [str];
  const at = str.indexOf(accent);
  if (at === -1) return [str];
  const before = str.slice(0, at);
  const after = str.slice(at + accent.length);
  return [before, h('span', { class: 'accent' }, accent), after].filter((part) => part !== '');
}

let announceTimer = 0;
/** Polite screen-reader announcement through #live. Clearing first makes repeats audible. */
export function announce(message) {
  const live = document.getElementById('live');
  if (!live) return;
  clearTimeout(announceTimer);
  live.textContent = '';
  announceTimer = setTimeout(() => {
    live.textContent = String(message ?? '');
  }, 50);
}

let uidCount = 0;
export function uid(prefix = 'id') {
  uidCount += 1;
  return `${prefix}-${uidCount.toString(36)}`;
}

export function slugify(str) {
  return String(str ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Move focus to a section's heading (its aria-labelledby target, else its first heading, else itself)
 * without scrolling. Adds tabindex="-1" on the fly when the target is not focusable. Shell addition.
 */
export function focusHeading(target) {
  if (!target) return;
  const labelledBy = target.getAttribute('aria-labelledby');
  const heading =
    (labelledBy && document.getElementById(labelledBy.split(/\s+/)[0])) ||
    target.querySelector('h1, h2, h3') ||
    target;
  if (!heading.matches('a[href], button, input, select, textarea, [tabindex]')) heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
}

/**
 * Keeps Tab cycling inside a modal (dialog, drawer) instead of escaping to the browser chrome.
 * Call from the root's keydown handler when event.key === 'Tab'. Shell addition.
 */
export function trapTab(event, root) {
  const focusable = [...root.querySelectorAll('button:not([disabled]), a[href]')]
    .filter((el) => el.tabIndex !== -1 && el.getClientRects().length > 0);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey ? active === first || active === root || !root.contains(active) : active === last || !root.contains(active)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  }
}
