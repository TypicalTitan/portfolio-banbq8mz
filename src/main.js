import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/inter/wght-italic.css';
import '@fontsource-variable/grenze-gotisch/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/chrome.css';
import './styles/effects.css';
import './styles/home.css';
import './styles/work.css';
import './styles/experience.css';

import content from './content.js';
import { renderNav } from './render/nav.js';
import { renderFooter } from './render/footer.js';
import { renderNotFound } from './render/notfound.js';
import { renderHero, renderProof, renderMarquee, renderAbout, renderSkills, renderEducation, renderContact } from './render/home/index.js';
import { renderFeatured, renderProjects, renderLabs, renderLabsIndex, renderProjectDetail, renderLabDetail } from './render/work/index.js';
import { renderExperience, renderLeadership, renderTestimonials } from './render/experience/index.js';
import { startRouter } from './router.js';

const HOME = [renderHero, renderProof, renderMarquee, renderFeatured, renderProjects, renderLabs,
              renderExperience, renderAbout, renderSkills, renderEducation, renderLeadership,
              renderTestimonials, renderContact];

document.getElementById('nav-root').replaceWith(renderNav(content));       // returns <header class="nav" id="nav-root">
document.getElementById('footer-root').replaceWith(renderFooter(content));  // returns <footer class="ft" id="footer-root">
startRouter({
  main: document.getElementById('main'),
  views: {
    // One section with malformed content drops out (and logs) instead of blanking the whole page.
    home:     () => HOME.map(fn => {
      try { return fn(content); } catch (err) { console.error(`${fn.name} failed:`, err); return null; }
    }).filter(Boolean),
    project:  (slug) => renderProjectDetail(content, slug),
    lab:      (slug) => renderLabDetail(content, slug),
    labs:     () => renderLabsIndex(content),
    notFound: () => renderNotFound(content),
  },
  homeTitle: content.site.title,   // D5: home uses site.title; other views append ' · ' + person.name
  personName: content.person.name,
});
