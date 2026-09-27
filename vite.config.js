import { defineConfig } from 'vite';
import { fileURLToPath, pathToFileURL } from 'node:url';

const CONTENT = fileURLToPath(new URL('./src/content.js', import.meta.url));
const THEMES = fileURLToPath(new URL('./src/themes.js', import.meta.url));

const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

/**
 * Fills index.html's head and noscript line from src/content.js, so link previews and search
 * results (which never run JavaScript) show the same title, description and name as the site,
 * and the pre-paint theme script from src/themes.js + site.theme.
 * The files are re-imported on every transform, so `npm run dev` picks up edits without a restart.
 */
function contentHead() {
  return {
    name: 'content-head',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const { default: content } = await import(`${pathToFileURL(CONTENT).href}?t=${Date.now()}`);
        const { THEME_IDS, THEME_PACKS, DEFAULT_THEME } = await import(`${pathToFileURL(THEMES).href}?t=${Date.now()}`);
        const theme = THEME_IDS.includes(content?.site?.theme) ? content.site.theme : DEFAULT_THEME;
        const site = content?.site ?? {};
        const person = content?.person ?? {};
        const name = person.name || person.handle || site.title || '';
        const who = person.handle && person.handle !== name ? `${name} (${person.handle})` : name;
        const resume = person.resume?.href ? String(person.resume.href).replace(/^\/+/, '') : null;
        const noscript = [
          `${esc(who)}${site.description ? ` — ${esc(site.description)}` : ''}`,
          person.email ? `Email: <a href="mailto:${esc(person.email)}">${esc(person.email)}</a>` : null,
          resume ? `<a href="${esc(resume)}">${esc(person.resume.label || 'Résumé')} (PDF)</a>` : null,
        ].filter(Boolean).join(' · ');
        return html
          .replaceAll('%SITE_TITLE%', esc(site.title))
          .replaceAll('%SITE_DESCRIPTION%', esc(site.description))
          .replaceAll('%NOSCRIPT%', noscript)
          .replaceAll('%THEME_IDS%', THEME_IDS.join('|'))
          .replaceAll('%THEME_DEFAULT%', theme)
          .replaceAll('%THEME_COLOR%', THEME_PACKS.find((pack) => pack.id === theme).bg);
      },
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [contentHead()],
  build: { target: 'es2022', cssCodeSplit: false, sourcemap: false },
});
