#!/usr/bin/env node
/**
 * Renders avatar-decoration.html frame by frame and writes, in ../avatar/:
 *   avatar-decoration.apng           288×288, transparent, loops forever (the Discord decoration
 *                                    format). One shared 256-colour palette with full alpha keeps it small.
 *   avatar-decoration.webm           288×288 VP9 with alpha, the lightest option for the web
 *   avatar-decoration.png            a still frame with the crown up (transparent)
 *   avatar-decoration-preview.mp4    the decoration around a sample avatar on a dark ground
 *
 * Needs playwright-core (a devDependency here) with a Chromium, and ffmpeg (for the WebM / MP4):
 *   FFMPEG=/path/to/ffmpeg CHROMIUM_PATH=/path/to/chrome node asset-packs/bloodhaze/src/export.mjs [fps]
 * Both default to what is on PATH / what Playwright installed. The APNG needs nothing extra.
 */
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { crc32, deflateSync } from 'node:zlib';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'avatar');
const FPS = Number(process.argv[2]) || 20;
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
// Sample avatar for the preview video, passed as a data URL (a file:// image would taint the canvas).
const AVATAR = `data:image/svg+xml;base64,${readFileSync(join(HERE, '..', '..', '..', 'public', 'img', 'portrait.svg')).toString('base64')}`;

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage();
await page.addInitScript(() => { window.__EXPORTING__ = true; });
await page.goto(pathToFileURL(join(HERE, 'avatar-decoration.html')).href);
const { size, loop } = await page.evaluate(() => window.DECORATION);
const frames = Math.round(loop * FPS);

/** Raw RGBA bytes of one frame (unpremultiplied, straight off the canvas). */
const grab = async (t, i, preview) => Buffer.from(await page.evaluate(async ({ t, i, preview, avatar, size }) => {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  if (preview) {
    if (!window.__avatar) {
      window.__avatar = new Image();
      window.__avatar.src = avatar;
      await window.__avatar.decode().catch(() => {});
    }
    ctx.fillStyle = '#111214';
    ctx.fillRect(0, 0, size, size);
    ctx.save();
    ctx.beginPath(); ctx.arc(size / 2, size / 2, 120, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = '#1a0a0e'; ctx.fillRect(24, 24, 240, 240);
    if (window.__avatar.naturalWidth) ctx.drawImage(window.__avatar, 24, 24, 240, 240);
    ctx.restore();
    const d = document.createElement('canvas');
    d.width = d.height = size;
    window.renderFrame(d.getContext('2d'), t, i);
    ctx.drawImage(d, 0, 0);
  } else {
    window.renderFrame(ctx, t, i);
  }
  const px = ctx.getImageData(0, 0, size, size).data;
  let s = '';
  for (let k = 0; k < px.length; k += 0x8000) s += String.fromCharCode.apply(null, px.subarray(k, k + 0x8000));
  return btoa(s);
}, { t, i, preview, avatar: AVATAR, size }), 'base64');

const deco = [], prev = [];
for (let i = 0; i < frames; i++) {
  deco.push(await grab(i / FPS, i, false));
  prev.push(await grab(i / FPS, i, true));
}
const still = await grab(2.9, 58, false);
await browser.close();

/* ── PNG / APNG writing ─────────────────────────────────────────────────── */
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td) >>> 0);
  return Buffer.concat([len, td, crc]);
};
const SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = (w, h, colorType) => { const b = Buffer.alloc(13); b.writeUInt32BE(w, 0); b.writeUInt32BE(h, 4); b[8] = 8; b[9] = colorType; return b; };
/** Scanlines with filter byte 0; bpp = bytes per pixel. */
const scan = (buf, w, h, bpp) => {
  const out = Buffer.alloc(h * (w * bpp + 1));
  for (let y = 0; y < h; y++) buf.copy(out, y * (w * bpp + 1) + 1, y * w * bpp, (y + 1) * w * bpp);
  return deflateSync(out, { level: 9 });
};
const writePng = (file, rgba) => writeFileSync(file, Buffer.concat([SIG, chunk('IHDR', ihdr(size, size, 6)), chunk('IDAT', scan(rgba, size, size, 4)), chunk('IEND', Buffer.alloc(0))]));

/* ── One shared palette for every frame: k-means in premultiplied RGBA ── */
function buildPalette(framesRGBA, k = 255) {
  const samples = [];
  for (const f of framesRGBA) {
    for (let p = 0; p < f.length; p += 4 * 5) {
      const a = f[p + 3];
      if (a < 3) continue;
      samples.push([f[p] * a / 255, f[p + 1] * a / 255, f[p + 2] * a / 255, a]);
    }
  }
  // k-means++-style seeding from a deterministic stride, then Lloyd iterations.
  const n = samples.length;
  const centres = [];
  for (let c = 0; c < k; c++) centres.push(samples[Math.floor(((c + 0.5) / k) * n)].slice());
  centres.sort((x, y) => x[3] - y[3]);
  const assign = new Int32Array(n);
  for (let iter = 0; iter < 14; iter++) {
    const sum = centres.map(() => [0, 0, 0, 0, 0]);
    for (let s = 0; s < n; s++) {
      const v = samples[s];
      let best = 0, bd = Infinity;
      for (let c = 0; c < k; c++) {
        const q = centres[c];
        const d = (v[0] - q[0]) ** 2 + (v[1] - q[1]) ** 2 + (v[2] - q[2]) ** 2 + 1.5 * (v[3] - q[3]) ** 2;
        if (d < bd) { bd = d; best = c; }
      }
      assign[s] = best;
      const t = sum[best]; t[0] += v[0]; t[1] += v[1]; t[2] += v[2]; t[3] += v[3]; t[4]++;
    }
    for (let c = 0; c < k; c++) {
      const t = sum[c];
      if (t[4]) centres[c] = [t[0] / t[4], t[1] / t[4], t[2] / t[4], t[3] / t[4]];
      else centres[c] = samples[(c * 7919 + iter * 104729) % n].slice(); // re-seed an empty cluster, deterministically
    }
  }
  return [[0, 0, 0, 0], ...centres]; // index 0: fully transparent
}

function toIndices(rgba, pal) {
  const out = Buffer.alloc(size * size);
  const cache = new Map();
  for (let p = 0, i = 0; p < rgba.length; p += 4, i++) {
    const a = rgba[p + 3];
    if (a < 3) { out[i] = 0; continue; }
    const key = (rgba[p] << 24 | rgba[p + 1] << 16 | rgba[p + 2] << 8 | a) >>> 0;
    let idx = cache.get(key);
    if (idx === undefined) {
      const v = [rgba[p] * a / 255, rgba[p + 1] * a / 255, rgba[p + 2] * a / 255, a];
      let bd = Infinity;
      for (let c = 1; c < pal.length; c++) {
        const q = pal[c];
        const d = (v[0] - q[0]) ** 2 + (v[1] - q[1]) ** 2 + (v[2] - q[2]) ** 2 + 1.5 * (v[3] - q[3]) ** 2;
        if (d < bd) { bd = d; idx = c; }
      }
      cache.set(key, idx);
    }
    out[i] = idx;
  }
  return out;
}

function writeApng(file, framesRGBA, fps) {
  const pal = buildPalette(framesRGBA);
  const plte = Buffer.alloc(256 * 3), trns = Buffer.alloc(256);
  pal.forEach(([r, g, b, a], i) => {
    const un = a > 0 ? 255 / a : 0; // back from premultiplied
    plte[i * 3] = Math.min(255, Math.round(r * un));
    plte[i * 3 + 1] = Math.min(255, Math.round(g * un));
    plte[i * 3 + 2] = Math.min(255, Math.round(b * un));
    trns[i] = Math.round(a);
  });
  const parts = [SIG, chunk('IHDR', ihdr(size, size, 3)), chunk('PLTE', plte), chunk('tRNS', trns)];
  const actl = Buffer.alloc(8); actl.writeUInt32BE(framesRGBA.length, 0); actl.writeUInt32BE(0, 4); // 0 = loop forever
  parts.push(chunk('acTL', actl));
  let seq = 0;
  framesRGBA.forEach((f, i) => {
    const fctl = Buffer.alloc(26);
    fctl.writeUInt32BE(seq++, 0); fctl.writeUInt32BE(size, 4); fctl.writeUInt32BE(size, 8);
    fctl.writeUInt32BE(0, 12); fctl.writeUInt32BE(0, 16);
    fctl.writeUInt16BE(1, 20); fctl.writeUInt16BE(fps, 22); // delay = 1/fps s
    fctl[24] = 0; fctl[25] = 0; // dispose none, blend source (each frame replaces the last)
    parts.push(chunk('fcTL', fctl));
    const data = scan(toIndices(f, pal), size, size, 1);
    if (i === 0) parts.push(chunk('IDAT', data));
    else {
      const s = Buffer.alloc(4); s.writeUInt32BE(seq++);
      parts.push(chunk('fdAT', Buffer.concat([s, data])));
    }
  });
  parts.push(chunk('IEND', Buffer.alloc(0)));
  writeFileSync(file, Buffer.concat(parts));
}

writeApng(join(OUT, 'avatar-decoration.apng'), deco, FPS);
writePng(join(OUT, 'avatar-decoration.png'), still);

/* ── WebM (alpha) and the preview MP4 through ffmpeg, fed raw RGBA ── */
const tmp = mkdtempSync(join(tmpdir(), 'bloodhaze-'));
writeFileSync(join(tmp, 'deco.rgba'), Buffer.concat(deco));
writeFileSync(join(tmp, 'prev.rgba'), Buffer.concat([...prev, ...prev])); // two loops, to check the seam
const raw = (f) => ['-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${size}x${size}`, '-framerate', String(FPS), '-i', join(tmp, f)];
const ff = (...args) => execFileSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
ff(...raw('deco.rgba'), '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '0', '-crf', '30', '-auto-alt-ref', '0', join(OUT, 'avatar-decoration.webm'));
ff(...raw('prev.rgba'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', join(OUT, 'avatar-decoration-preview.mp4'));
rmSync(tmp, { recursive: true, force: true });

for (const f of ['avatar-decoration.apng', 'avatar-decoration.webm', 'avatar-decoration.png', 'avatar-decoration-preview.mp4']) {
  console.log(`${f}: ${(statSync(join(OUT, f)).size / 1024).toFixed(0)} KB`);
}
console.log(`${frames} frames at ${FPS} fps (${loop}s loop)`);
