global.window=global;require('./gen.js');require('./gen2.js');
const G=NG;let bad=0,tot=0,ti=0;const fails={};
for(const f of G.F){let ok=0,tries=400;for(let i=0;i<tries;i++){const q=G.make(f,{titaRate:0.3});if(!q){fails[f.id]=(fails[f.id]||0)+1;continue}tot++;ok++;
  if(q.ty==='mcq'){if(new Set(q.o).size!==4||q.a<0||q.a>3){bad++;console.log('BAD options',f.id,q.o,q.a)}}else{ti++;if(!isFinite(parseFloat(q.a))){bad++;console.log('BAD tita',f.id,q.a)}}
  if(/undefined|NaN|Infinity/.test(q.q+(q.e||'')+(q.o||[]).join())){bad++;console.log('BAD text',f.id,q.q.slice(0,100))}}
  if(ok<tries*0.8)console.log('LOW yield',f.id,ok)}
console.log('families',G.F.length,'topics',G.topics.length,'questions',tot,'tita',ti,'bad',bad,'gen-fail families',JSON.stringify(fails));
const p=G.paper(20);console.log('paper',p.length,[...new Set(p.map(q=>q.t))].length,'topics');
console.log(JSON.stringify(G.make(G.F.find(f=>f.id==='pl_markup')),null,0).slice(0,400));
