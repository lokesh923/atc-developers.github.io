// Renders question figures to PNG and extracts plain text. Usage: node render-graphy.js in.json outdir
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const qs = JSON.parse(fs.readFileSync(process.argv[2])), dir = process.argv[3]; fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }), p = await b.newPage({ viewport: { width: 760, height: 900 }, deviceScaleFactor: 2, colorScheme: 'light' });
  const css = fs.readFileSync(path.join(__dirname, '..', 'infosys-se', 'style.css'), 'utf8');
  await p.setContent(`<style>${css} body{background:#fff;padding:20px} .fig{margin:0}</style><div id=root></div>`);
  const res = [];
  for (let i = 0; i < qs.length; i++) {
    const q = qs[i];
    await p.evaluate(h => { document.getElementById('root').innerHTML = h; }, `<div id=blk class=qbody>${q.set}</div>`);
    const text = await p.evaluate(() => { const c = document.getElementById('blk').cloneNode(true); c.querySelectorAll('.fig').forEach(f => f.remove()); return c.innerText.trim(); });
    const figs = await p.$$('#blk .fig svg'); const files = [];
    for (let k = 0; k < figs.length; k++) { const f = `q${i + 1}_${k + 1}.png`; await figs[k].screenshot({ path: path.join(dir, f), omitBackground: false }); const bb = await figs[k].boundingBox(); files.push({ f, w: bb.width, h: bb.height }); }
    const plain = async h => p.evaluate(h2 => { const d = document.createElement('div'); d.innerHTML = h2; return d.innerText.trim(); }, h);
    res.push({ topic: q.topic, set: text, q: await plain(q.q), opts: await Promise.all(q.opts.map(plain)), ans: q.ans, exp: await plain(q.exp), figs: files });
  }
  fs.writeFileSync(path.join(dir, 'questions.json'), JSON.stringify(res, null, 1)); await b.close(); console.log('rendered', res.length, 'images', res.reduce((a, r) => a + r.figs.length, 0));
})();
