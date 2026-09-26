/**
 * Which logo each skill / tool / tag name gets (marquee, Skills fan, every chip). Keys are the name
 * lower-cased with whitespace collapsed; each value is a logo file key: the basename of an .svg in
 * src/assets/logos/ ('python' → python.svg, 'network' → network.svg). Adding a logo = drop the .svg
 * in that folder and add one line here; `npm run check` fails when a value has no file.
 *
 * Brand marks are used when the thing has a real one; a product line uses its maker's mark (RTX 5070
 * → NVIDIA, Ryzen → AMD) when that mark reads at chip size (AWS's does not, see below); everything
 * else gets a lucide line glyph that says what it is. A name missing from this table still renders,
 * with the generic tag.svg, and `npm run check` warns.
 *
 * Plain data with no imports, so scripts/check-content.mjs can read it under Node.
 */

export const TAG_GLYPHS = {
  // ── Languages, frameworks, dev tools ──
  python: 'python',
  'c#': 'dotnet',
  'c++': 'cplusplus',
  javascript: 'javascript',
  js: 'javascript',
  java: 'java',
  html: 'html',
  html5: 'html',
  css: 'css',
  css3: 'css',
  '.net': 'dotnet',
  dotnet: 'dotnet',
  powershell: 'powershell',
  sql: 'database',
  'rest apis': 'braces',
  'rest api': 'braces',
  git: 'git',
  'git & github': 'git',
  github: 'github',
  vite: 'vite',
  firebase: 'firebase',
  godot: 'godot',
  gdscript: 'godot',
  figma: 'figma',
  webrtc: 'webrtc',
  oauth: 'key-round',
  'discord api': 'discord',
  discord: 'discord',
  'claude code': 'claude-code',
  claude: 'claude',
  'ai-assisted development (claude code)': 'claude-code',

  // ── Cloud & operating systems ──
  // AWS has no small-size mark: its logo is the "aws" letters plus the smile, and the smile alone is
  // a hairline below ~24px. So only the bare "AWS" (28px marquee) gets the smile; the AWS services
  // get a lucide glyph for what each one is rather than four identical faint curves.
  aws: 'aws',
  'aws ec2': 'server',
  'aws ssm': 'cloud-cog',
  'gamelift streams': 'monitor-play',
  'graviton / arm64': 'cpu',
  linux: 'linux',
  windows: 'windows',
  'windows admin': 'windows',
  android: 'android',
  'fleet automation': 'workflow',

  // ── Networking ──
  unifi: 'ubiquiti',
  'unifi / ubiquiti': 'ubiquiti',
  ubiquiti: 'ubiquiti',
  subnetting: 'network',
  vpns: 'shield-check',
  vpn: 'shield-check',
  sftp: 'folder-sync',
  rcon: 'terminal',

  // ── QA, hardware & PC builds ──
  'qa testing': 'badge-check',
  '3dmark benchmarking': 'gauge',
  'hardware diagnostics': 'stethoscope',
  'hardware assembly': 'wrench',
  'pc building': 'pc-case',
  'part selection': 'list-checks',
  'upgrade planning': 'circle-arrow-up',
  'rtx 5070': 'nvidia',
  nvidia: 'nvidia',
  'ryzen 7 5700x3d': 'amd',
  am4: 'amd',
  amd: 'amd',
  'ddr4-3600': 'memory-stick',
  nvme: 'hard-drive',

  // ── Servers & operations ──
  'server admin': 'server-cog',
  'server administration': 'server-cog',
  'backup and restore': 'archive-restore',
  'change management': 'clipboard-check',
  'log-based incident diagnosis': 'scroll-text',
  'python scripting': 'python',
  'c# plugin development': 'dotnet',
  'dependency management': 'list-checks',

  // ── Rust game server (no official marks exist for these; never the Rust language logo) ──
  shockbyte: 'server',
  'oxide / umod': 'puzzle',
  'plugin configuration': 'settings-2',
  copypaste: 'package-open',
  'raidable bases': 'castle',

  // ── Hardware & making (older template tags, kept so they keep their marks) ──
  arduino: 'arduino',
  'arduino / esp32': 'arduino',
  esp32: 'espressif',
  'raspberry pi': 'raspberry-pi',
  opencv: 'opencv',
  'fusion 360': 'autodesk',
  kicad: 'kicad',
  blender: 'blender',
  'excel / sheets': 'google-sheets',
  'google sheets': 'google-sheets',
};

/** Logo for a name with no entry (tag.svg), so no chip or skill row is ever glyph-less. */
export const TAG_FALLBACK = 'tag';

/** Lookup key: trimmed, lower-cased, whitespace collapsed. */
export function tagKey(name) {
  return String(name ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

/** The logo file key for a name ('AWS EC2' → 'server'), or null when it has no entry. */
export function tagGlyphSpec(name) {
  const key = tagKey(name);
  return key && Object.hasOwn(TAG_GLYPHS, key) ? TAG_GLYPHS[key] : null;
}
