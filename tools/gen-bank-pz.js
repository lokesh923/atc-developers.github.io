// Practice bank - Pseudocode and Numerical Puzzles. Pseudocode answers come from running equivalent JS; puzzles are solver-checked.
const L = require('./lib');
const { RNG, perms, opts } = require('./rng');
const { mcq, dir, pp, T, R, C, P, esc } = L;
L.setId(8000);
let slot = 2;
const nextPos = () => (slot = (slot * 5 + 1) % 4);
const addP = (set, topic, sub, q, correct, wrongs, exp) => { const o = opts(correct, wrongs, nextPos(), k => String(correct) + k); return mcq('P', topic, q, o.opts, o.ans, exp, { set, sub, tough: true }); };
const addZ = (set, topic, sub, q, correct, wrongs, exp, fill) => { const o = opts(correct, wrongs, nextPos(), fill || (k => String(correct) + k)); return mcq('Z', topic, q, o.opts, o.ans, exp, { set, sub, tough: true }); };
const code = lines => `<pre>${esc(lines.join('\n'))}</pre>`;
const arrFig = (a, label, hi = []) => { const w = a.length * 46 + 16; let s = ''; a.forEach((v, i) => { s += R(8 + i * 46, 8, 44, 34, hi.includes(i) ? 'soft sline' : 'paper sline') + T(30 + i * 46, 31, v, { b: 1, s: 15 }) + T(30 + i * 46, 58, i, { s: 11, c: 'muted' }); }); s += T(w / 2, 76, label, { s: 11 }); return L.fig(w, 82, s, label); };
const A_ = a => '[' + a.join(', ') + ']';

// ---------------- Pseudocode ----------------
function sortSet(seed) {
  const r = RNG(seed), n = r.pick([5, 6]), a = r.shuffle([...Array(12).keys()].map(i => i + 2)).slice(0, n), kind = ['bubble', 'selection', 'insertion'][seed % 3], passes = r.int(1, 2);
  const b = a.slice(); const snaps = [];
  if (kind === 'bubble') for (let p = 1; p <= 3; p++) { for (let j = 0; j < n - 1; j++) if (b[j] > b[j + 1]) [b[j], b[j + 1]] = [b[j + 1], b[j]]; snaps.push(b.slice()); }
  if (kind === 'selection') for (let p = 0; p < 3; p++) { let m = p; for (let j = p + 1; j < n; j++) if (b[j] < b[m]) m = j; [b[p], b[m]] = [b[m], b[p]]; snaps.push(b.slice()); }
  if (kind === 'insertion') for (let i = 1; i <= 3; i++) { const key = b[i]; let j = i - 1; while (j >= 0 && b[j] > key) { b[j + 1] = b[j]; j--; } b[j + 1] = key; snaps.push(b.slice()); }
  const lines = kind === 'bubble' ? [`for pass = 1 to ${passes}`, `    for j = 0 to n - 2`, '        if a[j] > a[j + 1] then swap(a[j], a[j + 1])', '    end-for', 'end-for'] : kind === 'selection' ? [`for p = 0 to ${passes - 1}`, '    m = p', '    for j = p + 1 to n - 1', '        if a[j] < a[m] then m = j', '    end-for', '    swap(a[p], a[m])', 'end-for'] : [`for i = 1 to ${passes}`, '    key = a[i]; j = i - 1', '    while j >= 0 and a[j] > key', '        a[j + 1] = a[j]; j = j - 1', '    end-while', '    a[j + 1] = key', 'end-for'];
  const res = snaps[passes - 1];
  const set = pp(`The array a has n = ${n} elements. Study the array and the ${kind} sort code.`) + arrFig(a, 'Array a before the loops') + code(lines);
  const alt = [snaps[passes % 3] || snaps[0], a, snaps[Math.min(2, passes)]];
  addP(set, 'Basic Algorithms', kind + ' sort', `What is the array after the code runs?`, A_(res), [A_(snaps[passes] || snaps[2]), A_(passes === 1 ? snaps[0].slice().reverse() : snaps[1].slice().reverse()), A_(a.slice().sort((x, y) => x - y))],
    `${kind === 'bubble' ? 'Each pass swaps neighbours and carries the largest remaining value to the end' : kind === 'selection' ? 'Each pass finds the minimum of the unsorted part and swaps it to position p' : 'Each step inserts the next element into the sorted left part'}. After ${passes} ${passes > 1 ? 'passes' : 'pass'}: ${A_(res)}. (Earlier stages: ${snaps.slice(0, passes - 1).map(A_).join(' then ') || 'start ' + A_(a)}.)`);
}
function bsearchSet(seed) {
  const r = RNG(seed), n = r.pick([9, 10, 11, 12]), a = [...new Set(Array.from({ length: n + 4 }, () => r.int(1, 60)))].sort((x, y) => x - y).slice(0, n), key = a[r.int(0, n - 1)];
  let lo = 0, hi = a.length - 1, cmp = 0; const trace = [];
  while (lo <= hi) { const mid = Math.floor((lo + hi) / 2); cmp++; trace.push(`low=${lo}, high=${hi}, mid=${mid} (a[mid]=${a[mid]})`); if (a[mid] === key) break; if (a[mid] < key) lo = mid + 1; else hi = mid - 1; }
  const set = pp(`Binary search looks for ${key} in the sorted array below. mid = (low + high) / 2 using integer division, and one comparison is counted each time a[mid] is compared with the key.`) + arrFig(a, `Sorted array (n = ${a.length})`);
  addP(set, 'Basic Algorithms', 'Binary search', `How many comparisons are made to find ${key}?`, String(cmp), [String(cmp + 1), String(Math.max(1, cmp - 1)), String(cmp + 2), String(a.indexOf(key) + 1)].filter(x => x !== String(cmp)),
    `Trace: ${trace.join('; ')}. The key is found after ${cmp} comparison${cmp > 1 ? 's' : ''}. (Linear search would need ${a.indexOf(key) + 1}.)`);
}
function loopSet(seed) {
  const r = RNG(seed), kind = seed % 4;
  if (kind === 0) { const a = r.int(1, 3), b = r.int(12, 24), st = r.pick([2, 3, 4]), sk = r.int(2, 4); let s = 0, c = 0; for (let i = a; i <= b; i += st) { if (i % sk === 0) continue; s += i; c++; }
    const set = dir('Study the code.') + code([`Set Integer s = 0`, `for i = ${a} to ${b} step ${st}`, `    if i % ${sk} == 0 then continue`, '    s = s + i', 'end-for', 'display s']);
    addP(set, 'Loop Tracing (FOR / WHILE)', 'continue', 'What is displayed?', String(s), [String(s + st), String(s - st), String(s + sk)], `i takes ${Array.from({ length: Math.floor((b - a) / st) + 1 }, (_, k) => a + k * st).join(', ')}. Values divisible by ${sk} are skipped by continue. The rest add up to ${s}.`); }
  if (kind === 1) { const n = r.int(4, 6), m = r.int(3, 5); let c = 0; for (let i = 1; i <= n; i++) for (let j = i; j <= m + 1; j++) c++;
    const set = dir('Study the code.') + code(['Set Integer count = 0', `for i = 1 to ${n}`, `    for j = i to ${m + 1}`, '        count = count + 1', '    end-for', 'end-for', 'display count']);
    addP(set, 'Loop Tracing (FOR / WHILE)', 'Nested loops', 'What is displayed?', String(c), [String(n * (m + 1)), String(c + n), String(c - 1)], `For each i the inner loop runs (${m + 1} &minus; i + 1) times when i &le; ${m + 1}, and not at all otherwise: ${Array.from({ length: n }, (_, k) => Math.max(0, m + 1 - (k + 1) + 1)).join(' + ')} = ${c}.`); }
  if (kind === 2) { let x = r.int(40, 90), c = 0; const x0 = x, d = r.int(2, 4); while (x > 5) { if (x % 2 === 0) x = x / 2; else x = x - d; c++; if (c > 200) break; }
    const set = dir('Study the code.') + code([`Set Integer x = ${x0}, c = 0`, 'while x > 5', '    if x % 2 == 0 then', '        x = x / 2', '    else', `        x = x - ${d}`, '    end-if', '    c = c + 1', 'end-while', 'display x, c']);
    addP(set, 'Loop Tracing (FOR / WHILE)', 'while loop', 'What is displayed?', `${x}, ${c}`, [`${x}, ${c + 1}`, `${x + 1}, ${c}`, `${x}, ${c - 1}`], `Trace x from ${x0}: ${(() => { let v = x0, t = [v]; while (v > 5) { v = v % 2 === 0 ? v / 2 : v - d; t.push(v); } return t.join(' &rarr; '); })()}. The loop stops when x &le; 5, after ${c} iterations.`); }
  if (kind === 3) { const st = r.int(2, 5), a = r.int(10, 30); let x = a, c = 0; do { x = x - st; c++; } while (x > 0 && c < 100);
    const set = dir('Study the code.') + code([`Set Integer x = ${a}, c = 0`, 'do', `    x = x - ${st}`, '    c = c + 1', 'while x > 0', 'display x, c']);
    addP(set, 'Loop Tracing (FOR / WHILE)', 'do-while', 'What is displayed?', `${x}, ${c}`, [`${x + st}, ${c - 1}`, `${x}, ${c - 1}`, `${x + st}, ${c}`], `The do-while body always runs first. x goes ${a}, ${Array.from({ length: c }, (_, k) => a - st * (k + 1)).join(', ')}; it stops as soon as x is not positive, after ${c} iterations with x = ${x}.`); }
}
function recSet(seed) {
  const r = RNG(seed), kind = seed % 3; let calls = 0;
  if (kind === 0) { const n = r.int(5, 7); const f = k => { calls++; return k <= 1 ? 1 : f(k - 1) + f(k - 2); }; const v = f(n);
    const set = dir('Study the function.') + code(['function f(Integer n)', '    if n <= 1 then return 1', '    return f(n - 1) + f(n - 2)', 'end-function']);
    addP(set, 'Programming Logic', 'Recursion', `What does f(${n}) return?`, String(v), [String(v - 2), String(v + 3), String(calls)], `f(0) = f(1) = 1, so f(2) = 2, f(3) = 3, f(4) = 5, f(5) = 8, f(6) = 13, f(7) = 21 (a Fibonacci series). f(${n}) = ${v}. (The function makes ${calls} calls in all.)`); }
  if (kind === 1) { const n = r.int(20, 200); const g = k => k === 0 ? 0 : (k % 2) + g(Math.floor(k / 2)); const v = g(n);
    const set = dir('Study the function.') + code(['function g(Integer n)', '    if n == 0 then return 0', '    return n % 2 + g(n / 2)', 'end-function']);
    addP(set, 'Programming Logic', 'Recursion', `What does g(${n}) return?`, String(v), [String(v + 1), String(v - 1), String(Math.floor(Math.log2(n)))], `g counts the 1s in the binary form of n. ${n} = ${n.toString(2)} in binary, which has ${v} ones.`); }
  if (kind === 2) { const a = r.int(20, 90), b = r.int(8, 30); const h = (x, y) => y === 0 ? x : h(y, x % y); const v = h(a, b);
    const set = dir('Study the function.') + code(['function h(Integer a, Integer b)', '    if b == 0 then return a', '    return h(b, a % b)', 'end-function']);
    addP(set, 'Programming Logic', 'Recursion', `What does h(${a}, ${b}) return?`, String(v), [String(v * 2), String(a % b), String(Math.max(1, v - 1))], `h is Euclid's algorithm for the GCD: ${(() => { let x = a, y = b, t = [`(${x}, ${y})`]; while (y) { [x, y] = [y, x % y]; t.push(`(${x}, ${y})`); } return t.join(' &rarr; '); })()}. The result is ${v}.`); }
}
function strSet(seed) {
  const r = RNG(seed), words = ['PLACEMENT', 'ALGORITHM', 'DEVELOPER', 'INFOSYS', 'COMPUTER', 'PROGRAMMER', 'ENGINEER', 'PSEUDOCODE'], w = words[seed % words.length], kind = (seed >> 1) % 3, s = w.split('');
  if (kind === 0) { const k = r.int(2, 3), t = s.slice(); for (let i = 0; i < k; i++) [t[i], t[s.length - 1 - i]] = [t[s.length - 1 - i], t[i]]; const i1 = r.int(0, s.length - 1), i2 = r.int(0, s.length - 1);
    const set = pp('Indexes start at 0.') + arrFig(s, `String s = ${w}`) + code([`Set String s = '${w}'`, `for i = 0 to ${k - 1}`, `    swap(s[i], s[length(s) - 1 - i])`, 'end-for', `display s[${i1}] + s[${i2}]`]);
    addP(set, 'Array & String Manipulation Logic', 'Swaps', 'What is displayed?', t[i1] + t[i2], [s[i1] + s[i2], t[i2] + t[i1], t[Math.min(i1 + 1, s.length - 1)] + t[i2]].filter(x => x !== t[i1] + t[i2]).concat(['XX']), `The loop swaps ${k} pair(s): ${Array.from({ length: k }, (_, i) => `(${i}, ${s.length - 1 - i})`).join(', ')}. The string becomes ${t.join('')}. s[${i1}] = ${t[i1]}, s[${i2}] = ${t[i2]}.`); }
  if (kind === 1) { let c = 0; s.forEach((ch, i) => { if ('AEIOU'.includes(ch) && i % 2 === 0) c++; });
    const set = pp('Indexes start at 0.') + arrFig(s, `String s = ${w}`) + code([`Set String s = '${w}'`, 'Set Integer c = 0', 'for i = 0 to length(s) - 1', "    if s[i] is a vowel and i % 2 == 0 then c = c + 1", 'end-for', 'display c']);
    addP(set, 'Array & String Manipulation Logic', 'Counting', 'What is displayed?', String(c), [String(s.filter(ch => 'AEIOU'.includes(ch)).length + (c === s.filter(ch => 'AEIOU'.includes(ch)).length ? 1 : 0)), String(c + 1), String(Math.max(0, c - 1))], `Vowels at even indexes only: ${s.map((ch, i) => 'AEIOU'.includes(ch) && i % 2 === 0 ? `${ch}(${i})` : null).filter(Boolean).join(', ') || 'none'}. Count = ${c}. (All vowels: ${s.filter(ch => 'AEIOU'.includes(ch)).length}.)`); }
  if (kind === 2) { const k = r.int(1, 3); const t = s.map(ch => String.fromCharCode((ch.charCodeAt(0) - 65 + k) % 26 + 65)).join(''); const i1 = r.int(0, s.length - 1);
    const set = pp('Indexes start at 0 and the codes are A = 65, B = 66, ... Z = 90.') + arrFig(s, `String s = ${w}`) + code([`Set String s = '${w}'`, 'for i = 0 to length(s) - 1', `    s[i] = char((code(s[i]) - 65 + ${k}) % 26 + 65)`, 'end-for', `display s[${i1}] + s[${(i1 + 2) % s.length}]`]);
    addP(set, 'Array & String Manipulation Logic', 'Character codes', 'What is displayed?', t[i1] + t[(i1 + 2) % s.length], [s[i1] + s[(i1 + 2) % s.length], t[(i1 + 2) % s.length] + t[i1], String.fromCharCode(t.charCodeAt(i1) + 1) + t[(i1 + 2) % s.length]], `Every letter moves ${k} place${k > 1 ? 's' : ''} forward (a Caesar shift): ${w} becomes ${t}. s[${i1}] = ${t[i1]} and s[${(i1 + 2) % s.length}] = ${t[(i1 + 2) % s.length]}.`); }
}
function condSet(seed) {
  const r = RNG(seed), kind = seed % 2;
  if (kind === 0) { const n = r.int(1, 4), sw = x => { let v = 0; switch (x) { case 1: v += 1; case 2: v += 2; case 3: v += 3; break; case 4: v += 4; default: v += 10; } return v; };
    const set = dir('Study the code. There is no break after case 1 and case 2.') + code([`Set Integer n = ${n}, x = 0`, 'switch (n)', '    case 1: x = x + 1', '    case 2: x = x + 2', '    case 3: x = x + 3', '            break', '    case 4: x = x + 4', '    default: x = x + 10', 'end-switch', 'display x']);
    addP(set, 'Conditional Statements (IF / ELSE)', 'Switch fall-through', 'What is displayed?', String(sw(n)), [String(sw(n) + 3), String(n), String(sw(n) - 2), '10'], `Execution enters at case ${n} and continues downwards until a break: ${n === 1 ? '1 + 2 + 3 = 6' : n === 2 ? '2 + 3 = 5' : n === 3 ? '3 (then break)' : '4 + 10 = 14 (case 4 has no break, so default also runs)'}.`); }
  if (kind === 1) { const a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9); const res = (a > b ? (a > c ? a : c) : (b > c ? b : c)); let calls = 0; const sc = () => { calls++; return c > 4; };
    const set = dir('Study the code.') + code([`Set Integer a = ${a}, b = ${b}, c = ${c}`, 'Set Integer m = (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c)', 'display m + a % b']);
    addP(set, 'Conditional Statements (IF / ELSE)', 'Ternary', 'What is displayed?', String(res + a % b), [String(res), String(res + b % a), String(Math.max(a, b, c) + a)], `m is the largest of a, b, c = ${res}. The ternary operator is evaluated first, then a % b = ${a % b} is added (% binds tighter than +). Output = ${res} + ${a % b} = ${res + a % b}.`); }
}

// ---------------- Numerical puzzles ----------------
function sudoku(seed, N, BR, BC) {
  const R_ = RNG(seed), digits = Array.from({ length: N }, (_, i) => i + 1);
  const ok = (g, r, c, v) => { for (let i = 0; i < N; i++) if (g[r][i] === v || g[i][c] === v) return false; const r0 = r - r % BR, c0 = c - c % BC; for (let i = 0; i < BR; i++) for (let j = 0; j < BC; j++) if (g[r0 + i][c0 + j] === v) return false; return true; };
  const count = (g, limit) => { let cnt = 0; const go = () => { if (cnt >= limit) return; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!g[r][c]) { for (let v = 1; v <= N; v++) if (ok(g, r, c, v)) { g[r][c] = v; go(); g[r][c] = 0; } return; } cnt++; }; go(); return cnt; };
  const full = Array.from({ length: N }, () => Array(N).fill(0));
  const fill = () => { for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!full[r][c]) { for (const v of R_.shuffle(digits)) if (ok(full, r, c, v)) { full[r][c] = v; if (fill()) return true; full[r][c] = 0; } return false; } return true; }; fill();
  const puz = full.map(r => r.slice()), keep = N === 4 ? 7 : 14;
  for (const k of R_.shuffle([...Array(N * N).keys()])) { const r = Math.floor(k / N), c = k % N, v = puz[r][c]; puz[r][c] = 0; if (count(puz.map(x => x.slice()), 2) !== 1) puz[r][c] = v; if (puz.flat().filter(Boolean).length <= keep) break; }
  const cand = (r, c) => { const used = new Set(); for (let i = 0; i < N; i++) { used.add(puz[r][i]); used.add(puz[i][c]); } const r0 = r - r % BR, c0 = c - c % BC; for (let i = 0; i < BR; i++) for (let j = 0; j < BC; j++) used.add(puz[r0 + i][c0 + j]); return digits.filter(v => !used.has(v)); };
  const empt = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!puz[r][c]) empt.push([r, c]);
  const singles = empt.filter(([r, c]) => cand(r, c).length === 1); if (!singles.length) return sudoku(seed + 1000, N, BR, BC);
  const [tr, tc] = R_.pick(singles), cs = N === 4 ? 46 : 40; let s = '';
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const hi = r === tr && c === tc; s += R(10 + c * cs, 10 + r * cs, cs, cs, hi ? 'soft sline' : 'paper sline', "stroke-width='1'") + T(10 + c * cs + cs / 2, 10 + r * cs + cs * 0.65, hi ? '?' : puz[r][c] || '', { b: 1, s: 17 }); }
  for (let i = 0; i <= N; i += BR) s += L.L(10, 10 + i * cs, 10 + N * cs, 10 + i * cs, 'ln', "stroke-width='3'"); for (let j = 0; j <= N; j += BC) s += L.L(10 + j * cs, 10, 10 + j * cs, 10 + N * cs, 'ln', "stroke-width='3'");
  const set = dir(`Fill the ${N} &times; ${N} grid so that every row, every column and every ${BR} &times; ${BC} box (thick lines) contains each of the digits 1 to ${N} exactly once.`) + L.fig(20 + N * cs, 20 + N * cs, s, `Partly filled ${N} by ${N} Sudoku`);
  const ans = full[tr][tc], rowv = puz[tr].filter(Boolean), colv = puz.map(r => r[tc]).filter(Boolean), r0 = tr - tr % BR, c0 = tc - tc % BC, boxv = []; for (let i = 0; i < BR; i++) for (let j = 0; j < BC; j++) if (puz[r0 + i][c0 + j]) boxv.push(puz[r0 + i][c0 + j]);
  addZ(set, 'Sudoku', `${N} x ${N}`, 'Which digit goes in the cell marked ?', String(ans), digits.map(String).filter(x => x !== String(ans)), `Row ${tr + 1} has ${rowv.join(', ') || 'nothing'}; column ${tc + 1} has ${colv.join(', ') || 'nothing'}; the box has ${boxv.join(', ') || 'nothing'}. Together these use every digit except ${ans}, so the cell is ${ans}.`);
}
function logicGrid(seed, nP) {
  const R_ = RNG(seed), P_ = ['Asha', 'Bina', 'Chetan', 'Dev'].slice(0, nP), PETS = ['cat', 'dog', 'fish', 'parrot'].slice(0, nP), COL = ['red', 'blue', 'green', 'yellow'].slice(0, nP);
  const target = { pet: R_.shuffle(PETS), col: R_.shuffle(COL) }, own = (a, p) => a.pet[P_.indexOf(p)], lik = (a, p) => a.col[P_.indexOf(p)];
  const mk = []; P_.forEach(p => { PETS.forEach(x => { mk.push({ t: `${p} owns the ${x}`, ok: a => own(a, p) === x, w: 1 }); mk.push({ t: `${p} does not own the ${x}`, ok: a => own(a, p) !== x }); }); COL.forEach(c => { mk.push({ t: `${p} likes ${c}`, ok: a => lik(a, p) === c, w: 1 }); mk.push({ t: `${p} does not like ${c}`, ok: a => lik(a, p) !== c }); }); });
  PETS.forEach(x => COL.forEach(c => { mk.push({ t: `The person who likes ${c} owns the ${x}`, ok: a => P_.some(p => lik(a, p) === c && own(a, p) === x) }); mk.push({ t: `The person who owns the ${x} does not like ${c}`, ok: a => P_.every(p => !(own(a, p) === x && lik(a, p) === c)) }); }));
  const all = []; perms(PETS).forEach(pp_ => perms(COL).forEach(cc => all.push({ pet: pp_, col: cc })));
  const good = R_.shuffle(mk.filter(c => c.ok(target) && !(c.w && R_.f() < 0.6)));
  let pool = all, chosen = []; for (const c of good) { if (pool.length === 1) break; const np = pool.filter(a => c.ok(a)); if (np.length < pool.length) { chosen.push(c); pool = np; } }
  if (pool.length !== 1) return logicGrid(seed + 500, nP);
  for (let i = chosen.length - 1; i >= 0; i--) { const t = chosen.filter((_, j) => j !== i); if (all.filter(a => t.every(c => c.ok(a))).length === 1) chosen = t; }
  const x0 = 78, cw = 50; let s = ''; [...PETS, ...COL].forEach((h, i) => { s += T(x0 + i * cw + (i >= nP ? 16 : 0) + cw / 2 - 1, 26, h, { s: 11, b: 1 }); });
  P_.forEach((p, r) => { s += T(70, 54 + r * 32, p, { a: 'end', s: 12, b: 1 }); for (let c = 0; c < 2 * nP; c++) s += R(x0 + c * cw + (c >= nP ? 16 : 0), 36 + r * 32, cw - 2, 28, 'paper sline', "stroke-width='1'"); });
  const set = dir(`${nP === 3 ? 'Three' : 'Four'} friends each own a different pet and each like a different colour. Use the clues (cross out impossible cells in your mind).`) + L.fig(x0 + 2 * nP * cw + 30, 50 + nP * 32, s, 'Blank logic grid') + pp(chosen.map((c, i) => `${i + 1}. ${c.t[0].toUpperCase()}${c.t.slice(1)}.`).join('<br>'));
  const direct = p => chosen.some(c => c.t === `${p} owns the ${own(target, p)}` || c.t === `${p} likes ${lik(target, p)}`);
  const w = P_.find(p => !direct(p)) || P_[P_.length - 1];
  addZ(set, 'Grid Based Puzzles', 'Logic grid', `Which pet does <b>${w}</b> own and which colour does ${w} like?`, `${own(target, w)}, ${lik(target, w)}`, [`${own(target, w)}, ${COL.find(c => c !== lik(target, w))}`, `${PETS.find(x => x !== own(target, w))}, ${lik(target, w)}`, `${PETS.filter(x => x !== own(target, w))[1] || 'rabbit'}, ${COL.filter(c => c !== lik(target, w))[1] || 'white'}`], `Solution: ${P_.map(p => `${p} - ${own(target, p)}, ${lik(target, p)}`).join('; ')}.`);
}
function magicSet(seed) {
  const R_ = RNG(seed), base = [[8, 1, 6], [3, 5, 7], [4, 9, 2]]; let g = base.map(r => r.slice());
  const rot = R_.int(0, 3); for (let i = 0; i < rot; i++) g = g[0].map((_, c) => g.map(r => r[c]).reverse()); if (R_.f() < 0.5) g = g.map(r => r.reverse());
  const mul = R_.pick([1, 2, 3]), add = R_.pick([0, 2, 5, 10]); g = g.map(r => r.map(v => v * mul + add));
  const sum = 15 * mul + 3 * add; const hide = [[R_.int(0, 2), R_.int(0, 2)], [R_.int(0, 2), R_.int(0, 2)]]; if (hide[0][0] === hide[1][0] && hide[0][1] === hide[1][1]) return magicSet(seed + 33);
  const rows = g.map((r, i) => `<tr>${r.map((v, j) => hide.some(h => h[0] === i && h[1] === j) ? `<td>${hide[0][0] === i && hide[0][1] === j ? '?' : '#'}</td>` : `<td>${v}</td>`).join('')}</tr>`).join('');
  const set = dir('The 3 &times; 3 grid is a magic square: every row, column and diagonal has the same total. Two cells are hidden (marked ? and #).') + `<table class='dt grid-num'><tbody>${rows}</tbody></table>`;
  const a = g[hide[0][0]][hide[0][1]], b = g[hide[1][0]][hide[1][1]];
  addZ(set, 'Number Based Patterns', 'Magic square', 'What is the value of ? + # ?', String(a + b), [String(a + b + mul), String(a + b - 2 * mul), String(a * 2), String(a + b + 5)], `The magic total is ${sum} (the centre is ${g[1][1]} and the total = 3 &times; centre). Complete the rows and columns using this total: ? = ${a} and # = ${b}, so ? + # = ${a + b}.`);
}
function gridRuleSet(seed) {
  const R_ = RNG(seed), rules = [['(first &times; second) &minus; third column? no', null]], defs = [['first&sup2; &minus; second', (a, b) => a * a - b], ['first &times; second &minus; 2', (a, b) => a * b - 2], ['(first + second)&sup2; &divide; ... ', null]];
  const ops = [['first &times; second + 1', (a, b) => a * b + 1], ['first&sup2; &minus; second', (a, b) => a * a - b], ['first&sup2; + second&sup2;', (a, b) => a * a + b * b], ['2 &times; first + 3 &times; second', (a, b) => 2 * a + 3 * b], ['(first + second) &times; second', (a, b) => (a + b) * b]];
  const op = R_.pick(ops), rows = Array.from({ length: 3 }, () => [R_.int(2, 8), R_.int(2, 8)]);
  const g = rows.map((r, i) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${i < 2 ? op[1](r[0], r[1]) : '?'}</td></tr>`).join(''), ans = op[1](rows[2][0], rows[2][1]);
  const clash = ops.filter(o => rows.slice(0, 2).every(r => o[1](r[0], r[1]) === op[1](r[0], r[1]))).length;
  if (clash !== 1) return gridRuleSet(seed + 40);
  const set = dir('Find the missing number. The same rule is used in every row.') + `<table class='dt grid-num'><tbody>${g}</tbody></table>`;
  addZ(set, 'Number Based Patterns', 'Grid', 'What replaces the question mark?', String(ans), [String(ans + 3), String(ans - 4), String(rows[2][0] * rows[2][1]), String(ans + 10)], `The rule is ${op[0].replace(/&times;/g, '&times;')}: row 1 gives ${op[1](rows[0][0], rows[0][1])} and row 2 gives ${op[1](rows[1][0], rows[1][1])}. Row 3: ${ans}.`);
}
// cube nets: roll a die over the net to find which labels end up opposite
const NETS = [[[0, 1], [1, 0], [1, 1], [1, 2], [1, 3], [2, 1]], [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [2, 3]], [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3], [0, 3]], [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3], [2, 3]], [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1], [3, 1]], [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [3, 2]]];
function foldNet(cells, labels) {
  // die faces: 0 top,1 bottom,2 north,3 south,4 east,5 west ; opposite pairs (0,1),(2,3),(4,5)
  let die = [0, 1, 2, 3, 4, 5]; const lab = {}; const key = c => c.join(','); const idx = new Map(cells.map((c, i) => [key(c), i]));
  const roll = (d, dr, dc) => { const [t, b, n, s, e, w] = d; if (dr === -1) return [s, n, t, b, e, w]; if (dr === 1) return [n, s, b, t, e, w]; if (dc === 1) return [w, e, n, s, t, b]; return [e, w, n, s, b, t]; };
  const seen = new Set(); const go = (c, d) => { seen.add(key(c)); lab[d[1]] = labels[idx.get(key(c))]; [[-1, 0], [1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => { const nc = [c[0] + dr, c[1] + dc]; if (idx.has(key(nc)) && !seen.has(key(nc))) go(nc, roll(d, dr, dc)); }); };
  go(cells[0], die);
  return [[lab[0], lab[1]], [lab[2], lab[3]], [lab[4], lab[5]]];
}
// self-check of the folding code against the classic cross net, and every net must give 6 distinct faces
{ const p = foldNet(NETS[0], [1, 2, 3, 4, 5, 6]).map(x => x.slice().sort().join('')).sort().join(); if (p !== '16,24,35') throw new Error('foldNet self-check failed: ' + p);
}
const VALID_NETS = NETS.filter(n => { const q = foldNet(n, [1, 2, 3, 4, 5, 6]).flat(); return new Set(q).size === 6 && q.every(v => v !== undefined); });
if (VALID_NETS.length < 3) throw new Error('too few valid nets');
function netSet(seed) {
  const R_ = RNG(seed), cells = VALID_NETS[seed % VALID_NETS.length], labels = R_.shuffle([1, 2, 3, 4, 5, 6]), pairs = foldNet(cells, labels);
  const cs = 44, rs = cells.map(c => c[0]), cc = cells.map(c => c[1]), minr = Math.min(...rs), minc = Math.min(...cc); let s = '';
  cells.forEach((c, i) => { s += R(10 + (c[1] - minc) * cs, 10 + (c[0] - minr) * cs, cs, cs, 'paper sline') + T(10 + (c[1] - minc) * cs + cs / 2, 10 + (c[0] - minr) * cs + cs * 0.65, labels[i], { b: 1, s: 17 }); });
  const set = dir('The net below is folded to form a cube. Each face carries one of the numbers 1 to 6.') + L.fig(20 + (Math.max(...cc) - minc + 1) * cs, 20 + (Math.max(...rs) - minr + 1) * cs, s, 'Cube net');
  const q = R_.pick(labels), opp = pairs.find(p => p.includes(q)).find(x => x !== q);
  const pairsTxt = pairs.map(p => p.slice().sort((a, b) => a - b).join(' and ')).join('; ');
  addZ(set, 'Visual Reasoning', 'Cube net', `Which number is on the face opposite to ${q} when the cube is formed?`, String(opp), labels.filter(x => x !== q && x !== opp).map(String), `Fold the net: the pairs of opposite faces are ${pairsTxt}. So ${opp} is opposite ${q}. (Faces that touch along an edge of the net are always adjacent on the cube; faces with exactly one square between them in a straight strip are opposite.)`);
}
// visual series with SVG options
function shapeSvg(kind, rot, filled, dots) {
  const size = 56, c = size / 2; let body = '';
  if (kind === 'tri') body = `<polygon points='${c},6 ${size - 8},${size - 10} 8,${size - 10}' class='${filled ? 'a' : 'paper'} sline'/><circle cx='${c}' cy='13' r='3.5' class='mk'/>`;
  if (kind === 'arrow') body = `<polygon points='${c},4 ${c + 12},22 ${c + 5},22 ${c + 5},${size - 6} ${c - 5},${size - 6} ${c - 5},22 ${c - 12},22' class='${filled ? 'a' : 'paper'} sline'/>`;
  if (kind === 'dots') { for (let i = 0; i < dots; i++) { const cx = 14 + (i % 3) * 14, cy = 16 + Math.floor(i / 3) * 16; body += `<circle cx='${cx}' cy='${cy}' r='5' class='${filled ? 'a' : 'paper'} sline'/>`; } }
  return `<svg viewBox='0 0 ${size} ${size}' width='${size}' role='img' aria-label='figure' xmlns='http://www.w3.org/2000/svg'><g transform='rotate(${rot} ${c} ${c})'>${body}</g></svg>`;
}
function visualSet(seed) {
  const R_ = RNG(seed), kind = ['tri', 'arrow', 'dots'][seed % 3], step = kind === 'dots' ? 0 : R_.pick([90, 45, 135]), alt = R_.f() < 0.6, n = 4;
  const fig = k => ({ rot: (k * step) % 360, filled: alt ? k % 2 === 0 : true, dots: 1 + k });
  const html = f => shapeSvg(kind, f.rot, f.filled, f.dots);
  const next = fig(n), seq = Array.from({ length: n }, (_, k) => `<span class='shp'>${html(fig(k))}</span>`).join('') + `<span class='shp qm'>?</span>`;
  const cands = [next, { ...next, rot: (next.rot + (kind === 'dots' ? 0 : step)) % 360 }, { ...next, filled: !next.filled }, { ...next, rot: (next.rot + 180) % 360, filled: !next.filled }, { ...next, dots: next.dots + 1 }, { ...next, dots: next.dots - 1 }];
  const uniq = []; cands.forEach(c => { if (!uniq.some(u => html(u) === html(c))) uniq.push(c); });
  if (uniq.length < 4) return visualSet(seed + 60);
  const opts4 = uniq.slice(0, 4), order = R_.shuffle(opts4), ans = order.findIndex(c => html(c) === html(next));
  const rule = kind === 'dots' ? 'The number of dots increases by 1 each step' + (alt ? ' and the shading alternates between filled and empty' : '') : `The figure turns ${step} degrees clockwise each step${alt ? ' and the shading alternates between filled and empty' : ''}`;
  mcq('Z', 'Visual Reasoning', 'Which figure comes in place of the question mark?', order.map(html), ans, `${rule}. The 5th figure therefore has ${kind === 'dots' ? next.dots + ' dots' : 'a turn of ' + next.rot + ' degrees'}${alt ? ' and is ' + (next.filled ? 'filled' : 'empty') : ''}.`, { set: dir(`Study how the figure changes from one box to the next.`) + `<div class='figrow shprow'>${seq}</div>`, sub: 'Figure series', tough: true });
}
function wordSet(seed) {
  const R_ = RNG(seed), words = ['PLANET', 'DOCTOR', 'HEART', 'CIRCUIT', 'NETWORK', 'ENGINE', 'MARKET', 'SYSTEM', 'FRIEND', 'WINDOW', 'JUNGLE', 'BRIGHT'], w = words[seed % words.length], sorted = w.split('').sort().join(''), k = R_.int(1, w.length);
  const ans = sorted[k - 1], sh = R_.shuffle(w.split('')).join('');
  addZ(pp(`The letters of the word <b>${w}</b> are arranged in alphabetical order.`), 'Word Puzzles', 'Alphabetical order', `Which letter is in position ${k} from the left?`, ans, [...new Set(w.split(''))].filter(x => x !== ans).slice(0, 4), `Alphabetical order: ${sorted.split('').join(', ')}. The ${k}${['st', 'nd', 'rd'][k - 1] || 'th'} letter is ${ans}.`);
}

[1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(sortSet);
[11, 12, 13, 14].forEach(bsearchSet);
[21, 22, 23, 24, 25, 26, 27, 28].forEach(loopSet);
[31, 32, 33, 34, 35, 36].forEach(recSet);
[41, 42, 43, 44, 45, 46].forEach(strSet);
[51, 52, 53, 54].forEach(condSet);
[1, 2, 3].forEach(s => sudoku(s, 4, 2, 2)); [4, 5, 6].forEach(s => sudoku(s, 6, 2, 3));
[1, 2].forEach(s => logicGrid(s + 10, 3)); [3, 4].forEach(s => logicGrid(s + 10, 4));
[1, 2, 3, 4].forEach(s => magicSet(s + 20));
[1, 2, 3, 4, 5].forEach(s => gridRuleSet(s + 30));
[0, 1, 2, 3, 4, 5].forEach(s => netSet(s + 6));
[1, 2, 3, 4, 5, 6].forEach(visualSet);
[1, 2, 3, 4].forEach(wordSet);

module.exports = L.bank;
