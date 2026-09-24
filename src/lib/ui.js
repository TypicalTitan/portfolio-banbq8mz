/**
 * Shared component builders (spec §C4). base.css styles every class produced here; slices may
 * restyle them only contextually (e.g. `.hm-x .btn`).
 */

import { h, splitAccent, announce, slugify } from './dom.js';
import { icon as lucide, brand as brandIcon, hasBrand, tagGlyph } from './icons.js';
import { asset } from './format.js';
import { sprig } from '../effects/index.js';

const BTN_ICON = { sm: 16, md: 18, lg: 20 };
const NEW_TAB = ' (opens in new tab)';

/** Accepts a lucide name, a brand key ('github') or a ready-made SVG node. */
function glyph(spec, size, className) {
  if (!spec) return null;
  if (spec instanceof Node) return spec;
  if (typeof spec === 'string' && hasBrand(spec)) return brandIcon(spec, { size, className });
  return lucide(spec, { size, className });
}

function externalProps(external) {
  return external ? { target: '_blank', rel: 'noopener' } : {};
}

/* ── Buttons ─────────────────────────────────────────────────────────────── */

export function button({
  label, href = null, variant = 'primary', size = 'md', icon = null, iconEnd = null,
  external = false, download = false, ariaLabel = null, onClick = null, className = '',
} = {}) {
  const hasHref = href !== null && href !== undefined && href !== '';
  if (!hasHref && !onClick) return null;

  const px = BTN_ICON[size] ?? BTN_ICON.md;
  const props = {
    class: ['btn', `btn--${variant}`, `btn--${size}`, className],
    'aria-label': ariaLabel ? `${ariaLabel}${external ? NEW_TAB : ''}` : null,
    onClick: typeof onClick === 'function' ? onClick : null,
  };
  const children = [
    glyph(icon, px, 'btn__icon'),
    h('span', { class: 'btn__label' }, label),
    glyph(iconEnd, px, 'btn__icon btn__icon--end'),
    external && !ariaLabel ? h('span', { class: 'sr-only' }, NEW_TAB) : null,
  ];

  if (hasHref) {
    return h('a', { ...props, href, download: download || null, ...externalProps(external) }, children);
  }
  return h('button', { ...props, type: 'button' }, children);
}

export function iconButton({
  icon = null, brand = null, label, href = null, external = false, onClick = null, size = 44, className = '',
} = {}) {
  const glyphSize = brand ? Math.round(size * 0.42) : Math.round(size * 0.45);
  const svg = brand ? brandIcon(brand, { size: glyphSize }) : glyph(icon ?? 'Circle', glyphSize);
  const props = {
    class: ['icon-btn', className],
    style: { '--size': `${size}px` },
    'aria-label': `${label}${href && external ? NEW_TAB : ''}`,
    onClick: typeof onClick === 'function' ? onClick : null,
  };
  if (href) return h('a', { ...props, href, ...externalProps(external) }, svg);
  return h('button', { ...props, type: 'button' }, svg);
}

/**
 * 'first.last.dev@example.com' → <wbr> before the '@' and the dots of the local part, so a long
 * address wraps as 'first.last.dev' / '@example.com' — never mid-word, never a lone '.com'.
 */
export function breakable(email) {
  const at = email.lastIndexOf('@');
  if (at < 1) return email;
  const local = email.slice(0, at).split(/(?=\.)/);
  return [...local.flatMap((part, i) => [i ? h('wbr') : null, part]), h('wbr'), email.slice(at)];
}

export function copyEmailButton(email, { variant = 'outline', size = 'md' } = {}) {
  if (!email) return null;
  const px = BTN_ICON[size] ?? BTN_ICON.md;
  let mark = lucide('Copy', { size: px, className: 'btn__icon' });
  const text = h('span', { class: 'btn__label' }, 'Copy email');
  let timer = 0;

  const setState = (copied) => {
    const next = lucide(copied ? 'Check' : 'Copy', { size: px, className: 'btn__icon' });
    mark.replaceWith(next);
    mark = next;
    text.textContent = copied ? 'Copied' : 'Copy email';
    btn.classList.toggle('is-copied', copied);
  };

  const btn = h(
    'button',
    {
      type: 'button',
      class: ['btn', `btn--${variant}`, `btn--${size}`, 'btn--copy'],
      onClick: async () => {
        try {
          if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(email);
        } catch {
          window.location.href = `mailto:${email}`;
          return;
        }
        setState(true);
        announce('Email copied');
        clearTimeout(timer);
        timer = setTimeout(() => setState(false), 1800);
      },
    },
    mark,
    text,
  );
  return btn;
}

/* ── Chips & badges ──────────────────────────────────────────────────────── */

/**
 * A tag / skill chip. Every chip leads with a glyph: by default the name's brand mark or lucide icon
 * (tagGlyph, see tag-glyphs.js). `glyph` overrides it with a lucide name, a brand key or a node
 * (e.g. 'BookOpen' for coursework); `glyph: null` drops it.
 */
export function chip(text, { variant = 'default', glyph: spec = undefined } = {}) {
  let mark = null;
  if (spec === undefined) mark = tagGlyph(text, { size: 14, className: 'chip__glyph' });
  else if (typeof spec === 'string' && !hasBrand(spec)) mark = lucide(spec, { size: 14, strokeWidth: 2, className: 'chip__glyph tag-glyph tag-glyph--line' });
  else mark = glyph(spec, 14, 'chip__glyph');
  return h(
    'li',
    { class: ['chip', `chip--${variant || 'default'}`] },
    mark,
    h('span', null, text),
  );
}

export function chipList(items, opts = {}) {
  const list = (items ?? []).filter((item) => (typeof item === 'string' ? item : item?.name));
  if (!list.length) return null;
  const { className = '', ...chipOpts } = opts;
  return h(
    'ul',
    { class: ['chips', className] },
    list.map((item) =>
      typeof item === 'string'
        ? chip(item, chipOpts)
        : chip(item.name, { ...chipOpts, variant: chipOpts.variant ?? item.level ?? 'default' }),
    ),
  );
}

const BADGE_ICONS = {
  featured: 'Flame',
  award: 'Trophy',
  team: 'Users',
  solo: 'User',
  new: 'Sparkles',
  'in-progress': 'Hammer',
};

export function badge(kind) {
  if (!kind) return null;
  const key = slugify(kind);
  return h(
    'span',
    { class: ['badge', `badge--${key}`] },
    BADGE_ICONS[key] ? lucide(BADGE_ICONS[key], { size: 14, strokeWidth: 2, className: 'badge__icon' }) : null,
    kind,
  );
}

/* ── Headings ────────────────────────────────────────────────────────────── */

export function headline(text, accent, { tag = 'h2', upright = false, id = null, className = '' } = {}) {
  return h(tag, { class: ['headline', upright && 'headline--upright', className], id }, splitAccent(text, accent));
}

export function sectionHead({
  eyebrow = null, title, accent = null, blurb = null, action = null, id = null,
  split = false, tag = 'h2', upright = false,
} = {}) {
  const blurbEl = blurb ? h('p', { class: 'section-head__blurb' }, blurb) : null;
  return h(
    'header',
    { class: ['section-head', split && 'section-head--split'] },
    h(
      'div',
      { class: 'section-head__main' },
      eyebrow ? h('p', { class: 'eyebrow' }, sprig(), eyebrow) : null,
      headline(title, accent, { tag, upright, id }),
      split ? null : blurbEl,
    ),
    split ? blurbEl : null,
    action ? h('div', { class: 'section-head__action' }, action) : null,
  );
}

/* ── Stats ───────────────────────────────────────────────────────────────── */

/**
 * Thin-numeral stat. Accepts an optional second options arg (`stat(kv, { size })`) and an optional
 * `uncertainty`, rendered as "±u unit" inside .stat__unit (lab key values).
 */
export function stat(data = {}, opts = {}) {
  const { value, unit = null, uncertainty = null, label, href = null } = data;
  const size = opts.size ?? data.size ?? 'md';
  let unitText = unit ?? '';
  if (uncertainty !== null && uncertainty !== undefined && uncertainty !== '' && !String(unitText).includes('±')) {
    unitText = ` ±${uncertainty}${unitText ? ` ${unitText}` : ''}`;
  }
  return h(
    href ? 'a' : 'div',
    { class: ['stat', `stat--${size}`, href && 'stat--link'], href },
    h(
      'span',
      { class: 'stat__value' },
      String(value ?? ''),
      // Word units ('days', 'hrs') get a real gap; symbols (%, s, °, m/s²) stay tight to the number.
      unitText ? h('span', { class: ['stat__unit', /^[A-Za-z]{2,}/.test(unitText) && 'stat__unit--word'] }, unitText) : null,
    ),
    h(
      'span',
      { class: 'stat__label' },
      href ? linkedLabel(label) : label,
    ),
  );
}

/** Label text with its last word and the ↗ arrow bound together, so a wrapped label never strands the arrow. */
function linkedLabel(label) {
  const text = String(label ?? '');
  const cut = text.lastIndexOf(' ');
  return [
    cut > 0 ? text.slice(0, cut + 1) : null,
    h('span', { class: 'stat__tail' }, cut > 0 ? text.slice(cut + 1) : text, lucide('ArrowUpRight', { size: 16, className: 'stat__arrow' })),
  ];
}

export function statRow(stats, { className = '', size = 'md' } = {}) {
  const list = (stats ?? []).filter(Boolean);
  if (!list.length) return null;
  return h('div', { class: ['stats', className] }, list.map((item) => stat(item, { size })));
}

/* ── Media ───────────────────────────────────────────────────────────────── */

export function img(image, { loading = 'lazy', className = '', fetchpriority = null } = {}) {
  if (!image?.src) return null;
  return h('img', {
    src: asset(image.src),
    alt: image.alt ?? '',
    width: image.width,
    height: image.height,
    decoding: 'async',
    loading,
    fetchpriority,
    class: className || null,
  });
}

export function shot(image, { frame = 'window', label = '', loading = 'lazy', fetchpriority = null, className = '' } = {}) {
  const picture = img(image, { loading, fetchpriority });
  if (!picture) return null;
  if (frame === 'plate') return h('figure', { class: ['shot', 'shot--plate', className] }, picture);

  const dusk = frame === 'dusk';
  const bar = h(
    'div',
    { class: 'shot__bar', 'aria-hidden': 'true' },
    dusk ? null : [h('i'), h('i'), h('i')],
    h('span', null, label || ''),
  );
  return h('figure', { class: ['shot', dusk ? 'shot--dusk' : 'shot--window', className] }, bar, picture);
}

export function media(theme, children, { ratio = '16 / 10', className = '' } = {}) {
  return h(
    'div',
    { class: ['media', className], 'data-theme': theme || 'lava', style: { '--ratio': ratio } },
    children,
  );
}

/* ── Small pieces ────────────────────────────────────────────────────────── */

export function glassPill(text, { icon = null, dot = false } = {}) {
  return h(
    'span',
    { class: 'pill-glass' },
    dot ? h('span', { class: 'pill-glass__dot', 'aria-hidden': 'true' }) : null,
    glyph(icon, 16, 'pill-glass__icon'),
    h('span', { class: 'pill-glass__text' }, text),
  );
}

export function iconTile(name, { variant = 'crimson', size = 64 } = {}) {
  return h(
    'span',
    { class: ['icon-tile', `icon-tile--${variant}`], style: { '--size': `${size}px` } },
    glyph(name, Math.round(size * 0.44), 'icon-tile__icon'),
  );
}

export function filterGroup({ label, options = [], value, onChange, noun = 'items' } = {}) {
  let current = value;
  const buttons = options.map((opt) =>
    h(
      'button',
      {
        type: 'button',
        class: 'filter',
        'aria-pressed': String(opt.value === current),
        dataset: { value: opt.value },
        onClick: () => select(opt),
      },
      h('span', { class: 'filter__label' }, opt.label),
      opt.count !== undefined && opt.count !== null ? h('span', { class: 'filter__count' }, String(opt.count)) : null,
    ),
  );

  function select(opt) {
    if (opt.value === current) return;
    current = opt.value;
    buttons.forEach((btn, i) => btn.setAttribute('aria-pressed', String(options[i].value === current)));
    if (typeof onChange === 'function') onChange(opt.value);
    const n = opt.count;
    const hasCount = n !== undefined && n !== null;
    const nounText = hasCount && Number(n) === 1 ? noun.replace(/s$/, '') : noun;
    const isAll = String(opt.label).trim().toLowerCase() === 'all';
    if (isAll) announce(hasCount ? `Showing all ${n} ${nounText}` : `Showing all ${noun}`);
    else announce(hasCount ? `Showing ${n} ${opt.label} ${nounText}` : `Showing ${opt.label} ${noun}`);
  }

  return h('div', { class: 'filters', role: 'group', 'aria-label': label }, buttons);
}

export function socialLinks(socials, { size = 44, className = '' } = {}) {
  const items = (socials ?? [])
    .map((social) => {
      if (!social) return null;
      if (social.id === 'email') {
        const address = String(social.url || social.handle || '').replace(/^mailto:/, '');
        if (!address) return null;
        return iconButton({ icon: 'Mail', label: social.label || 'Email', href: `mailto:${address}`, size });
      }
      if (!social.url) return null;
      return iconButton({ brand: social.id, label: social.label || social.id, href: social.url, external: true, size });
    })
    .filter(Boolean);
  if (!items.length) return null;
  return h('ul', { class: ['socials', className] }, items.map((item) => h('li', null, item)));
}

export function backLink(href, label) {
  return h(
    'a',
    { class: 'back-link', href },
    lucide('ArrowLeft', { size: 18, className: 'back-link__icon' }),
    h('span', null, label),
  );
}

/** pairs: [{ term, desc, wide? }]; empty descs drop out. `wide` rows get .facts__row--wide (full row in grid layouts). */
export function dlList(pairs, { className = '' } = {}) {
  const rows = (pairs ?? []).filter((pair) => pair && pair.desc !== null && pair.desc !== undefined && pair.desc !== '' && pair.desc !== false);
  if (!rows.length) return null;
  return h(
    'dl',
    { class: ['facts', className] },
    rows.map(({ term, desc, wide }) => h('div', { class: wide ? 'facts__row--wide' : null }, h('dt', null, term), h('dd', null, desc))),
  );
}
