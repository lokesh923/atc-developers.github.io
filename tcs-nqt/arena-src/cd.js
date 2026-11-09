/* Advanced coding: problem list, editor, online compiler (Judge0 + Piston fallback), 90-minute mock section */
window.makeCoding=function(PROBS,H){
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SPEED=H.speed||1,app=()=>$('#app');
const LS={get(k,d){try{const v=localStorage.getItem('cd_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('cd_'+k,JSON.stringify(v))}catch(e){}}};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const fmt=s=>{s=Math.max(0,Math.round(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return (h?h+':':'')+String(m).padStart(h?2:1,'0')+':'+String(s%60).padStart(2,'0')};
const TPL={c:'#include <stdio.h>\n\nint main(void) {\n    /* read the input with scanf and print the answer with printf */\n    \n    return 0;\n}\n',
cpp:'#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    // read the input with cin and print the answer with cout\n    \n    return 0;\n}\n',
java:'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        // read the input and print the answer\n        \n    }\n}\n',
python:'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # read the input from data and print the answer\n    \n\nmain()\n'};
const LN={c:'C (GCC)',cpp:'C++ (GCC)',java:'Java',python:'Python 3'};
/* ---------- compiler layer ---------- */
const CF=H.compiler||{backends:[{type:'judge0',url:'https://ce.judge0.com',headers:{},langs:{c:50,cpp:54,java:62,python:71},cpuSec:5,memKB:256000},{type:'piston',url:'https://emkc.org/api/v2/piston',langs:{c:'c',cpp:'c++',java:'java',python:'python'}}]};
const b64=s=>btoa(unescape(encodeURIComponent(s)));const unb=s=>{try{return s?decodeURIComponent(escape(atob(s))):''}catch(e){try{return atob(s)}catch(_){return ''}}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let good=0;const bad={};
async function http(url,opt,tries){tries=tries||4;let last;for(let k=0;k<tries;k++){try{const ctl=new AbortController();const to=setTimeout(()=>ctl.abort(),45000);const r=await fetch(url,Object.assign({signal:ctl.signal},opt));clearTimeout(to);if(r.status===429||r.status===503||r.status===502||r.status===504){last=new Error('busy '+r.status);await sleep(1200*(k+1));continue}if(!r.ok){const t=await r.text();throw new Error('HTTP '+r.status+': '+t.slice(0,120))}return await r.json()}catch(e){last=e;if(/HTTP 4/.test(e.message))throw e;await sleep(800*(k+1))}}throw last||new Error('network')}
async function runJudge0(b,lang,code,stdin){const body={source_code:b64(code),language_id:b.langs[lang],stdin:b64(stdin||''),cpu_time_limit:b.cpuSec||5,memory_limit:b.memKB||256000};
  const h=Object.assign({'Content-Type':'application/json'},b.headers||{});let r=null;
  if(!b.nowait){try{r=await http(b.url+'/submissions?base64_encoded=true&wait=true',{method:'POST',headers:h,body:JSON.stringify(body)})}catch(e){if(/HTTP 4/.test(e.message)&&/wait/i.test(e.message))b.nowait=true;else throw e}}
  if(!r)r=await http(b.url+'/submissions?base64_encoded=true',{method:'POST',headers:h,body:JSON.stringify(body)});
  if(!r.status||r.status.id<3){const tok=r.token;for(let k=0;k<30&&(!r.status||r.status.id<3);k++){await sleep(k<3?500:900);r=await http(b.url+'/submissions/'+tok+'?base64_encoded=true',{headers:h});r.token=tok}}
  return {status:r.status?r.status.id:0,desc:r.status?r.status.description:'',out:unb(r.stdout),err:unb(r.stderr),comp:unb(r.compile_output),time:r.time,mem:r.memory}}
async function runPiston(b,lang,code,stdin){const name=lang==='java'?'Main.java':lang==='python'?'main.py':lang==='c'?'main.c':'main.cpp';
  const r=await http(b.url+'/execute',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({language:b.langs[lang],version:'*',files:[{name,content:code}],stdin:stdin||'',compile_timeout:15000,run_timeout:5000})});
  const c=r.compile,u=r.run||{};if(c&&c.code!==0&&c.code!==undefined)return {status:6,desc:'Compilation Error',out:'',err:'',comp:(c.stderr||c.output||'')};
  if(u.signal==='SIGKILL'&&!u.stdout)return {status:5,desc:'Time Limit Exceeded',out:u.stdout||'',err:u.stderr||'',comp:''};
  if(u.code!==0&&u.code!==undefined&&u.code!==null)return {status:11,desc:'Runtime Error',out:u.stdout||'',err:u.stderr||'',comp:''};
  return {status:3,desc:'Accepted',out:u.stdout||'',err:u.stderr||'',comp:''}}
async function runCode(lang,code,stdin){const order=CF.backends.map((b,i)=>i);order.sort((a,b2)=>(a===good?-1:0)-(b2===good?-1:0));let lastErr;
  for(const i of order){const b=CF.backends[i];if(bad[i]&&Date.now()-bad[i]<30000)continue;try{const r=b.type==='piston'?await runPiston(b,lang,code,stdin):await runJudge0(b,lang,code,stdin);good=i;delete bad[i];return r}catch(e){lastErr=e;if(/HTTP 4/.test(e.message)&&b.type==='judge0'&&!/429/.test(e.message)){/* auth / bad request: try next */}bad[i]=Date.now()}}
  throw new Error('The compiler service could not be reached ('+(lastErr&&lastErr.message||'network error')+'). Check your internet connection and try again.')}
async function ping(){const out=[];for(const b of CF.backends){try{await http(b.url+(b.type==='piston'?'/runtimes':'/languages'),{headers:b.headers||{}},1);out.push(b.type);}catch(e){}}return out}
const same=(a,b)=>String(a).trim().split(/\s+/).join(' ')===String(b).trim().split(/\s+/).join(' ');
const verdict=(r,exp)=>r.status===6?'CE':r.status===5?'TLE':(r.status>=7&&r.status<=12)?'RE':r.status!==3?'ERR':same(r.out,exp)?'AC':'WA';
const NAMES={AC:'Passed',WA:'Wrong answer',TLE:'Time limit exceeded',RE:'Runtime error',CE:'Compilation error',ERR:'Service error'};
/* ---------- editor view (shared by practice and mock) ---------- */
function editorView(root,p,st,opt){opt=opt||{};
  const key=()=>p.id+'_'+st.lang,get=()=>st.code[key()]!==undefined?st.code[key()]:TPL[st.lang];
  root.innerHTML=`<div class="cwrap"><div class="cl"><h2>${esc(p.title)} <span class="lv ${p.level}">${p.level}</span></h2><p class="sm mut">${esc(p.topic)}</p><p>${p.desc}</p><h3>Input format</h3><p>${p.infmt}</p><h3>Output format</h3><p>${p.outfmt}</p><h3>Constraints</h3><p>${p.cons}</p>${p.samples.map((s,k)=>`<h3>Sample ${k+1}</h3><div class="samp"><b>Input</b>\n${esc(s.i)}</div><div class="samp"><b>Output</b>\n${esc(s.o)}</div>`).join('')}</div>
  <div class="cr"><div style="display:flex;gap:8px;align-items:center;margin-bottom:6px;flex-wrap:wrap"><select id="lang" style="width:auto">${Object.keys(LN).map(k=>`<option value="${k}" ${k===st.lang?'selected':''}>${LN[k]}</option>`).join('')}</select><button class="btn sm sec" id="rst">Reset code</button><span style="flex:1"></span><button class="btn sm sec" id="run">▶ Run</button><button class="btn sm gr" id="sub">Submit</button></div>
  <div class="edwrap"><div class="gut" id="gut">1</div><textarea class="ed" id="ed" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div><label>Custom input for Run</label><textarea id="cin" class="ed cin" spellcheck="false"></textarea><div class="out" id="out">${opt.prev?resHTML(opt.prev):'Output will appear here.'}</div></div></div>`;
  const ed=$('#ed',root);ed.value=get();$('#cin',root).value=p.samples[0].i;
  const gut=()=>{const n=ed.value.split('\n').length;$('#gut',root).textContent=Array.from({length:n},(_,k)=>k+1).join('\n')};gut();
  ed.oninput=()=>{st.code[key()]=ed.value;gut();opt.save&&opt.save()};ed.onscroll=()=>{$('#gut',root).scrollTop=ed.scrollTop};
  ed.onkeydown=e=>{if(e.key==='Tab'){e.preventDefault();const s=ed.selectionStart;ed.value=ed.value.slice(0,s)+'    '+ed.value.slice(ed.selectionEnd);ed.selectionStart=ed.selectionEnd=s+4;ed.oninput()}};
  $('#lang',root).onchange=e=>{st.lang=e.target.value;opt.save&&opt.save();editorView(root,p,st,opt)};
  $('#rst',root).onclick=()=>{if(confirm('Reset to the starter code?')){delete st.code[key()];opt.save&&opt.save();editorView(root,p,st,opt)}};
  const fmtRun=r=>{let s='Status: '+r.desc+(r.time?'   Time: '+r.time+'s':'')+'\n';if(r.comp)s+='\n[Compiler]\n'+r.comp;if(r.err)s+='\n[stderr]\n'+r.err;return s+'\n[Output]\n'+(r.out||'(empty)')};
  $('#run',root).onclick=async()=>{const o=$('#out',root);o.textContent='Running…';$('#run',root).disabled=true;try{const r=await runCode(st.lang,ed.value,$('#cin',root).value);o.textContent=fmtRun(r)}catch(e){o.textContent=e.message}$('#run',root).disabled=false};
  $('#sub',root).onclick=async()=>{const o=$('#out',root);$('#sub',root).disabled=true;$('#run',root).disabled=true;const tot=p.tests.length,vs=new Array(tot);let done=0,pass=0,nxt=0;o.textContent='Running test cases 0/'+tot+'…';
    try{const worker=async()=>{while(nxt<tot){const t=nxt++;try{const r=await runCode(st.lang,ed.value,p.tests[t].i);const v=verdict(r,p.tests[t].o);vs[t]={v,time:r.time,msg:v==='CE'?r.comp:v==='RE'?(r.err||r.desc):''};if(t<2&&v!=='AC'&&v!=='CE'){vs[t].inp=p.tests[t].i;vs[t].exp=p.tests[t].o;vs[t].got=r.out}if(v==='AC')pass++}catch(e){vs[t]={v:'ERR',msg:e.message}}done++;o.textContent='Running test cases '+done+'/'+tot+'…'}};
      await Promise.all([worker(),worker(),worker()]);const res={passed:pass,total:tot,vs,lang:st.lang,at:Date.now()};o.innerHTML=resHTML(res);opt.onSubmit&&opt.onSubmit(res)}catch(e){o.textContent=e.message}
    $('#sub',root).disabled=false;$('#run',root).disabled=false}}
function resHTML(r){const first=r.vs.find(v=>v&&(v.v==='CE'||v.v==='RE'));const w=r.vs.find(v=>v&&v.inp&&v.v==='WA');
  return `<b>${r.passed} of ${r.total} test cases passed</b> (${LN[r.lang]||''})<br>${r.vs.map((v,k)=>`<span class="tc ${v&&v.v==='AC'?'p':v&&(v.v==='TLE'||v.v==='ERR')?'o':'f'}" title="${v?NAMES[v.v]:''}">#${k+1} ${v?NAMES[v.v]:''}</span>`).join('')}${first&&first.msg?'<br><pre style="white-space:pre-wrap;margin:6px 0 0">'+esc(first.msg.slice(0,700))+'</pre>':''}${w?`<br><b>First failing sample</b><pre style="white-space:pre-wrap;margin:4px 0">Input:\n${esc(w.inp)}\nExpected:\n${esc(w.exp)}\nYour output:\n${esc(w.got||'(empty)')}</pre>`:''}`}
/* ---------- shell ---------- */
function shell(inner,o){o=o||{};app().innerHTML=`<div id="shell2"><div class="top">${H.home?'<button class="btn sm sec" id="arena">← Arena</button>':''}<span class="brand">${esc(o.title||'TCS NQT · Advanced Coding Practice')}</span><span style="margin-left:auto"></span>${o.timer?'<div id="timer">--:--</div>':''}</div><div id="qarea" style="flex:1;overflow:auto;padding:16px 22px">${inner}</div>${o.foot?`<div id="foot">${o.foot}</div>`:''}</div>`;
  if($('#arena'))$('#arena').onclick=()=>{if(o.confirmLeave&&!confirm('Leave this section? Your progress in this section will be lost.'))return;clearInterval(timer);H.home()}}
let timer=null;
/* ---------- practice ---------- */
function home(){clearInterval(timer);const R=LS.get('res',{});const levels=['All','Medium','Hard'],topics=['All',...new Set(PROBS.map(p=>p.topic))];
  shell(`<div class="wrap"><div class="card"><span class="tag">ADVANCED CODING PRACTICE</span><h1>${PROBS.length} coding problems</h1><p class="mut">Write the solution in C, C++, Java or Python. Read from standard input and print to standard output. <b>Run</b> tests your code on your own input; <b>Submit</b> runs every hidden test case.</p>
  <div class="grid3"><div><label>Level</label><select id="f_l">${levels.map(l=>`<option>${l}</option>`).join('')}</select></div><div><label>Topic</label><select id="f_t">${topics.map(l=>`<option>${esc(l)}</option>`).join('')}</select></div><div><label>Show</label><select id="f_s"><option>All</option><option>Not solved</option><option>Solved</option></select></div></div></div><div id="plist" class="pgrid"></div></div>`);
  const draw=()=>{const l=$('#f_l').value,t=$('#f_t').value,s=$('#f_s').value;const list=PROBS.filter(p=>(l==='All'||p.level===l)&&(t==='All'||p.topic===t)&&(s==='All'||(s==='Solved'?R[p.id]&&R[p.id].passed===R[p.id].total:!(R[p.id]&&R[p.id].passed===R[p.id].total))));
    $('#plist').innerHTML=list.map(p=>{const r=R[p.id];const ok=r&&r.passed===r.total;return `<div class="pcard"><div><span class="lv ${p.level}">${p.level}</span> <span class="sm mut">${esc(p.topic)}</span></div><h3 style="margin:6px 0">${esc(p.title)}</h3><p class="sm mut">${r?`Best: ${r.passed}/${r.total} test cases ${ok?'<b class="ok">✓ solved</b>':''}`:'Not attempted'}</p><button class="btn sm" data-id="${p.id}">${r?'Open again':'Solve'}</button></div>`}).join('')||'<p class="mut">No problems match.</p>';
    $$('#plist button').forEach(b=>b.onclick=()=>open(b.dataset.id))};
  ['f_l','f_t','f_s'].forEach(id=>$('#'+id).onchange=draw);draw()}
function open(id){const p=PROBS.find(x=>x.id===id);const st=LS.get('st_'+id,null)||{lang:'python',code:{}};const R=LS.get('res',{});
  shell('<div id="ev"></div>',{title:'Coding · '+p.title,foot:'<button class="btn sec" id="back">« All problems</button>'});$('#back').onclick=home;
  editorView($('#ev'),p,st,{prev:R[id],save:()=>LS.set('st_'+id,st),onSubmit:res=>{const r=LS.get('res',{});if(!r[id]||res.passed>=r[id].passed){r[id]={passed:res.passed,total:res.total,lang:res.lang,at:res.at};LS.set('res',r)}}})}
/* ---------- mock section ---------- */
function pickMock(){const seen=LS.get('mock_seen',[]);const take=(lv)=>{let pool=PROBS.filter(p=>p.level===lv&&!seen.includes(p.id));if(!pool.length){pool=PROBS.filter(p=>p.level===lv);for(const p of pool){const i=seen.indexOf(p.id);if(i>=0)seen.splice(i,1)}}return pool[Math.floor(Math.random()*pool.length)]};const a=take('Medium'),b=take('Hard');LS.set('mock_seen',seen.concat([a.id,b.id]));return [a,b]}
function runMock(cb,label,minutes){const probs=pickMock();minutes=minutes||90;const sts=probs.map(()=>({lang:'python',code:{}}));const res={};let pi=0;let finished=false;const end=Date.now()+minutes*60*1000/SPEED;
  shell(`<div class="ctabs" id="ct"></div><div id="ev"></div>`,{title:label||'Advanced Coding · Mock section',timer:true,confirmLeave:true,foot:'<span class="sm mut">Run tests your code on your own input. Submit runs all hidden test cases. Your best submission counts.</span><span style="flex:1"></span><button class="btn rd" id="fin">Submit section</button>'});
  const draw=()=>{$('#ct').innerHTML=probs.map((p,k)=>`<button class="${k===pi?'on':''}" data-k="${k}">Problem ${k+1}${res[p.id]?' ✓':''}</button>`).join('');$$('#ct button').forEach(b=>b.onclick=()=>{pi=+b.dataset.k;draw()});
    const p=probs[pi];editorView($('#ev'),p,sts[pi],{prev:res[p.id],onSubmit:r=>{if(!res[p.id]||r.passed>=res[p.id].passed)res[p.id]=r;const t=$$('#ct button')[pi];if(t&&!/✓/.test(t.textContent))t.textContent+=' ✓'}})};
  const done=()=>{if(finished)return;finished=true;clearInterval(timer);const per=probs.map(p=>({p,r:res[p.id]||null,pct:res[p.id]?Math.round(100*res[p.id].passed/res[p.id].total):0}));cb({per,pct:Math.round(per.reduce((a,x)=>a+x.pct,0)/per.length),used:Math.min(minutes*60,(minutes*60*1000/SPEED-(end-Date.now()))/1000*SPEED)})};
  $('#fin').onclick=()=>{const m=document.createElement('div');m.className='modal';m.innerHTML='<div class="box"><h2>Submit this section?</h2><p>Make sure you pressed <b>Submit</b> on each problem to run all test cases. You cannot return to this section.</p><button class="btn rd" id="y">Yes, submit section</button> <button class="btn sec" id="n">Go back</button></div>';document.body.appendChild(m);$('#n',m).onclick=()=>m.remove();$('#y',m).onclick=()=>{m.remove();done()}};
  draw();clearInterval(timer);timer=setInterval(()=>{const left=(end-Date.now())/1000*SPEED;const t=$('#timer');if(t){t.textContent=fmt(left);t.className=left<=300?'low':''}if(left<=0){clearInterval(timer);done()}},250)}
return {home,runMock,runCode,ping,PROBS,LS,resHTML};
};
