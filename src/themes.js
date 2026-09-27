/**
 * Theme packs. Plain data (no DOM), so vite.config.js can read it for the pre-paint script.
 *
 * Each pack is two halves that must agree:
 *   • CSS: the token overrides under :root[data-theme="<id>"] in src/styles/themes.css
 *   • JS:  the palette below, for what CSS cannot reach: the lava / particle canvases.
 *
 * 'titan' is the original crimson-and-lava look and sets no data-theme attribute. Every other
 * pack also switches to blade geometry (bevelled, asymmetric corners) and the bladed-rose sigil.
 * Pick the site-wide default with `site.theme` in src/content.js; visitors can switch from the nav.
 *
 * Canvas colours: `lava.*` are 6 stops from coolest to hottest plus a white-hot `core`;
 * `embers.tints` are [core, body, edge] as "r,g,b"; each petal is { shape, tip, base, weight }
 * where shape is 'petal' (rounded rose petal), 'blade' (pointed petal) or 'sickle' (thin crescent).
 */

export const DEFAULT_THEME = 'titan';

export const THEME_PACKS = [
  {
    id: 'titan',
    name: 'Titan',
    tagline: 'Crimson, lava and thorns',
    bg: '#0a0204',
    swatch: ['#c8102e', '#ff4a00', '#ffd1dc'],
    lava: {
      stops: ['#0a0204', '#2a050c', '#6b0a18', '#c8102e', '#ff4a00', '#ffb000'],
      dusk: ['#07040a', '#1b3a55', '#4a1f4f', '#a0265f', '#ff3b6b', '#ffd1dc'],
      violet: ['#07030d', '#3b1a6e', '#6a1a4a', '#8a3fd1', '#ff6b8e', '#ffd1dc'],
      core: '#fff1c2',
    },
    embers: {
      shape: 'round',
      tints: [
        ['255,241,194', '255,176,0', '255,74,0'],
        ['255,196,150', '255,74,0', '255,74,0'],
        ['255,200,214', '255,45,85', '255,45,85'],
      ],
    },
    petals: [
      { shape: 'petal', tip: '#ff3355', base: '#c8102e', weight: 0.62 },
      { shape: 'petal', tip: '#ff6682', base: '#9e0b24', weight: 0.38 },
    ],
    sheen: '255,214,222',
    rib: '255,140,160',
  },
  {
    id: 'ruinous',
    name: 'Ruinous',
    tagline: 'Blood roses and bone blades',
    bg: '#070304',
    swatch: ['#b10a27', '#f4dccb', '#ff3653'],
    lava: {
      stops: ['#070304', '#1f0307', '#56060f', '#a10a24', '#ff2e4c', '#f4d2c0'],
      dusk: ['#060405', '#1d2329', '#45121d', '#8a1a33', '#ff4a63', '#f3e4d6'],
      violet: ['#070305', '#2e0c18', '#52101f', '#7c1631', '#ff5a6e', '#f3e4d6'],
      core: '#fff6ee',
    },
    embers: {
      shape: 'shard',
      tints: [
        ['255,246,238', '244,220,203', '255,54,83'],
        ['255,200,200', '255,54,83', '177,10,39'],
        ['255,220,226', '255,31,69', '255,31,69'],
      ],
    },
    petals: [
      { shape: 'blade', tip: '#e0183a', base: '#8a0820', weight: 0.45 },
      { shape: 'petal', tip: '#ff3a55', base: '#b10a27', weight: 0.3 },
      { shape: 'sickle', tip: '#f3e4d6', base: '#9a8a80', weight: 0.25 },
    ],
    sheen: '255,228,220',
    rib: '255,150,160',
  },
  {
    id: 'voracious',
    name: 'Voracious',
    tagline: 'Violet hunger, magenta maw',
    bg: '#07040c',
    swatch: ['#8420c9', '#ff2e9a', '#f1dcff'],
    lava: {
      stops: ['#07040c', '#1c0833', '#43107a', '#8420c9', '#ff2e9a', '#ffb8e6'],
      dusk: ['#05050c', '#0f2c3d', '#3d145e', '#8a2ab0', '#ff4fb0', '#f1dcff'],
      violet: ['#06030e', '#321066', '#5a1a6a', '#7a36d6', '#ff6ad0', '#f1dcff'],
      core: '#fff0fa',
    },
    embers: {
      shape: 'shard',
      tints: [
        ['255,236,250', '255,155,220', '255,46,154'],
        ['240,210,255', '214,59,255', '132,32,201'],
        ['255,220,245', '255,46,154', '255,46,154'],
      ],
    },
    petals: [
      { shape: 'blade', tip: '#b62af0', base: '#3a0f60', weight: 0.45 },
      { shape: 'petal', tip: '#ff4fb0', base: '#6a1aa0', weight: 0.35 },
      { shape: 'sickle', tip: '#f1dcff', base: '#8a6ab0', weight: 0.2 },
    ],
    sheen: '241,220,255',
    rib: '230,150,255',
  },
  {
    id: 'thornbound',
    name: 'Thornbound',
    tagline: 'Black thorns and Noxian gold',
    bg: '#080706',
    swatch: ['#c99a2e', '#e8243c', '#080706'],
    lava: {
      stops: ['#080706', '#1a1206', '#3d2808', '#8a5a0c', '#e89a14', '#ffd35a'],
      dusk: ['#060505', '#1f2226', '#3d1a14', '#8a2a1c', '#e8243c', '#f6e2b8'],
      violet: ['#070504', '#2a1a0c', '#4d1f17', '#8a5a14', '#e8a31c', '#f6e2b8'],
      core: '#fff8e0',
    },
    embers: {
      shape: 'shard',
      tints: [
        ['255,248,224', '255,211,90', '232,154,20'],
        ['255,236,200', '232,154,20', '160,90,8'],
        ['255,210,210', '232,36,60', '232,36,60'],
      ],
    },
    petals: [
      { shape: 'petal', tip: '#d8182f', base: '#6a0913', weight: 0.5 },
      { shape: 'blade', tip: '#a8101f', base: '#3a0508', weight: 0.3 },
      { shape: 'sickle', tip: '#ffd35a', base: '#8a5a14', weight: 0.2 },
    ],
    sheen: '255,220,200',
    rib: '255,140,120',
  },
];

export const THEME_IDS = THEME_PACKS.map((pack) => pack.id);
