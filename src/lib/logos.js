/**
 * Logo files → inline SVG. Every skill / tool / social logo is its own file in src/assets/logos/
 * (python.svg, aws.svg, network.svg …); the file's basename is its key. Vite bundles the file text at
 * build time (import.meta.glob, ?raw), so there are no extra requests and the logos stay inline, where
 * `currentColor` picks up the chip / marquee / fan colour.
 *
 * Each file is parsed once, on first use, and cleaned (its <title>, comments and whitespace go: the
 * visible name next to a logo already says what it is). Every call returns a fresh clone, sized and
 * classed for its spot. The files are trusted repo assets, never content strings.
 *
 * Two kinds of file, told apart by the root <svg>:
 *  • filled marks (brands): fill="currentColor". Class `icon icon--brand`.
 *  • line glyphs (lucide geometry): fill="none" stroke="currentColor". Class `icon icon--<key>`, and
 *    the caller's strokeWidth replaces the file's stroke-width.
 * A viewBox wider than tall (the .NET wave 1.4:1, the AWS smile 1.5:1) draws the logo that much wider
 * than `size` so it carries the same weight as the square marks; it gets `icon--wide` and a
 * `--glyph-aspect` custom property for the CSS that pins glyph widths.
 */

const FILES = import.meta.glob('../assets/logos/*.svg', { query: '?raw', import: 'default', eager: true });

/** key ('python') → raw file text */
const SOURCES = new Map(
  Object.entries(FILES).map(([path, text]) => [path.slice(path.lastIndexOf('/') + 1, -'.svg'.length), text]),
);

const DEV = Boolean(import.meta.env?.DEV);

/** key → { node, line, aspect } once parsed, or null for a file that is not a usable SVG. */
const parsed = new Map();

function clean(node) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === Node.COMMENT_NODE || (child.nodeType === Node.TEXT_NODE && !child.nodeValue.trim())) {
      child.remove();
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      if (['title', 'desc', 'metadata'].includes(child.localName)) child.remove();
      else clean(child);
    }
  }
}

function parse(key) {
  if (parsed.has(key)) return parsed.get(key);
  let record = null;
  const text = SOURCES.get(key);
  if (text) {
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    const svg = doc.documentElement;
    if (svg?.localName === 'svg' && !doc.getElementsByTagName('parsererror').length) {
      clean(svg);
      const [, , w, h] = (svg.getAttribute('viewBox') || '0 0 24 24').trim().split(/[\s,]+/).map(Number);
      record = {
        node: document.importNode(svg, true),
        line: svg.getAttribute('fill') === 'none',
        aspect: w > 0 && h > 0 ? Math.round((w / h) * 100) / 100 : 1,
      };
    } else if (DEV) {
      console.warn(`[logos] src/assets/logos/${key}.svg is not a valid SVG file.`);
    }
  }
  parsed.set(key, record);
  return record;
}

/** True when src/assets/logos/<key>.svg exists. */
export function hasLogo(key) {
  return typeof key === 'string' && SOURCES.has(key);
}

/** True when the logo is a line glyph (fill="none", stroked) rather than a filled mark. */
export function isLineLogo(key) {
  return Boolean(hasLogo(key) && parse(key)?.line);
}

/**
 * A fresh inline <svg> for a logo file, `size` px tall (wider for a wide viewBox), or null when there
 * is no such file. Accessibility attributes are left to the caller.
 */
export function logoSvg(key, { size = 20, strokeWidth = null, className = '' } = {}) {
  const record = hasLogo(key) ? parse(key) : null;
  if (!record) return null;
  const { node, line, aspect } = record;
  const wide = aspect > 1;
  const svg = node.cloneNode(true);
  svg.setAttribute('width', String(wide ? Math.round(size * aspect) : size));
  svg.setAttribute('height', String(size));
  if (line && strokeWidth != null) svg.setAttribute('stroke-width', String(strokeWidth));
  svg.setAttribute(
    'class',
    ['icon', line ? `icon--${key}` : 'icon--brand', wide && 'icon--wide', className].filter(Boolean).join(' '),
  );
  if (wide) svg.style.setProperty('--glyph-aspect', String(aspect));
  return svg;
}
