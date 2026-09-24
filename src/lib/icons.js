/**
 * Icons (spec §C3). Lucide and simple-icons are imported by name only so the bundle carries just
 * the glyphs listed here. Brand marks are always monochrome currentColor, never the brand hex.
 * Marks simple-icons lacks (AWS, Windows, PowerShell, a symbol-only .NET and AMD) live in
 * brand-extra.js; which glyph each skill / tag name gets is the table in tag-glyphs.js.
 */

import {
  createElement,
  ArchiveRestore, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Atom, Award, BadgeCheck, Beaker,
  BookOpen, Bot, Braces, Briefcase, Bus, Calendar, CalendarCheck, Castle, Check, ChevronLeft, ChevronRight,
  ChevronsUp, Circle, CircleArrowUp, CircleCheck, CircleDashed, CircleDot, CircleX, CircuitBoard,
  ClipboardCheck, Clock, Cloud, CloudCog, Code, Copy, Cpu, Database, Dna, Download, Droplets, ExternalLink, FileDown,
  FileText, Flame, FlaskConical, FolderSync, Gamepad2, Gauge, Globe, GraduationCap, Hammer, Hand,
  HardDrive, HeartHandshake, KeyRound, Keyboard, Layers, Lightbulb, ListChecks, Mail, MapPin, Medal,
  MemoryStick, Menu, Microscope, MonitorPlay, Network, Orbit, PackageOpen, Pause, PcCase, PenTool, Pipette, Play, Plus,
  Puzzle, Quote, School, ScrollText, Server, ServerCog, Settings2, ShieldCheck, Sparkles, Sprout,
  Stethoscope, Store, Table, Tag, Target, Terminal, Thermometer, TriangleAlert, Trophy, User, Users,
  Waypoints, Workflow, Wrench, X, Zap,
} from 'lucide';

import {
  siGithub, siYoutube, siDevpost, siItchdotio, siPython, siCplusplus, siJavascript, siOpenjdk,
  siHtml5, siCss, siArduino, siEspressif, siVite, siFirebase, siGodotengine, siGit, siFigma,
  siLinux, siKicad, siBlender, siGooglesheets, siOpencv, siAutodesk, siRaspberrypi,
  siWebrtc, siUbiquiti, siAndroid, siClaude, siClaudecode, siNvidia, siDiscord,
} from 'simple-icons';

import { s } from './dom.js';
import { BRAND_EXTRA } from './brand-extra.js';
import { TAG_FALLBACK, tagGlyphSpec } from './tag-glyphs.js';

const LUCIDE = {
  ArchiveRestore, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Atom, Award, BadgeCheck, Beaker,
  BookOpen, Bot, Braces, Briefcase, Bus, Calendar, CalendarCheck, Castle, Check, ChevronLeft, ChevronRight,
  ChevronsUp, Circle, CircleArrowUp, CircleCheck, CircleDashed, CircleDot, CircleX, CircuitBoard,
  ClipboardCheck, Clock, Cloud, CloudCog, Code, Copy, Cpu, Database, Dna, Download, Droplets, ExternalLink, FileDown,
  FileText, Flame, FlaskConical, FolderSync, Gamepad2, Gauge, Globe, GraduationCap, Hammer, Hand,
  HardDrive, HeartHandshake, KeyRound, Keyboard, Layers, Lightbulb, ListChecks, Mail, MapPin, Medal,
  MemoryStick, Menu, Microscope, MonitorPlay, Network, Orbit, PackageOpen, Pause, PcCase, PenTool, Pipette, Play, Plus,
  Puzzle, Quote, School, ScrollText, Server, ServerCog, Settings2, ShieldCheck, Sparkles, Sprout,
  Stethoscope, Store, Table, Tag, Target, Terminal, Thermometer, TriangleAlert, Trophy, User, Users,
  Waypoints, Workflow, Wrench, X, Zap,
};

export const LINKEDIN_PATH =
  'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z';

// Brand key → path data (viewBox 0 0 24 24) or a { path, viewBox, fillRule, aspect, stroke } record from
// brand-extra.js.
const BRAND_PATHS = {
  github: siGithub.path,
  youtube: siYoutube.path,
  devpost: siDevpost.path,
  itchio: siItchdotio.path,
  python: siPython.path,
  cplusplus: siCplusplus.path,
  javascript: siJavascript.path,
  java: siOpenjdk.path,
  html: siHtml5.path,
  css: siCss.path,
  arduino: siArduino.path,
  espressif: siEspressif.path,
  vite: siVite.path,
  firebase: siFirebase.path,
  godot: siGodotengine.path,
  git: siGit.path,
  figma: siFigma.path,
  linux: siLinux.path,
  kicad: siKicad.path,
  blender: siBlender.path,
  sheets: siGooglesheets.path,
  opencv: siOpencv.path,
  autodesk: siAutodesk.path,
  raspberrypi: siRaspberrypi.path,
  webrtc: siWebrtc.path,
  ubiquiti: siUbiquiti.path,
  android: siAndroid.path,
  claude: siClaude.path,
  claudecode: siClaudecode.path,
  nvidia: siNvidia.path,
  discord: siDiscord.path,
  linkedin: LINKEDIN_PATH,
  ...BRAND_EXTRA,
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
 * Monochrome brand mark, fill currentColor. simple-icons marks use viewBox 0 0 24 24; the extra
 * marks carry their own viewBox so they sit at the same optical size. A wide extra mark (`aspect` > 1)
 * is drawn `size * aspect` wide and gets `icon--wide` plus a `--glyph-aspect` custom property, so CSS
 * that pins glyph widths can widen or overhang it. 'email' → lucide Mail.
 */
export function brand(key, { size = 20, className = '', label: text = null } = {}) {
  if (key === 'email') return icon('Mail', { size, className: classes('icon--brand', className), label: text });
  const mark = Object.hasOwn(BRAND_PATHS, key ?? '') ? BRAND_PATHS[key] : null;
  if (!mark) {
    if (DEV) console.debug(`[icons] Unknown brand "${key}", using Globe.`);
    return icon('Globe', { size, className: classes('icon--brand', className), label: text });
  }
  const {
    path: d, viewBox = '0 0 24 24', fillRule = null, aspect = 1, stroke = 0,
  } = typeof mark === 'string' ? { path: mark } : mark;
  const wide = aspect > 1;
  const svg = s(
    'svg',
    {
      viewBox,
      width: wide ? Math.round(size * aspect) : size,
      height: size,
      fill: 'currentColor',
      class: classes('icon', 'icon--brand', wide && 'icon--wide', className),
      style: wide ? { '--glyph-aspect': String(aspect) } : null,
    },
    s('path', {
      d,
      'fill-rule': fillRule,
      stroke: stroke ? 'currentColor' : null,
      'stroke-width': stroke || null,
      'stroke-linejoin': stroke ? 'round' : null,
    }),
  );
  return label(svg, text);
}

export function hasBrand(key) {
  return key === 'email' || Object.hasOwn(BRAND_PATHS, key ?? '');
}

/** Brand key for a skill / tag name ('AWS EC2' → 'aws'), or null when its glyph is a lucide icon. */
export function brandForTag(tag) {
  if (typeof tag !== 'string') return null;
  const spec = tagGlyphSpec(tag);
  return spec?.startsWith('brand:') ? spec.slice(6) : null;
}

/**
 * The glyph for a skill / tool / tag name: its brand mark when it has one, else the lucide icon from
 * tag-glyphs.js, else the generic Tag. Always decorative (aria-hidden): the visible name says it.
 * Lucide strokes default to 2 so the outlines hold their own next to the filled brand marks.
 */
export function tagGlyph(name, { size = 16, strokeWidth = 2, className = '' } = {}) {
  const spec = tagGlyphSpec(name);
  if (spec?.startsWith('brand:')) return brand(spec.slice(6), { size, className: classes('tag-glyph', className) });
  if (!spec && DEV) console.debug(`[icons] No glyph mapped for "${name}", using ${TAG_FALLBACK}. Add it to tag-glyphs.js.`);
  return icon(spec || TAG_FALLBACK, { size, strokeWidth, className: classes('tag-glyph', 'tag-glyph--line', className) });
}
