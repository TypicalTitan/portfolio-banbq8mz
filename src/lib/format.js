/**
 * Formatting helpers (spec §C2). Dates are 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD' strings; nothing here
 * goes through Date parsing, so time zones can never shift a month.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DASH = ' – ';

function parts(value) {
  const m = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/.exec(String(value ?? '').trim());
  if (!m) return null;
  const month = m[2] ? Number(m[2]) : null;
  return {
    year: m[1],
    month: month && month >= 1 && month <= 12 ? MONTHS[month - 1] : null,
    day: m[3] ? Number(m[3]) : null,
  };
}

/** Relative asset path: strips any leading '/' so the site works from a GitHub Pages sub-path. */
export function asset(path) {
  if (!path) return '';
  return String(path).replace(/^\/+/, '');
}

/** '2025-06' → 'Jun 2025'; '2025' → '2025'. Unparseable input is returned as-is. */
export function monthYear(value) {
  const p = parts(value);
  if (!p) return value ? String(value) : '';
  return p.month ? `${p.month} ${p.year}` : p.year;
}

/** '2026-02-12' → 'Feb 12, 2026'; 'YYYY-MM' → 'Feb 2026'. */
export function fullDate(value) {
  const p = parts(value);
  if (!p) return value ? String(value) : '';
  if (p.month && p.day) return `${p.month} ${p.day}, ${p.year}`;
  return monthYear(value);
}

/**
 * 'Jun 2025 – Aug 2025' | 'Jan 2024 – Present' | 'Aug 2023 – May 2027 (expected)'.
 * A range that starts and ends in the same month collapses to that month: 'Jun 2025'.
 */
export function dateRange(start, end, { expected = false } = {}) {
  const from = monthYear(start);
  const to = end ? monthYear(end) : 'Present';
  const range = from && from !== to ? `${from}${DASH}${to}` : from || to;
  return expected && end ? `${range} (expected)` : range;
}

/** '2024 – now' | '2024 – 2025'; a single year when start and end match. */
export function yearRange(start, end) {
  const from = parts(start)?.year ?? (start ? String(start) : '');
  if (!end) return from ? `${from}${DASH}now` : 'now';
  const to = parts(end)?.year ?? String(end);
  if (!from) return to;
  return from === to ? from : `${from}${DASH}${to}`;
}

export function pad2(n) {
  if (n === null || n === undefined || n === '') return '';
  return String(n).padStart(2, '0');
}

export function plural(n, one, many) {
  return `${n} ${Number(n) === 1 ? one : many}`;
}
