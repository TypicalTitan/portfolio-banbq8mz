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
    pronouns: null,                      // e.g. 'they/them'; null hides
    tagline: 'Cybersecurity & networking student focused on cloud ops.',
    pitch: 'Focused on cybersecurity, networking and cloud ops.', // About headline; must contain sections.about.accent — OWNER: rewrite in your own words
    bio: [                               // About paragraphs — 2 short ones read best
      "I'm working toward an AAS-T in Cybersecurity & Networking at Green River College. From January to June 2026 I was a QA/DevOps Associate at Playcast, where I built an Android game-streaming pipeline and wrote AWS SSM fleet automation scripts.",
      "I'm focused on cybersecurity, networking and cloud operations, and I'm considering government cyber work with agencies like the FBI or DOJ.",
    ],
    // Your photo. A 4:5 portrait works best; it is shown small and rounded in the About card.
    // photo: null hides the avatar.
    photo: { src: 'img/portrait.svg', alt: 'Placeholder portrait silhouette', width: 800, height: 1000 },
    location: 'Issaquah, WA',
    school: 'Green River College',
    gradYear: null,                      // null hides "Class of …" (hero) and "Graduating" (about)
    focus: 'Cybersecurity · Networking · Cloud ops',
    interests: ['Ethical hacking', 'PC building', 'Cloud gaming', 'Systems-first game design', 'Climbing'], // About "Interests"; [] hides
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
      year: null,
      featured: true,
      order: 1,
      badges: [],                         // any of 'Featured' | 'Award' | 'Team' | 'Solo' | 'New' | 'In progress'
      icon: 'Server',
      theme: 'lava',
      frame: 'window',
      role: null,                         // null hides
      team: null,
      duration: null,
      context: 'Hosted on Shockbyte',     // null hides
      summary: 'A dedicated Rust game server hosted on Shockbyte and extended with Oxide/uMod plugins: NTeleportation, Better Loot and Raidable Bases.',
      cover: { src: 'img/projects/rust-server/cover.svg', alt: 'Illustrated server console listing the installed Oxide plugins', width: 1600, height: 1000 },
      tags: ['Shockbyte', 'Oxide / uMod', 'NTeleportation', 'Better Loot', 'Raidable Bases', 'Server admin'],
      links: { demo: null, repo: null, video: null }, // null hides the button
      metrics: [],                        // 2–4 { value, unit, label }; [] hides
      writeup: {
        problem: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'],
        process: {
          intro: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          steps: [
            { title: 'Hosted it on Shockbyte', body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', image: null },
            { title: 'Added the Oxide/uMod framework', body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.', image: null },
            { title: 'Installed NTeleportation, Better Loot and Raidable Bases', body: 'Curabitur pretium tincidunt lacus, nulla gravida orci a odio nullam varius turpis et commodo.', image: null },
          ],
        },
        outcome: ['Integer malesuada nunc vel risus commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit egestas.'],
        lessons: [],                      // [] hides "What I learned"
      },
      skills: ['Server administration', 'Plugin configuration'],
      gallery: [],                        // [] hides the gallery
    },
    {
      slug: 'pc-builds',
      title: 'Custom PC Builds',
      subtitle: 'PC building',
      category: 'Hardware',
      year: null,
      featured: true,
      order: 2,
      badges: [],
      icon: 'Cpu',
      theme: 'ember',
      frame: 'plate',
      role: null,
      team: null,
      duration: null,
      context: null,
      summary: 'Custom PC builds.',
      cover: { src: 'img/projects/pc-builds/cover.svg', alt: 'Illustrated PC tower with a glass side panel and red lighting', width: 1600, height: 1000 },
      tags: ['PC building', 'Hardware'],
      links: { demo: null, repo: null, video: null },
      metrics: [],
      writeup: {
        problem: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'],
        process: {
          intro: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          steps: [],
        },
        outcome: ['Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'],
        lessons: [],
      },
      skills: ['Hardware assembly'],
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
      summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
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
      summary: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
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
