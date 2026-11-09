import re
s=open('../rp/eng.js').read()
def rep(a,b,cnt=1):
    global s
    if a not in s:
        print('MISSING',a[:80]);return
    s=s.replace(a,b,cnt)
i=s.index("(function(){");j=s.index("const SPEED=")
s=s[:i]+"window.makePractice=function(PC,NG,BANK,H){\nconst $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];\nconst esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));\n"+s[j:]
s=re.sub(r"const SPEED=.*\n","const SPEED=H.speed||1;\n",s,1)
a=s.index("/* ---------- SCORM 1.2 ---------- */");b=s.index("/* ---------- stats ---------- */")
s=s[:a]+"const scormReport=(p,sm)=>{if(H.report)H.report(p,sm)};\n"+s[b:]
rep("app.innerHTML=`<div class=\"top\"><span class=\"brand\">TCS NQT · ${PC.title} Practice</span>","app.innerHTML=`<div class=\"top\">${H.home?'<button class=\"btn sm sec\" id=\"arena\">← Arena</button>':''}<span class=\"brand\">TCS NQT · ${PC.title} Practice</span>")
rep("  $$('.tabs button').forEach(b=>b.onclick=()=>{clearInterval(timer);go(b.dataset.t)})}","  if($('#arena'))$('#arena').onclick=()=>{clearInterval(timer);document.onkeydown=null;H.home()};\n  $$('.tabs button').forEach(b=>b.onclick=()=>{clearInterval(timer);document.onkeydown=null;go(b.dataset.t)})}")
a=s.index("function startExam(){");b=s.index("function examUI(){")
s=s[:a]+"""function makePaper(o){o=o||{};const g=o.gen!==undefined?o.gen:PC.gen,bi=o.bimg!==undefined?o.bimg:PC.bimg,ba=o.bany!==undefined?o.bany:PC.bany;const gen=g>0?NG.paper(g):[];const bank=BANK.length?pickBank(bi,'All',true).concat(pickBank(ba,'All')):[];return shuffle(gen.concat(bank)).map(norm)}
function figurePaper(n){return pickBank(n,'All',true).map(norm)}
function startExam(){runPaper(makePaper().slice(0,PC.n),PC.min,{})}
function runPaper(items,minutes,o){o=o||{};EX={items,ans:{},mark:{},vis:{},pos:0,min:minutes,n:items.length,cb:o.cb,label:o.label,end:Date.now()+minutes*60*1000/SPEED,start:Date.now()};examUI()}
"""+s[b:]
a=s.index("function examUI(){");b=s.index("/* ---------- PRACTICE ENGINE")
seg=s[a:b]
seg=seg.replace("PC.min","EX.min").replace("PC.n","EX.n").replace("<span class=\"brand\">${PC.title} · Exam Mode</span>","<span class=\"brand\">${EX.label||(PC.title+' · Exam Mode')}</span>")
seg=seg.replace("  scormReport(p,PC.tag","  if(!sec.cb)scormReport(p,PC.tag")
seg=seg.replace("  shell('exam',`<div class=\"card\"><span class=\"tag\">TEST COMPLETED</span>","  if(sec.cb){sec.cb({c,n:sec.n,p,used,topics:tl,att,items:sec.items,ans:sec.ans});return}\n  shell('exam',`<div class=\"card\"><span class=\"tag\">TEST COMPLETED</span>")
s=s[:a]+seg+s[b:]
a=s.index("window.NP={")
s=s[:a]+"return {home:examHome,unl:unlHome,bank:bankHome,prog:progress,makePaper,runPaper,figurePaper,hasImg,BANK,stats,PC};\n};\n"
open('practice.js','w').write(s)
print('hasImg count',s.count('hasImg'))
