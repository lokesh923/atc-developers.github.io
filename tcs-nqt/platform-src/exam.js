/* exam engine: sections, timers, question navigation, Verbal tasks */
(function(A){
const C=window.CFG,B=window.BANK,$=A.$,esc=A.esc,LS=A.LS,P=A.proc;
let ST=null,tick=null;
const L='ABCDEFGH';
/* ---------- helpers ---------- */
A.norm=s=>{s=String(s).toLowerCase();s=s.replace(/₹/g,' rs ').replace(/\brs\.?\s*(?=\d)/g,' rs ').replace(/%/g,' percent ').replace(/(\d),(?=\d{3}\b)/g,'$1').replace(/[‐-―-]/g,' ').replace(/[^a-z0-9:.\s]/g,' ').replace(/\.(?=\s|$)/g,' ');return ' '+s.replace(/\s+/g,' ').trim()+' '};
A.hasFact=(text,alts)=>{const t=A.norm(text);return alts.some(a=>{const n=A.norm(a);if(!n.trim())return false;if(/^[a-z ]+$/.test(n.trim()))return t.includes(n.replace(/ $/,''));return t.includes(n)})};
const numsIn=s=>(A.norm(s).match(/\b\d[\d.:]*\d\b|\b\d\b/g)||[]);
A.scoreRecall=(task,text)=>{const found=[],missing=[];task.f.forEach(f=>(A.hasFact(text,f)?found:missing).push(f[0]));const allowed=new Set(numsIn(task.p));task.f.forEach(f=>f.forEach(a=>numsIn(a).forEach(n=>allowed.add(n))));const wrong=[...new Set(numsIn(text).filter(n=>!allowed.has(n)))];return {found,missing,wrong,pct:Math.round(100*found.length/task.f.length)}};
const NW={1:'one',2:'two',3:'three',4:'four',5:'five',6:'six',7:'seven',8:'eight',9:'nine',10:'ten',11:'eleven',12:'twelve'};
A.scoreEmail=(em,text)=>{const words=text.trim()?text.trim().split(/\s+/).length:0;const t=text;
  const facts=em.facts.map(f=>({f,ok:A.hasFact(t,/^\d{1,2}$/.test(f)&&NW[+f]?[f,NW[+f]]:[f])}));const fp=facts.length?facts.filter(x=>x.ok).length/facts.length:1;
  const chk=[['Subject line',/subject\s*:/i.test(t)||/^.{4,90}\n\s*\n\s*(dear|hello|hi)\b/i.test(t.trim())],['Formal greeting (Dear …)',/^\s*(subject[^\n]*\n\s*)?(dear)\b/im.test(t)||/\bdear\s+\w+/i.test(t)],['Purpose stated (I am writing …)',/(i am writing|i write|i would like to|i wish to|this is to|i am pleased|i regret|i apologi[sz]e|i request|please find|following up|thank you for)/i.test(t)],['Polite request or next step',/(please|kindly|would be grateful|i would appreciate|could you|let me know|look forward)/i.test(t)],['Polite closing',/(thank you|thanks|regards|sincerely|faithfully|yours)/i.test(t)],['Sender name at the end',(()=>{const ls=t.trim().split('\n').filter(x=>x.trim());const l=ls[ls.length-1]||'';return ls.length>3&&l.trim().split(/\s+/).length<=4&&!/[.!?]$/.test(l.trim())})()],['Length 60 to 200 words',words>=60&&words<=200],['Formal tone (no slang)',!/\b(hey|gonna|wanna|asap|u r|pls|plz|lol|bro|dude)\b/i.test(t)]];
  const pts=Math.round(fp*40+chk.reduce((a,c)=>a+(c[1]?7.5:0),0));return {facts,chk,words,pct:Math.min(100,pts)}};
A.eq=(a,b)=>{a=String(a).trim().toLowerCase().replace(/,/g,'');b=String(b).trim().toLowerCase().replace(/,/g,'');if(a===b)return true;const re=/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/;if(re.test(a)&&re.test(b)){const x=parseFloat(a),y=parseFloat(b);return Math.abs(x-y)<=1e-6*Math.max(1,Math.abs(y))}return a.replace(/\s+/g,'')===b.replace(/\s+/g,'')};
const save=()=>{if(ST){ST.saved=Date.now();LS.set('state',ST)}};
const qOf=(sec,id)=>B[sec].find(q=>q.id===id);
const shell=(inner,opt)=>{opt=opt||{};A.render(`<div id="shell"><div id="top"><span class="brand">${esc(C.brand.split('·')[0])}</span><span class="who">${esc(A.cand.name)}</span><div id="secs">${A.sectionsInfo.map((s,i)=>`<span class="${i===ST.cur?'cur':i<ST.cur?'done':''}">${s[0]}</span>`).join('')}</div><div id="timer">--:--</div></div>
  <div id="mid"><div id="qarea">${inner}</div><div id="side"><video data-live autoplay playsinline muted></video><div class="sm mut" style="margin:4px 0">Proctoring on · violations: <b id="vc">${P.total()}</b></div><div id="sidecont">${opt.side||''}</div></div></div><div id="foot">${opt.foot||''}</div></div>`);P.attach($('#side video'))};
const setTimer=(secLeft)=>{const t=$('#timer');if(!t)return;t.textContent=A.fmt(secLeft);t.className=secLeft<=60?'low':''};
setInterval(()=>{const v=$('#vc');if(v)v.textContent=P.total()},1000);
/* ---------- exam creation ---------- */
const std=(sec,n,mins)=>{const r=A.sample(sec,n);return {id:sec,type:'std',items:r.items.map(q=>({id:q.id,ord:q.ty==='mcq'?A.shuffle(q.o.map((_,i)=>i)):null})),ans:{},mark:{},vis:{},dur:mins*60,notice:r.reset?'You have seen every question in this section\'s bank, so the bank was reshuffled.':'',left:r.left}};
A.startExam=()=>{P.run();const sc=A.sample('S3',20);const pr=A.sample('PR',4),em=A.sample('EM',1);
  const med=A.sample('S5',1,q=>q.level==='Medium'),hard=A.sample('S5',1,q=>q.level==='Hard');
  ST={id:'T'+Date.now(),cand:A.cand,started:Date.now(),cur:0,done:false,sec:[std('S1',20,25),std('S2',20,25),
    {id:'S3',type:'verbal',sc:sc.items.map(q=>({id:q.id,ord:A.shuffle(q.o.map((_,i)=>i))})),scAns:{},pr:pr.items.map(p=>p.id),prAns:[],em:em.items[0].id,emAns:'',phase:'sc',idx:0,notice:sc.reset?'Verbal bank reshuffled.':''},
    std('S4',14,25),{id:'S5',type:'code',items:[...med.items,...hard.items].map(q=>q.id),code:{},res:{},dur:90*60,lang:'python'}],log:[]};
  A.fullBank=true;save();A.sectionIntro(0)};
A.resumeExam=()=>{ST=A.resumeState;P.run();A.sectionIntro(ST.cur,true)};
A.onTerminate=reason=>{if(!ST||ST.done)return;A.toast('Test ended: '+reason);finishAll(reason)};
/* ---------- section intro ---------- */
A.sectionIntro=(i,resumed)=>{ST.cur=i;const s=A.sectionsInfo[i],sec=ST.sec[i];P.snap('section '+s[0]);
  if(sec.endAt&&resumed){return begin(i,true)}
  let extra='';if(sec.type==='std')extra=`<p>${sec.items.length} questions · ${sec.dur/60} minutes</p>`;if(sec.type==='code')extra='<p>2 problems · 90 minutes · languages: C, C++, Java, Python</p>';if(sec.type==='verbal')extra='<p>20 sentence-completion items (25 s each), a 25 s instruction screen, 4 passage-recall tasks (30 s read + 90 s write), a 15 s instruction screen and a 9-minute email.</p>';
  A.render(`<div class="wrap"><div class="card"><span class="tag">SECTION ${i+1} OF 5</span><h1>${s[1]}</h1>${extra}<p class="mut">${s[2]}</p>${sec.notice?`<p class="sm bad">${sec.notice}</p>`:''}<p>The timer starts when you press <b>Start section</b>. You cannot return to this section after it ends.</p><button class="btn gr" id="st">Start section</button></div></div>`);
  $('#st').onclick=()=>begin(i)};
function begin(i,resumed){const sec=ST.sec[i];ST.cur=i;
  if(sec.type==='std'){if(!sec.endAt)sec.endAt=Date.now()+A.sp(sec.dur)*1000;sec.pos=sec.pos||0;save();stdUI(i)}
  else if(sec.type==='code'){if(!sec.endAt)sec.endAt=Date.now()+A.sp(sec.dur)*1000;save();A.codingUI(ST,i,{shell,save,submitSection:()=>confirmSubmit(i,true)});runClock(i)}
  else{verbal(i)}}
function runClock(i){clearInterval(tick);const sec=ST.sec[i];const f=()=>{const left=(sec.endAt-Date.now())/1000;setTimer(left*(C.speed||1));if(left<=0){clearInterval(tick);endSection(i,'Time is over for this section.')}};f();tick=setInterval(f,250)}
/* ---------- standard sections ---------- */
function status(sec,idx){const id=sec.items[idx].id,a=sec.ans[id]!==undefined&&sec.ans[id]!=='',m=sec.mark[id];return m?(a?'markans':'mark'):a?'ans':(sec.vis[id]?'nans':'')}
function stdUI(i){const sec=ST.sec[i];
  const foot=`<button class="btn sec" id="b_mark">Mark for review &amp; Next</button><button class="btn sec" id="b_clr">Clear response</button><button class="btn sec" id="b_prev">« Previous</button><button class="btn" id="b_save">Save &amp; Next »</button><span class="sp"></span><button class="btn rd" id="b_sub">Submit section</button>`;
  shell('<div id="qbox"></div>',{foot,side:'<div class="pal" id="pal"></div><div class="legend"><i style="background:#0f7d6b"></i>Answered <i style="background:#be123c"></i>Not answered <i style="background:#6d28d9"></i>Marked <i style="background:#fff;border:1px solid #aab"></i>Not visited</div>'});
  $('#b_mark').onclick=()=>{const id=sec.items[sec.pos].id;sec.mark[id]=true;go(i,Math.min(sec.pos+1,sec.items.length-1))};
  $('#b_clr').onclick=()=>{const id=sec.items[sec.pos].id;delete sec.ans[id];delete sec.mark[id];save();show(i)};
  $('#b_prev').onclick=()=>go(i,Math.max(0,sec.pos-1));
  $('#b_save').onclick=()=>{const id=sec.items[sec.pos].id;delete sec.mark[id];go(i,Math.min(sec.pos+1,sec.items.length-1))};
  $('#b_sub').onclick=()=>confirmSubmit(i);
  show(i);runClock(i)}
function go(i,p){const sec=ST.sec[i];sec.pos=p;save();show(i)}
function show(i){const sec=ST.sec[i];const it=sec.items[sec.pos],q=qOf(sec.id,it.id);sec.vis[it.id]=true;
  let body=`<div><span class="qno">Question ${sec.pos+1} of ${sec.items.length}</span><span class="qtopic">${esc(q.t||'')}</span></div><div class="qtext">${q.q}</div>`;
  const cur=sec.ans[it.id];
  if(q.ty==='mcq'){body+=it.ord.map((oi,k)=>`<div class="opt ${cur===oi?'sel':''}" data-o="${oi}"><span class="k">${L[k]}.</span><span>${q.o[oi]}</span></div>`).join('')}
  else body+=`<p class="mut sm">Type your answer in the box.</p><input class="ansbox" id="tita" type="text" autocomplete="off" value="${esc(cur||'')}" placeholder="Your answer">`;
  $('#qbox').innerHTML=body;
  document.querySelectorAll('.opt').forEach(d=>d.onclick=()=>{sec.ans[it.id]=+d.dataset.o;save();show(i)});
  const ti=$('#tita');if(ti)ti.oninput=()=>{sec.ans[it.id]=ti.value;save();pal(i)};
  pal(i)}
function pal(i){const sec=ST.sec[i];$('#pal').innerHTML=sec.items.map((x,k)=>`<button class="${status(sec,k)} ${k===sec.pos?'cur':''}" data-k="${k}">${k+1}</button>`).join('');document.querySelectorAll('#pal button').forEach(b=>b.onclick=()=>go(i,+b.dataset.k))}
function confirmSubmit(i,isCode){const sec=ST.sec[i];let body;
  if(sec.type==='std'){const n=sec.items.length,a=sec.items.filter(x=>sec.ans[x.id]!==undefined&&sec.ans[x.id]!=='').length,m=Object.keys(sec.mark).length;body=`<p>Answered: <b>${a}</b> of ${n} · Not answered: <b>${n-a}</b> · Marked for review: <b>${m}</b></p>`}
  else body='<p>Make sure you pressed <b>Submit</b> on each problem to run all test cases.</p>';
  const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="box"><h2>Submit this section?</h2>${body}<p class="bad sm">You cannot come back to this section.</p><button class="btn rd" id="y">Yes, submit section</button> <button class="btn sec" id="n">Go back</button></div>`;document.body.appendChild(m);$('#n',m).onclick=()=>m.remove();$('#y',m).onclick=()=>{m.remove();endSection(i,'')}}
function endSection(i,msg){clearInterval(tick);const sec=ST.sec[i];sec.finished=true;if(sec.type==='std')sec.pos=sec.pos||0;P.snap('end '+A.sectionsInfo[i][0]);save();
  if(msg)A.toast(msg,1);
  if(i<4)A.sectionIntro(i+1);else finishAll('')}
/* ---------- Verbal (S3) ---------- */
function verbal(i){const s=ST.sec[i];clearInterval(tick);
  const phaseTick=(secs,onEnd,label)=>{const end=Date.now()+A.sp(secs)*1000;const f=()=>{const left=(end-Date.now())/1000;setTimer(left*(C.speed||1));const pb=$('#pb');if(pb)pb.style.width=Math.max(0,100*left/A.sp(secs))+'%';if(left<=0){clearInterval(tick);onEnd()}};f();tick=setInterval(f,200)};
  const p=s.phase;
  if(p==='sc'){const it=s.sc[s.idx],q=qOf('S3',it.id);
    shell(`<div><span class="qno">Sentence completion ${s.idx+1} of ${s.sc.length}</span><span class="qtopic">25 seconds per item</span></div><div class="pbar"><i id="pb"></i></div><div class="qtext">${q.q}</div>${it.ord.map((oi,k)=>`<div class="opt ${s.scAns[it.id]===oi?'sel':''}" data-o="${oi}"><span class="k">${L[k]}.</span><span>${q.o[oi]}</span></div>`).join('')}`,{foot:'<span class="sp"></span><button class="btn" id="nx">Next »</button>',side:'<p class="sm mut">Each item has its own timer. You cannot go back.</p>'});
    document.querySelectorAll('.opt').forEach(d=>d.onclick=()=>{s.scAns[it.id]=+d.dataset.o;save();document.querySelectorAll('.opt').forEach(x=>x.classList.toggle('sel',x===d))});
    const nx=()=>{clearInterval(tick);s.idx++;if(s.idx>=s.sc.length){s.phase='ins1';s.idx=0}save();verbal(i)};$('#nx').onclick=nx;phaseTick(25,nx)}
  else if(p==='ins1'){shell(`<div class="card"><span class="tag">INSTRUCTION SCREEN</span><h2>Passage Recall: how it works</h2><p>You will see 4 short passages, one at a time. Each passage stays on screen for <b>30 seconds</b> and then disappears. After it disappears you get <b>90 seconds</b> to type what you remember: names, numbers, dates, places and the order of events. Write short, clear sentences and do not invent facts.</p><p class="mut sm">Copy and paste are disabled in the answer box. This screen closes in 25 seconds or when you press Continue.</p></div><div class="pbar"><i id="pb"></i></div>`,{foot:'<span class="sp"></span><button class="btn" id="nx">Continue »</button>'});
    const nx=()=>{clearInterval(tick);s.phase='pr';s.idx=0;s.sub='read';save();verbal(i)};$('#nx').onclick=nx;phaseTick(25,nx)}
  else if(p==='pr'){const task=B.PR.find(x=>x.id===s.pr[s.idx]);
    if(s.sub==='read'){shell(`<div><span class="qno">Passage recall ${s.idx+1} of 4: READ</span><span class="qtopic">passage disappears in 30 seconds</span></div><div class="pbar"><i id="pb"></i></div><p class="qtext" style="user-select:none;line-height:1.8">${esc(task.p)}</p>`,{foot:'<span class="sp"></span><span class="mut sm">Read carefully. You cannot skip the reading time.</span>'});
      phaseTick(30,()=>{s.sub='write';save();verbal(i)})}
    else{shell(`<div><span class="qno">Passage recall ${s.idx+1} of 4: WRITE</span><span class="qtopic">90 seconds</span></div><div class="pbar"><i id="pb" style="background:#f59e0b"></i></div><p class="mut sm">The passage is hidden. Type everything you remember.</p><textarea class="big" id="ta" spellcheck="false" placeholder="Type here..."></textarea><div class="sm mut" id="wc">0 words</div>`,{foot:'<span class="sp"></span><button class="btn" id="nx">Submit &amp; Next »</button>'});
      const ta=$('#ta');['paste','copy','cut','drop','contextmenu'].forEach(ev=>ta.addEventListener(ev,e=>e.preventDefault()));ta.oninput=()=>{$('#wc').textContent=(ta.value.trim()?ta.value.trim().split(/\s+/).length:0)+' words'};setTimeout(()=>ta.focus(),50);
      const nx=()=>{clearInterval(tick);s.prAns[s.idx]=ta.value;s.idx++;if(s.idx>=s.pr.length){s.phase='ins2';s.idx=0}else s.sub='read';save();verbal(i)};$('#nx').onclick=nx;phaseTick(90,nx)}}
  else if(p==='ins2'){shell(`<div class="card"><span class="tag">INSTRUCTION SCREEN</span><h2>Email Writing: how it works</h2><p>You will get a short work situation. Write a complete, polite email in <b>9 minutes</b>: subject line, greeting, purpose in the first sentence, the facts given, a clear request or next step, a closing and your name.</p><p class="mut sm">This screen closes in 15 seconds or when you press Continue.</p></div><div class="pbar"><i id="pb"></i></div>`,{foot:'<span class="sp"></span><button class="btn" id="nx">Continue »</button>'});
    const nx=()=>{clearInterval(tick);s.phase='em';save();verbal(i)};$('#nx').onclick=nx;phaseTick(15,nx)}
  else{const em=B.EM.find(x=>x.id===s.em);shell(`<div><span class="qno">Email writing</span><span class="qtopic">9 minutes</span></div><div class="pbar"><i id="pb" style="background:#7c3aed"></i></div><div class="qtext">${esc(em.sc)}</div><textarea class="big" id="ta" style="min-height:300px" spellcheck="false" placeholder="Subject: ...&#10;&#10;Dear ...,">${esc(s.emAns||'')}</textarea><div class="sm mut" id="wc">0 words</div>`,{foot:'<span class="sp"></span><button class="btn rd" id="nx">Submit email &amp; finish section</button>'});
    const ta=$('#ta');['paste','drop'].forEach(ev=>ta.addEventListener(ev,e=>e.preventDefault()));ta.oninput=()=>{s.emAns=ta.value;$('#wc').textContent=(ta.value.trim()?ta.value.trim().split(/\s+/).length:0)+' words'};ta.oninput();
    const nx=()=>{clearInterval(tick);s.emAns=ta.value;endSection(i,'')};$('#nx').onclick=nx;phaseTick(540,nx)}}
/* ---------- finish ---------- */
function finishAll(reason){clearInterval(tick);if(!ST||ST.done)return;ST.done=true;ST.endedAt=Date.now();ST.reason=reason;P.snap('finish');P.stop();ST.proc={counts:P.counts,log:P.log.slice(-60),snaps:P.snaps.slice(-40)};LS.del('state');
  try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}
  A.showReport(ST);P.release()}
window.ATC.getState=()=>ST;
})(window.ATC);
