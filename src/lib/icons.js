/**
 * Icons (spec §C3). UI icons are lucide, imported by name only so the bundle carries just the glyphs
 * listed here (LUCIDE is also the icon vocabulary content.js may use). Logos (brand marks, social
 * marks and every skill / tool glyph) are .svg files in src/assets/logos/, loaded by logos.js and
 * always monochrome currentColor; which logo each skill / tag name gets is the table in tag-glyphs.js.
 */

import {
  createElement,
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Atom, Award, BadgeCheck, Beaker, BookOpen,
  Bot, Briefcase, Bus, Calendar, CalendarCheck, Check, ChevronLeft, ChevronRight, ChevronsUp, Circle,
  CircleCheck, CircleDashed, CircleDot, CircleX, CircuitBoard, Clock, Cloud, Code, Copy, Cpu, Dna,
  Download, Droplets, ExternalLink, FileDown, FileText, Flame, FlaskConical, Gamepad2, Gauge, Globe,
  GraduationCap, Hammer, Hand, HeartHandshake, Keyboard, Layers, Lightbulb, Mail, MapPin, Medal, Menu,
  Microscope, Network, Orbit, Pause, PenTool, Pipette, Play, Plus, Quote, School, Server, Sparkles,
  Sprout, Store, Table, Target, Terminal, Thermometer, TriangleAlert, Trophy, User, Users, Wrench, X,
  Zap,
} from 'lucide';

import { hasLogo, isLineLogo, logoSvg } from './logos.js';
import { TAG_FALLBACK, tagGlyphSpec } from './tag-glyphs.js';

const LUCIDE = {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Atom, Award, BadgeCheck, Beaker, BookOpen,
  Bot, Briefcase, Bus, Calendar, CalendarCheck, Check, ChevronLeft, ChevronRight, ChevronsUp, Circle,
  CircleCheck, CircleDashed, CircleDot, CircleX, CircuitBoard, Clock, Cloud, Code, Copy, Cpu, Dna,
  Download, Droplets, ExternalLink, FileDown, FileText, Flame, FlaskConical, Gamepad2, Gauge, Globe,
  GraduationCap, Hammer, Hand, HeartHandshake, Keyboard, Layers, Lightbulb, Mail, MapPin, Medal, Menu,
  Microscope, Network, Orbit, Pause, PenTool, Pipette, Play, Plus, Quote, School, Server, Sparkles,
  Sprout, Store, Table, Target, Terminal, Thermometer, TriangleAlert, Trophy, User, Users, Wrench, X,
  Zap,
};

const DEV = Boolean(import.meta.env?.DEV);

function classes(...list) {
  return list.filter(Boolean).join(' ');
}

function label(svg, text) {
  if (text) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', text);
  } else {
    svg.setAttribute('aria-hidden', 'true');
  }
  svg.setAttribute('focusable', 'false');
  return svg;
}

function toPascal(name) {
  return String(name)
    .split(/[-_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Lucide icon by PascalCase name. Unknown names fall back to Circle. Adds `icon--kebab-name`. */
export function icon(name, { size = 20, strokeWidth = 1.75, className = '', label: text = null } = {}) {
  let key = Object.hasOwn(LUCIDE, name ?? '') ? name : toPascal(name ?? '');
  if (!Object.hasOwn(LUCIDE, key)) {
    if (DEV) console.debug(`[icons] Unknown lucide icon "${name}", using Circle.`);
    key = 'Circle';
  }
  const svg = createElement(LUCIDE[key], {
    width: size,
    height: size,
    'stroke-width': strokeWidth,
    class: classes('icon', `icon--${toKebab(key)}`, className),
  });
  return label(svg, text);
}

/**
 * A logo from src/assets/logos/ by file key ('github', 'linkedin', 'python'), always monochrome
 * currentColor (see logos.js for sizing, wide marks and line glyphs). 'email' → lucide Mail; an
 * unknown key falls back to lucide Globe.
 */
export function brand(key, { size = 20, className = '', label: text = null } = {}) {
  if (key === 'email') return icon('Mail', { size, className: classes('icon--brand', className), label: text });
  const svg = logoSvg(key, { size, className });
  if (!svg) {
    if (DEV) console.debug(`[icons] No logo file "src/assets/logos/${key}.svg", using Globe.`);
    return icon('Globe', { size, className: classes('icon--brand', className), label: text });
  }
  return label(svg, text);
}

export function hasBrand(key) {
  return key === 'email' || hasLogo(key);
}

/**
 * The logo for a skill / tool / tag name: the file tag-glyphs.js maps it to, else tag.svg. Always
 * decorative (aria-hidden): the visible name says it. Line glyphs are drawn at `strokeWidth`
 * (2 by default) so the outlines hold their own next to the filled brand marks.
 */
export function tagGlyph(name, { size = 16, strokeWidth = 2, className = '' } = {}) {
  let key = tagGlyphSpec(name);
  if (!hasLogo(key)) {
    if (DEV) console.debug(`[icons] No logo for "${name}"${key ? ` (missing ${key}.svg)` : ''}, using ${TAG_FALLBACK}.svg. Map it in tag-glyphs.js.`);
    key = TAG_FALLBACK;
  }
  const svg = logoSvg(key, {
    size,
    strokeWidth,
    className: classes('tag-glyph', isLineLogo(key) && 'tag-glyph--line', className),
  }) ?? icon('Circle', { size, strokeWidth, className: classes('tag-glyph', 'tag-glyph--line', className) });
  return label(svg, null);
}
