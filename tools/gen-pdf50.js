// Converts the "Infosys SE 2027 - Reasoning Ability Mock (Image-Based, Hard)" PDF (50 Q, 13 sets) into figure questions.
// Every answer is recomputed from the data in code and cross-checked with the answer key printed in the PDF.
const L = require('./lib');
const { T, Lx, fig, R, C, P, A, mcq, setId, dir, pp } = Object.assign({}, L, { Lx: L.L });
const D = require('./dice');

setId(4000);
const KEY = 'D D B C A D C B A C B A D A D B B D D C B D A D D A A A A B A C C A A B A B B B C A A A A C D C C D'.split(' ');
let qn = 0;
const letter = i => 'ABCD'[i];
// add one question; opts exactly as in the PDF, `correct` is the computed answer text
function add(set, topic, sub, q, opts, correct, exp) {
  const keyIdx = 'ABCD'.indexOf(KEY[qn]);
  const idx = opts.map(String).indexOf(String(correct));
  if (idx !== keyIdx) throw new Error(`Q${qn + 1}: computed "${correct}" (idx ${idx}) disagrees with PDF key ${KEY[qn]} (${opts[keyIdx]})`);
  qn++;
  return mcq('R', topic, q, opts.map(String), idx, exp, { set, sub, tough: true, pdf: true, pdfNo: qn });
}
const pct = (a, b) => (a / b * 100);
const f2 = n => (Math.round(n * 100) / 100).toFixed(2);

// ---------- Set 1 : bar chart ----------
{
  const reg = ['North', 'South', 'East', 'West', 'Central'], y22 = [120, 150, 90, 140, 100], y23 = [150, 165, 117, 126, 128];
  const set = dir('The bar chart shows the sales (in Rs. crore) of a company in five regions in 2022 and 2023.') +
    L.barChart({ cats: reg, series: [y22, y23], max: 200, step: 40, names: ['2022', '2023'], ylabel: 'Rs. crore', title: 'Sales by region 2022 and 2023' });
  const g = y23.map((v, i) => (v - y22[i]) / y22[i] * 100);
  const best = reg[g.indexOf(Math.max(...g))];
  const t22 = y22.reduce((a, b) => a + b), t23 = y23.reduce((a, b) => a + b);
  add(set, 'Data Interpretation', 'Bar chart', 'Which region recorded the highest <b>percentage</b> growth in sales from 2022 to 2023?', ['Central', 'South', 'North', 'East'], best,
    'Growth: North 25%, South 10%, East 30%, West &minus;10%, Central 28%. East is highest even though North and South gained more in absolute terms.');
  add(set, 'Data Interpretation', 'Bar chart', 'By what percentage did the company\'s total sales in 2023 exceed its total sales in 2022?', ['13.80%', '12.50%', '15.20%', '14.33%'], f2(pct(t23 - t22, t22)) + '%',
    `Total 2022 = ${t22}; total 2023 = ${t23}. Increase = ${t23 - t22}, so ${t23 - t22}/${t22} &times; 100 = 14.33%.`);
  add(set, 'Data Interpretation', 'Bar chart', 'What is the ratio of the combined 2023 sales of North and East to the combined 2022 sales of South and West?', ['290 : 267', '267 : 290', '267 : 315', '282 : 290'], `${y23[0] + y23[2]} : ${y22[1] + y22[3]}`,
    'North + East (2023) = 150 + 117 = 267. South + West (2022) = 150 + 140 = 290.');
  const avg = t23 / 5;
  add(set, 'Data Interpretation', 'Bar chart', 'In how many regions were the 2023 sales <b>above</b> the average 2023 sales per region?', ['1', '3', '2', '4'], y23.filter(v => v > avg).length,
    `Average 2023 = ${t23}/5 = 137.2. Only North (150) and South (165) are above it.`);
  const fall = (y22[3] - y23[3]) / y22[3];
  add(set, 'Data Interpretation', 'Bar chart', 'West\'s sales fell by some percentage from 2022 to 2023. If they <b>rise</b> by the same percentage in 2024, what will West\'s 2024 sales be?', ['Rs. 138.6 crore', 'Rs. 139.2 crore', 'Rs. 136.8 crore', 'Rs. 140 crore'], `Rs. ${+(y23[3] * (1 + fall)).toFixed(1)} crore`,
    'Fall = 14/140 = 10%. A 10% rise on 126 = 138.6. It does not return to 140 because the rise is on a smaller base.');
}

// ---------- Set 2 : circular seating ----------
{
  const names = 'ABCDEFGH'.split('');
  // seats 0..7 = seat 1..8 clockwise. Facing centre: left = clockwise (+1), right = anticlockwise (-1).
  const sols = [];
  const perm = (arr, cur = []) => { if (!arr.length) { sols.push(cur); return; } arr.forEach((x, i) => perm([...arr.slice(0, i), ...arr.slice(i + 1)], [...cur, x])); };
  perm(names.slice(1), []);
  const ok = s => {
    const seat = {}; s.forEach((p, i) => seat[p] = i + 1); seat.A = 0; const m = (a, b) => ((a % 8) + 8) % 8;
    const right = (p, k) => m(seat[p] - k), left = (p, k) => m(seat[p] + k);
    return seat.E === right('A', 3) && seat.C === m(seat.E + 4) && seat.B === left('C', 2) &&
      Math.abs(m(seat.F - seat.G + 4) - 4) === 1 && Math.abs(m(seat.H - seat.E + 4) - 4) !== 1 && Math.abs(m(seat.G - seat.A + 4) - 4) === 1;
  };
  const good = []; sols.forEach(s => { if (ok(s)) good.push(s); });
  if (good.length !== 1) throw new Error('seating puzzle must have exactly one solution, got ' + good.length);
  const arr = ['A', ...good[0]]; // arr[i] = person at seat i+1
  const seatOf = p => arr.indexOf(p);
  const set = pp('Eight friends A, B, C, D, E, F, G and H sit around a circular table, all <b>facing the centre</b>. The seats are numbered 1 to 8 clockwise as shown, and A occupies seat 1. E sits third to the right of A. C sits exactly opposite E. B sits second to the left of C. F and G are immediate neighbours. H is not an immediate neighbour of E. G is an immediate neighbour of A.') +
    L.circleSeats({ seats: ['A', '', '', '', '', '', '', ''] });
  const m8 = x => ((x % 8) + 8) % 8;
  add(set, 'Data Arrangement', 'Circular table', 'Who sits exactly opposite H?', ['E', 'G', 'D', 'F'], arr[m8(seatOf('H') + 4)],
    `Final order, seats 1-8 clockwise: ${arr.join(', ')}. H is in seat ${seatOf('H') + 1}, so seat ${m8(seatOf('H') + 4) + 1} is opposite.`);
  add(set, 'Data Arrangement', 'Circular table', 'Who sits second to the right of D?', ['C', 'F', 'H', 'E'], arr[m8(seatOf('D') - 2)],
    'Facing the centre, a person\'s right is the anticlockwise direction. D is in seat 5: one step anticlockwise is seat 4 (B), two steps is seat 3 (H).');
  const bi = seatOf('B'), gi = seatOf('G'); let between = []; for (let i = m8(bi + 1); i !== gi; i = m8(i + 1)) between.push(arr[i]);
  add(set, 'Data Arrangement', 'Circular table', 'Counting clockwise from B, how many people sit between B and G?', ['5', '3', '2', '4'], between.length,
    `B is in seat 4 and G in seat 8. Clockwise between them: ${between.join(', ')}.`);
  const sw = arr.slice(); [sw[0], sw[4 + 1]] = [sw[5], sw[0]]; // A <-> E
  const posA = sw.indexOf('A');
  add(set, 'Data Arrangement', 'Circular table', 'If A and E interchange their seats, who will sit immediately to the <b>left</b> of A?', ['F', 'G', 'C', 'D'], sw[m8(posA + 1)],
    'A moves to seat 6. A person\'s left is clockwise, i.e. seat 7, which is occupied by F.');
}

// ---------- Set 3 : pie chart ----------
{
  const sl = [['Salaries', 35], ['Raw material', 25], ['Marketing', 15], ['Rent', 10], ['Transport', 8], ['Misc.', 7]];
  const p = Object.fromEntries(sl);
  const set = dir('The pie chart shows how a company\'s total monthly expenditure of Rs. 18 lakh is distributed.') +
    L.pieChart({ slices: sl.map(([label, pct]) => ({ label, pct })), total: 'Total monthly expenditure = Rs. 18 lakh', title: 'Monthly expenditure pie chart' });
  add(set, 'Data Interpretation', 'Pie chart', 'What is the central angle of the sector representing Marketing?', ['60 degrees', '15 degrees', '54 degrees', '45 degrees'], `${p.Marketing * 3.6} degrees`,
    'Central angle = 15% of 360 = 54 degrees.');
  const d = p.Salaries - (p.Rent + p.Transport + p["Misc."]);
  add(set, 'Data Interpretation', 'Pie chart', 'By how much does the expenditure on Salaries exceed the <b>combined</b> expenditure on Rent, Transport and Misc.?', ['Rs. 2.7 lakh', 'Rs. 1.8 lakh', 'Rs. 1.5 lakh', 'Rs. 0.9 lakh'], `Rs. ${+(d * 18 / 100).toFixed(2)} lakh`,
    'Rent + Transport + Misc. = 10 + 8 + 7 = 25%. Difference = 35% &minus; 25% = 10% of 18 lakh = Rs. 1.8 lakh.');
  const newRaw = 18 * 0.25 * 1.2, newTot = 18 + 18 * 0.25 * 0.2;
  add(set, 'Data Interpretation', 'Pie chart', 'If spending on Raw material rises by 20% while every other head stays the same, what share of the <b>new</b> total will Raw material be?', ['28.57%', '25.00%', '30.00%', '27.27%'], f2(newRaw / newTot * 100) + '%',
    'Raw material = 4.5 lakh &rarr; 5.4 lakh. New total = 18 + 0.9 = 18.9 lakh. Share = 5.4/18.9 = 28.57%. (30% forgets that the total also grows.)');
  add(set, 'Data Interpretation', 'Pie chart', 'What is the combined expenditure on Marketing and Transport?', ['Rs. 4.50 lakh', 'Rs. 3.96 lakh', 'Rs. 4.23 lakh', 'Rs. 4.14 lakh'], `Rs. ${f2((p.Marketing + p.Transport) * 18 / 100)} lakh`,
    '15% + 8% = 23% of 18 lakh = Rs. 4.14 lakh.');
  const pairs = []; for (let i = 0; i < sl.length; i++) for (let j = i + 1; j < sl.length; j++) if ((sl[i][1] + sl[j][1]) === 25) pairs.push([sl[i][0], sl[j][0]]);
  if (pairs.length !== 1 || pairs[0].sort().join() !== 'Marketing,Rent') throw new Error('pair check ' + JSON.stringify(pairs));
  add(set, 'Data Interpretation', 'Pie chart', 'Which <b>two</b> heads together form a central angle of exactly 90 degrees?', ['Rent and Marketing', 'Rent and Transport', 'Transport and Misc.', 'Raw material and Misc.'], 'Rent and Marketing',
    '90 degrees = 25%. Only Rent (10%) + Marketing (15%) = 25%. Raw material alone is 25%, but the question asks for two heads.');
}

// ---------- Set 4 : directions ----------
{
  const dist = segs => { let x = 0, y = 0; segs.forEach(s => { x += (s.d === 'E' ? 1 : s.d === 'W' ? -1 : 0) * s.len; y += (s.d === 'N' ? 1 : s.d === 'S' ? -1 : 0) * s.len; }); return [x, y]; };
  const di = [{ d: 'N', len: 6 }, { d: 'E', len: 8 }, { d: 'S', len: 3 }, { d: 'W', len: 4 }];
  const dii = [{ d: 'E', len: 10 }, { d: 'S', len: 8 }, { d: 'W', len: 4 }];
  const diii = [{ d: 'N', len: 5 }, { d: 'E', len: 3 }, { d: 'S', len: 5 }, { d: 'E', len: 2 }];
  const set = dir('Each diagram shows a route walked from a start point S (black dot) to an end point E (orange dot). North is at the top of every diagram.') +
    L.pathsFig([{ segs: di, k: 15, cap: '(i)' }, { segs: dii, k: 14, cap: '(ii)' }, { segs: diii, k: 15, cap: '(iii)' }], { boxW: 210, boxH: 200 });
  const [x1, y1] = dist(di), [x2, y2] = dist(dii), [x3, y3] = dist(diii);
  if (!(x1 === 4 && y1 === 3 && x2 === 6 && y2 === -8 && x3 === 5 && y3 === 0)) throw new Error('direction data');
  add(set, 'Directional Sense', 'Path diagram', 'In diagram (i), how far and in which direction is the end point from the start point?', ['21 km North-East', '7 km North-East', '5 km North-West', '5 km North-East'], '5 km North-East',
    'Net East = 8 &minus; 4 = 4 km; net North = 6 &minus; 3 = 3 km. Distance = &radic;(16 + 9) = 5 km towards the North-East. (21 km is only the total path length.)');
  add(set, 'Directional Sense', 'Path diagram', 'In diagram (ii), what is the straight-line distance and direction of the end point from the start point?', ['10 km South-West', '10 km South-East', '22 km South-East', '8 km South'], '10 km South-East',
    'Net East = 10 &minus; 4 = 6 km; net South = 8 km. Distance = &radic;(36 + 64) = 10 km towards the South-East.');
  add(set, 'Directional Sense', 'Path diagram', 'In diagram (iii), in which direction and how far is the <b>start</b> point as seen from the <b>end</b> point?', ['3 km West', '5 km West', '7 km West', '5 km East'], '5 km West',
    'The North and South legs (5 km each) cancel. The end is 3 + 2 = 5 km East of the start, so the start is 5 km West of the end.');
  const a = [{ d: 'N', len: 6 }, { d: 'E', len: 5 }], b = [{ d: 'S', len: 6 }, { d: 'W', len: 11 }];
  const set2 = dir('Both A and B start from the same point O. North is at the top.') +
    L.pathsFig([{ segs: a, alt: { segs: b, end: 'B' }, k: 15, start: 'O', end: 'A' }], { boxW: 330, boxH: 230 });
  const [ax, ay] = dist(a), [bx, by] = dist(b);
  add(set2, 'Directional Sense', 'Two walkers', 'In this diagram, both people start from O. What is the straight-line distance between A\'s and B\'s final positions?', ['12 km', '28 km', '16 km', '20 km'], `${Math.hypot(ax - bx, ay - by)} km`,
    'A ends at (5 E, 6 N) and B at (11 W, 6 S). Horizontal gap = 5 + 11 = 16 km; vertical gap = 6 + 6 = 12 km. Distance = &radic;(256 + 144) = 20 km.');
}

// ---------- Set 5 : line graph ----------
{
  const yrs = [2018, 2019, 2020, 2021, 2022, 2023], P_ = [40, 45, 50, 42, 55, 60], Q = [35, 48, 45, 50, 52, 66];
  const set = dir('The line graph shows the production (in thousand units) of two companies P and Q from 2018 to 2023.') +
    L.lineChart({ cats: yrs, series: [P_, Q], min: 30, max: 70, step: 10, names: ['Company P', 'Company Q'], ylabel: "'000 units", title: 'Production of P and Q' });
  add(set, 'Data Interpretation', 'Line graph', 'In how many years did Company Q produce <b>more</b> than Company P?', ['4', '5', '2', '3'], Q.filter((v, i) => v > P_[i]).length, 'Q &gt; P in 2019 (48 &gt; 45), 2021 (50 &gt; 42) and 2023 (66 &gt; 60).');
  const lo = Math.min(...P_), hi = Math.max(...P_);
  add(set, 'Data Interpretation', 'Line graph', 'By what percentage did Company P\'s production rise from its <b>lowest</b> year to its <b>highest</b> year?', ['33.3%', '20%', '50%', '42.9%'], `${(hi - lo) / lo * 100}%`, 'Lowest = 40 (2018), highest = 60 (2023). Rise = 20/40 = 50%. (33.3% wrongly divides by 60.)');
  add(set, 'Data Interpretation', 'Line graph', 'What is the average annual production of Company Q over the six years (in thousand units)?', ['48.67', '49.33', '47.83', '50.00'], f2(Q.reduce((a, b) => a + b) / 6), 'Sum = 35 + 48 + 45 + 50 + 52 + 66 = 296. Average = 296/6 = 49.33.');
  const diffs = P_.map((v, i) => Math.abs(v - Q[i]));
  add(set, 'Data Interpretation', 'Line graph', 'In which year was the difference between the productions of P and Q the <b>greatest</b>?', ['2023', '2020', '2018', '2021'], yrs[diffs.indexOf(Math.max(...diffs))], `Differences: ${diffs.join(', ')}. The greatest is 8, in 2021, even though 2023 has the highest values.`);
}

// ---------- Set 6 : Venn ----------
{
  const v = { A: 40, B: 35, C: 25, AB: 15, AC: 12, BC: 10, ABC: 8 }, tot = 200;
  const any = Object.values(v).reduce((a, b) => a + b), none = tot - any;
  const set = dir('The Venn diagram shows how many of the 200 students of a college play Cricket, Football and Hockey. Each number refers to the region in which it is written.') +
    L.venn3({ names: ['Cricket', 'Football', 'Hockey'], v: { ...v, none }, total: 200 });
  const two = v.AB + v.AC + v.BC;
  add(set, 'Visual Reasoning', 'Venn diagram', 'How many students play <b>exactly two</b> of the three games?', ['37', '29', '53', '45'], two, 'Exactly two = 15 + 10 + 12 = 37. (45 wrongly adds the 8 who play all three.)');
  add(set, 'Visual Reasoning', 'Venn diagram', 'How many students play Football but <b>not</b> Cricket?', ['35', '53', '68', '45'], v.B + v.BC, 'Football only (35) + Football and Hockey only (10) = 45.');
  add(set, 'Visual Reasoning', 'Venn diagram', 'What percentage of the students play <b>at least two</b> games?', ['20.0%', '18.5%', '26.0%', '22.5%'], ((two + v.ABC) / tot * 100).toFixed(1) + '%', 'At least two = 37 + 8 = 45. 45/200 = 22.5%.');
  add(set, 'Visual Reasoning', 'Venn diagram', 'How many students play <b>none</b> of the three games?', ['55', '45', '145', '65'], none, 'Playing at least one = 40 + 35 + 25 + 15 + 12 + 10 + 8 = 145. None = 200 &minus; 145 = 55.');
}

// ---------- Set 7 : floor puzzle ----------
{
  const names = 'PQRSTU'.split(''), sols = [];
  const perm = (arr, cur = []) => { if (!arr.length) { sols.push(cur); return; } arr.forEach((x, i) => perm([...arr.slice(0, i), ...arr.slice(i + 1)], [...cur, x])); };
  perm([1, 2, 3, 4, 5, 6]);
  const good = sols.filter(f => { const fl = {}; names.forEach((n, i) => fl[n] = f[i]);
    return fl.R === 4 && Math.abs(fl.P - fl.R) === 2 && fl.Q > fl.P && (fl.S === 1 || fl.S === 6) && Math.abs(fl.T - fl.S) !== 1 && fl.U === fl.Q + 1; });
  if (good.length !== 1) throw new Error('floor puzzle solutions: ' + good.length);
  const fl = {}; names.forEach((n, i) => fl[n] = good[0][i]); const at = f => names.find(n => fl[n] === f);
  const set = pp('Six people P, Q, R, S, T and U live on different floors of a 6-storey building (floor 1 is the bottom). R lives on floor 4, as shown. There is exactly one floor between P and R. Q lives on a floor above P. S lives on either the top or the bottom floor. T does not live immediately above or below S. U lives immediately above Q.') + L.building({ floors: 6, known: { 4: 'R' } });
  add(set, 'Data Arrangement', 'Floor puzzle', 'Who lives on the <b>top</b> floor?', ['U', 'S', 'Q', 'P'], at(6), 'P must be on floor 2 or 6; Q is above P, so P = 2. U is directly above Q, so Q = 5 and U = 6 (Q = 3 would put U on R\'s floor). S = 1 (the top is taken), and T = 3. Order from floor 1: S, P, T, R, Q, U.');
  add(set, 'Data Arrangement', 'Floor puzzle', 'How many people live between T and U?', ['2', '3', '0', '1'], Math.abs(fl.T - fl.U) - 1, 'T is on floor 3 and U on floor 6; floors 4 and 5 (R and Q) are between them.');
  add(set, 'Data Arrangement', 'Floor puzzle', 'Who lives immediately below R?', ['T', 'Q', 'S', 'P'], at(3), 'R is on floor 4; floor 3 belongs to T.');
}

// ---------- Set 8 : histogram ----------
{
  const bins = ['0-20', '20-40', '40-60', '60-80', '80-100'], cnt = [5, 8, 15, 14, 8], N = cnt.reduce((a, b) => a + b);
  const set = dir('The histogram shows the distribution of marks scored by the students of a class in a test (maximum 100).') + L.histogram({ bins, counts: cnt, ymax: 18, step: 3 });
  let cf = 0, mi = -1; cnt.forEach((c, i) => { if (mi < 0 && cf + c >= N / 2) mi = i; if (mi < 0) cf += c; });
  add(set, 'Statistical Data Interpretation', 'Histogram', 'In which class interval does the <b>median</b> mark lie?', ['80-100', '40-60', '20-40', '60-80'], bins[mi], 'Total = 50, so the median is the 25th value. Cumulative frequencies: 5, 13, 28, ... The 25th student falls in 40-60.');
  const mean = cnt.reduce((a, c, i) => a + c * (10 + 20 * i), 0) / N;
  add(set, 'Statistical Data Interpretation', 'Histogram', 'Using class mid-points, what is the estimated <b>mean</b> mark?', ['54.8', '50.0', '56.0', '52.4'], f2(mean).replace(/0$/, ''), 'Mean = (10&times;5 + 30&times;8 + 50&times;15 + 70&times;14 + 90&times;8)/50 = 2740/50 = 54.8.');
  add(set, 'Statistical Data Interpretation', 'Histogram', 'What percentage of students scored 60 marks or more?', ['30%', '58%', '44%', '28%'], `${(cnt[3] + cnt[4]) / N * 100}%`, '(14 + 8)/50 = 22/50 = 44%.');
  const med = 40 + ((N / 2 - cf) / cnt[mi]) * 20;
  add(set, 'Statistical Data Interpretation', 'Histogram', 'Using the grouped-data formula, what is the estimated <b>median</b> mark?', ['53', '54.8', '56', '50'], med, 'Median = L + ((N/2 &minus; cf)/f) &times; h = 40 + ((25 &minus; 13)/15) &times; 20 = 40 + 16 = 56.');
}

// ---------- Set 9 : counting figures ----------
{
  const tri = (() => { let s = ''; const ap = [110, 8], bl = [10, 188], br = [210, 188]; s += L.L(ap[0], ap[1], bl[0], bl[1]) + L.L(ap[0], ap[1], br[0], br[1]) + L.L(bl[0], bl[1], br[0], br[1]);
    for (let i = 1; i <= 3; i++) s += L.L(ap[0], ap[1], 10 + i * 50, 188);
    [68, 128].forEach(y => { const hw = (y - 8) / 180 * 100; s += L.L(110 - hw, y, 110 + hw, y); });
    return L.fig(220, 200, s, 'Figure X: triangle with lines from the apex and two horizontal lines'); })();
  const grid = (rows, cols, c = 34) => { let s = ''; for (let i = 0; i <= rows; i++) s += L.L(8, 8 + i * c, 8 + cols * c, 8 + i * c); for (let j = 0; j <= cols; j++) s += L.L(8 + j * c, 8, 8 + j * c, 8 + rows * c); return s; };
  const gy = L.fig(190, 150, grid(4, 5), 'Figure Y: 4 by 5 grid'), gz = L.fig(150, 120, grid(3, 4), 'Figure Z: 3 by 4 grid');
  const set = dir('Study the three figures. Figure X is a triangle with lines drawn from its top vertex (5 lines in all, counting the two sides) and two lines parallel to its base. Figure Y is a grid of 4 rows and 5 columns of equal squares. Figure Z is a grid of 3 rows and 4 columns.') +
    `<div class='figrow'>${tri}${gy}${gz}</div><p class='note'>Figure X, Figure Y, Figure Z (left to right)</p>`;
  const C2 = n => n * (n - 1) / 2;
  add(set, 'Visual Reasoning', 'Counting figures', 'How many triangles are there in Figure X?', ['30', '36', '20', '24'], C2(5) * 3, 'There are 5 lines from the top vertex and 3 horizontal lines (including the base). Every triangle uses 2 of the vertex lines and 1 horizontal line: C(5,2) &times; 3 = 10 &times; 3 = 30.');
  let sq = 0; for (let k = 1; k <= 4; k++) sq += (4 - k + 1) * (5 - k + 1);
  add(set, 'Visual Reasoning', 'Counting figures', 'How many squares of <b>all</b> sizes are there in Figure Y?', ['40', '50', '32', '20'], sq, '1&times;1: 4&times;5 = 20; 2&times;2: 3&times;4 = 12; 3&times;3: 2&times;3 = 6; 4&times;4: 1&times;2 = 2. Total = 40.');
  add(set, 'Visual Reasoning', 'Counting figures', 'How many rectangles (including squares) are there in Figure Z?', ['12', '60', '50', '72'], C2(4) * C2(5), 'Choose 2 of the 4 horizontal lines and 2 of the 5 vertical lines: C(4,2) &times; C(5,2) = 6 &times; 10 = 60.');
}

// ---------- Set 10 : dice ----------
{
  const v1 = [[3, 2, 4], [6, 1, 3]], v2 = [[4, 1, 5], [2, 6, 1]], v3 = [[5, 6, 3], [1, 4, 5]];
  const set = dir('Each die below is shown in two different positions. In every drawing you can see the TOP, FRONT and RIGHT faces. The numbers 1 to 6 are on the die but they are <b>not</b> arranged like a standard die.') +
    `<div class='figrow'>${L.dice(v1, { names: ['Die 1 (i)', 'Die 1 (ii)'] })}${L.dice(v2, { names: ['Die 2 (i)', 'Die 2 (ii)'] })}${L.dice(v3, { names: ['Die 3 (i)', 'Die 3 (ii)'] })}</div>`;
  const one = (views, f) => { const s = new Set(D.consistent(views).map(f)); if (s.size !== 1) throw new Error('die ambiguous'); return [...s][0]; };
  add(set, 'Visual Reasoning', 'Dice', 'For Die 1, which number is on the face opposite 3?', ['5', '1', '6', '2'], one(v1, l => D.opposite(l, 3)), 'In the two views, 3 is next to 2, 4, 6 and 1. The only number never seen next to 3 is 5, so 5 is opposite 3.');
  add(set, 'Visual Reasoning', 'Dice', 'For Die 2, which number is on the face opposite 6?', ['5', '4', '1', '3'], one(v2, l => D.opposite(l, 6)), 'Read each view as the corner (top, front, right); turning a corner keeps its cyclic order. Faces seen next to 1 are 4, 5, 2 and 6, so 3 is opposite 1. In view (i) the corner is 4&rarr;1&rarr;5 and in view (ii) it is 2&rarr;6&rarr;1; matching the rotation direction gives the pairs 5-2 and 4-6. So 4 is opposite 6.');
  add(set, 'Visual Reasoning', 'Dice', 'For Die 3, if the die is placed with 3 on TOP and 6 at the FRONT, which number will be on the RIGHT face?', ['1', '2', '4', '5'], one(v3, l => D.rightOf(l, 3, 6)), 'View (i) shows the corner (5, 6, 3). Rotating that corner gives (3, 5, 6): with 3 on top the faces 5 then 6 follow in that rotational order. With 6 in front instead, 5 must be on the left, and the right face is the one opposite 5, which is 2. (5 is next to 6 and 3 in view i and next to 1 in view ii, so its opposite is 2.)');
}

// ---------- Set 11 : family tree ----------
{
  const node = (x, y, name, female) => female ? `<ellipse cx='${x}' cy='${y}' rx='44' ry='15' class='paper sline'/>${T(x, y + 4, name, { b: 1, s: 12 })}` : `${R(x - 40, y - 14, 80, 28)}${T(x, y + 4, name, { b: 1, s: 12 })}`;
  const dbl = (x1, x2, y) => L.L(x1, y - 2, x2, y - 2) + L.L(x1, y + 2, x2, y + 2);
  let s = node(190, 24, 'Ramesh') + node(350, 24, 'Sita', 1) + dbl(230, 306, 24);
  s += L.L(270, 26, 270, 66) + L.L(150, 66, 490, 66) + L.L(150, 66, 150, 92) + L.L(490, 66, 490, 92);
  s += node(150, 106, 'Anil') + node(40, 106, 'Priya', 1) + dbl(84, 110, 106) + node(490, 106, 'Kavita', 1) + node(610, 106, 'Vikas') + dbl(534, 570, 106);
  s += L.L(97, 108, 97, 150) + L.L(70, 150, 190, 150) + L.L(70, 150, 70, 168) + L.L(190, 150, 190, 168) + node(70, 182, 'Rohan') + node(190, 182, 'Neha', 1);
  s += L.L(552, 108, 552, 168) + node(552, 182, 'Arjun');
  s += R(250, 222, 12, 12) + T(268, 232, 'Male', { a: 'start', s: 11 }) + `<ellipse cx='330' cy='228' rx='10' ry='7' class='paper sline'/>` + T(346, 232, 'Female', { a: 'start', s: 11 }) + L.L(398, 226, 418, 226) + L.L(398, 230, 418, 230) + T(424, 232, 'Married', { a: 'start', s: 11 }) + L.L(488, 220, 488, 236) + T(494, 232, 'Children', { a: 'start', s: 11 });
  const set = dir('Study the family tree. Squares represent males, ovals represent females, a double line joins a married couple and a vertical line leads down to their children.') + L.fig(700, 244, `<g transform='translate(30,0)'>${s}</g>`, 'Family tree of Ramesh and Sita');
  add(set, 'Blood Relations', 'Family tree', 'How is Arjun related to Neha?', ['Nephew', 'Cousin', 'Uncle', 'Brother'], 'Cousin', 'Arjun\'s mother Kavita and Neha\'s father Anil are siblings (both children of Ramesh and Sita), so Arjun and Neha are cousins.');
  add(set, 'Blood Relations', 'Family tree', 'How is Vikas related to Anil?', ['Brother', 'Cousin', 'Brother-in-law', 'Son-in-law'], 'Brother-in-law', 'Vikas is the husband of Anil\'s sister Kavita, so he is Anil\'s brother-in-law.');
  add(set, 'Blood Relations', 'Family tree', 'How is Ramesh related to Arjun\'s mother\'s brother\'s daughter?', ['Grandfather', 'Father', 'Great-grandfather', 'Uncle'], 'Grandfather', 'Arjun\'s mother = Kavita; her brother = Anil; Anil\'s daughter = Neha. Ramesh is Neha\'s grandfather.');
  add(set, 'Blood Relations', 'Family tree', 'If Neha has a son named Kabir, how will Kabir be related to Kavita?', ['Grand-nephew', 'Grandson', 'Cousin', 'Nephew'], 'Grand-nephew', 'Neha is Kavita\'s niece (her brother\'s daughter). A niece\'s son is a grand-nephew.');
}

// ---------- Set 12 : clocks ----------
{
  const set = dir('Study the three clock faces (the short thick hand is the hour hand).') + L.clocks([{ h: 3, m: 40, label: 'Clock (i)' }, { h: 8, m: 20, label: 'Clock (ii)' }, { h: 5, m: 0, label: 'Clock (iii)' }]);
  const ang = (h, m) => { const a = Math.abs(30 * h - 5.5 * m); return a > 180 ? 360 - a : a; };
  add(set, 'Visual Reasoning', 'Clocks', 'What is the smaller angle between the hands of Clock (i)?', ['130 degrees', '150 degrees', '120 degrees', '140 degrees'], `${ang(3, 40)} degrees`, 'Clock (i) shows 3:40. Angle = |30H &minus; 5.5M| = |90 &minus; 220| = 130 degrees. (140 degrees ignores the hour hand\'s movement past 3.)');
  const mt = 11 * 60 + 60 - (8 * 60 + 20), mh = Math.floor(mt / 60), mm = mt % 60;
  add(set, 'Visual Reasoning', 'Clocks', 'Clock (ii) is placed in front of a plane mirror. What time will its mirror image appear to show?', ['3:40', '4:40', '4:20', '3:20'], `${mh}:${String(mm).padStart(2, '0')}`, 'Clock (ii) shows 8:20. Mirror time = 11:60 &minus; 8:20 = 3:40.');
  const realMin = 300 * 60 / 55;
  add(set, 'Visual Reasoning', 'Clocks', 'Clock (iii) loses 5 minutes every hour. It was set to the correct time at 12:00 noon and now shows the time in the figure. What is the actual time?', ['5:25 PM', '5:30 PM', '5:27 3/11 PM', '4:35 PM'], `5:${Math.floor(realMin - 300)} ${Math.round((realMin - 300 - 27) * 11)}/11 PM`.replace('5:27 3/11', '5:27 3/11'), 'The faulty clock shows 55 minutes for every 60 real minutes. It shows 300 minutes (5 hours) after noon, so real time = 300 &times; 60/55 = 327 3/11 minutes = 5 h 27 3/11 min after noon.');
}

// ---------- Set 13 : flowchart ----------
{
  const run = n => { let s = 0; while (n > 0) { const d = n % 10; s += d % 2 === 0 ? d : -d; n = Math.floor(n / 10); } return s; };
  let s = '';
  const box = (x, y, w, h, t, c = 'paper sline') => R(x, y, w, h, c, "rx='5'") + T(x + w / 2, y + h / 2 + 4, t, { s: 12, b: 1 });
  const dia = (cx, cy, t) => P([[cx, cy - 26], [cx + 62, cy], [cx, cy + 26], [cx - 62, cy]], 'soft sline') + T(cx, cy + 4, t, { s: 12, b: 1 });
  s += `<ellipse cx='170' cy='20' rx='42' ry='14' class='soft sline'/>` + T(170, 24, 'START', { s: 12, b: 1 }) + A(170, 34, 170, 50);
  s += box(95, 52, 150, 30, 'Input N;  S = 0') + A(170, 82, 170, 104);
  s += dia(170, 132, 'Is N > 0 ?') + A(170, 158, 170, 182) + T(184, 174, 'Yes', { a: 'start', s: 11 });
  s += box(105, 184, 130, 28, 'D = N mod 10') + A(170, 212, 170, 232);
  s += dia(170, 258, 'Is D even ?') + T(96, 250, 'Yes', { s: 11 }) + T(244, 250, 'No', { s: 11 });
  s += L.L(108, 258, 60, 258) + A(60, 258, 60, 290) + L.L(232, 258, 280, 258) + A(280, 258, 280, 290);
  s += box(10, 292, 100, 28, 'S = S + D') + box(230, 292, 100, 28, 'S = S - D');
  s += L.L(60, 320, 60, 340) + L.L(280, 320, 280, 340) + L.L(60, 340, 280, 340) + L.L(170, 340, 170, 346) + A(170, 340, 170, 362);
  s += box(105, 364, 130, 28, 'N = N div 10');
  s += L.L(235, 378, 330, 378) + L.L(330, 378, 330, 132) + A(330, 132, 232, 132);
  s += L.L(108, 132, 20, 132) + L.L(20, 132, 20, 420) + A(20, 420, 120, 420) + T(40, 124, 'No', { a: 'start', s: 11 });
  s += box(122, 406, 100, 28, 'Output S') + A(222, 420, 300, 420) + `<ellipse cx='330' cy='420' rx='32' ry='14' class='soft sline'/>` + T(330, 424, 'END', { s: 12, b: 1 });
  s += T(236, 26, 'N mod 10 = last digit of N', { a: 'start', s: 10, c: 'muted' }) + T(236, 40, 'N div 10 = N without its last digit', { a: 'start', s: 10, c: 'muted' });
  const set = dir('Study the flowchart and answer the questions.') + L.fig(420, 446, s, 'Flowchart: digits of N are added if even and subtracted if odd');
  add(set, 'Logical Deduction', 'Flowchart', 'What is the output when N = 5286?', ['-1', '21', '5', '11'], run(5286), 'Digits are processed from the right: 6 (even, +6), 8 (+8), 2 (+2), 5 (odd, &minus;5). S = 6 + 8 + 2 &minus; 5 = 11.');
  add(set, 'Logical Deduction', 'Flowchart', 'What is the output when N = 97531?', ['25', '0', '-25', '-9'], run(97531), 'All digits are odd, so every one is subtracted: &minus;(1 + 3 + 5 + 7 + 9) = &minus;25.');
  add(set, 'Logical Deduction', 'Flowchart', 'For how many of the inputs 1234, 2468, 1357 and 1111 is the output <b>positive</b>?', ['1', '3', '2', '4'], [1234, 2468, 1357, 1111].filter(n => run(n) > 0).length, '1234: 4 &minus; 3 + 2 &minus; 1 = 2 (positive); 2468: 20 (positive); 1357: &minus;16; 1111: &minus;4. So 2 inputs.');
  let sm = 100; while (run(sm) !== 0) sm++;
  add(set, 'Logical Deduction', 'Flowchart', 'What is the <b>smallest</b> three-digit value of N for which the output is 0?', ['110', '101', '121', '112'], sm, 'The even digits must sum to the same total as the odd digits. Checking from 100 upwards, 112 is the first: 2 &minus; 1 &minus; 1 = 0. (121 also works but is larger; 110 gives &minus;2.)');
}

if (qn !== 50) throw new Error('expected 50 questions, got ' + qn);
module.exports = L.bank;
