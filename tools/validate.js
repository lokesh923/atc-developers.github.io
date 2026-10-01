// Sanity checks over the complete question bank (old + generated). Usage: node tools/validate.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'infosys-se', 'data');
global.window = { DATA: null };
eval(fs.readFileSync(path.join(root, 'bank.js'), 'utf8')); const DATA = window.DATA;
eval(fs.readFileSync(path.join(root, 'extra.js'), 'utf8'));
const bad = []; const ids = new Set();
DATA.questions.forEach(q => {
  const where = `#${q.id} ${q.sec}`;
  if (ids.has(q.id)) bad.push(where + ' duplicate id'); ids.add(q.id);
  const all = (q.set || '') + q.q + (q.exp || '') + (q.opts || []).join(' ');
  if (/NaN|undefined|\[object|null\b|Infinity/.test(all)) bad.push(where + ' contains NaN/undefined: ' + all.match(/.{0,30}(NaN|undefined|\[object|null\b|Infinity).{0,30}/)[0]);
  if (q.type === 'mcq') {
    if (!Array.isArray(q.opts) || q.opts.length < 4) bad.push(where + ' fewer than 4 options');
    else if (new Set(q.opts).size !== q.opts.length) bad.push(where + ' duplicate options');
    if (!(q.ans >= 0 && q.ans < (q.opts || []).length)) bad.push(where + ' answer index out of range');
    if (!q.exp) bad.push(where + ' missing explanation');
  }
  if (q.type === 'text' && !(q.answers && q.answers.length)) bad.push(where + ' text question without answers');
});
const ansPos = [0, 0, 0, 0]; DATA.questions.filter(q => q.type === 'mcq' && q.opts.length === 4 && q.id >= 4000).forEach(q => ansPos[q.ans]++);
DATA.mocks.forEach(m => m.sections.forEach(s => s.ids.forEach(id => { if (!ids.has(id)) bad.push(`mock "${m.name}" references missing id ${id}`); })));
const bySec = {}; DATA.questions.forEach(q => bySec[q.sec] = (bySec[q.sec] || 0) + 1);
console.log('questions', DATA.questions.length, bySec, 'mocks', DATA.mocks.length, 'answer-position spread (generated, 4-option)', ansPos);
console.log(bad.length ? bad.join('\n') : 'validation passed');
process.exit(bad.length ? 1 : 0);
