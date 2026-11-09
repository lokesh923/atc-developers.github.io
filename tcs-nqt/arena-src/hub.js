/* TCS NQT Practice Arena: landing page, browser check, auto-built full mocks, figure tests, section practice */
(function(){
const D=window.ARENA_DATA,CFG=window.ARENA_CFG;
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SPEED=Math.max(1,parseFloat((location.search.match(/[?&]speed=([\d.]+)/)||[])[1])||CFG.speed||1);
const LSg=(k,d)=>{try{const v=localStorage.getItem('arena_'+k);return v?JSON.parse(v):d}catch(e){return d}},LSs=(k,v)=>{try{localStorage.setItem('arena_'+k,JSON.stringify(v))}catch(e){}};
const fmt=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return (h?h+'h ':'')+m+'m'};
const L='ABCDEFGH';
document.addEventListener('click',e=>{if(e.target.tagName==='IMG'&&e.target.closest('.qtext,.rev')){$('#lbimg').src=e.target.src;$('#lightbox').style.display='flex'}});
/* ---------- SCORM 1.2 ---------- */
let lms=null,t0=Date.now(),MOCKDONE=false;const findAPI=w=>{let n=0;while(w&&!w.API&&w.parent&&w.parent!==w&&n<20){w=w.parent;n++}return w&&w.API?w.API:null};
const sc=(f,a,b)=>{try{return lms?(b===undefined?(a===undefined?lms[f]():lms[f](a)):lms[f](a,b)):''}catch(e){return ''}};
const tf=s=>{s=Math.round(s);return String(Math.floor(s/3600)).padStart(4,'0')+':'+String(Math.floor(s%3600/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const scormInit=()=>{try{lms=findAPI(window);if(!lms&&window.opener)lms=findAPI(window.opener)}catch(e){}if(!lms)return;sc('LMSInitialize','');const st=sc('LMSGetValue','cmi.core.lesson_status');if(!st||st==='not attempted')sc('LMSSetValue','cmi.core.lesson_status','incomplete');sc('LMSCommit','')};
const scormReport=(pct,sum)=>{if(!lms)return;sc('LMSSetValue','cmi.core.score.min','0');sc('LMSSetValue','cmi.core.score.max','100');sc('LMSSetValue','cmi.core.score.raw',String(Math.round(pct)));sc('LMSSetValue','cmi.core.lesson_status',pct>=CFG.passMark?'passed':'failed');sc('LMSSetValue','cmi.core.session_time',tf((Date.now()-t0)/1000));sc('LMSSetValue','cmi.suspend_data',String(sum).slice(0,3800));sc('LMSCommit','')};
window.addEventListener('beforeunload',()=>{if(lms){sc('LMSSetValue','cmi.core.session_time',tf((Date.now()-t0)/1000));sc('LMSCommit','');sc('LMSFinish','');lms=null}});
/* ---------- modules ---------- */
const H={home:()=>home(),speed:SPEED,report:(p,s)=>{if(!MOCKDONE)scormReport(p,s)},compiler:CFG.compiler};
const P={
 NUM:makePractice({title:'Numerical Ability',n:20,min:25,gen:14,bimg:4,bany:2,limit:75,prefix:'np_',tag:'NUM',pass:60},window.NG_NUM,D.S1,H),
 REA:makePractice({title:'Reasoning Ability',n:20,min:25,gen:14,bimg:4,bany:2,limit:75,prefix:'rp_',tag:'REAS',pass:60},window.NG_REA,D.S2,H),
 ADV:makePractice({title:'Advanced Quant + Reasoning',n:14,min:25,gen:10,bimg:3,bany:1,limit:107,prefix:'ap_',tag:'ADV',pass:60},window.NG_ADV,D.S4,H),
 VER:makeVerbal(window.SG,D.V,H),
 COD:makeCoding(D.S5,H)};
const SEC={NUM:{name:'Numerical Ability',q:'20 Q',min:25,short:'Numerical'},REA:{name:'Reasoning Ability',q:'20 Q',min:25,short:'Reasoning'},VER:{name:'Verbal Ability',q:'25 tasks',min:26,short:'Verbal'},ADV:{name:'Advanced Quant + Reasoning',q:'14 Q',min:25,short:'Adv. Quant + Reasoning'},COD:{name:'Advanced Coding',q:'2 Q',min:90,short:'Advanced Coding'}};
const MOCKS=[
 {id:'full',title:'Full Mock (auto-built)',sections:['NUM','REA','VER','ADV','COD'],desc:'The complete test in order: five sections, each with its own timer, answers final once a section is submitted. A new paper is built every time from the generated questions and the unseen part of the bank.'},
 {id:'found',title:'Foundation Mock (auto-built)',sections:['NUM','REA','VER'],desc:'The first three sections: Numerical, Reasoning and the new-pattern Verbal (sentence completion, passage recall, email). A good daily mock.'},
 {id:'adv',title:'Advanced Mock (auto-built)',sections:['ADV','COD'],desc:'Advanced Quant + Reasoning followed by the 90-minute coding section with the online compiler (C, C++, Java, Python).'},
 {id:'img',title:'Master Mock (image-based)',sections:['NUM','REA','ADV'],img:true,desc:'Figure-heavy and equation-heavy: most questions come from the image bank (charts, figures, nets, Venn diagrams, equations) in Numerical, Reasoning and Advanced Quant + Reasoning.'}];
const hasImg=q=>/<img/.test(q.q)||(q.o||[]).some(o=>/<img/.test(String(o)));
const cnt={S1:D.S1.filter(hasImg).length,S2:D.S2.filter(hasImg).length,S4:D.S4.filter(hasImg).length};
const mockMin=m=>m.sections.reduce((a,k)=>a+SEC[k].min,0);
const render=h=>{$('#app').innerHTML=h;window.scrollTo(0,0)};
let M=null;
/* ---------- landing ---------- */
function home(){M=null;document.onkeydown=null;const hist=LSg('hist',[]);const last=hist[hist.length-1];
  const att=k=>{try{const s=P[k].stats();return s.att}catch(e){return 0}};
  render(`<div class="ahead"><div class="logo">NQT</div><div><h1>${esc(CFG.brand)}</h1><small>${esc(CFG.sub)}</small></div></div><div class="wrap">
  <div class="eyebrow">TCS NQT 2027 | ONLINE TEST PRACTICE</div><h2 class="hero">Prepare section by section, then test yourself against the clock</h2>
  <p class="lead">Full mock tests follow the TCS NQT pattern used in this series: five sections, each with its own timer, answers final once submitted. Every section also has its own practice area with unlimited generated questions, figure-based questions and, for coding, an online compiler for C, C++, Java and Python.</p>
  <div class="sec-title">Full mock tests</div><div class="cards">${MOCKS.map(m=>`<div class="mcard"><h3>${m.title}</h3><div class="chips"><span class="chip">${m.sections.length} sections | ${mockMin(m)} min</span></div><div class="chips">${m.sections.map(k=>`<span class="chip">${SEC[k].short} ${SEC[k].q} · ${SEC[k].min}m</span>`).join('')}${m.img?`<span class="chip gold">image-based</span>`:''}</div><p class="grow">${m.desc}</p><button class="abtn" data-mock="${m.id}">Start ${m.title.replace(' (auto-built)','')}</button></div>`).join('')}</div>
  ${last?`<div class="note">Last mock: <b>${last.t}</b> · ${new Date(last.d).toLocaleString()} · score <b>${last.o}%</b> · mocks taken: ${hist.length}</div>`:''}
  <div class="sec-title">Practice by section</div><div class="cards">
   ${secCard('NUM','Numerical Ability','20 Q | 25 min','Percentages, profit and loss, time and work, interest, number system, probability, mensuration and more.',`${NGn(window.NG_NUM)} question types · unlimited`,`${D.S1.length} bank questions`,`${cnt.S1} with figures`)}
   ${secCard('REA','Reasoning Ability','20 Q | 25 min','Series, coding-decoding, blood relations, directions, seating and floor puzzles, syllogisms, Venn, clocks, data sufficiency and figure questions.',`${NGn(window.NG_REA)} question types · unlimited`,`${D.S2.length} bank questions`,`${cnt.S2} with figures`)}
   ${secCard('VER','Verbal Ability','25 tasks | 26 min','New pattern: 20 sentence-completion items, 4 passage-recall tasks and an email. Grammar, vocabulary, recall and writing drills.',`${NGn(window.SG)} sentence types · unlimited`,'Unlimited passages and emails','')}
   ${secCard('ADV','Advanced Quant + Reasoning','14 Q | 25 min','Data interpretation, probability, permutation and combination, number theory, algebra, mensuration, work and pipes, puzzles and syllogisms.',`${NGn(window.NG_ADV)} question types · unlimited`,`${D.S4.length} bank questions`,`${cnt.S4} with figures`)}
   ${secCard('COD','Advanced Coding','2 Q | 90 min','Arrays, strings, hashing, DP, greedy, graphs, matrix and more. Write code in C, C++, Java or Python and run it on the compiler.',`${D.S5.length} problems · hidden test cases`,'C · C++ · Java · Python','')}
  </div>
  <div class="sec-title">Quick figure tests</div><div class="cards">
   ${figCard('figNUM','Figure Test: Numerical','15 questions | 25 min','15 image and equation questions from the bank, same time as the real Numerical section.','Numerical 15Q · 25m')}
   ${figCard('figREA','Figure Test: Reasoning','15 questions | 25 min','15 figure-based reasoning questions (nets, Venn diagrams, figure series, charts) in the real Reasoning time.','Reasoning 15Q · 25m')}
   ${figCard('figADV','Figure Test: Advanced Quant + Reasoning','14 questions | 25 min','14 image and equation questions for the advanced section.','Advanced 14Q · 25m')}
   ${figCard('imgREA','Reasoning Image Test: 50 hard questions','50 questions | 83 min','A long figure-based reasoning test. Take it at 25 minutes per 15 questions.','Reasoning 50Q · 83m')}
  </div>
  <p class="sm mut" style="margin:30px 0 10px">Practice scores are saved in this browser only. Use a current Chrome or Edge on a laptop or desktop for the best experience.</p></div>`);
  $$('[data-mock]').forEach(b=>b.onclick=()=>startMock(MOCKS.find(m=>m.id===b.dataset.mock)));
  $$('[data-sec]').forEach(b=>b.onclick=()=>{const k=b.dataset.sec;if(k==='COD')P.COD.home();else P[k].home()});
  $$('[data-fig]').forEach(b=>b.onclick=()=>figTest(b.dataset.fig))}
const NGn=g=>g&&g.F?g.F.length:0;
const secCard=(k,t,badge,desc,a,b,c)=>{const n=(()=>{try{return P[k].stats().att}catch(e){return 0}})();return `<div class="mcard"><h3>${t}</h3><div class="chips"><span class="chip">${badge}</span></div><p class="grow">${desc}</p><div class="chips"><span class="chip">${a}</span>${b?`<span class="chip">${b}</span>`:''}${c?`<span class="chip gold">${c}</span>`:''}${n?`<span class="chip green">${n} attempted</span>`:''}</div><button class="abtn" data-sec="${k}">Open ${SEC[k].short} practice</button></div>`};
const figCard=(id,t,badge,desc,chip)=>`<div class="mcard"><h3>${t}</h3><div class="chips"><span class="chip">${badge}</span></div><div class="chips"><span class="chip">${chip}</span><span class="chip gold">figure-based</span></div><p class="grow">${desc}</p><button class="abtn" data-fig="${id}">Start ${t.split(':')[0]}</button></div>`;
/* ---------- browser check ---------- */
function ua(){const u=navigator.userAgent;let m;if((m=u.match(/Edg\/(\d+)/)))return {n:'Edge',v:+m[1],min:90};if((m=u.match(/OPR\/(\d+)/)))return {n:'Opera',v:+m[1],min:76};if((m=u.match(/Chrome\/(\d+)/)))return {n:'Chrome',v:+m[1],min:90};if((m=u.match(/Firefox\/(\d+)/)))return {n:'Firefox',v:+m[1],min:90};if((m=u.match(/Version\/(\d+).*Safari/)))return {n:'Safari',v:+m[1],min:14};return {n:'Unknown browser',v:0,min:0}}
async function compat(go,needCompiler){
  const items=[];const add=(label,state,msg)=>items.push({label,state,msg});
  const b=ua();add('Browser',b.v>=b.min&&b.min?'g':(b.min?'y':'y'),`${b.n} ${b.v||''} ${b.v>=b.min&&b.min?'is supported.':'may not be fully supported. Chrome or Edge (latest) is recommended.'}`);
  let st=false;try{localStorage.setItem('arena_t','1');st=localStorage.getItem('arena_t')==='1';localStorage.removeItem('arena_t')}catch(e){}add('Saving progress (browser storage)',st?'g':'y',st?'Available.':'Not available. The test still runs, but progress and the no-repeat memory will not be saved.');
  const feat=typeof fetch==='function'&&typeof Promise==='function'&&typeof AbortController==='function';add('Required browser features',feat?'g':'r',feat?'All present.':'Your browser is too old. Please update it.');
  const w=window.innerWidth;add('Screen size',w>=1000?'g':'y',w>=1000?`${w} px wide.`:`${w} px wide. A laptop or desktop screen is recommended for the test and the code editor.`);
  const tm=await new Promise(r=>{const s=performance.now();setTimeout(()=>r(performance.now()-s),300)});add('Timer accuracy',tm<900?'g':'y',tm<900?'Timers run normally.':'Timers are running slowly. Close other tabs and apps.');
  add('Full screen',document.fullscreenEnabled?'g':'y',document.fullscreenEnabled?'Supported (optional).':'Not available in this window. The test works without it.');
  add('Course player',window.self!==window.top?'g':'g',window.self!==window.top?'Running inside the course player.':'Running directly in the browser.');
  const cIdx=items.length;add('Online compiler (coding section)','p','Checking…');
  const draw=()=>render(`<div class="ahead"><div class="logo">NQT</div><div><h1>${esc(CFG.brand)}</h1><small>${esc(CFG.sub)}</small></div></div><div class="wrap" style="max-width:820px"><div class="card"><span class="tag">BEFORE YOU START</span><h1>Browser compatibility check</h1><p class="mut">No camera or microphone is used. This only checks that your browser can run the test.</p>${items.map(i=>`<div class="chk"><span class="dot ${i.state==='p'?'':i.state}"></span><div><b>${i.label}</b><br><span class="sm mut">${i.msg}</span></div></div>`).join('')}
   <label style="margin-top:14px"><input type="checkbox" id="c_fs" ${document.fullscreenEnabled?'checked':''}> Use full screen during the test (recommended)</label>
   <p style="margin-top:14px"><button class="abtn" id="c_go" ${items.some(i=>i.state==='r')||items[cIdx].state==='p'?'disabled':''}>Start test</button> <button class="abtn alt" id="c_back">Back</button></p></div></div>`);
  draw();$('#c_back').onclick=home;$('#c_go').onclick=async()=>{if($('#c_fs')&&$('#c_fs').checked&&document.documentElement.requestFullscreen){try{await document.documentElement.requestFullscreen()}catch(e){}}go()};
  let ok=[];try{ok=await P.COD.ping()}catch(e){}
  items[cIdx]=ok.length?{label:'Online compiler (coding section)',state:'g',msg:'Reachable ('+ok.join(', ')+'). C, C++, Java and Python can be run.'}:{label:'Online compiler (coding section)',state:needCompiler?'y':'y',msg:'The compiler service could not be reached from this network. Numerical, Reasoning and Verbal work normally; the coding section needs internet access to the compiler.'};
  if(!$('#c_go'))return;draw();$('#c_back').onclick=home;$('#c_go').onclick=async()=>{if($('#c_fs')&&$('#c_fs').checked&&document.documentElement.requestFullscreen){try{await document.documentElement.requestFullscreen()}catch(e){}}go()}}
/* ---------- full mock runner ---------- */
function startMock(m){compat(()=>{M={mock:m,i:0,res:[],start:Date.now()};intro()},m.sections.includes('COD'))}
function intro(){const m=M.mock,k=m.sections[M.i],s=SEC[k];
  render(`<div class="ahead"><div class="logo">NQT</div><div><h1>${esc(m.title)}</h1><small>Section ${M.i+1} of ${m.sections.length}</small></div></div><div class="wrap" style="max-width:820px"><div class="card"><span class="tag">SECTION ${M.i+1} OF ${m.sections.length}</span><h1>${s.name}</h1>
  <div class="chips" style="margin:8px 0"><span class="chip">${s.q}</span><span class="chip">${s.min} minutes</span>${m.img&&k!=='VER'&&k!=='COD'?'<span class="chip gold">image-based</span>':''}</div>
  <ul>${k==='VER'?'<li>20 sentence-completion items, 25 seconds each (auto-advance, no going back).</li><li>Instruction screen, then 4 passage-recall tasks: 30 s to read, 90 s to type.</li><li>Instruction screen, then a 9-minute email.</li>':k==='COD'?'<li>2 problems (one Medium, one Hard) in 90 minutes.</li><li>Write in C, C++, Java or Python. Use Run for your own input and Submit for all hidden test cases.</li><li>Your best submission for each problem counts.</li>':`<li>${s.q.replace(' Q',' questions')}, ${s.min} minutes. Move freely inside the section and mark for review.</li><li>Typed-answer (TITA) questions may appear. There is no negative marking.</li>`}<li><b>Answers are final once the section is submitted.</b> When the timer ends the section is submitted automatically.</li></ul>
  <button class="abtn" id="go">Start section</button></div></div>`);
  $('#go').onclick=()=>runSection(k)}
function runSection(k){const m=M.mock,label=`${m.title.replace(' (auto-built)','')} · Section ${M.i+1}/${m.sections.length}: ${SEC[k].name}`;const done=r=>{M.res.push({k,r});M.i++;M.i<m.sections.length?intro():finishMock()};
  if(k==='NUM'||k==='REA'||k==='ADV'){const n=k==='ADV'?14:20;const opt=m.img?(k==='ADV'?{gen:4,bimg:9,bany:1}:{gen:6,bimg:12,bany:2}):undefined;const items=P[k].makePaper(opt).slice(0,n);P[k].runPaper(items,25,{label,cb:done})}
  else if(k==='VER')P.VER.runVerbal(done,label);else P.COD.runMock(done,label,90)}
const eqv=(a,b)=>{a=String(a).trim().toLowerCase().replace(/[,₹%\s]/g,'');b=String(b).trim().toLowerCase().replace(/[,₹%\s]/g,'');if(a===b)return true;const re=/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/;if(re.test(a)&&re.test(b)){const x=parseFloat(a),y=parseFloat(b);return Math.abs(x-y)<=0.011||Math.abs(x-y)<=1e-6*Math.max(1,Math.abs(y))}return false};
const isOk=(q,a)=>a!==undefined&&a!==''&&(q.ty==='mcq'?a===q.a:eqv(a,q.a));
function review(r){return r.items.map((q,k)=>{const a=r.ans[k],ok=isOk(q,a);const ya=a===undefined||a===''?'<i>not answered</i>':q.ty==='mcq'?`${L[a]}. ${q.o[a]}`:esc(a);const ca=q.ty==='mcq'?`${L[q.a]}. ${q.o[q.a]}`:esc(q.a);return `<details class="rev"><summary class="${ok?'ok':'bad'}">Q${k+1} · ${ok?'Correct':a===undefined||a===''?'Not answered':'Wrong'} · ${esc(q.t||'')}</summary><div class="qtext">${q.q}</div><p class="sm"><b>Your answer:</b> ${ya}</p><p class="sm"><b>Correct answer:</b> ${ca}</p><p class="sm">${q.e||''}</p></details>`}).join('')}
function finishMock(){const m=M.mock;const secs=M.res.map(({k,r})=>{if(k==='VER')return {k,pct:r.overall,det:`Sentence completion ${r.sc}/20 · recall ${r.prAvg}% · email ${r.es}%`};if(k==='COD')return {k,pct:r.pct,det:r.per.map(x=>`${x.p.title}: ${x.r?x.r.passed+'/'+x.r.total:'not submitted'}`).join(' · ')};return {k,pct:r.p,det:`${r.c}/${r.n} correct · attempted ${r.att}`}});
  const overall=Math.round(secs.reduce((a,s)=>a+s.pct,0)/secs.length);const topics={};M.res.forEach(({k,r})=>{if(r.topics)r.topics.forEach(t=>{const x=topics[t[0]]=topics[t[0]]||[0,0];x[0]+=t[1];x[1]+=t[2]})});
  const tl=Object.entries(topics).filter(v=>v[1][1]>=2).map(([t,v])=>[t,v[0],v[1],Math.round(100*v[0]/v[1])]).sort((a,b)=>a[3]-b[3]);const weak=tl.filter(t=>t[3]<50).slice(0,8);
  const hist=LSg('hist',[]);hist.push({d:Date.now(),t:m.title,o:overall,s:secs.map(s=>s.k+':'+s.pct).join(' ')});LSs('hist',hist.slice(-30));MOCKDONE=true;
  scormReport(overall,`MOCK:${m.id},OVERALL:${overall},`+secs.map(s=>s.k+':'+s.pct).join(','));try{if(document.fullscreenElement)document.exitFullscreen()}catch(e){}
  render(`<div class="ahead"><div class="logo">NQT</div><div><h1>${esc(m.title)}: result</h1><small>${new Date().toLocaleString()}</small></div></div><div class="wrap"><div class="card"><span class="tag">MOCK COMPLETED</span><div class="big">${overall}% <span style="font-size:18px" class="${overall>=CFG.passMark?'ok':'bad'}">${overall>=CFG.passMark?'ABOVE':'BELOW'} the practice target of ${CFG.passMark}%</span></div><p class="mut">Total time used: ${fmt((Date.now()-M.start)/1000*SPEED)} of ${mockMin(m)} min</p>
  <table class="t"><tr><th>Section</th><th>Detail</th><th>Score</th></tr>${secs.map(s=>`<tr><td><b>${SEC[s.k].name}</b></td><td>${s.det}</td><td><b>${s.pct}%</b></td></tr>`).join('')}</table>
  <p style="margin-top:14px"><button class="abtn" id="again">Build a new ${m.title.replace(' (auto-built)','')}</button> <button class="abtn alt" id="back">Back to Arena</button></p></div>
  ${tl.length?`<div class="card"><h2>Topic-wise accuracy</h2><table class="t"><tr><th>Topic</th><th>Correct</th><th>Accuracy</th></tr>${tl.map(t=>`<tr><td>${esc(t[0])}</td><td>${t[1]}/${t[2]}</td><td class="${t[3]>=70?'ok':t[3]<50?'bad':''}">${t[3]}%</td></tr>`).join('')}</table>${weak.length?`<p><b>Focus on:</b> ${weak.map(t=>esc(t[0])).join(', ')}</p>`:''}</div>`:''}
  ${M.res.map(({k,r})=>{if(k==='VER')return `<div class="card"><h2>Verbal review</h2>${r.prs.map((x,i)=>P.VER.recallResult(x.p,x.text,x.s,'Passage '+(i+1))).join('')}<h3>Email</h3>${P.VER.emailResult(r.e.em,r.e.emAns,r.esObj)}<p class="sm mut">Recall and email scores are practice indicators from key-fact and checklist matching, not official marking.</p></div>`;if(k==='COD')return `<div class="card"><h2>Coding review</h2>${r.per.map(x=>`<h3>${esc(x.p.title)} <span class="lv ${x.p.level}">${x.p.level}</span> · ${x.r?x.r.passed+'/'+x.r.total+' test cases':'not submitted'}</h3>${x.r?P.COD.resHTML(x.r):''}`).join('')}</div>`;return `<div class="card"><h2>${SEC[k].name}: answer review</h2>${review(r)}</div>`}).join('')}</div>`);
  $('#again').onclick=()=>startMock(m);$('#back').onclick=home}
/* ---------- figure tests ---------- */
function figTest(id){const spec={figNUM:{k:'NUM',n:15,min:25,t:'Figure Test: Numerical'},figREA:{k:'REA',n:15,min:25,t:'Figure Test: Reasoning'},figADV:{k:'ADV',n:14,min:25,t:'Figure Test: Advanced Quant + Reasoning'},imgREA:{k:'REA',n:50,min:83,t:'Reasoning Image Test: 50 hard questions'}}[id];
  compat(()=>{const items=P[spec.k].figurePaper(spec.n);P[spec.k].runPaper(items,spec.min,{label:spec.t})},false)}
/* ---------- boot ---------- */
window.ARENA={start:()=>{scormInit();home()}};
})();
