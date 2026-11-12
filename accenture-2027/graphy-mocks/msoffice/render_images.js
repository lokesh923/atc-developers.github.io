// Draws the exam-style screenshots used in the MS Office mocks.
// Usage: node render_images.js <out_dir>
const { chromium } = require('playwright');
const path = require('path');
const sheet = (rows, formula, cell) => `<!doctype html><html><head><meta charset="utf-8"><style>
 body{margin:0;font-family:Calibri,Carlito,"Segoe UI",Arial,sans-serif;background:#fff}
 .wrap{display:inline-block;margin:8px;border:1px solid #c6c6c6}
 .fb{display:flex;align-items:center;border-bottom:1px solid #c6c6c6;font-size:14px;height:28px}
 .nb{width:70px;border-right:1px solid #c6c6c6;padding:0 6px;height:100%;display:flex;align-items:center}
 .fx{color:#666;font-style:italic;padding:0 10px;border-right:1px solid #c6c6c6;height:100%;display:flex;align-items:center}
 .fv{padding:0 10px;font-family:Consolas,"DejaVu Sans Mono",monospace;font-size:13.5px}
 table{border-collapse:collapse;font-size:15px}
 td,th{border:1px solid #d4d4d4;height:24px;padding:0 8px;min-width:78px}
 th{background:#f2f2f2;color:#444;font-weight:normal;text-align:center}
 th.rn{min-width:28px;width:28px}
 td.num{text-align:right}
 td.hd{font-weight:bold;background:#ddebf7}
 td.sel{outline:2px solid #217346;outline-offset:-2px}
</style></head><body><div class="wrap"><div class="fb"><div class="nb">${cell}</div><div class="fx">fx</div><div class="fv">${formula}</div></div>
<table><tr><th class="rn"></th>${["A","B","C","D","E"].map(c=>`<th>${c}</th>`).join("")}</tr>
${rows.map((r,i)=>`<tr><th class="rn">${i+1}</th>${r.map((v,j)=>`<td class="${i===0&&v?"hd":""} ${typeof v==="number"?"num":""} ${(i===1&&j===4)?"sel":""}">${v}</td>`).join("")}</tr>`).join("")}
</table></div></body></html>`;
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 2 });
  const rows = [["Region","Rep","Sales","",""],["North","Asha",1200,"",""],["South","Ravi",900,"",""],["North","Meena",650,"",""],
                ["East","John",1100,"",""],["North","Priya",300,"",""],["South","Arjun",450,"",""]];
  await p.setContent(sheet(rows, '=SUMIFS(C2:C7,A2:A7,"North",C2:C7,"&gt;500")', "E2"));
  await (await p.$('.wrap')).screenshot({ path: path.join(out, 'q1.png') });
  await b.close();
})();
