// Compiles and runs every "runnable" code block in infosys-interview/data and
// compares stdout with the "expect:" lines; also verifies coding problems and SQL.
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const root = path.join(__dirname, '..', 'infosys-interview', 'data');
global.window = global; global.IV = { modules: [], coding: [], sql: { schema: [], items: [] }, sheets: [], plan: [], process: null, addModule(m) { this.modules.push(m); } };
for (const f of ['core', 'process', 'dsa', 'oops', 'dbms', 'os', 'cn', 'sdlc', 'langs', 'modern', 'hr', 'projects', 'coding', 'sql', 'sheets', 'plan']) {
  const p = path.join(root, f + '.js'); if (!fs.existsSync(p)) { console.log('missing', f); continue; }
  if (f === 'core') continue; // keep our own IV with arrays
  try { (0, eval)(fs.readFileSync(p, 'utf8')); } catch (e) { console.log('LOAD ERROR', f, e.message); process.exit(1); }
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'iv-'));
let fail = 0, ok = 0;
const run = (cmd, args, opt) => cp.spawnSync(cmd, args, Object.assign({ encoding: 'utf8', timeout: 60000, cwd: tmp }, opt));
function exec(lang, code, id) {
  const d = path.join(tmp, id.replace(/\W/g, '_')); fs.mkdirSync(d, { recursive: true });
  const o = { cwd: d };
  if (lang === 'java') { fs.writeFileSync(path.join(d, 'Main.java'), code); const c = run('javac', ['-encoding', 'UTF-8', 'Main.java'], o); if (c.status) return 'COMPILE: ' + c.stderr.replace(/Picked up.*\n/, ''); const r = run('java', ['Main'], o); return r.status ? 'RUNTIME: ' + r.stderr : r.stdout; }
  if (lang === 'python') { fs.writeFileSync(path.join(d, 'm.py'), code); const r = run('python3', ['-I', 'm.py'], o); return r.status ? 'RUNTIME: ' + r.stderr : r.stdout; }
  if (lang === 'c') { fs.writeFileSync(path.join(d, 'm.c'), code); const c = run('gcc', ['-std=c11', '-w', '-o', 'm', 'm.c', '-lm'], o); if (c.status) return 'COMPILE: ' + c.stderr; const r = run('./m', [], o); return r.status ? 'RUNTIME: ' + r.stderr : r.stdout; }
  if (lang === 'cpp') { fs.writeFileSync(path.join(d, 'm.cpp'), code); const c = run('g++', ['-std=c++17', '-w', '-o', 'm', 'm.cpp'], o); if (c.status) return 'COMPILE: ' + c.stderr; const r = run('./m', [], o); return r.status ? 'RUNTIME: ' + r.stderr : r.stdout; }
  return 'UNKNOWN LANG ' + lang;
}
function check(id, lang, code, expectLines) {
  const out = exec(lang, code, id);
  const got = out.replace(/\r/g, '').replace(/\n$/, '').split('\n').join('\n'), want = expectLines.join('\n');
  if (got === want) ok++; else { fail++; console.log('FAIL', id, lang, '\n--- want\n' + want + '\n--- got\n' + got.slice(0, 600)); }
}
let n = 0;
const strip = c => c.filter(l => !/^\s*(\/\/|#|--) *(runnable|expect:)/.test(l));
for (const m of IV.modules) {
  if (!m.qa) { if (m.page) scan(m.id + '/page', m.page); continue; }
  m.qa.forEach((q, i) => {
    if (!q.q || !q.a || !['basic', 'medium', 'adv'].includes(q.lvl)) { fail++; console.log('BAD QA', m.id, i); }
    scan(m.id + '#' + i, q.a);
  });
}
function scan(id, text) {
  const re = /```(\w*)\n([\s\S]*?)```/g; let mt, k = 0;
  while ((mt = re.exec(text))) {
    const lines = mt[2].replace(/\n$/, '').split('\n');
    if (!lines.some(l => /^\s*(\/\/|#|--) *runnable/.test(l))) continue;
    const exp = lines.filter(l => /^\s*(\/\/|#|--) *expect:/.test(l)).map(l => l.replace(/^\s*(\/\/|#|--) *expect: ?/, ''));
    check(id + '.' + (k++), mt[1], strip(lines).join('\n') + '\n', exp); n++;
  }
}
for (const c of IV.coding) {
  for (const lg of ['java', 'python', 'c']) { if (!c.sol[lg]) { fail++; console.log('MISSING sol', c.id, lg); continue; } check('code-' + c.id + '-' + lg, lg, c.sol[lg], c.expect.split('\n')); }
}
// SQL: run each query on sqlite via python and compare the stored output
if (IV.sql.items.length) {
  const job = { schema: IV.sql.schema, items: IV.sql.items.map(i => ({ sql: i.sql, out: i.out })) };
  fs.writeFileSync(path.join(tmp, 'sql.json'), JSON.stringify(job));
  fs.writeFileSync(path.join(tmp, 'sql.py'), `
import json, sqlite3, sys
j = json.load(open('sql.json')); db = sqlite3.connect(':memory:')
for t in j['schema']:
    db.execute('create table %s (%s)' % (t['table'], ', '.join(t['cols'])))
    db.executemany('insert into %s values (%s)' % (t['table'], ','.join('?' * len(t['cols']))), t['rows'])
bad = 0
for i, it in enumerate(j['items']):
    try:
        cur = db.execute(it['sql']); cols = [d[0] for d in cur.description]; rows = [list(r) for r in cur.fetchall()]
    except Exception as e:
        print('SQL ERROR', i + 1, e); bad += 1; continue
    o = it.get('out')
    if o and (o['cols'] != cols or json.loads(json.dumps(o['rows'])) != json.loads(json.dumps(rows))):
        print('SQL MISMATCH', i + 1, cols, rows[:5], o['rows'][:5]); bad += 1
print('SQL bad', bad, 'of', len(j['items']))
sys.exit(1 if bad else 0)
`);
  const r = run('python3', ['-I', 'sql.py']); process.stdout.write(r.stdout + r.stderr); if (r.status) fail++; else ok += IV.sql.items.length;
}
console.log(`runnable blocks: ${n}, checks ok: ${ok}, failures: ${fail}`);
process.exit(fail ? 1 : 0);
