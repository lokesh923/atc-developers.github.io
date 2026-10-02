// Builds the 15 hardest Reasoning questions (mixed image / text based) for the Graphy Word upload format.
// Output: JSON with html fragments; render-graphy.js turns it into the .docx. Usage: node tools/gen-graphy.js out.json
const fs = require('fs'), path = require('path'), Module = require('module');
const L = require('./lib'), F = require('./factories'), { opts } = require('./rng');
function load(file, cutMarker, names) {
  let src = fs.readFileSync(path.join(__dirname, file), 'utf8'); src = src.slice(0, src.indexOf(cutMarker)) + `\nmodule.exports={${names}};`;
  const m = new Module(path.join(__dirname, file), module); m.filename = path.join(__dirname, file); m.paths = Module._nodeModulePaths(__dirname); m._compile(src, m.filename); return m.exports;
}
const A = load('gen-bank-r.js', '\n[101, 102', 'barSet,lineSet,pieSet,seat,floor,routeSet,sylSingle');
const B = load('gen-bank-r2.js', '\n[501, 502', 'histSet,codeSet,treeSet,flowSet,dsSet,logicSet');
const out = [];
const take = (fn, idx) => { const n0 = L.bank.length; fn(); const got = L.bank.slice(n0); (idx === undefined ? got : [got[idx]]).forEach(q => out.push(q)); return got; };
const f2 = F.f2;

take(() => A.seat(41, { n: 8, mixed: true }));                                  // 3 Q mixed-facing circular table
// stacked bar, two computed questions
{
  const qs = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'], a = [42, 38, 55, 60, 48], b = [30, 44, 36, 28, 52], c = [18, 22, 25, 34, 30], tot = qs.map((_, i) => a[i] + b[i] + c[i]);
  const set = `<p class='dir'>The stacked bar chart shows the units sold (in hundreds) of three products A, B and C in five quarters.</p>` + L.barChart({ cats: qs, series: [a, b, c], max: 140, step: 20, names: ['Product A', 'Product B', 'Product C'], stacked: true, ylabel: 'Units (hundreds)', title: 'Units sold by product', w: 480, h: 300 });
  const sh = b.map((v, i) => v / tot[i] * 100), bi = sh.indexOf(Math.max(...sh));
  let o = opts(qs[bi], qs.filter(x => x !== qs[bi]), 2);
  out.push({ sec: 'R', topic: 'Data Interpretation', set, q: "In which quarter was Product B's share of the total sales the <b>highest</b>?", opts: o.opts, ans: o.ans, exp: `B's share by quarter: ${qs.map((x, i) => `${x} ${f2(sh[i])}%`).join(', ')}. The highest is ${qs[bi]}, although B's highest absolute sales are in Q5.` });
  const nA = a[4], nB = b[4] * 0.75, nC = c[4] * 1.2, nt = nA + nB + nC, ch = (nt - tot[4]) / tot[4] * 100;
  o = opts(f2(Math.abs(ch)) + '% decrease', [f2(Math.abs(ch) + 4) + '% decrease', f2(Math.abs(ch)) + '% increase', f2(Math.abs(ch) - 2) + '% decrease'], 0);
  out.push({ sec: 'R', topic: 'Data Interpretation', set, q: 'In Q6, Product A sells the same as in Q5, Product B sells 25% less than in Q5 and Product C sells 20% more than in Q5. By what percentage does the total sales of Q6 differ from the total of Q5?', opts: o.opts, ans: o.ans, exp: `Q5: A = 48, B = 52, C = 30, total = 130. Q6: A = 48, B = 52 &times; 0.75 = 39, C = 30 &times; 1.2 = 36, total = ${nt}. Change = (${nt} &minus; 130)/130 &times; 100 = ${f2(ch)}%, i.e. a ${f2(Math.abs(ch))}% decrease.` });
}
take(() => A.floor(61, { n: 7 }), 2);                                            // floors, who lives two floors above
take(() => A.routeSet(203), 0);                                                  // route distance
take(() => B.treeSet(711), 1);                                                   // family tree
take(() => B.flowSet(811), 1);                                                   // flowchart, 5-digit input
take(() => A.sylSingle(333), 0);                                                 // syllogism, model checked
{ let n = 0; for (let s = 900; s < 1200 && n < 1; s++) { const b0 = L.bank.length; B.dsSet(s); const q = L.bank[b0]; if (q && (q.ans === 3 || q.ans === 4)) { out.push(q); n++; } } if (!n) throw new Error('no DS question'); }
take(() => B.codeSet(623), 0);                                                   // inferred coding rule
take(() => B.histSet(512), 0);                                                   // histogram statistics
{ const o = opts('All three conclusions I, II and III follow', ['Only I and II follow', 'Only II and III follow', 'Only I follows'], 1);
  out.push({ sec: 'R', topic: 'Syllogisms', set: `<p><b>Statements:</b> Some managers are analysts. All analysts are auditors. No auditor is a trainee.<br><b>Conclusions:</b> I. Some managers are not trainees. II. No analyst is a trainee. III. Some auditors are managers.</p>`, q: 'Which of the following is correct?', opts: o.opts, ans: o.ans, exp: 'Some managers are analysts, and all analysts are auditors, so those managers are auditors: III follows. No auditor is a trainee and every analyst is an auditor, so no analyst is a trainee: II follows. The managers who are analysts are auditors and so are not trainees: I follows.' }); }
{ let got; for (let s = 127; s < 160; s++) { const b0 = L.bank.length; A.pieSet(s); const g = L.bank.slice(b0); const q = g.find(x => /new<\/b> total/.test(x.q)); if (q) { got = q; break; } } if (!got) throw new Error('no pie question'); out.push(got); }
if (out.length !== 15) throw new Error('expected 15 questions, got ' + out.length);
fs.writeFileSync(process.argv[2], JSON.stringify(out.map(q => ({ topic: q.topic, set: q.set || '', q: q.q, opts: q.opts, ans: q.ans, exp: q.exp }))));
console.log('questions', out.length, out.map(q => q.topic).join(' | '));
