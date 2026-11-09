import re
s=open('../vp/vp.js').read()
def rep(a,b,cnt=1):
    global s
    if a not in s:
        print('MISSING',a[:90]);return
    s=s.replace(a,b,cnt)
i=s.index("(function(){");j=s.index("const SPEED=")
s=s[:i]+"window.makeVerbal=function(SG,BK,H){\nconst $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];\nconst esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));\n"+s[j:]
s=s.replace("const SPEED=Math.max(1,parseFloat((location.search.match(/[?&]speed=([\\d.]+)/)||[])[1])||1);","const SPEED=H.speed||1;")
a=s.index("/* scorm */");b=s.index("/* matching */")
s=s[:a]+"const scormReport=(p,sm)=>{if(H.report)H.report(p,sm)};\n"+s[b:]
rep("app.innerHTML=`<div class=\"top\"><span class=\"brand\">TCS NQT · Verbal Ability Practice</span>","app.innerHTML=`<div class=\"top\">${H.home?'<button class=\"btn sm sec\" id=\"arena\">← Arena</button>':''}<span class=\"brand\">TCS NQT · Verbal Ability Practice</span>")
rep("  $$('.tabs button').forEach(b=>b.onclick=()=>{clearInterval(timer);document.onkeydown=null;go(b.dataset.t)})}","  if($('#arena'))$('#arena').onclick=()=>{clearInterval(timer);document.onkeydown=null;H.home()};\n  $$('.tabs button').forEach(b=>b.onclick=()=>{clearInterval(timer);document.onkeydown=null;go(b.dataset.t)})}")
# start handler -> newEx
a=s.index("  $('#start').onclick=()=>{const gen=SG.paper(BK.sc.length?12:20);")
b=s.index("function exShell(")
s=s[:a]+"  $('#start').onclick=()=>{EX=newEx();exStep()}}\nfunction newEx(o){o=o||{};const nb=BK.sc.length?(o.bank!==undefined?o.bank:8):0;const gen=SG.paper(20-nb);const bank=nb?pickBank('sc',nb):[];const items=shuffle(gen.concat(bank)).slice(0,20).map(q=>({q,ord:shuffle(q.o.map((_,i)=>i))}));return {sc:items,scAns:{},prs:[SG.passage(),SG.passage(),SG.passage(),SG.passage()],prAns:[],em:SG.email(),emAns:'',phase:'sc',idx:0,sub:'read',cb:o.cb,label:o.label}}\nfunction runVerbal(cb,label){EX=newEx({cb,label,bank:8});exStep()}\n"+s[b:]
rep("<span class=\"brand\">Verbal Ability · Exam Mode</span>","<span class=\"brand\">${EX&&EX.label?EX.label:'Verbal Ability · Exam Mode'}</span>")
# exFinish: cb
rep("LS.set('stats',s);scormReport(overall,","LS.set('stats',s);if(!e.cb)scormReport(overall,")
rep("  shell('exam',`<div class=\"card\"><span class=\"tag\">TEST COMPLETED</span><h1>Verbal score:","  if(e.cb){e.cb({overall,sc:sc_,prAvg,es:es.pct,prs,esObj:es,e});return}\n  shell('exam',`<div class=\"card\"><span class=\"tag\">TEST COMPLETED</span><h1>Verbal score:")
a=s.index("window.VP={")
s=s[:a]+"return {home:examHome,sc:scHome,pr:prHome,em:emHome,bank:bankHome,prog:progress,runVerbal,recallResult,emailResult,stats,newEx};\n};\n"
open('verbal.js','w').write(s)
