// Master Mock 4 - Technical (mathematical) ability: 10 figure-based questions, answers computed in code.
const L = require('./lib');
const { opts } = require('./rng');
const { mcq, dir, pp, T, R, C, P } = L;
const MM = { mm: 'M4', tough: true };
let slot = 2;
const nextPos = () => (slot = (slot * 3 + 1) % 4);
const f2 = n => String(+n.toFixed(2));
const add = (set, topic, sub, q, correct, wrongs, exp, fill) => { const o = opts(correct, wrongs, nextPos(), fill); return mcq('T', topic, q, o.opts, o.ans, exp, { set, sub, ...MM }); };
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const frac = (n, d) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };

// ---------- 1. number pyramid ----------
function pyramid(rows, hidden = null, title = 'Number pyramid') {            // rows[0] = top
  const cw = 54, ch = 32, w = rows[rows.length - 1].length * cw + 20, h = rows.length * ch + 16;
  let s = '';
  rows.forEach((r, i) => { const off = (w - r.length * cw) / 2; r.forEach((v, j) => { const x = off + j * cw, y = 8 + i * ch; s += R(x + 1, y, cw - 2, ch - 2, 'paper sline') + T(x + cw / 2, y + 21, hidden && hidden[0] === i && hidden[1] === j ? '?' : v, { b: 1, s: 15 }); }); });
  return { w, h, inner: s };
}
{
  const build = (bottom, rule) => { const rows = [bottom]; while (rows[0].length > 1) { const r = rows[0]; rows.unshift(r.slice(1).map((v, i) => rule(r[i], v))); } return rows; };
  const rule = (a, b) => a + b - 1;
  const full = build([2, 5, 3, 4], rule), q = build([4, 7, 3, 6], rule);
  const p1 = pyramid(full), p2 = pyramid(q, [0, 0]);
  const fig = L.fig(p1.w + p2.w + 70, Math.max(p1.h, p2.h) + 30, `<g>${p1.inner}</g><g transform='translate(${p1.w + 50},0)'>${p2.inner}</g>` + T(p1.w / 2, p1.h + 22, 'Pyramid 1 (complete)', { s: 12, b: 1 }) + T(p1.w + 50 + p2.w / 2, p2.h + 22, 'Pyramid 2', { s: 12, b: 1 }), 'Two number pyramids');
  const top = q[0][0];
  add(dir('Pyramid 1 is built with a fixed rule from its bottom row upwards. Pyramid 2 is built with the <b>same</b> rule.') + fig, 'Number Series', 'Number pyramid', 'What number replaces the question mark at the top of Pyramid 2?', String(top), [String(top + 2), String(top - 3), String(top + 5), '36'],
    `In Pyramid 1 each cell is the sum of the two cells below it minus 1 (2 + 5 &minus; 1 = 6, 5 + 3 &minus; 1 = 7, 3 + 4 &minus; 1 = 6; 6 + 7 &minus; 1 = 12; 12 + 12 &minus; 1 = 23). In Pyramid 2: row 3 = ${q[2].join(', ')}, row 2 = ${q[1].join(', ')}, top = ${top}.`);
}

// ---------- 2. mixture vessels ----------
{
  const set = dir('Two vessels contain milk and water as shown (quantities in litres).') + L.barChart({ cats: ['Vessel A', 'Vessel B'], series: [[24, 10], [16, 40]], max: 60, step: 10, names: ['Milk', 'Water'], stacked: true, ylabel: 'Litres', w: 360, h: 260, title: 'Contents of two vessels' });
  const fromA = 10, fromB = 20, mA = 24 / 40, mB = 10 / 50;
  const milk = fromA * mA + fromB * mB, water = fromA + fromB - milk;
  const g = gcd(Math.round(milk), Math.round(water));
  add(set, 'Ratios and Proportions', 'Mixtures', '10 litres are taken from Vessel A and 20 litres from Vessel B and mixed in an empty vessel. What is the ratio of milk to water in the mixture?', `${Math.round(milk) / g} : ${Math.round(water) / g}`, ['17 : 28', '2 : 3', '3 : 5', '1 : 1'],
    `Vessel A is 24 : 16 = 3 : 2 milk, so 10 L holds 6 L milk and 4 L water. Vessel B is 10 : 40 = 1 : 4, so 20 L holds 4 L milk and 16 L water. Mixture: milk = 10 L, water = 20 L, ratio 1 : 2. (17 : 28 is the ratio when the <i>whole</i> contents are mixed.)`);
}

// ---------- 3. grid paths ----------
{
  const W = 4, H = 3, blockedH = [[1, 1]], blockedV = [[3, 1]]; // horizontal edge from (x,y) to (x+1,y); vertical edge from (x,y) to (x,y+1)
  const dp = Array.from({ length: W + 1 }, () => Array(H + 1).fill(0)); dp[0][0] = 1;
  for (let y = 0; y <= H; y++) for (let x = 0; x <= W; x++) { if (!x && !y) continue; let v = 0;
    if (x > 0 && !blockedH.some(b => b[0] === x - 1 && b[1] === y)) v += dp[x - 1][y];
    if (y > 0 && !blockedV.some(b => b[0] === x && b[1] === y - 1)) v += dp[x][y - 1]; dp[x][y] = v; }
  const total = dp[W][H];
  const gx = x => 40 + x * 62, gy = y => 190 - y * 52;
  let s = '';
  for (let y = 0; y <= H; y++) for (let x = 0; x <= W; x++) { if (x < W) s += L.L(gx(x), gy(y), gx(x + 1), gy(y), blockedH.some(b => b[0] === x && b[1] === y) ? 'ln sd' : 'ln'); if (y < H) s += L.L(gx(x), gy(y), gx(x), gy(y + 1), blockedV.some(b => b[0] === x && b[1] === y) ? 'ln sd' : 'ln'); }
  blockedH.forEach(b => s += T(gx(b[0]) + 31, gy(b[1]) - 6, '&#10005;', { c: 'mk', b: 1, s: 14 })); blockedV.forEach(b => s += T(gx(b[0]) + 9, gy(b[1]) - 22, '&#10005;', { c: 'mk', b: 1, s: 14 }));
  for (let y = 0; y <= H; y++) for (let x = 0; x <= W; x++) s += C(gx(x), gy(y), 3.5, 'mk');
  s += T(gx(0) - 14, gy(0) + 16, 'A', { b: 1, s: 14 }) + T(gx(W) + 14, gy(H) - 8, 'B', { b: 1, s: 14 });
  const set = dir('The grid shows the roads of a colony. The two roads marked with a cross (red) are closed for repairs.') + L.fig(330, 232, s, 'Road grid from A to B with two closed roads');
  const full = [1, 1, 1, 1].length && (function () { let n = 1, d = 1; for (let i = 1; i <= W + H; i++) n *= i; for (let i = 1; i <= W; i++) d *= i; for (let i = 1; i <= H; i++) d *= i; return n / d; })();
  add(set, 'Permutation, Combination and Probability', 'Grid paths', 'Moving only to the right or upwards along open roads, in how many different ways can a person go from A to B?', String(total), [String(full), String(total + 4), String(total - 5), String(total + 9)],
    `With no closures there would be C(7,3) = ${full} routes. Counting routes to every junction (adding the counts from the left and from below, skipping closed roads) gives ${total} routes to B.`);
}

// ---------- 4. two spinners ----------
{
  const wheel = (vals, label) => { const n = vals.length, cx = 70, cy = 70, r = 56; let s = ''; vals.forEach((v, i) => { const a1 = -Math.PI / 2 + i * 2 * Math.PI / n, a2 = a1 + 2 * Math.PI / n, m = (a1 + a2) / 2;
      s += `<path d='M${cx},${cy} L${L.r1(cx + r * Math.cos(a1))},${L.r1(cy + r * Math.sin(a1))} A${r},${r} 0 0 1 ${L.r1(cx + r * Math.cos(a2))},${L.r1(cy + r * Math.sin(a2))} Z' class='${L.SER[i % 5]} wedge' style='fill-opacity:.35'/>` + T(cx + 36 * Math.cos(m), cy + 36 * Math.sin(m) + 5, v, { b: 1, s: 15 }); });
    s += `<path d='M${cx - 6},4 L${cx + 6},4 L${cx},16 Z' class='mk'/>` + T(cx, 148, label, { b: 1, s: 12 }); return s; };
  const A_ = [1, 2, 3, 4], B_ = [2, 3, 5, 6, 8];
  const fig = L.fig(330, 156, `<g>${wheel(A_, 'Spinner X')}</g><g transform='translate(170,0)'>${wheel(B_, 'Spinner Y')}</g>`, 'Two spinners');
  let fav = 0; A_.forEach(a => B_.forEach(b => { if ((a + b) % 3 === 0) fav++; }));
  const tot = A_.length * B_.length;
  add(dir('Each spinner is divided into equal sectors and stops on one sector at random. Both are spun once.') + fig, 'Permutation, Combination and Probability', 'Probability', 'What is the probability that the sum of the two numbers is a multiple of 3?', frac(fav, tot), [frac(fav + 1, tot), frac(fav - 1, tot), frac(tot - fav, tot), '1/3'],
    `Total outcomes = 4 &times; 5 = ${tot}. Pairs with sum 3, 6, 9: ${A_.flatMap(a => B_.filter(b => (a + b) % 3 === 0).map(b => `(${a},${b})`)).join(', ')} = ${fav} pairs. Probability = ${frac(fav, tot)}.`);
}

// ---------- 5. distance-time graph ----------
{
  const px = t => 50 + t * 52, py = d => 230 - d * 1.7;
  let s = '';
  for (let t = 0; t <= 6; t++) s += L.L(px(t), 230, px(t), 26, 'grd') + T(px(t), 246, t, { s: 11 });
  for (let d = 0; d <= 120; d += 20) s += L.L(50, py(d), 362, py(d), 'grd') + T(44, py(d) + 4, d, { a: 'end', s: 11 });
  s += L.L(50, 230, 362, 230, 'sline') + L.L(50, 230, 50, 26, 'sline') + T(206, 262, 'Time since 6:00 a.m. (hours)', { s: 11, b: 1 }) + T(12, 128, 'Distance from X (km)', { s: 11, b: 1, rot: -90 });
  s += `<line x1='${px(0)}' y1='${py(0)}' x2='${px(6)}' y2='${py(120)}' stroke-width='2.5' style='stroke:var(--accent)'/><line x1='${px(1)}' y1='${py(120)}' x2='${px(5)}' y2='${py(0)}' stroke-width='2.5' style='stroke:var(--signal)'/>`;
  [[0, 0, 'P leaves X'], [6, 120, 'P reaches Y']].forEach(([t, d, l]) => s += C(px(t), py(d), 4, 'a') + T(px(t) + (t ? 0 : 8), py(d) + (t ? -9 : -9), l, { a: t ? 'end' : 'start', s: 11 }));
  [[1, 120, 'Q leaves Y'], [5, 0, 'Q reaches X']].forEach(([t, d, l]) => s += C(px(t), py(d), 4, 'b') + T(px(t) + (d ? 8 : 6), py(d) + (d ? -8 : -10), l, { a: 'start', s: 11 }));
  const set = dir('Two cyclists P (blue line) and Q (orange line) travel on the same road between towns X and Y. The graph shows their journeys.') + L.fig(420, 272, s, 'Distance-time graph of two cyclists');
  // P: d = 20 t ; Q: d = 120 - 30 (t - 1)
  const t = (120 + 30) / 50, d = 20 * t;
  add(set, 'Time, Speed and Distance', 'Graph', 'At what distance from X do the two cyclists meet?', `${d} km`, [`${f2(120 / 50 * 20)} km`, '72 km', '75 km', '54 km'],
    `P covers 120 km in 6 h, so his speed is 20 km/h (d = 20t). Q covers 120 km in 4 h (leaving at t = 1, reaching at t = 5), so her speed is 30 km/h and d = 120 &minus; 30(t &minus; 1). Equating: 20t = 150 &minus; 30t, so t = 3 h and d = 60 km. (48 km wrongly assumes both start together.)`);
}

// ---------- 6. cryptarithmetic ----------
{
  const letters = ['E', 'A', 'T', 'H', 'P', 'L'], sols = [];
  const rec = (i, used, m) => { if (i === letters.length) { const v = w => +w.split('').map(c => m[c]).join(''); if (m.E && m.T && m.A && v('EAT') + v('THAT') === v('APPLE')) sols.push({ ...m }); return; }
    for (let d = 0; d < 10; d++) if (!used.has(d)) { used.add(d); m[letters[i]] = d; rec(i + 1, used, m); used.delete(d); } };
  rec(0, new Set(), {});
  if (sols.length !== 1) throw new Error('cryptarithm solutions: ' + sols.length);
  const m = sols[0];
  const row = (txt, y, op) => txt.padStart(5).split('').map((ch, i) => (ch.trim() ? R(60 + i * 36, y, 32, 32, 'paper sline') + T(76 + i * 36, y + 22, ch, { b: 1, s: 17 }) : '')).join('') + (op ? T(34, y + 23, op, { s: 20, b: 1 }) : '');
  const fig = L.fig(280, 170, row('EAT', 6) + row('THAT', 44, '+') + L.L(30, 84, 260, 84, 'ln') + row('APPLE', 92) , 'Cryptarithm EAT + THAT = APPLE');
  add(dir('In the addition below every letter stands for a different digit (the same letter always stands for the same digit).') + fig, 'Cryptarithmetic', 'Word sum', 'What is the value of P + L + H?', String(m.P + m.L + m.H), [String(m.P + m.L + m.H + 1), String(m.P + m.L + m.H - 2), String(m.P + m.L + m.H + 3), String(m.P + m.L)],
    `Solving column by column (A = 1 and the leading carry, then the units column) gives ${Object.entries(m).map(([k, v]) => `${k}=${v}`).join(', ')}. Check: ${m.E}${m.A}${m.T} + ${m.T}${m.H}${m.A}${m.T} = ${+[m.E, m.A, m.T].join('') + +[m.T, m.H, m.A, m.T].join('')} = APPLE. So P + L + H = ${m.P} + ${m.L} + ${m.H} = ${m.P + m.L + m.H}.`);
}

// ---------- 7. profit and loss chart ----------
{
  const items = ['P', 'Q', 'R', 'S', 'T'], cp = [200, 150, 320, 180, 250], sp = [240, 135, 400, 207, 275];
  const set = dir('The chart shows the cost price and selling price (in Rs. hundreds) of five articles.') + L.barChart({ cats: items, series: [cp, sp], max: 450, step: 50, names: ['Cost price', 'Selling price'], ylabel: 'Rs. hundreds', w: 460, h: 280, title: 'Cost and selling prices' });
  const tcp = cp.reduce((a, b) => a + b), tsp = sp.reduce((a, b) => a + b), pct = (tsp - tcp) / tcp * 100;
  const pc = sp.map((s, i) => (s - cp[i]) / cp[i] * 100);
  add(set, 'Profit and Loss', 'Bar chart', 'What is the overall profit percentage when all five articles are sold?', f2(pct) + '%', [f2((pc[0] + pc[1] + pc[2] + pc[3] + pc[4]) / 5) + '%', '14.50%', '12.00%', '15.20%'],
    `Total CP = ${tcp}, total SP = ${tsp}. Profit = ${tsp - tcp}. Profit % = ${tsp - tcp}/${tcp} &times; 100 = ${f2(pct)}%. (Averaging the five individual percentages, ${f2(pc.reduce((a, b) => a + b) / 5)}%, is wrong because the cost prices differ.)`);
}

// ---------- 8. partnership timeline ----------
{
  const rows = [['A', 40, 0, 12], ['B', 60, 3, 12], ['C', 30, 0, 8]]; // name, capital (thousand), from month, to month
  const x = m => 130 + m * 24;
  let s = ''; for (let m = 0; m <= 12; m += 2) s += L.L(x(m), 18, x(m), 160, 'grd') + T(x(m), 176, m, { s: 11 });
  rows.forEach((r, i) => { const y = 28 + i * 40; s += T(120, y + 17, `${r[0]}: Rs ${r[1]},000`, { a: 'end', s: 12, b: 1 }) + R(x(r[2]), y, (r[3] - r[2]) * 24, 26, ['a', 'b', 'c'][i], "fill-opacity='.75'") + T(x((r[2] + r[3]) / 2), y + 17, `${r[3] - r[2]} months`, { s: 11, c: 'onfill' }); });
  s += T(x(6), 194, 'Months from the start of the year', { s: 11, b: 1 });
  const set = dir('A, B and C run a business for a year. The chart shows the capital each partner invested and the months for which it stayed in the business.') + L.fig(440, 204, s, 'Partnership timeline');
  const sh = rows.map(r => r[1] * (r[3] - r[2])), tot = sh.reduce((a, b) => a + b), profit = 126000;
  add(set, 'Partnerships', 'Timeline', `The profit at the end of the year is Rs ${profit.toLocaleString('en-IN')}. What is C's share?`, `Rs ${(profit * sh[2] / tot).toLocaleString('en-IN')}`, ['Rs 28,000', 'Rs 21,000', 'Rs 36,000', `Rs ${(profit * 30 / 130).toLocaleString('en-IN')}`],
    `Capital &times; time: A = 40 &times; 12 = ${sh[0]}, B = 60 &times; 9 = ${sh[1]}, C = 30 &times; 8 = ${sh[2]}. Ratio = ${sh[0] / 60} : ${sh[1] / 60} : ${sh[2] / 60} = 8 : 9 : 4 (total 21 parts of 6,000). C = ${profit} &times; 4/21 = Rs ${(profit * sh[2] / tot).toLocaleString('en-IN')}.`);
}

// ---------- 9. averages ----------
{
  const runs = [42, 58, 35, 71, 48, 66, 39, 61];
  const set = dir('The bar chart shows the runs scored by a batsman in his last 8 innings.') + L.barChart({ cats: runs.map((_, i) => 'Inn ' + (i + 1)), series: [runs], max: 80, step: 20, w: 460, h: 260, ylabel: 'Runs', title: 'Runs in 8 innings' });
  const avg = runs.reduce((a, b) => a + b) / 8, need = 9 * 55 - runs.reduce((a, b) => a + b);
  add(set, 'Averages', 'Bar chart', 'How many runs must he score in the 9th innings so that his average for 9 innings becomes exactly 55?', String(need), [String(need - 6), String(need + 7), '55', String(need + 14)],
    `Sum of 8 innings = ${runs.reduce((a, b) => a + b)} (average ${avg}). Required total for 9 innings = 9 &times; 55 = 495. Runs needed = 495 &minus; ${runs.reduce((a, b) => a + b)} = ${need}.`);
}

// ---------- 10. algebra with a figure ----------
{
  const x = 12, w = x + 6, h = x + 2;
  const fig = L.fig(350, 170, R(40, 20, 210, 110, 'soft sline') + T(145, 78, 'Area = 252 sq m', { b: 1, s: 14 }) + T(145, 14, '(x + 6) m', { s: 13, b: 1 }) + T(262, 80, '(x + 2)', { a: 'start', s: 13, b: 1 }) + T(262, 96, 'm', { a: 'start', s: 13, b: 1 }), 'Rectangular plot with sides (x + 6) and (x + 2)');
  add(dir('A rectangular plot has the dimensions shown. Its area is 252 square metres.') + fig, 'Algebra', 'Quadratic from a figure', 'What is the perimeter of the plot?', `${2 * (w + h)} m`, ['60 m', '68 m', '72 m', `${w * h / 4} m`],
    `(x + 6)(x + 2) = 252 gives x&sup2; + 8x &minus; 240 = 0, so (x + 20)(x &minus; 12) = 0 and x = 12 (a length cannot be negative). Sides = 18 m and 14 m, perimeter = 2(18 + 14) = ${2 * (w + h)} m.`);
}

module.exports = L.bank;
