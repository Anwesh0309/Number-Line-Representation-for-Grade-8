/* =========================================================================
   NUMBER FORMATTING HELPERS (true minus sign, fractions, parsing)
   ========================================================================= */
export const MINUS = '−';

export const round6 = (v) => Math.round(v * 1e6) / 1e6;

/** 3 -> "3", -2.5 -> "−2.5", 0.3333 -> "0.333" */
export function fmt(v) {
  const r = Number(round6(v).toFixed(3));
  const s = Number.isInteger(r) ? String(r) : String(r);
  return s.replace('-', MINUS);
}

/** Fixed decimals with true minus sign */
export function fmtFixed(v, d) {
  if (Math.abs(v) < 0.5 * Math.pow(10, -d)) v = 0; // avoid "−0.0"
  return v.toFixed(d).replace('-', MINUS);
}

export function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** Simplified fraction string: fracStr(-2,4) -> "−1/2", fracStr(4,2) -> "2" */
export function fracStr(n, d) {
  const g = gcd(n, d);
  n /= g; d /= g;
  if (d < 0) { n = -n; d = -d; }
  if (d === 1) return fmt(n);
  return (n < 0 ? MINUS : '') + Math.abs(n) + '/' + d;
}

/** Parse "−3", "-3", "1.5", "3/4", "−1/2" -> number (NaN if invalid) */
export function parseNum(str) {
  if (str == null) return NaN;
  const s = String(str).replace(/[−–]/g, '-').trim();
  if (!s) return NaN;
  if (s.includes('/')) {
    const [a, b] = s.split('/');
    const n = Number(a), d = Number(b);
    return d ? n / d : NaN;
  }
  return Number(s);
}

export const approx = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
