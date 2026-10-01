// Practice bank - Reasoning: seeded figure sets (charts, seating, floors, routes, syllogisms). Every answer is computed.
const L = require('./lib');
const F = require('./factories');
const { RNG, opts } = require('./rng');
const { mcq, dir, pp } = L;
const f2 = F.f2;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
L.setId(6000);
let slot = 0;
const nextPos = () => (slot = (slot * 5 + 3) % 4);
const add = (set, topic, sub, q, correct, wrongs, exp, extra = {}) => { const o = opts(correct, wrongs, nextPos()); return mcq('R', topic, q, o.opts, o.ans, exp, { set, sub, tough: true, ...extra }); };
const near = (v, d = 1) => [v + d, v - d, v + 2 * d, v - 2 * d, v * 1.1, v * 0.9];

// ---------- grouped bar charts ----------
const BARCATS = [['2019', '2020', '2021', '2022', '2023'], ['Jan', 'Feb', 'Mar', 'Apr', 'May'], ['North', 'South', 'East', 'West', 'Central'], ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']];
const UNITS = ['Rs. crore', 'thousand units', 'Rs. lakh', 'tonnes', 'hundreds'];
function barSet(seed) {
  const R = RNG(seed), cats = BARCATS[seed % BARCATS.length], unit = UNITS[seed % UNITS.length], n = cats.length;
  const a = Array.from({ length: n }, () => R.int(8, 30) * 5), b = a.map(v => Math.max(20, v + R.int(-8, 12) * 5));
  const max = Math.ceil(Math.max(...a, ...b) / 50) * 50, nm = ['Last year', 'This year'];
  const set = dir(`The bar chart compares the sales (in ${unit}) of a company in five ${seed % BARCATS.length === 2 ? 'regions' : 'periods'} for two years.`) + L.barChart({ cats, series: [a, b], max, step: max / 5, names: nm, ylabel: unit, title: 'Sales comparison' });
  const ta = a.reduce((x, y) => x + y), tb = b.reduce((x, y) => x + y);
  const out = [];
  const g = b.map((v, i) => (v - a[i]) / a[i] * 100), gi = g.indexOf(Math.max(...g));
  out.push(['Highest percentage growth', `In which ${seed % BARCATS.length === 2 ? 'region' : 'period'} was the percentage growth from last year to this year the highest?`, cats[gi], cats.filter(c => c !== cats[gi]), `Growth: ${cats.map((c, i) => `${c} ${f2(g[i])}%`).join(', ')}. The highest is ${cats[gi]}.`]);
  out.push(['Total change', 'By what percentage did the total sales of this year differ from the total of last year?', `${f2(Math.abs(tb - ta) / ta * 100)}% ${tb >= ta ? 'higher' : 'lower'}`, [`${f2(Math.abs(tb - ta) / tb * 100)}% ${tb >= ta ? 'higher' : 'lower'}`, `${f2(Math.abs(tb - ta) / ta * 100 + 2.5)}% ${tb >= ta ? 'higher' : 'lower'}`, `${f2(Math.abs(tb - ta) / ta * 100)}% ${tb >= ta ? 'lower' : 'higher'}`], `Total last year = ${ta}, total this year = ${tb}. Change = ${Math.abs(tb - ta)}, which is ${Math.abs(tb - ta)}/${ta} &times; 100 = ${f2(Math.abs(tb - ta) / ta * 100)}% of last year's total. (Dividing by this year's total is the common slip.)`]);
  const [i, j, k, l] = R.shuffle([0, 1, 2, 3, 4]); const num = b[i] + b[j], den = a[k] + a[l], gg = gcd(num, den);
  out.push(['Ratio', `What is the ratio of the combined sales of ${cats[i]} and ${cats[j]} this year to the combined sales of ${cats[k]} and ${cats[l]} last year?`, `${num / gg} : ${den / gg}`, [`${den / gg} : ${num / gg}`, `${(num + 5) / gcd(num + 5, den)} : ${den / gcd(num + 5, den)}`, `${num / gcd(num, den + 10)} : ${(den + 10) / gcd(num, den + 10)}`], `This year ${cats[i]} + ${cats[j]} = ${b[i]} + ${b[j]} = ${num}. Last year ${cats[k]} + ${cats[l]} = ${a[k]} + ${a[l]} = ${den}. Ratio = ${num} : ${den} = ${num / gg} : ${den / gg}.`]);
  const avgb = tb / n, cntb = b.filter(v => v > avgb).length;
  out.push(['Above average', 'In how many cases is the figure for this year <b>above</b> the average of this year\'s five figures?', String(cntb), ['0', '1', '2', '3', '4', '5'].filter(x => x !== String(cntb)), `Average this year = ${tb}/5 = ${f2(avgb)}. Figures above it: ${cats.filter((c, x) => b[x] > avgb).map((c, x) => c).join(', ') || 'none'}.`]);
  return R.shuffle(out).slice(0, 3).map(o => add(set, 'Data Interpretation', 'Bar chart', o[1], o[2], o[3], o[4]));
}

// ---------- line graphs ----------
function lineSet(seed) {
  const R = RNG(seed), yrs = [2017, 2018, 2019, 2020, 2021, 2022], p = [R.int(8, 14) * 5], q = [R.int(8, 14) * 5];
  for (let i = 1; i < 6; i++) { p.push(Math.max(30, p[i - 1] + R.int(-3, 4) * 5)); q.push(Math.max(30, q[i - 1] + R.int(-3, 4) * 5)); }
  const lo = Math.floor(Math.min(...p, ...q) / 10) * 10 - 10, hi = Math.ceil(Math.max(...p, ...q) / 10) * 10 + 10;
  const set = dir('The line graph shows the production (in thousand units) of two plants A and B from 2017 to 2022.') + L.lineChart({ cats: yrs, series: [p, q], min: lo, max: hi, step: 10, names: ['Plant A', 'Plant B'], ylabel: "'000 units", title: 'Production of A and B' });
  const out = [];
  const more = yrs.filter((y, i) => p[i] > q[i]).length;
  out.push(['Years A above B', 'In how many years did Plant A produce <b>more</b> than Plant B?', String(more), ['0', '1', '2', '3', '4', '5', '6'].filter(x => x !== String(more)), `A &gt; B in: ${yrs.filter((y, i) => p[i] > q[i]).join(', ') || 'no year'}.`]);
  const mn = Math.min(...p), mx = Math.max(...p);
  out.push(['Rise from lowest to highest', 'By what percentage is the highest production of Plant A above its lowest production?', f2((mx - mn) / mn * 100) + '%', [f2((mx - mn) / mx * 100) + '%', f2((mx - mn) / mn * 100 + 10) + '%', f2(mx / mn * 100) + '%'], `Plant A: lowest ${mn}, highest ${mx}. Rise = ${mx - mn}, so ${mx - mn}/${mn} &times; 100 = ${f2((mx - mn) / mn * 100)}%.`]);
  const avg = q.reduce((a, b) => a + b) / 6;
  out.push(['Average', 'What is the average yearly production of Plant B (in thousand units)?', f2(avg), [f2(avg + 2.5), f2(avg - 3), f2(p.reduce((a, b) => a + b) / 6)], `Sum = ${q.join(' + ')} = ${q.reduce((a, b) => a + b)}; average = ${q.reduce((a, b) => a + b)}/6 = ${f2(avg)}.`]);
  const d = yrs.map((y, i) => Math.abs(p[i] - q[i])), di = d.indexOf(Math.max(...d));
  if (d.filter(v => v === Math.max(...d)).length === 1) out.push(['Greatest gap', 'In which year was the gap between the two plants the <b>greatest</b>?', String(yrs[di]), yrs.filter(y => y !== yrs[di]).map(String), `Gaps: ${yrs.map((y, i) => `${y}: ${d[i]}`).join(', ')}. The largest is ${d[di]} in ${yrs[di]}.`]);
  return R.shuffle(out).slice(0, 3).map(o => add(set, 'Data Interpretation', 'Line graph', o[1], o[2], o[3], o[4]));
}

// ---------- pie charts ----------
function pieSet(seed) {
  const R = RNG(seed), names = R.shuffle(['Salaries', 'Rent', 'Raw material', 'Marketing', 'Transport', 'Utilities', 'Research']).slice(0, 5);
  const cuts = R.shuffle([5, 10, 15, 20, 25, 30]).sort((a, b) => a - b); let pct = [];
  for (let attempt = 0; attempt < 200; attempt++) { const c = R.sample([...Array(19).keys()].map(i => (i + 1) * 5), 4).sort((a, b) => a - b); const p = [c[0], c[1] - c[0], c[2] - c[1], c[3] - c[2], 100 - c[3]]; if (p.every(v => v >= 5) && new Set(p).size === 5) { pct = p; break; } }
  const total = R.pick([12, 16, 20, 24, 30, 36, 40]);
  const set = dir(`The pie chart shows how a company spends its monthly budget of Rs. ${total} lakh.`) + L.pieChart({ slices: names.map((n, i) => ({ label: n, pct: pct[i] })), total: `Total = Rs. ${total} lakh`, title: 'Budget split' });
  const out = [];
  const i = R.int(0, 4);
  out.push(['Central angle', `What is the central angle of the sector for ${names[i]}?`, `${pct[i] * 3.6} degrees`, [`${pct[i] * 3.6 + 18} degrees`, `${pct[i] * 3.6 - 9} degrees`, `${pct[i] * 4} degrees`], `${pct[i]}% of 360 = ${pct[i] * 3.6} degrees.`]);
  const [x, y] = R.sample([0, 1, 2, 3, 4], 2); const diff = Math.abs(pct[x] - pct[y]) * total / 100;
  out.push(['Amount difference', `By how much (in Rs. lakh) does the spend on ${names[x]} differ from the spend on ${names[y]}?`, f2(diff), [f2(diff + total / 100 * 5), f2(diff * 2), f2(Math.abs(pct[x] - pct[y]))], `${names[x]} = ${pct[x]}% and ${names[y]} = ${pct[y]}%. Difference = ${Math.abs(pct[x] - pct[y])}% of ${total} = ${f2(diff)} lakh.`]);
  const inc = R.pick([10, 20, 25]), k = R.int(0, 4), newT = total + total * pct[k] / 100 * inc / 100, share = total * pct[k] / 100 * (1 + inc / 100) / newT * 100;
  out.push(['New share', `If the spend on ${names[k]} rises by ${inc}% and every other head stays the same, what share of the <b>new</b> total will ${names[k]} be?`, f2(share) + '%', [f2(pct[k] * (1 + inc / 100)) + '%', f2(pct[k] + inc) + '%', f2(share + 2) + '%'], `${names[k]} = ${f2(total * pct[k] / 100)} lakh becomes ${f2(total * pct[k] / 100 * (1 + inc / 100))} lakh. New total = ${f2(newT)} lakh. Share = ${f2(share)}%. (Simply multiplying ${pct[k]}% by ${1 + inc / 100} forgets that the total also grows.)`]);
  const [u, v] = R.sample([0, 1, 2, 3, 4], 2), ratio = pct[u] / pct[v], g = gcd(pct[u], pct[v]);
  out.push(['Ratio', `What is the ratio of the spend on ${names[u]} to the spend on ${names[v]}?`, `${pct[u] / g} : ${pct[v] / g}`, [`${pct[v] / g} : ${pct[u] / g}`, `${pct[u] / g + 1} : ${pct[v] / g}`, `${pct[u] / g} : ${pct[v] / g + 1}`], `${pct[u]}% : ${pct[v]}% = ${pct[u] / g} : ${pct[v] / g}.`]);
  return R.shuffle(out).slice(0, 3).map(o => add(set, 'Data Interpretation', 'Pie chart', o[1], o[2], o[3], o[4]));
}

// ---------- tables ----------
function tableSet(seed) {
  const R = RNG(seed), yrs = [2019, 2020, 2021, 2022, 2023], app = yrs.map(() => R.int(8, 30) * 100), sel = app.map(a => Math.round(a * R.int(8, 20) / 100 / 10) * 10);
  const set = dir('The table shows the number of applicants and the number selected by a company in five years.') + L.tbl(['Year', 'Applied', 'Selected'], yrs.map((y, i) => [y, app[i], sel[i]]));
  const rate = sel.map((s, i) => s / app[i] * 100), ri = rate.indexOf(Math.max(...rate));
  const out = [];
  if (rate.filter(r => Math.abs(r - rate[ri]) < 0.01).length === 1) out.push(['Best selection rate', 'In which year was the selection rate (selected &divide; applied) the highest?', String(yrs[ri]), yrs.filter(y => y !== yrs[ri]).map(String), `Selection rates: ${yrs.map((y, i) => `${y}: ${f2(rate[i])}%`).join(', ')}.`]);
  const ta = app.reduce((x, y) => x + y), ts = sel.reduce((x, y) => x + y);
  out.push(['Overall rate', 'What was the overall selection rate over the five years?', f2(ts / ta * 100) + '%', [f2(rate.reduce((a, b) => a + b) / 5) + '%', f2(ts / ta * 100 + 1.5) + '%', f2(ts / ta * 100 - 1.2) + '%'], `Total selected = ${ts}, total applied = ${ta}; ${ts}/${ta} = ${f2(ts / ta * 100)}%. (Averaging the yearly rates gives ${f2(rate.reduce((a, b) => a + b) / 5)}%, which is wrong when the numbers of applicants differ.)`]);
  const g = (app[4] - app[0]) / app[0] * 100;
  out.push(['Growth in applicants', 'By what percentage did the number of applicants change from 2019 to 2023?', `${f2(Math.abs(g))}% ${g >= 0 ? 'increase' : 'decrease'}`, [`${f2(Math.abs(app[4] - app[0]) / app[4] * 100)}% ${g >= 0 ? 'increase' : 'decrease'}`, `${f2(Math.abs(g) + 5)}% ${g >= 0 ? 'increase' : 'decrease'}`, `${f2(Math.abs(g))}% ${g >= 0 ? 'decrease' : 'increase'}`], `Change = ${app[4]} &minus; ${app[0]} = ${app[4] - app[0]}; ${Math.abs(app[4] - app[0])}/${app[0]} &times; 100 = ${f2(Math.abs(g))}%.`]);
  return R.shuffle(out).slice(0, 2).map(o => add(set, 'Data Interpretation', 'Table', o[1], o[2], o[3], o[4]));
}

// ---------- seating & floors ----------
function seat(seed, o) { const s = F.seatingPuzzle(seed, o); s.qs.forEach(q => add(s.set, 'Data Arrangement', o.mixed ? 'Circular table (mixed facing)' : 'Circular table', q.q, String(q.correct), q.wrongs.map(String), q.exp)); }
function floor(seed, o) { const s = F.floorPuzzle(seed, o); s.qs.forEach(q => add(s.set, 'Data Arrangement', 'Floor puzzle', q.q, String(q.correct), q.wrongs.map(String), q.exp)); }

// ---------- routes ----------
function routeSet(seed) {
  const R = RNG(seed), dv = { N: [0, 1], E: [1, 0], S: [0, -1], W: [-1, 0] }, cw = ['N', 'E', 'S', 'W'];
  const name = { N: 'North', E: 'East', S: 'South', W: 'West' };
  const trip = R.pick([[3, 4], [6, 8], [5, 12], [8, 15], [9, 12]]);
  // build moves reaching net displacement (dx, dy) with a zig-zag so legs are larger than the net
  for (let t = 0; t < 500; t++) {
    let face = R.int(0, 3), x = 0, y = 0; const turns = [], lens = [], segs = []; const k = R.int(4, 5);
    for (let i = 0; i < k; i++) { if (i > 0) face = (face + (R.f() < 0.5 ? 1 : 3)) % 4; const d = R.int(3, 9); x += dv[cw[face]][0] * d; y += dv[cw[face]][1] * d; segs.push({ d: cw[face], len: d }); }
    if (Math.abs(x) < 3 || Math.abs(y) < 3) continue; const dist = Math.hypot(x, y); if (Math.abs(dist - Math.round(dist)) > 1e-9) continue;
    const text = `A courier starts from a depot and moves ${segs.map(s => `${s.len} km ${name[s.d]}`).join(', then ')}. The figure shows the route; North is at the top.`;
    const set = pp(text) + L.pathsFig([{ segs, k: 15, start: 'Depot', end: 'Stop' }], { boxW: 320, boxH: 230 });
    const comp = (dx, dy) => { const v = dy > 0 ? 'North' : dy < 0 ? 'South' : '', h = dx > 0 ? 'East' : dx < 0 ? 'West' : ''; return v && h ? `${v}-${h}` : v || h; };
    add(set, 'Directional Sense', 'Route', 'What is the shortest distance between the depot and the final stop?', `${Math.round(dist)} km`, [`${segs.reduce((a, s) => a + s.len, 0)} km`, `${Math.round(dist) + 1} km`, `${Math.abs(x) + Math.abs(y)} km`], `Net East = ${x} km, net North = ${y} km, so the distance is &radic;(${x}&sup2; + ${y}&sup2;) = ${Math.round(dist)} km. (The total path length is ${segs.reduce((a, s) => a + s.len, 0)} km.)`);
    add(set, 'Directional Sense', 'Route', 'In which direction is the depot from the final stop?', comp(-x, -y), ['North-East', 'North-West', 'South-East', 'South-West', 'North', 'South', 'East', 'West'].filter(d => d !== comp(-x, -y)), `The stop is ${Math.abs(x)} km ${x >= 0 ? 'East' : 'West'} and ${Math.abs(y)} km ${y >= 0 ? 'North' : 'South'} of the depot, so the depot lies to the ${comp(-x, -y)} of the stop.`);
    return;
  }
  throw new Error('route seed ' + seed);
}

// ---------- syllogisms (text, model-checked) ----------
function sylSingle(seed) {
  const sy = F.syllogism(seed), t = s => sy.text(s);
  const set = pp(`<b>Statements:</b> I. ${t(sy.prem[0])}. II. ${t(sy.prem[1])}.<br><b>Conclusions:</b> I. ${t(sy.pair[0])}. II. ${t(sy.pair[1])}.`);
  const a = F.sylAnswer(sy.prem, sy.pair);
  const why = (c, f) => `"${t(c)}" ${f ? 'is true in every Venn diagram that satisfies both statements, so it follows' : 'can be false in at least one valid Venn diagram, so it does not definitely follow'}`;
  mcq('R', 'Syllogisms', 'Which of the following is correct?', F.SYL_OPTS.slice(), a, `${why(sy.pair[0], sy.f[0])}. ${why(sy.pair[1], sy.f[1])}.${a === 2 ? ' The two conclusions are complementary, so either I or II follows.' : ''}`, { set, sub: 'Model-checked', tough: true });
}

[101, 102, 103, 104, 105, 106, 107, 108].forEach(barSet);
[111, 112, 113, 114, 115, 116].forEach(lineSet);
[121, 122, 123, 124, 125, 126].forEach(pieSet);
[131, 132, 133, 134].forEach(tableSet);
[1, 4, 6, 8, 10].forEach(s => seat(s, { n: 8, mixed: false }));
[2, 3, 5, 7, 9].forEach(s => seat(s, { n: 8, mixed: true }));
[1, 2, 3, 4, 5].forEach(s => floor(s, { n: 6 }));
[41, 42].forEach(s => floor(s, { n: 7 }));
[201, 202, 203, 204, 205, 206].forEach(routeSet);
[301, 302, 303, 304, 305, 306, 307, 308, 309, 310].forEach(sylSingle);

module.exports = L.bank;
