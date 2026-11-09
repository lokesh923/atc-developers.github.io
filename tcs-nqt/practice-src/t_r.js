global.window=global;require('./gen_r.js');const G=NG;let n=0,bad=0;const t0=Date.now();const fails={};
for(const f of G.F){let ok=0;const tries=f.id.startsWith('seat')||f.id==='floors'||f.id==='inequality'?25:120;for(let i=0;i<tries;i++){const q=G.make(f);if(!q){fails[f.id]=(fails[f.id]||0)+1;continue}ok++;n++;
  if(new Set(q.o).size!==q.o.length||q.a<0||q.a>=q.o.length||/undefined|NaN|Infinity/.test(q.q+q.o.join()+q.e)){bad++;console.log('BAD',f.id,q.q.slice(0,90),q.o)}}
  console.log(f.id.padEnd(14),'ok',ok,'/',tries)}
console.log('families',G.F.length,'topics',G.topics.length,'questions',n,'bad',bad,'ms',Date.now()-t0);
for(const id of ['blood','direction','syllo','inequality','seat_lin','ds','machine','floors']){const q=G.make(G.F.find(f=>f.id===id));if(q)console.log('\n['+id+']',q.q,'\n  options:',q.o.join(' | '),'=>',q.o[q.a],'\n  ',q.e)}
