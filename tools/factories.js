// Puzzle and chart factories: every answer is computed (or solver-checked), never typed by hand.
const L = require('./lib');
const { RNG, perms, opts } = require('./rng');
const { dir, pp } = L;
const LET = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');
const f2 = n => String(+n.toFixed(2));

// ---------- circular seating ----------
function seatingPuzzle(seed, { n = 8, mixed = false } = {}) {
  const R = RNG(seed), names = LET.slice(0, n);
  const target = ['A', ...R.shuffle(names.slice(1))];            // seat 1 (index 0) is A
  const faceIn = i => !mixed || i % 2 === 0;                    // mixed: odd seat numbers face the centre, even seats face outside
  const m = x => ((x % n) + n) % n;
  const leftOf = (arr, p, k) => { const i = arr.indexOf(p); return arr[m(i + (faceIn(i) ? k : -k))]; };
  const rightOf = (arr, p, k) => leftOf(arr, p, -k);
  const ord = k => ['', 'immediate', 'second', 'third'][k];
  const mk = [];
  names.forEach(x => names.forEach(y => { if (x === y) return;
    [1, 2, 3].forEach(k => {
      mk.push({ t: `${x} sits ${k === 1 ? 'to the immediate' : ord(k) + ' to the'} left of ${y}`, ok: a => leftOf(a, y, k) === x });
      mk.push({ t: `${x} sits ${k === 1 ? 'to the immediate' : ord(k) + ' to the'} right of ${y}`, ok: a => rightOf(a, y, k) === x });
    });
    mk.push({ t: `${x} sits exactly opposite ${y}`, ok: a => a.indexOf(x) === m(a.indexOf(y) + n / 2), sym: 1 });
    mk.push({ t: `${x} and ${y} are immediate neighbours`, ok: a => { const d = m(a.indexOf(x) - a.indexOf(y)); return d === 1 || d === n - 1; }, sym: 1 });
    mk.push({ t: `${x} is not an immediate neighbour of ${y}`, ok: a => { const d = m(a.indexOf(x) - a.indexOf(y)); return !(d === 1 || d === n - 1); }, sym: 1 });
  }));
  const good = R.shuffle(mk.filter(c => c.ok(target)));
  const all = perms(names.slice(1)).map(p => ['A', ...p]);
  const count = cl => all.filter(a => cl.every(c => c.ok(a))).length;
  let chosen = [], pool = all;
  for (const c of good) { if (pool.length === 1) break; const np = pool.filter(a => c.ok(a)); if (np.length < pool.length) { chosen.push(c); pool = np; } }
  if (pool.length !== 1) throw new Error('seating not unique ' + seed);
  // prune redundant clues
  for (let i = chosen.length - 1; i >= 0; i--) { const t = chosen.filter((_, j) => j !== i); if (count(t) === 1) chosen = t; }
  const arr = target;
  const set = pp(`${n === 8 ? 'Eight' : n === 6 ? 'Six' : 'Seven'} friends ${names.join(', ')} sit around a circular table. The seats are numbered 1 to ${n} clockwise and A sits in seat 1. ${mixed ? 'Persons in odd-numbered seats face the <b>centre</b>; persons in even-numbered seats face <b>outside</b> (away from the centre).' : 'All of them face the <b>centre</b>.'}`) +
    pp(chosen.map((c, i) => `${i + 1}. ${c.t[0].toUpperCase() + c.t.slice(1)}.`).join('<br>')) + L.circleSeats({ seats: ['A', ...Array(n - 1).fill('')], facing: mixed ? 'mixed' : 'centre', w: 380, h: 340 });
  const qs = [];
  const others = names.slice(1);
  const pr = (c, pos, extra) => opts(c, R.shuffle(names.filter(x => x !== c)).slice(0, 5), pos);
  const X = R.pick(others), Y = R.pick(others.filter(x => x !== X)), Z = R.pick(others.filter(x => x !== X && x !== Y));
  const q1 = arr[m(arr.indexOf(X) + n / 2)];
  qs.push({ q: `Who sits exactly opposite ${X}?`, correct: q1, wrongs: names.filter(x => x !== q1 && x !== X), exp: `Final order, seats 1-${n} clockwise: ${arr.join(', ')}. ${X} is in seat ${arr.indexOf(X) + 1}, so the opposite seat ${m(arr.indexOf(X) + n / 2) + 1} holds ${q1}.` });
  const k2 = R.pick([2, 3]), side = R.pick(['left', 'right']);
  const q2 = side === 'left' ? leftOf(arr, Y, k2) : rightOf(arr, Y, k2);
  qs.push({ q: `Who sits ${k2 === 2 ? 'second' : 'third'} to the ${side} of ${Y}?`, correct: q2, wrongs: names.filter(x => x !== q2 && x !== Y), exp: `${Y} is in seat ${arr.indexOf(Y) + 1} and faces ${faceIn(arr.indexOf(Y)) ? 'the centre' : 'outside'}, so ${Y}'s ${side} is the ${(side === 'left') === faceIn(arr.indexOf(Y)) ? 'clockwise' : 'anticlockwise'} direction. Counting ${k2} seats that way reaches seat ${arr.indexOf(q2) + 1}, which is ${q2}.` });
  const zi = arr.indexOf(Z), wi = arr.indexOf(X);
  let btw = 0; for (let i = m(wi + 1); i !== zi; i = m(i + 1)) btw++;
  qs.push({ q: `How many people sit between ${X} and ${Z} when counted clockwise from ${X}?`, correct: btw, wrongs: [btw + 1, btw - 1, btw + 2, btw === 0 ? 4 : 0, 3].filter(v => v >= 0), exp: `${X} is in seat ${wi + 1} and ${Z} in seat ${zi + 1}. Moving clockwise from seat ${wi + 1} to seat ${zi + 1} passes ${btw} seat(s) in between.` });
  return { set, qs, arr, clues: chosen.length };
}

// ---------- floors ----------
function floorPuzzle(seed, { n = 6 } = {}) {
  const R = RNG(seed), names = LET.slice(10, 10 + n); // K..
  const target = R.shuffle(names);                        // target[i] = person on floor i+1
  const fl = (a, p) => a.indexOf(p) + 1;
  const mk = [];
  names.forEach(x => { for (let f = 1; f <= n; f++) mk.push({ t: `${x} lives on floor ${f}`, ok: a => fl(a, x) === f, w: 0.3 });
    mk.push({ t: `${x} lives on the top floor`, ok: a => fl(a, x) === n }); mk.push({ t: `${x} lives on the bottom floor`, ok: a => fl(a, x) === 1 });
    names.forEach(y => { if (x === y) return;
      mk.push({ t: `${x} lives above ${y}`, ok: a => fl(a, x) > fl(a, y) });
      mk.push({ t: `${x} lives immediately above ${y}`, ok: a => fl(a, x) === fl(a, y) + 1 });
      for (let g = 1; g <= 3; g++) mk.push({ t: `Exactly ${g === 1 ? 'one floor lies' : g + ' floors lie'} between ${x} and ${y}`, ok: a => Math.abs(fl(a, x) - fl(a, y)) === g + 1, sym: 1 });
      mk.push({ t: `${x} does not live next to ${y}`, ok: a => Math.abs(fl(a, x) - fl(a, y)) !== 1, sym: 1 });
    }); });
  const good = R.shuffle(mk.filter(c => c.ok(target)));
  let pool = perms(names), chosen = [];
  for (const c of good) { if (pool.length === 1) break; const np = pool.filter(a => c.ok(a)); if (np.length < pool.length) { chosen.push(c); pool = np; } }
  if (pool.length !== 1) throw new Error('floor not unique');
  const all = perms(names);
  for (let i = chosen.length - 1; i >= 0; i--) { const t = chosen.filter((_, j) => j !== i); if (all.filter(a => t.every(c => c.ok(a))).length === 1) chosen = t; }
  const known = {}; const kc = chosen.find(c => /lives on floor \d$/.test(c.t));
  const set = pp(`${n === 6 ? 'Six' : n === 7 ? 'Seven' : 'Five'} people ${names.join(', ')} live on different floors of a ${n}-storey building (floor 1 is the bottom).`) + pp(chosen.map((c, i) => `${i + 1}. ${c.t}.`).join('<br>')) + L.building({ floors: n, known: {} });
  const T_ = target, qs = [];
  const f0 = R.int(1, n); const pf = T_[f0 - 1];
  qs.push({ q: `Who lives on floor ${f0}?`, correct: pf, wrongs: names.filter(x => x !== pf), exp: `Order from floor 1 upwards: ${T_.join(', ')}.` });
  const a = R.pick(names), b = R.pick(names.filter(x => x !== a)); const between = Math.abs(fl(T_, a) - fl(T_, b)) - 1;
  qs.push({ q: `How many people live between ${a} and ${b}?`, correct: between, wrongs: [between + 1, between - 1, between + 2, 0, 3].filter(v => v >= 0), exp: `${a} is on floor ${fl(T_, a)} and ${b} on floor ${fl(T_, b)}; the floors in between hold ${between} person(s). Order from floor 1: ${T_.join(', ')}.` });
  const c = R.pick(names.filter(x => fl(T_, x) <= n - 2)); const abv = T_[fl(T_, c) + 1];
  qs.push({ q: `Who lives two floors above ${c}?`, correct: abv, wrongs: names.filter(x => x !== abv && x !== c), exp: `${c} is on floor ${fl(T_, c)}; two floors above is floor ${fl(T_, c) + 2}, where ${abv} lives. Order from floor 1: ${T_.join(', ')}.` });
  return { set, qs, arr: T_ };
}

// ---------- syllogisms (model checking over Venn regions) ----------
// Terms are 0,1,2. A region is a 3-bit mask. A model = set of non-empty regions (as a bitmask over 8 regions).
const stmtTrue = (model, s) => {
  const { type, a, b } = s; let r = 0;
  for (let reg = 1; reg < 8; reg++) { if (!(model >> reg & 1)) continue; const ina = reg >> a & 1, inb = reg >> b & 1;
    if (type === 'all' && ina && !inb) return false;
    if (type === 'no' && ina && inb) return false;
    if (type === 'some' && ina && inb) r = 1;
    if (type === 'somenot' && ina && !inb) r = 1; }
  if (type === 'some' || type === 'somenot') return !!r;
  return true;
};
// 'exists' semantics: a term used in a 'some' premise must be non-empty; plain syllogism convention (no extra existence)
const text = (s, N) => s.type === 'all' ? `All ${N[s.a]} are ${N[s.b]}` : s.type === 'no' ? `No ${N[s.a]} are ${N[s.b]}` : s.type === 'some' ? `Some ${N[s.a]} are ${N[s.b]}` : `Some ${N[s.a]} are not ${N[s.b]}`;
function followsAll(prem, concl) { let ok = true, any = false; for (let model = 0; model < 256; model++) { if (model & 1) continue; if (!prem.every(p => stmtTrue(model, p))) continue; any = true; if (!stmtTrue(model, concl)) ok = false; } return any && ok; }
function possibly(prem, concl) { for (let model = 0; model < 256; model++) { if (model & 1) continue; if (prem.every(p => stmtTrue(model, p)) && stmtTrue(model, concl)) return true; } return false; }
const WORDS = [['pens', 'books', 'copies'], ['cats', 'dogs', 'rats'], ['roses', 'flowers', 'plants'], ['laptops', 'phones', 'tablets'], ['doctors', 'teachers', 'singers'], ['buses', 'cars', 'bikes'], ['mangoes', 'apples', 'grapes'], ['engineers', 'managers', 'artists'], ['rivers', 'lakes', 'ponds'], ['chairs', 'tables', 'desks'], ['coders', 'testers', 'analysts'], ['clocks', 'watches', 'bells']];
function syllogism(seed, { combo } = {}) {
  const R = RNG(seed), N = R.pick(WORDS);
  const types = ['all', 'no', 'some', 'somenot'];
  for (let tries = 0; tries < 200; tries++) {
    const t1 = R.pick(types), t2 = R.pick(types);
    const prem = [{ type: t1, a: 0, b: 1 }, { type: t2, a: 1, b: 2 }];
    const cands = [];
    types.forEach(t => [[0, 2], [2, 0]].forEach(([a, b]) => cands.push({ type: t, a, b })));
    const sure = cands.filter(c => followsAll(prem, c));
    const notSure = cands.filter(c => !followsAll(prem, c));
    // want a tricky mix: a pair of conclusions where exactly one follows, one only "possible"
    if (sure.length >= 1 && notSure.length >= 2) {
      const c1 = R.pick(sure), c2 = R.pick(notSure.filter(c => possibly(prem, c)).concat(notSure));
      const c3 = R.pick(notSure);
      const pair = R.shuffle([c1, c2]);
      const f = pair.map(c => followsAll(prem, c));
      return { N, prem, pair, f, text: s => text(s, N) };
    }
  }
  throw new Error('no syllogism');
}
// five standard options for two conclusions
const SYL_OPTS = ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither I nor II follows', 'Both I and II follow'];
function sylAnswer(prem, pair) {
  const f = pair.map(c => followsAll(prem, c));
  if (f[0] && f[1]) return 4; if (f[0]) return 0; if (f[1]) return 1;
  // either-or: complementary pair about the same two terms (e.g. 'all' vs 'somenot', 'no' vs 'some')
  const [a, b] = pair; const comp = (x, y) => x.a === y.a && x.b === y.b && ((x.type === 'all' && y.type === 'somenot') || (x.type === 'somenot' && y.type === 'all') || (x.type === 'no' && y.type === 'some') || (x.type === 'some' && y.type === 'no'));
  return comp(a, b) ? 2 : 3;
}
// Venn picture of one valid model of the premises (used in explanations)
function sylVenn(N, prem) {
  const s = `<svg viewBox='0 0 300 170' width='300' role='img' aria-label='Venn diagram' xmlns='http://www.w3.org/2000/svg'><circle cx='100' cy='85' r='60' class='vc1'/><circle cx='180' cy='85' r='60' class='vc2'/><circle cx='140' cy='125' r='38' class='vc3'/>${L.T(60, 25, N[0], { b: 1 })}${L.T(220, 25, N[1], { b: 1 })}${L.T(140, 168, N[2], { b: 1 })}</svg>`;
  return '';
}

module.exports = { seatingPuzzle, floorPuzzle, syllogism, sylAnswer, SYL_OPTS, followsAll, possibly, text, f2, LET };
