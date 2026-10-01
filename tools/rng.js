// Small deterministic PRNG so generated questions are stable between builds.
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function RNG(seed) {
  const r = mulberry32(seed);
  const o = {
    f: r,
    int: (a, b) => a + Math.floor(r() * (b - a + 1)),
    pick: arr => arr[Math.floor(r() * arr.length)],
    shuffle: arr => { arr = arr.slice(); for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; },
    sample: (arr, n) => o.shuffle(arr).slice(0, n),
  };
  return o;
}
function perms(a) { if (a.length <= 1) return [a]; const out = []; a.forEach((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).forEach(p => out.push([x, ...p]))); return out; }
// Build 4 options with the correct one at slot `pos`; wrong values are de-duplicated and topped up with `fill()` if short.
function opts(correct, wrongs, pos, fill) {
  const seen = new Set([String(correct)]), w = [];
  for (const x of wrongs) { if (!seen.has(String(x))) { seen.add(String(x)); w.push(x); } if (w.length === 3) break; }
  let k = 1; while (w.length < 3) { const x = fill ? fill(k++) : String(correct) + k++; if (!seen.has(String(x))) { seen.add(String(x)); w.push(x); } }
  const out = w.slice(); out.splice(pos % 4, 0, correct);
  return { opts: out.map(String), ans: pos % 4 };
}
module.exports = { RNG, perms, opts };
