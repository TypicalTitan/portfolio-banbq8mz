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

## Bloodhaze: avatar decoration and film look

A fourth pack in a different medium, after a hazy red film photo and an animated avatar decoration: an **animated avatar decoration** with a thorn crown, and **film overlays** that give any photo a red, dusty, double-exposed look. See it in use in `bloodhaze/demo.html`.

**Avatar decoration** (`bloodhaze/avatar/`): a 5-second loop. A dark crimson ring shifts from coral to violet; a blade of light sweeps round it; a horned black thorn crown grows over the top, flickers and burns away; pink-white lightning crackles along the bottom; embers drift and film dust flickers.

| File | Use |
|---|---|
| `avatar-decoration.apng` (1.7 MB) | Transparent and looping; plays in every browser as an `<img>`. 288×288, the Discord decoration format. |
| `avatar-decoration.webm` (0.3 MB) | Transparent VP9, the lightest option for Chrome, Edge and Firefox. Safari may not show WebM transparency, so use the APNG there. |
| `avatar-decoration.png` | A still frame with the crown up. |
| `avatar-decoration-preview.mp4` | Two loops around a sample avatar, for a quick look. |

The avatar fills the middle 240×240 of the 288×288 frame, so the decoration box is 120% of the avatar and centred on it:

```html
<div class="avatar">
  <img src="me.jpg" alt="…">
  <img class="deco" src="img/bloodhaze/avatar-decoration.apng" alt="">
</div>
```
```css
.avatar { position: relative; width: 160px; aspect-ratio: 1; }
.avatar > img:first-child { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.avatar > .deco { position: absolute; inset: -10%; width: 120%; height: 120%; pointer-events: none; }
```

Discord only offers decorations from its own shop, so this one is for your site and anywhere else that takes an animated overlay. The source is `bloodhaze/src/avatar-decoration.html` (open it to watch it live); after editing it, re-export with `FFMPEG=… node asset-packs/bloodhaze/src/export.mjs`.

**Film look** (`bloodhaze/film/`): `clouds.png` (a sea of clouds for the double exposure), `light-leak.png`, `dust.png`, `grain.png` (tiles) and `gradient-map.svg`, which maps a photo's brightness onto black, oxblood, crimson, coral and pale pink. Paste the gradient map's `<svg>` into the page (Chrome only applies filters defined in the same document), then:

```html
<div class="bloodhaze"><img src="photo.jpg" alt="…"><span class="bloodhaze__film" aria-hidden="true"></span></div>
```
```css
.bloodhaze { position: relative; overflow: hidden; isolation: isolate; }
.bloodhaze img { display: block; width: 100%; filter: contrast(1.1) url(#bloodhaze-map); }
.bloodhaze::before, .bloodhaze::after, .bloodhaze__film { content: ''; position: absolute; inset: 0; pointer-events: none; }
.bloodhaze::before { z-index: 1; background: url(film/clouds.png) center 65% / cover no-repeat; mix-blend-mode: screen; opacity: .5; }
.bloodhaze__film { z-index: 2; mix-blend-mode: multiply;
  background: radial-gradient(120% 90% at 45% 40%, transparent 50%, rgba(10, 2, 5, .7) 100%),
              linear-gradient(100deg, #ffd2c8 0%, #fff 45%, #c9a4ff 100%); }
.bloodhaze::after { z-index: 3; mix-blend-mode: screen;
  background: url(film/dust.png) center / cover, url(film/grain.png) 0 0 / 256px repeat,
              url(film/light-leak.png) center / cover no-repeat; }
```

The overlays are generated (`node asset-packs/bloodhaze/src/film.mjs` rebuilds them identically).
