/* coding section: editor + online compiler (Judge0 CE API) */
(function(A){
const C=window.CFG,B=window.BANK,$=A.$,esc=A.esc;
const TPL={c:'#include <stdio.h>\n\nint main(void) {\n    /* read the input with scanf and print the answer with printf */\n    \n    return 0;\n}\n',
cpp:'#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    // read the input with cin and print the answer with cout\n    \n    return 0;\n}\n',
java:'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) throws IOException {\n        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));\n        // read the input and print the answer\n        \n    }\n}\n',
python:'import sys\n\ndef main():\n    data = sys.stdin.read().split()\n    # read the input from data and print the answer\n    \n\nmain()\n'};
const LN={c:'C (GCC)',cpp:'C++ (GCC)',java:'Java',python:'Python 3'};
const b64=s=>btoa(unescape(encodeURIComponent(s)));const unb=s=>{try{return s?decodeURIComponent(escape(atob(s))):''}catch(e){try{return atob(s)}catch(_){return ''}}};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function j0(path,opt){const o=Object.assign({headers:Object.assign({'Content-Type':'application/json'},C.judge0.headers)},opt||{});
  for(let k=0;k<5;k++){let r;try{r=await fetch(C.judge0.url+path,o)}catch(e){if(k===4)throw new Error('Cannot reach the compiler service. Check your internet connection.');await sleep(1200*(k+1));continue}
    if(r.status===429||r.status===503){await sleep(1500*(k+1));continue}
    if(!r.ok){const t=await r.text();throw new Error('Compiler service error '+r.status+': '+t.slice(0,120))}
    return r.json()}
  throw new Error('The compiler service is busy. Please try again in a few seconds.')}
A.runCode=async(lang,code,stdin)=>{const body={source_code:b64(code),language_id:C.judge0.langs[lang],stdin:b64(stdin||''),cpu_time_limit:C.judge0.cpuSec,memory_limit:C.judge0.memKB};
  const r=await j0('/submissions?base64_encoded=true&wait=true',{method:'POST',body:JSON.stringify(body)});
  let res=r;
  if(!res.status||res.status.id<3){for(let k=0;k<20&&(!res.status||res.status.id<3);k++){await sleep(700);res=await j0('/submissions/'+r.token+'?base64_encoded=true')}}
  return {status:res.status?res.status.id:0,desc:res.status?res.status.description:'',out:unb(res.stdout),err:unb(res.stderr),comp:unb(res.compile_output),time:res.time,mem:res.memory}};
A.sameOut=(a,b)=>String(a).trim().split(/\s+/).join(' ')===String(b).trim().split(/\s+/).join(' ');
const verdict=(r,exp)=>{if(r.status===6)return 'CE';if(r.status===5)return 'TLE';if(r.status>=7&&r.status<=12)return 'RE';if(r.status!==3)return 'ERR';return A.sameOut(r.out,exp)?'AC':'WA'};
A.codingUI=(ST,i,H)=>{const sec=ST.sec[i];sec.pi=sec.pi||0;const probs=sec.items.map(id=>B.S5.find(p=>p.id===id));
  const key=(p)=>p.id+'_'+sec.lang;const getCode=p=>sec.code[key(p)]!==undefined?sec.code[key(p)]:TPL[sec.lang];
  H.shell(`<div class="cwrap"><div class="cl" id="cl"></div><div class="cr" id="cr"></div></div>`,{foot:'<span class="sp"></span><span class="sm mut" id="cstat"></span><button class="btn rd" id="b_sub">Submit section</button>',side:'<p class="sm mut">Use <b>Run</b> to test your code on your own input. Use <b>Submit</b> to run all hidden test cases for the problem.</p>'});
  $('#b_sub').onclick=H.submitSection;
  const draw=()=>{const p=probs[sec.pi];const r=sec.res[p.id];
    $('#cl').innerHTML=`<div class="ctabs">${probs.map((x,k)=>`<button class="${k===sec.pi?'on':''}" data-k="${k}">Problem ${k+1}${sec.res[x.id]?' ✓':''}</button>`).join('')}</div><h2>${esc(p.title)} <span class="lv ${p.level}">${p.level}</span></h2><p class="sm mut">${esc(p.topic)}</p><p>${p.desc}</p><h3>Input format</h3><p>${p.infmt}</p><h3>Output format</h3><p>${p.outfmt}</p><h3>Constraints</h3><p>${p.cons}</p>${p.samples.map((s,k)=>`<h3>Sample ${k+1}</h3><div class="samp"><b>Input</b>\n${esc(s.i)}</div><div class="samp"><b>Output</b>\n${esc(s.o)}</div>`).join('')}`;
    document.querySelectorAll('.ctabs button').forEach(b=>b.onclick=()=>{sec.pi=+b.dataset.k;H.save();draw()});
    $('#cr').innerHTML=`<div style="display:flex;gap:8px;align-items:center;margin-bottom:6px"><select id="lang" style="width:auto">${Object.keys(LN).map(k=>`<option value="${k}" ${k===sec.lang?'selected':''}>${LN[k]}</option>`).join('')}</select><button class="btn sm sec" id="rst">Reset code</button><span class="sp" style="flex:1"></span><button class="btn sm sec" id="run">▶ Run</button><button class="btn sm gr" id="sub">Submit problem</button></div>
    <div class="edwrap"><div class="gut" id="gut">1</div><textarea class="ed" id="ed" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div>
    <label>Custom input for Run</label><textarea id="cin" class="ed" style="height:70px;background:#f4f6fb;color:#1b2540;border:1px solid var(--line);border-radius:8px;white-space:pre"></textarea>
    <div class="out" id="out">${r?resHTML(r):'Output will appear here.'}</div>`;
    const ed=$('#ed');ed.value=getCode(p);$('#cin').value=p.samples[0].i;
    const gut=()=>{const n=ed.value.split('\n').length;$('#gut').textContent=Array.from({length:n},(_,k)=>k+1).join('\n')};gut();
    ed.oninput=()=>{sec.code[key(p)]=ed.value;gut();H.save()};ed.onscroll=()=>{$('#gut').scrollTop=ed.scrollTop};
    ed.onkeydown=e=>{if(e.key==='Tab'){e.preventDefault();const s=ed.selectionStart;ed.value=ed.value.slice(0,s)+'    '+ed.value.slice(ed.selectionEnd);ed.selectionStart=ed.selectionEnd=s+4;ed.oninput()}};
    $('#lang').onchange=e=>{sec.lang=e.target.value;H.save();draw()};
    $('#rst').onclick=()=>{if(confirm('Reset to the starter code?')){delete sec.code[key(p)];H.save();draw()}};
    $('#run').onclick=async()=>{const o=$('#out');o.textContent='Running…';$('#run').disabled=true;try{const r=await A.runCode(sec.lang,ed.value,$('#cin').value);o.textContent=fmtRun(r)}catch(e){o.textContent=e.message}$('#run').disabled=false};
    $('#sub').onclick=async()=>{const o=$('#out');$('#sub').disabled=true;$('#run').disabled=true;const tot=p.tests.length;const vs=new Array(tot);let done=0,pass=0;
      o.textContent='Running test cases 0/'+tot+'…';
      try{let nxt=0;const worker=async()=>{while(nxt<tot){const t=nxt++;try{const r=await A.runCode(sec.lang,ed.value,p.tests[t].i);const v=verdict(r,p.tests[t].o);vs[t]={v,time:r.time,msg:v==='CE'?r.comp:v==='RE'?(r.err||r.desc):''};if(v==='AC')pass++}catch(e){vs[t]={v:'ERR',msg:e.message}}done++;o.textContent='Running test cases '+done+'/'+tot+'…'}};
        await Promise.all([worker(),worker()]);
        const prev=sec.res[p.id];const res={passed:pass,total:tot,vs,lang:sec.lang,at:Date.now()};if(!prev||pass>=prev.passed)sec.res[p.id]=res;
        H.save();o.innerHTML=resHTML(res)}catch(e){o.textContent=e.message}
      $('#sub').disabled=false;$('#run').disabled=false;const tabs=document.querySelectorAll('.ctabs button')[sec.pi];if(tabs&&!/✓/.test(tabs.textContent))tabs.textContent+=' ✓'};
  };
  const fmtRun=r=>{let s='Status: '+r.desc+(r.time?'   Time: '+r.time+'s':'')+'\n';if(r.comp)s+='\n[Compiler]\n'+r.comp;if(r.err)s+='\n[stderr]\n'+r.err;s+='\n[Output]\n'+(r.out||'(empty)');return s};
  const resHTML=r=>{const names={AC:'Passed',WA:'Wrong answer',TLE:'Time limit exceeded',RE:'Runtime error',CE:'Compilation error',ERR:'Service error'};const first=r.vs.find(v=>v&&(v.v==='CE'||v.v==='RE'));
    return `<b>${r.passed} of ${r.total} test cases passed</b> (${LN[r.lang]})<br>${r.vs.map((v,k)=>`<span class="tc ${v&&v.v==='AC'?'p':v&&(v.v==='TLE'||v.v==='ERR')?'o':'f'}" title="${v?names[v.v]:''}">#${k+1} ${v?names[v.v]:''}</span>`).join('')}${first&&first.msg?'<br><pre style="white-space:pre-wrap;margin:6px 0 0">'+esc(first.msg.slice(0,600))+'</pre>':''}`};
  draw()};
})(window.ATC);
