// Practice bank - Technical (mathematical) ability: seeded figure questions, all answers computed.
const L = require('./lib');
const { RNG, opts } = require('./rng');
const { mcq, dir, pp, T, R, C, P } = L;
const f2 = n => String(+n.toFixed(2));
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const frac = (n, d) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };
L.setId(7000);
let slot = 1;
const nextPos = () => (slot = (slot * 5 + 2) % 4);
const add = (set, topic, sub, q, correct, wrongs, exp) => { const o = opts(correct, wrongs, nextPos(), k => String(correct) + ' ' + k); return mcq('T', topic, q, o.opts, o.ans, exp, { set, sub, tough: true }); };
const num = (v) => String(+(+v).toFixed(2));

// ---- profit & loss bar charts ----
function plSet(seed) {
  const r = RNG(seed), items = ['P', 'Q', 'R', 'S', 'T'], cp = items.map(() => r.int(8, 30) * 10), sp = cp.map(c => Math.round(c * r.pick([0.8, 0.9, 1.1, 1.2, 1.25, 1.3]) / 5) * 5);
  const max = Math.ceil(Math.max(...cp, ...sp) / 50) * 50;
  const set = dir('The chart shows the cost price and the selling price (in Rs.) of five articles.') + L.barChart({ cats: items, series: [cp, sp], max, step: max / 5, names: ['Cost price', 'Selling price'], ylabel: 'Rs.', title: 'Cost and selling prices', w: 460, h: 280 });
  const tcp = cp.reduce((a, b) => a + b), tsp = sp.reduce((a, b) => a + b), pc = sp.map((s, i) => (s - cp[i]) / cp[i] * 100);
  const pr = (tsp - tcp) / tcp * 100, out = [];
  out.push(['Overall result', 'What is the overall profit or loss percentage on all five articles together?', `${f2(Math.abs(pr))}% ${pr >= 0 ? 'profit' : 'loss'}`, [`${f2(Math.abs(pc.reduce((a, b) => a + b) / 5))}% ${pc.reduce((a, b) => a + b) >= 0 ? 'profit' : 'loss'}`, `${f2(Math.abs(pr) + 2)}% ${pr >= 0 ? 'profit' : 'loss'}`, `${f2(Math.abs(pr))}% ${pr >= 0 ? 'loss' : 'profit'}`], `Total CP = ${tcp}, total SP = ${tsp}, ${pr >= 0 ? 'profit' : 'loss'} = ${Math.abs(tsp - tcp)}. Percentage = ${Math.abs(tsp - tcp)}/${tcp} &times; 100 = ${f2(Math.abs(pr))}%. (Averaging the five percentages is wrong because the cost prices differ.)`]);
  const bi = pc.indexOf(Math.max(...pc));
  if (pc.filter(v => Math.abs(v - pc[bi]) < 1e-9).length === 1) out.push(['Best article', 'On which article is the profit percentage the highest?', items[bi], items.filter(x => x !== items[bi]), `Profit %: ${items.map((x, i) => `${x} ${f2(pc[i])}%`).join(', ')}.`]);
  const ls = items.filter((x, i) => sp[i] < cp[i]).length;
  out.push(['Loss-making count', 'On how many articles is there a loss?', String(ls), ['0', '1', '2', '3', '4', '5'].filter(x => x !== String(ls)), `Articles with SP below CP: ${items.filter((x, i) => sp[i] < cp[i]).join(', ') || 'none'}.`]);
  return r.shuffle(out).slice(0, 2).map(o => add(set, 'Profit and Loss', 'Bar chart', o[1], o[2], o[3], o[4]));
}
// ---- averages ----
function avgSet(seed) {
  const r = RNG(seed), n = r.pick([7, 8]), runs = Array.from({ length: n }, () => r.int(20, 80)), sum = runs.reduce((a, b) => a + b);
  const set = dir(`The bar chart shows the runs scored by a batsman in his last ${n} innings.`) + L.barChart({ cats: runs.map((_, i) => 'I' + (i + 1)), series: [runs], max: 80, step: 20, w: 460, h: 260, ylabel: 'Runs', title: 'Runs per innings' });
  const target = Math.ceil(sum / n / 5) * 5 + 5, need = (n + 1) * target - sum;
  const out = [];
  out.push(['Runs needed', `How many runs must he score in the next innings to raise his average over ${n + 1} innings to exactly ${target}?`, String(need), [String(need - 5), String(need + 8), String(target)], `Total so far = ${sum}. Required total = ${n + 1} &times; ${target} = ${(n + 1) * target}. Runs needed = ${(n + 1) * target} &minus; ${sum} = ${need}.`]);
  const sub = runs.slice(0, 3).reduce((a, b) => a + b), rest = (sum - sub) / (n - 3);
  out.push(['Average of the rest', `What is the average of the innings other than the first three?`, f2(rest), [f2(sum / n), f2(rest + 2.5), f2(sub / 3)], `Total = ${sum}; first three = ${sub}. Remaining ${n - 3} innings total ${sum - sub}, average ${f2(rest)}.`]);
  return out.map(o => add(set, 'Averages', 'Bar chart', o[1], o[2], o[3], o[4]));
}
// ---- vessels (mixtures) ----
function mixSet(seed) {
  const r = RNG(seed); const ra = r.pick([[3, 2], [2, 3], [1, 4], [4, 1], [3, 1]]), rb = r.pick([[1, 2], [2, 1], [1, 3], [3, 2], [1, 1]]), ta = r.pick([30, 40, 50]), tb = r.pick([20, 30, 60]);
  const ma = ta * ra[0] / (ra[0] + ra[1]), wa = ta - ma, mb = tb * rb[0] / (rb[0] + rb[1]), wb = tb - mb;
  if (![ma, wa, mb, wb].every(Number.isInteger)) return mixSet(seed + 1000);
  const set = dir('Two vessels contain milk and water as shown (litres).') + L.barChart({ cats: ['Vessel A', 'Vessel B'], series: [[ma, mb], [wa, wb]], max: Math.ceil(Math.max(ta, tb) / 10) * 10, step: 10, names: ['Milk', 'Water'], stacked: true, ylabel: 'Litres', w: 360, h: 260, title: 'Two vessels' });
  const qa = r.pick([10, 20]), qb = r.pick([10, 20, 30].filter(x => x <= tb));
  const m = qa * ma / ta + qb * mb / tb, w = qa + qb - m;
  if (!Number.isInteger(m)) return mixSet(seed + 1000);
  const g = gcd(m, w);
  add(set, 'Ratios and Proportions', 'Mixtures', `${qa} litres from Vessel A and ${qb} litres from Vessel B are mixed. What is the ratio of milk to water in the mixture?`, `${m / g} : ${w / g}`, [`${(ma + mb) / gcd(ma + mb, wa + wb)} : ${(wa + wb) / gcd(ma + mb, wa + wb)}`, `${(m + 2) / gcd(m + 2, w)} : ${w / gcd(m + 2, w)}`, `${w / g} : ${m / g}`],
    `Vessel A is ${ma} : ${wa}, so ${qa} L has ${qa * ma / ta} L milk. Vessel B is ${mb} : ${wb}, so ${qb} L has ${qb * mb / tb} L milk. Mixture: milk ${m} L, water ${w} L, ratio ${m / g} : ${w / g}.`);
}
// ---- grid paths ----
function pathSet(seed) {
  const r = RNG(seed), W = r.pick([3, 4]), H = r.pick([3, 3]), nb = 2;
  const bH = [], bV = []; for (let k = 0; k < nb; k++) { if (r.f() < 0.5) bH.push([r.int(0, W - 1), r.int(1, H - 1)]); else bV.push([r.int(1, W - 1), r.int(0, H - 1)]); }
  const dp = Array.from({ length: W + 1 }, () => Array(H + 1).fill(0)); dp[0][0] = 1;
  for (let y = 0; y <= H; y++) for (let x = 0; x <= W; x++) { if (!x && !y) continue; let v = 0; if (x > 0 && !bH.some(b => b[0] === x - 1 && b[1] === y)) v += dp[x - 1][y]; if (y > 0 && !bV.some(b => b[0] === x && b[1] === y - 1)) v += dp[x][y - 1]; dp[x][y] = v; }
  const total = dp[W][H]; let full = 1; for (let i = 1; i <= W + H; i++) full *= i; for (let i = 1; i <= W; i++) full /= i; for (let i = 1; i <= H; i++) full /= i;
  if (total === full || total < 3) return pathSet(seed + 500);
  const gx = x => 40 + x * 62, gy = y => 40 + (H - y) * 52; let s = '';
  for (let y = 0; y <= H; y++) for (let x = 0; x <= W; x++) { if (x < W) s += L.L(gx(x), gy(y), gx(x + 1), gy(y), bH.some(b => b[0] === x && b[1] === y) ? 'ln sd' : 'ln'); if (y < H) s += L.L(gx(x), gy(y), gx(x), gy(y + 1), bV.some(b => b[0] === x && b[1] === y) ? 'ln sd' : 'ln'); }
  bH.forEach(b => s += T(gx(b[0]) + 31, gy(b[1]) - 6, '&#10005;', { c: 'mk', b: 1, s: 14 })); bV.forEach(b => s += T(gx(b[0]) + 9, gy(b[1]) - 22, '&#10005;', { c: 'mk', b: 1, s: 14 }));
  for (let y = 0; y <= H; y++) for (let x = 0; x <= W; x++) s += C(gx(x), gy(y), 3.5, 'mk');
  s += T(gx(0) - 14, gy(0) + 16, 'A', { b: 1, s: 14 }) + T(gx(W) + 14, gy(H) - 8, 'B', { b: 1, s: 14 });
  const set = dir('The grid shows the roads of a colony. The roads marked with a red cross are closed for repairs.') + L.fig(gx(W) + 40, gy(0) + 30, s, 'Road grid with closed roads');
  add(set, 'Permutation, Combination and Probability', 'Grid paths', 'Moving only to the right or upwards along open roads, in how many different ways can a person go from A to B?', String(total), [String(full), String(total + 3), String(total - 2), String(total + 7)],
    `Without closures there would be C(${W + H},${W}) = ${full} routes. Counting routes to each junction (sum of the counts from the left and from below, skipping closed roads) gives ${total} routes to B.`);
}
// ---- spinners ----
function spinSet(seed) {
  const r = RNG(seed), A_ = r.shuffle([1, 2, 3, 4, 5, 6]).slice(0, r.pick([3, 4])), B_ = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, r.pick([4, 5]));
  const wheel = (vals, label) => { const n = vals.length, cx = 70, cy = 70, rr = 56; let s = ''; vals.forEach((v, i) => { const a1 = -Math.PI / 2 + i * 2 * Math.PI / n, a2 = a1 + 2 * Math.PI / n, m = (a1 + a2) / 2; s += `<path d='M${cx},${cy} L${L.r1(cx + rr * Math.cos(a1))},${L.r1(cy + rr * Math.sin(a1))} A${rr},${rr} 0 0 1 ${L.r1(cx + rr * Math.cos(a2))},${L.r1(cy + rr * Math.sin(a2))} Z' class='${L.SER[i % 5]} wedge' style='fill-opacity:.35'/>` + T(cx + 36 * Math.cos(m), cy + 36 * Math.sin(m) + 5, v, { b: 1, s: 15 }); }); s += `<path d='M${cx - 6},4 L${cx + 6},4 L${cx},16 Z' class='mk'/>` + T(cx, 148, label, { b: 1, s: 12 }); return s; };
  const set = dir('Each spinner is divided into equal sectors and stops on one sector at random. Both are spun once.') + L.fig(330, 156, `<g>${wheel(A_, 'Spinner X')}</g><g transform='translate(170,0)'>${wheel(B_, 'Spinner Y')}</g>`, 'Two spinners');
  const kind = r.pick(['even', 'mult', 'product']);
  let fav = 0, txt, why; A_.forEach(a => B_.forEach(b => { if (kind === 'even' ? (a + b) % 2 === 0 : kind === 'mult' ? (a + b) % 3 === 0 : a * b > 12) fav++; }));
  txt = kind === 'even' ? 'the sum of the two numbers is even' : kind === 'mult' ? 'the sum of the two numbers is a multiple of 3' : 'the product of the two numbers is greater than 12';
  const tot = A_.length * B_.length; if (fav === 0 || fav === tot) return spinSet(seed + 900);
  add(set, 'Permutation, Combination and Probability', 'Probability', `What is the probability that ${txt}?`, frac(fav, tot), [frac(Math.min(tot - 1, fav + 1), tot), frac(Math.max(1, fav - 1), tot), frac(tot - fav, tot), `1/${A_.length}`],
    `Total outcomes = ${A_.length} &times; ${B_.length} = ${tot}. Favourable pairs: ${A_.flatMap(a => B_.filter(b => (kind === 'even' ? (a + b) % 2 === 0 : kind === 'mult' ? (a + b) % 3 === 0 : a * b > 12)).map(b => `(${a},${b})`)).join(', ')} = ${fav}. Probability = ${frac(fav, tot)}.`);
}
// ---- distance-time graphs ----
function tsdSet(seed) {
  const r = RNG(seed); let vp, vq, D, dl, t;
  for (let k = 0; k < 500; k++) { vp = r.pick([10, 15, 20, 25]); vq = r.pick([15, 20, 30, 25]); dl = r.pick([1, 2]); D = r.pick([120, 150, 180]); const tt = (D + vq * dl) / (vp + vq); if (Number.isInteger(tt) && tt > dl && tt * vp < D && D / vp <= 9 && D / vq + dl <= 9) { t = tt; break; } }
  if (!t) return tsdSet(seed + 77);
  const T1 = D / vp, T2 = dl + D / vq, tmax = Math.ceil(Math.max(T1, T2));
  const px = x => 56 + x * (320 / tmax), py = d => 232 - d * (200 / D);
  let s = '';
  for (let x = 0; x <= tmax; x++) s += L.L(px(x), 232, px(x), 32, 'grd') + T(px(x), 248, x, { s: 11 });
  for (let d = 0; d <= D; d += D / 6) s += L.L(56, py(d), 376, py(d), 'grd') + T(50, py(d) + 4, Math.round(d), { a: 'end', s: 11 });
  s += L.L(56, 232, 376, 232, 'sline') + L.L(56, 232, 56, 32, 'sline') + T(216, 266, 'Time since the first departure (hours)', { s: 11, b: 1 }) + T(12, 132, 'Distance from X (km)', { s: 11, b: 1, rot: -90 });
  s += `<line x1='${px(0)}' y1='${py(0)}' x2='${px(T1)}' y2='${py(D)}' stroke-width='2.5' style='stroke:var(--accent)'/><line x1='${px(dl)}' y1='${py(D)}' x2='${px(T2)}' y2='${py(0)}' stroke-width='2.5' style='stroke:var(--signal)'/>`;
  s += C(px(0), py(0), 4, 'a') + C(px(T1), py(D), 4, 'a') + C(px(dl), py(D), 4, 'b') + C(px(T2), py(0), 4, 'b');
  s += T(px(0) + 8, py(0) - 8, 'P leaves X', { a: 'start', s: 11 }) + T(px(T1), py(D) - 9, `P reaches Y (${f2(T1)} h)`, { a: 'end', s: 11 }) + T(px(dl) + 8, py(D) - 9, 'Q leaves Y', { a: 'start', s: 11 }) + T(px(T2) - 4, py(0) - 10, `Q reaches X (${f2(T2)} h)`, { a: 'end', s: 11 });
  const set = dir('Two cyclists P (blue) and Q (orange) travel on the same road between towns X and Y. The graph shows their journeys.') + L.fig(420, 280, s, 'Distance-time graph of two cyclists');
  const dist = vp * t;
  add(set, 'Time, Speed and Distance', 'Graph', 'At what distance from X do the two cyclists meet?', `${dist} km`, [`${f2(vp * D / (vp + vq))} km`, `${dist + 10} km`, `${dist - 15} km`, `${D / 2} km`],
    `P's speed = ${D}/${f2(T1)} = ${vp} km/h; Q's speed = ${D}/${f2(T2 - dl)} = ${vq} km/h, and Q starts ${dl} h later. Meeting time t from P's start: ${vp}t = ${D} &minus; ${vq}(t &minus; ${dl}), so t = ${t} h and the distance is ${vp} &times; ${t} = ${dist} km. (${f2(vp * D / (vp + vq))} km would be the answer if both started together.)`);
}
// ---- number pyramids ----
function pyrSet(seed) {
  const r = RNG(seed), rules = [['sum of the two cells below plus 1', (a, b) => a + b + 1], ['sum of the two cells below minus 1', (a, b) => a + b - 1], ['sum of the two cells below plus 2', (a, b) => a + b + 2], ['difference of the two cells below (larger minus smaller) plus 3', (a, b) => Math.abs(a - b) + 3], ['twice the left cell plus the right cell', (a, b) => 2 * a + b], ['left cell plus twice the right cell', (a, b) => a + 2 * b], ['product of the two cells below minus 1', (a, b) => a * b - 1]];
  const rule = r.pick(rules), build = (bottom) => { const rows = [bottom]; while (rows[0].length > 1) { const x = rows[0]; rows.unshift(x.slice(1).map((v, i) => rule[1](x[i], v))); } return rows; };
  const b1 = Array.from({ length: 4 }, () => r.int(2, 9)), b2 = Array.from({ length: 4 }, () => r.int(2, 9)), p1 = build(b1), p2 = build(b2);
  // the full pyramid must identify the rule among the candidates
  const fits = rules.filter(ru => { let ok = true; for (let i = 0; i < p1.length - 1; i++) for (let j = 0; j < p1[i].length; j++) if (ru[1](p1[i + 1][j], p1[i + 1][j + 1]) !== p1[i][j]) ok = false; return ok; });
  if (fits.length !== 1) return pyrSet(seed + 31);
  const draw = (rows, hide) => { const cw = 56, ch = 32, w = rows[rows.length - 1].length * cw + 20; let s = ''; rows.forEach((row, i) => { const off = (w - row.length * cw) / 2; row.forEach((v, j) => { s += R(off + j * cw + 1, 8 + i * ch, cw - 2, ch - 2, 'paper sline') + T(off + j * cw + cw / 2, 29 + i * ch, hide && i === 0 ? '?' : v, { b: 1, s: 15 }); }); }); return { w, s }; };
  const d1 = draw(p1), d2 = draw(p2, true);
  const set = dir('Pyramid 1 is built from its bottom row upwards using a fixed rule. Pyramid 2 uses the <b>same</b> rule.') + L.fig(d1.w + d2.w + 50, 168, `<g>${d1.s}</g><g transform='translate(${d1.w + 40},0)'>${d2.s}</g>` + T(d1.w / 2, 158, 'Pyramid 1', { b: 1, s: 12 }) + T(d1.w + 40 + d2.w / 2, 158, 'Pyramid 2', { b: 1, s: 12 }), 'Two number pyramids');
  const top = p2[0][0];
  add(set, 'Number Series', 'Number pyramid', 'What number replaces the question mark?', String(top), [String(top + 3), String(top - 4), String(top + 9), String(top + 1)],
    `From Pyramid 1 the rule is: each cell is the ${rule[0]}. Applying it to Pyramid 2: ${p2.slice().reverse().slice(1).map(row => row.join(', ')).join(' &rarr; ')}, top = ${top}.`);
}
// ---- number series in a row of boxes ----
function seriesSet(seed) {
  const r = RNG(seed), kinds = ['inc', 'alt', 'mulplus', 'square', 'fib'], kind = kinds[seed % kinds.length];
  let ser = [], next, rule, wrong = [];
  if (kind === 'inc') { const a = r.int(2, 9), d = r.int(2, 5), e = r.int(1, 3); let v = a, dd = d; for (let i = 0; i < 6; i++) { ser.push(v); v += dd; dd += e; } next = ser.pop(); rule = `The differences grow by ${e}: ${ser.slice(1).map((v, i) => v - ser[i]).join(', ')}. The next difference is ${ser[ser.length - 1] - ser[ser.length - 2] + e}, so the missing term is ${next}.`; wrong = [next + e, next - e, next + 3]; }
  if (kind === 'alt') { const a = r.int(3, 12), da = r.int(2, 6), b = r.int(20, 40), db = r.int(2, 5); for (let i = 0; i < 6; i++) ser.push(i % 2 ? b + db * (i - 1) / 2 * -1 : a + da * i / 2); next = ser.pop(); rule = `Two series are interleaved: the odd positions go up by ${da} (${ser.filter((v, i) => i % 2 === 0).join(', ')}, ...) and the even positions go down by ${db}. The 6th term follows the second series: ${next}.`; wrong = [next + db, next - db, next + da]; }
  if (kind === 'mulplus') { const m = r.pick([2, 3]), c = r.int(1, 4) * (r.f() < 0.5 ? 1 : -1), a = r.int(2, 6); let v = a; for (let i = 0; i < 6; i++) { ser.push(v); v = v * m + c; } next = ser.pop(); rule = `Each term = previous &times; ${m} ${c >= 0 ? '+' : '&minus;'} ${Math.abs(c)}. After ${ser[ser.length - 1]} comes ${ser[ser.length - 1]} &times; ${m} ${c >= 0 ? '+' : '&minus;'} ${Math.abs(c)} = ${next}.`; wrong = [ser[ser.length - 1] * m, next + m, next - 2 * Math.abs(c)]; }
  if (kind === 'square') { const k = r.int(-3, 6), s0 = r.int(2, 6), cube = r.f() < 0.4; for (let i = 0; i < 6; i++) ser.push(cube ? (s0 + i) ** 3 + k : (s0 + i) ** 2 + k); next = ser.pop(); rule = `The terms are ${cube ? 'cubes' : 'squares'} ${k >= 0 ? 'plus' : 'minus'} ${Math.abs(k)}: (${s0})${cube ? '&sup3;' : '&sup2;'}, (${s0 + 1}), ... The missing term is ${s0 + 5}${cube ? '&sup3;' : '&sup2;'} ${k >= 0 ? '+' : '&minus;'} ${Math.abs(k)} = ${next}.`; wrong = [next + (cube ? 18 : 2 * (s0 + 5) + 1), next - 10, next + 7]; }
  if (kind === 'fib') { const a = r.int(1, 5), b = r.int(2, 6); ser = [a, b]; for (let i = 2; i < 6; i++) ser.push(ser[i - 1] + ser[i - 2]); next = ser.pop(); rule = `Each term is the sum of the two before it: ${ser[ser.length - 2]} + ${ser[ser.length - 1]} = ${next}.`; wrong = [next + 1, next - 2, ser[ser.length - 1] * 2]; }
  const cw = 54, w = (ser.length + 1) * cw + 14; let s = ''; ser.forEach((v, i) => { s += R(8 + i * cw, 8, cw - 4, 34, 'paper sline') + T(8 + i * cw + (cw - 4) / 2, 31, v, { b: 1, s: 15 }); }); s += R(8 + ser.length * cw, 8, cw - 4, 34, 'soft sline') + T(8 + ser.length * cw + (cw - 4) / 2, 31, '?', { b: 1, s: 16 });
  const set = dir('Find the number that replaces the question mark.') + L.fig(w, 50, s, 'Number series');
  add(set, 'Number Series', 'Series', 'Which number comes in place of the question mark?', String(next), wrong.map(String), rule);
}
// ---- partnership timelines ----
function partSet(seed) {
  const r = RNG(seed); let rows;
  for (;;) { rows = [['A', r.int(2, 8) * 10, 0, 12], ['B', r.int(2, 8) * 10, r.pick([2, 3, 4]), 12], ['C', r.int(2, 8) * 10, 0, r.pick([6, 8, 9])]]; const sh = rows.map(x => x[1] * (x[3] - x[2])); const g = sh.reduce(gcd); const tot = sh.reduce((a, b) => a + b); const profit = tot / g * r.pick([1000, 2000, 3000]); if (Number.isInteger(profit) && new Set(sh).size === 3) { rows.profit = profit; break; } }
  const x = m => 130 + m * 24; let s = ''; for (let m = 0; m <= 12; m += 2) s += L.L(x(m), 18, x(m), 160, 'grd') + T(x(m), 176, m, { s: 11 });
  rows.forEach((row, i) => { const y = 28 + i * 40; s += T(120, y + 17, `${row[0]}: Rs ${row[1]},000`, { a: 'end', s: 12, b: 1 }) + R(x(row[2]), y, (row[3] - row[2]) * 24, 26, ['a', 'b', 'c'][i], "fill-opacity='.75'") + T(x((row[2] + row[3]) / 2), y + 17, `${row[3] - row[2]} months`, { s: 11, c: 'onfill' }); });
  s += T(x(6), 194, 'Months from the start of the year', { s: 11, b: 1 });
  const set = dir('A, B and C run a business for a year. The chart shows the capital each partner invested and the months for which it stayed in the business.') + L.fig(440, 204, s, 'Partnership timeline');
  const sh = rows.map(row => row[1] * (row[3] - row[2])), tot = sh.reduce((a, b) => a + b), who = r.pick([0, 1, 2]), g = sh.reduce(gcd), profit = rows.profit;
  add(set, 'Partnerships', 'Timeline', `The profit at the end of the year is Rs ${profit.toLocaleString('en-IN')}. What is ${rows[who][0]}'s share?`, `Rs ${(profit * sh[who] / tot).toLocaleString('en-IN')}`, [`Rs ${(profit * rows[who][1] / rows.reduce((a, b) => a + b[1], 0)).toLocaleString('en-IN')}`, `Rs ${Math.round(profit / 3).toLocaleString('en-IN')}`, `Rs ${(profit * sh[(who + 1) % 3] / tot).toLocaleString('en-IN')}`],
    `Capital &times; time: ${rows.map((row, i) => `${row[0]} = ${row[1]} &times; ${row[3] - row[2]} = ${sh[i]}`).join(', ')}. Ratio = ${sh.map(v => v / g).join(' : ')}. ${rows[who][0]}'s share = ${profit} &times; ${sh[who] / g}/${tot / g} = Rs ${(profit * sh[who] / tot).toLocaleString('en-IN')}. (Using capitals alone, ignoring time, gives a wrong share.)`);
}
// ---- cryptarithms (brute force, unique only) ----
function crypt(words, a, b, c, ask) {
  const letters = [...new Set((a + b + c).split(''))]; if (letters.length > 10) return;
  const sols = []; const m = {}; const used = new Set();
  const val = w => +w.split('').map(ch => m[ch]).join('');
  const rec = i => { if (i === letters.length) { if (m[a[0]] && m[b[0]] && m[c[0]] && val(a) + val(b) === val(c)) sols.push({ ...m }); return; } for (let d = 0; d < 10; d++) if (!used.has(d)) { used.add(d); m[letters[i]] = d; rec(i + 1); used.delete(d); } };
  rec(0); if (sols.length !== 1) return false;
  const sol = sols[0], vs = w => +w.split('').map(ch => sol[ch]).join(''), row = (txt, y, op) => txt.padStart(Math.max(a.length, b.length, c.length)).split('').map((ch, i) => (ch.trim() ? R(60 + i * 36, y, 32, 32, 'paper sline') + T(76 + i * 36, y + 22, ch, { b: 1, s: 17 }) : '')).join('') + (op ? T(34, y + 23, op, { s: 20, b: 1 }) : '');
  const wd = 60 + Math.max(a.length, b.length, c.length) * 36 + 20;
  const fig = L.fig(wd, 170, row(a, 6) + row(b, 44, '+') + L.L(30, 84, wd - 20, 84, 'ln') + row(c, 92), `Cryptarithm ${a} + ${b} = ${c}`);
  const set = dir('In the addition below every letter stands for a different digit (the same letter always stands for the same digit).') + fig;
  const target = ask.split('').reduce((t, ch) => t + sol[ch], 0);
  add(set, 'Cryptarithmetic', 'Word sum', `What is the value of ${ask.split('').join(' + ')}?`, String(target), [String(target + 1), String(target - 2), String(target + 3), String(target + 5)],
    `Solving column by column gives ${Object.entries(sol).map(([k, v]) => `${k}=${v}`).join(', ')}. Check: ${vs(a)} + ${vs(b)} = ${vs(c)}. So ${ask.split('').map(ch => ch + '=' + sol[ch]).join(', ')} and the value is ${target}.`);
  return true;
}
// ---- algebra with figures ----
function algSet(seed) {
  const r = RNG(seed), x = r.int(4, 14), a = r.int(2, 8), b = r.int(1, 6), w = x + a, h = x + b, area = w * h;
  const fig = L.fig(360, 170, R(40, 20, 210, 110, 'soft sline') + T(145, 78, `Area = ${area} sq m`, { b: 1, s: 14 }) + T(145, 14, `(x + ${a}) m`, { s: 13, b: 1 }) + T(262, 80, `(x + ${b}) m`, { a: 'start', s: 13, b: 1 }), 'Rectangular plot');
  const kind = r.pick(['perimeter', 'diagonal', 'x']);
  const set = dir(`A rectangular plot has the dimensions shown and an area of ${area} square metres.`) + fig;
  const diag = Math.hypot(w, h);
  const q = kind === 'perimeter' ? ['What is the perimeter of the plot?', `${2 * (w + h)} m`, [`${2 * (w + h) + 4} m`, `${w * h / 4} m`, `${w + h} m`]] : kind === 'x' ? ['What is the value of x?', String(x), [String(x + 2), String(x - 1), String(a + b)]] : ['What is the area of the largest square that can be cut from the plot, in sq m?', String(Math.min(w, h) ** 2), [String(Math.max(w, h) ** 2), String(w * h / 2), String(area - x)]];
  add(set, 'Algebra', 'Quadratic from a figure', q[0], q[1], q[2], `(x + ${a})(x + ${b}) = ${area} gives x&sup2; + ${a + b}x + ${a * b - area} = 0. The positive root is x = ${x}, so the sides are ${w} m and ${h} m.${kind === 'perimeter' ? ` Perimeter = 2(${w} + ${h}) = ${2 * (w + h)} m.` : kind === 'diag' ? '' : kind === 'x' ? '' : ` The largest square has the shorter side ${Math.min(w, h)} m, area ${Math.min(w, h) ** 2} sq m.`}`);
}

[1, 2, 3, 4].forEach(plSet);
[11, 12, 13].forEach(avgSet);
[21, 22, 23, 24].forEach(mixSet);
[31, 32, 33, 34, 35, 36].forEach(pathSet);
[41, 42, 43, 44, 45].forEach(spinSet);
[51, 52, 53, 54, 55].forEach(tsdSet);
[61, 62, 63, 64, 65, 66].forEach(pyrSet);
[71, 72, 73, 74, 75, 76, 77, 78, 79, 80].forEach(seriesSet);
[81, 82, 83, 84].forEach(partSet);
[['TO', 'GO', 'OUT', 'GUT'], ['BASE', 'BALL', 'GAMES', 'GAMES'], ['SEND', 'MORE', 'MONEY', 'MY'], ['EAST', 'WEST', 'SOUTH', 'SOUTH'], ['CROSS', 'ROADS', 'DANGER', 'RED'], ['FORTY', 'TEN', 'SIXTY', 'TEN'], ['LEG', 'BONE', 'TUBAS', 'LEG']].forEach(([a, b, c, ask]) => { try { crypt(null, a, b, c, ask); } catch (e) { } });
[91, 92, 93, 94, 95, 96].forEach(algSet);

module.exports = L.bank;
