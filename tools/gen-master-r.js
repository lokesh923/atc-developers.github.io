// Master Mock 4 - Reasoning section (15 questions, figure-heavy, answers computed in code).
const L = require('./lib');
const F = require('./factories');
const { RNG, opts } = require('./rng');
const { mcq, dir, pp, T, R, C, P, A } = Object.assign({}, L, { A: L.A });
const f2 = F.f2;
const MM = { mm: 'M4', tough: true };
let slot = 1;                       // rotates the position of the right answer
const nextPos = () => (slot = (slot * 3 + 1) % 4);
const add = (set, topic, sub, q, correct, wrongs, exp, fill) => { const o = opts(correct, wrongs, nextPos(), fill); return mcq('R', topic, q, o.opts, o.ans, exp, { set, sub, ...MM }); };

L.setId(5000);

// ---- Set A: stacked bar chart ----
{
  const yrs = [2019, 2020, 2021, 2022, 2023], E = [40, 46, 52, 48, 60], M = [30, 28, 35, 42, 37], Ar = [20, 24, 22, 26, 30];
  const tot = yrs.map((_, i) => E[i] + M[i] + Ar[i]);
  const set = dir('The stacked bar chart shows the enrolment (in hundreds) of an institute in three streams from 2019 to 2023.') +
    L.barChart({ cats: yrs, series: [E, M, Ar], max: 140, step: 20, names: ['Engineering', 'Management', 'Arts'], stacked: true, ylabel: 'Enrolment (hundreds)', title: 'Enrolment by stream', w: 480, h: 300 });
  add(set, 'Data Interpretation', 'Stacked bar', 'By what percentage did Engineering enrolment rise from its <b>lowest</b> year to its <b>highest</b> year?', '50%', ['33.3%', '20%', '60%', '25%'],
    `Engineering: lowest = ${Math.min(...E)} (2019), highest = ${Math.max(...E)} (2023). Rise = 20/40 = 50%. (33.3% divides by the highest value instead of the lowest.)`);
  const g = Ar.slice(1).map((v, i) => (v - Ar[i]) / Ar[i] * 100); const gi = g.indexOf(Math.max(...g));
  add(set, 'Data Interpretation', 'Stacked bar', 'In which year did Arts record the highest <b>percentage</b> growth over the previous year?', String(yrs[gi + 1]), ['2021', '2022', '2023', '2020'].filter(x => x !== String(yrs[gi + 1])),
    `Arts growth: 2020 ${f2(g[0])}%, 2021 ${f2(g[1])}%, 2022 ${f2(g[2])}%, 2023 ${f2(g[3])}%. The first jump of 4 on a base of 20 is the largest percentage even though the next two jumps are also +4.`);
  const avg = (M.reduce((a, b) => a + b) + Ar.reduce((a, b) => a + b)) / 5;
  add(set, 'Data Interpretation', 'Stacked bar', 'What is the average yearly <b>combined</b> enrolment of Management and Arts (in hundreds)?', f2(avg), [f2(avg + 4), f2(avg - 5.4), f2(M.reduce((a, b) => a + b) / 5), '49.6'],
    `Management total = 172, Arts total = 122; combined = 294. Average over 5 years = 294/5 = 58.8 hundred.`);
  const newE = E[4] * 1.2, newTot = newE + M[4] + Ar[4];
  add(set, 'Data Interpretation', 'Stacked bar', 'In 2024 Engineering enrolment rises by 20% over 2023 while Management and Arts stay at their 2023 levels. What share of the 2024 total will Engineering have?', f2(newE / newTot * 100) + '%', [f2(newE / tot[4] * 100) + '%', '50.00%', '60.00%', '54.50%'],
    `Engineering 2024 = 60 &times; 1.2 = 72. Total 2024 = 72 + 37 + 30 = 139. Share = 72/139 = 51.80%. (Dividing by the old total 127 forgets that the total also grows.)`);
}

// ---- Set B: mixed-facing circular table ----
{
  const s = F.seatingPuzzle(2, { n: 8, mixed: true });
  s.qs.forEach(q => add(s.set, 'Data Arrangement', 'Circular table (mixed facing)', q.q, String(q.correct), q.wrongs.map(String), q.exp));
}

// ---- Set C: direction sense with turns ----
{
  // facing North at O. Turn list: [turn, km]
  const moves = [['', 9], ['R', 16], ['L', 7], ['L', 4]];
  const dv = { N: [0, 1], E: [1, 0], S: [0, -1], W: [-1, 0] }, cw = ['N', 'E', 'S', 'W'];
  let face = 0, x = 0, y = 0; const pts = [[0, 0]], segs = [], faces = [];
  moves.forEach(([t, d]) => { if (t === 'R') face = (face + 1) % 4; if (t === 'L') face = (face + 3) % 4; x += dv[cw[face]][0] * d; y += dv[cw[face]][1] * d; pts.push([x, y]); segs.push({ d: cw[face], len: d }); faces.push(cw[face]); });
  const names = { N: 'North', E: 'East', S: 'South', W: 'West' };
  const text = `Meena starts from O and walks ${moves[0][1]} km towards the North. ` + moves.slice(1).map(([t, d]) => `She turns ${t === 'R' ? 'right' : 'left'} and walks ${d} km.`).join(' ') + ' She stops at P.';
  const set = pp(text + ' The figure shows the route <b>without</b> distances.') + L.pathsFig([{ segs: segs.map(s => ({ ...s, label: ' ' })), k: 14, start: 'O', end: 'P' }], { boxW: 300, boxH: 220 });
  const [px, py] = [x, y];
  const dist = Math.hypot(px, py);
  const compass = (dx, dy) => { const v = dy > 0 ? 'North' : dy < 0 ? 'South' : '', h = dx > 0 ? 'East' : dx < 0 ? 'West' : ''; return v && h ? `${v}-${h}` : v || h; };
  add(set, 'Directional Sense', 'Turns', 'How far is P from the starting point O?', `${f2(dist)} km`, [`${moves.reduce((a, m) => a + m[1], 0)} km`, `${f2(Math.hypot(px + 2, py))} km`, `${f2(dist + 3)} km`, `${f2(Math.abs(px) + Math.abs(py))} km`],
    `Directions of the legs: ${faces.map(f => names[f]).join(', ')}. Net East = ${px} km, net North = ${py} km, so the distance is &radic;(${px}&sup2; + ${py}&sup2;) = ${f2(dist)} km. (${moves.reduce((a, m) => a + m[1], 0)} km is the total path length.)`);
  add(set, 'Directional Sense', 'Turns', 'In which direction is O from P?', compass(-px, -py), ['North-West', 'South-West', 'South-East', 'North-East', 'North', 'West'].filter(d => d !== compass(-px, -py)),
    `P is ${Math.abs(px)} km ${px >= 0 ? 'East' : 'West'} and ${Math.abs(py)} km ${py >= 0 ? 'North' : 'South'} of O, so O is to the ${compass(-px, -py)} of P.`);
}

// ---- Set D: syllogisms (model-checked) ----
{
  [11, 29].forEach(seed => {
    const sy = F.syllogism(seed), N = sy.N, t = s => sy.text(s);
    const set = pp(`<b>Statements:</b> I. ${t(sy.prem[0])}. II. ${t(sy.prem[1])}.<br><b>Conclusions:</b> I. ${t(sy.pair[0])}. II. ${t(sy.pair[1])}.`);
    const a = F.sylAnswer(sy.prem, sy.pair);
    const why = (c, f) => `"${t(c)}" ${f ? 'is true in every Venn diagram that satisfies both statements, so it follows' : 'can be false in at least one valid Venn diagram, so it does not definitely follow'}`;
    const o = F.SYL_OPTS.slice(); o.splice(0, 0);
    const ex = `${why(sy.pair[0], sy.f[0])}. ${why(sy.pair[1], sy.f[1])}.${a === 2 ? ' The two conclusions are complementary (one of them must be true), so either I or II follows.' : ''}`;
    mcq('R', 'Syllogisms', 'Which of the following is correct?', o, a, ex, { set, sub: 'Model-checked', ...MM });
  });
}

// ---- Data sufficiency with a figure ----
{
  const rect = L.fig(260, 170, R(30, 20, 200, 110) + L.L(30, 20, 230, 130, 'ln sb') + T(20, 16, 'A', { b: 1 }) + T(240, 16, 'B', { b: 1 }) + T(240, 146, 'C', { b: 1 }) + T(20, 146, 'D', { b: 1 }) + T(130, 168, 'ABCD is a rectangle; AC is a diagonal', { s: 11 }), 'Rectangle ABCD with diagonal AC');
  const set = dir('Each question is followed by two statements. Decide whether the statements are sufficient to answer it.') + rect + pp('What is the <b>perimeter</b> of rectangle ABCD?<br><b>I.</b> The diagonal AC is 10 cm long.<br><b>II.</b> The area of the rectangle is 48 sq cm.');
  const o = ['Statement I alone is sufficient', 'Statement II alone is sufficient', 'Either statement alone is sufficient', 'Both statements together are needed', 'Even both together are not sufficient'];
  // l^2+b^2=100, lb=48 -> (l+b)^2=196 -> l+b=14 -> perimeter 28 ; check by brute force on integers/reals
  const sols = []; for (let l = 1; l < 20; l += 0.5) for (let b = 1; b <= l; b += 0.5) if (Math.abs(l * l + b * b - 100) < 1e-9 && Math.abs(l * b - 48) < 1e-9) sols.push([l, b]);
  if (!sols.length) throw new Error('rect check');
  mcq('R', 'Data Sufficiency', 'Choose the correct option.', o, 3, 'I alone: many rectangles have a diagonal of 10 (6 &times; 8, 5 &times; 8.66, ...). II alone: many rectangles have area 48. Together: l&sup2; + b&sup2; = 100 and lb = 48, so (l + b)&sup2; = 100 + 96 = 196 and l + b = 14. Perimeter = 28 cm (the rectangle is 8 &times; 6). Both are needed.', { set, sub: 'Geometry', ...MM });
}

// ---- Statistical DI: table ----
{
  const rows = [['Class A', 30, 62], ['Class B', 20, 70], ['Class C', 25, 58]];
  const set = dir('The table shows the number of students and the average marks of three classes in a test.') + L.tbl(['Class', 'Students', 'Average marks'], rows);
  const tot = rows.reduce((a, r) => a + r[1] * r[2], 0), n = rows.reduce((a, r) => a + r[1], 0);
  // five students of class C, whose marks total 125, are moved to Class A... new overall unchanged; ask new average of class C if those 5 (avg 25) leave
  const newC = (25 * 58 - 5 * 25) / 20;
  add(set, 'Statistical Data Interpretation', 'Weighted average', 'Five students of Class C who together scored 125 marks leave the school. What is the new average of Class C?', f2(newC), [f2(58 + 25 / 5), '62.50', '58.00', '67.50'].filter(x => x !== f2(newC)).concat(['66.25']),
    `Class C total = 25 &times; 58 = 1450. After removing 125 marks: 1325 over 20 students = 66.25. (The students who left averaged only 25, so the class average rises.)`);
}

// ---- Coded blood relation ----
{
  const set = dir('In a certain code: A + B means A is the mother of B; A &minus; B means A is the brother of B; A &times; B means A is the father of B; A &divide; B means A is the sister of B.');
  add(set, 'Blood Relations', 'Coded relations', 'If P &times; Q &divide; R &minus; S, how is P related to S?', 'Father', ['Grandfather', 'Uncle', 'Brother', 'Mother'],
    'P &times; Q: P is the father of Q. Q &divide; R: Q is the sister of R, so R is also P\'s child. R &minus; S: R is the brother of S, so S is also P\'s child. Hence P is the father of S.');
}

// ---- Coding-decoding with a shift table ----
{
  const word = 'PLANET', shifts = [+1, -2, +3, -4, +5, -6];
  const enc = (w, sh) => w.split('').map((ch, i) => String.fromCharCode(((ch.charCodeAt(0) - 65 + sh[i % sh.length] + 26) % 26) + 65)).join('');
  const cells = (a) => a.map((s, i) => R(10 + i * 56, 38, 50, 28, 'paper sline') + T(35 + i * 56, 57, (s > 0 ? '+' : '') + s, { s: 14, b: 1 }) + T(35 + i * 56, 30, 'pos ' + (i + 1), { s: 11 })).join('');
  const fig = L.fig(350, 84, cells(shifts) + T(175, 82, 'Shift for each position (cyclic: after Z comes A)', { s: 11 }), 'Shift table');
  const set = dir('In a certain code every letter of a word is shifted forwards (+) or backwards (&minus;) by the number in the table, according to its position in the word. The pattern repeats for longer words.') + fig;
  add(set, 'Coding-Decoding', 'Shift code', 'What is the code for <b>MARKET</b>?', enc('MARKET', shifts), [enc('MARKET', [1, -2, 3, 4, 5, -6]), enc('MARKET', [1, -1, 3, -4, 5, -6]), enc('MARKET', [2, -2, 3, -4, 4, -6]), enc('MARKET', [1, -2, 3, -4, 5, 6])],
    `M+1 = ${enc('M', [1])}, A&minus;2 = ${enc('A', [-2])}, R+3 = ${enc('R', [3])}, K&minus;4 = ${enc('K', [-4])}, E+5 = ${enc('E', [5])}, T&minus;6 = ${enc('T', [-6])}. Code = ${enc('MARKET', shifts)}.`);
}

module.exports = L.bank;
