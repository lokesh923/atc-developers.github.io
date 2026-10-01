// Practice bank - Technical part 2: simplification, algebra, ratios, pipes and cisterns (with tank figures), discounts.
const L = require('./lib');
const { RNG, opts } = require('./rng');
const { mcq, dir, pp, T, R, C, P } = L;
const f2 = n => String(+n.toFixed(2));
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const frac = (n, d) => { const g = gcd(Math.abs(n), Math.abs(d)); return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`; };
L.setId(7500);
let slot = 2;
const nextPos = () => (slot = (slot * 5 + 3) % 4);
const add = (set, topic, sub, q, correct, wrongs, exp) => { const o = opts(correct, wrongs, nextPos(), k => String(correct) + ' ' + k); return mcq('T', topic, q, o.opts, o.ans, exp, { ...(set ? { set } : {}), sub, tough: true }); };
const near = v => [v + 2, v - 3, v + 7, v * 2, v - 10, v + 12];

// ---------- simplification ----------
function simpSet(seed) {
  const r = RNG(seed), kind = seed % 4;
  if (kind === 0) { const a = r.int(2, 9) * 12, b = r.int(2, 5), c = r.int(2, 9), d = r.int(10, 40); const v = a / b * c - d, wrong1 = a / (b * c) - d, wrong2 = a / b * (c - d);
    add(null, 'Simplification', 'BODMAS', `${a} &divide; ${b} &times; ${c} &minus; ${d} = ?`, f2(v), [f2(wrong1), f2(wrong2), f2(v + 5), f2(v - 6)], `Divide and multiply from left to right first: ${a} &divide; ${b} = ${a / b}; &times; ${c} = ${a / b * c}; then subtract ${d}: ${f2(v)}. (Doing ${b} &times; ${c} first gives ${f2(wrong1)}, which is wrong.)`); }
  if (kind === 1) { const p = r.pick([12.5, 25, 37.5, 62.5]), q = r.pick([8, 16, 24, 40, 48]), a = r.pick([80, 160, 240, 320, 480]), b = r.pick([40, 64, 72, 96]); const v = a * p / 100 + b * q / 100 * 4;
    add(null, 'Simplification', 'Percentages', `${p}% of ${a} + ${4 * q}% of ${b} = ?`, f2(v), [f2(a * p / 100 + b * q / 100), f2(v + 10), f2(v - 12), f2(a * p / 100 * b * q / 100)], `${p}% of ${a} = ${a * p / 100}. ${4 * q}% of ${b} = ${f2(b * 4 * q / 100)}. Sum = ${f2(v)}.`); }
  if (kind === 2) { const n1 = r.int(2, 9), d1 = r.pick([3, 4, 5, 6, 7]), n2 = r.int(2, 9), d2 = r.pick([2, 3, 4, 5]), k = r.int(2, 6) * 6; if (d1 === d2) return simpSet(seed + 70); const num = n1 * d2 + n2 * d1, den = d1 * d2; const v = num * k / den;
    if (!Number.isInteger(v)) return simpSet(seed + 70);
    add(null, 'Simplification', 'Fractions', `(${n1}/${d1} + ${n2}/${d2}) of ${k} = ?`, String(v), [String(v + 3), String(v - 4), String(Math.round(k * n1 / d1)), String(v + 8)], `${n1}/${d1} + ${n2}/${d2} = ${num}/${den}. "Of ${k}" means multiply: ${num}/${den} &times; ${k} = ${v}.`); }
  if (kind === 3) { const a = r.int(11, 29), b = r.int(2, 9); const v = a * a - b * b, w = (a - b) * (a - b);
    add(null, 'Simplification', 'Squares', `${a}&sup2; &minus; ${b}&sup2; = ?`, String(v), [String(w), String(v + 2 * b), String(a * a - b), String(v - 10)], `${a}&sup2; &minus; ${b}&sup2; = (${a} + ${b})(${a} &minus; ${b}) = ${a + b} &times; ${a - b} = ${v}. (${w} is (a &minus; b)&sup2;, a common slip.)`); }
}
// ---------- algebra ----------
function algebraSet(seed) {
  const r = RNG(seed), kind = seed % 5;
  if (kind === 0) { const k = r.int(3, 9); add(null, 'Algebra', 'Identities', `If x + 1/x = ${k}, what is x&sup2; + 1/x&sup2;?`, String(k * k - 2), [String(k * k), String(k * k + 2), String(2 * k), String(k * k - 4)], `Square both sides: x&sup2; + 2 + 1/x&sup2; = ${k * k}, so x&sup2; + 1/x&sup2; = ${k * k - 2}.`); }
  if (kind === 1) { const a = r.int(3, 9), b = r.int(2, 12); add(null, 'Algebra', 'Identities', `If a + b = ${a + b} and ab = ${a * b}, what is a&sup2; + b&sup2;?`, String(a * a + b * b), [String((a + b) * (a + b)), String(a * a + b * b + 2 * a * b), String(a * a + b * b - 2 * a * b), String(a * b * 2)], `a&sup2; + b&sup2; = (a + b)&sup2; &minus; 2ab = ${(a + b) ** 2} &minus; ${2 * a * b} = ${a * a + b * b}.`); }
  if (kind === 2) { const p = r.int(2, 9), q = r.int(2, 9); add(null, 'Algebra', 'Quadratic roots', `What is the sum of the squares of the roots of x&sup2; &minus; ${p + q}x + ${p * q} = 0?`, String(p * p + q * q), [String((p + q) ** 2), String(p * q), String(p * p + q * q + 2), String(p + q)], `Roots are ${p} and ${q} (sum ${p + q}, product ${p * q}). Sum of squares = ${p + q}&sup2; &minus; 2 &times; ${p * q} = ${p * p + q * q}.`); }
  if (kind === 3) { const x = r.int(3, 12), y = r.int(2, 9), a = r.int(2, 4), b = r.int(2, 4); add(null, 'Algebra', 'Simultaneous equations', `${a}x + ${b}y = ${a * x + b * y} and x &minus; y = ${x - y}. What is x + y?`, String(x + y), [String(x + y + 2), String(x - y), String(a * x + b * y), String(x + y - 3)], `From the second equation x = y + ${x - y}. Substituting: ${a}(y + ${x - y}) + ${b}y = ${a * x + b * y}, so ${a + b}y = ${a * x + b * y - a * (x - y)} and y = ${y}, x = ${x}. x + y = ${x + y}.`); }
  if (kind === 4) { const age = r.int(10, 18), f = r.int(3, 4) * age; const yrs = r.int(4, 10); const fa = f; const ratioNow = `${fa / gcd(fa, age)}:${age / gcd(fa, age)}`; const later = fa + yrs, sa = age + yrs; add(null, 'Algebra', 'Ages', `A father is ${fa / age} times as old as his son. After ${yrs} years the sum of their ages will be ${later + sa}. What is the son's present age?`, String(age), [String(age + 2), String(age - 3), String(fa), String(age + 5)], `Let the son be x, the father ${fa / age}x. After ${yrs} years: ${fa / age}x + x + ${2 * yrs} = ${later + sa}, so ${fa / age + 1}x = ${later + sa - 2 * yrs} and x = ${age}.`); }
}
// ---------- ratios ----------
function ratioSet(seed) {
  const r = RNG(seed), kind = seed % 4;
  if (kind === 0) { const a = r.int(2, 5), b = r.int(2, 6), c = r.int(2, 7), tot = (a + b + c) * r.int(30, 90); add(null, 'Ratios and Proportions', 'Sharing', `Rs ${tot} is divided among A, B and C in the ratio ${a} : ${b} : ${c}. How much does B get more than A?`, `Rs ${(b - a) * tot / (a + b + c)}`, [`Rs ${b * tot / (a + b + c)}`, `Rs ${(c - a) * tot / (a + b + c)}`, `Rs ${(b - a) * tot / (a + b + c) + 30}`, `Rs ${tot / (a + b + c)}`], `One part = ${tot}/${a + b + c} = ${tot / (a + b + c)}. B &minus; A = (${b} &minus; ${a}) parts = Rs ${(b - a) * tot / (a + b + c)}.`); }
  if (kind === 1) { const a = r.int(2, 5), b = r.int(a + 1, 7), c = r.int(2, 5), d = r.int(c + 1, 8); if (gcd(a, b) !== 1 || gcd(c, d) !== 1) return ratioSet(seed + 13); const m = b * c, parts = [a * c, b * c, b * d]; const g = parts.reduce(gcd); add(null, 'Ratios and Proportions', 'Combining ratios', `If A : B = ${a} : ${b} and B : C = ${c} : ${d}, what is A : B : C?`, parts.map(v => v / g).join(' : '), [`${a} : ${b} : ${d}`, `${a * d} : ${b * d} : ${b * c}`, `${a + c} : ${b + c} : ${d}`], `Make B equal: A : B = ${a * c} : ${b * c} and B : C = ${b * c} : ${b * d}. So A : B : C = ${parts.join(' : ')}${g > 1 ? ' = ' + parts.map(v => v / g).join(' : ') : ''}.`); }
  if (kind === 2) { const x = r.int(3, 9), a = r.int(2, 5), b = r.int(a + 1, 8), add_ = r.int(5, 15); const n1 = a * x, n2 = b * x; add(null, 'Ratios and Proportions', 'Change in ratio', `Two numbers are in the ratio ${a} : ${b}. If ${add_} is added to each, the ratio becomes ${(n1 + add_) / gcd(n1 + add_, n2 + add_)} : ${(n2 + add_) / gcd(n1 + add_, n2 + add_)}. What is the larger number?`, String(n2), [String(n1), String(n2 + add_), String(n2 + 3), String(n2 - 2)], `Let the numbers be ${a}k and ${b}k. (${a}k + ${add_})/(${b}k + ${add_}) = ${(n1 + add_)}/${(n2 + add_)} gives k = ${x}. The larger number is ${b} &times; ${x} = ${n2}.`); }
  if (kind === 3) { const x = r.int(4, 12), a = r.int(3, 5), b = r.int(2, a - 1 + 1), k = r.int(5, 20); const boys = a * x, girls = b * x; if (a === b) return ratioSet(seed + 50); add(null, 'Ratios and Proportions', 'Classroom', `Boys and girls in a class are in the ratio ${a} : ${b}. When ${(boys - girls) * 1} more girls join, the numbers become equal. How many students were in the class originally?`, String(boys + girls), [String(2 * boys), String(boys + girls + 5), String(boys - girls), String(boys + girls - 4)], `${a}x = ${b}x + ${boys - girls} gives x = ${x}. Boys = ${boys}, girls = ${girls}, total = ${boys + girls}.`); }
}
// ---------- pipes and cisterns with a tank figure ----------
function pipeSet(seed) {
  const r = RNG(seed), inlets = r.pick([[12, 20], [10, 15], [6, 12], [8, 24]]), outlet = r.pick([30, 40, 60, 20]), tank = r.pick([120, 240, 360]);
  const [ta, tb] = inlets; const kind = seed % 2;
  const tankFig = (labels) => { let s = R(110, 70, 120, 100, 'soft sline') + `<rect x='111' y='120' width='118' height='49' class='a' style='fill-opacity:.35'/>` + T(170, 150, 'Tank', { b: 1, s: 13 });
    labels.forEach((lb, i) => { const x = 40 + i * 110; if (lb.out) { s += L.A(170, 170, 170, 210, 'ln sb') + T(170, 226, lb.t, { s: 12, b: 1 }); } else { s += L.A(x, 28, x, 66, 'ln sa') + T(x, 18, lb.t, { s: 12, b: 1 }) + L.L(x, 66, 112 + i * 30, 70, 'ln'); } }); return s; };
  const labs = [{ t: `Pipe A: ${ta} h` }, { t: `Pipe B: ${tb} h` }, { out: 1, t: `Pipe C empties: ${outlet} h` }];
  let s = R(110, 70, 120, 100, 'soft sline') + T(170, 125, 'Empty tank', { b: 1, s: 13 }) + L.A(60, 30, 130, 70, 'ln sa') + T(60, 22, `Pipe A fills in ${ta} h`, { s: 12, b: 1, a: 'middle' }) + L.A(280, 30, 210, 70, 'ln sa') + T(280, 22, `Pipe B fills in ${tb} h`, { s: 12, b: 1 }) + L.A(170, 170, 170, 206, 'ln sb') + T(170, 222, `Pipe C empties in ${outlet} h`, { s: 12, b: 1 });
  const set = dir('A tank has two inlet pipes A and B and one outlet pipe C, as shown. Each pipe works at a constant rate.') + L.fig(340, 236, s, 'Tank with two inlet pipes and an outlet pipe');
  const rate = 1 / ta + 1 / tb - 1 / outlet;
  if (rate <= 0) return pipeSet(seed + 40);
  const toFrac = x => { const den = ta * tb * outlet; return [Math.round(x * den), den]; };
  if (kind === 0) { const t = 1 / rate; const [n, d] = toFrac(rate); const T_ = d / n; const txt = `${f2(T_)} h`;
    add(set, 'Time and Work', 'Pipes and cisterns', 'If all three pipes are opened together when the tank is empty, how long will the tank take to fill?', txt, [`${f2(1 / (1 / ta + 1 / tb))} h`, `${f2(ta + tb - outlet)} h`, `${f2(T_ + 2)} h`, `${f2(T_ - 1.5)} h`], `Work done per hour = 1/${ta} + 1/${tb} &minus; 1/${outlet} = ${f2(rate)} of the tank (outlet counts as negative). Time = 1 &divide; ${f2(rate)} = ${f2(T_)} hours. (Without the outlet it would take ${f2(1 / (1 / ta + 1 / tb))} hours.)`); }
  else { const h = r.pick([2, 3, 4]); const filled = h * (1 / ta + 1 / tb), rem = 1 - filled; if (rem <= 0) return pipeSet(seed + 90); const t2 = rem / rate; add(set, 'Time and Work', 'Pipes and cisterns', `Pipes A and B are opened together. After ${h} hours the outlet C is also opened. How many further hours are needed to fill the tank?`, `${f2(t2)} h`, [`${f2(rem / (1 / ta + 1 / tb))} h`, `${f2(t2 + 1)} h`, `${f2(1 / rate - h)} h`, `${f2(t2 - 0.5)} h`], `In ${h} hours A and B fill ${h} &times; (1/${ta} + 1/${tb}) = ${f2(filled)} of the tank. Remaining = ${f2(rem)}. With C open the net rate is ${f2(rate)} per hour, so the time is ${f2(rem)} &divide; ${f2(rate)} = ${f2(t2)} hours.`); }
}
// ---------- discounts with a price tag ----------
function discSet(seed) {
  const r = RNG(seed), mp = r.pick([800, 1200, 1500, 2000, 2400]), d1 = r.pick([10, 15, 20, 25]), d2 = r.pick([5, 10, 20]), cp = Math.round(mp * (1 - d1 / 100) * (1 - d2 / 100) / (1 + r.pick([5, 10, 12.5, 20]) / 100));
  const sp = mp * (1 - d1 / 100) * (1 - d2 / 100);
  const tag = `<g>${P([[60, 10], [220, 10], [240, 40], [220, 70], [60, 70]], 'paper sline')}${T(140, 36, `Marked price Rs ${mp}`, { b: 1, s: 14 })}${T(140, 56, `Discounts: ${d1}% then ${d2}%`, { s: 13 })}${C(76, 40, 5, 'mk')}</g>`;
  const set = dir('A shopkeeper marks an article as shown on the price tag and gives the two successive discounts printed on it.') + L.fig(260, 82, tag, 'Price tag');
  const single = d1 + d2 - d1 * d2 / 100;
  const o = r.f() < 0.5;
  if (o) add(set, 'Profit and Loss', 'Successive discounts', 'What single discount is equivalent to the two successive discounts?', `${f2(single)}%`, [`${d1 + d2}%`, `${f2(single + 2.5)}%`, `${f2(single - 1.5)}%`, `${f2(d1 * d2 / 100)}%`], `Single discount = a + b &minus; ab/100 = ${d1} + ${d2} &minus; ${d1 * d2}/100 = ${f2(single)}%. (Adding ${d1}% and ${d2}% gives ${d1 + d2}%, which ignores that the second discount is on a reduced price.)`);
  else add(set, 'Profit and Loss', 'Successive discounts', 'What is the selling price after both discounts?', `Rs ${f2(sp)}`, [`Rs ${f2(mp * (1 - (d1 + d2) / 100))}`, `Rs ${f2(sp + 40)}`, `Rs ${f2(sp - 25)}`, `Rs ${f2(mp - mp * d1 / 100 - d2)}`], `After the first discount: ${mp} &times; ${1 - d1 / 100} = ${f2(mp * (1 - d1 / 100))}. After the second: &times; ${1 - d2 / 100} = ${f2(sp)}. (Subtracting ${d1 + d2}% from the marked price gives ${f2(mp * (1 - (d1 + d2) / 100))}, which is wrong.)`);
}
// ---------- averages with a table ----------
function avgTable(seed) {
  const r = RNG(seed), names = ['A', 'B', 'C'], n = names.map(() => r.int(10, 40)), av = names.map(() => r.int(40, 80));
  const set = dir('The table shows the number of employees and their average salary (in Rs. thousand) in three departments.') + L.tbl(['Department', 'Employees', 'Average salary'], names.map((x, i) => [x, n[i], av[i]]));
  const tot = n.reduce((a, b) => a + b), sum = n.reduce((a, c, i) => a + c * av[i], 0), ov = sum / tot, simple = av.reduce((a, b) => a + b) / 3;
  add(set, 'Averages', 'Weighted average', 'What is the average salary of all the employees together (in Rs. thousand)?', f2(ov), [f2(simple), f2(ov + 1.5), f2(ov - 2), f2(Math.max(...av))], `Total salary = ${n.map((c, i) => `${c}&times;${av[i]}`).join(' + ')} = ${sum}. Total employees = ${tot}. Average = ${sum}/${tot} = ${f2(ov)}. (The simple average of the three averages, ${f2(simple)}, is wrong because the departments differ in size.)`);
}

[1, 2, 3, 4, 5, 6, 7, 8].forEach(simpSet);
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(algebraSet);
[1, 2, 3, 4, 5, 6, 7, 8].forEach(ratioSet);
[1, 2, 3, 4, 5, 6].forEach(pipeSet);
[1, 2, 3, 4].forEach(discSet);
[1, 2, 3, 4].forEach(avgTable);

module.exports = L.bank;
