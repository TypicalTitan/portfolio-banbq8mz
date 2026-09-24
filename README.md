# TypicalTitan — Stephan Varganov's portfolio

This is the personal portfolio of **Stephan Varganov** ([TypicalTitan on GitHub](https://github.com/TypicalTitan)), a cybersecurity and networking student focused on cloud ops. It's a fast, accessible single-page site built with **Vite + vanilla JS** and styled in a crimson / lava / petal look.

It is built on a student-portfolio **template**: the layout stays the same and all content comes from **one file**, `src/content.js`, plus the images in `public/`. Every fact on the site comes from Stephan's own information (the two project case studies were written from his own session history and checked claim by claim). Anything not provided yet is **hidden**: a `null` date, summary, GPA or résumé, or an empty list of labs or testimonials. There is no placeholder text.

What the template gives you:

- A hero with a living lava field, your blackletter handle, and up to three featured projects rising out of the card (one or two are laid out to look balanced too)
- A proof strip, a scrolling tools strip and featured project rows. A filterable All projects grid appears once you have more projects than the Featured rows show.
- Experience, about, a slanted skills fan, education and certifications, and a contact banner
- Optional sections that stay hidden until you fill them in: a **lab notebook** with full lab-report pages, leadership and activities, and references
- A case-study page for every project (`#/projects/<slug>`, e.g. `#/projects/rust-server`)
- No framework, no CDN and no tracking. It works offline, prints cleanly and respects *reduce motion*

> **Before you publish:** replace what's still a placeholder:
> - Swap `img/portrait.svg` for a photo, or set `person.photo: null` to hide the avatar.
> - Optionally replace the illustrated project covers and org monograms (see [Replacing images](#replacing-images-pdfs-and-data)).
>
> Then run `npm run check -- --strict`. It flags the placeholders it knows about, such as the placeholder portrait. Check links by hand.

---

## Quick start

You need [Node.js](https://nodejs.org) 20.19+ or 22.12+.

```bash
npm install        # once
npm run dev        # local preview with hot reload → http://localhost:5173
npm run check      # validate src/content.js and every file it points to
npm run build      # production build → dist/
npm run preview    # serve dist/ locally to double-check the build
```

`npm run check` runs `scripts/check-content.mjs`. It fails (exit code 1) with a clear message when something is wrong, for example:

```
✗ content.js has 2 problems:
  ✗ projects[1] (pc-builds).category: "Builds" is not listed in site.projectCategories
  ✗ projects[0] (rust-server).cover.src: file not found: public/img/projects/rust-server/cover.jpg
```

It checks that:

- every image, PDF and CSV path exists under `public/` and has no leading `/`
- slugs and ids are unique
- every `category`, award → `project` link and headline `accent` resolves
- icon names and enum values are spelled right
- every image's `width`/`height` matches the real file's shape

Warnings (for example "still the placeholder portrait") don't fail the check unless you add `--strict`.

---

## Editing `src/content.js`

Everything the site shows lives in `src/content.js`. **Keep the keys and change the values.** The layout rebuilds itself from this file. The comments at the top of the file repeat these rules:

| Rule | Example |
|---|---|
| Paths are relative, with **no leading slash** | `'img/portrait.jpg'` → `public/img/portrait.jpg` |
| Dates are `'YYYY-MM'` or `'YYYY-MM-DD'`; `end: null` means "Present" | `start: '2026-01', end: '2026-06'` |
| Don't know the dates? Set **both** `start` and `end` to `null` and they're hidden | `start: null, end: null` |
| Don't know a fact? Use `null` (or `[]` for a list). Never guess. | `gradYear: null`, `pronouns: null` |
| `slug` becomes the page URL, lowercase-with-dashes, unique | `slug: 'rust-server'` → `#/projects/rust-server` |
| A headline `accent` is one word that appears **exactly** inside its title | `title: "Things I've built", accent: 'built'` |
| `null`, `''` or `[]` hides that thing: no empty boxes, no dead buttons | `links: { demo: null, … }` hides "Live demo" |
| An empty list hides the whole section **and** its nav link | `labs: []`, `testimonials: []` |
| `icon` is a lucide icon name from the whitelist in `src/lib/icons.js` | `'Server'`, `'Cpu'`, `'Cloud'`, `'Network'` |
| To use another [Lucide](https://lucide.dev/icons) icon, add its name to the `import` and to the `LUCIDE` map in `src/lib/icons.js` | `Rocket` |
| Text with an apostrophe goes in double quotes (or use a curly ’) | `"Things I've built"` |
| Plain text only, no HTML | |

### Field-by-field

**`site`**: site-wide settings.
- `title` and `description`: the browser tab, the search snippet and link previews (Discord, LinkedIn). They are written into `index.html` for you when the site builds.
- `updated` and `copyrightYear`: shown in the footer.
- `currently`: the footer's "Currently" note; `null` hides it.
- `marquee`: the scrolling tools strip. Every name gets a glyph, and so does every Skills item and every tag / skill chip (see **Skill and tag glyphs** below).
- `projectCategories`: the filter buttons, in order (currently `['Servers', 'Hardware']`). Every `project.category` must be listed.
- `sections`: the eyebrow, title, accent word and blurb for every section.

**`person`**: you.
- Identity:
  - `name`: your real name, used everywhere.
  - `handle`: the blackletter display name.
  - `pronouns`: `null` hides them.
- Headline copy: `tagline` (hero), `pitch` (the About headline; it must contain `sections.about.accent`), and 1–2 `bio` paragraphs.
- `photo`: your portrait; `null` hides the avatar.
- Facts:
  - `location`, `school` and `focus`.
  - `gradYear`: a number, or `null` to hide the hero's "Class of …" chip and the About "Graduating" fact.
  - `interests`: a list shown as an "Interests" row in the About facts, e.g. `['Ethical hacking', 'PC building', 'Climbing']`. `[]` hides the row.
- `availability`: the hero pill, the rotating sticker and the About pill.
  - `open: true` shows the hero pill (`label`) and the About pill (`season`, with `detail` under it).
  - `open: false` hides the pills and makes no availability claim. `label`, `season` and `detail` can then be `null`.
  - `sticker` is decorative. The rotating hero disc shows whenever `sticker` is a non-empty string, **whatever `open` is**. `null` hides it.
- Contact:
  - `email`.
  - `responseTime`: e.g. `'I reply within two days.'`. `null` hides the line.
  - `resume`: `{ href, label, fileInfo }`, e.g. `{ href: 'files/resume.pdf', label: 'Résumé', fileInfo: 'PDF · 1 page' }`. With `resume: null`, every Résumé button and the résumé contact tile disappear. The nav's main button and the hero's second button then become **Get in touch** (→ `#contact`), so there's never an empty slot.
- `strengths`: exactly 5 checklist lines.
- `socials`: any of `github`, `linkedin`, `youtube`, `devpost`, `itchio` or `email`. One is fine: with only GitHub, the contact banner shows balanced Email + GitHub tiles.

**`stats`**: the proof strip under the hero. You have two options:
- Leave it `null` to fill it automatically from your projects, labs and roles, plus your GPA (or your awards when `showGpa` is `false`). Lab counts drop out while `labs` is `[]`.
- Supply exactly 4 `{ value, unit, label, href }` items. Each `href` must point at a section that exists (`'#work'`, `'#experience'`, `'#awards'`). For example: `{ value: '2', unit: null, label: 'Projects', href: '#work' }`.

**`education`**: one entry per school, main school first.
- `school`, `program`, and `location` (`null` hides it).
- `start`/`end`, plus `expected: true` for a future graduation date. Set **both** `start` and `end` to `null` to hide the date range.
- `status`: optional text shown where the dates would be, for example `'In progress'`. `null` hides it.
- `showGpa` and `gpa`: set `showGpa: false` (and `gpa: null` if you have none) to hide the GPA everywhere.
- `honors` and `coursework`: `[]` hides each block. Example: `coursework: ['MATH 141 (completed)']`.

**`projects`**: the core of the site.
- The hero collage and the Featured rows use the first three projects with `featured: true`, sorted by `order`. With only one or two featured projects, the collage is laid out for that number, with no empty slot.
- The All projects grid, and the Previous/Next links on project pages, list featured projects first, then newest `year`, then `order`.
- The grid (and its nav and footer links) only appears when it adds something. It stays hidden when every project is featured and they all fit in the Featured rows, as with the two projects here.

Each project has:

- Basics: `slug`, `title`, `subtitle`, `category` (must be in `site.projectCategories`), `year` and `badges`.
  - `year: null` hides the year wherever it shows. The card meta then reads just `Servers` instead of `Servers · 2026`.
  - `badges: []` shows none.
- Look: `icon` (e.g. `'Server'`, `'Cpu'`), `theme` (`lava` · `dusk` · `violet` · `ember`) and `frame`. Use `'window'` for software screenshots and `'plate'` for photos or renders of physical things.
- People: `role`, `team: { size, members }`, `duration` and `context`.
  - Any of these can be `null`, which hides that fact. `team: null` also hides the "Team of N" chip.
- `summary`: 1–2 sentences for cards.
- `cover` image.
- `tags`: the tech used. Each tag gets its glyph (a brand logo or a fitting icon).
- `links`: `{ demo, repo, video }`. Set one to `null` to hide its button. With all three `null`, the only button is **Case study**.
- `metrics`: 2–4 `{ value, unit, label }` items. `value` is text, so `'2nd'` works. `[]` hides the stats strip on the card, the row and the detail page.
- `writeup`:
  - `problem` and `outcome`.
  - `process`: an `intro` plus `steps`. Each step can point at a `gallery` index. `steps: []` shows the intro on its own, with no empty list.
  - `lessons`: `[]` hides "What I learned".
- `skills`: what the project shows about you.
- `gallery`: images with captions. `wide: true` spans two columns. `[]` hides the gallery.

**`labs`**: optional lab reports. **`labs: []` hides the whole feature**: the Lab notebook section, its nav link, the footer's "Lab notebook" and "Every lab" links, and the lab stats. `#/labs` then shows the 404 page. When you add labs, each needs:

- Basics: `subject` (the filter on `#/labs`), `course`, `labNumber`, `date`, `instructor`, `partners`, `duration`, `icon`.
- `featured: true` on the **one** lab shown large on the home page. Without it, the newest lab is shown.
- `cover`: normally your Figure 1.
- `objective` and `hypothesis`.
- `verdict`: `'supported'`, `'partial'` or `'refuted'`. The site always spells the verdict out in words.
- `materials` and `method` (`summary` + `steps`).
- `results`:
  - `summary`.
  - 1–3 `keyValues`. The first is the headline number, and `uncertainty` shows as ±.
  - A `table` of `columns` (`label`, `unit`, `numeric`) and `rows` (text cells).
- `figures`, `conclusion`, `errors` and `improvements`.
- `skills`.
- `files`: `{ report, data }`, the PDF and CSV download buttons.

**`experience`**: newest first.
- What and where:
  - `role` and `org`.
  - `orgUrl`: a link on the org name; `null` for plain text.
  - `type`: `internship` · `job` · `volunteer` · `research`.
  - `location`: `null` hides it.
- Dates: `start`/`end`. With **both** set to `null`, there's no date pill and the role sorts after the dated ones.
- `summary`.
- `logo`: a **white mark on a transparent background**, 256 × 192. It sits on a dark crimson panel.
- `achievements`: up to 6 are shown. Lead with what you did. `[]` hides the block.
- `skills` (`[]` hides the chips), plus an optional `quote` (`null` hides it).

**`skills`**: 4–5 groups, shown as the slanted fan.
- Each group has `group`, `icon` (e.g. `'Cloud'`, `'Code'`, `'Network'`, `'Gauge'`), `theme` (`lava` · `dusk` · `crimson` · `violet` · `ember`) and `blurb`.
- Each item has a `name` and a `level`:
  - `core`, `working` or `learning`.
  - `null` shows no level glyph. When no item in any group has a level, the level legend is hidden too.
- Each item's "uses" count is automatic: the projects whose `tags` include it, plus the labs whose `skills` include it (case-insensitive). A count of 0 isn't shown. Spell skill items exactly like your tags.

**`awards`**: certifications and awards, shown in the order you list them. Each has:
- `kind`: `award` · `certification`.
- `status`: `'earned'` (the default) or `'planned'`. A planned item shows a **Planned** tag in place of a date, styled so it can't be mistaken for an earned one. The check warns if a planned item has a `date`, because that date isn't shown.
- `title`, `issuer` and `date`. `issuer: null` and `date: null` hide those lines, including on earned items.
- `detail`.
- `project`: a project slug, which adds a "See project" link.
- `url`: adds a "Credential" link.

For example, `{ kind: 'certification', status: 'planned', title: 'Security+', issuer: 'CompTIA', date: null, … }`.

**`activities`**: leadership and clubs. Each entry has `role`, `org`, `start`/`end`, `description` and `icon`. `[]` hides the section.

**`testimonials`**: optional quotes, each with `quote`, `name`, `role` and `relationship`. Only quote people who agreed to it, word for word. `[]` hides the section.

### `index.html` fills itself in

The page `<title>`, the search/link-preview description and the no-JavaScript line are generated from `content.js` whenever the site builds (see `vite.config.js`). They use `site.title`, `site.description`, your name, your email and, when it's set, your résumé. There is nothing to edit in `index.html`.

**Optional things:**
- `person.photo: null` hides the avatar.
- `person.resume: null` hides every Résumé button; the main buttons become "Get in touch".
- Handles up to about 14 characters look best. Longer ones are scaled down on phones so they still fit.

### Skill and tag glyphs

The marquee, each Skills item and every chip (experience skills, project tags, project "Skills demonstrated") show a small glyph before the name. One table decides which: `TAG_GLYPHS` in `src/lib/tag-glyphs.js`, keyed by the name in lower case.

- A real brand mark when the thing has one: *Python*, *C++*, *Git*, *Linux*, *WebRTC*, *Android*, *AWS*, *Windows*, *PowerShell*, *.NET*, *Discord API*, *Claude Code*…
- The maker's mark for a product line: *RTX 5070* → NVIDIA; *Ryzen 7 5700X3D*, *AM4* → AMD; *Windows admin* → Windows; *UniFi* → Ubiquiti. AWS is the exception: its mark is the "aws" letters plus the smile, and the smile alone is too thin below about 24px, so only *AWS* in the tools strip gets the smile. *AWS EC2*, *AWS SSM*, *GameLift Streams* and *Graviton / ARM64* use icons (Server, CloudCog, MonitorPlay, Cpu).
- Otherwise a Lucide icon that says what it is: *Subnetting* → Network, *SQL* → Database, *NVMe* → HardDrive, and so on. The Rust-server plugins (Oxide / uMod, NTeleportation, Better Loot, Raidable Bases) and Shockbyte have no official marks, so they use icons too.

To give a new tag a glyph, add a line to `TAG_GLYPHS`: `'my tag': 'brand:python'` for a brand, or `'my tag': 'Rocket'` for a [Lucide](https://lucide.dev/icons) icon (add that icon to the `import` and the `LUCIDE` map in `src/lib/icons.js` too). A name with no entry still shows, with a plain tag icon, and `npm run check` warns about it. Brand keys live in `BRAND_PATHS` in `src/lib/icons.js` (Simple Icons, imported by name) and in `src/lib/brand-extra.js`, which holds the few marks Simple Icons lacks as copied path data. A mark much wider than tall sets `aspect` there (the .NET wave uses 1.4) so it is drawn wider and matches the square marks' weight. Every mark is drawn in one colour (`currentColor`), never the brand's own colours.

---

## Replacing images, PDFs and data

Every image lives in `public/`. Replace a file with your own, **or** point `content.js` at a new file name. If you switch format, change the extension too: `cover.svg` → `cover.jpg`. Then set `width`/`height` to the new file's real pixel size and run `npm run check`.

The current placeholders are original illustrations:

- `img/projects/rust-server/cover.svg`: a server console listing the Oxide plugins.
- `img/projects/pc-builds/cover.svg`: a PC tower with a glass side panel.
- `img/orgs/playcast.svg`, `camp-zanika-lache.svg` and `raaj-gharana.svg`: simple monograms. They are **not** the organisations' real logos, so they are switched off (`logo: null` in `experience`, which shows plain initials instead). Add the official mark only if you have permission to use it.
- `img/portrait.svg`: a silhouette.

Unused files are removed from `public/`, so the lab, résumé and gallery folders below only exist once you add them.

| What | Where | Required shape | Tips |
|---|---|---|---|
| Portrait | `img/portrait.*` | 800 × 1000 (4:5) | Shown small and rounded. Warm or red light suits the theme. |
| Project cover | `img/projects/<slug>/cover.*` | **16:10 landscape**, e.g. 1600 × 1000 | A screenshot for `window` frames, a photo or render for `plate` frames. Crop portrait phone photos to 16:10 first — other shapes get cropped. |
| Gallery image | `img/projects/<slug>/gallery-N.*` | 16:10 (1600 × 1000), or 2400 × 1000 for `wide` | Give each one a caption. |
| Lab figure | `img/labs/<slug>/fig-N.*` | **16:9 landscape**, e.g. 1600 × 900 | Export charts at 2× from Sheets, Logger Pro or matplotlib. |
| Org logo | `img/orgs/<id>.*` | 256 × 192 | A white mark on transparent (SVG or PNG). It sits on a dark crimson panel. |
| Résumé | `files/resume.pdf` | 1 page | Add the file, then set `person.resume` (it's `null` now, which hides every Résumé button). |
| Lab report | `files/labs/<slug>.pdf` | any | `files.report: null` hides the button. |
| Raw data | `files/labs/<slug>.csv` | any | `files.data: null` hides the button. |
| Favicon | `favicon.svg` | 40 × 40 | The yin-yang sigil. Replace it with your own mark if you like. |

Image tips:

- **JPG** suits photos, **PNG** suits screenshots, **SVG** suits diagrams and logos. iPhone **HEIC** photos don't show in Chrome or Edge — export them as JPG (Settings → Camera → Formats → Most Compatible). `npm run check` catches this.
- Keep each file under about 300 KB and about 1600 px wide. [Squoosh](https://squoosh.app) is free and easy. The check warns about files over 500 KB.
- Keep file names **lowercase** and type them exactly: GitHub Pages treats `Cover.JPG` and `cover.jpg` as different files, even though Windows doesn't. (Turn on **View → File name extensions** in Explorer to see the real name.)
- Write `alt` text that says what the image shows ("Illustrated server console listing the installed Oxide plugins"), not "image of…".
- Images below the fold are lazy-loaded, and `width`/`height` reserve their space so the page never jumps.

---

## Deploying to GitHub Pages

`vite.config.js` uses `base: './'` and the site uses **hash routing** (`#/projects/rust-server`). Together these mean the build works from any sub-path, such as `https://<you>.github.io/School-Portfolio/`. Refreshing or sharing a deep link also works, with no 404 tricks needed.

### Option A: GitHub Actions (recommended)

1. Push the repo to GitHub. The included `.gitignore` keeps `node_modules/` and `dist/` out of it. Your default branch must be called `main` (`git branch -M main`), or edit `branches:` in the workflow.
2. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The workflow is already included as `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      # `npm run build` runs `npm run check` first; a content problem stops the deploy here.
      - run: npm run build
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

Every push to `main` now checks your content, builds the site and publishes it. `npm run build` always runs `npm run check` first, so if it finds a problem the deploy stops and your live site stays as it was.

### Option B: the `gh-pages` branch

```bash
npm run build
npx gh-pages -d dist
```

Then open **Settings → Pages** and set **Source** to the `gh-pages` branch.

### Unlisted (link-only) sharing

GitHub Pages sites are always public: anyone who has the URL can open the site. What you can control is whether people find it.

- `index.html` includes `<meta name="robots" content="noindex, nofollow">`, which asks search engines not to list the site. Delete that line if you *want* to appear in search results.
- Pick a repo name that's hard to guess. The URL is `https://<you>.github.io/<repo-name>/`.
- A **private** repo keeps the source code off your GitHub profile, but the site itself stays public. Pages on private repos needs GitHub Pro, which students get free through the [GitHub Student Developer Pack](https://education.github.com/pack).
- `robots.txt` doesn't help here: crawlers only read it at the domain root, not on a `/<repo-name>/` project site.

---

## Design system

The look is a black stage lit by its own fire. Atmosphere lives in colour, texture, type and edge effects, while the content stays structured like a résumé: role, dates, evidence. All tokens live in `src/styles/tokens.css`.

### Palette

| Role | Token | Value |
|---|---|---|
| Canvas | `--c-bg` / `--c-surface-1…3` | `#0a0204` / `#140609` `#1d0a10` `#2a0f18` |
| Headings / body text | `--c-ink` / `--c-text` | `#fbf3f5` / `#e8dade` |
| Secondary / meta text | `--c-muted` / `--c-subtle` | `#b9a9ae` / `#8f7d83` |
| The only pink for text | `--c-accent-text` | `#ff7a95` |
| Crimson (primary fill) | `--c-crimson-500` / `-400` | `#c8102e` / `#e0173a` |
| Hot glow and petals (decorative only) | `--c-hot` / `--c-petal` | `#ff2d55` / `#ff3355` |
| Lava | `--c-lava` / `--c-lava-hi` / `--c-lava-gold` | `#ff4a00` / `#ffb000` / `#ffd98a` |
| Dusk strips (everything lab-related) | `--g-strip` | `#1b3a55 → #4a1f4f` |
| Violet (minor) | `--c-violet-1` / `-2` | `#3b1a6e` / `#8a3fd1` |

Text colours are chosen for WCAG AA contrast on every dark surface. Hot pink is never used for text.

### Type

| Role | Font |
|---|---|
| Blackletter moments | **Grenze Gotisch**: the hero handle, the nav monogram, the footer wordmark, "something." in the contact banner, the 404 numerals. Never smaller than 28 px, never all-caps. |
| Everything else | **Inter**: heavy italic uppercase section headlines with one lava-gold accent word, and thin (200-weight) numerals for stats |
| Data | **JetBrains Mono**: tables, lab values, indices |

All three fonts are self-hosted through `@fontsource-variable`, with no Google Fonts request.

### Effects

- **Lava:** a low-resolution 2D canvas noise field, drawn in the hero, contact banner and 404.
- **Particles:** canvas embers and crimson petals. The petal storm lives on the About band.
- **Thorns and sigils:** SVG thorn vines on the hero corners and the portrait, which draw themselves in and flicker with pink arcs. The yin-yang sticker, favicon and contact sigil share one geometry.
- **Other details:** ember bullets, lava underlines, dragon-scale texture and grain.

Effects start only after the page has loaded and the browser is idle. They pause when off-screen or when the tab is hidden, and they're cleaned up when you change pages.

### Reduced motion

With **Reduce motion** turned on (in the OS or browser settings), and even when it's toggled while the page is open:

- The lava, embers and petals each render **one still frame**. The look stays, and no animation loop runs.
- The tools strip becomes a static wrapped list.
- The sticker and sigil stop spinning.
- Reveals, parallax and smooth scrolling are turned off.
- Page changes are instant.

### Accessibility and performance

Accessibility:

- Semantic landmarks, one `h1` per page, and a skip link.
- Visible focus rings, and keyboard-trapped dialogs that close with Esc.
- Filters use `aria-pressed` buttons and announce their result counts.
- The print stylesheet prints clean black-on-white.

Performance:

- Only same-origin assets. JS stays under about 60 KB gzipped.
- The hero headline is the LCP and never waits on effects or images.

---

## Project layout

```
index.html              page shell (title, description and noscript line come from content.js)
vite.config.js          base: './' for GitHub Pages
src/content.js          ← all the content
src/main.js, router.js  wiring and hash routing
src/lib/                DOM builder, icons (+ tag-glyphs.js, brand-extra.js), formatting, shared UI pieces
src/effects/            lava, particles, thorns, sigils, reveal, scheduler
src/render/             one renderer per section / page
src/styles/             tokens, base, chrome, effects and per-section CSS
public/                 images and files (copied as-is into dist/)
scripts/check-content.mjs   npm run check
```

## Credits

- [Inter](https://rsms.me/inter/), [Grenze Gotisch](https://fonts.google.com/specimen/Grenze+Gotisch) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/): SIL Open Font License.
- Icons: [Lucide](https://lucide.dev) (ISC).
- Brand glyphs: [Simple Icons](https://simpleicons.org) (CC0); the AWS smile (cut from the AWS mark), Windows and PowerShell marks from [Material Design Icons](https://pictogrammers.com/library/mdi/) (Apache-2.0); the .NET mark from [Devicon](https://devicon.dev) (MIT). The AMD mark is the arrow from Simple Icons' AMD logo. All brands and logos are trademarks of their owners.
- The placeholder art in `public/` (portrait, project covers, org monograms, favicon) is original and part of this template. The org monograms are not the organisations' logos. Replace any of it freely.
