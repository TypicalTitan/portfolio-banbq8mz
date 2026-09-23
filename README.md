# TypicalTitan — Student Engineer Portfolio (template)

A fast, accessible, single-page portfolio for high-school engineers, built with **Vite + vanilla JS** and styled in a crimson / lava / petal look. It is a **template** for *Stepan Varganov (TypicalTitan)*: every description is lorem ipsum, and the projects, labs, jobs, schools, numbers, images and PDFs are realistic placeholders. You make it yours by editing **one file**, `src/content.js`, and swapping the files in `public/`.

What you get:

- A hero with a living lava field, your blackletter handle, and your best three projects rising out of the card
- A proof strip (projects · labs · roles · GPA), a scrolling tools strip, featured project rows and a filterable project grid
- A **lab notebook** with full lab-report pages: hypothesis, method, data table, figures, verdict, sources of error
- Experience, about, a slanted skills fan, education and honors, leadership, references and a contact banner
- Case-study pages for every project (`#/projects/<slug>`) and every lab (`#/labs/<slug>`)
- No framework, no CDN, no tracking. It works offline, prints cleanly and respects *reduce motion*

> **Before you publish:** replace the placeholders, then run `npm run check -- --strict`. It flags the placeholders it knows about: the portrait, the email, the LinkedIn link, the placeholder PDFs and any text that still mentions the template's placeholder school (Northgate). Repo and demo links are yours to check by hand.

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
  ✗ projects[4] (crimson-60).category: "Art" is not listed in site.projectCategories
  ✗ projects[2] (rootsense).cover.src: file not found: public/img/projects/rootsense/cover.jpg
```

It checks that:

- every image, PDF and CSV path exists under `public/` and has no leading `/`
- slugs and ids are unique
- every `category`, award → `project` link and headline `accent` resolves
- icon names and enum values are spelled right
- every image's `width`/`height` matches the real file's shape

Warnings (for example "still the placeholder PDF") don't fail the check unless you add `--strict`.

---

## Editing `src/content.js`

Everything the site shows lives in `src/content.js`. **Keep the keys and change the values.** The layout rebuilds itself from this file. The comments at the top of the file repeat these rules:

| Rule | Example |
|---|---|
| Paths are relative, with **no leading slash** | `'img/portrait.jpg'` → `public/img/portrait.jpg` |
| Dates are `'YYYY-MM'` or `'YYYY-MM-DD'`; `end: null` means "Present" | `start: '2024-08', end: null` |
| `slug` becomes the page URL, lowercase-with-dashes, unique | `slug: 'titanbot'` → `#/projects/titanbot` |
| A headline `accent` is one word that appears **exactly** inside its title | `title: 'Lab notebook', accent: 'notebook'` |
| `null`, `''` or `[]` hides that thing: no empty boxes, no dead buttons | `links: { demo: null, … }` hides "Live demo" |
| An empty list hides the whole section **and** its nav link | `testimonials: []` |
| `icon` is a lucide icon name from the whitelist in `src/lib/icons.js` | `'Bot'`, `'Cpu'`, `'FlaskConical'`, `'Zap'` |
| To use another [Lucide](https://lucide.dev/icons) icon, add its name to the `import` and to the `LUCIDE` map in `src/lib/icons.js` | `Rocket` |
| Text with an apostrophe goes in double quotes (or use a curly ’) | `"Things I've built"` |
| Plain text only, no HTML | |

### Field-by-field

**`site`**: site-wide settings.
- `title` and `description`: the browser tab, the search snippet and link previews (Discord, LinkedIn). They are written into `index.html` for you when the site builds.
- `updated` and `copyrightYear`: shown in the footer.
- `currently`: the footer's "Currently" note; `null` hides it.
- `marquee`: the scrolling tools strip. Names like *Python*, *C++*, *Arduino*, *Fusion 360* and *KiCad* get their logo automatically.
- `projectCategories`: the filter buttons, in order.
- `sections`: the eyebrow, title, accent word and blurb for every section.

**`person`**: you.
- Identity: `name` (your real name, used everywhere), `handle` (the blackletter display name), `pronouns`.
- Headline copy: `tagline` (hero), `pitch` (the About headline; it must contain `sections.about.accent`), and 1–2 `bio` paragraphs.
- `photo`: your portrait.
- Facts: `location`, `school`, `gradYear`, `focus`.
- `availability`: the hero pill, the rotating sticker and the About pill. Set `open: false` to hide all three.
- Contact: `email`, `responseTime` and `resume` (your PDF).
- `strengths`: exactly 5 checklist lines.
- `socials`: `github`, `linkedin`, `youtube`, `devpost`, `itchio` or `email`.

**`stats`**: leave `null` and the proof strip counts your projects, labs and roles, and shows your GPA (or your awards when `showGpa` is `false`). Or supply exactly 4 `{ value, unit, label, href }` items.

**`education`**: one entry per school, main school first.
- `start`/`end`, plus `expected: true` for a future graduation date.
- `showGpa` and `gpa`: set `showGpa: false` to hide the GPA everywhere.
- `honors` and `coursework`.

**`projects`**: the core of the site. The hero collage and the Featured rows use the first three projects with `featured: true`, sorted by `order`. The All projects grid (and the Previous/Next links on project pages) shows featured projects first, then newest `year` first, then by `order`. Each project needs:

- Basics: `slug`, `title`, `subtitle`, `category` (must be in `site.projectCategories`), `year`, `badges`.
- Look: `icon`, `theme` (`lava` · `dusk` · `violet` · `ember`) and `frame`. Use `'window'` for software screenshots and `'plate'` for photos or renders of physical things.
- People: `role`, `team: { size, members }`, `duration`, `context`.
- `summary`: 1–2 sentences for cards.
- `cover` image.
- `tags`: the tech used. Brand names get logos.
- `links`: `{ demo, repo, video }`. Set one to `null` to hide its button.
- `metrics`: 2–4 `{ value, unit, label }` items. `value` is text, so `'2nd'` works.
- `writeup`: `problem`, `process` (`intro` + `steps`, each step optionally pointing at a `gallery` index), `outcome` and `lessons`.
- `skills`: what the project shows about you.
- `gallery`: images with captions. `wide: true` spans two columns.

**`labs`**: every lab report gets its own page. Each lab needs:

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
- What and where: `role`, `org`, `orgUrl`, `type` (`internship` · `job` · `volunteer` · `research`), `location`.
- Dates: `start`/`end`.
- `summary`.
- `logo`: a **white mark on a transparent background**.
- Up to 4 `achievements`. Lead with numbers.
- `skills`, plus an optional `quote`.

**`skills`**: 4–5 groups, shown as the slanted fan.
- Each group has `group`, `icon`, `theme` (`lava` · `dusk` · `crimson` · `violet` · `ember`) and `blurb`.
- Each item has a `name` and a `level` (`core` · `working` · `learning`).
- Each item's "uses" count is automatic: the projects whose `tags` include it plus the labs whose `skills` include it (case-insensitive). Spell skill items exactly like your tags.

**`awards`**: `kind` (`award` · `certification`), `title`, `issuer`, `date`, `detail`, `project` (a project slug adds a "See project" link) and `url` (adds a "Credential" link).

**`activities`**: leadership and clubs. Each entry has `role`, `org`, `start`/`end`, `description` and `icon`.

**`testimonials`**: optional quotes, each with `quote`, `name`, `role` and `relationship`. Only quote people who agreed to it, word for word.

### `index.html` fills itself in

The page `<title>`, the search/link-preview description and the no-JavaScript line are generated from `site.title`, `site.description`, your name, email and résumé in `content.js` whenever the site builds (see `vite.config.js`). There is nothing to edit in `index.html`.

**Optional things:** `person.photo: null` hides the avatar, and `person.resume: null` hides every Résumé button. Handles up to about 14 characters look best; longer ones are scaled down on phones so they still fit.

---

## Replacing images, PDFs and data

Every placeholder lives in `public/`. Replace a file with your own, **or** point `content.js` at a new file name (remember to change the extension: `cover.svg` → `cover.jpg`). Then set `width`/`height` to the new file's real pixel size and run `npm run check`.

| What | Where | Required shape | Tips |
|---|---|---|---|
| Portrait | `img/portrait.*` | 800 × 1000 (4:5) | Shown small and rounded. Warm or red light suits the theme. |
| Project cover | `img/projects/<slug>/cover.*` | **16:10 landscape**, e.g. 1600 × 1000 | A screenshot for `window` frames, a photo or render for `plate` frames. Crop portrait phone photos to 16:10 first — other shapes get cropped. |
| Gallery image | `img/projects/<slug>/gallery-N.*` | 16:10 (1600 × 1000), or 2400 × 1000 for `wide` | Give each one a caption. |
| Lab figure | `img/labs/<slug>/fig-N.*` | **16:9 landscape**, e.g. 1600 × 900 | Export charts at 2× from Sheets, Logger Pro or matplotlib. |
| Org logo | `img/orgs/<id>.*` | 256 × 192 | A white mark on transparent (SVG or PNG). It sits on a dark crimson panel. |
| Résumé | `files/resume.pdf` | 1 page | Or change `person.resume.href`. |
| Lab report | `files/labs/<slug>.pdf` | any | `files.report: null` hides the button. |
| Raw data | `files/labs/<slug>.csv` | any | `files.data: null` hides the button. |
| Favicon | `favicon.svg` | 40 × 40 | The yin-yang sigil. Replace it with your own mark if you like. |

Image tips:

- **JPG** suits photos, **PNG** suits screenshots, **SVG** suits diagrams and logos. iPhone **HEIC** photos don't show in Chrome or Edge — export them as JPG (Settings → Camera → Formats → Most Compatible). `npm run check` catches this.
- Keep each file under about 300 KB and about 1600 px wide. [Squoosh](https://squoosh.app) is free and easy. The check warns about files over 500 KB.
- Keep file names **lowercase** and type them exactly: GitHub Pages treats `Cover.JPG` and `cover.jpg` as different files, even though Windows doesn't. (Turn on **View → File name extensions** in Explorer to see the real name.)
- Write `alt` text that says what the image shows ("CAD render of the tracking-wheel module"), not "image of…".
- Images below the fold are lazy-loaded, and `width`/`height` reserve their space so the page never jumps.

---

## Deploying to GitHub Pages

`vite.config.js` uses `base: './'` and the site uses **hash routing** (`#/projects/titanbot`). Together these mean the build works from any sub-path, such as `https://<you>.github.io/School-Portfolio/`. Refreshing or sharing a deep link also works, with no 404 tricks needed.

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

The look is a black stage lit by the student's own fire. Atmosphere lives in colour, texture, type and edge effects, while the content stays structured like a résumé: role, dates, evidence. All tokens live in `src/styles/tokens.css`.

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
src/content.js          ← all your content
src/main.js, router.js  wiring and hash routing
src/lib/                DOM builder, icons, formatting, shared UI pieces
src/effects/            lava, particles, thorns, sigils, reveal, scheduler
src/render/             one renderer per section / page
src/styles/             tokens, base, chrome, effects and per-section CSS
public/                 images, PDFs and CSVs (copied as-is into dist/)
scripts/check-content.mjs   npm run check
```

## Credits

- [Inter](https://rsms.me/inter/), [Grenze Gotisch](https://fonts.google.com/specimen/Grenze+Gotisch) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/): SIL Open Font License.
- Icons: [Lucide](https://lucide.dev) (ISC).
- Brand glyphs: [Simple Icons](https://simpleicons.org) (CC0). The brands are trademarks of their owners.
- The placeholder art in `public/` is original and part of this template. Replace it freely.
