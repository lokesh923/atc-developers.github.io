/* results, analysis, proctoring report, SCORM reporting */
(function(A){
const C=window.CFG,B=window.BANK,$=A.$,esc=A.esc,LS=A.LS;
const L='ABCDEFGH';
A.compute=ST=>{const R={secs:[],topics:{}};
  [0,1,3].forEach(i=>{const sec=ST.sec[i];let c=0,att=0;const rev=[];
    sec.items.forEach((it,k)=>{const q=B[sec.id].find(x=>x.id===it.id);const a=sec.ans[it.id];const has=a!==undefined&&a!=='';let ok=false;if(has){att++;ok=q.ty==='mcq'?a===q.a:A.eq(a,q.a)}if(ok)c++;const t=(q.t||'General');R.topics[t]=R.topics[t]||[0,0];R.topics[t][1]++;if(ok)R.topics[t][0]++;rev.push({q,it,a,has,ok})});
    R.secs.push({i,name:A.sectionsInfo[i][1],correct:c,att,total:sec.items.length,pct:Math.round(100*c/sec.items.length),rev})});
  // verbal
  {const s=ST.sec[2];let sc=0;const rev=[];s.sc.forEach(it=>{const q=B.S3.find(x=>x.id===it.id);const a=s.scAns[it.id];const ok=a===q.a;if(ok)sc++;rev.push({q,it,a,has:a!==undefined,ok});const t='Verbal: '+(q.t||'');R.topics[t]=R.topics[t]||[0,0];R.topics[t][1]++;if(ok)R.topics[t][0]++});
    const pr=s.pr.map((id,k)=>({task:B.PR.find(x=>x.id===id),text:s.prAns[k]||'',sc:A.scoreRecall(B.PR.find(x=>x.id===id),s.prAns[k]||'')}));
    const em=B.EM.find(x=>x.id===s.em);const es=A.scoreEmail(em,s.emAns||'');
    const pts=sc+pr.reduce((a,x)=>a+x.sc.pct/100,0)+es.pct/100;
    R.secs.splice(2,0,{i:2,name:'Verbal Ability',correct:sc,att:Object.keys(s.scAns).length,total:20,pct:Math.round(100*pts/25),verbal:{sc,rev,pr,em,es,emText:s.emAns||''}})}
  // coding
  {const s=ST.sec[4];const probs=s.items.map(id=>B.S5.find(p=>p.id===id));const per=probs.map(p=>{const r=s.res[p.id];return {p,r,pct:r?Math.round(100*r.passed/r.total):0}});
    R.secs.push({i:4,name:'Advanced Coding',correct:per.reduce((a,x)=>a+(x.r?x.r.passed:0),0),total:per.reduce((a,x)=>a+x.p.tests.length,0),pct:Math.round(per.reduce((a,x)=>a+x.pct,0)/Math.max(1,per.length)),coding:per})}
  R.overall=Math.round(R.secs.reduce((a,s)=>a+s.pct,0)/R.secs.length);return R};
const bar=p=>`<div class="pbar" style="max-width:220px;display:inline-block;width:120px;vertical-align:middle"><i style="width:${p}%;background:${p>=70?'#0f7d6b':p>=40?'#b45309':'#be123c'}"></i></div>`;
A.showReport=ST=>{const R=A.compute(ST);const P=A.proc;
  const hist=LS.get('hist',[]);hist.push({d:Date.now(),o:R.overall,s:R.secs.map(s=>s.pct)});LS.set('hist',hist.slice(-10));
  A.scormReport(R.overall,'S1:'+R.secs[0].pct+',S2:'+R.secs[1].pct+',S3:'+R.secs[2].pct+',S4:'+R.secs[3].pct+',S5:'+R.secs[4].pct+',viol:'+P.total()+',cand:'+ST.cand.name);
  const grade=R.overall>=80?'Excellent':R.overall>=60?'Good: you are on track':R.overall>=40?'Average: needs focused practice':'Needs strong practice';
  const topics=Object.entries(R.topics).filter(([t,v])=>v[1]>=2).map(([t,v])=>[t,v[0],v[1],Math.round(100*v[0]/v[1])]).sort((a,b)=>a[3]-b[3]);
  const weak=topics.filter(t=>t[3]<50).slice(0,8);
  const rows=R.secs.map(s=>`<tr><td><b>${s.name}</b></td><td>${s.i===4?s.correct+' of '+s.total+' test cases':s.i===2?'SC '+s.verbal.sc+'/20 · recall '+Math.round(s.verbal.pr.reduce((a,x)=>a+x.sc.pct,0)/4)+'% · email '+s.verbal.es.pct+'%':s.correct+' correct of '+s.total+' (attempted '+s.att+')'}</td><td><b>${s.pct}%</b> ${bar(s.pct)}</td></tr>`).join('');
  const prev=hist.slice(-6,-1).reverse().map(h=>`<tr><td>${new Date(h.d).toLocaleString()}</td><td>${h.o}%</td></tr>`).join('');
  A.render(`<div class="wrap"><div class="card"><span class="tag">TEST COMPLETED</span><h1>Result: ${esc(ST.cand.name)}</h1><p class="mut">${esc(ST.cand.col||'')} · ${esc(ST.cand.email||'')} · ${new Date(ST.endedAt).toLocaleString()}${ST.reason?' · <b class="bad">'+esc(ST.reason)+'</b>':''}</p>
  <div style="font-size:46px;font-weight:900;color:var(--navy)">${R.overall}% <span style="font-size:18px" class="${R.overall>=C.passMark?'ok':'bad'}">${R.overall>=C.passMark?'PASS':'BELOW PASS MARK'} (${C.passMark}%)</span></div><p><b>${grade}</b></p>
  <table class="t"><tr><th>Section</th><th>Detail</th><th>Score</th></tr>${rows}</table></div>
  <div class="card"><h2>Topic-wise accuracy</h2>${topics.length?`<table class="t"><tr><th>Topic</th><th>Correct</th><th>Accuracy</th></tr>${topics.map(t=>`<tr><td>${esc(t[0])}</td><td>${t[1]}/${t[2]}</td><td>${t[3]}% ${bar(t[3])}</td></tr>`).join('')}</table>`:'<p class="mut">Not enough data.</p>'}${weak.length?`<p><b>Focus on:</b> ${weak.map(t=>esc(t[0])).join(', ')}</p>`:''}</div>
  <div class="card"><h2>Proctoring report</h2><p>Violations recorded: <b class="${P.total()?'bad':'ok'}">${P.total()}</b> ${Object.entries(P.counts).map(([k,v])=>`<span class="tc o" style="background:#b45309">${k}: ${v}</span>`).join('')}</p>
  ${P.log.length?`<table class="t"><tr><th>Time</th><th>Event</th></tr>${P.log.slice(-30).map(l=>`<tr><td>${new Date(l.t).toLocaleTimeString()}</td><td>${esc(l.msg)}</td></tr>`).join('')}</table>`:'<p class="ok">No violations were recorded.</p>'}
  <h3>Photos taken during the test (${P.snaps.length})</h3><div style="display:flex;flex-wrap:wrap;gap:6px">${P.snaps.slice(-24).map(s=>`<figure style="margin:0;text-align:center"><img src="${s.u}" width="110" style="border-radius:6px;transform:scaleX(-1)"><figcaption class="sm mut">${esc(s.label)}</figcaption></figure>`).join('')||'<span class="mut">No photos (camera was off)</span>'}</div>
  <p class="sm mut">Photos and the event log stay on this device. Use the download button to save a copy for your records.</p></div>
  ${R.secs[2].verbal?verbalCard(R.secs[2].verbal):''}${codingCard(R.secs[4])}
  <div class="card"><h2>Answer review</h2>${[0,1,3].map(i=>reviewSec(R.secs.find(s=>s.i===i))).join('')}</div>
  ${prev?`<div class="card"><h2>Your previous attempts</h2><table class="t"><tr><th>Date</th><th>Score</th></tr>${prev}</table></div>`:''}
  <div class="card"><button class="btn" id="dl">Download report (HTML)</button> <button class="btn gr" id="again">Take another test (new questions)</button></div></div>`);
  $('#again').onclick=()=>{A.proc.log=[];A.proc.counts={};A.proc.snaps=[];A.proc.lastAt={};A.welcome(null)};
  $('#dl').onclick=()=>download(ST,R)};
function verbalCard(v){return `<div class="card"><h2>Verbal Ability: Passage recall and Email</h2>${v.pr.map((x,k)=>`<h3>Recall ${k+1}: ${esc(x.task.title)} · ${x.sc.pct}%</h3><div>${x.sc.found.map(f=>`<span class="tc p">✓ ${esc(f)}</span>`).join('')}${x.sc.missing.map(f=>`<span class="tc f">✗ ${esc(f)}</span>`).join('')}</div>${x.sc.wrong.length?`<p class="bad sm">Numbers not in the passage: ${esc(x.sc.wrong.join(', '))}</p>`:''}<details><summary class="sm">Passage, model recall and your answer</summary><p class="sm"><b>Passage:</b> ${esc(x.task.p)}</p><p class="sm"><b>Model recall:</b> ${esc(x.task.m)}</p><p class="sm"><b>You wrote:</b> ${esc(x.text)||'(blank)'}</p></details>`).join('')}
  <h3>Email: ${v.es.pct}% (${v.es.words} words)</h3><div>${v.es.chk.map(c=>`<span class="tc ${c[1]?'p':'f'}">${c[1]?'✓':'✗'} ${esc(c[0])}</span>`).join('')}</div><p class="sm">Facts used from the situation: ${v.es.facts.map(f=>`<span class="tc ${f.ok?'p':'f'}">${esc(f.f)}</span>`).join('')}</p>
  <details><summary class="sm">Your email and the model email</summary><p class="sm"><b>Situation:</b> ${esc(v.em.sc)}</p><pre class="samp">${esc(v.emText)||'(blank)'}</pre><pre class="samp">${esc(v.em.model)}</pre></details>
  <p class="sm mut">Recall and email scores come from automatic key-fact and checklist matching. They are practice indicators, not official TCS marking.</p></div>`}
function codingCard(c){return `<div class="card"><h2>Advanced Coding</h2>${c.coding.map(x=>`<h3>${esc(x.p.title)} <span class="lv ${x.p.level}">${x.p.level}</span> · ${x.r?x.r.passed+'/'+x.r.total+' test cases':'not submitted'}</h3>${x.r?x.r.vs.map((v,k)=>`<span class="tc ${v&&v.v==='AC'?'p':'f'}">#${k+1} ${v?v.v:''}</span>`).join(''):''}`).join('')}<p class="sm mut">AC = accepted, WA = wrong answer, TLE = time limit, RE = runtime error, CE = compile error.</p></div>`}
function reviewSec(s){return `<h3>${s.name}</h3>`+s.rev.map((r,k)=>{const q=r.q;const ca=q.ty==='mcq'?r.it.ord.map((oi,x)=>oi===q.a?L[x]:'').join('')+'. '+q.o[q.a]:q.a;const ya=!r.has?'<i>not answered</i>':q.ty==='mcq'?(L[r.it.ord.indexOf(r.a)]+'. '+q.o[r.a]):esc(r.a);
  return `<details class="rev" style="margin:6px 0"><summary class="${r.ok?'ok':'bad'}">Q${k+1} · ${r.ok?'Correct':r.has?'Wrong':'Not answered'} · ${esc(q.t||'')}</summary><div class="qtext">${q.q}</div><p class="sm"><b>Your answer:</b> ${ya}</p><p class="sm"><b>Correct answer:</b> ${ca}</p><p class="sm">${q.e||''}</p></details>`}).join('')}
function download(ST,R){const P=A.proc;const h=`<!doctype html><meta charset="utf-8"><title>Test report</title><body style="font-family:Arial;max-width:860px;margin:20px auto"><h1>TCS NQT Live Practice Test: report</h1><p><b>${esc(ST.cand.name)}</b> · ${esc(ST.cand.email)} · ${esc(ST.cand.mob)} · ${esc(ST.cand.col)} · ${esc(ST.cand.roll||'')}<br>${new Date(ST.endedAt).toLocaleString()}</p><h2>Overall: ${R.overall}%</h2><ul>${R.secs.map(s=>`<li>${s.name}: ${s.pct}%</li>`).join('')}</ul><h2>Violations: ${P.total()}</h2><ul>${P.log.map(l=>`<li>${new Date(l.t).toLocaleTimeString()} ${esc(l.msg)}</li>`).join('')}</ul><h2>Photos</h2>${P.snaps.map(s=>`<img src="${s.u}" width="120" title="${esc(s.label)}"> `).join('')}</body>`;
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([h],{type:'text/html'}));a.download='NQT_test_report_'+ST.cand.name.replace(/\W+/g,'_')+'.html';a.click()}
})(window.ATC);
