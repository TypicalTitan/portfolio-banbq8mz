/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  src/content.js — EVERY word, number, link and image on the site lives here.
 *  Keep the keys, change the values. The layout rebuilds itself from this file.
 *
 *  RULES
 *  • Paths are RELATIVE with NO leading slash: 'img/portrait.svg' → public/img/portrait.svg
 *    (a leading "/" breaks the site on GitHub Pages sub-paths).
 *  • Dates are 'YYYY-MM' or 'YYYY-MM-DD'. `end: null` means "Present".
 *  • `slug` becomes the page URL (#/projects/<slug>, #/labs/<slug>): lowercase-with-dashes,
 *    unique, and don't change it after sharing the link.
 *  • Headline `accent` = ONE word (or word + punctuation) that must appear inside `title`;
 *    it gets the lava-gold fill.
 *  • null / '' / [] hides that thing automatically — no empty boxes, no dead buttons.
 *    An empty array hides the whole section AND its nav link.
 *  • `icon` = a lucide icon name from the list in src/lib/icons.js
 *    (Bot, Cpu, CircuitBoard, Code, Terminal, Wrench, Hammer, FlaskConical, Atom, Dna, Beaker,
 *     Microscope, Orbit, Zap, Sprout, Keyboard, Bus, Hand, PenTool, Layers, Gauge, Target,
 *     Lightbulb, Globe, Gamepad2, GraduationCap, Users, Trophy, Medal, BadgeCheck …).
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
 *    ('img/projects/titanbot/cover.svg' → 'img/projects/titanbot/cover.jpg').
 * ─────────────────────────────────────────────────────────────────────────────
 */
const content = {
  /* ── Site-wide settings & section copy ─────────────────────────────────── */
  site: {
    title: 'Stepan Varganov (TypicalTitan) — Student Engineer Portfolio', // browser tab on the home page
    description: 'Projects, lab reports and experience from Stepan Varganov, a high-school engineer in Austin, TX.',
    copyrightYear: 2026,
    updated: '2026-09',                     // footer "Updated Sep 2026"
    currently: 'Commodo qui consectetur incididunt amet pariatur', // footer "Currently"; null hides
    // Scrolling tools strip under the hero. Names that match a known brand get its logo
    // automatically (Python, C++, JavaScript, Arduino, ESP32, Fusion 360, Git, Vite, Linux, Figma, KiCad…).
    marquee: ['Python', 'C++', 'JavaScript', 'Arduino', 'ESP32', 'Fusion 360', '3D printing',
              'Soldering', 'Git', 'Vite', 'Linux', 'Figma', 'KiCad', 'Logger Pro'],
    projectCategories: ['Engineering', 'Software', 'Research', 'Design'], // filter order; every project.category must be listed
    // Section headings. `accent` must be a word that appears in `title` (case-sensitive).
    sections: {
      work:       { eyebrow: 'Featured', title: "Things I've built", accent: 'built',
                    blurb: "Exercitation sit nisl ullamco quis officia amet enim." },
      projects:   { eyebrow: 'Archive', title: 'All projects', accent: 'projects', blurb: null },
      labs:       { eyebrow: 'Science & engineering labs', title: 'Lab notebook', accent: 'notebook',
                    blurb: 'Tempor officia ipsum commodo aute rhoncus enim nulla proin eiusmod.' },
      experience: { eyebrow: 'Experience', title: "Where I've worked", accent: 'worked',
                    blurb: 'Lorem ipsum sit fugiat magna mollit aute facilisis dolor nostrud cupidatat ea ullamco.' },
      about:      { eyebrow: 'About', accent: 'data.' },           // title comes from person.pitch
      skills:     { eyebrow: 'Toolkit', title: 'What I work with', accent: 'work',
                    blurb: 'Et in do esse aute rhoncus proin. Incididunt ad non facilisis voluptate nunc egestas.' },
      education:  { eyebrow: 'Education', title: 'School & honors', accent: 'honors', blurb: null },
      leadership: { eyebrow: 'Beyond class', title: 'Leadership & activities', accent: 'Leadership', blurb: null },
      kindWords:  { eyebrow: 'References', title: 'Kind words', accent: 'words', blurb: null },
      contact:    { eyebrow: 'Contact', titleLead: "Let's build", titleAccent: 'something.',
                    blurb: 'Lorem ipsum quis veniam tincidunt mauris irure enim qui voluptate cupidatat.' },
    },
  },

  /* ── Who you are ───────────────────────────────────────────────────────── */
  person: {
    name: 'Stepan Varganov',             // REAL name — nav, hero, about, footer, page titles
    handle: 'TypicalTitan',              // blackletter display name (hero, footer, drawer); up to ~14 characters looks best
    pronouns: null,                      // e.g. 'they/them'; null hides
    tagline: 'Aliqua exercitation sit nostrud enim fugiat dolore sint et proident nulla.',
    pitch: 'I like problems you can hold in your hands — and prove with data.', // About headline; must contain sections.about.accent
    bio: [                               // About paragraphs — 2 short ones read best
      "Non culpa occaecat aliquip esse sed labore laboris sint rhoncus mauris ac. Dolor facilisis nostrud in commodo mattis tempor do ad tempor ex aute.",
      "Voluptate exercitation aute malesuada aute ullamco aliquip rhoncus voluptate officia velit egestas cillum consequat commodo ut integer.",
    ],
    // Your photo. A 4:5 portrait works best; it is shown small and rounded in the About card.
    // photo: null hides the avatar.
    photo: { src: 'img/portrait.svg', alt: 'Stepan Varganov in the school robotics lab, lit by red light', width: 800, height: 1000 },
    location: 'Austin, TX',
    school: 'Northgate STEM Academy',
    gradYear: 2027,
    focus: 'Robotics · Embedded systems',
    availability: {
      open: true,                                    // false hides the hero pill, sticker and about pill
      label: 'Open to summer 2027 internships',      // hero pill
      season: 'Summer 2027',                         // about pill "Available · Summer 2027"
      detail: 'Lorem ipsum sagittis enim consectetur sed ac aute mauris sunt',
      sticker: 'OPEN TO INTERNSHIPS · CLASS OF 2027 · ', // rotating disc text, ~36 chars incl. trailing separator
    },
    email: 'stepan.varganov.dev@example.com',
    responseTime: 'Sed sit eiusmod fames tincidunt.',
    resume: { href: 'files/resume.pdf', label: 'Résumé', fileInfo: 'PDF · 1 page' }, // drop your PDF in public/files/; null hides every Résumé button
    strengths: [                                     // About checklist — exactly 5
      'Cillum ac ex egestas aliqua cillum lorem id curabitur',
      'Sagittis ea proin proident mauris labore',
      'Sint lacus commodo mattis integer occaecat exercitation',
      'Qui ea eiusmod vitae dolore egestas labore enim',
      'Lorem lacus veniam vitae anim pretium voluptate',
    ],
    socials: [                                       // id: 'github'|'linkedin'|'youtube'|'devpost'|'itchio'|'email'
      { id: 'github',   label: 'GitHub',   url: 'https://github.com/TypicalTitan',           handle: '@TypicalTitan' },
      { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-handle',   handle: 'in/your-handle' },
    ],
  },

  /* ── Proof strip under the hero. null = auto (projects, labs, roles, GPA) ── */
  stats: null, // or [{ value: '6', unit: null, label: 'Projects', href: '#projects' }, …] (exactly 4)

  /* ── Education (main school first) ─────────────────────────────────────── */
  education: [
    {
      school: 'Northgate STEM Academy',
      location: 'Austin, TX',
      program: 'Nunc dolore dolor voluptate aliqua vitae sunt fames minim',
      start: '2023-08', end: '2027-05', expected: true,          // shows "(expected)"
      showGpa: true,                                             // false hides the GPA everywhere (incl. the proof strip)
      gpa: { unweighted: '3.92', weighted: '4.48', scale: '4.0' }, // null hides
      honors: ['AP Scholar with Distinction (2026)', 'National Honor Society', "Principal's List — 6 semesters"],
      coursework: ['AP Physics C: Mechanics', 'AP Physics 1', 'AP Chemistry', 'AP Calculus BC',
                   'AP Computer Science A', 'PLTW Digital Electronics'],
    },
    // A second school (dual credit, summer program…) goes here. Uncomment and edit to show it:
    // { school: 'Austin Community College', location: 'Austin, TX (dual credit)', program: 'Dual-credit coursework',
    //   start: '2025-08', end: '2026-05', expected: false, showGpa: false, gpa: null, honors: [],
    //   coursework: ['COSC 1336 Programming Fundamentals I', 'ENGR 1201 Intro to Engineering'] },
  ],

  /* ── PROJECTS (core). Featured rows + hero collage = first 3 `featured` by `order`. ── */
  /*    All-projects grid: featured first, then newest `year`, then `order`.            */
  projects: [
    {
      slug: 'titanbot',
      title: 'TitanBot',
      subtitle: 'Mollit nunc veniam et',
      category: 'Engineering',            // must be in site.projectCategories
      year: 2026,
      featured: true,
      order: 1,
      badges: ['Award', 'Team'],          // any of 'Featured' | 'Award' | 'Team' | 'Solo' | 'New' | 'In progress'
      icon: 'Bot',
      theme: 'lava',
      frame: 'plate',
      role: 'Lead programmer & drive-team captain',
      team: { size: 5, members: ['Stepan Varganov', 'Priya Natarajan', 'Sam Kowalski', 'Deshawn Carter', 'Mei Lin'] },
      duration: 'Aug 2025 – Mar 2026',
      context: 'Northgate Robotics (VEX 4410T)', // null hides
      summary: 'Elit curabitur adipiscing proin officia proin eiusmod irure. Culpa deserunt laboris sit ullamco veniam esse.',
      cover: { src: 'img/projects/titanbot/cover.svg', alt: 'Red-and-black VEX robot on the competition field', width: 1600, height: 1000 },
      tags: ['C++', 'PROS', 'PID control', 'Odometry', 'Fusion 360'],
      links: { demo: null, repo: 'https://github.com/TypicalTitan/titanbot', video: null }, // null hides the button
      metrics: [                          // 2–4; value is text so '2nd' works; unit may be null
        { value: '2nd', unit: null, label: 'laboris amet commodo' },
        { value: '38',  unit: '%',  label: 'labore tempor sed labore' },
        { value: '94',  unit: '%',  label: 'aliquip malesuada sint nisl' },
      ],
      writeup: {
        problem: ['Pariatur mollit facilisis do dolore cillum culpa deserunt nunc laborum commodo aute pretium duis ut id exercitation eiusmod curabitur non.'],
        process: {
          intro: 'Dolore pariatur adipiscing deserunt et labore quis anim nunc irure vitae.',
          steps: [
            { title: 'Added tracking wheels', body: 'Lorem ipsum commodo consectetur reprehenderit curabitur nunc reprehenderit lorem incididunt.', image: 0 }, // gallery index or null
            { title: 'Wrote an odometry + PID library', body: 'Proin lorem sed laborum ad sint pretium et dolore ullamco nisi dolore facilisis ipsum.', image: 1 },
            { title: 'Tested 50 runs, logged every one', body: 'Cillum quis voluptate irure duis ullamco officia sint cillum tincidunt duis pariatur ut.', image: null },
          ],
        },
        outcome: ['Aliquip pariatur non ex esse occaecat sed mauris lorem enim. Non nisi aute consectetur irure dolor nunc cillum curabitur.'],
        lessons: ['Lorem ipsum nostrud laborum integer adipiscing ipsum officia.', 'Labore sit deserunt quis.'], // [] hides "04 What I learned"
      },
      skills: ['Control systems', 'CAD', 'Team leadership', 'Debugging under pressure'],
      gallery: [                          // `wide: true` spans two columns on large screens
        { src: 'img/projects/titanbot/gallery-1.svg', alt: 'CAD render of the tracking-wheel module', caption: 'Egestas mollit proident est nostrud sint mattis ac elit culpa.', width: 1600, height: 1000, wide: false },
        { src: 'img/projects/titanbot/gallery-2.svg', alt: 'Graph of position error across 50 autonomous runs', caption: 'Massa consequat in consectetur ex commodo.', width: 1600, height: 1000, wide: false },
        { src: 'img/projects/titanbot/gallery-3.svg', alt: 'The team with the robot at the state championship', caption: 'Egestas id fames sint voluptate.', width: 2400, height: 1000, wide: true },
      ],
    },
    {
      slug: 'studyforge',
      title: 'StudyForge',
      subtitle: 'Aute laboris quis excepteur exercitation',
      category: 'Software',
      year: 2025,
      featured: true,
      order: 2,
      badges: ['Solo'],
      icon: 'Code',
      theme: 'dusk',
      frame: 'window',
      role: 'Solo developer & designer',
      team: { size: 1, members: ['Stepan Varganov'] },
      duration: 'Jun 2025 – Sep 2025',
      context: 'Independent project · piloted in AP Physics 1',
      summary: 'Excepteur tincidunt tempor excepteur proin mauris nostrud. Massa egestas cupidatat nisl sunt ea adipiscing.',
      cover: { src: 'img/projects/studyforge/cover.svg', alt: 'StudyForge review screen showing a physics flashcard and four grading buttons', width: 1600, height: 1000 },
      tags: ['JavaScript', 'Vite', 'Firebase', 'IndexedDB', 'Figma'],
      links: { demo: 'https://typicaltitan.github.io/studyforge/', repo: 'https://github.com/TypicalTitan/studyforge', video: null },
      metrics: [
        { value: '140', unit: null, label: 'amet est curabitur consectetur' },
        { value: '12k', unit: null, label: 'culpa vitae magna turpis' },
        { value: '11',  unit: '%',  label: 'lorem ipsum pariatur cupidatat deserunt' },
      ],
      writeup: {
        problem: ['Lorem ipsum et sit labore tincidunt magna duis proident adipiscing aliqua fames qui consequat nisl. Mollit ipsum nunc fugiat eiusmod id mollit egestas cillum sint est ut integer cillum.'],
        process: {
          intro: 'Lorem ipsum egestas massa nisi facilisis non lorem ac consequat porttitor turpis id sagittis porttitor turpis.',
          steps: [
            { title: 'Interviewed 12 classmates', body: 'Amet qui facilisis sit malesuada eiusmod aute tempor nunc laboris nulla est laboris adipiscing veniam.', image: null },
            { title: 'Implemented the SM-2 scheduler', body: 'Lorem ipsum ad vitae curabitur dolore sit deserunt fugiat incididunt amet rhoncus sed sit ipsum.', image: 0 },
            { title: 'Went offline-first', body: 'Eiusmod exercitation magna eiusmod reprehenderit adipiscing labore pretium turpis integer mollit.', image: 1 },
          ],
        },
        outcome: ['In officia duis nisl aliqua egestas non officia do lacus ea non est sed. Non est laborum proident non irure facilisis sint aute adipiscing sint malesuada esse enim.'],
        lessons: ['Cupidatat ullamco laboris nostrud mollit ex officia quis occaecat vitae commodo.', 'Duis integer voluptate massa et do dolore nisi officia rhoncus.', 'Lorem ipsum sed ipsum reprehenderit et fames consectetur.'],
      },
      skills: ['User research', 'Front-end development', 'Algorithm design', 'UI design'],
      gallery: [
        { src: 'img/projects/studyforge/gallery-1.svg', alt: 'Statistics dashboard with a retention chart and daily review counts', caption: 'Lorem ipsum sint et irure proin lorem facilisis irure ad magna porttitor.', width: 1600, height: 1000, wide: false },
        { src: 'img/projects/studyforge/gallery-2.svg', alt: 'StudyForge running on a phone with an offline badge showing', caption: 'Rhoncus commodo mauris velit aliquip minim ipsum aliquip lorem.', width: 1600, height: 1000, wide: false },
      ],
    },
    {
      slug: 'rootsense',
      title: 'RootSense',
      subtitle: 'Cupidatat velit integer turpis duis',
      category: 'Research',
      year: 2025,
      featured: true,
      order: 3,
      badges: ['Team'],
      icon: 'Sprout',
      theme: 'ember',
      frame: 'plate',
      role: 'Hardware & firmware lead',
      team: { size: 3, members: ['Stepan Varganov', 'Deshawn Carter', 'Priya Natarajan'] },
      duration: 'Feb 2025 – Aug 2025',
      context: 'AP Environmental Science research project',
      summary: 'In mollit ac quis qui amet ex labore nunc exercitation sint aliqua integer proin nisl facilisis.',
      cover: { src: 'img/projects/rootsense/cover.svg', alt: 'Solar-powered sensor stake planted in garden soil with its probe in the root zone', width: 1600, height: 1000 },
      tags: ['Arduino / ESP32', 'C++', 'Python', 'KiCad', 'Raspberry Pi'],
      links: { demo: null, repo: 'https://github.com/TypicalTitan/rootsense', video: null },
      metrics: [
        { value: '31',  unit: '%',    label: 'fames fugiat malesuada incididunt' },
        { value: '8',   unit: null,   label: 'commodo sit ad in ex mattis' },
        { value: '184', unit: 'days', label: 'sed dolore do porttitor' },
      ],
      writeup: {
        problem: ['Lorem ipsum proin officia labore ipsum egestas voluptate enim curabitur. Cillum laborum adipiscing ut proident laboris nostrud rhoncus labore.'],
        process: {
          intro: 'Est tempor nulla quis ad reprehenderit massa enim et velit nunc consequat amet pretium.',
          steps: [
            { title: 'Designed the sensor stake', body: 'Curabitur eiusmod duis anim nostrud est pretium culpa magna integer fames commodo lacus nostrud.', image: null },
            { title: 'Mapped the garden', body: 'Elit eiusmod exercitation consectetur amet commodo laborum ad commodo ex qui egestas.', image: 0 },
            { title: 'Watered by data, not by timer', body: 'Egestas turpis aliquip do tempor sed egestas nostrud officia turpis veniam anim ut nostrud esse non deserunt malesuada egestas.', image: 1 },
          ],
        },
        outcome: ['Lorem ipsum massa commodo nisi massa excepteur exercitation do non deserunt. Curabitur in esse laborum exercitation adipiscing nostrud curabitur id mattis sunt.'],
        lessons: ['Quis ea duis mauris sint irure sagittis nisl nulla malesuada irure.', 'Cillum egestas ut nisl fames exercitation officia irure.', 'Lorem ipsum proident eiusmod cupidatat aute occaecat.'],
      },
      skills: ['Embedded systems', 'PCB design', 'Data analysis', 'Low-power design'],
      gallery: [
        { src: 'img/projects/rootsense/gallery-1.svg', alt: 'Map of the school garden with eight sensor locations and a moisture heatmap', caption: 'Sagittis amet dolor laborum est sit proin do ac tempor.', width: 1600, height: 1000, wide: false },
        { src: 'img/projects/rootsense/gallery-2.svg', alt: 'Line chart comparing soil moisture in sensor-guided and timer-watered beds over two weeks', caption: 'Lorem ipsum exercitation reprehenderit duis velit ex excepteur mauris labore.', width: 1600, height: 1000, wide: false },
      ],
    },
    {
      slug: 'northbus',
      title: 'NorthBus',
      subtitle: 'Incididunt aliquip et nostrud lacus',
      category: 'Software',
      year: 2025,
      featured: false,
      order: 4,
      badges: ['Award', 'Team'],
      icon: 'Bus',
      theme: 'violet',
      frame: 'window',
      role: 'Hardware & back-end developer',
      team: { size: 4, members: ['Stepan Varganov', 'Mei Lin', 'Jordan Reyes', 'Sam Kowalski'] },
      duration: 'Oct 2025 · 24-hour hackathon',
      context: 'Hack Austin Youth 2025',
      summary: 'Malesuada curabitur cupidatat rhoncus laborum ea vitae eiusmod. Aliqua id porttitor mollit cupidatat quis curabitur.',
      cover: { src: 'img/projects/northbus/cover.svg', alt: 'NorthBus map showing a bus route, live bus positions and arrival times', width: 1600, height: 1000 },
      tags: ['JavaScript', 'Python', 'Firebase', 'Arduino / ESP32', 'Leaflet'],
      links: { demo: 'https://devpost.com/software/northbus', repo: 'https://github.com/TypicalTitan/northbus', video: null },
      metrics: [
        { value: '1st', unit: null, label: 'sit aliquip cillum turpis' },
        { value: '45',  unit: 's',  label: 'reprehenderit esse rhoncus' },
        { value: '24',  unit: 'h',  label: 'mollit do voluptate' },
      ],
      writeup: {
        problem: ['Lorem ipsum irure dolore anim nostrud labore nunc eiusmod deserunt sint non massa aute vitae non dolore qui malesuada.'],
        process: {
          intro: 'Adipiscing pariatur turpis cillum sint excepteur do laboris. Malesuada sagittis amet duis pariatur integer commodo.',
          steps: [
            { title: 'Built a GPS tracker box', body: 'Mattis mauris eiusmod sint fugiat et ex aute nisl sunt laboris esse ex mollit laboris.', image: null },
            { title: 'Predicted arrival times', body: 'Nulla minim nisl ullamco incididunt aute mollit esse consectetur aute veniam non ex nunc officia.', image: null },
            { title: 'Shipped a live map', body: 'Nisi incididunt do vitae et mollit nostrud turpis qui consectetur reprehenderit nostrud.', image: 0 },
          ],
        },
        outcome: ['Proin officia sit integer irure integer esse vitae egestas reprehenderit nunc. Nostrud sit rhoncus mollit porttitor sint ex pariatur quis sagittis aliquip.'],
        lessons: ['Turpis massa anim adipiscing eiusmod mollit eiusmod proident occaecat.', 'Lorem ipsum sed sint nisl porttitor ac amet labore ullamco.'],
      },
      skills: ['Rapid prototyping', 'Real-time data', 'Teamwork', 'Pitching'],
      gallery: [
        { src: 'img/projects/northbus/gallery-1.svg', alt: 'NorthBus arrival screen on a phone showing the next bus in 4 minutes', caption: 'Sunt egestas et rhoncus magna cupidatat malesuada ipsum sit tincidunt.', width: 1600, height: 1000, wide: false },
      ],
    },
    {
      slug: 'crimson-60',
      title: 'Crimson 60',
      subtitle: 'Lacus exercitation id excepteur',
      category: 'Design',
      year: 2024,
      featured: false,
      order: 5,
      badges: ['Solo'],
      icon: 'Keyboard',
      theme: 'lava',
      frame: 'plate',
      role: 'Designer & builder',
      team: { size: 1, members: ['Stepan Varganov'] },
      duration: 'Jun 2024 – Aug 2024',
      context: 'Personal project',
      summary: 'Lorem ipsum magna laboris enim velit culpa proin fugiat elit cupidatat officia ac veniam.',
      cover: { src: 'img/projects/crimson-60/cover.svg', alt: 'Black and crimson 60% mechanical keyboard glowing on a dark desk', width: 1600, height: 1000 },
      tags: ['Fusion 360', '3D printing', 'Soldering', 'QMK', 'C'],
      links: { demo: null, repo: 'https://github.com/TypicalTitan/crimson-60', video: null },
      metrics: [
        { value: '61', unit: null, label: 'veniam id occaecat esse sunt' },
        { value: '4',  unit: null, label: 'irure nisl curabitur' },
        { value: '55', unit: '%',  label: 'lacus pretium facilisis laboris' },
      ],
      writeup: {
        problem: ['Lorem ipsum laboris culpa sunt consequat mauris. Aliquip curabitur adipiscing laborum porttitor rhoncus incididunt.'],
        process: {
          intro: 'Sit et curabitur sed anim ullamco commodo turpis eiusmod labore elit turpis rhoncus velit minim.',
          steps: [
            { title: 'Designed a printable case', body: 'Magna sint nostrud dolore sunt minim nisl deserunt nunc tincidunt dolore fames anim ac rhoncus veniam culpa enim dolor.', image: null },
            { title: 'Hand-wired the matrix', body: 'Lorem ipsum mauris lacus duis lorem tincidunt ex elit nisl culpa fames eiusmod.', image: 0 },
            { title: 'Wrote custom firmware', body: 'Lorem ipsum aliqua cillum aliqua qui ad integer laboris enim curabitur.', image: null },
          ],
        },
        outcome: ['Lorem ipsum integer id lacus fugiat elit minim exercitation fames. Minim non consequat aliqua non consequat velit esse rhoncus.'],
        lessons: ['Culpa lorem mattis ad officia malesuada proident.', 'Veniam lacus et labore et voluptate minim in id lacus sed magna.'],
      },
      skills: ['Product design', 'Soldering', 'Firmware', 'Iterative prototyping'],
      gallery: [
        { src: 'img/projects/crimson-60/gallery-1.svg', alt: 'Underside of the hand-wired keyboard showing diodes and row and column wires', caption: 'Nunc elit aliqua porttitor officia enim nostrud non ex nisi vitae.', width: 1600, height: 1000, wide: false },
      ],
    },
    {
      slug: 'grip-assist',
      title: 'GripAssist',
      subtitle: 'Porttitor qui mattis commodo aliqua',
      category: 'Engineering',
      year: 2024,
      featured: false,
      order: 6,
      badges: ['Team', 'New'],
      icon: 'Hand',
      theme: 'ember',
      frame: 'plate',
      role: 'CAD lead & user-testing coordinator',
      team: { size: 3, members: ['Stepan Varganov', 'Mei Lin', 'Jordan Reyes'] },
      duration: 'Jan 2024 – May 2024',
      context: 'PLTW Principles of Engineering',
      summary: 'Integer adipiscing sunt magna mollit officia ad porttitor sit mollit excepteur elit sit consequat.',
      cover: { src: 'img/projects/grip-assist/cover.svg', alt: 'Spoon fitted with a chunky ergonomic grip that has finger grooves', width: 1600, height: 1000 },
      tags: ['Fusion 360', '3D printing', 'TPU', 'User testing'],
      links: { demo: null, repo: null, video: null }, // no links → no buttons (school project)
      metrics: [
        { value: '40', unit: '%',  label: 'pariatur nostrud labore' },
        { value: '5',  unit: null, label: 'labore culpa cupidatat' },
        { value: '3',  unit: null, label: 'irure mauris mattis' },
      ],
      writeup: {
        problem: ['Lorem ipsum enim ea elit non consequat nunc mollit esse. Culpa voluptate turpis tempor facilisis sed duis nostrud consectetur reprehenderit.'],
        process: {
          intro: 'Aliquip eiusmod elit proin nisl sint aliqua sit ea sagittis ut dolor enim anim id.',
          steps: [
            { title: 'Measured real hands', body: 'Lorem ipsum facilisis mattis egestas minim eiusmod fugiat incididunt adipiscing ipsum fames.', image: null },
            { title: 'Iterated five designs', body: 'Deserunt do occaecat est duis et laborum facilisis reprehenderit aute ullamco aliqua non sint fames.', image: 0 },
            { title: 'Tested grip force', body: 'Nisl culpa nunc sagittis egestas ac consequat proident labore duis amet.', image: null },
          ],
        },
        outcome: ['Lorem ipsum dolor occaecat laborum ullamco consectetur mollit velit commodo. Facilisis rhoncus eiusmod id officia laboris mollit qui labore.'],
        lessons: ['Do aliquip sint nunc eiusmod aliqua ea nulla magna ipsum labore.', 'In elit esse ex sunt amet minim.'],
      },
      skills: ['User-centred design', 'CAD', 'Testing with real users', 'Technical documentation'],
      gallery: [
        { src: 'img/projects/grip-assist/gallery-1.svg', alt: 'Five versions of the grip lined up from first to final', caption: 'Et rhoncus laboris consequat cupidatat duis massa dolore veniam nunc.', width: 1600, height: 1000, wide: false },
      ],
    },
  ],

  /* ── LABS (core) ───────────────────────────────────────────────────────── */
  labs: [
    {
      slug: 'pendulum-g',
      title: 'Measuring g with a simple pendulum',
      subject: 'Physics',               // labs-index filter
      course: 'AP Physics 1',
      labNumber: 4,                     // "LAB 04" in dusk strips; null hides
      date: '2026-02-12',
      featured: true,                   // the ONE lab shown large on the home page (first true wins; none → newest)
      instructor: 'Ms. Alvarez',        // null hides
      partners: ['Priya Natarajan', 'Sam Kowalski'],
      duration: '2 class periods',
      icon: 'Orbit',
      cover: { src: 'img/labs/pendulum-g/fig-1.svg', alt: 'Graph of period squared versus length with a linear fit', width: 1600, height: 900 },
      objective: 'Veniam et voluptate tempor irure deserunt ac curabitur adipiscing consectetur sed turpis nisl exercitation.',
      hypothesis: 'Lorem ipsum mattis laborum tempor excepteur anim mattis velit aliquip culpa elit adipiscing.',
      verdict: 'supported',             // 'supported' | 'partial' | 'refuted'
      materials: ['Ring stand & clamp', '50 g brass bob', 'Meter stick', 'Photogate + Logger Pro', 'String'],
      method: {
        summary: 'Fames consectetur officia velit dolore proident amet massa pariatur aute adipiscing.',
        steps: [
          'Lorem ipsum sint officia nisl excepteur ipsum cupidatat vitae sint esse proident.',
          'Et nisl tempor nostrud lorem incididunt nostrud cupidatat irure integer minim turpis ullamco.',
          'Nisi nostrud labore fugiat turpis culpa vitae velit ullamco porttitor.',
          'Nisl amet ad officia laborum nulla mollit culpa sed magna.',
        ],
      },
      results: {
        summary: 'Non et rhoncus anim duis excepteur. Laboris exercitation occaecat deserunt fugiat.',
        keyValues: [                    // first = headline result; 1–3 items
          { value: '9.74',  unit: 'm/s²', uncertainty: '0.05', label: 'Measured g', note: 'Excepteur enim veniam mattis porttitor' },
          { value: '0.7',   unit: '%',    uncertainty: null,   label: 'Error vs accepted', note: null },
          { value: '0.999', unit: null,   uncertainty: null,   label: 'R² of linear fit',  note: null },
        ],
        table: {
          caption: 'Consequat lorem laborum veniam enim id quis nisi porttitor ut irure',
          columns: [
            { label: 'Length L',      unit: 'm',  numeric: true },
            { label: 'Avg period T',  unit: 's',  numeric: true },
            { label: 'T²',            unit: 's²', numeric: true },
          ],
          rows: [
            ['0.20', '0.901', '0.812'],
            ['0.40', '1.272', '1.618'],
            ['0.60', '1.561', '2.437'],
            ['0.80', '1.799', '3.236'],
            ['1.00', '2.014', '4.056'],
          ],
        },
      },
      figures: [
        { src: 'img/labs/pendulum-g/fig-1.svg', alt: 'Scatter plot of T squared vs L with best-fit line', caption: 'Aliqua mauris voluptate lacus sagittis.', width: 1600, height: 900 },
        { src: 'img/labs/pendulum-g/fig-2.svg', alt: 'Diagram of the pendulum and photogate setup', caption: 'Est facilisis nunc.', width: 1600, height: 900 },
      ],
      conclusion: ['Malesuada ac cillum quis egestas dolor curabitur occaecat dolor ea dolor duis eiusmod turpis laborum.'],
      errors: ['Egestas aute nulla velit nostrud eiusmod', 'Laboris quis non exercitation consequat'],
      improvements: ['Anim deserunt vitae mauris', 'Proin massa adipiscing massa deserunt veniam'],
      skills: ['Linearizing data', 'Error analysis', 'Logger Pro', 'Technical writing'],
      files: { report: 'files/labs/pendulum-g.pdf', data: 'files/labs/pendulum-g.csv' }, // null hides each button
    },
    {
      slug: 'battery-resistance',
      title: 'Internal resistance of a 9 V battery',
      subject: 'Physics',
      course: 'AP Physics C: E&M',
      labNumber: 6,
      date: '2026-04-02',
      featured: false,
      instructor: 'Ms. Alvarez',
      partners: ['Sam Kowalski'],
      duration: '1 class period',
      icon: 'Zap',
      cover: { src: 'img/labs/battery-resistance/fig-1.svg', alt: 'Graph of terminal voltage falling linearly as current rises, with a best-fit line', width: 1600, height: 900 },
      objective: 'Lorem ipsum lacus nisl id qui anim id non enim excepteur consectetur laborum tincidunt laborum magna tempor aliquip exercitation ipsum.',
      hypothesis: 'Tincidunt exercitation occaecat exercitation rhoncus officia pretium mattis excepteur officia est dolor.',
      verdict: 'partial',
      materials: ['9 V alkaline battery', 'Decade resistor box', '10 Ω 5 W power resistor', '2 digital multimeters', 'Push switch & leads'],
      method: {
        summary: 'Facilisis dolor mollit adipiscing irure ac integer non ut quis amet sed turpis consequat aliquip magna.',
        steps: [
          'Proident mollit exercitation vitae proin cillum ac.',
          'Nostrud consectetur ullamco nunc porttitor anim ex elit aute malesuada in deserunt pretium ipsum.',
          'Lorem ipsum aliquip elit tempor minim anim massa irure incididunt id fugiat elit integer ipsum occaecat in.',
          'Et esse rhoncus aliquip mattis curabitur veniam ut massa.',
        ],
      },
      results: {
        summary: 'Lorem ipsum aliqua ipsum aute malesuada tempor aliquip excepteur malesuada. Dolore exercitation nostrud ea pariatur amet curabitur sit nunc.',
        keyValues: [
          { value: '0.42',  unit: 'Ω', uncertainty: '0.03', label: 'Internal resistance', note: 'Et pretium occaecat excepteur proin' },
          { value: '9.46',  unit: 'V', uncertainty: '0.01', label: 'EMF (y-intercept)',   note: null },
          { value: '0.999', unit: null, uncertainty: null,  label: 'R² of linear fit',    note: null },
        ],
        table: {
          caption: 'Mauris ad eiusmod dolor nulla eiusmod dolore quis aute nunc officia occaecat sunt aliquip',
          columns: [
            { label: 'Load R',     unit: 'Ω', numeric: true },
            { label: 'Current I',  unit: 'A', numeric: true },
            { label: 'Terminal V', unit: 'V', numeric: true },
          ],
          rows: [
            ['94.2', '0.100', '9.416'],
            ['37.4', '0.250', '9.357'],
            ['23.2', '0.400', '9.289'],
            ['16.8', '0.550', '9.232'],
            ['13.1', '0.700', '9.163'],
            ['10.7', '0.850', '9.106'],
            ['9.0',  '1.000', '8.990'],
          ],
        },
      },
      figures: [
        { src: 'img/labs/battery-resistance/fig-1.svg', alt: 'Scatter plot of terminal voltage versus current with a linear fit and one excluded point', caption: 'Lorem ipsum integer dolore qui nisl. Lorem massa occaecat sed irure pretium.', width: 1600, height: 900 },
      ],
      conclusion: [
        'Proident nisi minim pariatur lorem cillum amet minim velit in nulla nunc ad lacus ex mollit ullamco.',
        'Magna qui officia tempor incididunt veniam do laborum incididunt cillum anim consequat officia aliquip sagittis tempor.',
      ],
      errors: ['Integer enim fames in anim lorem occaecat adipiscing ipsum id', 'Proident est mattis et veniam integer sint laboris', 'Amet ac non pretium mollit consequat in fugiat occaecat malesuada'],
      improvements: ['Malesuada sit qui id vitae adipiscing massa minim', 'Ad sunt porttitor magna tincidunt do consectetur mauris'],
      skills: ['Linearizing data', 'Circuit building', 'Error analysis', 'Logger Pro'],
      files: { report: 'files/labs/battery-resistance.pdf', data: 'files/labs/battery-resistance.csv' },
    },
    {
      slug: 'acid-titration',
      title: 'Titrating an unknown monoprotic acid',
      subject: 'Chemistry',
      course: 'AP Chemistry',
      labNumber: 7,
      date: '2025-11-06',
      featured: false,
      instructor: 'Mr. Haddad',
      partners: ['Mei Lin'],
      duration: '2 class periods',
      icon: 'Beaker',
      cover: { src: 'img/labs/acid-titration/fig-1.svg', alt: 'Titration curve of pH against volume of NaOH added, with the equivalence point marked', width: 1600, height: 900 },
      objective: 'Lorem ipsum irure eiusmod sint ea mattis minim commodo nunc cupidatat aliquip sed et occaecat ea enim aliqua.',
      hypothesis: 'Ex veniam ullamco nisi qui tincidunt nisi proin ipsum ac ut pariatur non sunt proin porttitor curabitur.',
      verdict: 'supported',
      materials: ['50 mL burette', '0.100 M NaOH (standardized)', '25.00 mL volumetric pipette', 'pH probe + LabQuest', 'Phenolphthalein', 'Magnetic stirrer'],
      method: {
        summary: 'Amet duis consequat incididunt veniam id curabitur massa aliquip porttitor sed fames.',
        steps: [
          'Magna consequat qui reprehenderit ullamco rhoncus consectetur proin sed magna.',
          'Minim duis labore exercitation tincidunt sit fugiat sed rhoncus nostrud cupidatat dolore.',
          'Esse deserunt fugiat reprehenderit nostrud do mattis eiusmod sit turpis ad consequat mollit.',
          'Tempor integer ullamco ipsum ad cillum tempor ad sit velit excepteur sed adipiscing veniam.',
        ],
      },
      results: {
        summary: 'Lorem ipsum cillum consequat veniam sagittis dolore rhoncus magna. Elit et aliqua consectetur deserunt nisi magna voluptate nulla.',
        keyValues: [
          { value: '0.102', unit: 'M', uncertainty: '0.001', label: 'Acid concentration',      note: 'Do reprehenderit sint anim' },
          { value: '4.79',  unit: null, uncertainty: '0.05', label: 'pKa at half-equivalence', note: null },
          { value: '0.6',   unit: '%', uncertainty: null,    label: 'pKa vs acetic acid (4.76)', note: null },
        ],
        table: {
          caption: 'Lorem ipsum facilisis massa consectetur duis laboris sed irure rhoncus duis laborum',
          columns: [
            { label: 'Trial',     unit: '#',  numeric: false },
            { label: 'Initial',   unit: 'mL', numeric: true },
            { label: 'Final',     unit: 'mL', numeric: true },
            { label: 'NaOH used', unit: 'mL', numeric: true },
            { label: '[HA]',      unit: 'M',  numeric: true },
          ],
          rows: [
            ['1 (rough)', '0.40', '26.10', '25.70', '0.1028'],
            ['2',         '0.15', '25.62', '25.47', '0.1019'],
            ['3',         '1.05', '26.53', '25.48', '0.1019'],
            ['4',         '0.30', '25.82', '25.52', '0.1021'],
          ],
        },
      },
      figures: [
        { src: 'img/labs/acid-titration/fig-1.svg', alt: 'S-shaped titration curve of pH versus NaOH volume with equivalence and half-equivalence points marked', caption: 'Pariatur commodo ac consectetur tincidunt culpa nunc sunt non sit ullamco tincidunt.', width: 1600, height: 900 },
      ],
      conclusion: ['Nunc mollit cupidatat quis malesuada sunt ad enim nulla lorem. Pariatur dolor eiusmod ut consequat non lorem consequat ullamco.'],
      errors: ['Lorem ipsum excepteur duis mattis nunc proin do', 'Veniam anim integer vitae fames mollit ipsum amet et proin veniam mauris ipsum', 'Nulla exercitation ea culpa vitae'],
      improvements: ['Lorem ipsum pretium reprehenderit et non est deserunt', 'Lorem ipsum ut minim amet laborum egestas'],
      skills: ['Titration technique', 'Stoichiometry', 'Error analysis', 'Excel / Sheets'],
      files: { report: 'files/labs/acid-titration.pdf', data: 'files/labs/acid-titration.csv' },
    },
    {
      slug: 'catalase-temperature',
      title: 'Catalase activity vs temperature',
      subject: 'Biology',
      course: 'AP Biology',
      labNumber: 3,
      date: '2025-10-15',
      featured: false,
      instructor: 'Dr. Brooks',
      partners: ['Deshawn Carter', 'Mei Lin'],
      duration: '3 class periods',
      icon: 'Dna',
      cover: { src: 'img/labs/catalase-temperature/fig-1.svg', alt: 'Graph of catalase reaction rate rising to a peak at 37 °C and then falling', width: 1600, height: 900 },
      objective: 'Tincidunt sagittis reprehenderit id quis do officia egestas pretium nisl veniam adipiscing occaecat massa egestas sit consequat.',
      hypothesis: 'Amet lacus eiusmod velit ipsum in lacus est aute ea veniam sunt qui ac ea cupidatat sit turpis nostrud consequat dolore aliquip ipsum veniam nisl tempor.',
      verdict: 'supported',
      materials: ['Beef-liver catalase extract', '3% hydrogen peroxide', 'Gas pressure sensor + LabQuest', 'Water baths (0–65 °C)', 'Thermometer', 'Stoppered test tubes'],
      method: {
        summary: 'Non magna anim aliquip tempor aliquip sit integer irure rhoncus vitae quis ipsum velit magna amet.',
        steps: [
          'Nostrud mattis pariatur irure in ea incididunt pariatur ac enim nisi duis ad duis.',
          'Lorem ipsum tincidunt facilisis ea aliqua consectetur mattis pariatur.',
          'Lorem ipsum sed sint mollit egestas voluptate eiusmod anim excepteur adipiscing.',
          'Lorem ipsum laborum voluptate nisl tincidunt labore pretium proident.',
        ],
      },
      results: {
        summary: 'Dolor ipsum cupidatat tincidunt aliquip curabitur sint laborum aliquip sagittis lacus consequat occaecat proin dolore.',
        keyValues: [
          { value: '37',  unit: '°C',      uncertainty: '4',   label: 'Optimum temperature',    note: 'Exercitation aliquip exercitation' },
          { value: '4.6', unit: 'kPa/min', uncertainty: '0.2', label: 'Peak O₂ production rate', note: null },
          { value: '93',  unit: '%',       uncertainty: null,  label: 'Activity lost at 65 °C',  note: null },
        ],
        table: {
          caption: 'Et esse integer fugiat culpa laboris tincidunt incididunt tempor in deserunt',
          columns: [
            { label: 'Temperature',       unit: '°C',      numeric: true },
            { label: 'Mean rate',         unit: 'kPa/min', numeric: true },
            { label: 'Std. dev.',         unit: 'kPa/min', numeric: true },
            { label: 'Relative activity', unit: '%',       numeric: true },
          ],
          rows: [
            ['0',  '0.8', '0.1', '17'],
            ['10', '1.6', '0.1', '35'],
            ['20', '2.9', '0.2', '63'],
            ['30', '4.1', '0.2', '89'],
            ['37', '4.6', '0.2', '100'],
            ['45', '3.7', '0.3', '80'],
            ['55', '1.4', '0.2', '30'],
            ['65', '0.3', '0.1', '7'],
          ],
        },
      },
      figures: [
        { src: 'img/labs/catalase-temperature/fig-1.svg', alt: 'Line graph of mean reaction rate against temperature with error bars, peaking at 37 °C', caption: 'Lorem ipsum vitae laboris ullamco ipsum officia cillum turpis.', width: 1600, height: 900 },
      ],
      conclusion: ['Aute ullamco cillum anim curabitur mauris turpis proident mollit sunt ac mollit. Quis ac consectetur veniam ac minim ea commodo proin lorem fugiat nisi.'],
      errors: ['Tincidunt mauris sed dolore sint curabitur aliquip tempor', 'Ac ea pariatur do mauris malesuada ullamco nulla occaecat', 'Lorem ipsum sagittis rhoncus turpis qui dolor amet nostrud nisl culpa lorem'],
      improvements: ['Ad non laborum eiusmod anim sint nisi nostrud', 'Deserunt integer massa veniam est qui eiusmod'],
      skills: ['Experimental design', 'Error analysis', 'Excel / Sheets', 'Technical writing'],
      files: { report: 'files/labs/catalase-temperature.pdf', data: 'files/labs/catalase-temperature.csv' },
    },
    {
      slug: 'projectile-video',
      title: 'Projectile motion with video analysis',
      subject: 'Physics',
      course: 'AP Physics 1',
      labNumber: 2,
      date: '2025-09-20',
      featured: false,
      instructor: 'Ms. Alvarez',
      partners: ['Priya Natarajan', 'Deshawn Carter'],
      duration: '2 class periods',
      icon: 'Target',
      cover: { src: 'img/labs/projectile-video/fig-1.svg', alt: 'Graph of a ball’s height over time following a parabola', width: 1600, height: 900 },
      objective: 'Lorem ipsum dolore nisl tempor sint mattis dolore massa porttitor esse et sagittis et proident vitae non mauris cillum.',
      hypothesis: 'Nunc irure mattis sagittis ullamco et vitae tempor esse excepteur voluptate ex magna quis integer in sit malesuada esse.',
      verdict: 'supported',
      materials: ['Spring-loaded launcher', 'Tennis ball', 'Phone on a tripod (240 fps)', 'Meter stick for scale', 'Logger Pro video analysis'],
      method: {
        summary: 'Lorem ipsum tempor do mollit turpis deserunt reprehenderit pretium porttitor officia malesuada.',
        steps: [
          'Lorem ipsum magna lorem ipsum laborum rhoncus ex dolor nostrud labore fames curabitur vitae.',
          'Id occaecat anim ut esse nostrud cillum.',
          'Dolore ipsum esse sagittis reprehenderit proin ex laborum pariatur tincidunt officia.',
          'Lorem ipsum ad eiusmod aliquip do adipiscing tincidunt nisi anim dolor consectetur aliquip enim veniam laboris proin.',
        ],
      },
      results: {
        summary: 'Lorem ipsum laboris pariatur adipiscing reprehenderit. Dolor voluptate laboris pretium non.',
        keyValues: [
          { value: '0.998', unit: null,   uncertainty: null,   label: 'R² of parabolic fit', note: 'Curabitur id ad velit nulla ac massa' },
          { value: '9.6',   unit: 'm/s²', uncertainty: '0.2',  label: 'Measured |a|',        note: null },
          { value: '3.22',  unit: 'm/s',  uncertainty: '0.02', label: 'Horizontal velocity', note: null },
        ],
        table: {
          caption: 'Lorem ipsum nostrud exercitation curabitur qui fugiat ea velit nisl lacus',
          columns: [
            { label: 'Time t',       unit: 's', numeric: true },
            { label: 'Horizontal x', unit: 'm', numeric: true },
            { label: 'Vertical y',   unit: 'm', numeric: true },
          ],
          rows: [
            ['0.00', '0.000', '0.004'],
            ['0.05', '0.163', '0.118'],
            ['0.10', '0.320', '0.229'],
            ['0.15', '0.485', '0.293'],
            ['0.20', '0.642', '0.353'],
            ['0.25', '0.806', '0.370'],
            ['0.30', '0.965', '0.384'],
            ['0.35', '1.129', '0.352'],
            ['0.40', '1.286', '0.318'],
            ['0.45', '1.451', '0.237'],
            ['0.50', '1.609', '0.155'],
            ['0.55', '1.773', '0.028'],
          ],
        },
      },
      figures: [
        { src: 'img/labs/projectile-video/fig-1.svg', alt: 'Scatter plot of vertical position versus time with a parabolic fit', caption: 'Irure lorem proin dolor laboris proin laborum ea.', width: 1600, height: 900 },
      ],
      conclusion: ['Lorem ipsum in integer minim vitae porttitor excepteur mollit laboris vitae consectetur. Ea duis excepteur mauris id consectetur qui et aliqua non cupidatat.'],
      errors: ['Mauris mattis adipiscing labore reprehenderit sunt sit', 'Amet velit quis integer egestas ipsum tempor laborum', 'Turpis consectetur lacus facilisis'],
      improvements: ['Ex excepteur ac voluptate ad rhoncus vitae dolore', 'Excepteur cillum proident facilisis fames esse massa aliqua'],
      skills: ['Video analysis', 'Python', 'Curve fitting', 'Experimental design'],
      files: { report: 'files/labs/projectile-video.pdf', data: 'files/labs/projectile-video.csv' },
    },
  ],

  /* ── EXPERIENCE (newest first) ─────────────────────────────────────────── */
  experience: [
    {
      id: 'hill-country-robotics',
      role: 'Engineering Intern',
      org: 'Hill Country Robotics',
      orgUrl: null,
      type: 'internship',               // 'internship' | 'job' | 'volunteer' | 'research'
      location: 'Austin, TX (on-site)',
      start: '2025-06', end: '2025-08',
      summary: 'Lorem ipsum massa voluptate nulla voluptate integer aute adipiscing lacus.',
      // Logo: a WHITE mark on a transparent background (it sits on a dark crimson panel).
      logo: { src: 'img/orgs/hill-country-robotics.svg', alt: 'Hill Country Robotics logo', width: 256, height: 192 },
      achievements: [                   // max 4 shown; lead with numbers
        'Ad fugiat egestas pretium mauris cupidatat magna et incididunt occaecat aute aliquip',
        'Proident excepteur aliqua labore eiusmod incididunt anim est tincidunt nisi porttitor',
        'Culpa esse magna anim consectetur cillum est magna proident ullamco',
      ],
      skills: ['Python', 'pytest', 'Fusion 360', 'Soldering'],
      quote: { text: 'Nostrud incididunt egestas ea qui in nisl nisi nunc officia labore nisl.', name: 'Dana Whitfield', title: 'Hardware Lead' }, // null hides
    },
    {
      id: 'northgate-library',
      role: 'Teen Tech Lab Volunteer',
      org: 'Northgate Public Library',
      orgUrl: null,
      type: 'volunteer',
      location: 'Austin, TX',
      start: '2024-01', end: null,      // null = "Present"
      summary: 'Nunc amet rhoncus mattis malesuada ac esse excepteur sagittis velit turpis sit integer curabitur anim esse facilisis.',
      logo: { src: 'img/orgs/northgate-library.svg', alt: 'Northgate Public Library logo', width: 256, height: 192 },
      achievements: [
        'Pretium ipsum ad ea magna minim facilisis malesuada sint vitae',
        'Incididunt pariatur ex malesuada lorem fugiat ex nulla nostrud consequat',
        'Excepteur fames ad curabitur non laboris malesuada sint pretium tincidunt',
      ],
      skills: ['Teaching', 'Arduino', '3D printing', 'Public speaking'],
      quote: null,
    },
    {
      id: 'riverside-pizza',
      role: 'Crew Member',
      org: 'Riverside Pizza Co.',
      orgUrl: null,
      type: 'job',
      location: 'Austin, TX (part-time)',
      start: '2024-05', end: '2025-05',
      summary: 'Lorem ipsum quis aute laboris eiusmod mollit curabitur egestas tempor laborum.',
      logo: { src: 'img/orgs/riverside-pizza.svg', alt: 'Riverside Pizza Co. logo', width: 256, height: 192 },
      achievements: [
        'Tincidunt lorem porttitor consequat nostrud exercitation labore',
        'Lorem ipsum quis tincidunt ullamco velit laboris magna dolor eiusmod',
        'Velit mattis nisi esse enim id tempor ac exercitation laborum irure quis sit',
      ],
      skills: ['Customer service', 'Teamwork', 'Google Sheets'],
      quote: null,
    },
  ],

  /* ── SKILLS (4–5 groups; they render as the slanted fan) ──────────────── */
  // level: 'core' (use weekly) | 'working' (comfortable) | 'learning' (learning now).
  // theme: 'lava' | 'dusk' | 'crimson' | 'violet' | 'ember'.
  // The "uses" count is automatic: projects whose `tags` or labs whose `skills` contain the
  // exact item name (ignoring case) — so spell items the same way you spell your tags.
  skills: [
    { id: 'languages', group: 'Languages', icon: 'Code', theme: 'dusk',
      blurb: 'Esse ullamco pretium laborum.',
      items: [ { name: 'Python', level: 'core' }, { name: 'C++', level: 'core' },
               { name: 'JavaScript', level: 'working' }, { name: 'Java', level: 'working' }, { name: 'Rust', level: 'learning' } ] },
    { id: 'hardware', group: 'Hardware & fabrication', icon: 'CircuitBoard', theme: 'lava',
      blurb: 'Sunt sint tempor rhoncus proident dolore aute sint magna.',
      items: [ { name: 'Arduino / ESP32', level: 'core' }, { name: 'Soldering', level: 'core' }, { name: 'Fusion 360', level: 'core' },
               { name: '3D printing', level: 'working' }, { name: 'KiCad', level: 'learning' } ] },
    { id: 'tools', group: 'Software & tools', icon: 'Terminal', theme: 'violet',
      blurb: 'Quis sint ex ac pretium voluptate sed.',
      items: [ { name: 'Git & GitHub', level: 'core' }, { name: 'Linux', level: 'working' },
               { name: 'Vite', level: 'working' }, { name: 'Figma', level: 'working' } ] },
    { id: 'lab', group: 'Lab & data', icon: 'FlaskConical', theme: 'crimson',
      blurb: 'Lorem ipsum pariatur ut integer mollit mauris.',
      items: [ { name: 'Experimental design', level: 'core' }, { name: 'Error analysis', level: 'core' },
               { name: 'Logger Pro', level: 'working' }, { name: 'Excel / Sheets', level: 'working' } ] },
    { id: 'people', group: 'Leadership', icon: 'Users', theme: 'ember',
      blurb: 'Lorem ipsum excepteur aliquip nulla commodo massa.',
      items: [ { name: 'Team leadership', level: 'core' }, { name: 'Teaching', level: 'core' },
               { name: 'Public speaking', level: 'working' } ] },
  ],

  /* ── AWARDS & CERTIFICATIONS ── kind: 'award' | 'certification' ─────────── */
  // `project` = a project slug to add a "See project" link (or null). `url` adds a "Credential" link.
  awards: [
    { kind: 'award', title: 'State Championship — 2nd place', issuer: 'VEX Robotics Texas', date: '2026-03', detail: null, project: 'titanbot', url: null },
    { kind: 'award', title: 'Best Civic Hack', issuer: 'Hack Austin Youth 2025', date: '2025-10', detail: 'Ullamco sagittis', project: 'northbus', url: null },
    { kind: 'award', title: 'AP Scholar with Distinction', issuer: 'College Board', date: '2026-07', detail: 'Quis elit ad pariatur', project: null, url: null },
    { kind: 'certification', title: 'Autodesk Certified User: Fusion 360', issuer: 'Autodesk', date: '2025-05', detail: null, project: null, url: null },
    { kind: 'certification', title: 'CompTIA IT Fundamentals+ (ITF+)', issuer: 'CompTIA', date: '2025-01', detail: null, project: null, url: null },
  ],

  /* ── ACTIVITIES & LEADERSHIP ───────────────────────────────────────────── */
  activities: [
    { role: 'Programming Lead', org: 'Northgate Robotics (VEX 4410T)', start: '2024-08', end: null, description: 'Aliquip malesuada aliquip occaecat non aute dolor amet.', icon: 'Bot' },
    { role: 'Founder & President', org: 'Northgate Coding Club', start: '2025-01', end: null, description: 'Elit fugiat aute laboris exercitation sed duis massa adipiscing.', icon: 'Code' },
    { role: 'Peer Physics Tutor', org: 'Northgate Tutoring Center', start: '2025-08', end: null, description: 'Irure proident tincidunt dolore nulla curabitur.', icon: 'GraduationCap' },
    { role: 'Electric Vehicle event', org: 'Science Olympiad', start: '2024-09', end: '2025-04', description: 'Lorem ipsum proin dolor qui ipsum consectetur incididunt integer.', icon: 'Zap' },
  ],

  /* ── TESTIMONIALS (optional — [] hides the section) ────────────────────── */
  // Only quote people who agreed to be quoted, and keep their words exact.
  testimonials: [
    { quote: 'Pretium aute laboris nunc cupidatat culpa commodo turpis lorem egestas proin dolore ac sit exercitation sed fames.', name: 'Mr. Okafor', role: 'Computer Science Teacher', relationship: 'Teacher, 2 years' },
    { quote: 'Lorem ipsum voluptate et nostrud mattis nunc consequat exercitation sint laboris ac nisl adipiscing nunc ipsum.', name: 'Ms. Alvarez', role: 'AP Physics Teacher', relationship: 'Teacher, 1 year' },
  ],
};

export { content };
export default content;
