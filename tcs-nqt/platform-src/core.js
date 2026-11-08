/* core: utilities, storage, SCORM, sampling, proctoring, pre-exam screens */
window.ATC=window.ATC||{};
(function(A){
const C=window.CFG,B=window.BANK;
A.$=(s,r)=>(r||document).querySelector(s);
A.esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
A.shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
A.fmt=sec=>{sec=Math.max(0,Math.round(sec));const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;return (h?h+':':'')+String(m).padStart(h?2:1,'0').padStart(2,'0')+':'+String(s).padStart(2,'0')};
A.sp=x=>x/(C.speed||1);                        // test-speed scaling for durations in seconds
const LS={get(k,d){try{const v=localStorage.getItem('atc_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('atc_'+k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem('atc_'+k)}catch(e){}}};
A.LS=LS;
A.toast=(m,info)=>{const t=A.$('#toast');const d=document.createElement('div');if(info)d.className='info';d.textContent=m;t.appendChild(d);setTimeout(()=>d.remove(),5000)};
document.addEventListener('click',e=>{if(e.target.tagName==='IMG'&&e.target.closest('.qtext,.rev')){A.$('#lbimg').src=e.target.src;A.$('#lightbox').style.display='flex'}});
/* ---------- SCORM 1.2 ---------- */
let lms=null,t0=Date.now();
function findAPI(w){let n=0;while(w&&!w.API&&w.parent&&w.parent!==w&&n<20){w=w.parent;n++}return w&&w.API?w.API:null}
function sc(fn,a,b){try{if(!lms)return '';return b===undefined?(a===undefined?lms[fn]():lms[fn](a)):lms[fn](a,b)}catch(e){return ''}}
A.scormInit=()=>{lms=findAPI(window);if(!lms&&window.opener)try{lms=findAPI(window.opener)}catch(e){}if(!lms)return;sc('LMSInitialize','');const st=sc('LMSGetValue','cmi.core.lesson_status');if(!st||st==='not attempted')sc('LMSSetValue','cmi.core.lesson_status','incomplete');sc('LMSCommit','')};
A.scormName=()=>{const n=sc('LMSGetValue','cmi.core.student_name');return n&&n!=='undefined'?n:''};
const tf=s=>{s=Math.round(s);return String(Math.floor(s/3600)).padStart(4,'0')+':'+String(Math.floor(s%3600/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
A.framed=(()=>{try{return window.self!==window.top&&!window.opener}catch(e){return true}})();
A.scormReport=(pct,summary)=>{try{if(window.opener&&!window.opener.closed)window.opener.postMessage({atc:1,pct:pct,summary:String(summary).slice(0,3500)},'*')}catch(e){}if(!lms)return;sc('LMSSetValue','cmi.core.score.min','0');sc('LMSSetValue','cmi.core.score.max','100');sc('LMSSetValue','cmi.core.score.raw',String(pct));sc('LMSSetValue','cmi.core.lesson_status',pct>=C.passMark?'passed':'failed');sc('LMSSetValue','cmi.core.session_time',tf((Date.now()-t0)/1000));sc('LMSSetValue','cmi.suspend_data',String(summary).slice(0,4000));sc('LMSCommit','')};
const quit=()=>{if(!lms)return;sc('LMSSetValue','cmi.core.session_time',tf((Date.now()-t0)/1000));sc('LMSCommit','');sc('LMSFinish','');lms=null};
window.addEventListener('beforeunload',quit);
/* ---------- sampling without repeats ---------- */
function balanced(pool,k,keyf){const g={};pool.forEach(q=>{const t=keyf(q);(g[t]=g[t]||[]).push(q)});const keys=A.shuffle(Object.keys(g));keys.forEach(t=>g[t]=A.shuffle(g[t]));const out=[];let i=0;while(out.length<k&&keys.some(t=>g[t].length)){const t=keys[i%keys.length];if(g[t].length)out.push(g[t].pop());i++}return out}
A.sample=(sec,n,filter)=>{const all=(B[sec]||[]).filter(filter||(()=>true));let seen=LS.get('seen_'+sec,[]);let unseen=all.filter(q=>!seen.includes(q.id));let chosen=balanced(unseen,Math.min(n,unseen.length),q=>q.t||q.topic||'x');let reset=false;
  if(chosen.length<n){reset=true;const ids=new Set(chosen.map(q=>q.id));seen=[];const rest=all.filter(q=>!ids.has(q.id));chosen=chosen.concat(balanced(rest,n-chosen.length,q=>q.t||q.topic||'x'))}
  LS.set('seen_'+sec,seen.concat(chosen.map(q=>q.id)));return {items:A.shuffle(chosen),reset,left:all.length-seen.length-chosen.length,total:all.length}};
A.bankInfo=sec=>{const all=B[sec]||[];const seen=LS.get('seen_'+sec,[]).filter(id=>all.some(q=>q.id===id));return {total:all.length,used:seen.length}};
/* ---------- proctoring ---------- */
const P=A.proc={stream:null,vids:[],log:[],snaps:[],counts:{},active:false,micLevel:0,ctx:null,an:null,timer:null,faceTimer:null,detector:null};
P.add=(type,msg)=>{if(!P.active)return;const now=Date.now();const last=P.lastAt&&P.lastAt[type]||0;P.lastAt=P.lastAt||{};if(now-last<4000)return;P.lastAt[type]=now;P.log.push({t:now,type,msg});P.counts[type]=(P.counts[type]||0)+1;A.toast('⚠ '+msg);const tot=Object.values(P.counts).reduce((a,b)=>a+b,0);if(C.proctor.maxViolations&&tot>=C.proctor.maxViolations&&A.onTerminate)A.onTerminate('Too many violations ('+tot+')')};
P.total=()=>Object.values(P.counts).reduce((a,b)=>a+b,0);
P.start=async(needCam,needMic)=>{const out={cam:false,mic:false,err:''};
  try{P.stream=await navigator.mediaDevices.getUserMedia({video:needCam?{width:320,height:240,facingMode:'user'}:false,audio:!!needMic});
    out.cam=P.stream.getVideoTracks().length>0;out.mic=P.stream.getAudioTracks().length>0;
    P.stream.getTracks().forEach(t=>t.addEventListener('ended',()=>P.add('device',(t.kind==='video'?'Camera':'Microphone')+' was turned off or disconnected')));
    if(out.mic){try{P.ctx=new (window.AudioContext||window.webkitAudioContext)();const src=P.ctx.createMediaStreamSource(P.stream);P.an=P.ctx.createAnalyser();P.an.fftSize=512;src.connect(P.an)}catch(e){}}
  }catch(e){out.err=(e&&e.name||'Error')+(e&&e.message?': '+e.message:'')}
  return out};
P.attach=v=>{if(P.stream&&v){v.srcObject=P.stream;v.muted=true;v.play&&v.play().catch(()=>{})}};
P.level=()=>{if(!P.an)return 0;const d=new Uint8Array(P.an.fftSize);P.an.getByteTimeDomainData(d);let m=0;for(const x of d)m=Math.max(m,Math.abs(x-128));return Math.min(1,m/128*2)};
P.snap=(label)=>{const v=document.querySelector('video[data-live]')||document.querySelector('video.prev');if(!v||!v.videoWidth)return null;const c=document.createElement('canvas');c.width=160;c.height=120;c.getContext('2d').drawImage(v,0,0,160,120);const u=c.toDataURL('image/jpeg',0.5);P.snaps.push({t:Date.now(),label:label||'',u});if(P.snaps.length>400)P.snaps.shift();return u};
P.run=()=>{P.active=true;let loud=0;
  P.timer=setInterval(()=>{const lv=P.level();if(lv>C.proctor.noiseLevel){loud++;if(loud>=6){P.add('noise','Loud sound or talking detected');loud=0}}else loud=Math.max(0,loud-1)},500);
  P.snapT=setInterval(()=>P.snap('auto'),A.sp(C.proctor.snapshotEverySec)*1000);
  if(C.proctor.faceCheck&&'FaceDetector' in window&&P.stream&&P.stream.getVideoTracks().length){try{P.detector=new FaceDetector({fastMode:true,maxDetectedFaces:3});
    P.faceTimer=setInterval(async()=>{const v=document.querySelector('video[data-live]');if(!v||!v.videoWidth)return;try{const f=await P.detector.detect(v);if(f.length===0)P.add('face','Your face is not visible in the camera');else if(f.length>1)P.add('multi','More than one person detected in the camera')}catch(e){P.detector=null;clearInterval(P.faceTimer)}},5000)}catch(e){}}
  document.addEventListener('visibilitychange',P.vis);window.addEventListener('blur',P.blur);document.addEventListener('fullscreenchange',P.fs);
  document.addEventListener('contextmenu',P.ctxm);document.addEventListener('keydown',P.key,true);['copy','cut','paste'].forEach(ev=>document.addEventListener(ev,P.clip,true))};
P.stop=()=>{P.active=false;clearInterval(P.timer);clearInterval(P.snapT);clearInterval(P.faceTimer);document.removeEventListener('visibilitychange',P.vis);window.removeEventListener('blur',P.blur);document.removeEventListener('fullscreenchange',P.fs);document.removeEventListener('contextmenu',P.ctxm);document.removeEventListener('keydown',P.key,true);['copy','cut','paste'].forEach(ev=>document.removeEventListener(ev,P.clip,true))};
P.release=()=>{try{P.stream&&P.stream.getTracks().forEach(t=>t.stop())}catch(e){}};
P.vis=()=>{if(document.hidden)P.add('tab','You switched to another tab or window')};
P.blur=()=>{setTimeout(()=>{if(P.active&&!document.hasFocus()&&!document.hidden)P.add('blur','The test window lost focus')},400)};
P.fs=()=>{if(C.proctor.requireFullscreen&&!document.fullscreenElement&&P.active){P.add('fullscreen','You left full-screen mode');A.askFS&&A.askFS()}};
P.ctxm=e=>{if(P.active){e.preventDefault();P.add('rightclick','Right-click is disabled during the test')}};
P.key=e=>{if(!P.active)return;const k=e.key;if(k==='F12'||(e.ctrlKey&&e.shiftKey&&/[ijc]/i.test(k))||(e.ctrlKey&&/[us]/i.test(k))){e.preventDefault();P.add('keys','Developer / view-source shortcuts are not allowed')}};
P.clip=e=>{if(!P.active)return;const t=e.target;if(t&&t.classList&&t.classList.contains('ed')&&e.type!=='copy'&&e.type!=='cut')return; if(t&&t.classList&&t.classList.contains('ed'))return;e.preventDefault();P.add('clipboard','Copy / paste is disabled during the test')};
/* ---------- screens before the exam ---------- */
const app=()=>A.$('#app');
A.render=h=>{app().innerHTML=h;window.scrollTo(0,0)};
A.cand=LS.get('cand',{});
A.openFull=()=>{const w=window.open(location.href.split('#')[0],'atc_exam_window');if(!w){A.toast('Pop-up blocked. Allow pop-ups for this site and click again.');return false}A.child=w;A.render(`<div class="wrap"><div class="card"><span class="tag">TEST WINDOW OPENED</span><h1>Continue in the new window</h1><p>The test is running in a separate full window, where the camera, microphone and full screen work. <b>Do not close this page</b> until you finish. Your result will be recorded here when the test ends.</p><p id="fin" class="mut">Waiting for the test to finish…</p><button class="btn sec" id="reopen">Open the test window again</button></div></div>`);A.$('#reopen').onclick=()=>{if(A.child&&!A.child.closed)A.child.focus();else A.openFull()};return true};
A.boot=()=>{A.scormInit();window.addEventListener('message',e=>{const d=e.data;if(d&&d.atc===1){A.scormReport(d.pct,d.summary);const f=A.$('#fin');if(f)f.innerHTML='<b class="ok">Test finished. Your score ('+d.pct+'%) has been recorded.</b> You can close the test window.'}});const saved=LS.get('state',null);A.welcome(saved&&!saved.done&&Date.now()-saved.saved<4*3600e3?saved:null)};
const sectionsInfo=[['S1','Numerical Ability','20 questions · 25 min'],['S2','Reasoning Ability','20 questions · 25 min'],['S3','Verbal Ability','25 tasks · 26 min (sentence completion, passage recall, email)'],['S4','Advanced Quant + Reasoning','14 questions · 25 min'],['S5','Advanced Coding','2 problems · 90 min (C, C++, Java, Python)']];
A.sectionsInfo=sectionsInfo;
A.welcome=resume=>{const c=Object.assign({name:A.scormName()},A.cand);
  const bi=['S1','S2','S3','S4'].map(s=>A.bankInfo(s));
  A.render(`<div class="wrap"><div class="card"><span class="tag">TCS NQT 2027 · LIVE TEST PLATFORM</span><h1>${A.esc(C.brand)}</h1><p class="mut">A full-length practice test that follows the live exam pattern, with camera and microphone proctoring, section timers, image and equation questions and an online compiler. Questions change on every attempt and are not repeated until the bank is used up.</p>
  <table class="t"><tr><th>Section</th><th>Pattern</th><th>Question bank</th></tr>${sectionsInfo.map((s,i)=>`<tr><td><b>${s[1]}</b></td><td>${s[2]}</td><td>${i<4?(B['S'+(i+1)].length+' questions'):(B.S5.length+' coding problems')}</td></tr>`).join('')}</table></div>
  ${A.framed&&C.proctor.requireCamera?`<div class="card" style="border-color:#be123c"><h2>Open the test in a full window</h2><p>This page is inside a course player, which blocks the camera, microphone and full screen. Click the button to open the test in its own window and attempt it there.</p><button class="btn gr" id="openfull">Open test in a new window</button></div>`:''}
  ${resume?`<div class="card" style="border-color:#f9c74f"><h2>Resume your unfinished test</h2><p>A test started on ${new Date(resume.saved).toLocaleString()} is still open. The timers kept running while you were away.</p><button class="btn am" id="rs">Resume test</button> <button class="btn sec" id="dis">Discard it</button></div>`:''}
  <div class="card"><h2>Candidate details</h2><div class="grid2"><div><label>Full name *</label><input type="text" id="f_name" value="${A.esc(c.name||'')}"></div><div><label>Email *</label><input type="email" id="f_email" value="${A.esc(c.email||'')}"></div>
  <div><label>Mobile number *</label><input type="tel" id="f_mob" value="${A.esc(c.mob||'')}"></div><div><label>College / University *</label><input type="text" id="f_col" value="${A.esc(c.col||'')}"></div>
  <div><label>Branch / Degree</label><input type="text" id="f_br" value="${A.esc(c.br||'')}"></div><div><label>Roll / Registration number</label><input type="text" id="f_roll" value="${A.esc(c.roll||'')}"></div></div>
  <div class="chk" style="margin-top:12px"><input type="checkbox" id="f_c1"><label style="margin:0;font-weight:500;color:var(--ink)">I agree to switch on my camera and microphone for the whole test. Photos are taken at regular intervals and events such as tab switching are recorded on this device for my own report.</label></div>
  <div class="chk"><input type="checkbox" id="f_c2"><label style="margin:0;font-weight:500;color:var(--ink)">I will attempt the test alone, without help, notes or other devices.</label></div>
  <p id="f_err" class="bad"></p><button class="btn" id="f_go">Continue to system check</button></div></div>`);
  if(A.$('#openfull'))A.$('#openfull').onclick=()=>A.openFull();
  if(resume){A.$('#rs').onclick=()=>{A.cand=resume.cand;A.resumeState=resume;A.syscheck(true)};A.$('#dis').onclick=()=>{LS.del('state');A.welcome(null)}}
  A.$('#f_go').onclick=()=>{const g=id=>A.$('#'+id).value.trim();const v={name:g('f_name'),email:g('f_email'),mob:g('f_mob'),col:g('f_col'),br:g('f_br'),roll:g('f_roll')};
    const err=A.$('#f_err');if(!v.name||!v.email||!v.mob||!v.col){err.textContent='Please fill all fields marked *.';return}
    if(!/^\S+@\S+\.\S+$/.test(v.email)){err.textContent='Enter a valid email address.';return}
    if(!/^[0-9+\-\s]{8,15}$/.test(v.mob)){err.textContent='Enter a valid mobile number.';return}
    if(!A.$('#f_c1').checked||!A.$('#f_c2').checked){err.textContent='Please accept both declarations to continue.';return}
    A.cand=v;LS.set('cand',v);A.syscheck(false)}};
A.syscheck=resuming=>{let okCam=!C.proctor.requireCamera,okMic=!C.proctor.requireMic,okNet=false,photo=null;
  A.render(`<div class="wrap"><div class="card"><span class="tag">STEP 2 OF 3</span><h1>System check</h1><p class="mut">Allow the camera and microphone when the browser asks. Use Chrome or Edge on a laptop or desktop with a stable internet connection.</p>
  <div class="grid2"><div><video class="prev" id="pv" data-live autoplay playsinline muted></video><div class="meter" style="margin-top:8px"><i id="mt"></i></div><p class="sm mut" id="mhint">Speak to see the microphone level move.</p></div>
  <div><div class="chk"><span class="dot" id="d1"></span><span id="t1">Camera: not started</span></div><div class="chk"><span class="dot" id="d2"></span><span id="t2">Microphone: not started</span></div><div class="chk"><span class="dot" id="d3"></span><span id="t3">Full screen: will start with the test</span></div><div class="chk"><span class="dot" id="d4"></span><span id="t4">Internet and compiler: checking…</span></div>
  <button class="btn" id="b_perm">Start camera and microphone</button><p class="bad sm" id="perr"></p></div></div>
  <p class="sm mut">Sit in a well-lit place, keep your face in the frame and keep other people out of the room.</p>
  <button class="btn gr" id="b_next" disabled>Continue to instructions</button> <button class="btn sec" id="b_back">Back</button></div></div>`);
  const dot=(i,ok,t)=>{const d=A.$('#d'+i),x=A.$('#t'+i);if(!d||!x)return;d.className='dot '+(ok?'g':'r');x.textContent=t};
  const upd=()=>{A.$('#b_next').disabled=!(okCam&&okMic)};
  A.$('#b_back').onclick=()=>{A.welcome(null)};
  A.$('#b_perm').onclick=async()=>{const r=await P.start(C.proctor.requireCamera||true,C.proctor.requireMic||true);
    if(r.cam){A.$('#pv').srcObject=P.stream;dot(1,true,'Camera: working');okCam=true}else dot(1,false,'Camera: not available');
    if(r.mic){dot(2,true,'Microphone: working');okMic=true;const iv=setInterval(()=>{if(!A.$('#mt')){clearInterval(iv);return}A.$('#mt').style.width=Math.round(P.level()*100)+'%'},100)}else dot(2,false,'Microphone: not available');
    if(r.err)A.$('#perr').innerHTML='Could not access devices ('+r.err+'). Allow camera and microphone in the browser address bar. If this page is inside a course player, ask your instructor to allow camera and microphone for the player.'+(A.framed?' <button class="btn sm gr" id="ofull">Open the test in a new window</button>':'');const ob=A.$('#ofull');if(ob)ob.onclick=()=>A.openFull();
    upd()};
  (async()=>{try{const ac=new AbortController();setTimeout(()=>ac.abort(),8000);const r=await fetch(C.judge0.url+'/languages',{signal:ac.signal,headers:C.judge0.headers});okNet=r.ok;dot(4,r.ok,r.ok?'Internet and compiler: connected':'Compiler service answered with an error ('+r.status+')')}catch(e){dot(4,false,'Compiler service could not be reached. Coding section will not run until the connection works')}})();
  A.$('#b_next').onclick=()=>{A.instructions(resuming)}};
A.instructions=resuming=>{A.render(`<div class="wrap"><div class="card"><span class="tag">STEP 3 OF 3</span><h1>Instructions</h1>
  <table class="t"><tr><th>#</th><th>Section</th><th>Pattern</th></tr>${sectionsInfo.map((s,i)=>`<tr><td>${i+1}</td><td>${s[1]}</td><td>${s[2]}</td></tr>`).join('')}</table>
  <h3>Rules (same as the live test)</h3><ul><li>Sections run one after another. Each section has its own timer. When the timer ends the section is submitted automatically and you <b>cannot go back</b>.</li>
  <li>Verbal Ability is timed per item: 25 seconds per sentence-completion item, then passage recall (the passage disappears after 30 seconds; you get 90 seconds to type) and a 9-minute email.</li>
  <li>In Numerical, Reasoning and Advanced Quant + Reasoning you can move between questions of the same section, mark for review and change answers until the timer ends. Some answers are typed (TITA).</li>
  <li>There is <b>no negative marking</b>. Attempt every question.</li>
  <li>The test runs in full screen. Switching tabs or windows, leaving full screen, copy-paste, right-click and loud noise are recorded as violations and appear in your report.</li>
  <li>Your camera shows in the side panel; photos are taken every ${C.proctor.snapshotEverySec} seconds.</li><li>Do not refresh the page. If the browser closes by mistake, open the test again and choose <b>Resume</b>.</li>
  <li>The Advanced Coding section uses an online compiler (C, C++, Java, Python). Read input from standard input and print to standard output.</li></ul>
  <button class="btn gr" id="go">${resuming?'Resume the test':'I have read the instructions. Start the test'}</button></div></div>`);
  A.$('#go').onclick=async()=>{try{if(C.proctor.requireFullscreen&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen()}catch(e){A.toast('Full screen could not start; please enable it for this page.',1)}
    resuming?A.resumeExam():A.startExam()}};
A.askFS=()=>{if(document.querySelector('.modal.fs'))return;const m=document.createElement('div');m.className='modal fs';m.innerHTML='<div class="box"><h2>Return to full screen</h2><p>The test must stay in full-screen mode. Click the button to continue.</p><button class="btn">Return to full screen</button></div>';m.querySelector('button').onclick=async()=>{try{await document.documentElement.requestFullscreen()}catch(e){}m.remove()};document.body.appendChild(m)};
})(window.ATC);
