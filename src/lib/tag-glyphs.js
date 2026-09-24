/**
 * Which glyph each skill / tool / tag name gets (marquee, Skills fan, every chip). Keys are the
 * name lower-cased with whitespace collapsed; values are either `brand:<key>` (a monochrome brand
 * mark from BRAND_PATHS in icons.js) or a lucide icon name (it must also be in the LUCIDE map there).
 *
 * Brand marks are used when the thing has a real one; a product line uses its maker's mark (RTX 5070
 * → NVIDIA, Ryzen → AMD) when that mark reads at chip size (AWS's does not, see below); everything else gets a lucide glyph that says what it is. A name
 * missing from this table still renders, with the generic Tag glyph, and `npm run check` warns.
 *
 * Plain data with no imports, so scripts/check-content.mjs can read it under Node.
 */

export const TAG_GLYPHS = {
  // ── Languages, frameworks, dev tools ──
  python: 'brand:python',
  'c++': 'brand:cplusplus',
  javascript: 'brand:javascript',
  js: 'brand:javascript',
  java: 'brand:java',
  html: 'brand:html',
  html5: 'brand:html',
  css: 'brand:css',
  css3: 'brand:css',
  '.net': 'brand:dotnet',
  dotnet: 'brand:dotnet',
  powershell: 'brand:powershell',
  sql: 'Database',
  'rest apis': 'Braces',
  'rest api': 'Braces',
  git: 'brand:git',
  'git & github': 'brand:git',
  github: 'brand:github',
  vite: 'brand:vite',
  firebase: 'brand:firebase',
  godot: 'brand:godot',
  gdscript: 'brand:godot',
  figma: 'brand:figma',
  webrtc: 'brand:webrtc',
  oauth: 'KeyRound',
  'discord api': 'brand:discord',
  discord: 'brand:discord',
  'claude code': 'brand:claudecode',
  claude: 'brand:claude',
  'ai-assisted development (claude code)': 'brand:claudecode',

  // ── Cloud & operating systems ──
  // AWS has no small-size mark: its logo is the "aws" letters plus the smile, and the smile alone is
  // a hairline below ~24px. So only the bare "AWS" (28px marquee) gets the smile; the AWS services
  // get a lucide glyph for what each one is rather than four identical faint curves.
  aws: 'brand:aws',
  'aws ec2': 'Server',
  'aws ssm': 'CloudCog',
  'gamelift streams': 'MonitorPlay',
  'graviton / arm64': 'Cpu',
  linux: 'brand:linux',
  windows: 'brand:windows',
  'windows admin': 'brand:windows',
  android: 'brand:android',
  'fleet automation': 'Workflow',

  // ── Networking ──
  unifi: 'brand:ubiquiti',
  'unifi / ubiquiti': 'brand:ubiquiti',
  ubiquiti: 'brand:ubiquiti',
  subnetting: 'Network',
  vpns: 'ShieldCheck',
  vpn: 'ShieldCheck',
  sftp: 'FolderSync',
  rcon: 'Terminal',

  // ── QA, hardware & PC builds ──
  'qa testing': 'BadgeCheck',
  '3dmark benchmarking': 'Gauge',
  'hardware diagnostics': 'Stethoscope',
  'hardware assembly': 'Wrench',
  'pc building': 'PcCase',
  'part selection': 'ListChecks',
  'upgrade planning': 'CircleArrowUp',
  'rtx 5070': 'brand:nvidia',
  nvidia: 'brand:nvidia',
  'ryzen 7 5700x3d': 'brand:amd',
  am4: 'brand:amd',
  amd: 'brand:amd',
  'ddr4-3600': 'MemoryStick',
  nvme: 'HardDrive',

  // ── Servers & operations ──
  'server admin': 'ServerCog',
  'server administration': 'ServerCog',
  'backup and restore': 'ArchiveRestore',
  'change management': 'ClipboardCheck',
  'log-based incident diagnosis': 'ScrollText',

  // ── Rust game server (no official marks exist for these; never the Rust language logo) ──
  shockbyte: 'Server',
  'oxide / umod': 'Puzzle',
  'plugin configuration': 'Settings2',
  nteleportation: 'Waypoints',
  'better loot': 'PackageOpen',
  'raidable bases': 'Castle',

  // ── Hardware & making (older template tags, kept so they keep their marks) ──
  arduino: 'brand:arduino',
  'arduino / esp32': 'brand:arduino',
  esp32: 'brand:espressif',
  'raspberry pi': 'brand:raspberrypi',
  opencv: 'brand:opencv',
  'fusion 360': 'brand:autodesk',
  kicad: 'brand:kicad',
  blender: 'brand:blender',
  'excel / sheets': 'brand:sheets',
  'google sheets': 'brand:sheets',
};

/** Fallback for a name with no entry: a plain tag, so no chip or skill row is ever glyph-less. */
export const TAG_FALLBACK = 'Tag';

/** Lookup key: trimmed, lower-cased, whitespace collapsed. */
export function tagKey(name) {
  return String(name ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/** The raw table value for a name ('brand:aws' / 'Network'), or null when it has no entry. */
export function tagGlyphSpec(name) {
  const key = tagKey(name);
  return key && Object.hasOwn(TAG_GLYPHS, key) ? TAG_GLYPHS[key] : null;
}
