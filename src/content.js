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
    marquee: ['AWS', 'Linux', 'PowerShell', 'Python', 'C++', '.NET', 'SQL', 'Git', 'REST APIs',
              'WebRTC', 'UniFi', 'Windows'],
    projectCategories: ['Servers', 'Hardware'], // filter order; every project.category must be listed
    // Section headings. `accent` must be a word that appears in `title` (case-sensitive).
    sections: {
      work:       { eyebrow: 'Featured', title: "Things I've built", accent: 'built',
                    blurb: 'A modded Rust game server and custom PC builds.' },
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
      "I'm focused on cybersecurity, networking and cloud operations. I'm considering a career path in government cyberwork.",
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
    { value: '2', unit: null, label: 'Projects', href: '#work' },
    { value: '3', unit: null, label: 'Roles', href: '#experience' },
    { value: '6', unit: 'mo', label: 'QA/DevOps at Playcast', href: '#experience' },
    // 22 = total items in `skills` below (7 + 7 + 3 + 5). Hard-coded: update it whenever skills change.
    { value: '22', unit: null, label: 'Tools & skills', href: '#skills' },
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
      summary: 'A small community Rust server on Shockbyte running Oxide/uMod plugins. I made the balance and restart calls, and used Claude Code over RCON and SFTP to install plugins, build custom ones and handle rollbacks and wipes.',
      cover: { src: 'img/projects/rust-server/cover.svg', alt: 'Illustrated server console listing the installed Oxide plugins', width: 1600, height: 1000 },
      tags: ['Oxide / uMod', 'RCON', 'SFTP', 'Discord API', 'Raidable Bases', 'NTeleportation', 'Better Loot',
             'Shockbyte', 'Claude Code', 'Server admin'],
      links: { demo: null, repo: null, video: null }, // null hides the button
      metrics: [                          // 2–4 { value, unit, label }; [] hides
        { value: '84',  unit: null,  label: 'monuments after a same-seed regen (from 76)' },
        { value: '131', unit: 'FPS', label: 'server framerate with all plugins on' },
        { value: '36',  unit: null,  label: 'items restored after a death, no failures' },
        { value: '19',  unit: null,  label: 'items given 10x stack sizes' },
      ],
      writeup: {
        problem: [
          'I ran a small Rust server on Shockbyte, and the game gives admins little to work with. It keeps no record of what a player was carrying when they died, has no built-in way to carry loot through a map wipe, and some things players ask for, like cheaper explosives, can’t be changed server-side.',
          'I also wanted a repeatable way to turn player suggestions into live changes, with nothing restarting without my OK.',
        ],
        process: {
          intro: 'I made the decisions and ran the Shockbyte panel; Claude Code did the hands-on plugin and config work over RCON and SFTP at my direction.',
          steps: [
            { title: 'Set up a suggestion-to-change workflow', body: 'Players post suggestions in Discord threads and I vet them. I created a private Discord bot so Claude Code could read a thread, scope the change and post progress back, with a firm rule that nothing restarts without my OK.', image: null },
            { title: 'Shipped the feasible half of a request', body: 'For a scrap-farming suggestion, instant vending restock went live within the hour. Cheaper explosives were dropped because Rust enforces crafting costs on the client, and at my request an explanation went up in the suggestion thread. I also had a small custom plugin built that raises stack sizes 10x on 19 farming, crafting and raiding items.', image: null },
            { title: 'Diagnosed outages and a lost base', body: 'When RCON dropped mid-deploy, the Oxide logs showed the server had restarted onto a new Rust/Oxide version with every plugin loading cleanly, so it was a host update and not a plugin fault. When a tugboat base vanished, I stopped the server, we rolled back to an earlier save with backups taken of both, and traced the likely cause to boat decay.', image: null },
            { title: 'Built admin tools Rust lacks', body: 'I had Claude Code write DeathInventoryLogger, which records a player’s inventory, killer and weapon on death, plus a command to give the loadout back. Its restore command later gave a player back 36 items with no failures.', image: null },
            { title: 'Protected player loot through a wipe', body: 'Before a map wipe I asked for LootVault, a plugin that snapshots every player inventory and placed container with its owner. After the wipe, which kept blueprints and the same map seed, it put my 29 carried items back and my 103 container items into 3 boxes, and I had a one-time /restore command added for players.', image: null },
          ],
        },
        outcome: [
          'The server ran paid plugins like Raidable Bases, Kits and SkillTree alongside the custom ones, and held 131 FPS with Raidable Bases and the drone and supply-drop plugins running. At my request, Claude Code regenerated the map on the same seed to add missing monuments, going from 76 to 84, while keeping all 6 sleeping players and both horse hitches.',
          'Not everything worked. Rust’s Frontier era crashed players’ workbenches, so after working around panel and config overrides I moved the server to Medieval and then back to vanilla.',
        ],
        lessons: [                        // [] hides "What I learned"
          'Take backups on both sides before any rollback or wipe.',
          'Check the server logs before assuming your own change broke something.',
          'When a request can’t be done server-side, explain why publicly.',
        ],
      },
      skills: ['Server administration', 'Plugin configuration', 'Log-based incident diagnosis', 'Backup and restore',
               'Change management', 'AI-assisted development (Claude Code)'],
      gallery: [],                        // [] hides the gallery
    },
    {
      slug: 'pc-builds',
      title: 'Custom PC Builds',
      subtitle: 'My AM4 build: Ryzen 7 5700X3D + RTX 5070',
      category: 'Hardware',
      year: null,
      featured: true,
      order: 2,
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
          'Coding and game dev: my own projects, like a voxel FPS and a Magic: The Gathering engine, built with Claude Code in VS Code and Cursor. I work across Python, Node.js, Go, Rust, .NET and Java, use WSL (Ubuntu) for Linux work, and have Unreal Engine and Blender for 3D.',
          'Server and network admin: running my Rust server, the AWS CLI, and Tailscale and WireGuard for my network, with RustDesk for remote access.',
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
      orgUrl: null,                     // company website; null shows the name as plain text
      type: null,                       // 'internship' | 'job' | 'volunteer' | 'research' | null (hides the chip)
      location: 'Everett, WA',
      start: '2026-01', end: '2026-06',
      summary: 'QA and DevOps work on game streaming and AWS fleet automation.',
      // Logo: a WHITE mark on a transparent background (it sits on a dark crimson panel).
      logo: null,                       // null shows plain initials; add the official mark only with permission
      achievements: [                   // up to 6 shown
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
               { name: 'REST APIs', level: null } ] },
    { id: 'networking', group: 'Networking', icon: 'Network', theme: 'lava',
      blurb: 'Addressing, tunnels and network gear.',
      items: [ { name: 'Subnetting', level: null }, { name: 'VPNs', level: null }, { name: 'UniFi / Ubiquiti', level: null } ] },
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
    { kind: 'certification', status: 'planned', title: 'AWS CloudOps Engineer – Associate', issuer: 'Amazon Web Services', date: null, detail: null, project: null, url: null },
    { kind: 'certification', status: 'planned', title: 'AWS Solutions Architect – Associate', issuer: 'Amazon Web Services', date: null, detail: null, project: null, url: null },
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
