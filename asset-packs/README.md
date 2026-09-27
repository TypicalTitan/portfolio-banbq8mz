# Atakhan asset packs

Three packs of standalone SVG assets in a sharp, cyberpunk-blade style: faceted monoblades with neon edges, chrome and circuitry, and low-poly roses, leaning toward Atakhan from League of Legends. They are not wired into the site. Pick the pieces you like and use them anywhere.

Open **`index.html`** in a browser to see every asset side by side, switch the preview background, and copy an SVG's source or path. After adding or editing assets, rebuild it with `node asset-packs/build-gallery.mjs`.

| Pack | Style | Colours |
|---|---|---|
| **Ruinous** | Blood chrome: neon-edged chrome monoblades, faceted blood roses | chrome and bone, neon red, oxblood |
| **Voracious** | Neon maw: crystal fang blades, polygon night orchids, a HUD maw-eye | void violet, neon violet, magenta |
| **Thornbound** | Gilded circuit: black-iron blades with gold circuitry, a crowned rose | iron black, gold and amber neon, blood red |

Each pack has the same files, so a corner from one pack can sit beside a divider from another:

| Folder | Files | Notes |
|---|---|---|
| `corners/` | `corner-a` (240×240), `corner-b` (160×160) | Drawn for the top-left corner |
| `dividers/` | `divider-a` (1200×64), `divider-b` (800×24) | Symmetric; the ends taper |
| `frames/` | `frame-card` (480×320) | Empty centre; corner ornaments stay inside 80 units |
| `plates/` | `button-plate` (240×64), `tag-plate` (140×36) | End detail stays inside 40 units |
| `emblems/` | `sigil-main`, `sigil-mono` (256×256), `badge-ring` (200×200) | `sigil-mono` is one colour (`currentColor`) |
| `blades/` | `blade-a` (320×120), `blade-b` (120×320), `crossed-blades` (240×240) | |
| `flora/` | `rose-bloom` (240×240), `petals` (320×200), `thorn-vine` (600×80) | |
| `icons/` | `bullet`, `spark` (24×24), `separator` (48×16) | Built for 16–24px |
| `patterns/` | `pattern-a` (64×64), `pattern-b` (120×120) | Seamless, transparent |
| `backgrounds/` | `hero-backdrop` (1920×1080) | Calm, dark centre for text |

Every pack also has `palette.css` (CSS custom properties such as `--ruinous-blood`) and `palette.json`.

## Using them

Put the files you want in `public/` (for example `public/img/ornaments/`), then reference them from CSS or HTML.

```css
/* Corners: the file is the top-left one; mirror it for the rest. */
.card { position: relative; }
.card::before, .card::after {
  content: ''; position: absolute; width: 120px; height: 120px;
  background: url(img/ornaments/corner-a.svg) no-repeat 0 0 / contain; pointer-events: none;
}
.card::before { top: 0; left: 0; }
.card::after  { right: 0; bottom: 0; transform: scale(-1); }

/* Frame: the corners stay put and the edges stretch. */
.framed { border: 40px solid transparent; border-image: url(img/ornaments/frame-card.svg) 80 / 40px stretch; }

/* Button plate: fixed ends, stretched middle, filled centre. */
.btn-blade { border: solid transparent; border-width: 0 20px; border-image: url(img/ornaments/button-plate.svg) 0 40 fill / 0 20px stretch; }

/* One-colour sigil tinted with any colour. */
.sigil { width: 48px; aspect-ratio: 1; background: currentColor;
  -webkit-mask: url(img/ornaments/sigil-mono.svg) center / contain no-repeat;
          mask: url(img/ornaments/sigil-mono.svg) center / contain no-repeat; }

/* Patterns tile; backdrops cover. */
.band { background: url(img/ornaments/pattern-a.svg) repeat, #070304; }
.hero { background: url(img/ornaments/hero-backdrop.svg) center / cover no-repeat; }
```

CSS masks only load when the page is served (by `npm run dev` or any web server); a page opened straight from disk shows nothing for them.

Every element id inside a file is prefixed with its pack and file name (for example `ruinous-corner-a-…`), so several assets can be pasted inline into one page without clashing.
