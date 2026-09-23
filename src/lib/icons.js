/**
 * Icons (spec §C3). Lucide and simple-icons are imported by name only so the bundle carries just
 * the glyphs listed here. Brand marks are always monochrome currentColor, never the brand hex.
 */

import {
  createElement,
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Atom, Award, BadgeCheck, Beaker, Bot,
  Briefcase, Bus, Calendar, CalendarCheck, Check, ChevronLeft, ChevronRight, ChevronsUp, Circle,
  CircleCheck, CircleDot, CircleX, CircuitBoard, Clock, Code, Copy, Cpu, Dna, Download, Droplets,
  ExternalLink, FileDown, FileText, Flame, FlaskConical, Gamepad2, Gauge, Globe, GraduationCap,
  Hammer, Hand, HeartHandshake, Keyboard, Layers, Lightbulb, Mail, MapPin, Medal, Menu, Microscope,
  Orbit, Pause, PenTool, Pipette, Play, Plus, Quote, School, Sparkles, Sprout, Store, Table, Target,
  Terminal, Thermometer, TriangleAlert, Trophy, User, Users, Wrench, X, Zap,
} from 'lucide';

import {
  siGithub, siYoutube, siDevpost, siItchdotio, siPython, siCplusplus, siJavascript, siOpenjdk,
  siHtml5, siCss, siArduino, siEspressif, siVite, siFirebase, siGodotengine, siGit, siFigma,
  siLinux, siKicad, siBlender, siGooglesheets, siOpencv, siAutodesk, siRaspberrypi,
} from 'simple-icons';

import { s } from './dom.js';

const LUCIDE = {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Atom, Award, BadgeCheck, Beaker, Bot,
  Briefcase, Bus, Calendar, CalendarCheck, Check, ChevronLeft, ChevronRight, ChevronsUp, Circle,
  CircleCheck, CircleDot, CircleX, CircuitBoard, Clock, Code, Copy, Cpu, Dna, Download, Droplets,
  ExternalLink, FileDown, FileText, Flame, FlaskConical, Gamepad2, Gauge, Globe, GraduationCap,
  Hammer, Hand, HeartHandshake, Keyboard, Layers, Lightbulb, Mail, MapPin, Medal, Menu, Microscope,
  Orbit, Pause, PenTool, Pipette, Play, Plus, Quote, School, Sparkles, Sprout, Store, Table, Target,
  Terminal, Thermometer, TriangleAlert, Trophy, User, Users, Wrench, X, Zap,
};

export const LINKEDIN_PATH =
  'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z';

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
  linkedin: LINKEDIN_PATH,
};

// Lower-cased tag → brand key (spec table, plus a few unambiguous spellings).
const TAG_BRANDS = {
  python: 'python',
  'c++': 'cplusplus',
  javascript: 'javascript',
  js: 'javascript',
  java: 'java',
  html: 'html',
  html5: 'html',
  css: 'css',
  css3: 'css',
  arduino: 'arduino',
  'arduino / esp32': 'arduino',
  esp32: 'espressif',
  'raspberry pi': 'raspberrypi',
  opencv: 'opencv',
  'fusion 360': 'autodesk',
  vite: 'vite',
  firebase: 'firebase',
  godot: 'godot',
  gdscript: 'godot',
  git: 'git',
  'git & github': 'git',
  github: 'github',
  figma: 'figma',
  linux: 'linux',
  kicad: 'kicad',
  blender: 'blender',
  'excel / sheets': 'sheets',
  'google sheets': 'sheets',
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

/** Monochrome brand mark (viewBox 0 0 24 24, fill currentColor). 'email' maps to lucide Mail. */
export function brand(key, { size = 20, className = '', label: text = null } = {}) {
  if (key === 'email') return icon('Mail', { size, className: classes('icon--brand', className), label: text });
  const d = Object.hasOwn(BRAND_PATHS, key ?? '') ? BRAND_PATHS[key] : null;
  if (!d) {
    if (DEV) console.debug(`[icons] Unknown brand "${key}", using Globe.`);
    return icon('Globe', { size, className: classes('icon--brand', className), label: text });
  }
  const svg = s(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: size,
      height: size,
      fill: 'currentColor',
      class: classes('icon', 'icon--brand', className),
    },
    s('path', { d }),
  );
  return label(svg, text);
}

export function hasBrand(key) {
  return key === 'email' || Object.hasOwn(BRAND_PATHS, key ?? '');
}

export function brandForTag(tag) {
  if (typeof tag !== 'string') return null;
  const key = tag.trim().toLowerCase().replace(/\s+/g, ' ');
  return Object.hasOwn(TAG_BRANDS, key) ? TAG_BRANDS[key] : null;
}
