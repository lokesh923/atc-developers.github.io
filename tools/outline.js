const fs=require('fs');const g=JSON.parse(fs.readFileSync(process.argv[2],'utf8'))[process.argv[3]];
g.chapters.forEach(c=>{console.log(`## ${c.n}. ${c.title}${c.hp?' [HP]':''}`);c.blocks.forEach(b=>{
 const d=b.t==='h'?b.x:b.t==='p'?b.x.slice(0,60):b.t==='table'?`${b.head?b.head.join(' | '):'(headless)'} rows=${b.rows.length}`:b.t==='box'?(b.k+': '+(b.x||(b.items||b.paras||[]).length+' items').toString().slice(0,50)):b.t==='sol'?`${b.id} Q:${(b.q[0]||'').slice(0,40)} steps=${b.steps.length} ans=${b.ans.slice(0,25)} ${b.code?'CODE'+b.code.length:''} ${b.imgs?'IMGS'+b.imgs:''}`:b.t==='prac'?`set ${b.n} items=${b.items.length} ${b.imgs?'IMGS'+b.imgs:''}`:b.t==='fig'?`${b.src} ${b.cap}${b.orphan?' ORPHAN':''}`:'';
 console.log('  '+b.t+' '+d);});});
