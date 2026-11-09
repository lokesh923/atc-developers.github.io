/* Numerical Ability practice: exam mode, unlimited practice, actual-style bank */
(function(){
const NG=window.NG,BANK=(window.NBANK||[]),$=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SPEED=Math.max(1,parseFloat((location.search.match(/[?&]speed=([\d.]+)/)||[])[1])||1);
const L='ABCDEFGH',pass=60;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const LS={get(k,d){try{const v=localStorage.getItem('np_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('np_'+k,JSON.stringify(v))}catch(e){}}};
const fmt=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
const eq=(a,b)=>{a=String(a).trim().toLowerCase().replace(/[,₹%\s]/g,'');b=String(b).trim().toLowerCase().replace(/[,₹%\s]/g,'');if(a===b)return true;const re=/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/;if(re.test(a)&&re.test(b)){const x=parseFloat(a),y=parseFloat(b);return Math.abs(x-y)<=0.011||Math.abs(x-y)<=1e-6*Math.max(1,Math.abs(y))}return false};
/* ---------- SCORM 1.2 ---------- */
let lms=null,t0=Date.now();const findAPI=w=>{let n=0;while(w&&!w.API&&w.parent&&w.parent!==w&&n<20){w=w.parent;n++}return w&&w.API?w.API:null};
const sc=(f,a,b)=>{try{return lms?(b===undefined?(a===undefined?lms[f]():lms[f](a)):lms[f](a,b)):''}catch(e){return ''}};
const tf=s=>{s=Math.round(s);return String(Math.floor(s/3600)).padStart(4,'0')+':'+String(Math.floor(s%3600/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const scormInit=()=>{try{lms=findAPI(window);if(!lms&&window.opener)lms=findAPI(window.opener)}catch(e){}if(!lms)return;sc('LMSInitialize','');const st=sc('LMSGetValue','cmi.core.lesson_status');if(!st||st==='not attempted')sc('LMSSetValue','cmi.core.lesson_status','incomplete');sc('LMSCommit','')};
const scormReport=(pct,sum)=>{if(!lms)return;sc('LMSSetValue','cmi.core.score.min','0');sc('LMSSetValue','cmi.core.score.max','100');sc('LMSSetValue','cmi.core.score.raw',String(pct));sc('LMSSetValue','cmi.core.lesson_status',pct>=pass?'passed':'failed');sc('LMSSetValue','cmi.core.session_time',tf((Date.now()-t0)/1000));sc('LMSSetValue','cmi.suspend_data',String(sum).slice(0,3500));sc('LMSCommit','')};
window.addEventListener('beforeunload',()=>{if(lms){sc('LMSSetValue','cmi.core.session_time',tf((Date.now()-t0)/1000));sc('LMSCommit','');sc('LMSFinish','');lms=null}});
/* ---------- stats ---------- */
const stats=()=>LS.get('stats',{topics:{},exams:[],att:0,cor:0});
const addStat=(topic,ok,sec)=>{const s=stats();const t=s.topics[topic]=s.topics[topic]||{a:0,c:0,s:0};t.a++;t.s+=sec||0;if(ok)t.c++;s.att++;if(ok)s.cor++;LS.set('stats',s)};
/* ---------- helpers ---------- */
const app=$('#app');let timer=null;
document.addEventListener('click',e=>{if(e.target.tagName==='IMG'&&e.target.closest('.qtext,.rev')){$('#lbimg').src=e.target.src;$('#lightbox').style.display='flex'}});
const bankSeen=()=>LS.get('bank_seen',[]);
const hasImg=q=>/<img/.test(q.q)||(q.o||[]).some(o=>/<img/.test(o));
const pickBank=(n,topic,imgOnly)=>{let pool=BANK.filter(q=>(!topic||topic==='All'||q.t===topic)&&(!imgOnly||hasImg(q)));let seen=bankSeen();let un=pool.filter(q=>!seen.includes(q.id));if(un.length<n){seen=seen.filter(id=>!pool.some(q=>q.id===id));un=pool.filter(q=>!seen.includes(q.id))}const ch=shuffle(un).slice(0,n);LS.set('bank_seen',seen.concat(ch.map(q=>q.id)));return ch.map(q=>q.ty==='mcq'?Object.assign({},q,{ty:'mcq'}):Object.assign({},q,{ty:'num'}))};
const norm=q=>{if(q.ty==='mcq')return q;return Object.assign({},q,{ty:'num'})};
const qBody=(q,i,n)=>{let b=`<div><span class="qno">Question ${i}${n?' of '+n:''}</span><span class="qtopic">${esc(q.t||'')}</span></div><div class="qtext">${q.q}</div>`;return b};
const isCorrect=(q,a)=>a!==undefined&&a!==''&&(q.ty==='mcq'?a===q.a:eq(a,q.a));
const corrText=q=>q.ty==='mcq'?`${L[q.a]}. ${q.o[q.a]}`:esc(q.a);
/* ---------- shell / tabs ---------- */
function shell(tab,inner){app.innerHTML=`<div class="top"><span class="brand">TCS NQT · Numerical Ability Practice</span><div class="tabs">${[['exam','Exam Mode (20 Q · 25 min)'],['unl','Unlimited Practice'],['bank','Actual-style Bank'],['prog','My Progress']].map(t=>`<button class="${tab===t[0]?'on':''}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div></div><div class="wrap" id="body">${inner}</div>`;
  $$('.tabs button').forEach(b=>b.onclick=()=>{clearInterval(timer);go(b.dataset.t)})}
function go(t){({exam:examHome,unl:unlHome,bank:bankHome,prog:progress})[t]()}
/* ---------- EXAM MODE ---------- */
let EX=null;
function examHome(){const s=stats();const last=s.exams.slice(-3).reverse();
  shell('exam',`<div class="card"><span class="tag">EXAM MODE</span><h1>Numerical Ability: full test</h1><p class="mut">Same pattern as the live exam. No camera or microphone is needed.</p>
  <table class="t"><tr><th>Questions</th><th>Time</th><th>Marking</th><th>Types</th></tr><tr><td><b>20</b></td><td><b>25 minutes</b> (about 75 seconds each)</td><td>1 mark each, <b>no negative marking</b></td><td>MCQ and typed-answer (TITA)</td></tr></table>
  <ul><li>Every paper is new: 14 questions are generated fresh from 54 question types and 6 come from the actual-style bank (image and equation questions). Nothing repeats.</li><li>Move freely between questions, mark for review, change answers. The test submits automatically when the time ends.</li><li>The result shows your score, topic-wise accuracy and an explanation for every question.</li></ul>
  <button class="btn gr" id="start">Start the 20 question test</button></div>
  ${last.length?`<div class="card"><h2>Your last attempts</h2><table class="t"><tr><th>Date</th><th>Score</th><th>Time used</th></tr>${last.map(e=>`<tr><td>${new Date(e.d).toLocaleString()}</td><td>${e.c}/20 (${e.p}%)</td><td>${fmt(e.u)}</td></tr>`).join('')}</table></div>`:''}`);
  $('#start').onclick=startExam}
function startExam(){const gen=NG.paper(BANK.length?14:20);const bank=BANK.length?pickBank(4,'All',true).concat(pickBank(2,'All')):[];const items=shuffle(gen.concat(bank)).slice(0,20).map(norm);
  EX={items,ans:{},mark:{},vis:{},pos:0,end:Date.now()+1500*1000/SPEED,start:Date.now()};examUI()}
function examUI(){const sec=EX;
  app.innerHTML=`<div id="shell2"><div class="top"><span class="brand">Numerical Ability · Exam Mode</span><span style="margin-left:auto"></span><div id="timer">25:00</div></div><div id="mid"><div id="qarea"><div id="qbox"></div></div><div id="side"><div class="pal" id="pal"></div><div class="legend"><i style="background:#0f7d6b"></i>Answered <i style="background:#be123c"></i>Not answered <i style="background:#6d28d9"></i>Marked <i style="background:#fff;border:1px solid #aab"></i>Not visited</div></div></div>
  <div id="foot"><button class="btn sec" id="b_mark">Mark for review &amp; Next</button><button class="btn sec" id="b_clr">Clear response</button><button class="btn sec" id="b_prev">« Previous</button><button class="btn" id="b_save">Save &amp; Next »</button><span class="sp"></span><button class="btn rd" id="b_sub">Submit test</button></div></div>`;
  const st=i=>{const id=i,a=sec.ans[id]!==undefined&&sec.ans[id]!=='',m=sec.mark[id];return m?(a?'markans':'mark'):a?'ans':(sec.vis[id]?'nans':'')};
  const show=()=>{const q=sec.items[sec.pos];sec.vis[sec.pos]=true;const cur=sec.ans[sec.pos];let h=qBody(q,sec.pos+1,sec.items.length);
    if(q.ty==='mcq'){h+=q.o.map((o,k)=>`<div class="opt ${cur===k?'sel':''}" data-o="${k}"><span class="k">${L[k]}.</span><span>${o}</span></div>`).join('')}
    else h+=`<p class="mut sm">Type your answer in the box.</p><input class="ansbox" id="tita" type="text" autocomplete="off" value="${esc(cur||'')}" placeholder="Your answer">`;
    $('#qbox').innerHTML=h;$$('.opt').forEach(d=>d.onclick=()=>{sec.ans[sec.pos]=+d.dataset.o;show()});const ti=$('#tita');if(ti)ti.oninput=()=>{sec.ans[sec.pos]=ti.value;pal()};pal()};
  const pal=()=>{$('#pal').innerHTML=sec.items.map((x,k)=>`<button class="${st(k)} ${k===sec.pos?'cur':''}" data-k="${k}">${k+1}</button>`).join('');$$('#pal button').forEach(b=>b.onclick=()=>{sec.pos=+b.dataset.k;show()})};
  const mv=p=>{sec.pos=Math.max(0,Math.min(sec.items.length-1,p));show()};
  $('#b_mark').onclick=()=>{sec.mark[sec.pos]=true;mv(sec.pos+1)};$('#b_clr').onclick=()=>{delete sec.ans[sec.pos];delete sec.mark[sec.pos];show()};$('#b_prev').onclick=()=>mv(sec.pos-1);$('#b_save').onclick=()=>{delete sec.mark[sec.pos];mv(sec.pos+1)};
  $('#b_sub').onclick=()=>{const a=sec.items.filter((x,k)=>sec.ans[k]!==undefined&&sec.ans[k]!=='').length;const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="box"><h2>Submit the test?</h2><p>Answered: <b>${a}</b> of 20 · Not answered: <b>${20-a}</b> · Marked: <b>${Object.keys(sec.mark).length}</b></p><button class="btn rd" id="y">Yes, submit</button> <button class="btn sec" id="n">Go back</button></div>`;document.body.appendChild(m);$('#n',m).onclick=()=>m.remove();$('#y',m).onclick=()=>{m.remove();finishExam()}};
  show();clearInterval(timer);timer=setInterval(()=>{const left=(sec.end-Date.now())/1000;const t=$('#timer');if(t){t.textContent=fmt(left*SPEED);t.className=left*SPEED<=120?'low':''}if(left<=0){clearInterval(timer);finishExam()}},250)}
function finishExam(){clearInterval(timer);const sec=EX;const used=Math.min(1500,(Date.now()-sec.start)/1000*SPEED);let c=0;const topics={};
  sec.items.forEach((q,k)=>{const ok=isCorrect(q,sec.ans[k]);if(ok)c++;const t=topics[q.t]=topics[q.t]||[0,0];t[1]++;if(ok)t[0]++;addStat(q.t,ok,used/20)});
  const p=Math.round(c/20*100);const s=stats();s.exams.push({d:Date.now(),c,p,u:used});s.exams=s.exams.slice(-30);LS.set('stats',s);
  scormReport(p,'NUM:'+c+'/20,'+p+'%,att:'+s.att+',acc:'+Math.round(100*s.cor/Math.max(1,s.att))+'%');
  const att=sec.items.filter((x,k)=>sec.ans[k]!==undefined&&sec.ans[k]!=='').length;
  const tl=Object.entries(topics).map(([t,v])=>[t,v[0],v[1],Math.round(100*v[0]/v[1])]).sort((a,b)=>a[3]-b[3]);
  shell('exam',`<div class="card"><span class="tag">TEST COMPLETED</span><h1>Score: ${c} / 20 (${p}%)</h1><p><b class="${p>=pass?'ok':'bad'}">${p>=pass?'Good: above the practice target of '+pass+'%':'Below the practice target of '+pass+'%'}</b> · attempted ${att} of 20 · time used ${fmt(used)}</p>
  <table class="t"><tr><th>Topic</th><th>Correct</th><th>Accuracy</th></tr>${tl.map(t=>`<tr><td>${esc(t[0])}</td><td>${t[1]}/${t[2]}</td><td>${t[3]}%</td></tr>`).join('')}</table>
  <p style="margin-top:12px"><button class="btn gr" id="again">Take a new paper</button> <button class="btn sec" id="prac">Practise weak topics</button></p></div>
  <div class="card"><h2>Answer review</h2>${sec.items.map((q,k)=>{const a=sec.ans[k],ok=isCorrect(q,a);const ya=a===undefined||a===''?'<i>not answered</i>':q.ty==='mcq'?`${L[a]}. ${q.o[a]}`:esc(a);return `<details class="rev"><summary class="${ok?'ok':'bad'}">Q${k+1} · ${ok?'Correct':a===undefined||a===''?'Not answered':'Wrong'} · ${esc(q.t)}</summary><div class="qtext">${q.q}</div><p class="sm"><b>Your answer:</b> ${ya}</p><p class="sm"><b>Correct answer:</b> ${corrText(q)}</p><p class="sm">${q.e||''}</p></details>`}).join('')}</div>`);
  $('#again').onclick=examHome;$('#prac').onclick=()=>{unlHome(tl.length?tl[0][0]:'All')}}
/* ---------- PRACTICE ENGINE (unlimited + bank) ---------- */
function practice(tab,sourceName,getQ,cfg){let cur=null,t0=Date.now(),sess={a:0,c:0,streak:0,best:0,time:0},tm=null,answered=false,sel=null;
  const draw=()=>{cur=getQ();answered=false;sel=null;t0=Date.now();
    if(!cur){$('#pq').innerHTML='<p>No more questions in this selection.</p>';return}
    let h=qBody(cur,sess.a+1,0);if(cur.ty==='mcq')h+=cur.o.map((o,k)=>`<div class="opt" data-o="${k}"><span class="k">${L[k]}.</span><span>${o}</span></div>`).join('');else h+=`<input class="ansbox" id="tita" type="text" autocomplete="off" placeholder="Type your answer and press Enter">`;
    h+=`<div id="fb"></div><div style="margin-top:12px"><button class="btn" id="chk">Check answer</button> <button class="btn sec" id="skip">Skip</button> <span class="mut sm" id="tmr"></span></div>`;$('#pq').innerHTML=h;
    $$('.opt').forEach(d=>d.onclick=()=>{if(answered)return;sel=+d.dataset.o;$$('.opt').forEach(x=>x.classList.toggle('sel',x===d))});
    const ti=$('#tita');if(ti){ti.focus();ti.onkeydown=e=>{if(e.key==='Enter')check()}}
    $('#chk').onclick=check;$('#skip').onclick=()=>{if(!answered)record(false,true);draw()};
    clearInterval(tm);if(cfg.limit){tm=setInterval(()=>{const left=cfg.limit-(Date.now()-t0)/1000*SPEED;const e=$('#tmr');if(e)e.textContent='Time left: '+Math.max(0,Math.round(left))+' s';if(left<=0&&!answered){clearInterval(tm);check(true)}},300)}};
  const record=(ok,skipped)=>{const sec=(Date.now()-t0)/1000*SPEED;sess.a++;if(ok){sess.c++;sess.streak++;sess.best=Math.max(sess.best,sess.streak)}else sess.streak=0;sess.time+=sec;addStat(cur.t,ok,sec);upd()};
  const check=(timeout)=>{if(answered||!cur)return;const a=cur.ty==='mcq'?sel:($('#tita')||{}).value;if((a===null||a===undefined||a==='')&&!timeout){$('#fb').innerHTML='<p class="bad">Choose or type an answer first, or press Skip.</p>';return}
    answered=true;clearInterval(tm);const ok=isCorrect(cur,a);record(ok);
    if(cur.ty==='mcq')$$('.opt').forEach(d=>{const k=+d.dataset.o;if(k===cur.a)d.classList.add('right');else if(k===a)d.classList.add('wrong')});
    $('#fb').innerHTML=`<div class="fb ${ok?'g':'r'}"><b>${ok?'Correct!':timeout&&(a===undefined||a===''||a===null)?'Time is up.':'Not quite.'}</b> Correct answer: <b>${corrText(cur)}</b><br><span class="sm">${cur.e||''}</span></div>`;
    $('#chk').textContent='Next question »';$('#chk').onclick=()=>draw();$('#skip').style.display='none'};
  const upd=()=>{const e=$('#sst');if(e)e.innerHTML=`Attempted <b>${sess.a}</b> · Correct <b>${sess.c}</b> · Accuracy <b>${sess.a?Math.round(100*sess.c/sess.a):0}%</b> · Streak <b>${sess.streak}</b> (best ${sess.best}) · Avg time <b>${sess.a?Math.round(sess.time/sess.a):0}s</b>`};
  document.onkeydown=e=>{if(!cur||e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;if(e.key==='Enter'){answered?draw():check()}else if(/^[1-4]$/.test(e.key)&&!answered&&cur.ty==='mcq'){sel=+e.key-1;$$('.opt').forEach(x=>x.classList.toggle('sel',+x.dataset.o===sel))}};
  upd();draw()}
/* ---------- UNLIMITED ---------- */
function unlHome(pre){const topics=['All'].concat(NG.topics);
  shell('unl',`<div class="card"><span class="tag">UNLIMITED PRACTICE</span><h1>Endless numerical practice</h1><p class="mut">New questions are generated from ${NG.F.length} question types across ${NG.topics.length} topics, so you can practise as long as you like. Every answer is checked and explained immediately.</p>
  <div class="grid3"><div><label>Topic</label><select id="s_t">${topics.map(t=>`<option ${t===pre?'selected':''}>${t}</option>`).join('')}</select></div><div><label>Level</label><select id="s_d"><option value="0">Mixed</option><option value="1">Easy</option><option value="2">Easy + Medium</option><option value="3">All (hardest included)</option></select></div><div><label>Timer per question</label><select id="s_l"><option value="0">No timer</option><option value="75" selected>75 seconds (exam speed)</option><option value="45">45 seconds (fast)</option><option value="120">120 seconds</option></select></div></div>
  <label style="margin-top:10px"><input type="checkbox" id="s_ti" checked> Include typed-answer (TITA) questions</label><p><button class="btn gr" id="go">Start practice</button></p></div>`);
  $('#go').onclick=()=>{const topic=$('#s_t').value,d=+$('#s_d').value,limit=+$('#s_l').value,ti=$('#s_ti').checked;
    $('#body').innerHTML=`<div class="card" style="padding:10px 16px"><div class="sm" id="sst"></div><div style="margin-top:6px"><button class="btn sm sec" id="chg">Change settings</button></div></div><div class="card" id="pq"></div>`;$('#chg').onclick=()=>{document.onkeydown=null;unlHome(topic)};
    practice('unl','generated',()=>{const q=NG.next(topic,d||0);if(!q)return null;if(!ti&&q.ty==='num')return NG.make(NG.F.find(f=>f.id===q.fam),{allowTita:false})||q;return q},{limit})}}
/* ---------- BANK ---------- */
function bankHome(){const topics=['All'].concat([...new Set(BANK.map(q=>q.t))].sort());
  shell('bank',`<div class="card"><span class="tag">ACTUAL-STYLE BANK</span><h1>${BANK.length} exam-style questions</h1><p class="mut">Image-based and equation questions in the style of the live paper. Unseen questions come first, so you do not see a question again until you have finished the set.</p>
  <div class="grid2"><div><label>Topic</label><select id="b_t">${topics.map(t=>`<option>${esc(t)}</option>`).join('')}</select></div><div><label>Timer per question</label><select id="b_l"><option value="0">No timer</option><option value="75" selected>75 seconds</option><option value="120">120 seconds</option></select></div></div>
  <p class="sm mut">Seen so far: <b>${bankSeen().length}</b> of ${BANK.length}. <button class="btn sm sec" id="rs">Reset seen list</button></p><p><button class="btn gr" id="go">Start</button></p></div>`);
  $('#rs').onclick=()=>{LS.set('bank_seen',[]);bankHome()};
  $('#go').onclick=()=>{const topic=$('#b_t').value,limit=+$('#b_l').value;$('#body').innerHTML=`<div class="card" style="padding:10px 16px"><div class="sm" id="sst"></div><div style="margin-top:6px"><button class="btn sm sec" id="chg">Change topic</button></div></div><div class="card" id="pq"></div>`;$('#chg').onclick=()=>{document.onkeydown=null;bankHome()};
    practice('bank','bank',()=>{const r=pickBank(1,topic);return r[0]?norm(r[0]):null},{limit})}}
/* ---------- PROGRESS ---------- */
function progress(){const s=stats();const rows=Object.entries(s.topics).map(([t,v])=>[t,v.a,v.c,Math.round(100*v.c/v.a),Math.round(v.s/v.a)]).sort((a,b)=>a[3]-b[3]);
  shell('prog',`<div class="card"><span class="tag">MY PROGRESS</span><h1>Your numerical practice</h1><p>Total questions attempted: <b>${s.att}</b> · Correct: <b>${s.cor}</b> · Overall accuracy: <b>${s.att?Math.round(100*s.cor/s.att):0}%</b> · Exams taken: <b>${s.exams.length}</b></p>
  ${rows.length?`<table class="t"><tr><th>Topic</th><th>Attempted</th><th>Correct</th><th>Accuracy</th><th>Avg time</th></tr>${rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${r[1]}</td><td>${r[2]}</td><td class="${r[3]>=70?'ok':r[3]<50?'bad':''}">${r[3]}%</td><td>${r[4]} s</td></tr>`).join('')}</table>`:'<p class="mut">Nothing yet. Start a practice session or the exam.</p>'}
  ${s.exams.length?`<h3>Exam scores</h3><table class="t"><tr><th>Date</th><th>Score</th></tr>${s.exams.slice().reverse().map(e=>`<tr><td>${new Date(e.d).toLocaleString()}</td><td>${e.c}/20 (${e.p}%)</td></tr>`).join('')}</table>`:''}
  <p><button class="btn sm sec" id="clr">Clear my progress</button></p><p class="sm mut">Progress is saved in this browser only.</p></div>`);
  $('#clr').onclick=()=>{if(confirm('Delete all saved progress?')){LS.set('stats',{topics:{},exams:[],att:0,cor:0});progress()}}}
window.NP={start:()=>{scormInit();examHome()},EX:()=>EX};
})();
