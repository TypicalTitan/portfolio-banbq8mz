/**
 * Gallery grid + <dialog> lightbox (spec G14 §5; lab figures in G15 reuse it with heading:null).
 * Each gallery owns one modal dialog: it traps Tab, pages with ←/→ and the prev/next buttons,
 * closes on Esc, the X or a backdrop click, and hands focus back to the thumbnail that opened it.
 */
import { h, trapTab, uid } from '../../lib/dom.js';
import { icon } from '../../lib/icons.js';
import { asset } from '../../lib/format.js';
import { iconButton, img } from '../../lib/ui.js';

export function renderGallery(items, { heading = 'Gallery' } = {}) {
  const list = (items ?? []).filter((item) => item?.src);
  if (!list.length) return null;

  const viewer = createLightbox(list);
  const headingId = heading ? uid('wk-gallery') : null;

  return h(heading ? 'section' : 'div', { class: ['wk-gallery', !heading && 'wk-gallery--figures'], 'aria-labelledby': headingId },
    heading ? h('h2', { class: 'wk-gallery-title', id: headingId }, heading) : null,
    h('div', { class: 'wk-gallery-grid' }, list.map((item, i) => thumb(item, i, viewer.open))),
    viewer.dialog,
  );
}

function thumb(item, index, open) {
  const name = item.alt || item.caption || `image ${index + 1}`;
  return h('figure', { class: ['wk-gallery-item', 'reveal', item.wide && 'wk-gallery-item--wide'], style: { '--i': index % 3 } },
    h('button', {
      type: 'button',
      class: 'wk-gallery-open',
      'aria-label': `Enlarge: ${name}`,
      'aria-haspopup': 'dialog',
      onClick: (event) => open(index, event.currentTarget),
    },
      img(item, { className: 'wk-gallery-img' }),
      h('span', { class: 'wk-gallery-zoom' }, icon('Plus', { size: 18 })),
    ),
    item.caption ? h('figcaption', null, item.caption) : null,
  );
}

function createLightbox(items) {
  const multi = items.length > 1;
  let index = 0;
  let trigger = null;

  // Starts on the first image, lazily (the closed dialog never fetches it), so the page never holds a
  // src-less <img> that reads as broken.
  const picture = h('img', { class: 'wk-lightbox-img', alt: '', decoding: 'async', loading: 'lazy', src: asset(items[0]?.src) });
  const position = h('span', { class: 'sr-only' });
  const counter = multi ? h('span', { class: 'wk-lightbox-count', 'aria-hidden': 'true' }) : null;
  const caption = h('span', { class: 'wk-lightbox-text' });

  const closeBtn = iconButton({ icon: 'X', label: 'Close image viewer', onClick: () => dialog.close(), className: 'wk-lightbox-close' });
  closeBtn?.setAttribute('autofocus', '');

  const dialog = h('dialog', {
    class: 'wk-lightbox',
    'aria-label': 'Image viewer',
    onKeydown: keydown,
    onClick: (event) => { if (event.target === dialog) dialog.close(); }, // backdrop / empty area
    onClose: restore,
  },
    closeBtn,
    h('figure', { class: 'wk-lightbox-figure' },
      picture,
      h('figcaption', { class: 'wk-lightbox-caption', 'aria-live': 'polite' }, position, counter, caption),
    ),
    multi ? iconButton({ icon: 'ChevronLeft', label: 'Previous image', onClick: () => show(index - 1), className: 'wk-lightbox-nav wk-lightbox-prev' }) : null,
    multi ? iconButton({ icon: 'ChevronRight', label: 'Next image', onClick: () => show(index + 1), className: 'wk-lightbox-nav wk-lightbox-next' }) : null,
  );

  function show(i) {
    index = (i + items.length) % items.length;
    const item = items[index];
    picture.src = asset(item.src);
    picture.alt = item.alt ?? '';
    for (const dim of ['width', 'height']) {
      if (item[dim]) picture.setAttribute(dim, item[dim]);
      else picture.removeAttribute(dim);
    }
    caption.textContent = item.caption ?? '';
    if (multi) {
      position.textContent = `Image ${index + 1} of ${items.length}. `;
      counter.textContent = `${index + 1} / ${items.length}`;
      new Image().src = asset(items[(index + 1) % items.length].src); // warm the next image
    }
  }

  function open(i, from) {
    if (dialog.open) return;
    trigger = from;
    show(i);
    lockScroll(true);
    dialog.showModal();
    // A route change removes the dialog without a `close` event; close it first so cleanup runs.
    window.addEventListener('hashchange', dismiss);
  }

  function dismiss() {
    if (dialog.open) dialog.close();
  }

  function restore() {
    window.removeEventListener('hashchange', dismiss);
    lockScroll(false);
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    trigger = null;
  }

  function keydown(event) {
    if (multi && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      show(index + (event.key === 'ArrowLeft' ? -1 : 1));
    } else if (event.key === 'Tab') {
      trapTab(event, dialog);
    }
  }

  return { dialog, open };
}

/** Stops the page scrolling behind the modal without a scrollbar-width layout jump. */
function lockScroll(on) {
  const root = document.documentElement;
  const hasScrollbar = window.innerWidth > root.clientWidth;
  root.style.overflow = on ? 'hidden' : '';
  root.style.scrollbarGutter = on && hasScrollbar ? 'stable' : '';
}
