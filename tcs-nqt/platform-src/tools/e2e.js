const {chromium}=require('playwright');const fs=require('fs');
(async()=>{
const b=await chromium.launch({args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
const ctx=await b.newContext({permissions:['camera','microphone'],viewport:{width:1280,height:800}});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push('console:'+m.text())});
await p.goto('http://127.0.0.1:8099/index.html');
await p.fill('#f_name','Test Candidate');await p.fill('#f_email','t@example.com');await p.fill('#f_mob','9876543210');await p.fill('#f_col','ABC College');
await p.check('#f_c1');await p.check('#f_c2');await p.click('#f_go');
await p.click('#b_perm');await p.waitForFunction(()=>!document.querySelector('#b_next').disabled,null,{timeout:15000});
await p.screenshot({path:'e_sys.png'});
await p.click('#b_next');await p.click('#go');
// sections 1,2,4 standard
const doStd=async(s)=>{
  console.log('section',s,new Date().toISOString().slice(17,23));await p.waitForSelector('#st');await p.click('#st');await p.waitForSelector('#qbox',{timeout:8000}).catch(async e=>{console.log('NO QBOX',await p.textContent('body').then(t=>t.slice(0,200)));throw e});
  const n=await p.evaluate(()=>document.querySelectorAll('#pal button').length);
  for(let k=0;k<n;k++){
    if(await p.$('.opt'))await p.click('.opt >> nth=0');else if(await p.$('#tita'))await p.fill('#tita','5');
    if(k%5===0)await p.click('#b_mark');else await p.click('#b_save');
  }
  if(s===1)await p.screenshot({path:'e_q1.png'});
  await p.click('#b_sub');await p.click('#y');
};
await doStd(1);await doStd(2);
// verbal
await p.waitForSelector('#st');await p.click('#st');
for(let k=0;k<20;k++){await p.waitForSelector('.opt');await p.click('.opt >> nth=1');await p.click('#nx')}
await p.waitForSelector('text=Passage Recall: how it works');await p.screenshot({path:'e_ins.png'});await p.click('#nx');
for(let k=0;k<4;k++){await p.waitForSelector('.passage, .qtext');await p.waitForSelector('#ta',{timeout:6000}).catch(async e=>{console.log('NO TA',await p.textContent('body').then(t=>t.slice(0,300)));throw e});await p.fill('#ta','The company opened a new plant in Nashik in 2026 with 450 people and 120 crore');await p.click('#nx')}
await p.waitForSelector('text=Email Writing: how it works');await p.click('#nx');
await p.waitForSelector('#ta');await p.fill('#ta','Subject: Leave request\n\nDear Mr Kulkarni,\n\nI am writing to request leave on 18 and 19 September to attend my sisters wedding in Jaipur. My teammate Isha Rao will handle my work. I would be grateful if you could approve my request. Please let me know if you need anything else from me before I leave on those days so that everything is handled.\n\nThank you for your consideration.\n\nYours sincerely,\nAman Verma');
await p.screenshot({path:'e_email.png'});await p.click('#nx');
await doStd(4);
// coding
await p.waitForSelector('#st');await p.click('#st');await p.waitForSelector('#ed');
const pid=await p.evaluate(()=>ATC.getState().sec[4].items);console.log('problems',pid);
const sols=JSON.parse(fs.readFileSync('sols.json','utf8'));
for(let k=0;k<2;k++){
  await p.click(`.ctabs button >> nth=${k}`);await p.waitForSelector('#ed');
  const id=pid[k];await p.selectOption('#lang','python');await p.fill('#ed',sols[id]);await p.dispatchEvent('#ed','input');
  await p.click('#run');await p.waitForFunction(()=>!document.querySelector('#run').disabled,null,{timeout:30000});
  await p.click('#sub');await p.waitForFunction(()=>!document.querySelector('#sub').disabled,null,{timeout:90000});
  console.log(id,await p.textContent('#out').then(t=>t.slice(0,80)));
}
await p.screenshot({path:'e_code.png'});
await p.click('#b_sub');await p.click('#y');
await p.waitForSelector('text=TEST COMPLETED',{timeout:20000});
await p.screenshot({path:'e_report.png',fullPage:true});
const info=await p.evaluate(()=>({txt:document.querySelector('.card').innerText.slice(0,500)}));
console.log(info.txt);console.log('errors',errs);
await b.close()})();
