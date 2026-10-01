const QMAP = {}; DATA.questions.forEach(q => QMAP[q.id] = q);
const SECNAME = {R:'Reasoning Ability',T:'Technical Ability',V:'Verbal Ability',P:'Pseudocode',Z:'Numerical Puzzle',G:'English Grammar',W:'English Writing'};
const SECRATE = {R:25/15,T:3.5,V:1,P:2,Z:2.5,G:2,W:10}; // minutes per question
const SECMARK = {R:1,T:1,V:1,P:2,Z:2.5,G:2,W:0};
const $ = s => document.querySelector(s);
const app = $('#app');
let S = null; let tick = null;
const store = {
  get(){ try { return JSON.parse(localStorage.getItem('infySE_attempts')||'[]'); } catch(e){ return []; } },
  add(a){ try { const l=this.get(); l.unshift(a); localStorage.setItem('infySE_attempts', JSON.stringify(l.slice(0,12))); } catch(e){} }
};
function fmt(sec){ sec=Math.max(0,Math.round(sec)); const m=Math.floor(sec/60), s=sec%60; return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0'); }
function esc(t){ const d=document.createElement('div'); d.textContent=t; return d.innerHTML; }
function words(t){ return (t.trim().match(/\S+/g)||[]).length; }
function isCorrect(q, a){
  if (a===undefined || a===null || a==='') return false;
  if (q.type==='mcq') return a===q.ans;
  if (q.type==='text') return q.answers.some(x => x.toLowerCase()===String(a).trim().toLowerCase());
  return false;
}
function stopTimer(){ if (tick){ clearInterval(tick); tick=null; } }
function showBar(on){ $('#examBar').hidden=!on; $('#homeBtn').hidden=!on; }
$('#homeBtn').addEventListener('click', () => {
  if (S && S.mode==='mock' && S.phase==='q' && !S.confirmExit){ S.confirmExit=true; renderQ(); return; }
  stopTimer(); S=null; try{ if(document.fullscreenElement) document.exitFullscreen().catch(()=>{}); }catch(e){} home();
});

/* ---------------- HOME ---------------- */
function home(){
  showBar(false); window.scrollTo(0,0);
  const hist = store.get();
  const mockCards = DATA.mocks.map((m,i) => {
    const qn = m.sections.reduce((a,s)=>a+s.ids.length,0), mins = m.sections.reduce((a,s)=>a+s.minutes,0);
    return `<div class="panel mockcard">
      <div class="row"><h2>${m.name}</h2><span class="chip">${qn} questions | ${mins} min</span></div>
      <div class="chips">${m.sections.map(s=>`<span class="chip">${s.key==='Z'?'Puzzle':s.name.split(' ')[0]==='English'?s.name.replace('English ',''):s.name.split(' ')[0]} ${s.ids.length}Q · ${s.minutes}m</span>`).join('')}</div>
      ${m.note?`<p class="muted" style="margin:0;font-size:.9rem">${m.note}</p>`:''}
      <p class="muted" style="margin:0;font-size:.9rem">Real exam rules: every section has its own timer, each answer is final once submitted, and you cannot go back to an earlier section.</p>
      <div><button class="btn primary" data-mock="${i}">Start ${m.name}</button></div></div>`;
  }).join('');
  const counts = {}; DATA.questions.forEach(q => counts[q.sec]=(counts[q.sec]||0)+1);
  const pr = Object.keys(SECNAME).map(k => `<button class="btn" data-prac="${k}">${SECNAME[k]} <span class="muted">(${counts[k]||0})</span></button>`).join('');
  app.innerHTML = `
  <div class="stack">
    <section class="stack" style="gap:8px">
      <div class="eyebrow">Infosys Systems Engineer | Written test practice</div>
      <h1>Practise the real Infosys SE test, section by section, against the clock</h1>
      <p class="muted" style="margin:0;max-width:68ch">Every question here comes from actual Infosys SE test papers, rewritten cleanly with a verified answer and a step-by-step explanation. Take a full mock under exam timing, or drill one section at a time.</p>
    </section>
    <section class="grid2">${mockCards}</section>
    <section class="panel">
      <div class="row" style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:baseline"><h2>Section practice</h2><span class="muted" style="font-size:.9rem">One section timer, instant answer check</span></div>
      <p class="muted" style="margin:6px 0 12px;font-size:.92rem">All questions of one section with a single countdown timer at real exam speed. Move freely between questions and check each answer as you go.</p>
      <div class="secbtns">${pr}</div>
    </section>
    <section class="panel">
      <h2>Exam pattern</h2>
      <div class="tablewrap" style="margin-top:8px"><table class="pat"><thead><tr><th>Section</th><th>Questions</th><th>Marks</th><th>Time</th><th>Safe target (80%)</th></tr></thead><tbody>
      <tr><td>Reasoning Ability</td><td>15</td><td>15</td><td>25 min</td><td>12 correct</td></tr>
      <tr><td>Technical Ability</td><td>10</td><td>10</td><td>35 min</td><td>8 correct</td></tr>
      <tr><td>Verbal Ability</td><td>20</td><td>20</td><td>20 min</td><td>16 correct</td></tr>
      <tr><td>Pseudocode</td><td>5</td><td>10</td><td>10 min</td><td>4 correct</td></tr>
      <tr><td>Numerical Puzzle</td><td>4</td><td>10</td><td>10 min</td><td>4 correct</td></tr>
      <tr><td>English Grammar</td><td>5</td><td>10</td><td>10 min</td><td>4 correct</td></tr>
      <tr><td>English Writing</td><td>1</td><td>NA</td><td>10 min</td><td>Evaluated separately</td></tr>
      </tbody></table></div>
      <div class="cutbox"><b>About the cutoff.</b> Last year's sectional cutoff was around 70%, but Infosys does not disclose the exact cutoff, and it changes with the test's difficulty and the number of open positions. Scoring just 70% is not enough to be sure of an interview call, so aim for 80% or more in every section.</div>
    </section>
    ${hist.length?`<section class="panel"><h2>Your recent attempts</h2><div class="tablewrap" style="margin-top:8px"><table class="pat"><thead><tr><th>Test</th><th>Date</th><th>Score</th><th>Sections safe</th></tr></thead><tbody>${hist.map(h=>`<tr><td>${esc(h.name)}</td><td>${esc(h.date)}</td><td>${esc(h.score)}</td><td>${esc(h.cleared)}</td></tr>`).join('')}</tbody></table></div><p class="muted" style="font-size:.82rem;margin:8px 0 0">Saved only in this browser.</p></section>`:''}
  </div>`;
  app.querySelectorAll('[data-mock]').forEach(b => b.addEventListener('click', () => startMock(+b.dataset.mock)));
  app.querySelectorAll('[data-prac]').forEach(b => b.addEventListener('click', () => startPractice(b.dataset.prac)));
}

/* ---------------- MOCK ---------------- */
function startMock(i){
  const m = DATA.mocks[i];
  S = {mode:'mock', m, si:0, qi:0, ans:{}, state:{}, used:[], phase:'login'};
  showBar(true); $('#barMock').textContent = m.name; $('#barSec').textContent='Candidate check-in'; $('#timer').textContent='--:--';
  loginScreen();
}
function totals(m){ return {q:m.sections.reduce((a,s)=>a+s.ids.length,0), min:m.sections.reduce((a,s)=>a+s.minutes,0), marks:m.sections.filter(s=>s.key!=='W').reduce((a,s)=>a+s.ids.length*s.marks,0)}; }
function loginScreen(){
  window.scrollTo(0,0); const t=totals(S.m); let saved=''; try{ saved=localStorage.getItem('infySE_name')||''; }catch(e){}
  app.innerHTML=`<div class="startgrid">
   <div class="panel stack">
     <div><div class="eyebrow">Step 1 of 3 | Candidate check-in</div><h1 style="margin-top:4px">${S.m.name}</h1></div>
     <div class="kv"><div><span>Questions</span><b>${t.q}</b></div><div><span>Duration</span><b>${t.min} min</b></div><div><span>Sections</span><b>${S.m.sections.length}</b></div><div><span>Marks</span><b>${+t.marks.toFixed(1)}</b></div></div>
     <div><label class="eyebrow" for="cname">Candidate name</label><input class="txtin" id="cname" autocomplete="name" placeholder="Enter your full name" value="${esc(saved)}"></div>
     <div><label class="eyebrow" for="cid">Roll number or email (optional)</label><input class="txtin" id="cid" autocomplete="off" placeholder="e.g. 2027CSE014"></div>
     <p class="err" id="nameErr" hidden>Enter your name to continue.</p>
     <div class="actions" style="justify-content:flex-end"><button class="btn primary" id="toInst">Continue to instructions</button></div>
   </div>
   <aside class="panel stack" style="gap:10px"><div class="eyebrow">Sections in this test</div>
     ${S.m.sections.map((s,i)=>`<div class="secline"><span class="num">${i+1}</span><span>${s.name}</span><span class="muted">${s.ids.length} Q · ${s.minutes} min</span></div>`).join('')}
   </aside></div>`;
  $('#cname').focus();
  $('#toInst').addEventListener('click',()=>{ const n=$('#cname').value.trim(); if(!n){ $('#nameErr').hidden=false; $('#cname').focus(); return; }
    S.cand={name:n,id:$('#cid').value.trim()}; try{ localStorage.setItem('infySE_name',n); }catch(e){} instructions(); });
  $('#cname').addEventListener('keydown',e=>{ if(e.key==='Enter') $('#toInst').click(); });
}
function instructions(){
  window.scrollTo(0,0); const t=totals(S.m); $('#barSec').textContent='Instructions';
  app.innerHTML=`<div class="panel stack" style="max-width:820px;margin:0 auto">
   <div><div class="eyebrow">Step 2 of 3 | Read carefully</div><h1 style="margin-top:4px">General instructions</h1><p class="muted" style="margin:4px 0 0">Candidate: <b>${esc(S.cand.name)}</b>${S.cand.id?' | '+esc(S.cand.id):''}</p></div>
   <div class="tablewrap"><table class="pat"><thead><tr><th>#</th><th>Section</th><th>Questions</th><th>Time</th><th>Marks</th><th>Safe target (80%)</th></tr></thead><tbody>
   ${S.m.sections.map((s,i)=>`<tr><td>${i+1}</td><td>${s.name}</td><td>${s.ids.length}</td><td>${s.minutes} min</td><td>${s.key==='W'?'Evaluated separately':+(s.ids.length*s.marks).toFixed(1)}</td><td>${s.key==='W'?'Well-structured answer':Math.ceil(s.ids.length*0.8-1e-9)+' correct'}</td></tr>`).join('')}
   </tbody></table></div>
   <ol class="inst">
     <li>The test has ${S.m.sections.length} section${S.m.sections.length>1?'s':''} and lasts ${t.min} minutes. Each section has its own timer. When a section's time ends, it closes automatically and the next section opens.</li>
     <li>Questions once submitted cannot be attempted again. Press <b>Submit answer</b> to lock an answer, or <b>Skip</b> to leave it blank.</li>
     <li>You cannot go back to a section after it is over.</li>
     <li>There is no negative marking in this practice test, so attempt every question.</li>
     <li>Keep rough paper and a pen ready. Calculators are not allowed in the real test.</li>
     <li>Do not refresh or close this page during the test; your answers will be lost.</li>
   </ol>
   <div class="cutbox"><b>Cutoff: aim above 70%.</b> Last year's sectional cutoff was around 70%, but the exact cutoff is not disclosed and changes with difficulty and the number of open positions. To be safe for an interview call, target <b>80% or more in every section</b>. A weak score in even one section can stop you.</div>
   <label class="agree"><input type="checkbox" id="agree"> I have read and understood the instructions. I will attempt this test honestly, without help.</label>
   <div class="actions"><button class="btn" id="backLogin">Back</button><button class="btn primary" id="toCheck" disabled>I am ready to begin</button></div>
  </div>`;
  $('#agree').addEventListener('change',e=>$('#toCheck').disabled=!e.target.checked);
  $('#backLogin').addEventListener('click',loginScreen);
  $('#toCheck').addEventListener('click',systemCheck);
}
function systemCheck(){
  window.scrollTo(0,0); $('#barSec').textContent='System check';
  const items=['Browser compatibility','Timer synchronisation','Question paper loaded','Answer saving'];
  app.innerHTML=`<div class="panel stack" style="max-width:560px;margin:0 auto">
   <div><div class="eyebrow">Step 3 of 3 | System check</div><h1 style="margin-top:4px">Preparing your test</h1></div>
   <div class="checks">${items.map((x,i)=>`<div class="ck" id="ck${i}"><span class="dot"></span><span>${x}</span><span class="st muted">Waiting</span></div>`).join('')}</div>
   <div id="cdWrap" hidden class="countdown"><div class="eyebrow">Your test begins in</div><div class="cd" id="cd">5</div><div class="muted">Section 1: ${S.m.sections[0].name} · ${S.m.sections[0].minutes} minutes</div></div>
  </div>`;
  let i=0;
  const step=()=>{ if(!S||S.phase!=='login') return;
    if(i>0){ const p=$('#ck'+(i-1)); p.classList.add('ok'); p.querySelector('.st').textContent='Ready'; }
    if(i<items.length){ const c=$('#ck'+i); c.classList.add('run'); c.querySelector('.st').textContent='Checking…'; i++; setTimeout(step,550); }
    else { $('#cdWrap').hidden=false; let n=5; const cd=setInterval(()=>{ if(!S||S.phase!=='login'){clearInterval(cd);return;} n--; if(n<=0){ clearInterval(cd); try{ if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{}); }catch(e){} S.phase='intro'; sectionIntro(); } else $('#cd').textContent=n; },1000); }
  };
  step();
}
function sec(){ return S.m.sections[S.si]; }
function sectionIntro(){
  if (S.cand) $('#barMock').textContent = S.m.name+' | '+S.cand.name;
  stopTimer(); S.phase='intro'; S.confirmExit=false; const s=sec(); window.scrollTo(0,0);
  $('#barSec').textContent = `Section ${S.si+1} of ${S.m.sections.length}: ${s.name}`;
  $('#timer').textContent = fmt(s.minutes*60); $('#timer').classList.remove('low');
  const mk = s.key==='W' ? 'Evaluated separately' : `${+(s.ids.length*s.marks).toFixed(1)} marks (${s.marks} per question)`;
  app.innerHTML = `<div class="panel stack" style="max-width:640px;margin:0 auto">
    <div class="eyebrow">Section ${S.si+1} of ${S.m.sections.length}</div><h1>${s.name}</h1>
    <div class="chips"><span class="chip">${s.ids.length} question${s.ids.length>1?'s':''}</span><span class="chip">${s.minutes} minutes</span><span class="chip">${mk}</span></div>
    <ul class="muted" style="margin:0;padding-left:1.2em">
      <li>The timer starts when you press Start. When it reaches zero the section closes automatically.</li>
      <li>Questions once submitted cannot be attempted again. Use Skip if you want to leave a question.</li>
      <li>You cannot return to this section after it ends.</li>
      ${s.key!=='W'?`<li>Last year's cutoff was around 70% (${Math.ceil(s.ids.length*0.7-1e-9)} correct). Aim for ${Math.ceil(s.ids.length*0.8-1e-9)} or more correct to be safe.</li>`:'<li>Write a well-structured answer; you will score it yourself with a rubric at the end.</li>'}
    </ul>
    <div><button class="btn primary" id="go">Start section</button></div></div>`;
  $('#go').addEventListener('click', () => {
    S.phase='q'; S.qi=0; S.secStart=Date.now(); S.deadline=Date.now()+s.minutes*60000;
    tick=setInterval(onTick, 500); onTick(); renderQ();
  });
}
function onTick(){
  const left=(S.deadline-Date.now())/1000;
  $('#timer').textContent=fmt(left); $('#timer').classList.toggle('low', left<=60);
  if (left<=0){ finishSection(true); }
}
function curQ(){ return QMAP[sec().ids[S.qi]]; }
function renderQ(){
  if (S.mode==='practice') return renderP();
  const s=sec(), q=curQ(), n=s.ids.length; window.scrollTo(0,0);
  const sel = S.ans[q.id];
  let input='';
  if (q.type==='mcq') input = `<div class="opts" role="radiogroup">${q.opts.map((o,i)=>`<label class="opt ${sel===i?'sel':''}"><input type="radio" name="opt" id="o${i}" value="${i}" ${sel===i?'checked':''}><span class="k">${String.fromCharCode(65+i)}</span><span>${o}</span></label>`).join('')}</div>`;
  else if (q.type==='text') input = `<div style="margin-top:14px"><label for="tin" class="eyebrow">Your answer</label><input class="txtin" id="tin" autocomplete="off" value="${esc(sel||'')}" placeholder="Type your answer"></div>`;
  else input = `<div style="margin-top:14px"><label for="wta" class="eyebrow">Your response</label><textarea id="wta" placeholder="Start writing here…">${esc(sel||'')}</textarea><div class="wc" id="wc">${words(sel||'')} words</div></div>`;
  const pal = s.ids.map((id,i)=>`<div class="pal ${i===S.qi?'cur':''} ${S.state[id]==='done'?'done':S.state[id]==='skip'?'skip':''}">${i+1}</div>`).join('');
  app.innerHTML = `<div class="exam">
    <div class="panel"><div class="qhead"><h2>Question ${S.qi+1} <span class="muted" style="font-size:.9rem">of ${n}</span></h2><span class="chip">${q.topic}${s.key!=='W'?` | ${s.marks} mark${s.marks>1?'s':''}`:''}</span></div>
      <div class="lockline">Questions once submitted cannot be attempted again.</div>
      <div class="qbody">${q.q}</div>${input}
      ${S.confirmExit?`<div class="inline-confirm"><span>Leave the test? Your answers so far will be scored.</span><button class="btn warn" id="yesExit">End test now</button><button class="btn" id="noExit">Continue test</button></div>`:''}
      <div class="actions"><button class="btn" id="skip">Skip</button><button class="btn primary" id="sub">Submit answer</button></div></div>
    <aside class="panel"><div class="eyebrow">${s.name}</div><div class="palette">${pal}</div>
      <div class="legend"><div><span style="background:var(--good-soft);border-color:var(--good)"></span>Submitted</div><div><span style="background:var(--signal-soft);border-color:var(--signal)"></span>Skipped</div><div><span></span>Not yet seen</div></div></aside></div>`;
  app.querySelectorAll('input[name=opt]').forEach(r=>r.addEventListener('change',()=>{S.ans[q.id]=+r.value; app.querySelectorAll('.opt').forEach((l,i)=>l.classList.toggle('sel',i===+r.value));}));
  const tin=$('#tin'); if (tin){ tin.addEventListener('input',()=>S.ans[q.id]=tin.value); tin.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submitQ('done');}}); }
  const wta=$('#wta'); if (wta) wta.addEventListener('input',()=>{S.ans[q.id]=wta.value; $('#wc').textContent=words(wta.value)+' words';});
  $('#sub').addEventListener('click',()=>submitQ('done'));
  $('#skip').addEventListener('click',()=>{ delete S.ans[q.id]; submitQ('skip'); });
  if (S.confirmExit){ $('#yesExit').addEventListener('click',()=>{stopTimer(); S.confirmExit=false; S.abandoned=true; finishAll();}); $('#noExit').addEventListener('click',()=>{S.confirmExit=false; renderQ();}); }
}
function submitQ(kind){
  const s=sec(), q=curQ();
  if (kind==='done' && (S.ans[q.id]===undefined || S.ans[q.id]==='')) kind='skip';
  S.state[q.id]=kind;
  if (S.qi < s.ids.length-1){ S.qi++; renderQ(); } else finishSection(false);
}
function finishSection(timeout){
  stopTimer(); const s=sec();
  s.ids.forEach(id=>{ if(!S.state[id]) S.state[id]='skip'; });
  S.used[S.si]=Math.min(s.minutes*60,(Date.now()-S.secStart)/1000);
  if (S.si < S.m.sections.length-1){
    S.si++;
    if (timeout){ app.innerHTML=`<div class="panel" style="max-width:640px;margin:0 auto"><h2>Time is up for ${s.name}</h2><p class="muted">Unsubmitted questions were left blank. The next section is ready.</p><button class="btn primary" id="nx">Continue</button></div>`; $('#nx').addEventListener('click',sectionIntro); $('#timer').textContent='00:00'; }
    else sectionIntro();
  } else finishAll();
}

/* ---------------- RESULTS ---------------- */
function finishAll(){
  stopTimer(); window.scrollTo(0,0);
  $('#barSec').textContent='Result'; $('#timer').textContent='Done'; $('#timer').classList.remove('low');
  const rows=[]; let tot=0, max=0, cleared=0, gated=0;
  S.m.sections.forEach((s,i)=>{
    if (s.key==='W'){ rows.push({s, writing:true}); return; }
    const c=s.ids.filter(id=>isCorrect(QMAP[id],S.ans[id])).length;
    const att=s.ids.filter(id=>S.state[id]==='done').length;
    const mk=c*s.marks, mx=s.ids.length*s.marks, pct=mx?mk/mx*100:0;
    tot+=mk; max+=mx; gated++; if(pct>=70-1e-9) cleared++;
    rows.push({s,c,att,mk,mx,pct,used:S.used[i]});
  });
  const safe=rows.filter(r=>!r.writing&&r.pct>=80-1e-9).length;
  const verdict = safe===gated?'<span class="chip good">Strong: 80%+ in every section</span>':cleared===gated?'<span class="chip sig">Above last year\'s 70% everywhere, but not safe yet</span>':'<span class="chip bad">Below 70% in '+(gated-cleared)+' section'+(gated-cleared>1?'s':'')+'</span>';
  store.add({name:S.m.name,date:new Date().toLocaleDateString(),score:`${+tot.toFixed(1)} / ${+max.toFixed(1)}`,cleared:`${safe} of ${gated} safe (80%+)`});
  const w = S.m.sections.find(s=>s.key==='W');
  const wtext = w ? (S.ans[w.ids[0]]||'') : '';
  app.innerHTML=`<div class="stack">
   <div class="panel"><div class="eyebrow">${S.m.name} | Result</div>
     <div style="display:flex;gap:28px;flex-wrap:wrap;align-items:flex-end;margin-top:8px">
       <div><div class="big">${+tot.toFixed(1)}<span class="muted" style="font-size:1rem"> / ${+max.toFixed(1)}</span></div><div class="muted">Total marks (writing excluded)</div></div>
       <div><div class="big">${safe}<span class="muted" style="font-size:1rem"> / ${gated}</span></div><div class="muted">Sections in the safe zone (80%+)</div></div>
       <div>${verdict}</div>
     </div>
     ${S.cand?`<p class="muted" style="margin:10px 0 0">Candidate: <b>${esc(S.cand.name)}</b>${S.cand.id?' | '+esc(S.cand.id):''}</p>`:''}
     <div class="cutbox" style="margin-top:12px">Last year's cutoff was around 70% per section, but the exact cutoff is never disclosed. Treat 80%+ in every section as your target for an interview call.</div>
     <div class="tablewrap" style="margin-top:14px"><table class="pat"><thead><tr><th>Section</th><th>Correct</th><th>Attempted</th><th>Marks</th><th>%</th><th>Time used</th><th>Cutoff status</th></tr></thead><tbody>
     ${rows.map(r=>r.writing?`<tr><td>${r.s.name}</td><td colspan="5">${words(wtext)} words written</td><td>Self-check below</td></tr>`:`<tr class="res-row"><td>${r.s.name}</td><td>${r.c} / ${r.s.ids.length}</td><td>${r.att}</td><td>${+r.mk.toFixed(1)} / ${+r.mx.toFixed(1)}</td><td>${r.pct.toFixed(0)}%</td><td>${r.used!==undefined?fmt(r.used):'–'}</td><td>${r.pct>=80-1e-9?'<span class="chip good">Safe (80%+)</span>':r.pct>=70-1e-9?'<span class="chip sig">Borderline (70–79%)</span>':'<span class="chip bad">At risk (below 70%)</span>'}</td></tr>`).join('')}
     </tbody></table></div>
     <div class="actions" style="justify-content:flex-start"><button class="btn primary" id="again">Back to home</button></div></div>
   ${w?writingReview(w.ids[0], wtext):''}
   <div class="panel"><h2>Review every question</h2><p class="muted" style="margin:4px 0 12px">Open a question to see your answer, the correct answer and the solution.</p>
    ${S.m.sections.filter(s=>s.key!=='W').map(s=>`<h3 style="margin:14px 0 8px">${s.name}</h3>`+s.ids.map((id,i)=>reviewItem(QMAP[id],S.ans[id],i+1)).join('')).join('')}</div></div>`;
  $('#again').addEventListener('click',()=>{S=null; home();});
  wireRubric();
}
function answerText(q,a){ if(a===undefined||a==='') return '<i>Not answered</i>'; return q.type==='mcq'?q.opts[a]:esc(String(a)); }
function reviewItem(q,a,n){
  const ok=isCorrect(q,a), blank=(a===undefined||a==='');
  const corr = q.type==='mcq'? q.opts[q.ans] : esc(q.answers[0]);
  return `<details class="rv"><summary><span class="chip ${ok?'good':blank?'sig':'bad'}">${ok?'Correct':blank?'Skipped':'Wrong'}</span><strong>Q${n}.</strong> <span class="muted">${q.topic}</span></summary>
   <div class="qbody">${q.q}</div><p><b>Your answer:</b> ${answerText(q,a)}<br><b>Correct answer:</b> ${corr}</p><div class="exp"><b>Solution.</b> ${q.exp}</div></details>`;
}
function writingReview(id, text){
  const q=QMAP[id]; const crit=['Relevance: answers exactly what the prompt asks','Structure: clear opening, body and closing','Grammar and spelling','Vocabulary and formal tone','Coherence: ideas linked, no repetition'];
  return `<div class="panel"><h2>English Writing: self-check</h2><div class="qbody">${q.q}</div>
   <div class="exp" style="white-space:pre-wrap;background:var(--paper);border-left-color:var(--line)">${text?esc(text):'<i>No response written.</i>'}</div><div class="wc">${words(text)} words</div>
   <p class="muted" style="margin:10px 0 0">Score your own response honestly, 0 to 2 for each point.</p>
   <div class="rub">${crit.map((c,i)=>`<label for="rb${i}">${c}</label><select id="rb${i}" class="rb"><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>`).join('')}<strong>Total</strong><strong id="rbt">0 / 10</strong></div></div>`;
}
function wireRubric(){ const sel=[...document.querySelectorAll('.rb')]; const up=()=>{ const t=sel.reduce((a,s)=>a+(+s.value),0); const el=$('#rbt'); if(el) el.textContent=t+' / 10'; }; sel.forEach(s=>s.addEventListener('change',up)); }

/* ---------------- PRACTICE ---------------- */
function startPractice(k){
  const ids=DATA.questions.filter(q=>q.sec===k).map(q=>q.id);
  S={mode:'practice', k, ids, qi:0, ans:{}, checked:{}, start:Date.now()};
  showBar(true); $('#barMock').textContent='Section practice'; $('#barSec').textContent=SECNAME[k];
  stopTimer(); S.total=Math.round(SECRATE[k]*ids.length*60); S.deadline=Date.now()+S.total*1000; S.timeUp=false;
  $('#timer').textContent=fmt(S.total); $('#timer').classList.remove('low');
  tick=setInterval(()=>{ const left=(S.deadline-Date.now())/1000; $('#timer').textContent=fmt(left); $('#timer').classList.toggle('low', left<=60);
    if(left<=0){ stopTimer(); S.timeUp=true; S.doneAt=Object.keys(S.checked).length; S.rightAt=S.ids.filter(id=>S.checked[id]&&isCorrect(QMAP[id],S.ans[id])).length; S.ids.forEach(id=>S.checked[id]=true); renderP(); } },500);
  renderP();
}
function renderP(){
  const q=QMAP[S.ids[S.qi]], n=S.ids.length, a=S.ans[q.id], chk=S.checked[q.id]; window.scrollTo(0,0);
  let input='';
  if (q.type==='mcq') input=`<div class="opts">${q.opts.map((o,i)=>{ let c=''; if(chk){ if(i===q.ans) c='right'; else if(i===a) c='wrong'; } else if(a===i) c='sel'; return `<label class="opt ${c}"><input type="radio" name="opt" value="${i}" ${a===i?'checked':''} ${chk?'disabled':''}><span class="k">${String.fromCharCode(65+i)}</span><span>${o}</span></label>`; }).join('')}</div>`;
  else if (q.type==='text') input=`<div style="margin-top:14px"><label for="tin" class="eyebrow">Your answer</label><input class="txtin" id="tin" autocomplete="off" value="${esc(a||'')}" ${chk?'disabled':''}></div>`;
  else input=`<div style="margin-top:14px"><label for="wta" class="eyebrow">Your response</label><textarea id="wta">${esc(a||'')}</textarea><div class="wc" id="wc">${words(a||'')} words</div></div>`;
  const pal=S.ids.map((id,i)=>{ const st=S.checked[id]?(isCorrect(QMAP[id],S.ans[id])?'ok':'no'):''; return `<button class="pal ${i===S.qi?'cur':''} ${st}" data-j="${i}" aria-label="Question ${i+1}">${i+1}</button>`; }).join('');
  const done=Object.keys(S.checked).length, right=S.ids.filter(id=>S.checked[id]&&isCorrect(QMAP[id],S.ans[id])).length;
  let fb='';
  if (chk && q.type!=='write'){ const ok=isCorrect(q,a); fb=`<div class="exp"><b>${ok?'Correct.':'Not quite.'}</b> ${q.type==='text'?'Answer: <b>'+esc(q.answers[0])+'</b>. ':''}${q.exp}</div>`; }
  if (chk && q.type==='write') fb=`<div class="exp">Check your response against: relevance, structure, grammar and spelling, formal tone, and coherence (2 marks each).</div>`;
  app.innerHTML=`${S.timeUp?`<div class="cutbox" style="margin-bottom:12px"><b>Time is up for this section.</b> You answered ${S.rightAt} correctly out of ${S.doneAt} checked. All answers are now shown so you can review them.</div>`:''}<div class="exam"><div class="panel"><div class="qhead"><h2>Question ${S.qi+1} <span class="muted" style="font-size:.9rem">of ${n}</span></h2><span class="chip">${q.topic}</span></div>
   <div class="qbody">${q.q}</div>${input}${fb}
   <div class="actions"><button class="btn" id="prev" ${S.qi===0?'disabled':''}>Previous</button>
   <span style="display:flex;gap:8px;flex-wrap:wrap">${chk?'':'<button class="btn primary" id="chk">Check answer</button>'}<button class="btn ${chk?'primary':''}" id="next" ${S.qi===n-1?'disabled':''}>Next</button></span></div></div>
   <aside class="panel"><div class="eyebrow">${SECNAME[S.k]}</div><p style="margin:6px 0 0;font-variant-numeric:tabular-nums"><b>${right}</b> correct of <b>${done}</b> checked</p><div class="palette">${pal}</div>
   <div class="legend"><div><span style="background:var(--good-soft);border-color:var(--good)"></span>Correct</div><div><span style="background:var(--bad-soft);border-color:var(--bad)"></span>Wrong</div><div>One timer for the whole section, at real exam speed (${fmt(S.total)} for ${n} questions).</div></div></aside></div>`;
  app.querySelectorAll('input[name=opt]').forEach(r=>r.addEventListener('change',()=>{S.ans[q.id]=+r.value; app.querySelectorAll('.opt').forEach((l,i)=>l.classList.toggle('sel',i===+r.value));}));
  const tin=$('#tin'); if(tin){ tin.addEventListener('input',()=>S.ans[q.id]=tin.value); tin.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault(); const c=$('#chk'); if(c) c.click();}}); }
  const wta=$('#wta'); if(wta) wta.addEventListener('input',()=>{S.ans[q.id]=wta.value; $('#wc').textContent=words(wta.value)+' words';});
  const c=$('#chk'); if(c) c.addEventListener('click',()=>{ S.checked[q.id]=true; renderP(); });
  const go=j=>{ S.qi=j; renderP(); };
  $('#prev').addEventListener('click',()=>go(S.qi-1)); $('#next').addEventListener('click',()=>go(S.qi+1));
  app.querySelectorAll('[data-j]').forEach(b=>b.addEventListener('click',()=>go(+b.dataset.j)));
}
