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
    title: 'Alex Moreno (TypicalTitan) — Student Engineer Portfolio', // browser tab on the home page
    description: 'Projects, lab reports and experience from Alex Moreno, a high-school engineer in Austin, TX.',
    copyrightYear: 2026,
    updated: '2026-09',                     // footer "Updated Sep 2026"
    currently: 'Building a LoRa weather buoy for the school pond', // footer "Currently"; null hides
    // Scrolling tools strip under the hero. Names that match a known brand get its logo
    // automatically (Python, C++, JavaScript, Arduino, ESP32, Fusion 360, Git, Vite, Linux, Figma, KiCad…).
    marquee: ['Python', 'C++', 'JavaScript', 'Arduino', 'ESP32', 'Fusion 360', '3D printing',
              'Soldering', 'Git', 'Vite', 'Linux', 'Figma', 'KiCad', 'Logger Pro'],
    projectCategories: ['Engineering', 'Software', 'Research', 'Design'], // filter order; every project.category must be listed
    // Section headings. `accent` must be a word that appears in `title` (case-sensitive).
    sections: {
      work:       { eyebrow: 'Featured', title: "Things I've built", accent: 'built',
                    blurb: "Three projects I'd walk you through in an interview." },
      projects:   { eyebrow: 'Archive', title: 'All projects', accent: 'projects', blurb: null },
      labs:       { eyebrow: 'Science & engineering labs', title: 'Lab notebook', accent: 'notebook',
                    blurb: 'Hypothesis, method, data and what went wrong — full write-ups linked.' },
      experience: { eyebrow: 'Experience', title: "Where I've worked", accent: 'worked',
                    blurb: 'An internship, a part-time job and volunteering — where I learned to show up and ship.' },
      about:      { eyebrow: 'About', accent: 'data.' },           // title comes from person.pitch
      skills:     { eyebrow: 'Toolkit', title: 'What I work with', accent: 'work',
                    blurb: 'Grouped by discipline. “Uses” counts how many of my projects and labs rely on each one.' },
      education:  { eyebrow: 'Education', title: 'School & honors', accent: 'honors', blurb: null },
      leadership: { eyebrow: 'Beyond class', title: 'Leadership & activities', accent: 'Leadership', blurb: null },
      kindWords:  { eyebrow: 'References', title: 'Kind words', accent: 'words', blurb: null },
      contact:    { eyebrow: 'Contact', titleLead: "Let's build", titleAccent: 'something.',
                    blurb: 'Open to summer 2027 internships in robotics, embedded systems and software.' },
    },
  },

  /* ── Who you are ───────────────────────────────────────────────────────── */
  person: {
    name: 'Alex Moreno',                 // REAL name — nav, hero, about, footer, page titles
    handle: 'TypicalTitan',              // blackletter display name (hero, footer, drawer); up to ~14 characters looks best
    pronouns: 'he/him',                  // null hides
    tagline: 'Student engineer building robots, tools and experiments that actually work.',
    pitch: 'I like problems you can hold in your hands — and prove with data.', // About headline; must contain sections.about.accent
    bio: [                               // About paragraphs — 2 short ones read best
      "I'm a junior at Northgate STEM Academy who spends lunch in the robotics lab. I lead programming for our VEX team and tutor underclassmen in physics.",
      "I'm happiest when a project crosses hardware and software — wiring a sensor, writing the firmware, then graphing whether it actually helped.",
    ],
    // Your photo. A 4:5 portrait works best; it is shown small and rounded in the About card.
    // photo: null hides the avatar.
    photo: { src: 'img/portrait.svg', alt: 'Alex Moreno in the school robotics lab, lit by red light', width: 800, height: 1000 },
    location: 'Austin, TX',
    school: 'Northgate STEM Academy',
    gradYear: 2027,
    focus: 'Robotics · Embedded systems',
    availability: {
      open: true,                                    // false hides the hero pill, sticker and about pill
      label: 'Open to summer 2027 internships',      // hero pill
      season: 'Summer 2027',                         // about pill "Available · Summer 2027"
      detail: 'Robotics, embedded or software engineering · Austin area or remote',
      sticker: 'OPEN TO INTERNSHIPS · CLASS OF 2027 · ', // rotating disc text, ~36 chars incl. trailing separator
    },
    email: 'alex.moreno.dev@example.com',
    responseTime: 'I reply within two school days.',
    resume: { href: 'files/resume.pdf', label: 'Résumé', fileInfo: 'PDF · 1 page' }, // drop your PDF in public/files/; null hides every Résumé button
    strengths: [                                     // About checklist — exactly 5
      'Turn a vague idea into a working prototype in a weekend',
      'Write clean, commented C++ and Python',
      'CAD in Fusion 360, then print or machine the parts',
      'Design fair experiments and do the error analysis',
      'Explain technical work to non-technical people',
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
      program: 'High school diploma — Engineering & Computer Science pathway',
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
      subtitle: 'VEX V5 competition robot',
      category: 'Engineering',            // must be in site.projectCategories
      year: 2026,
      featured: true,
      order: 1,
      badges: ['Award', 'Team'],          // any of 'Featured' | 'Award' | 'Team' | 'Solo' | 'New' | 'In progress'
      icon: 'Bot',
      theme: 'lava',
      frame: 'plate',
      role: 'Lead programmer & drive-team captain',
      team: { size: 5, members: ['Alex Moreno', 'Priya Natarajan', 'Sam Kowalski', 'Deshawn Carter', 'Mei Lin'] },
      duration: 'Aug 2025 – Mar 2026',
      context: 'Northgate Robotics (VEX 4410T)', // null hides
      summary: 'A VEX V5 robot with odometry-based autonomous routes. I wrote the motion-control code and ran driver practice.',
      cover: { src: 'img/projects/titanbot/cover.svg', alt: 'Red-and-black VEX robot on the competition field', width: 1600, height: 1000 },
      tags: ['C++', 'PROS', 'PID control', 'Odometry', 'Fusion 360'],
      links: { demo: null, repo: 'https://github.com/TypicalTitan/titanbot', video: null }, // null hides the button
      metrics: [                          // 2–4; value is text so '2nd' works; unit may be null
        { value: '2nd', unit: null, label: 'of 48 teams at state' },
        { value: '38',  unit: '%',  label: 'faster autonomous route' },
        { value: '94',  unit: '%',  label: 'auton success over 50 runs' },
      ],
      writeup: {
        problem: ['Our 2025 robot scored well when driven, but its 15-second autonomous routine missed about 1 in 3 runs because it relied on timed motor commands.'],
        process: {
          intro: 'I rebuilt the autonomous code around position tracking instead of timing.',
          steps: [
            { title: 'Added tracking wheels', body: 'Designed two unpowered tracking wheels in Fusion 360 so the robot could measure its own position.', image: 0 }, // gallery index or null
            { title: 'Wrote an odometry + PID library', body: 'Implemented arc-based odometry and a tuned PID controller in C++ with the PROS framework.', image: 1 },
            { title: 'Tested 50 runs, logged every one', body: 'Recorded end-position error for each run and tuned gains until error stayed under 2 inches.', image: null },
          ],
        },
        outcome: ['The new routine finished 38% faster and succeeded in 47 of 50 trials. We placed 2nd of 48 teams at the state championship.'],
        lessons: ['Log everything — the graphs found bugs the driver never noticed.', 'Tune one gain at a time.'], // [] hides "04 What I learned"
      },
      skills: ['Control systems', 'CAD', 'Team leadership', 'Debugging under pressure'],
      gallery: [                          // `wide: true` spans two columns on large screens
        { src: 'img/projects/titanbot/gallery-1.svg', alt: 'CAD render of the tracking-wheel module', caption: 'Tracking-wheel module v3 — spring-loaded to stay on the tiles.', width: 1600, height: 1000, wide: false },
        { src: 'img/projects/titanbot/gallery-2.svg', alt: 'Graph of position error across 50 autonomous runs', caption: 'Position error per run after tuning (inches).', width: 1600, height: 1000, wide: false },
        { src: 'img/projects/titanbot/gallery-3.svg', alt: 'The team with the robot at the state championship', caption: 'State championship, March 2026.', width: 2400, height: 1000, wide: true },
      ],
    },
    {
      slug: 'studyforge',
      title: 'StudyForge',
      subtitle: 'Spaced-repetition flashcards for my school',
      category: 'Software',
      year: 2025,
      featured: true,
      order: 2,
      badges: ['Solo'],
      icon: 'Code',
      theme: 'dusk',
      frame: 'window',
      role: 'Solo developer & designer',
      team: { size: 1, members: ['Alex Moreno'] },
      duration: 'Jun 2025 – Sep 2025',
      context: 'Independent project · piloted in AP Physics 1',
      summary: 'A free flashcard web app that schedules reviews with spaced repetition. 140 classmates used it for AP exam prep.',
      cover: { src: 'img/projects/studyforge/cover.svg', alt: 'StudyForge review screen showing a physics flashcard and four grading buttons', width: 1600, height: 1000 },
      tags: ['JavaScript', 'Vite', 'Firebase', 'IndexedDB', 'Figma'],
      links: { demo: 'https://typicaltitan.github.io/studyforge/', repo: 'https://github.com/TypicalTitan/studyforge', video: null },
      metrics: [
        { value: '140', unit: null, label: 'students using it weekly' },
        { value: '12k', unit: null, label: 'cards reviewed in the pilot' },
        { value: '11',  unit: '%',  label: 'higher unit-test average in the pilot class' },
      ],
      writeup: {
        problem: ['Paper flashcards and generic apps left my classmates cramming the night before. The popular apps locked their best features behind subscriptions, and several were blocked on school Chromebooks.'],
        process: {
          intro: 'I designed it in Figma, then built it as an offline-first web app so it would work on locked-down Chromebooks.',
          steps: [
            { title: 'Interviewed 12 classmates', body: 'Learned that the real blocker was deciding what to study, not making the cards — so the app decides for you.', image: null },
            { title: 'Implemented the SM-2 scheduler', body: 'Wrote the spaced-repetition algorithm in plain JavaScript, with a unit test for every grading path.', image: 0 },
            { title: 'Went offline-first', body: 'Stored decks in IndexedDB and synced to Firebase when online, so reviews work on the bus with no Wi-Fi.', image: 1 },
          ],
        },
        outcome: ['140 students used StudyForge weekly during AP review season and completed about 12,000 reviews. In the pilot class, the unit-test average rose 11% over the previous unit.'],
        lessons: ['Talk to users before writing code — my first design solved the wrong problem.', 'Offline support is a feature people only notice when it is missing.', 'Small, tested functions made the scheduler easy to fix.'],
      },
      skills: ['User research', 'Front-end development', 'Algorithm design', 'UI design'],
      gallery: [
        { src: 'img/projects/studyforge/gallery-1.svg', alt: 'Statistics dashboard with a retention chart and daily review counts', caption: 'Stats page — the retention curve that convinced my teacher to pilot it.', width: 1600, height: 1000, wide: false },
        { src: 'img/projects/studyforge/gallery-2.svg', alt: 'StudyForge running on a phone with an offline badge showing', caption: 'Reviews keep working offline and sync when the phone reconnects.', width: 1600, height: 1000, wide: false },
      ],
    },
    {
      slug: 'rootsense',
      title: 'RootSense',
      subtitle: 'Solar soil-moisture sensor network',
      category: 'Research',
      year: 2025,
      featured: true,
      order: 3,
      badges: ['Team'],
      icon: 'Sprout',
      theme: 'ember',
      frame: 'plate',
      role: 'Hardware & firmware lead',
      team: { size: 3, members: ['Alex Moreno', 'Deshawn Carter', 'Priya Natarajan'] },
      duration: 'Feb 2025 – Aug 2025',
      context: 'AP Environmental Science research project',
      summary: 'Eight solar-powered sensor stakes that tell the school garden club when each bed actually needs water.',
      cover: { src: 'img/projects/rootsense/cover.svg', alt: 'Solar-powered sensor stake planted in garden soil with its probe in the root zone', width: 1600, height: 1000 },
      tags: ['Arduino / ESP32', 'C++', 'Python', 'KiCad', 'Raspberry Pi'],
      links: { demo: null, repo: 'https://github.com/TypicalTitan/rootsense', video: null },
      metrics: [
        { value: '31',  unit: '%',    label: 'less water used by the garden' },
        { value: '8',   unit: null,   label: 'solar sensor stakes deployed' },
        { value: '184', unit: 'days', label: 'running on solar alone' },
      ],
      writeup: {
        problem: ['The garden club watered every bed on a fixed timer. Some beds stayed soggy while others dried out, and nobody could tell which from the surface.'],
        process: {
          intro: 'We built a small network of sensor stakes that report soil moisture every 15 minutes.',
          steps: [
            { title: 'Designed the sensor stake', body: 'An ESP32 in deep sleep, a capacitive moisture probe and a 1 W solar panel on a custom KiCad board.', image: null },
            { title: 'Mapped the garden', body: 'Placed eight stakes across the beds, reporting to a Raspberry Pi gateway over ESP-NOW.', image: 0 },
            { title: 'Watered by data, not by timer', body: 'Wrote a Python script that alerts the club when a bed drops below 25% moisture, then ran it against the old timer for two weeks.', image: 1 },
          ],
        },
        outcome: ['Sensor-guided watering used 31% less water than the timer over the same two weeks, with no drop in plant health. The stakes have now run 184 days on solar power alone.'],
        lessons: ['Deep sleep is everything on battery — the first version died in 3 days.', 'Waterproof early; one rainstorm killed two prototypes.', 'A clear chart persuades faster than a long explanation.'],
      },
      skills: ['Embedded systems', 'PCB design', 'Data analysis', 'Low-power design'],
      gallery: [
        { src: 'img/projects/rootsense/gallery-1.svg', alt: 'Map of the school garden with eight sensor locations and a moisture heatmap', caption: 'Sensor map — brighter beds are drier and need water first.', width: 1600, height: 1000, wide: false },
        { src: 'img/projects/rootsense/gallery-2.svg', alt: 'Line chart comparing soil moisture in sensor-guided and timer-watered beds over two weeks', caption: 'Two-week trial: sensor-guided beds (pink) vs the old timer schedule (gold).', width: 1600, height: 1000, wide: false },
      ],
    },
    {
      slug: 'northbus',
      title: 'NorthBus',
      subtitle: 'Live school-bus tracker (hackathon)',
      category: 'Software',
      year: 2025,
      featured: false,
      order: 4,
      badges: ['Award', 'Team'],
      icon: 'Bus',
      theme: 'violet',
      frame: 'window',
      role: 'Hardware & back-end developer',
      team: { size: 4, members: ['Alex Moreno', 'Mei Lin', 'Jordan Reyes', 'Sam Kowalski'] },
      duration: 'Oct 2025 · 24-hour hackathon',
      context: 'Hack Austin Youth 2025',
      summary: 'A GPS box for school buses and a live map that shows families when the bus will really arrive. Built in 24 hours.',
      cover: { src: 'img/projects/northbus/cover.svg', alt: 'NorthBus map showing a bus route, live bus positions and arrival times', width: 1600, height: 1000 },
      tags: ['JavaScript', 'Python', 'Firebase', 'Arduino / ESP32', 'Leaflet'],
      links: { demo: 'https://devpost.com/software/northbus', repo: 'https://github.com/TypicalTitan/northbus', video: null },
      metrics: [
        { value: '1st', unit: null, label: 'Best Civic Hack, 42 teams' },
        { value: '45',  unit: 's',  label: 'typical arrival-time error' },
        { value: '24',  unit: 'h',  label: 'from idea to live demo' },
      ],
      writeup: {
        problem: ['Buses at our school run 5–20 minutes late in bad weather, so students wait outside with no idea when theirs will show up.'],
        process: {
          intro: 'Our team of four split into hardware, back end and map front end. I built the tracker box and the arrival-time service.',
          steps: [
            { title: 'Built a GPS tracker box', body: 'An ESP32 with a GPS module and an LTE modem posts the bus position every 10 seconds.', image: null },
            { title: 'Predicted arrival times', body: 'A small Python service compares live speed with past segment times to estimate the ETA at every stop.', image: null },
            { title: 'Shipped a live map', body: 'A Leaflet map plus a one-big-number phone view, updated in real time through Firebase.', image: 0 },
          ],
        },
        outcome: ['We demoed one real bus and two simulated ones and won Best Civic Hack out of 42 teams. The district transportation office asked us for a follow-up meeting.'],
        lessons: ['Scope ruthlessly — we cut three features at hour 10 and finished on time.', 'Demo the hardware live; judges trust what they can see moving.'],
      },
      skills: ['Rapid prototyping', 'Real-time data', 'Teamwork', 'Pitching'],
      gallery: [
        { src: 'img/projects/northbus/gallery-1.svg', alt: 'NorthBus arrival screen on a phone showing the next bus in 4 minutes', caption: 'The phone view — one big number, because that is all a cold student wants.', width: 1600, height: 1000, wide: false },
      ],
    },
    {
      slug: 'crimson-60',
      title: 'Crimson 60',
      subtitle: 'Hand-wired mechanical keyboard',
      category: 'Design',
      year: 2024,
      featured: false,
      order: 5,
      badges: ['Solo'],
      icon: 'Keyboard',
      theme: 'lava',
      frame: 'plate',
      role: 'Designer & builder',
      team: { size: 1, members: ['Alex Moreno'] },
      duration: 'Jun 2024 – Aug 2024',
      context: 'Personal project',
      summary: 'A 60% keyboard with a 3D-printed case, 61 hand-soldered switches and custom QMK firmware.',
      cover: { src: 'img/projects/crimson-60/cover.svg', alt: 'Black and crimson 60% mechanical keyboard glowing on a dark desk', width: 1600, height: 1000 },
      tags: ['Fusion 360', '3D printing', 'Soldering', 'QMK', 'C'],
      links: { demo: null, repo: 'https://github.com/TypicalTitan/crimson-60', video: null },
      metrics: [
        { value: '61', unit: null, label: 'switches hand-wired with diodes' },
        { value: '4',  unit: null, label: 'case prototypes printed' },
        { value: '55', unit: '%',  label: 'cheaper than a comparable kit' },
      ],
      writeup: {
        problem: ['I wanted a compact keyboard that fit my hands and my budget. Kits cost over $150, and none had the layout I wanted.'],
        process: {
          intro: 'I designed the case and plate in Fusion 360 and wired the switch matrix by hand — no circuit board.',
          steps: [
            { title: 'Designed a printable case', body: 'Split the case into two halves to fit my printer bed; it took 4 prototypes to get the typing angle and screw posts right.', image: null },
            { title: 'Hand-wired the matrix', body: 'Soldered 61 diodes and the row and column wires straight onto the switch pins.', image: 0 },
            { title: 'Wrote custom firmware', body: 'Configured QMK in C with a function layer for arrows and media keys.', image: null },
          ],
        },
        outcome: ['Every key worked on the first flash, and it has been my daily keyboard for two years. It cost about 55% less than a comparable kit.'],
        lessons: ['Test continuity after every row, not at the end.', 'Print a small test section before committing to a 9-hour print.'],
      },
      skills: ['Product design', 'Soldering', 'Firmware', 'Iterative prototyping'],
      gallery: [
        { src: 'img/projects/crimson-60/gallery-1.svg', alt: 'Underside of the hand-wired keyboard showing diodes and row and column wires', caption: 'The hand-wired matrix: diodes along the rows, bare copper columns.', width: 1600, height: 1000, wide: false },
      ],
    },
    {
      slug: 'grip-assist',
      title: 'GripAssist',
      subtitle: '3D-printed adaptive utensil grip',
      category: 'Engineering',
      year: 2024,
      featured: false,
      order: 6,
      badges: ['Team', 'New'],
      icon: 'Hand',
      theme: 'ember',
      frame: 'plate',
      role: 'CAD lead & user-testing coordinator',
      team: { size: 3, members: ['Alex Moreno', 'Mei Lin', 'Jordan Reyes'] },
      duration: 'Jan 2024 – May 2024',
      context: 'PLTW Principles of Engineering',
      summary: 'A soft, printable utensil grip for people with arthritis, redesigned five times with three real users.',
      cover: { src: 'img/projects/grip-assist/cover.svg', alt: 'Spoon fitted with a chunky ergonomic grip that has finger grooves', width: 1600, height: 1000 },
      tags: ['Fusion 360', '3D printing', 'TPU', 'User testing'],
      links: { demo: null, repo: null, video: null }, // no links → no buttons (school project)
      metrics: [
        { value: '40', unit: '%',  label: 'less grip force needed' },
        { value: '5',  unit: null, label: 'design iterations' },
        { value: '3',  unit: null, label: 'people using it daily' },
      ],
      writeup: {
        problem: ['A classmate’s grandmother has arthritis and struggles to hold thin utensils. Store-bought foam grips wear out fast and don’t fit every hand.'],
        process: {
          intro: 'We treated her and two other users as our clients and tested every version with them.',
          steps: [
            { title: 'Measured real hands', body: 'Recorded grip span and comfortable diameter for three users with calipers and a hand dynamometer.', image: null },
            { title: 'Iterated five designs', body: 'Printed each in flexible TPU and changed one thing per version — diameter, groove depth or wall thickness.', image: 0 },
            { title: 'Tested grip force', body: 'Compared the force needed to lift a 300 g load with and without each grip.', image: null },
          ],
        },
        outcome: ['Version 5 cut the grip force needed by 40%, and all three users still use it daily. We shared the files with a local occupational-therapy clinic.'],
        lessons: ['People tell you what is wrong once you hand them something to hold.', 'Change one variable per iteration.'],
      },
      skills: ['User-centred design', 'CAD', 'Testing with real users', 'Technical documentation'],
      gallery: [
        { src: 'img/projects/grip-assist/gallery-1.svg', alt: 'Five versions of the grip lined up from first to final', caption: 'Versions 1 to 5 — thinner walls and deeper finger grooves each round.', width: 1600, height: 1000, wide: false },
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
      objective: 'Determine the local gravitational acceleration g from how a pendulum’s period changes with its length.',
      hypothesis: 'If T = 2π√(L/g), then T² vs L will be linear with slope 4π²/g, giving g within 2% of 9.81 m/s².',
      verdict: 'supported',             // 'supported' | 'partial' | 'refuted'
      materials: ['Ring stand & clamp', '50 g brass bob', 'Meter stick', 'Photogate + Logger Pro', 'String'],
      method: {
        summary: 'Five lengths, three trials each, timing 10 small-angle oscillations with a photogate.',
        steps: [
          'Set lengths of 0.20, 0.40, 0.60, 0.80 and 1.00 m, measured to the bob’s centre.',
          'Release from under 10° and time 10 full oscillations with a photogate; 3 trials per length.',
          'Average the period, square it, and plot T² against L with a linear fit.',
          'Calculate g = 4π² / slope and compare with the accepted value.',
        ],
      },
      results: {
        summary: 'T² rose linearly with L (R² = 0.999). The slope of 4.055 s²/m gives g = 9.74 m/s².',
        keyValues: [                    // first = headline result; 1–3 items
          { value: '9.74',  unit: 'm/s²', uncertainty: '0.05', label: 'Measured g', note: '0.7% below the accepted 9.81 m/s²' },
          { value: '0.7',   unit: '%',    uncertainty: null,   label: 'Error vs accepted', note: null },
          { value: '0.999', unit: null,   uncertainty: null,   label: 'R² of linear fit',  note: null },
        ],
        table: {
          caption: 'Table 1 — Average period for each length (3 trials × 10 oscillations)',
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
        { src: 'img/labs/pendulum-g/fig-1.svg', alt: 'Scatter plot of T squared vs L with best-fit line', caption: 'Figure 1 — T² vs L; slope = 4.055 s²/m.', width: 1600, height: 900 },
        { src: 'img/labs/pendulum-g/fig-2.svg', alt: 'Diagram of the pendulum and photogate setup', caption: 'Figure 2 — Apparatus.', width: 1600, height: 900 },
      ],
      conclusion: ['The data support the model: g = 9.74 m/s², 0.7% below the accepted value and well inside our 2% target.'],
      errors: ['String stretched slightly at longer lengths', 'Release angle varied by roughly ±3°'],
      improvements: ['Use stiffer fishing line', 'Add a release jig to fix the starting angle'],
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
      objective: 'Model a 9 V battery as an ideal EMF in series with an internal resistance, and measure both from how its terminal voltage drops under load.',
      hypothesis: 'If V = ε − Ir with a constant r, terminal voltage will fall linearly with current across every load we test.',
      verdict: 'partial',
      materials: ['9 V alkaline battery', 'Decade resistor box', '10 Ω 5 W power resistor', '2 digital multimeters', 'Push switch & leads'],
      method: {
        summary: 'Seven loads from 94 Ω down to 9 Ω, reading current and terminal voltage within 3 s of closing the switch.',
        steps: [
          'Measure the open-circuit voltage with the switch open.',
          'Wire the battery, switch, ammeter and load in series, with a voltmeter across the battery terminals.',
          'For each load, close the switch, read I and V within 3 seconds, then open it for 30 s so the battery can recover.',
          'Plot V against I; the slope is −r and the y-intercept is ε.',
        ],
      },
      results: {
        summary: 'From 0.10 to 0.85 A, V fell linearly with I (R² = 0.999), giving r = 0.42 Ω and ε = 9.46 V. At 1.00 A the voltage sagged 0.05 V below the line.',
        keyValues: [
          { value: '0.42',  unit: 'Ω', uncertainty: '0.03', label: 'Internal resistance', note: 'Negative slope of V vs I, 0.10–0.85 A' },
          { value: '9.46',  unit: 'V', uncertainty: '0.01', label: 'EMF (y-intercept)',   note: null },
          { value: '0.999', unit: null, uncertainty: null,  label: 'R² of linear fit',    note: null },
        ],
        table: {
          caption: 'Table 1 — Current and terminal voltage for each load (the 1.00 A row is excluded from the fit)',
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
        { src: 'img/labs/battery-resistance/fig-1.svg', alt: 'Scatter plot of terminal voltage versus current with a linear fit and one excluded point', caption: 'Figure 1 — V vs I; slope = −0.42 Ω, intercept = 9.46 V. Hollow point excluded.', width: 1600, height: 900 },
      ],
      conclusion: [
        'Between 0.10 and 0.85 A the battery behaves like the model, with r = 0.42 ± 0.03 Ω and ε = 9.46 V.',
        'At 1.00 A the point falls below the line, so r is not constant under heavy load — the hypothesis is only partly supported.',
      ],
      errors: ['The battery recovered between readings, so reading speed mattered', 'Meter-lead resistance (about 0.1 Ω) adds to every load', 'Internal resistance rises as the battery drains during the lab'],
      improvements: ['Log I and V at the same instant with a data logger', 'Use four-wire connections right at the battery terminals'],
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
      objective: 'Find the concentration and identity of an unknown monoprotic acid by titrating it with standardized 0.100 M NaOH.',
      hypothesis: 'If the unknown is acetic acid, the pH at the half-equivalence point will equal its pKa of 4.76 (±0.10).',
      verdict: 'supported',
      materials: ['50 mL burette', '0.100 M NaOH (standardized)', '25.00 mL volumetric pipette', 'pH probe + LabQuest', 'Phenolphthalein', 'Magnetic stirrer'],
      method: {
        summary: 'One pH-probe run to map the curve, then three indicator titrations for a precise endpoint.',
        steps: [
          'Pipette 25.00 mL of the unknown into a flask and add 2 drops of phenolphthalein.',
          'Run a rough titration with the pH probe, logging pH every 1.0 mL (every 0.2 mL near the jump).',
          'Titrate three more samples dropwise to the first lasting pink; read the burette to ±0.02 mL.',
          'Average the concordant volumes, calculate [HA], and read the pKa at half the equivalence volume.',
        ],
      },
      results: {
        summary: 'The three concordant titrations averaged 25.49 mL of NaOH, giving [HA] = 0.102 M. The half-equivalence pH of 4.79 points to acetic acid.',
        keyValues: [
          { value: '0.102', unit: 'M', uncertainty: '0.001', label: 'Acid concentration',      note: 'Mean of 3 concordant trials' },
          { value: '4.79',  unit: null, uncertainty: '0.05', label: 'pKa at half-equivalence', note: null },
          { value: '0.6',   unit: '%', uncertainty: null,    label: 'pKa vs acetic acid (4.76)', note: null },
        ],
        table: {
          caption: 'Table 1 — Burette readings for each titration (0.100 M NaOH into 25.00 mL of acid)',
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
        { src: 'img/labs/acid-titration/fig-1.svg', alt: 'S-shaped titration curve of pH versus NaOH volume with equivalence and half-equivalence points marked', caption: 'Figure 1 — pH-probe titration curve; equivalence at 25.5 mL, half-equivalence pH 4.79.', width: 1600, height: 900 },
      ],
      conclusion: ['The acid concentration is 0.102 ± 0.001 M. Its pKa of 4.79 is within 0.03 of acetic acid, so the unknown is very likely acetic acid.'],
      errors: ['Endpoint judged by eye — "faint pink" is subjective', 'pH probe calibrated at pH 4 and 7 only, so readings above 10 are less reliable', 'Burette parallax of about ±0.02 mL'],
      improvements: ['Locate the endpoint from the pH-probe derivative (ΔpH/ΔV)', 'Add a pH 10 buffer to the probe calibration'],
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
      objective: 'Measure how temperature affects the rate at which catalase breaks down hydrogen peroxide, and find the enzyme’s optimum temperature.',
      hypothesis: 'If catalase from beef liver works best at body temperature, the O₂ production rate will peak near 37 °C and fall sharply above 50 °C as the enzyme denatures.',
      verdict: 'supported',
      materials: ['Beef-liver catalase extract', '3% hydrogen peroxide', 'Gas pressure sensor + LabQuest', 'Water baths (0–65 °C)', 'Thermometer', 'Stoppered test tubes'],
      method: {
        summary: 'Eight temperatures, three trials each, measuring the initial rate of O₂ pressure rise in a sealed tube.',
        steps: [
          'Hold 5 mL of 3% H₂O₂ and 1 mL of extract separately in the water bath for 5 minutes.',
          'Combine them in a stoppered tube connected to the gas pressure sensor.',
          'Record pressure for 60 s and use the slope of the first 30 s as the initial rate.',
          'Repeat three times at each of 0, 10, 20, 30, 37, 45, 55 and 65 °C.',
        ],
      },
      results: {
        summary: 'The rate climbed steadily to a peak of 4.6 kPa/min at 37 °C, then dropped 93% by 65 °C — the classic denaturation curve.',
        keyValues: [
          { value: '37',  unit: '°C',      uncertainty: '4',   label: 'Optimum temperature',    note: 'Peak rate of 4.6 kPa/min' },
          { value: '4.6', unit: 'kPa/min', uncertainty: '0.2', label: 'Peak O₂ production rate', note: null },
          { value: '93',  unit: '%',       uncertainty: null,  label: 'Activity lost at 65 °C',  note: null },
        ],
        table: {
          caption: 'Table 1 — Initial rate of O₂ production at each temperature (mean of 3 trials)',
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
        { src: 'img/labs/catalase-temperature/fig-1.svg', alt: 'Line graph of mean reaction rate against temperature with error bars, peaking at 37 °C', caption: 'Figure 1 — Mean initial rate vs temperature (error bars = 1 SD).', width: 1600, height: 900 },
      ],
      conclusion: ['Catalase activity peaked at 37 °C and collapsed above 55 °C, supporting the hypothesis. The steep drop on the hot side is consistent with the enzyme denaturing.'],
      errors: ['Water-bath temperature drifted by up to 2 °C during trials', 'Extract strength varied between the two batches we blended', 'Only eight temperatures — the true peak could sit anywhere from 33 to 41 °C'],
      improvements: ['Add 33, 40 and 42 °C to pin down the optimum', 'Make one large batch of extract for every trial'],
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
      objective: 'Test whether a launched ball follows the ideal projectile model by tracking its position frame by frame in slow-motion video.',
      hypothesis: 'If air resistance is negligible, x(t) will be linear and y(t) will be a parabola with a vertical acceleration of −9.81 m/s².',
      verdict: 'supported',
      materials: ['Spring-loaded launcher', 'Tennis ball', 'Phone on a tripod (240 fps)', 'Meter stick for scale', 'Logger Pro video analysis'],
      method: {
        summary: 'Film one launch at 240 fps against a meter-stick scale, then track the ball every 12 frames (0.05 s).',
        steps: [
          'Mount the phone square to the launch plane, 3 m back, with a meter stick in frame for scale.',
          'Launch at about 40° and film at 240 fps.',
          'In Logger Pro, set the scale and origin, then mark the ball’s centre every 12 frames.',
          'Export the positions and fit x(t) with a line and y(t) with a quadratic in Python; compare 2 × the quadratic term with g.',
        ],
      },
      results: {
        summary: 'y(t) fit a parabola with R² = 0.998 and a = −9.6 m/s², 2% from g. x(t) was linear at 3.22 m/s.',
        keyValues: [
          { value: '0.998', unit: null,   uncertainty: null,   label: 'R² of parabolic fit', note: 'y(t) fit gives a = −9.6 m/s², 2% from g' },
          { value: '9.6',   unit: 'm/s²', uncertainty: '0.2',  label: 'Measured |a|',        note: null },
          { value: '3.22',  unit: 'm/s',  uncertainty: '0.02', label: 'Horizontal velocity', note: null },
        ],
        table: {
          caption: 'Table 1 — Ball position every 12 frames (0.05 s), origin at the launch point',
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
        { src: 'img/labs/projectile-video/fig-1.svg', alt: 'Scatter plot of vertical position versus time with a parabolic fit', caption: 'Figure 1 — y vs t with quadratic fit (R² = 0.998).', width: 1600, height: 900 },
      ],
      conclusion: ['The ball behaved like an ideal projectile: constant horizontal velocity and a = −9.6 m/s², within 2% of g. Air resistance was negligible over this 0.55 s flight.'],
      errors: ['Motion blur made the ball’s centre uncertain by about 1 cm', 'The camera was not perfectly square to the launch plane', 'Only one launch was analysed'],
      improvements: ['Use a bright ball against a dark backdrop to cut blur', 'Analyse five launches and average the fitted acceleration'],
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
      summary: 'Summer intern on the hardware team at a small warehouse-robotics startup.',
      // Logo: a WHITE mark on a transparent background (it sits on a dark crimson panel).
      logo: { src: 'img/orgs/hill-country-robotics.svg', alt: 'Hill Country Robotics logo', width: 256, height: 192 },
      achievements: [                   // max 4 shown; lead with numbers
        'Wrote a Python test harness that cut motor-controller QA from 40 to 12 minutes per board',
        'Designed and 3D-printed 14 cable-management brackets now used on the assembly line',
        'Presented a sensor-calibration write-up to the 9-person hardware team',
      ],
      skills: ['Python', 'pytest', 'Fusion 360', 'Soldering'],
      quote: { text: 'Alex asked better questions in week two than most interns do all summer.', name: 'Dana Whitfield', title: 'Hardware Lead' }, // null hides
    },
    {
      id: 'northgate-library',
      role: 'Teen Tech Lab Volunteer',
      org: 'Northgate Public Library',
      orgUrl: null,
      type: 'volunteer',
      location: 'Austin, TX',
      start: '2024-01', end: null,      // null = "Present"
      summary: 'Saturday volunteer in the library makerspace, helping kids and adults with 3D printers, laptops and first coding projects.',
      logo: { src: 'img/orgs/northgate-library.svg', alt: 'Northgate Public Library logo', width: 256, height: 192 },
      achievements: [
        'Run a monthly beginner Arduino workshop — 60+ attendees so far',
        'Logged 180+ volunteer hours helping patrons with 3D printing and laptops',
        'Wrote the step-by-step printer guides now posted beside every machine',
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
      summary: 'Part-time counter and kitchen shifts, 12–15 hours a week during the school year.',
      logo: { src: 'img/orgs/riverside-pizza.svg', alt: 'Riverside Pizza Co. logo', width: 256, height: 192 },
      achievements: [
        'Trained 4 new crew members on the register and opening checklist',
        'Kept Friday rushes of 120+ orders moving with a three-person closing team',
        'Built a Google Sheets prep calculator the manager still uses to cut dough waste',
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
      blurb: 'What I write every week.',
      items: [ { name: 'Python', level: 'core' }, { name: 'C++', level: 'core' },
               { name: 'JavaScript', level: 'working' }, { name: 'Java', level: 'working' }, { name: 'Rust', level: 'learning' } ] },
    { id: 'hardware', group: 'Hardware & fabrication', icon: 'CircuitBoard', theme: 'lava',
      blurb: 'From breadboard to soldered, printed and bolted together.',
      items: [ { name: 'Arduino / ESP32', level: 'core' }, { name: 'Soldering', level: 'core' }, { name: 'Fusion 360', level: 'core' },
               { name: '3D printing', level: 'working' }, { name: 'KiCad', level: 'learning' } ] },
    { id: 'tools', group: 'Software & tools', icon: 'Terminal', theme: 'violet',
      blurb: 'How I build, version and ship software.',
      items: [ { name: 'Git & GitHub', level: 'core' }, { name: 'Linux', level: 'working' },
               { name: 'Vite', level: 'working' }, { name: 'Figma', level: 'working' } ] },
    { id: 'lab', group: 'Lab & data', icon: 'FlaskConical', theme: 'crimson',
      blurb: 'Designing fair tests and trusting the numbers.',
      items: [ { name: 'Experimental design', level: 'core' }, { name: 'Error analysis', level: 'core' },
               { name: 'Logger Pro', level: 'working' }, { name: 'Excel / Sheets', level: 'working' } ] },
    { id: 'people', group: 'Leadership', icon: 'Users', theme: 'ember',
      blurb: 'Leading a team, teaching a room, presenting the work.',
      items: [ { name: 'Team leadership', level: 'core' }, { name: 'Teaching', level: 'core' },
               { name: 'Public speaking', level: 'working' } ] },
  ],

  /* ── AWARDS & CERTIFICATIONS ── kind: 'award' | 'certification' ─────────── */
  // `project` = a project slug to add a "See project" link (or null). `url` adds a "Credential" link.
  awards: [
    { kind: 'award', title: 'State Championship — 2nd place', issuer: 'VEX Robotics Texas', date: '2026-03', detail: null, project: 'titanbot', url: null },
    { kind: 'award', title: 'Best Civic Hack', issuer: 'Hack Austin Youth 2025', date: '2025-10', detail: 'Out of 42 teams', project: 'northbus', url: null },
    { kind: 'award', title: 'AP Scholar with Distinction', issuer: 'College Board', date: '2026-07', detail: '6 AP exams, 4.5 average', project: null, url: null },
    { kind: 'certification', title: 'Autodesk Certified User: Fusion 360', issuer: 'Autodesk', date: '2025-05', detail: null, project: null, url: null },
    { kind: 'certification', title: 'CompTIA IT Fundamentals+ (ITF+)', issuer: 'CompTIA', date: '2025-01', detail: null, project: null, url: null },
  ],

  /* ── ACTIVITIES & LEADERSHIP ───────────────────────────────────────────── */
  activities: [
    { role: 'Programming Lead', org: 'Northgate Robotics (VEX 4410T)', start: '2024-08', end: null, description: 'Run code reviews and lead a 5-person programming sub-team.', icon: 'Bot' },
    { role: 'Founder & President', org: 'Northgate Coding Club', start: '2025-01', end: null, description: 'Grew the club from 6 to 28 members; monthly mini-hackathons.', icon: 'Code' },
    { role: 'Peer Physics Tutor', org: 'Northgate Tutoring Center', start: '2025-08', end: null, description: 'Two sessions a week for AP Physics 1 students.', icon: 'GraduationCap' },
    { role: 'Electric Vehicle event', org: 'Science Olympiad', start: '2024-09', end: '2025-04', description: 'Built and tuned a battery-powered vehicle for distance accuracy.', icon: 'Zap' },
  ],

  /* ── TESTIMONIALS (optional — [] hides the section) ────────────────────── */
  // Only quote people who agreed to be quoted, and keep their words exact.
  testimonials: [
    { quote: 'Alex is the student other students go to when their code won’t run — and he explains the fix instead of just typing it.', name: 'Mr. Okafor', role: 'Computer Science Teacher', relationship: 'Teacher, 2 years' },
    { quote: 'His lab reports read like real engineering documents: clear question, honest error analysis and a fix for next time.', name: 'Ms. Alvarez', role: 'AP Physics Teacher', relationship: 'Teacher, 1 year' },
  ],
};

export { content };
export default content;
