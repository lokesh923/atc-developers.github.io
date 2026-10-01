// Master Mock 4 - Pseudocode (5) and Numerical Puzzles (4). Pseudocode answers are produced by running equivalent JS; puzzles are solver-checked.
const L = require('./lib');
const { RNG, perms, opts } = require('./rng');
const { mcq, dir, pp, T, R, C, P, esc } = L;
const MM = { mm: 'M4', tough: true };
let slot = 3;
const nextPos = () => (slot = (slot * 3 + 1) % 4);
const addP = (set, topic, sub, q, correct, wrongs, exp) => { const o = opts(correct, wrongs, nextPos()); return mcq('P', topic, q, o.opts, o.ans, exp, { set, sub, ...MM }); };
const addZ = (set, topic, sub, q, correct, wrongs, exp, fill) => { const o = opts(correct, wrongs, nextPos(), fill); return mcq('Z', topic, q, o.opts, o.ans, exp, { set, sub, ...MM }); };
const code = lines => `<pre>${esc(lines.join('\n'))}</pre>`;
const arrFig = (a, label, hi = []) => { const w = a.length * 46 + 16; let s = ''; a.forEach((v, i) => { s += R(8 + i * 46, 8, 44, 34, hi.includes(i) ? 'soft sline' : 'paper sline') + T(30 + i * 46, 31, v, { b: 1, s: 15 }) + T(30 + i * 46, 58, i, { s: 11, c: 'muted' }); }); s += T(w / 2, 76, label, { s: 11 }); return L.fig(w, 82, s, label); };

// ---------------- Pseudocode ----------------
{ // P1 bubble sort passes
  const a = [9, 4, 7, 1, 8, 3], n = a.length, snap = [];
  const b = a.slice(); for (let pass = 1; pass <= 2; pass++) { for (let j = 0; j <= n - 2; j++) if (b[j] > b[j + 1]) [b[j], b[j + 1]] = [b[j + 1], b[j]]; snap.push(b.slice()); }
  const set = pp('Study the array and the code.') + arrFig(a, 'Array a before the loops (index below each box)') + code(['Set Integer n = 6', 'for pass = 1 to 2', '    for j = 0 to n - 2', '        if a[j] > a[j + 1] then swap(a[j], a[j + 1])', '    end-for', 'end-for', 'display a[4] + a[5]']);
  addP(set, 'Basic Algorithms', 'Bubble sort', 'What is displayed?', String(b[4] + b[5]), [String(snap[0][4] + snap[0][5]), String(a[4] + a[5]), String(b[0] + b[1]), '14'],
    `Pass 1 gives [${snap[0].join(', ')}]; pass 2 gives [${snap[1].join(', ')}]. After two passes the two largest values (8 and 9) sit at the end, so a[4] + a[5] = ${b[4]} + ${b[5]} = ${b[4] + b[5]}. (After only one pass the answer would be ${snap[0][4] + snap[0][5]}.)`);
}
{ // P2 flowchart with Collatz-like loop
  const run = n => { let c = 0; while (n !== 1) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; c++; } return c; };
  const box = (x, y, w, h, t) => R(x, y, w, h, 'paper sline', "rx='5'") + T(x + w / 2, y + h / 2 + 4, t, { s: 12, b: 1 });
  const dia = (cx, cy, t) => P([[cx, cy - 24], [cx + 60, cy], [cx, cy + 24], [cx - 60, cy]], 'soft sline') + T(cx, cy + 4, t, { s: 12, b: 1 });
  let s = `<ellipse cx='150' cy='18' rx='40' ry='13' class='soft sline'/>` + T(150, 22, 'START', { s: 12, b: 1 }) + L.A(150, 31, 150, 46);
  s += box(75, 48, 150, 28, 'Input n;  c = 0') + L.A(150, 76, 150, 98) + dia(150, 124, 'n = 1 ?') + L.A(150, 148, 150, 172) + T(160, 164, 'No', { a: 'start', s: 11 });
  s += dia(150, 198, 'n is even ?') + T(78, 190, 'Yes', { s: 11 }) + T(222, 190, 'No', { s: 11 });
  s += L.L(90, 198, 50, 198) + L.A(50, 198, 50, 226) + L.L(210, 198, 250, 198) + L.A(250, 198, 250, 226);
  s += box(8, 228, 84, 28, 'n = n / 2') + box(206, 228, 92, 28, 'n = 3n + 1');
  s += L.L(50, 256, 50, 276) + L.L(250, 256, 250, 276) + L.L(50, 276, 250, 276) + L.A(150, 276, 150, 292) + box(85, 294, 130, 28, 'c = c + 1');
  s += L.L(215, 308, 296, 308) + L.L(296, 308, 296, 124) + L.A(296, 124, 212, 124);
  s += L.L(90, 124, 20, 124) + L.L(20, 124, 20, 352) + L.A(20, 352, 100, 352) + T(40, 116, 'Yes', { a: 'start', s: 11 }) + box(102, 338, 100, 28, 'Output c');
  const set = dir('Study the flowchart.') + L.fig(320, 372, s, 'Flowchart: halve even numbers, triple-plus-one odd numbers, count the steps until n = 1');
  addP(set, 'Programming Logic', 'Flowchart', 'What is the output when n = 6?', String(run(6)), [String(run(6) - 1), String(run(6) + 2), '6', String(run(7))],
    `6 &rarr; 3 &rarr; 10 &rarr; 5 &rarr; 16 &rarr; 8 &rarr; 4 &rarr; 2 &rarr; 1. That is ${run(6)} steps, so c = ${run(6)}.`);
}
{ // P3 recursion call count
  let calls = 0; const f = n => { calls++; return n <= 1 ? 1 : f(n - 1) + f(n - 2); };
  const cnt = n => { calls = 0; f(n); return calls; };
  // call tree for f(4)
  const nodes = [['f(4)', 190, 20], ['f(3)', 110, 70], ['f(2)', 270, 70], ['f(2)', 70, 120], ['f(1)', 150, 120], ['f(1)', 230, 120], ['f(0)', 310, 120], ['f(1)', 40, 170], ['f(0)', 100, 170]];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [3, 8]];
  let s = ''; edges.forEach(([a, b]) => s += L.L(nodes[a][1], nodes[a][2] + 12, nodes[b][1], nodes[b][2] - 12, 'ln'));
  nodes.forEach(n => s += R(n[1] - 22, n[2] - 12, 44, 24, 'paper sline', "rx='4'") + T(n[1], n[2] + 5, n[0], { s: 12, b: 1 }));
  s += T(190, 206, 'Calls made by f(4): 9', { s: 12, b: 1 });
  const set = dir('The function below is called as f(4). The figure shows every call it makes.') + code(['function f(Integer n)', '    if n <= 1 then return 1', '    return f(n - 1) + f(n - 2)', 'end-function']) + L.fig(380, 214, s, 'Call tree of f(4) with 9 calls');
  if (cnt(4) !== 9) throw new Error('call tree check');
  addP(set, 'Programming Logic', 'Recursion', 'How many calls (including the first) are made when f(5) is called?', String(cnt(5)), [String(cnt(5) - 2), String(cnt(5) + 3), '14', '18'],
    `Let C(n) be the number of calls. C(0) = C(1) = 1 and C(n) = 1 + C(n&minus;1) + C(n&minus;2). C(2) = 3, C(3) = 5, C(4) = 9 (as the figure shows), so C(5) = 1 + 9 + 5 = ${cnt(5)}.`);
}
{ // P4 string indices
  const s0 = 'PLACEMENT'.split(''), s = s0.slice(); for (let i = 0; i <= 2; i++) [s[i], s[8 - i]] = [s[8 - i], s[i]];
  const set = pp('Study the string and the code. Indexes start at 0.') + arrFig(s0, 'String s = PLACEMENT') + code(["Set String s = 'PLACEMENT'", 'for i = 0 to 2', '    swap(s[i], s[8 - i])', 'end-for', 'display s[2] + s[6]']);
  addP(set, 'Array & String Manipulation Logic', 'String swaps', 'What is displayed?', s[2] + s[6], [s0[2] + s0[6], s[3] + s[5], s[2] + s[7], s[1] + s[6]].filter(x => x !== s[2] + s[6]).concat(['EE']),
    `The loop swaps only three pairs: (0,8), (1,7), (2,6). The string becomes ${s.join('')}. s[2] = ${s[2]} and s[6] = ${s[6]}, so the output is ${s[2] + s[6]}. (The 4th letter onwards is not touched.)`);
}
{ // P5 short-circuit count
  const pairs = [[3, 4], [1, 1], [4, 6], [2, 7], [5, 2]]; let evals = 0, out = '';
  pairs.forEach(([a, b]) => { let ok; if (a > 2) { evals++; ok = b < 5; } else ok = false; if (!ok) ok = a === b; out += ok ? 'Y' : 'N'; });
  const set = dir('The code reads the five pairs (a, b) of the table, one after the other.') + L.tbl(['Pair', 'a', 'b'], pairs.map((p, i) => [i + 1, p[0], p[1]])) + code(['Set Integer count = 0', 'function check(Integer b)', '    count = count + 1', '    return b < 5', 'end-function', '', 'for each pair (a, b)', '    if (a > 2 and check(b)) or a == b then', "        display 'Y'", '    else', "        display 'N'", '    end-if', 'end-for', 'display count']);
  // Short-circuit: "count = count + 1" runs only when a > 2 is true
  addP(set, 'Conditional Statements (IF / ELSE)', 'Short-circuit', 'What is the <b>last value</b> displayed (the value of count)?', String(evals), [String(pairs.length), String(evals - 1), String(evals + 1), '0'],
    `Because "and" is short-circuit, check(b) (which adds 1 to count) is called only when a &gt; 2 is true. a &gt; 2 holds for the pairs (3,4), (4,6) and (5,2), so count = ${evals}. (The Y/N line printed first reads ${out}.)`);
}

// ---------------- Numerical puzzles ----------------
{ // Z1 visual series with shape options
  const shape = (rot, filled, size = 56) => { const c = size / 2; const pts = [[c, 6], [size - 8, size - 10], [8, size - 10]]; return `<svg viewBox='0 0 ${size} ${size}' width='${size}' role='img' aria-label='triangle' xmlns='http://www.w3.org/2000/svg'><g transform='rotate(${rot} ${c} ${c})'><polygon points='${pts.map(p => p.join(',')).join(' ')}' class='${filled ? 'a' : 'paper'} sline'/><circle cx='${c}' cy='13' r='3.5' class='mk'/></g></svg>`; };
  const steps = [0, 1, 2, 3].map(k => ({ rot: (k * 90) % 360, filled: k % 2 === 0 }));
  const row = steps.map((s, i) => `<span class='shp'>${shape(s.rot, s.filled)}</span>`).join('') + `<span class='shp qm'>?</span>`;
  const next = { rot: (4 * 90) % 360, filled: 4 % 2 === 0 };
  const cand = [{ rot: 0, filled: true }, { rot: 0, filled: false }, { rot: 90, filled: true }, { rot: 180, filled: false }];
  const o = cand.map(c => shape(c.rot, c.filled));
  const ans = cand.findIndex(c => c.rot === next.rot && c.filled === next.filled);
  const set = dir('A triangle with a dot on its top corner changes in a fixed way from figure to figure.') + `<div class='figrow shprow'>${row}</div>`;
  mcq('Z', 'Visual Reasoning', 'Which figure comes in place of the question mark?', o, ans, 'Each step turns the triangle 90 degrees clockwise (the dot moves round the corners) and the shading alternates: filled, empty, filled, empty. The 5th figure has turned a full 360 degrees (back to the start position) and is filled again.', { set, sub: 'Figure series', ...MM });
}
{ // Z2 number grid
  const rows = [[4, 6], [5, 3], [7, 9]], third = r => r[0] * r[0] - r[1];
  const g = (rows.map((r, i) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${i < 2 ? third(r) : '?'}</td></tr>`)).join('');
  const set = dir('Find the missing number. The same rule is used in every row.') + `<table class='dt grid-num'><tbody>${g}</tbody></table>`;
  const ans = third(rows[2]);
  addZ(set, 'Number Based Patterns', 'Grid', 'What replaces the question mark?', String(ans), [String(ans + 18), String(rows[2][0] * rows[2][1] - 14), '58', '54'],
    `Row 1: 4&sup2; &minus; 6 = 10. Row 2: 5&sup2; &minus; 3 = 22. The rule is (first number)&sup2; &minus; second number, so row 3 is 7&sup2; &minus; 9 = ${ans}.`);
}
{ // Z3 6x6 sudoku
  const R_ = RNG(77), N = 6, BR = 2, BC = 3;
  const ok = (g, r, c, v) => { for (let i = 0; i < N; i++) if (g[r][i] === v || g[i][c] === v) return false; const r0 = r - r % BR, c0 = c - c % BC; for (let i = 0; i < BR; i++) for (let j = 0; j < BC; j++) if (g[r0 + i][c0 + j] === v) return false; return true; };
  const solveCount = (g, limit) => { let cnt = 0; const go = () => { if (cnt >= limit) return; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!g[r][c]) { for (let v = 1; v <= N; v++) if (ok(g, r, c, v)) { g[r][c] = v; go(); g[r][c] = 0; } return; } cnt++; }; go(); return cnt; };
  const full = Array.from({ length: N }, () => Array(N).fill(0));
  const fill = () => { for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!full[r][c]) { for (const v of R_.shuffle([1, 2, 3, 4, 5, 6])) if (ok(full, r, c, v)) { full[r][c] = v; if (fill()) return true; full[r][c] = 0; } return false; } return true; };
  fill();
  const puz = full.map(r => r.slice()); const cells = R_.shuffle([...Array(N * N).keys()]);
  for (const k of cells) { const r = Math.floor(k / N), c = k % N, v = puz[r][c]; puz[r][c] = 0; if (solveCount(puz.map(x => x.slice()), 2) !== 1) puz[r][c] = v; if (puz.flat().filter(x => x).length <= 14) break; }
  const empties = [].concat(...puz.map((row, r) => row.map((v, c) => v ? null : [r, c]).filter(Boolean)));
  const cand = (r, c) => { const used = new Set(); for (let i = 0; i < N; i++) { used.add(puz[r][i]); used.add(puz[i][c]); } const r0 = r - r % BR, c0 = c - c % BC; for (let i = 0; i < BR; i++) for (let j = 0; j < BC; j++) used.add(puz[r0 + i][c0 + j]); return [1, 2, 3, 4, 5, 6].filter(v => !used.has(v)); };
  const singles = empties.filter(([r, c]) => cand(r, c).length === 1);
  if (!singles.length) throw new Error('no naked single in sudoku');
  const [tr, tc] = singles[singles.length - 1];
  const cs = 40; let s = '';
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const hi = r === tr && c === tc; s += R(10 + c * cs, 10 + r * cs, cs, cs, hi ? 'soft sline' : 'paper sline', "stroke-width='1'") + T(10 + c * cs + cs / 2, 10 + r * cs + 26, hi ? '?' : puz[r][c] || '', { b: 1, s: 17 }); }
  for (let i = 0; i <= N; i += BR) s += L.L(10, 10 + i * cs, 10 + N * cs, 10 + i * cs, 'ln', "stroke-width='3'"); for (let j = 0; j <= N; j += BC) s += L.L(10 + j * cs, 10, 10 + j * cs, 10 + N * cs, 'ln', "stroke-width='3'");
  const set = dir('Fill the 6 &times; 6 grid so that every row, every column and every 2 &times; 3 box (thick lines) contains each of the digits 1 to 6 exactly once.') + L.fig(260, 262, s, 'Partly filled 6 by 6 Sudoku with one cell marked');
  const ans = full[tr][tc];
  addZ(set, 'Sudoku', '6 x 6', 'Which digit goes in the cell marked ?', String(ans), ['1', '2', '3', '4', '5', '6'].filter(x => x !== String(ans)),
    `Row ${tr + 1} already has ${puz[tr].filter(Boolean).join(', ')}; column ${tc + 1} already has ${puz.map(r => r[tc]).filter(Boolean).join(', ')}; the box already has ${(() => { const r0 = tr - tr % BR, c0 = tc - tc % BC, v = []; for (let i = 0; i < BR; i++) for (let j = 0; j < BC; j++) if (puz[r0 + i][c0 + j]) v.push(puz[r0 + i][c0 + j]); return v.join(', '); })()}. Together these use every digit except ${ans}, so the marked cell must be ${ans}.`);
}
{ // Z4 logic grid: 4 people x pets x colours
  const R_ = RNG(5), P_ = ['Asha', 'Bina', 'Chetan', 'Dev'], PETS = ['cat', 'dog', 'fish', 'parrot'], COL = ['red', 'blue', 'green', 'yellow'];
  const target = { pet: R_.shuffle(PETS), col: R_.shuffle(COL) };      // index = person
  const own = (a, p) => a.pet[P_.indexOf(p)], lik = (a, p) => a.col[P_.indexOf(p)];
  const mk = []; P_.forEach(p => { PETS.forEach(x => { mk.push({ t: `${p} owns the ${x}`, ok: a => own(a, p) === x, w: 0.4 }); mk.push({ t: `${p} does not own the ${x}`, ok: a => own(a, p) !== x }); });
    COL.forEach(c => { mk.push({ t: `${p} likes ${c}`, ok: a => lik(a, p) === c, w: 0.4 }); mk.push({ t: `${p} does not like ${c}`, ok: a => lik(a, p) !== c }); }); });
  PETS.forEach(x => COL.forEach(c => { mk.push({ t: `The person who likes ${c} owns the ${x}`, ok: a => P_.some(p => lik(a, p) === c && own(a, p) === x), link: 1 }); mk.push({ t: `The person who owns the ${x} does not like ${c}`, ok: a => P_.every(p => !(own(a, p) === x && lik(a, p) === c)), link: 1 }); }));
  const all = []; perms(PETS).forEach(pp_ => perms(COL).forEach(cc => all.push({ pet: pp_, col: cc })));
  const good = R_.shuffle(mk.filter(c => c.ok(target) && !(c.w && R_.f() < 0.55)));
  let pool = all, chosen = [];
  for (const c of good) { if (pool.length === 1) break; const np = pool.filter(a => c.ok(a)); if (np.length < pool.length) { chosen.push(c); pool = np; } }
  if (pool.length !== 1) throw new Error('logic grid not unique');
  for (let i = chosen.length - 1; i >= 0; i--) { const t = chosen.filter((_, j) => j !== i); if (all.filter(a => t.every(c => c.ok(a))).length === 1) chosen = t; }
  let s = ''; const x0 = 78, cw = 50;
  [...PETS, ...COL].forEach((h, i) => { s += T(x0 + i * cw + (i >= 4 ? 16 : 0) + cw / 2 - 1, 26, h, { s: 11, b: 1 }); });
  P_.forEach((p, r) => { s += T(70, 54 + r * 32, p, { a: 'end', s: 12, b: 1 }); for (let c = 0; c < 8; c++) s += R(x0 + c * cw + (c >= 4 ? 16 : 0), 36 + r * 32, cw - 2, 28, 'paper sline', "stroke-width='1'"); });
  const set = dir('Four friends each own a different pet and each like a different colour. Use the clues to fill in the grid in your mind (cross out impossible cells).') + L.fig(520, 172, s, 'Blank logic grid of friends, pets and colours') +
    pp(chosen.map((c, i) => `${i + 1}. ${c.t[0].toUpperCase()}${c.t.slice(1)}.`).join('<br>'));
  const direct = p => chosen.some(c => c.t === `${p} owns the ${own(target, p)}` || c.t === `${p} likes ${lik(target, p)}`);
  const w = P_.find(p => !direct(p)) || P_[3];
  addZ(set, 'Grid Based Puzzles', 'Logic grid', `Which pet does <b>${w}</b> own and which colour does ${w} like?`, `${own(target, w)}, ${lik(target, w)}`,
    [`${own(target, w)}, ${COL.find(c => c !== lik(target, w))}`, `${PETS.find(x => x !== own(target, w))}, ${lik(target, w)}`, `${PETS.filter(x => x !== own(target, w))[1]}, ${COL.filter(c => c !== lik(target, w))[1]}`],
    `Solution: ${P_.map(p => `${p} - ${own(target, p)}, ${lik(target, p)}`).join('; ')}.`);
}

module.exports = L.bank;
