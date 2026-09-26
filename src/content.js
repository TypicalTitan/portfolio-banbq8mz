/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  src/content.js — EVERY word, number, link and image on the site lives here.
 *  Keep the keys, change the values. The layout rebuilds itself from this file.
 *
 *  RULES
 *  • Paths are RELATIVE with NO leading slash: 'img/portrait.svg' → public/img/portrait.svg
 *    (a leading "/" breaks the site on GitHub Pages sub-paths).
 *  • Dates are 'YYYY-MM' or 'YYYY-MM-DD'. `end: null` means "Present".
 *    Don't know the dates? Set BOTH `start` and `end` to null and the dates are hidden.
 *  • `slug` becomes the page URL (#/projects/<slug>, #/labs/<slug>): lowercase-with-dashes,
 *    unique, and don't change it after sharing the link.
 *  • Headline `accent` = ONE word (or word + punctuation) that must appear inside `title`;
 *    it gets the lava-gold fill.
 *  • null / '' / [] hides that thing automatically — no empty boxes, no dead buttons.
 *    An empty array hides the whole section AND its nav link.
 *  • `icon` = a lucide icon name from the list in src/lib/icons.js
 *    (Bot, Cpu, CircuitBoard, Code, Terminal, Wrench, Hammer, Server, Cloud, Network, Shield,
 *     Gauge, Target, Lightbulb, Globe, Gamepad2, GraduationCap, Users, Trophy, Medal, BadgeCheck …).
 *  • `theme` = 'lava' | 'dusk' | 'violet' | 'ember'  (card backgrounds + detail-page lava colour).
 *  • `frame` = 'window' (screenshots of software) | 'plate' (photos/renders of physical things).
 *  • Plain text only — no HTML.
 *  • Text with an apostrophe goes in "double quotes" ("Things I've built"), or use a curly ’.
 *
 *  HOW TO CHECK YOUR EDITS
 *  • Run `npm run check` after editing. It confirms every image/PDF path below exists in
 *    public/, every slug is unique, every accent word appears in its title, and more.
 *  • Images: every image object is { src, alt, width, height }. `width`/`height` are the
 *    image's real pixel size (they reserve space so the page doesn't jump while loading).
 *    `alt` describes what the image SHOWS, for screen-reader users — never "image of…".
 *  • Swapping an SVG placeholder for a photo? Change the extension in `src` too
 *    ('img/projects/rust-server/cover.svg' → 'img/projects/rust-server/cover.jpg').
 * ─────────────────────────────────────────────────────────────────────────────
 */
const content = {
  /* ── Site-wide settings & section copy ─────────────────────────────────── */
  site: {
    title: 'Stephan Varganov (TypicalTitan) — Cybersecurity & Networking Portfolio', // browser tab on the home page
    description: 'Projects and experience from Stephan Varganov, a cybersecurity, networking and cloud ops student in Issaquah, WA.',
    copyrightYear: 2026,
    updated: '2026-09',                     // footer "Updated Sep 2026"
    currently: 'Working toward an AAS-T in Cybersecurity & Networking', // footer "Currently"; null hides
    // Scrolling tools strip under the hero. Names that match a known brand get its logo
    // automatically (Python, C++, Git, Linux, WebRTC, UniFi…).
    marquee: ['AWS', 'Linux', 'PowerShell', 'Python', 'C++', 'C#', '.NET', 'TypeScript', 'SQL', 'Git', 'REST APIs',
              'WebRTC', 'UniFi', 'Windows', 'Claude Code'],
    projectCategories: ['Servers', 'Games', 'Tools', 'Hardware'], // filter order; every project.category must be listed
    // Section headings. `accent` must be a word that appears in `title` (case-sensitive).
    sections: {
      work:       { eyebrow: 'Featured', title: "Things I've built", accent: 'built',
                    blurb: 'A modded Rust game server, a Magic: The Gathering rules engine and a dashboard for imaging a lab fleet.' },
      projects:   { eyebrow: 'Archive', title: 'All projects', accent: 'projects', blurb: null },
      labs:       { eyebrow: 'Labs', title: 'Lab notebook', accent: 'notebook', blurb: null },
      experience: { eyebrow: 'Experience', title: "Where I've worked", accent: 'worked',
                    blurb: 'QA/DevOps at Playcast, plus kitchen and restaurant work.' },
      about:      { eyebrow: 'About', accent: 'cybersecurity' },           // title comes from person.pitch
      skills:     { eyebrow: 'Toolkit', title: 'What I work with', accent: 'work',
                    blurb: 'The platforms, languages and tools I use, grouped by area.' },
      education:  { eyebrow: 'Education', title: 'School & certifications', accent: 'certifications', blurb: null },
      leadership: { eyebrow: 'Beyond class', title: 'Leadership & activities', accent: 'Leadership', blurb: null },
      kindWords:  { eyebrow: 'References', title: 'Kind words', accent: 'words', blurb: null },
      contact:    { eyebrow: 'Contact', titleLead: "Let's build", titleAccent: 'something.',
                    blurb: 'Questions about my work, or an opportunity in cybersecurity, networking or cloud ops?' },
    },
  },

  /* ── Who you are ───────────────────────────────────────────────────────── */
  person: {
    name: 'Stephan Varganov',            // REAL name — nav, hero, about, footer, page titles
    handle: 'TypicalTitan',              // blackletter display name (hero, footer, drawer); up to ~14 characters looks best
    pronouns: 'he/him',                  // null hides
    tagline: 'Cybersecurity & networking student focused on cloud ops.',
    pitch: 'Focused on cybersecurity, networking and cloud ops.', // About headline; must contain sections.about.accent — OWNER: rewrite in your own words
    bio: [                               // About paragraphs — 2 short ones read best
      "I'm working toward an AAS-T in Cybersecurity & Networking at Green River College. From January to June 2026 I was a QA/DevOps Associate at Playcast, where I built an Android game-streaming pipeline and wrote AWS SSM fleet automation scripts.",
      "I'm focused on cybersecurity, networking and cloud operations. I'm considering a career path in government cyberwork. Outside school I run a modded Rust game server and build software, from a Magic: The Gathering rules engine to a dashboard for imaging a lab fleet. Claude Code writes most of the code under my direction.",
    ],
    // Your photo. A 4:5 portrait works best; it is shown small and rounded in the About card.
    // photo: null hides the avatar.
    photo: { src: 'img/portrait.svg', alt: 'Placeholder portrait silhouette', width: 800, height: 1000 },
    location: 'Issaquah, WA',
    school: 'Green River College',
    gradYear: null,                      // null hides "Class of …" (hero) and "Graduating" (about)
    focus: 'Cybersecurity · Networking · Cloud ops',
    interests: ['Ethical hacking', 'PC building', 'Music mastering', 'Cloud gaming', 'Systems-first game design', 'Climbing'], // About "Interests"; [] hides
    availability: {
      open: false,                                   // true shows the hero pill + about pill ("Available · season")
      label: null,                                   // hero pill, e.g. 'Open to summer 2027 internships'
      season: null,                                  // about pill, e.g. 'Summer 2027'
      detail: null,                                  // line under the about pill
      sticker: 'CYBERSECURITY · NETWORKING · CLOUD · ', // rotating hero disc (shown even when open is false); null hides
    },
    email: 'stephanvarganov@gmail.com',
    responseTime: null,                  // e.g. 'I reply within two days.'; null hides
    resume: null,                        // { href: 'files/resume.pdf', label: 'Résumé', fileInfo: 'PDF · 1 page' }; null hides every Résumé button
    strengths: [                                     // About checklist — exactly 5
      'Wrote AWS SSM fleet automation scripts',
      'Built an Android game-streaming pipeline',
      'Reverse-engineered OAuth endpoints',
      '3DMark benchmarking and hardware diagnostics',
      'Subnetting, VPNs and UniFi/Ubiquiti networking',
    ],
    socials: [                                       // id: 'github'|'linkedin'|'youtube'|'devpost'|'itchio'|'email'
      { id: 'github', label: 'GitHub', url: 'https://github.com/TypicalTitan', handle: '@TypicalTitan' },
    ],
  },

  /* ── Proof strip under the hero. null = auto (projects, labs, roles, GPA) ── */
  stats: [                               // exactly 4
    { value: '5', unit: null, label: 'Projects', href: '#projects' },
    { value: '3', unit: null, label: 'Roles', href: '#experience' },
    { value: '6', unit: 'mo', label: 'QA/DevOps at Playcast', href: '#experience' },
    // 26 = total items in `skills` below (7 + 10 + 4 + 5). Hard-coded: update it whenever skills change.
    { value: '26', unit: null, label: 'Tools & skills', href: '#skills' },
  ],

  /* ── Education (main school first) ─────────────────────────────────────── */
  // Unknown dates: start + end null. `status` (e.g. 'In progress') is shown when there are no dates.
  education: [
    {
      school: 'Green River College',
      location: null,
      program: 'AAS-T in Cybersecurity & Networking',
      start: null, end: null, expected: false, status: 'In progress',
      showGpa: false,
      gpa: null,
      honors: [],
      coursework: ['MATH 141 (completed)'],
    },
    {
      school: 'iGrad',
      location: null,
      program: 'High school diploma',
      start: null, end: null, expected: false, status: null,
      showGpa: false,
      gpa: null,
      honors: [],
      coursework: [],
    },
    {
      school: 'Gibson Ek High School',
      location: null,
      program: 'Mastery-based high school — no GPA',
      start: null, end: null, expected: false, status: null,
      showGpa: false,
      gpa: null,
      honors: [],
      coursework: [],
    },
  ],

  /* ── PROJECTS (core). Featured rows + hero collage = first 3 `featured` by `order`. ── */
  /*    All-projects grid: featured first, then newest `year`, then `order`.            */
  //    `year`, `role`, `team`, `duration`, `context` may be null (hidden).
  projects: [
    {
      slug: 'rust-server',
      title: 'Rust Dedicated Server',
      subtitle: 'Modded Rust game server on Shockbyte',
      category: 'Servers',                // must be in site.projectCategories
      year: 2026,
      featured: true,
      order: 1,
      badges: [],                         // any of 'Featured' | 'Award' | 'Team' | 'Solo' | 'New' | 'In progress'
      icon: 'Server',
      theme: 'lava',
      frame: 'window',
      role: 'Owner and admin',            // null hides
      team: null,
      duration: null,
      context: 'Small community server hosted on Shockbyte', // null hides
      summary: 'A small community Rust server on Shockbyte running 22 Oxide/uMod plugins. I solved problems with the smallest tool that would work: throwaway scripts for one-off jobs, single-use plugins that were loaded once and deleted, and installs in dependency order so paid and custom plugins kept working together. Risky jobs like the map regen, the wipe and the rollback all started from a backup.',
      cover: { src: 'img/projects/rust-server/cover.svg', alt: 'Illustrated server console listing the installed Oxide plugins', width: 1600, height: 1000 },
      tags: ['Oxide / uMod', 'RCON', 'SFTP', 'Python', 'C#', 'Discord API', 'Raidable Bases', 'CopyPaste',
             'Shockbyte', 'Server admin', 'Claude Code'],
      links: { demo: null, repo: null, video: null }, // null hides the button
      metrics: [                          // 2–4 { value, unit, label }; [] hides
        { value: '20+', unit: null,  label: 'single-use plugins written, run and deleted' },
        { value: '84',  unit: null,  label: 'monuments after a same-seed regen (from 76)' },
        { value: '131', unit: 'FPS', label: 'server framerate with all plugins on' },
        { value: '36',  unit: null,  label: 'items restored after a death, no failures' },
      ],
      writeup: {
        problem: [
          'I ran a small Rust server on Shockbyte, and the game gives admins little to work with. It keeps no record of what a player was carrying when they died, has no built-in way to carry loot through a map wipe, and some things players ask for, like cheaper explosives, can’t be changed server-side.',
          'The server was also a stack of paid, free and custom plugins, several of which depend on others, running on a game that can update without warning. Every fix had to work without breaking something else, and nothing could restart without my OK.',
        ],
        process: {
          intro: 'My rule was to use the smallest tool that would solve the problem and only keep what the server needed long term. I made the calls and ran the Shockbyte panel; Claude Code wrote and ran the code over RCON and SFTP.',
          steps: [
            { title: 'Scoped each request before building', body: 'Players suggest changes in Discord threads. Once I had vetted a thread, small Python scripts read it and posted status updates back as a bot, with nothing left running. Instant vending restock went live about 30 minutes after I shared the thread. Cheaper explosives were dropped because Rust enforces crafting costs on the client, and the reason was posted in the thread.', image: null },
            { title: 'Used throwaway scripts for one-off jobs', body: 'Jobs that only needed doing once got a short Python script instead of a pile of manual commands: a bulk uploader that installed the first 90 plugin and config files in dependency order, backup scripts that pulled saves, the map and player databases into dated folders before a map regen and a wipe, and pollers that waited until a restarted server had fully booted. When the basic RCON client only caught the first line of a reply, a quick script that listened for every line fixed it. Most were deleted after use; the few I kept reaching for stayed.', image: null },
            { title: 'Handled in-game tasks with single-use plugins', body: 'When I needed something done inside the game, I had a tiny C# plugin written, uploaded, loaded, run and then deleted. More than 20 were made this way. One gave a player items silently, since the console command announces every give to the whole server. Another priced a 248-block base, and another found a corpse a player thought had vanished. Asking the live game also beat trusting wikis: a kit gave no chocolate because a wiki had the item name wrong, and a lookup plugin found the right one.', image: null },
            { title: 'Managed plugin dependencies and versions', body: 'Raidable Bases needs CopyPaste at a minimum version, so CopyPaste had to be updated first. Kits, ServerPanel and Skill Tree all need ImageLibrary for their menus. When the server restarted onto a new Rust/Oxide build mid-deploy, the Oxide log showed every plugin compiling cleanly, so the outage wasn’t one of my changes. Custom plugins were compiled on the live server, so when Rust’s API had changed, the compile errors showed exactly what to fix.', image: null },
            { title: 'Kept the tools that filled real gaps', body: 'Some problems needed a plugin that stayed. DeathInventoryLogger records a player’s inventory, killer and weapon on death, and a companion command later gave a player back 36 items with no failures. LootVault snapshots every player inventory and owned container before a wipe; afterward it put my 29 carried items back and my 103 container items into 3 boxes, and players got a one-time /restore that is used up before items are given, so it can’t be run twice.', image: null },
            { title: 'Found root causes before changing course', body: 'When a tugboat base vanished, I stopped the server, the current and earlier saves were copied locally, and we rolled back; the likely cause was boat decay, not a plugin bug. When the Frontier era wouldn’t stick, the causes turned out to be a misspelling in the host panel’s dropdown and a game-mode setting that forced a different era at boot. Once it did stick, Frontier crashed players’ workbenches on the client, so I moved to Medieval and then back to vanilla instead of piling on workarounds.', image: null },
          ],
        },
        outcome: [
          'The last plugin listing showed 22 plugins loaded, and the server held 131 FPS with Raidable Bases and the drone and supply-drop plugins running. Regenerating the map on the same seed took it from 76 to 84 monuments while keeping all 6 sleeping players and both horse hitches, with a full backup and a rollback path ready.',
          'A crash during a routine upload led to a standing rule: nothing that could take the server down happens without my OK.',
        ],
        lessons: [                        // [] hides "What I learned"
          'Match the tool to the problem: a throwaway script or single-use plugin is often enough.',
          'Check what the live game says, not a wiki.',
          'Read the logs before assuming your own change broke something.',
          'Take backups on both sides before any rollback or wipe.',
        ],
      },
      skills: ['Server administration', 'Python scripting', 'C# plugin development', 'Dependency management',
               'Log-based incident diagnosis', 'Backup and restore', 'AI-assisted development (Claude Code)'],
      gallery: [],                        // [] hides the gallery
    },
    {
      slug: 'mtg-rules-engine',
      title: 'MTG Rules Engine',
      subtitle: 'A Magic: The Gathering rules engine in TypeScript',
      category: 'Games',
      year: 2026,
      featured: true,
      order: 2,
      badges: ['In progress'],
      icon: 'Code',
      theme: 'violet',
      frame: 'window',
      role: 'Lead',
      team: null,
      duration: null,
      context: 'Private repo for now',
      summary: 'An embeddable rules engine for Magic: The Gathering, built against the current Comprehensive Rules. I planned the work as 19 waves over about a month and reviewed each one; at the latest commit 22,676 of 38,626 cards are fully supported and all 7,672 tests pass.',
      cover: { src: 'img/projects/mtg-rules-engine/cover.svg', alt: 'Terminal running the rules engine test suite beside card-coverage stats', width: 1600, height: 1000 },
      tags: ['TypeScript', 'Node.js', 'Testing', 'Technical writing', 'Git', 'Claude Code', 'AI agent orchestration'],
      links: { demo: null, repo: null, video: null },
      metrics: [
        { value: '58.7', unit: '%', label: 'of 38,626 cards fully supported' },
        { value: '7,672', unit: null, label: 'tests, none failing or skipped' },
        { value: '751', unit: null, label: 'commits in about a month' },
        { value: '13×', unit: null, label: 'lower cost per card from workflow changes' },
      ],
      writeup: {
        problem: [
          'Magic: The Gathering has a rulebook hundreds of pages long and nearly 39,000 cards, and many of those cards bend the rules. I wanted an engine another program could embed that plays the real game correctly, including hidden information like each player’s hand.',
        ],
        process: {
          intro: 'I set the direction, planned each wave of work and reviewed the results; Claude Code agents wrote most of the code. The work ran as 19 waves over about a month, from August to September 2026.',
          steps: [
            { title: 'Hand-written cards plus an importer', body: '456 cards are defined by hand. An importer parses the rules text of all 38,626 cards and compiles what it understands, and at the latest commit 22,676 of them (58.7%) are fully supported.', image: null },
            { title: 'Caught cards that passed but were wrong', body: 'Some cards imported as fully supported but behaved wrong. Taking a snapshot of each card’s compiled program and comparing snapshots between runs, then checking every changed card against its printed text, found 6 cards shipping wrong in one afternoon. One wave corrected 239.', image: null },
            { title: 'Cut the cost per card 13×', body: 'Changing how the agent workflow was structured, not the model, took the cost of adding a card from about 191,000 tokens to 43,000 and then 14,300.', image: null },
            { title: 'Tested and documented it', body: 'All 7,672 tests pass with none skipped. The engine has 13 command-line game modes and keeps each player’s private information hidden; one example server checks its own network traffic for leaks. INTEGRATING.md (1,182 lines) explains how to embed it, and CONFORMANCE.md (6,763 lines) lists what is known to be wrong, by rule number.', image: null },
          ],
        },
        outcome: [
          'About 138,600 lines of TypeScript in the engine and 183,200 in tests, MIT-licensed. The repo is private for now. The card data and rulebook belong to Wizards of the Coast, so the engine downloads them instead of storing them in the repo.',
        ],
        lessons: [
          'A test suite can pass while the behavior is wrong; comparing snapshots catches what tests miss.',
          'How the workflow was structured changed the cost more than anything else.',
          'Write down what is known to be wrong, not just what works.',
        ],
      },
      skills: ['TypeScript', 'Automated testing', 'Technical writing', 'AI agent orchestration'],
      gallery: [],
    },
    {
      slug: 'fog-dashboard',
      title: 'FOG Unified Dashboard',
      subtitle: 'A web dashboard for imaging and managing a lab fleet',
      category: 'Servers',
      year: 2026,
      featured: true,
      order: 3,
      badges: [],
      icon: 'Network',
      theme: 'dusk',
      frame: 'window',
      role: 'Creator',
      team: null,
      duration: null,
      context: 'Internal tool for a lab team',
      summary: 'A LAN dashboard for a lab of PCs that pulls the host list from FOG, the network-boot imaging server, and finds each machine’s live IP by matching MAC addresses against the UniFi controller. From one page you can reserve, reimage and capture machines and manage images.',
      cover: { src: 'img/projects/fog-dashboard/cover.svg', alt: 'Fleet dashboard table of lab machines with live IPs and imaging actions', width: 1600, height: 1000 },
      tags: ['.NET', 'ASP.NET Core', 'Blazor', 'SQLite', 'UniFi / Ubiquiti', 'FOG'],
      links: { demo: null, repo: null, video: null },
      metrics: [],
      writeup: {
        problem: [
          'The lab’s PCs were reimaged with FOG, but FOG doesn’t know each machine’s current IP address. Finding one meant checking the UniFi network controller separately and matching machines by hand.',
        ],
        process: {
          intro: 'I planned the tool and directed the build for a lab team; Claude Code wrote most of the code.',
          steps: [
            { title: 'Started with a read-only proof of concept', body: 'A small Python script read from FOG and UniFi without changing anything, to prove the two could be joined before building on them.', image: null },
            { title: 'Joined FOG and UniFi by MAC address', body: 'Each FOG host is matched to its UniFi client record by MAC address, which gives its live IP.', image: null },
            { title: 'Built the dashboard', body: 'An ASP.NET Core Blazor Server app with Entity Framework Core and SQLite for reservations, and SignalR for live updates. It can reserve, reimage and capture machines and manage images.', image: null },
          ],
        },
        outcome: [
          'The lab team gets one page on the LAN for the whole fleet, instead of switching between the imaging server and the network controller.',
        ],
        lessons: [
          'Prove the integration read-only before writing anything that changes machines.',
        ],
      },
      skills: ['Network services (PXE imaging)', 'UniFi / Ubiquiti', 'C# / .NET', 'Web development'],
      gallery: [],
    },
    {
      slug: 'playcast-companion',
      title: 'Playcast Companion',
      subtitle: 'A tray app that turns off RGB lighting during cloud-gaming sessions',
      category: 'Tools',
      year: 2026,
      featured: false,
      order: 4,
      badges: [],
      icon: 'Sparkles',
      theme: 'dusk',
      frame: 'window',
      role: 'Creator',
      team: null,
      duration: null,
      context: 'Open source (MIT). Unofficial and not affiliated with Playcast.',
      summary: 'While a guest is signed in to a cloud-gaming session on a host PC, this tray app switches off the RGB lighting from six vendors and turns it back on when the session ends. There are two public versions: .NET 10 and a native C++20 port of about 0.9 MB with no external dependencies.',
      cover: { src: 'img/projects/playcast-companion/cover.svg', alt: 'Tray app session log listing six RGB lighting backends switched off and restored', width: 1600, height: 1000 },
      tags: ['C++', '.NET', 'C#', 'Windows', 'GitHub Actions'],
      links: { demo: null, repo: null, video: null },
      metrics: [
        { value: '6', unit: null, label: 'lighting systems supported' },
        { value: '0.9', unit: 'MB', label: 'native build, no dependencies' },
        { value: '2', unit: null, label: 'versions: .NET 10 and C++20' },
      ],
      writeup: {
        problem: [
          'On a PC that hosts cloud-gaming sessions, the RGB lighting keeps glowing while a guest plays remotely. Each vendor has its own app and API, and nothing turns them all off for a session and back on afterward.',
        ],
        process: {
          intro: 'I designed it and tested it on my own hardware; Claude Code wrote most of the code.',
          steps: [
            { title: 'Six lighting backends', body: 'Razer Chroma, Windows Dynamic Lighting (LampArray), SteelSeries, Logitech, Corsair iCUE and OpenRGB all go dark while a guest session is signed in, and everything is restored when it ends. Discord Rich Presence is optional.', image: null },
            { title: 'Rewrote it in native C++20', body: 'The first version is a .NET 10 WinForms tray app. The C++20 port is about 0.9 MB with no external dependencies and builds in GitHub Actions; it’s at v3.1.0.', image: null },
            { title: 'Documented it', body: 'Each repo has a README, and there are INTEGRATION.md and PORTING.md guides for anyone extending it.', image: null },
          ],
        },
        outcome: [
          'Both versions are public under the MIT license with an “Unofficial / not affiliated” notice.',
        ],
        lessons: [],
      },
      skills: ['C++', 'C# / .NET', 'Windows APIs', 'CI/CD'],
      gallery: [],
    },
    {
      slug: 'pc-builds',
      title: 'Custom PC Build',
      subtitle: 'My AM4 build: Ryzen 7 5700X3D + RTX 5070',
      category: 'Hardware',
      year: null,
      featured: false,
      order: 10,
      badges: [],
      icon: 'Cpu',
      theme: 'ember',
      frame: 'plate',
      role: 'Builder',
      team: null,
      duration: null,
      context: 'My own desktop',
      summary: 'My AM4 desktop: a Ryzen 7 5700X3D and an RTX 5070 on an MSI B450 Tomahawk Max with 64 GB of DDR4-3600. I kept the board and upgraded around it, picking parts for gaming performance per dollar. It’s where I game, code and run my servers.',
      cover: { src: 'img/projects/pc-builds/cover.svg', alt: 'Illustrated PC tower with a glass side panel and red lighting', width: 1600, height: 1000 },
      tags: ['PC building', 'AM4', 'Ryzen 7 5700X3D', 'RTX 5070', 'DDR4-3600', 'NVMe'],
      links: { demo: null, repo: null, video: null },
      metrics: [],
      writeup: {
        headings: { process: 'The parts', outcome: 'Day to day' },
        problem: [],
        process: {
          intro: 'Instead of moving to a new platform, I kept my motherboard and upgraded around it, choosing each part for what it does for the price.',
          steps: [
            { title: 'CPU: AMD Ryzen 7 5700X3D', body: 'The best gaming chip AM4 has. It dropped straight into my existing board with no new motherboard or RAM, and it’s strong value for the performance.', image: null },
            { title: 'GPU: NVIDIA GeForce RTX 5070', body: 'Picked to drive my 1440p high-refresh monitors, and for its price to performance.', image: null },
            { title: 'Motherboard: MSI B450 Tomahawk Max', body: 'Carried over. Keeping it meant drop-in AM4 upgrades instead of paying for a whole new platform.', image: null },
            { title: 'Memory: 64 GB G.Skill Trident Z Neo DDR4-3600', body: 'Two 32 GB sticks running at 3600 MT/s on the B450’s DDR4 platform.', image: null },
            { title: 'Storage: 2 TB NVMe + 4 TB SSD', body: 'A Samsung 970 EVO Plus 2 TB NVMe drive for Windows and apps, and a Lenovo SL700 4 TB SSD for my game library and projects.', image: null },
            { title: 'Setup: two 27-inch 1440p monitors', body: 'A Pixio PX277 OLED MAX and an ASUS ROG Strix XG27ACMG, with Razer peripherals (Huntsman V3 Pro keyboard, Basilisk V3 Pro mouse, Kraken V4 Pro headset, Kiyo V2 webcam) and a Shure MV7+ microphone.', image: null },
          ],
        },
        outcome: [
          'Gaming: mostly competitive games like Overwatch, League of Legends, Call of Duty and Rust, plus a big Steam library.',
          'Coding and game dev: my own projects, like a Magic: The Gathering rules engine, built with Claude Code in VS Code and Cursor. I work across Python, Node.js, Go, Rust, .NET and Java, use WSL (Ubuntu) for Linux work, and have Unreal Engine and Blender for 3D.',
          'Server and network admin: running my Rust server, the AWS CLI, and a Tailscale network across my devices.',
          'Music: I’m learning to master music in Pro Tools with Auto-Tune and Melodyne, practicing on unfinished tracks.',
        ],
        lessons: [],
      },
      skills: ['Hardware assembly', 'Part selection', 'Upgrade planning'],
      gallery: [],
    },
  ],

  /* ── LABS ([] hides the section, its nav link and the #/labs page) ─────── */
  labs: [],

  /* ── EXPERIENCE (newest first; roles with unknown dates go last) ───────── */
  experience: [
    {
      id: 'playcast',
      role: 'QA/DevOps Associate',
      org: 'Playcast Inc',
      orgUrl: 'https://playcast.io/',   // company website; null shows the name as plain text
      type: null,                       // 'internship' | 'job' | 'volunteer' | 'research' | null (hides the chip)
      location: 'Everett, WA',
      start: '2026-01', end: '2026-06',
      summary: 'QA and DevOps work on cloud-gaming host machines, game streaming and AWS fleet automation.',
      // Logo: a WHITE mark on a transparent background (it sits on a dark crimson panel).
      logo: { src: 'img/orgs/playcast.svg', alt: 'Playcast logo', width: 122, height: 100 },
      achievements: [                   // up to 6 shown
        'Tested that host machines locked into guest mode correctly, and that a shutdown mid-uninstall didn’t break any driver',
        'Built an Android game-streaming pipeline',
        'Wrote AWS SSM fleet automation scripts',
        'Reverse-engineered OAuth endpoints',
        'Explored WebRTC QA automation and Claude Code in CI',
        'Researched GameLift Streams for benchmarking',
      ],
      skills: ['AWS SSM', 'Android', 'OAuth', 'WebRTC', 'GameLift Streams', 'Claude Code'],
      quote: null,                      // { text, name, title }; null hides
    },
    {
      id: 'camp-zanika-lache',
      role: 'Kitchen Assistant',
      org: 'Camp Zanika Lache (Camp Fire USA)',
      orgUrl: null,
      type: null,
      location: null,
      start: '2025-06', end: '2025-06',
      summary: null,                    // one line about the job; null hides
      logo: null,
      achievements: [],
      skills: [],
      quote: null,
    },
    {
      id: 'raaj-gharana',
      role: 'Busser/Host',
      org: 'Raaj Gharana',
      orgUrl: null,
      type: null,
      location: null,
      start: null, end: null,           // dates unknown → hidden
      summary: null,
      logo: null,
      achievements: [],
      skills: [],
      quote: null,
    },
  ],

  /* ── SKILLS (4–5 groups; they render as the slanted fan) ──────────────── */
  // level: 'core' (use weekly) | 'working' (comfortable) | 'learning' (learning now) | null (no level shown).
  // theme: 'lava' | 'dusk' | 'crimson' | 'violet' | 'ember'.
  // The "uses" count is automatic: projects whose `tags` contain the exact item name (ignoring case).
  skills: [
    { id: 'cloud', group: 'Cloud & systems', icon: 'Cloud', theme: 'dusk',
      blurb: 'AWS, Linux and Windows, and automating fleets of them.',
      items: [ { name: 'AWS SSM', level: null }, { name: 'AWS EC2', level: null }, { name: 'GameLift Streams', level: null },
               { name: 'Graviton / ARM64', level: null }, { name: 'Linux', level: null }, { name: 'Windows admin', level: null },
               { name: 'Fleet automation', level: null } ] },
    { id: 'code', group: 'Code', icon: 'Code', theme: 'violet',
      blurb: 'Scripting, apps, databases and APIs.',
      items: [ { name: 'PowerShell', level: null }, { name: 'Python', level: null }, { name: 'C++', level: null },
               { name: '.NET', level: null }, { name: 'SQL', level: null }, { name: 'Git', level: null },
               { name: 'REST APIs', level: null }, { name: 'TypeScript', level: null }, { name: 'C#', level: null },
               { name: 'Claude Code', level: null } ] },
    { id: 'networking', group: 'Networking', icon: 'Network', theme: 'lava',
      blurb: 'Addressing, tunnels and network gear.',
      items: [ { name: 'Subnetting', level: null }, { name: 'VPNs', level: null }, { name: 'UniFi / Ubiquiti', level: null },
               { name: 'FOG', level: null } ] },
    { id: 'qa', group: 'QA & systems', icon: 'Gauge', theme: 'crimson',
      blurb: 'Testing, benchmarking and diagnosing.',
      items: [ { name: 'QA testing', level: null }, { name: 'WebRTC', level: null }, { name: '3DMark benchmarking', level: null },
               { name: 'Hardware diagnostics', level: null }, { name: 'Server admin', level: null } ] },
  ],

  /* ── AWARDS & CERTIFICATIONS ── kind: 'award' | 'certification' ─────────── */
  // status: 'earned' (default) | 'planned' (shows a "Planned" badge instead of a date).
  // `issuer` / `date` may be null. `project` = a project slug for a "See project" link. `url` adds a "Credential" link.
  awards: [
    { kind: 'certification', status: 'earned',  title: 'Food Handler Certification', issuer: null, date: null, detail: null, project: null, url: null },
    { kind: 'certification', status: 'planned', title: 'AWS CloudOps Engineer – Associate', issuer: 'Amazon Web Services', date: null, detail: 'Next, after Solutions Architect', project: null, url: null },
    { kind: 'certification', status: 'planned', title: 'AWS Solutions Architect – Associate', issuer: 'Amazon Web Services', date: null, detail: 'Studying for this one first, through a Udemy course', project: null, url: null },
    { kind: 'certification', status: 'planned', title: 'Security+', issuer: 'CompTIA', date: null, detail: null, project: null, url: null },
    { kind: 'certification', status: 'planned', title: 'CCNA', issuer: 'Cisco', date: null, detail: null, project: null, url: null },
  ],

  /* ── ACTIVITIES & LEADERSHIP ([] hides the section) ────────────────────── */
  // { role, org, start, end, description, icon }
  activities: [],

  /* ── TESTIMONIALS (optional — [] hides the section) ────────────────────── */
  // Only quote people who agreed to be quoted, and keep their words exact.
  // { quote, name, role, relationship }
  testimonials: [],
};

export { content };
export default content;
