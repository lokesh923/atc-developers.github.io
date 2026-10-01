// Practice bank - Reasoning, part 2: histograms, coding-decoding, family trees, flowcharts, data sufficiency (solver based), logical deduction.
const L = require('./lib');
const F = require('./factories');
const { RNG, opts } = require('./rng');
const { mcq, dir, pp, T, R, P } = L;
const f2 = F.f2;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
L.setId(6500);
let slot = 3;
const nextPos = () => (slot = (slot * 5 + 2) % 4);
const add = (set, topic, sub, q, correct, wrongs, exp, extra = {}) => { const o = opts(correct, wrongs, nextPos(), k => String(correct) + ' ' + k); return mcq('R', topic, q, o.opts, o.ans, exp, { set, sub, tough: true, ...extra }); };

// ---------- histograms ----------
function histSet(seed) {
  const r = RNG(seed), w = r.pick([10, 20]), k = 5, lo = r.pick([0, 0, 10]), bins = Array.from({ length: k }, (_, i) => `${lo + i * w}-${lo + (i + 1) * w}`), cnt = Array.from({ length: k }, () => r.int(3, 16)), N = cnt.reduce((a, b) => a + b);
  const ymax = Math.ceil(Math.max(...cnt) / 3) * 3;
  const what = r.pick(['marks of a class test', 'weekly wages (in Rs. hundreds) of workers', 'ages of participants in a workshop']);
  const set = dir(`The histogram shows the distribution of the ${what}.`) + L.histogram({ bins, counts: cnt, ymax: Math.max(ymax, 6), step: 3, xlabel: what.includes('marks') ? 'Marks' : what.includes('wages') ? 'Wages' : 'Age', ylabel: 'Frequency' });
  const mid = i => lo + w * i + w / 2; let cf = 0, mi = -1; cnt.forEach((c, i) => { if (mi < 0 && cf + c >= N / 2) mi = i; if (mi < 0) cf += c; });
  const out = [];
  out.push(['Median class', 'In which class interval does the median lie?', bins[mi], bins.filter((b, i) => i !== mi), `Total frequency N = ${N}, so N/2 = ${N / 2}. Cumulative frequencies: ${cnt.reduce((a, c, i) => (a.push((a[i - 1] || 0) + c), a), []).join(', ')}. The first class whose cumulative frequency reaches ${N / 2} is ${bins[mi]}.`]);
  const mean = cnt.reduce((a, c, i) => a + c * mid(i), 0) / N;
  out.push(['Mean', 'Using class mid-points, what is the estimated mean?', f2(mean), [f2(mean + w / 4), f2(mean - w / 5), f2(lo + w * k / 2)], `Mean = &Sigma;f&middot;x / &Sigma;f = ${cnt.map((c, i) => `${c}&times;${mid(i)}`).join(' + ')} over ${N} = ${f2(mean)}.`]);
  const med = lo + w * mi + ((N / 2 - cf) / cnt[mi]) * w;
  out.push(['Estimated median', 'Using the grouped-data formula, what is the estimated median?', f2(med), [f2(mid(mi)), f2(med + w / 4), f2(med - w / 4)], `Median = L + ((N/2 &minus; cf)/f) &times; h = ${lo + w * mi} + ((${N / 2} &minus; ${cf})/${cnt[mi]}) &times; ${w} = ${f2(med)}.`]);
  const mo = cnt.indexOf(Math.max(...cnt));
  if (cnt.filter(c => c === cnt[mo]).length === 1) { const f1 = cnt[mo], f0 = cnt[mo - 1] || 0, f3 = cnt[mo + 1] || 0, mode = lo + w * mo + (f1 - f0) / (2 * f1 - f0 - f3) * w;
    out.push(['Modal class', 'Which is the modal class?', bins[mo], bins.filter((b, i) => i !== mo), `The modal class is the class with the highest frequency: ${cnt[mo]} in ${bins[mo]}.`]); }
  const t = r.int(2, 4), above = cnt.slice(t).reduce((a, b) => a + b);
  out.push(['Percentage above a point', `What percentage of the observations are ${lo + t * w} or more?`, f2(above / N * 100) + '%', [f2((N - above) / N * 100) + '%', f2(above / N * 100 + 4) + '%', f2(above / cnt[mi] * 10) + '%'], `Classes from ${lo + t * w} upwards have ${cnt.slice(t).join(' + ')} = ${above} observations. ${above}/${N} &times; 100 = ${f2(above / N * 100)}%.`]);
  return r.shuffle(out).slice(0, 2).map(o => add(set, 'Statistical Data Interpretation', 'Histogram', o[1], o[2], o[3], o[4]));
}

// ---------- coding-decoding with inferred rules ----------
const A26 = i => String.fromCharCode(65 + ((i % 26) + 26) % 26), P26 = c => c.charCodeAt(0) - 65;
const RULES = [
  { id: 'shift+2', t: 'every letter is moved 2 places forward', f: w => w.split('').map(c => A26(P26(c) + 2)).join('') },
  { id: 'shift-3', t: 'every letter is moved 3 places backward', f: w => w.split('').map(c => A26(P26(c) - 3)).join('') },
  { id: 'opposite', t: 'every letter is replaced by its opposite (A&harr;Z, B&harr;Y, ...)', f: w => w.split('').map(c => A26(25 - P26(c))).join('') },
  { id: 'reverse', t: 'the word is written backwards', f: w => w.split('').reverse().join('') },
  { id: 'alt', t: 'letters at odd positions move 1 forward and letters at even positions move 2 backward', f: w => w.split('').map((c, i) => A26(P26(c) + (i % 2 === 0 ? 1 : -2))).join('') },
  { id: 'revshift', t: 'the word is reversed and then every letter is moved 1 forward', f: w => w.split('').reverse().map(c => A26(P26(c) + 1)).join('') },
  { id: 'pos', t: 'the k-th letter is moved k places forward', f: w => w.split('').map((c, i) => A26(P26(c) + i + 1)).join('') },
  { id: 'swap', t: 'the first and last letters are swapped and the rest are moved 1 forward', f: w => { const a = w.split(''); const m = a.map((c, i) => (i === 0 || i === a.length - 1) ? c : A26(P26(c) + 1)); [m[0], m[m.length - 1]] = [m[m.length - 1], m[0]]; return m.join(''); } },
];
const WORDS6 = ['MARKET', 'PLANET', 'DOCTOR', 'CIRCLE', 'TICKET', 'BRIDGE', 'SYSTEM', 'ENGINE', 'SIGNAL', 'WINDOW', 'FRIEND', 'JUNGLE', 'BASKET', 'FLIGHT', 'CASTLE', 'GARDEN', 'MOTHER', 'NUMBER'];
function codeSet(seed) {
  const r = RNG(seed), rule = RULES[seed % RULES.length], ws = r.shuffle(WORDS6), ex = [ws[0], ws[1]], target = ws[2];
  const fits = RULES.filter(ru => ex.every(w => ru.f(w) === rule.f(w)));
  if (fits.length !== 1) return codeSet(seed + 8);
  let s = '';
  ex.forEach((w, i) => { s += R(10, 12 + i * 44, 120, 34, 'paper sline') + T(70, 35 + i * 44, w, { b: 1, s: 15 }) + T(150, 35 + i * 44, '&rarr;', { s: 18 }) + R(170, 12 + i * 44, 120, 34, 'soft sline') + T(230, 35 + i * 44, rule.f(w), { b: 1, s: 15 }); });
  const set = dir('In a certain code language the words below are written as shown. The same rule is used for every word.') + L.fig(300, 108, s, 'Two coded words');
  const ans = rule.f(target), wr = RULES.filter(x => x !== rule).map(x => x.f(target)).filter(x => x !== ans);
  add(set, 'Coding-Decoding', 'Inferred rule', `How will <b>${target}</b> be written in this code?`, ans, wr, `Compare each example: ${rule.t}. Applying it to ${target} gives ${ans}.`);
}

// ---------- family trees ----------
function treeSet(seed) {
  const r = RNG(seed), names = r.shuffle(['Ramesh', 'Sita', 'Anil', 'Kavita', 'Priya', 'Vikas', 'Rohan', 'Neha', 'Arjun', 'Meera', 'Sanjay', 'Divya', 'Kiran', 'Pooja', 'Naveen', 'Rekha', 'Amit', 'Seema']);
  const male = new Set(), person = {};
  const mk = (name, m) => { person[name] = { name, m, parents: [], spouse: null }; return person[name]; };
  const [g1, g2, c1, c2, s1, s2, k1, k2, k3] = names;
  const c1m = r.f() < 0.5, c2m = r.f() < 0.5;
  mk(g1, true); mk(g2, false); mk(c1, c1m); mk(c2, c2m); mk(s1, !c1m); mk(s2, !c2m);
  mk(k1, r.f() < 0.5); mk(k2, r.f() < 0.5); mk(k3, r.f() < 0.5);
  const wed = (a, b) => { person[a].spouse = b; person[b].spouse = a; };
  wed(g1, g2); wed(c1, s1); wed(c2, s2);
  [c1, c2].forEach(c => person[c].parents = [g1, g2]);
  [k1, k2].forEach(k => person[k].parents = [c1m ? c1 : s1, c1m ? s1 : c1]); person[k3].parents = [c2m ? c2 : s2, c2m ? s2 : c2];
  const par = x => person[x].parents, kids = x => Object.keys(person).filter(y => par(y).includes(x));
  const sib = (x, y) => x !== y && par(x).length && par(x).some(p => par(y).includes(p));
  const gender = (x, m, f) => person[x].m ? m : f;
  const rel = (x, y) => { // x is the ___ of y
    if (par(y).includes(x)) return gender(x, 'father', 'mother');
    if (par(x).includes(y)) return gender(x, 'son', 'daughter');
    if (person[y].spouse === x) return gender(x, 'husband', 'wife');
    if (sib(x, y)) return gender(x, 'brother', 'sister');
    if (par(y).some(p => sib(x, p))) return gender(x, 'uncle', 'aunt');
    if (par(x).some(p => sib(p, y))) return gender(x, 'nephew', 'niece');
    if (par(y).some(p => par(p).includes(x))) return gender(x, 'grandfather', 'grandmother');
    if (par(x).some(p => par(p).includes(y))) return gender(x, 'grandson', 'granddaughter');
    if (par(x).some(p => par(y).some(q => sib(p, q)))) return 'cousin';
    if (person[y].spouse && sib(x, person[y].spouse)) return gender(x, 'brother-in-law', 'sister-in-law');
    if (person[x].spouse && sib(person[x].spouse, y)) return gender(x, 'brother-in-law', 'sister-in-law');
    if (person[y].spouse && par(person[y].spouse).includes(x)) return gender(x, 'father-in-law', 'mother-in-law');
    if (par(x).includes(person[y].spouse) && false) return '';
    if (kids(y).some(k => person[k].spouse === x)) return gender(x, 'son-in-law', 'daughter-in-law');
    if (person[y].spouse && par(person[y].spouse).some(p => sib(x, p))) return null;
    return null;
  };
  // draw
  const node = (x, y, nm) => person[nm].m ? `${R(x - 38, y - 14, 76, 28)}${T(x, y + 4, nm, { b: 1, s: 12 })}` : `<ellipse cx='${x}' cy='${y}' rx='42' ry='15' class='paper sline'/>${T(x, y + 4, nm, { b: 1, s: 12 })}`;
  const dbl = (x1, x2, y) => L.L(x1, y - 2, x2, y - 2) + L.L(x1, y + 2, x2, y + 2);
  const pos = {}; pos[g1] = [190, 24]; pos[g2] = [350, 24]; pos[c1] = [150, 106]; pos[s1] = [40, 106]; pos[c2] = [490, 106]; pos[s2] = [610, 106];
  const kidOf = (a, b, list, cx) => list.forEach((k, i) => pos[k] = [cx + (i - (list.length - 1) / 2) * 120, 182]);
  kidOf(c1, s1, [k1, k2], 95); pos[k3] = [550, 182];
  let s = ''; Object.keys(pos).forEach(n => s += node(pos[n][0], pos[n][1], n));
  s += dbl(232, 306, 24) + L.L(270, 26, 270, 66) + L.L(150, 66, 490, 66) + L.L(150, 66, 150, 92) + L.L(490, 66, 490, 92);
  s += dbl(84, 112, 106) + dbl(534, 570, 106);
  const midC1 = (pos[c1][0] + pos[s1][0]) / 2 + 0; s += L.L(97, 108, 97, 150) + L.L(pos[k1][0], 150, pos[k2][0], 150) + L.L(pos[k1][0], 150, pos[k1][0], 168) + L.L(pos[k2][0], 150, pos[k2][0], 168) + L.L(552, 108, 552, 168);
  s += R(250, 222, 12, 12) + T(268, 232, 'Male', { a: 'start', s: 11 }) + `<ellipse cx='330' cy='228' rx='10' ry='7' class='paper sline'/>` + T(346, 232, 'Female', { a: 'start', s: 11 }) + L.L(398, 226, 418, 226) + L.L(398, 230, 418, 230) + T(424, 232, 'Married', { a: 'start', s: 11 }) + L.L(488, 220, 488, 236) + T(494, 232, 'Children', { a: 'start', s: 11 });
  const set = dir('Study the family tree. Squares are males, ovals are females, a double line joins a married couple and a vertical line leads down to their children.') + L.fig(700, 244, `<g transform='translate(30,0)'>${s}</g>`, 'Family tree');
  const all = Object.keys(person), poolTerms = ['father', 'mother', 'son', 'daughter', 'brother', 'sister', 'uncle', 'aunt', 'nephew', 'niece', 'cousin', 'grandfather', 'grandmother', 'grandson', 'granddaughter', 'brother-in-law', 'sister-in-law', 'son-in-law', 'daughter-in-law', 'father-in-law', 'mother-in-law'];
  const pairs = []; all.forEach(a => all.forEach(b => { if (a !== b) { const v = rel(a, b); if (v && !['father', 'mother', 'son', 'daughter', 'husband', 'wife'].includes(v)) pairs.push([a, b, v]); } }));
  r.shuffle(pairs).slice(0, 2).forEach(([a, b, v]) => {
    const wrongs = poolTerms.filter(t => t !== v && (person[a].m ? !/mother|sister|aunt|niece|daughter|granddaughter|wife/.test(t) : !/father|brother|uncle|nephew|son|grandson|husband/.test(t)));
    add(set, 'Blood Relations', 'Family tree', `How is ${a} related to ${b}?`, v.replace(/^./, c => c.toUpperCase()), r.shuffle(wrongs).slice(0, 5).map(t => t.replace(/^./, c => c.toUpperCase())), `From the tree: ${a} is the ${v} of ${b}.`);
  });
}

// ---------- parametrised flowcharts ----------
function flowSet(seed) {
  const r = RNG(seed), conds = [['even', 'Is D even ?', d => d % 2 === 0], ['gt4', 'Is D &gt; 4 ?', d => d > 4], ['mult3', 'Is D a multiple of 3 ?', d => d % 3 === 0]], cond = conds[seed % 3];
  const ops = [['S = S + D', (s, d) => s + d], ['S = S - D', (s, d) => s - d], ['S = S + 2D', (s, d) => s + 2 * d], ['S = S + 1', (s, d) => s + 1], ['S = S - 1', (s, d) => s - 1]];
  const [yes, no] = r.shuffle(ops).slice(0, 2); const start = r.pick([0, 0, 5]);
  const run = n => { let s = start; while (n > 0) { const d = n % 10; s = (cond[2](d) ? yes : no)[1](s, d); n = Math.floor(n / 10); } return s; };
  const box = (x, y, w, h, t) => R(x, y, w, h, 'paper sline', "rx='5'") + T(x + w / 2, y + h / 2 + 4, t, { s: 12, b: 1 });
  const dia = (cx, cy, t, wd = 66) => P([[cx, cy - 26], [cx + wd, cy], [cx, cy + 26], [cx - wd, cy]], 'soft sline') + T(cx, cy + 4, t, { s: 12, b: 1 });
  let s = `<ellipse cx='170' cy='20' rx='42' ry='14' class='soft sline'/>` + T(170, 24, 'START', { s: 12, b: 1 }) + L.A(170, 34, 170, 50);
  s += box(95, 52, 150, 30, `Input N;  S = ${start}`) + L.A(170, 82, 170, 104) + dia(170, 132, 'Is N &gt; 0 ?') + L.A(170, 158, 170, 182) + T(184, 174, 'Yes', { a: 'start', s: 11 });
  s += box(105, 184, 130, 28, 'D = N mod 10') + L.A(170, 212, 170, 232) + dia(170, 258, cond[1], 74) + T(92, 250, 'Yes', { s: 11 }) + T(250, 250, 'No', { s: 11 });
  s += L.L(96, 258, 60, 258) + L.A(60, 258, 60, 290) + L.L(244, 258, 280, 258) + L.A(280, 258, 280, 290) + box(10, 292, 100, 28, yes[0]) + box(230, 292, 100, 28, no[0]);
  s += L.L(60, 320, 60, 340) + L.L(280, 320, 280, 340) + L.L(60, 340, 280, 340) + L.A(170, 340, 170, 362) + box(105, 364, 130, 28, 'N = N div 10');
  s += L.L(235, 378, 330, 378) + L.L(330, 378, 330, 132) + L.A(330, 132, 236, 132) + L.L(104, 132, 20, 132) + L.L(20, 132, 20, 420) + L.A(20, 420, 120, 420) + T(40, 124, 'No', { a: 'start', s: 11 });
  s += box(122, 406, 100, 28, 'Output S') + L.A(222, 420, 300, 420) + `<ellipse cx='330' cy='420' rx='32' ry='14' class='soft sline'/>` + T(330, 424, 'END', { s: 12, b: 1 });
  s += T(236, 26, 'N mod 10 = last digit of N', { a: 'start', s: 10, c: 'muted' }) + T(236, 40, 'N div 10 = N without its last digit', { a: 'start', s: 10, c: 'muted' });
  const set = dir('Study the flowchart. N is a positive whole number.') + L.fig(420, 446, s, 'Flowchart that processes the digits of N');
  const n1 = r.int(1000, 9999), n2 = r.int(10000, 99999);
  const trace = n => { let t = [], s2 = start, m = n; while (m > 0) { const d = m % 10, rr = cond[2](d) ? yes : no; s2 = rr[1](s2, d); t.push(`${d}: ${rr[0].replace('S = ', '').replace(/S/g, 'S')} &rarr; S = ${s2}`); m = Math.floor(m / 10); } return t.join('; '); };
  [n1, n2].forEach(n => add(set, 'Logical Deduction', 'Flowchart', `What is the output when N = ${n}?`, String(run(n)), [String(run(n) + 1), String(run(n) - 2), String(run(n) + 3), String(-run(n))], `Digits from the right (S starts at ${start}): ${trace(n)}. Output = ${run(n)}.`));
}

// ---------- data sufficiency (solver based) ----------
const DOM = Array.from({ length: 20 }, (_, i) => i + 1);
function dsSet(seed, geometry) {
  const r = RNG(seed);
  for (let attempt = 0; attempt < 400; attempt++) {
    const xs = r.pick(DOM.filter(v => v >= 2)), ys = r.pick(DOM.filter(v => v >= 2));
    const lib = [
      [`${'X'} + ${'Y'} = ${xs + ys}`, (x, y) => x + y === xs + ys], [`X &minus; Y = ${xs - ys}`, (x, y) => x - y === xs - ys], [`X &times; Y = ${xs * ys}`, (x, y) => x * y === xs * ys],
      ['X is an even number', (x, y) => x % 2 === 0], ['Y is an odd number', (x, y) => y % 2 === 1], [xs > ys ? 'X is greater than Y' : 'Y is greater than X', (x, y) => xs > ys ? x > y : y > x],
      [`X = ${Math.round(xs / ys) === xs / ys ? 'Y &times; ' + xs / ys : 'Y + ' + (xs - ys)}`, (x, y) => Math.round(xs / ys) === xs / ys ? x === y * (xs / ys) : x === y + (xs - ys)], [`X&sup2; = ${xs * xs}`, (x, y) => x * x === xs * xs], [`Y&sup2; = ${ys * ys}`, (x, y) => y * y === ys * ys],
      [`X + Y is a multiple of ${[2, 3, 4, 5].find(k => (xs + ys) % k === 0) || 1}`, (x, y) => (x + y) % ([2, 3, 4, 5].find(k => (xs + ys) % k === 0) || 1) === 0], [`X is a multiple of Y`, (x, y) => xs % ys === 0 ? x % y === 0 : false],
    ].filter(l => l[1](xs, ys));
    const queries = [['What is the value of X?', (x, y) => x], ['What is the value of Y?', (x, y) => y], ['What is the value of X + Y?', (x, y) => x + y], ['Is X greater than Y?', (x, y) => x > y ? 'Yes' : 'No'], ['Is X an even number?', (x, y) => x % 2 === 0 ? 'Yes' : 'No']];
    const q = r.pick(queries), [s1, s2] = r.shuffle(lib).slice(0, 2); if (!s1 || !s2 || s1[0] === s2[0]) continue;
    const vals = pred => { const set = new Set(); DOM.forEach(x => DOM.forEach(y => { if (pred(x, y)) set.add(q[1](x, y)); })); return set; };
    const A1 = vals(s1[1]), A2 = vals(s2[1]), A12 = vals((x, y) => s1[1](x, y) && s2[1](x, y));
    const suf1 = A1.size === 1, suf2 = A2.size === 1, sufB = A12.size === 1;
    const code = suf1 && suf2 ? 2 : suf1 ? 0 : suf2 ? 1 : sufB ? 3 : 4;
    (dsSet.seen = dsSet.seen || {})[code] = (dsSet.seen[code] || 0);
    if (dsSet.seen[code] >= dsSet.cap) continue; dsSet.seen[code]++;
    const show = A => { const a = [...A].sort((p, q2) => p - q2); return a.length > 5 ? a.slice(0, 5).join(', ') + ', ...' : a.join(', '); };
    const sub = t => t.replace(/X/g, 'X').replace(/Y/g, 'Y');
    const set = dir('Each question is followed by two statements. X and Y are whole numbers from 1 to 20. Decide whether the statements are sufficient to answer the question.') + pp(`<b>${q[0]}</b><br><b>I.</b> ${sub(s1[0])}.<br><b>II.</b> ${sub(s2[0])}.`);
    const exp = `Statement I alone allows: ${show(A1)}${suf1 ? ' (one answer, so sufficient)' : ' (more than one answer, so not sufficient)'}. Statement II alone allows: ${show(A2)}${suf2 ? ' (sufficient)' : ' (not sufficient)'}. Together: ${show(A12)}${sufB ? ' (a single answer)' : ' (still more than one answer)'}.`;
    const optsDS = ['Statement I alone is sufficient', 'Statement II alone is sufficient', 'Either statement alone is sufficient', 'Both statements together are needed', 'Even both together are not sufficient'];
    mcq('R', 'Data Sufficiency', 'Choose the correct option.', optsDS, code, exp, { set, sub: 'Computed', tough: true });
    return true;
  }
  return false;
}
dsSet.cap = 4;

// ---------- logical deduction (propositional, solver checked) ----------
function logicSet() {
  const items = [
    ['If the alarm rings, Sam wakes up. Sam did not wake up. Which conclusion must be true?', 'The alarm did not ring.', ['The alarm rang but Sam ignored it.', 'Sam is a heavy sleeper.', 'The alarm is broken.'], 'Alarm &rarr; wakes. By the contrapositive, not wakes &rarr; no alarm.'],
    ['Unless you pay the fee, you cannot sit the exam. Tina sat the exam. Which conclusion must be true?', 'Tina paid the fee.', ['Tina studied hard.', 'Everyone who paid the fee sat the exam.', 'Tina will pass the exam.'], '"Unless fee, no exam" means: exam &rarr; fee. Tina sat the exam, so she paid.'],
    ['You can enter the hall only if you have an admit card. Riya has an admit card. Which is correct?', 'Riya may or may not enter the hall.', ['Riya will definitely enter the hall.', 'Riya cannot enter the hall.', 'Riya has no photo ID.'], '"Only if" gives: enter &rarr; admit card. The card is necessary, not sufficient.'],
    ['All engineers in the team know Python. Neha does not know Python. Which is certain?', 'Neha is not an engineer in the team.', ['Neha is a manager.', 'Neha is learning Python.', 'Some engineers do not know Python.'], 'Engineer &rarr; knows Python. By the contrapositive, does not know Python &rarr; not an engineer in the team.'],
    ['If it rains, the match is cancelled. The match was cancelled. Which is correct?', 'It may or may not have rained.', ['It rained.', 'It did not rain.', 'The match will be replayed tomorrow.'], 'The converse (cancelled &rarr; rain) is not valid; the match could be cancelled for other reasons.'],
    ['Either the server crashed or the network failed (at least one happened). The network did not fail. Which is certain?', 'The server crashed.', ['The server did not crash.', 'Both failed.', 'The engineer arrived late.'], 'P or Q, not Q, therefore P.'],
    ['If a student scores above 90, she gets a medal. If she gets a medal, she gets a trophy. Anita did not get a trophy. Which is certain?', 'Anita scored 90 or below.', ['Anita scored above 90.', 'Anita got a medal.', 'Anita did not appear for the test.'], 'Score &gt; 90 &rarr; medal &rarr; trophy. No trophy &rarr; no medal &rarr; score not above 90.'],
    ['Statement: "All employees must use the new app for attendance from Monday." Which is an implicit assumption?', 'Employees are able to use the app.', ['The old system was very expensive.', 'The app was made by the company\'s own staff.', 'Employees will be paid more.'], 'An order to use the app assumes that employees can use it. The other statements are not needed.'],
  ];
  items.forEach(([q, c, w, e]) => { const o = opts(c, w, nextPos()); mcq('R', 'Logical Deduction', pp(q) + pp('<b>Which of the following is correct?</b>'), o.opts, o.ans, e, { sub: 'Conditionals', tough: true }); });
}

[501, 502, 503, 504, 505, 506, 507, 508].forEach(histSet);
for (let s = 0; s < 8; s++) codeSet(600 + s * 3 + (s % 8));
[701, 702, 703, 704, 705, 706, 707, 708].forEach(treeSet);
[801, 802, 803, 804, 805, 806].forEach(flowSet);
for (let s = 0; s < 40; s++) dsSet(900 + s);
logicSet();

module.exports = L.bank;
