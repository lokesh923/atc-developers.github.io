const {chromium}=require('playwright');const fs=require('fs');
const sols=JSON.parse(fs.readFileSync('../plat/sols.json','utf8'));
const MODE=process.argv[2]||'full';
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1300,height:850}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));
let j0Blocked=false,piston=0,judge=0;
await ctx.route('https://ce.judge0.com/**',async route=>{if(j0Blocked)return route.abort();judge++;const u=new URL(route.request().url());const r=await fetch('http://127.0.0.1:2358'+u.pathname+u.search,{method:route.request().method(),body:route.request().postData()||undefined,headers:{'content-type':'application/json'}});route.fulfill({status:r.status,headers:{'access-control-allow-origin':'*','content-type':'application/json'},body:await r.text()})});
await ctx.route('https://emkc.org/**',async route=>{piston++;const u=new URL(route.request().url());const path=u.pathname.replace('/api/v2/piston','');const r=await fetch('http://127.0.0.1:2358'+path,{method:route.request().method(),body:route.request().postData()||undefined,headers:{'content-type':'application/json'}});route.fulfill({status:r.status,headers:{'access-control-allow-origin':'*','content-type':'application/json'},body:await r.text()})});
await p.addInitScript(()=>{window.LOG=[];window.API={LMSInitialize:v=>{LOG.push('init');return 'true'},LMSGetValue:k=>'not attempted',LMSSetValue:(k,v)=>{LOG.push(k.split('.').pop()+'='+String(v).slice(0,70));return 'true'},LMSCommit:()=>'true',LMSFinish:()=>{LOG.push('finish');return 'true'}}});
await p.goto('file://'+process.cwd()+'/TCS_NQT_Practice_Arena.html?speed=90');
await p.waitForSelector('.hero');console.log('landing:',await p.textContent('.hero'));
console.log('mock cards',await p.$$eval('[data-mock]',e=>e.length),'| section cards',await p.$$eval('[data-sec]',e=>e.length),'| figure tests',await p.$$eval('[data-fig]',e=>e.length));
await p.screenshot({path:'a_landing.png',fullPage:true});
if(MODE==='full'){
 await p.click('[data-mock=full]');await p.waitForSelector('#c_go');await p.waitForFunction(()=>!document.querySelector('#c_go').disabled,null,{timeout:20000});
 console.log('compat checks:',(await p.$$eval('.chk',e=>e.map(x=>x.innerText.split('\n')[0]))).join(' | '));await p.screenshot({path:'a_compat.png'});
 await p.click('#c_go');
 const std=async()=>{await p.waitForSelector('#qbox');const n=await p.evaluate(()=>document.querySelectorAll('#pal button').length);for(let k=0;k<Math.min(n,3);k++){if(await p.$('.opt'))await p.click('.opt >> nth=0');else await p.fill('#tita','5');await p.click('#b_save')}await p.click('#b_sub');await p.click('#y');return n};
 for(let s=0;s<5;s++){await p.waitForSelector('#go',{timeout:30000});const title=await p.textContent('.card h1');console.log('section',s+1,title);await p.click('#go');
  if(title.includes('Verbal')){for(let k=0;k<20;k++){await p.waitForSelector('.opt',{timeout:20000});await p.click('.opt >> nth=0');await p.click('#nx')}
   await p.waitForSelector('text=Passage Recall: how it works');await p.click('#nx');for(let k=0;k<4;k++){await p.waitForSelector('#ta',{timeout:20000});await p.fill('#ta','The company opened a plant');await p.click('#nx')}
   await p.waitForSelector('text=Email Writing: how it works');await p.click('#nx');await p.waitForSelector('#ta');await p.fill('#ta','Subject: Leave request\n\nDear Sir,\n\nI am writing to request leave. Please approve my request. I will be available by phone for urgent work and my colleague will handle my tasks while I am away.\n\nThank you.\n\nYours sincerely,\nAman Verma');await p.click('#nx')}
  else if(title.includes('Coding')){await p.waitForSelector('#ed');const ids=await p.evaluate(()=>[...document.querySelectorAll('.cl h2')].map(x=>x.textContent));
   // identify problems by title via data
   const titles=await p.evaluate(()=>window.ARENA_DATA.S5.map(x=>[x.id,x.title]));
   for(let k=0;k<2;k++){await p.click(`.ctabs button >> nth=${k}`);await p.waitForSelector('#ed');const t=(await p.textContent('.cl h2')).replace(/\s*(Medium|Hard)\s*$/,'').trim();const id=titles.find(x=>x[1]===t)[0];await p.selectOption('#lang','python');await p.fill('#ed',sols[id]);await p.dispatchEvent('#ed','input');
    if(k===0){j0Blocked=true}  // first problem: force failover to Piston
    await p.click('#sub');await p.waitForFunction(()=>!document.querySelector('#sub').disabled,null,{timeout:120000});console.log('  coding',id,t,'|',(await p.textContent('#out')).slice(0,60));j0Blocked=false}
   await p.click('#fin');await p.click('#y')}
  else{const n=await std();console.log('  std section done,',n,'questions')}}
 await p.waitForSelector('text=MOCK COMPLETED',{timeout:30000});console.log('RESULT:',(await p.textContent('.big')).slice(0,60));
 console.log('table:',(await p.$$eval('.card .t:first-of-type tr',e=>e.slice(1).map(r=>r.innerText.replace(/\s+/g,' ')))).join(' || '));
 console.log('SCORM:',(await p.evaluate(()=>LOG)).filter(x=>/score|status|suspend/.test(x)).slice(-4).join(' ; '));
 console.log('judge0 requests',judge,'piston requests',piston);await p.screenshot({path:'a_result.png',fullPage:true});
 await p.click('#back');
}
// figure test + practice entries
await p.click('[data-fig=figREA]');await p.waitForSelector('#c_go');await p.waitForFunction(()=>!document.querySelector('#c_go').disabled,null,{timeout:20000});await p.click('#c_go');await p.waitForSelector('#qbox');const n=await p.evaluate(()=>document.querySelectorAll('#pal button').length);const imgs=await p.evaluate(()=>document.querySelectorAll('#qbox img').length);console.log('figure test Qs',n,'first has image',imgs>0);await p.screenshot({path:'a_fig.png'});
await p.click('#arena').catch(()=>{});
for(const k of ['NUM','REA','VER','ADV','COD']){await p.waitForSelector('.hero').catch(async()=>{await p.click('#arena')});await p.click(`[data-sec=${k}]`);await p.waitForSelector('.top');console.log('practice',k,'opens:',(await p.textContent('.top')).replace(/\s+/g,' ').slice(0,70));await p.click('#arena');}
console.log('errors',errs);await b.close()})();
