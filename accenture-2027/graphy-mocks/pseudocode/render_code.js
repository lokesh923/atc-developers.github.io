// Render new pseudocode questions as exam-style code images (line numbers, banded rows).
// Usage: node render_code.js <questions.json> <out_dir>
// questions.json: [{"file": "q07.jpg", "lines": ["Integer a", "..."]}, ...]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const color = s => esc(s)
  .replace(/\b(\d+)\b/g, '<span class="n">$1</span>')
  .replace(/^(\s*)(Integer|String|Set|set|for|if|while|do|End|end|return|Print|print|Class|Abstract|Function|Static|static|public|private|Constructor|Create|Call|swap)\b/,
           '$1<span class="k">$2</span>');

const page = lines => `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:#fff;font-family:Consolas,"DejaVu Sans Mono",monospace;}
  .box{display:inline-block;margin:10px;padding:8px 18px 8px 4px;border-left:3px solid #3b82f6;
       border:1px solid #d6dbe4;border-left:3px solid #3b82f6;background:#fafbfc;min-width:640px}
  .r{display:flex;font-size:19px;line-height:31px;white-space:pre;color:#1f2a44}
  .r:nth-child(even){background:#e8eef7}
  .ln{width:46px;text-align:right;padding-right:14px;color:#6b7280}
  .n{color:#c2410c}.k{color:#1f3a8a}
</style></head><body><div class="box">${
  lines.map((l, i) => `<div class="r"><span class="ln">${i + 1}.</span><span>${color(l)}</span></div>`).join('')
}</div></body></html>`;

(async () => {
  const qs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const browser = await chromium.launch();
  const p = await browser.newPage({ deviceScaleFactor: 1.5 });
  for (const q of qs) {
    await p.setContent(page(q.lines));
    await (await p.$('.box')).screenshot({ path: path.join(process.argv[3], q.file), type: 'jpeg', quality: 92 });
  }
  await browser.close();
})();
