/* Unlimited reasoning generators (answers computed or brute-forced) */
(function(G){
const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[ri(0,a.length-1)],shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),F=[],add=(id,t,d,gen)=>F.push({id,t,d,gen});
const AL='ABCDEFGHIJKLMNOPQRSTUVWXYZ',pos=c=>AL.indexOf(c)+1,ch=p=>AL[((p-1)%26+26)%26];
const mk=(t,d,q,ok,wrong,e,o)=>{const opts=[String(ok)];wrong.forEach(w=>{w=String(w);if(!opts.includes(w))opts.push(w)});if(opts.length<4)return null;const sh=o&&o.keep?opts.slice(0,4):shuffle(opts.slice(0,4));return {t,d,ty:'mcq',q,o:sh,a:sh.indexOf(String(ok)),e}};
const NAMES=['Amit','Riya','Karan','Neha','Rahul','Sita','Vikram','Pooja','Arjun','Meera','Sanjay','Divya','Anil','Kavya','Imran','Tara'];
const uniq=(n)=>shuffle(NAMES).slice(0,n);
/* ---------- series ---------- */
const nextPrime=n=>{let x=n+1;for(;;x++){let p=x>1;for(let i=2;i*i<=x;i++)if(x%i===0)p=false;if(p)return x}};
add('series','Number Series',1,()=>{const k=ri(0,7);let f,desc,len=6;
  if(k===0){const a=ri(2,20),d=ri(2,9);f=i=>a+i*d;desc=`add ${d} each time`}
  else if(k===1){const a=ri(1,4),r=ri(2,3);f=i=>a*Math.pow(r,i);desc=`multiply by ${r} each time`;len=5}
  else if(k===2){const c=ri(0,6),s=ri(2,6);f=i=>(s+i)*(s+i)+c;desc=`squares of consecutive numbers${c?' plus '+c:''}`}
  else if(k===3){const c=ri(-3,3),s=ri(1,5);f=i=>Math.pow(s+i,3)+c;desc=`cubes of consecutive numbers${c?(c>0?' plus ':' minus ')+Math.abs(c):''}`;len=5}
  else if(k===4){const a=ri(1,10),d0=ri(1,4),inc=ri(1,3);f=i=>a+i*d0+inc*i*(i-1)/2;desc=`differences increase by ${inc} each step (${d0}, ${d0+inc}, ${d0+2*inc}, …)`}
  else if(k===5){const a=ri(1,6),b=ri(1,6);f=i=>(i%2===0?a+Math.floor(i/2)*ri(2,2)*3:b+Math.floor(i/2)*5);const aa=a,bb=b;f=i=>(i%2===0?aa+(i/2)*3:bb+((i-1)/2)*5);desc='two alternate series: add 3 to the 1st, 3rd, 5th terms and add 5 to the 2nd, 4th terms'}
  else if(k===6){const m=ri(2,3),c=ri(1,5),a=ri(1,4);f=i=>{let x=a;for(let j=0;j<i;j++)x=x*m+c;return x};desc=`multiply by ${m} and add ${c}`;len=5}
  else{const a=ri(1,6),b=ri(1,6);f=i=>{let x=a,y=b;for(let j=0;j<i;j++){[x,y]=[y,x+y]}return x};desc='each term is the sum of the previous two terms'}
  const t=[...Array(len)].map((_,i)=>f(i)),ans=f(len);if(t.some(x=>Math.abs(x)>5000)||ans>8000)return null;
  return mk('Number Series',1,`Find the next number in the series: ${t.join(', ')}, ?`,ans,[ans+ri(1,4),ans-ri(1,5),ans+ri(5,12),ans*2-t[len-1]],`Pattern: ${desc}. Next term = ${ans}.`)});
add('wrong_no','Number Series',2,()=>{const k=ri(0,2);let f;if(k===0){const a=ri(2,15),d=ri(3,9);f=i=>a+i*d}else if(k===1){const a=ri(1,3),r=2;f=i=>a*Math.pow(r,i)}else{const s=ri(2,6);f=i=>(s+i)*(s+i)}
  const t=[...Array(7)].map((_,i)=>f(i));const w=ri(2,4),bad=t[w]+pick([-3,-2,2,3,4]);const shown=t.map((x,i)=>i===w?bad:x);if(bad===t[w])return null;
  return mk('Number Series',2,`One number in the series is wrong. Find it: ${shown.join(', ')}.`,bad,[t[w-1],t[w+1],shown[1]===bad?shown[0]:shown[1]].map(x=>x===bad?x+1:x).concat([shown[6]]),`The pattern gives ${t[w]} at this position, but the series shows ${bad}.`)});
add('alpha_ser','Alphabet Series',1,()=>{const p0=ri(1,8),st=ri(1,4),len=5;const k=ri(0,2);let terms,ans,desc;
  if(k===0){terms=[...Array(len)].map((_,i)=>ch(p0+i*st));ans=ch(p0+len*st);desc=`each letter moves ${st} step${st>1?'s':''} forward`}
  else if(k===1){const st2=st+ri(1,2);terms=[];let p=p0;for(let i=0;i<len;i++){terms.push(ch(p));p+=i%2===0?st:st2}ans=ch(p);desc=`alternately ${st} and ${st2} steps forward`}
  else{terms=[...Array(len)].map((_,i)=>ch(26-p0-i*st));ans=ch(26-p0-len*st);desc=`each letter moves ${st} step${st>1?'s':''} backward`}
  return mk('Alphabet Series',1,`Find the next letter in the series: ${terms.join(', ')}, ?`,ans,[ch(pos(ans)+1),ch(pos(ans)-1),ch(pos(ans)+2),ch(pos(ans)-2)],`Pattern: ${desc}. Next letter = ${ans}.`)});
add('opp_letter','Alphabet Test',1,()=>{const c=ch(ri(1,26));const o=ch(27-pos(c)),k=ri(0,2);
  if(k===0)return mk('Alphabet Test',1,`Which letter is exactly opposite to ${c} in the alphabet (A↔Z, B↔Y, …)?`,o,[ch(pos(c)+1),ch(pos(c)-1),ch(pos(o)+1)],`Position of ${c} = ${pos(c)}. Opposite position = 27 − ${pos(c)} = ${27-pos(c)}, which is ${o}.`);
  const n=ri(2,6),p=ri(1,12);const from=ch(p),ans=ch(p+n);return mk('Alphabet Test',1,`Which letter is the ${n}th to the right of ${from} in the alphabet?`,ans,[ch(p+n+1),ch(p+n-1),ch(p-n)],`${from} = ${p}. ${p} + ${n} = ${p+n}, the letter ${ans}.`)});
/* ---------- coding ---------- */
const WORDS=['TABLE','HOUSE','PLANT','RIVER','MOUSE','CLOUD','BRAIN','STONE','WATER','LIGHT','PAPER','NORTH','SMILE','MUSIC','TRAIN','FIELD'];
add('code_shift','Coding-Decoding',2,()=>{const k=ri(1,4),dir=Math.random()<.5?1:-1,w1=pick(WORDS),w2=pick(WORDS.filter(x=>x!==w1));const enc=w=>[...w].map(c=>ch(pos(c)+dir*k)).join('');
  return mk('Coding-Decoding',2,`In a certain code language, ${w1} is written as ${enc(w1)}. How will ${w2} be written in that code?`,enc(w2),[[...w2].map(c=>ch(pos(c)+dir*(k+1))).join(''),[...w2].map(c=>ch(pos(c)-dir*k)).join(''),[...w2].map(c=>ch(pos(c)+dir*k+(pos(c)%2?1:0))).join('')],`Each letter is moved ${k} step${k>1?'s':''} ${dir>0?'forward':'backward'} (${w1[0]}→${enc(w1)[0]}). Apply the same to ${w2}: ${enc(w2)}.`)});
add('code_val','Coding-Decoding',1,()=>{const w=pick(WORDS),s=[...w].reduce((a,c)=>a+pos(c),0);
  return mk('Coding-Decoding',1,`If A = 1, B = 2, C = 3, … Z = 26, what is the sum of the values of the letters of the word ${w}?`,s,[s+1,s-2,s+3,s+7],`${[...w].map(c=>c+'='+pos(c)).join(', ')}. Sum = ${s}.`)});
add('code_stmt','Coding-Decoding',3,()=>{const ws=shuffle(['pen','book','car','tree','star','lamp','moon','door','bird','rose']).slice(0,6),cs=shuffle(['za','ky','mu','ob','tx','ph','ni','ev','ld','rs']).slice(0,6);const m={};ws.forEach((w,i)=>m[w]=cs[i]);
  const s1=[ws[0],ws[1],ws[2]],s2=[ws[0],ws[3],ws[4]],s3=[ws[2],ws[4],ws[5]];const code=s=>shuffle(s.map(w=>m[w])).join(' ');const ask=ws[ri(0,1)===0?0:2];
  const c1=code(s1),c2=code(s2),c3=code(s3);let ans,e;
  if(ask===ws[0]){ans=m[ws[0]];e=`${ws[0]} is common to statements 1 and 2; the code common to both is ${ans}.`}else{ans=m[ws[2]];e=`${ws[2]} is common to statements 1 and 3; the code common to both is ${ans}.`}
  const inter=(a,b)=>a.split(' ').filter(x=>b.split(' ').includes(x));const chk=ask===ws[0]?inter(c1,c2):inter(c1,c3);if(chk.length!==1||chk[0]!==ans)return null;
  return mk('Coding-Decoding',3,`In a certain code, "${s1.join(' ')}" is written as "${c1}", "${s2.join(' ')}" is written as "${c2}" and "${s3.join(' ')}" is written as "${c3}". What is the code for "${ask}"?`,ans,cs.filter(x=>x!==ans).slice(0,3),e)});
/* ---------- blood relations (family tree) ---------- */
function family(){const nm=uniq(11);let i=0;const P=(g)=>({n:nm[i++],g,par:[],sp:null});
  const gf=P('M'),gm=P('F');gf.sp=gm;gm.sp=gf;const k1=P('M'),k2=P('F'),k3=P('M');[k1,k2,k3].forEach(k=>k.par=[gf,gm]);const s1=P('F'),s2=P('M');k1.sp=s1;s1.sp=k1;k2.sp=s2;s2.sp=k2;
  const c1=P(pick(['M','F'])),c2=P(pick(['M','F'])),c3=P(pick(['M','F']));c1.par=[k1,s1];c2.par=[k2,s2];c3.par=[k1,s1];return [gf,gm,k1,k2,k3,s1,s2,c1,c2,c3]}
const isPar=(a,b)=>b.par.includes(a),sib=(a,b)=>a!==b&&a.par.length&&a.par[0]===b.par[0];
function relWord(x,y){// what x is to y
  const g=x.g==='M';
  if(isPar(x,y))return g?'father':'mother';if(isPar(y,x))return g?'son':'daughter';
  if(x.sp===y)return g?'husband':'wife';if(sib(x,y))return g?'brother':'sister';
  if(y.par.some(p=>isPar(x,p)))return g?'grandfather':'grandmother';if(x.par.some(p=>isPar(y,p)))return g?'grandson':'granddaughter';
  if(y.par.some(p=>sib(x,p)))return g?'uncle':'aunt';if(x.par.some(p=>sib(y,p)))return g?'nephew':'niece';
  if(y.par.some(p=>p.sp&&sib(x,p.sp)))return g?'uncle':'aunt';
  if(x.par.some(a=>y.par.some(b=>sib(a,b))))return 'cousin';
  return null}
add('blood','Blood Relations',2,()=>{const fam=family();const edges=(a)=>{const o=[];fam.forEach(b=>{if(b===a)return;if(isPar(a,b)||isPar(b,a)||sib(a,b)||a.sp===b)o.push(b)});return o};
  const x=pick(fam),y=pick(fam);if(x===y)return null;const ans=relWord(x,y);if(!ans)return null;
  // shortest path via BFS over direct edges
  const prev=new Map([[x,null]]);const q=[x];while(q.length){const a=q.shift();if(a===y)break;edges(a).forEach(b=>{if(!prev.has(b)){prev.set(b,a);q.push(b)}})}
  if(!prev.has(y))return null;const path=[];for(let c=y;c;c=prev.get(c))path.unshift(c);if(path.length<3||path.length>5)return null;
  const stm=path.slice(0,-1).map((a,i)=>{const b=path[i+1];const w=relWord(a,b);return `${a.n} is the ${w} of ${b.n}.`});
  // statements must be direct relations only
  if(path.slice(0,-1).some((a,i)=>!['father','mother','son','daughter','brother','sister','husband','wife'].includes(relWord(a,path[i+1]))))return null;
  const ALL=['father','mother','son','daughter','brother','sister','uncle','aunt','nephew','niece','cousin','grandfather','grandmother','grandson','granddaughter','husband','wife'];
  const cap=s=>s[0].toUpperCase()+s.slice(1);const wr=shuffle(ALL.filter(w=>w!==ans)).slice(0,3);
  return mk('Blood Relations',2,`${stm.join(' ')} How is ${x.n} related to ${y.n}?`,cap(ans),wr.map(cap),`Following the chain: ${path.map(p=>p.n).join(' → ')}. ${x.n} is the ${ans} of ${y.n}.`)});
/* ---------- directions ---------- */
const DIRS=['North','East','South','West'];
function walk(){const moves=[];let d=0,x=0,y=0;const n=ri(3,5);const out=[];let t=`A man starts from a point and walks ${(()=>{const l=ri(3,12)*(Math.random()<.5?1:2);moves.push(l);x+=0;y+=l;return l})()} m towards the North`;
  for(let i=1;i<n;i++){const turn=pick(['left','right']);d=(d+(turn==='right'?1:3))%4;const l=ri(2,14);if(d===0)y+=l;else if(d===1)x+=l;else if(d===2)y-=l;else x-=l;t+=`, turns ${turn} and walks ${l} m`}
  return {t,x,y,d}}
add('direction','Direction Sense',2,()=>{for(let i=0;i<200;i++){const w=walk();const dist=Math.sqrt(w.x*w.x+w.y*w.y);if(w.x===0&&w.y===0)continue;const k=ri(0,1);
    if(k===0){if(!Number.isInteger(dist))continue;const ans=dist;return mk('Direction Sense',2,`${w.t}. How far is he from the starting point?`,ans+' m',[ans+2+' m',ans+5+' m',Math.abs(w.x)+Math.abs(w.y)+' m',Math.max(1,ans-3)+' m'].filter(v=>v!==ans+' m'),`Net East-West = ${w.x}, net North-South = ${w.y}. Distance = √(${w.x}² + ${w.y}²) = ${ans} m.`)}
    const ns=w.y>0?'North':w.y<0?'South':'',ew=w.x>0?'East':w.x<0?'West':'';const dirn=(ns&&ew)?ns+'-'+ew:(ns||ew);const all=['North','South','East','West','North-East','North-West','South-East','South-West'];
    return mk('Direction Sense',2,`${w.t}. In which direction is he from the starting point?`,dirn,shuffle(all.filter(x=>x!==dirn)).slice(0,3),`Net movement: ${Math.abs(w.x)} m ${w.x>=0?'East':'West'} and ${Math.abs(w.y)} m ${w.y>=0?'North':'South'}. So he is in the ${dirn} of the start.`)}return null});
add('facing','Direction Sense',1,()=>{const d0=ri(0,3),turns=ri(2,4);let d=d0;const parts=[];let deg=0;for(let i=0;i<turns;i++){const a=pick([90,180,270]);const cw=Math.random()<.5;deg+=cw?a:-a;parts.push(`${a}° ${cw?'clockwise':'anticlockwise'}`)}
  const fin=(((d0*90+deg)%360)+360)%360/90;const ans=DIRS[fin];return mk('Direction Sense',1,`A man is facing ${DIRS[d0]}. He turns ${parts.join(', then ')}. In which direction is he facing now?`,ans,DIRS.filter(x=>x!==ans),`Total turn = ${deg}° (clockwise positive) from ${DIRS[d0]}, so the final direction is ${ans}.`)});
/* ---------- clock & calendar ---------- */
add('clock_angle','Clock',2,()=>{const H=ri(1,12),M=ri(0,11)*5;let ang=Math.abs(30*(H%12)-5.5*M);if(ang>180)ang=360-ang;
  const hh=(H%12)*30+M*0.5,mm=M*6;let a2=Math.abs(hh-mm);if(a2>180)a2=360-a2;if(Math.abs(a2-ang)>1e-9)return null;
  return mk('Clock',2,`What is the angle between the hour hand and the minute hand of a clock at ${H}:${String(M).padStart(2,'0')}?`,ang+'°',[ang+15+'°',Math.abs(ang-15)+'°',(360-ang)%360+'°',ang+30+'°'],`Angle = |30H − 5.5M| = |30 × ${H} − 5.5 × ${M}| = ${Math.abs(30*H-5.5*M)}°${Math.abs(30*H-5.5*M)>180?', taking 360° minus this':''} = ${ang}°.`)});
add('clock_mirror','Clock',2,()=>{const H=ri(1,11),M=ri(1,59);const t=H*60+M;const mir=720-t;const mh=Math.floor(mir/60),mm=mir%60;const f=(h,m)=>`${h===0?12:h}:${String(m).padStart(2,'0')}`;
  return mk('Clock',2,`What is the mirror image of the time ${f(H,M)} on a clock?`,f(mh,mm),[f((mh+1)%12,mm),f(mh,(mm+5)%60),f(11-H===0?12:11-H,M),f(H,60-M===60?0:60-M)],`Mirror image = 11:60 − ${f(H,M)} = ${f(mh,mm)}.`)});
add('clock_overlap','Clock',3,()=>{const H=ri(1,10);const mins=60*H/11;const whole=Math.floor(mins),rem=60*H-11*whole;const g=gcd(rem,11);const fr=rem===0?'':` ${rem/g}/${11/g}`;const ans=`${H}:${String(whole).padStart(2,'0')}${fr?fr:''}`;
  if(rem===0)return null;const w=(a,b)=>`${a}:${String(b).padStart(2,'0')}${rem===0?'':` ${(rem+1)%11||1}/11`}`;
  return mk('Clock',3,`At what time between ${H} o'clock and ${H+1} o'clock will the hands of a clock overlap?`,`${whole} ${rem/g}/${11/g} minutes past ${H}`,[`${whole+1} ${rem/g}/${11/g} minutes past ${H}`,`${whole} minutes past ${H}`,`${Math.max(0,whole-2)} ${rem/g}/${11/g} minutes past ${H}`],`The hands overlap at 60H/11 minutes past H = 60×${H}/11 = ${whole} ${rem/g}/${11/g} minutes.`)});
add('calendar','Calendar',2,()=>{const y=ri(2023,2032),m=ri(0,11),d=ri(1,28);const dt=new Date(Date.UTC(y,m,d));const dy=ri(1,3),yy=y+dy;const dt2=new Date(Date.UTC(yy,m,d));const DN=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const odd=(dt2-dt)/86400000%7;if(Math.round((dt2-dt)/86400000)%7!==odd)return null;const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];const a=DN[dt.getUTCDay()],b=DN[dt2.getUTCDay()];
  return mk('Calendar',2,`If ${d} ${MN[m]} ${y} falls on a ${a}, on which day of the week will ${d} ${MN[m]} ${yy} fall?`,b,DN.filter(x=>x!==b).slice(0,3),`Days between = ${Math.round((dt2-dt)/86400000)} = ${Math.floor(Math.round((dt2-dt)/86400000)/7)} weeks + ${odd} odd day(s). ${a} + ${odd} = ${b}.`)});
add('leapyear','Calendar',1,()=>{const y=ri(1,3)*100+pick([0,0,4,8]);const leap=(y%4===0&&y%100!==0)||y%400===0;const yr=pick([1600,1700,1800,1900,2000,2100,2400,2500,2024,2028,2032,2100,2200,2300]);const L=(yr%4===0&&yr%100!==0)||yr%400===0;
  return mk('Calendar',1,`Which of the following statements is correct about the year ${yr}?`,L?`${yr} is a leap year`:`${yr} is not a leap year`,[L?`${yr} is not a leap year`:`${yr} is a leap year`,`${yr} has 365 days and 29 February`,`${yr} has 52 weeks exactly`],`A year is a leap year if it is divisible by 4, but a century year must be divisible by 400. So ${yr} ${L?'is':'is not'} a leap year.`)});
/* ---------- ranking ---------- */
add('rank','Ranking',1,()=>{const n=ri(20,60),a=ri(3,n-3);const b=n-a+1,k=ri(0,2);
  if(k===0)return mk('Ranking',1,`In a class of ${n} students, Ravi's rank from the top is ${a}. What is his rank from the bottom?`,b,[b+1,b-1,n-a,n+a],`Rank from bottom = ${n} − ${a} + 1 = ${b}.`);
  if(k===1){const c=ri(2,12);return mk('Ranking',1,`Ravi is ${a}th from the top and ${c}th from the bottom in a row. How many people are there in the row?`,a+c-1,[a+c,a+c-2,a+c+1,a*c],`Total = ${a} + ${c} − 1 = ${a+c-1}.`)}
  const p=ri(3,15),q=p+ri(4,15);return mk('Ranking',2,`In a queue, A is ${p}th from the front and B is ${q}th from the front. How many people are between A and B?`,q-p-1,[q-p,q-p+1,q-p-2,q+p],`Between = ${q} − ${p} − 1 = ${q-p-1}.`)});
/* ---------- inequality ---------- */
const OPS=['>','≥','=','<','≤'];
function holds(op,a,b){return op==='>'?a>b:op==='≥'?a>=b:op==='='?a===b:op==='<'?a<b:a<=b}
add('inequality','Inequality',3,()=>{const V=['P','Q','R','S','T'];const ops=[pick(OPS),pick(OPS),pick(OPS),pick(OPS)];const stmt=V.map((v,i)=>i<4?`${v} ${ops[i]}`:v).join(' ');
  const sols=[];for(let a=1;a<=5;a++)for(let b=1;b<=5;b++)for(let c=1;c<=5;c++)for(let d=1;d<=5;d++)for(let e=1;e<=5;e++){const v=[a,b,c,d,e];if(ops.every((o,i)=>holds(o,v[i],v[i+1])))sols.push(v)}
  if(sols.length<20)return null;const concl=[];for(let i=0;i<5;i++)for(let j=0;j<5;j++)if(i!==j)for(const o of ['>','≥','=','<','≤']){const def=sols.every(s=>holds(o,s[i],s[j]));concl.push({t:`${V[i]} ${o} ${V[j]}`,def})}
  const yes=concl.filter(c=>c.def),no=concl.filter(c=>!c.def);if(!yes.length)return null;
  // choose one definitely-true conclusion that is not implied trivially by symmetric duplicates; ensure the three wrong ones are not definite
  const ok=pick(yes);const wrong=shuffle(no).slice(0,3);if(wrong.length<3)return null;
  return mk('Inequality',3,`In the statement ${stmt}, which of the following conclusions is definitely true?`,ok.t,wrong.map(w=>w.t),`Combine only like-direction signs through the chain ${stmt}. ${ok.t} follows in every case; the other options can fail for some values.`)});
/* ---------- syllogism ---------- */
const NOUNS=[['pens','books','tables','chairs'],['cats','dogs','birds','fish'],['doctors','engineers','teachers','artists'],['roses','flowers','trees','leaves'],['cars','buses','trucks','vehicles']];
const reg=[...Array(8)].map((_,i)=>[(i>>2)&1,(i>>1)&1,i&1]);
const holdsS=(st,m)=>{const [t,x,y]=st;const ne=f=>m.some((b,i)=>b&&f(reg[i]));if(t==='all')return !ne(r=>r[x]&&!r[y]);if(t==='some')return ne(r=>r[x]&&r[y]);if(t==='no')return !ne(r=>r[x]&&r[y]);return ne(r=>r[x]&&!r[y])};
const models=[];for(let b=0;b<256;b++)models.push([...Array(8)].map((_,i)=>(b>>i)&1));
const ST=(t,a,b)=>({all:`All ${a} are ${b}.`,some:`Some ${a} are ${b}.`,no:`No ${a} are ${b}.`,somenot:`Some ${a} are not ${b}.`}[t]);
add('syllo','Syllogism',3,()=>{const ns=shuffle(pick(NOUNS)).slice(0,3);const T=['all','some','no','somenot'];const p1=[pick(T),0,1],p2=[pick(T),1,2];
  const valid=models.filter(m=>holdsS(p1,m)&&holdsS(p2,m));const mkC=()=>[pick(T),pick([0,2]),0];const c1=(()=>{const x=pick([0,2]);return [pick(T),x,x===0?2:0]})(),c2=(()=>{const x=pick([0,2]);return [pick(T),x,x===0?2:0]})();if(c1[0]===c2[0]&&c1[1]===c2[1])return null;
  const f=c=>valid.every(m=>holdsS(c,m));const f1=f(c1),f2=f(c2);const either=!f1&&!f2&&valid.every(m=>holdsS(c1,m)||holdsS(c2,m));
  const ans=f1&&f2?'Both I and II follow':f1?'Only I follows':f2?'Only II follows':either?'Either I or II follows':'Neither I nor II follows';
  const opts=['Only I follows','Only II follows','Either I or II follows','Neither I nor II follows','Both I and II follow'];
  const txt=c=>ST(c[0],ns[c[1]],ns[c[2]]).replace(/\.$/,'');
  return {t:'Syllogism',d:3,ty:'mcq',q:`Statements: ${ST(p1[0],ns[0],ns[1])} ${ST(p2[0],ns[1],ns[2])}\nConclusions: I. ${txt(c1)}. II. ${txt(c2)}.\nWhich of the conclusions follows?`,o:opts,a:opts.indexOf(ans),e:`Draw the Venn diagrams for the statements and test each conclusion in every possible diagram. A conclusion follows only if it is true in all of them. Result: ${ans}.`}});
/* ---------- permutation puzzles (seating / floors) ---------- */
function permSolutions(n,cons){const out=[];const a=[...Array(n).keys()];const rec=(p,used)=>{if(p.length===n){if(cons.every(c=>c(p)))out.push(p.slice());return}for(let i=0;i<n;i++)if(!used[i]){used[i]=1;p.push(i);rec(p,used);p.pop();used[i]=0}};rec([],[]);return out}
function build(n,gens,cons0){const cons=cons0?cons0.slice():[],clues=[];let prev=permSolutions(n,cons).length;for(let i=0;i<80;i++){const g=pick(gens)();if(!g||clues.includes(g.t))continue;const sl=permSolutions(n,cons.concat([g.c])).length;if(sl===0)return null;if(sl===prev)continue;cons.push(g.c);clues.push(g.t);prev=sl;if(sl===1)break}return prev===1&&clues.length<=8?{cons,clues}:null}
function linear(n){const names=uniq(n);let target=shuffle([...Array(n).keys()]);// target[i]=person at position i
  const posOf=p=>target.indexOf(p);const clues=[];const gens=[()=>{const p=ri(0,n-1);const pp=posOf(p);if(pp===0)return {t:`${names[p]} sits at the extreme left end.`,c:s=>s[0]===p};if(pp===n-1)return {t:`${names[p]} sits at the extreme right end.`,c:s=>s[n-1]===p};return null},
    ()=>{const p=ri(0,n-1),q=ri(0,n-1);if(p===q)return null;if(posOf(q)===posOf(p)+1)return {t:`${names[q]} sits immediately to the right of ${names[p]}.`,c:s=>s.indexOf(q)===s.indexOf(p)+1};return null},
    ()=>{const p=ri(0,n-1),q=ri(0,n-1),r=ri(0,n-1);if(new Set([p,q,r]).size<3)return null;const a=posOf(p),b=posOf(q),c=posOf(r);if(Math.min(a,c)<b&&b<Math.max(a,c))return {t:`${names[q]} sits somewhere between ${names[p]} and ${names[r]}.`,c:s=>{const a=s.indexOf(p),b=s.indexOf(q),c=s.indexOf(r);return Math.min(a,c)<b&&b<Math.max(a,c)}};return null},
    ()=>{const p=ri(0,n-1),q=ri(0,n-1);if(p===q)return null;const d=Math.abs(posOf(p)-posOf(q));if(d>1)return {t:`${names[p]} and ${names[q]} do not sit next to each other.`,c:s=>Math.abs(s.indexOf(p)-s.indexOf(q))>1};return null},
    ()=>{const p=ri(0,n-1),k=posOf(p)+1;return {t:`${names[p]} sits ${k}${['st','nd','rd'][k-1]||'th'} from the left end.`,c:s=>s.indexOf(p)===k-1}}];
  const B=build(n,gens);if(!B)return null;const sols=permSolutions(n,B.cons);if(sols.length!==1)return null;return {names,target:sols[0],clues:B.clues}}
add('seat_lin','Seating Arrangement',3,()=>{const n=pick([5,6]);const L=linear(n);if(!L)return null;const t=L.target;const k=ri(0,2);const who=(i)=>L.names[t[i]];
  const idx=k===0?Math.floor(n/2):k===1?0:n-1;const nm0=who(idx);if(L.clues.some(c=>c.startsWith(nm0+' sits')&&/(extreme|from the left end)/.test(c)))return null;const lab=k===0?`in the ${n===5?'middle':'3rd position from the left'}`:k===1?'at the extreme left end':'at the extreme right end';
  return mk('Seating Arrangement',3,`${n} friends ${L.names.join(', ')} sit in a row facing North. ${L.clues.join(' ')}\nWho sits ${lab}?`,who(idx),L.names.filter(x=>x!==who(idx)).slice(0,3),`Placing the clues gives the unique order (left to right): ${t.map(i=>L.names[i]).join(', ')}. So ${who(idx)} sits ${lab}.`)});
function floors(n){const names=uniq(n);const target=shuffle([...Array(n).keys()]);// target[f]=person on floor f (0=ground)
  const fl=p=>target.indexOf(p);const gens=[()=>{const p=ri(0,n-1);if(fl(p)===n-1)return {t:`${names[p]} lives on the top floor.`,c:s=>s.indexOf(p)===n-1};if(fl(p)===0)return {t:`${names[p]} lives on the ground floor.`,c:s=>s.indexOf(p)===0};return null},
    ()=>{const p=ri(0,n-1),q=ri(0,n-1);if(p===q)return null;if(fl(p)>fl(q))return {t:`${names[p]} lives above ${names[q]}.`,c:s=>s.indexOf(p)>s.indexOf(q)};return null},
    ()=>{const p=ri(0,n-1),q=ri(0,n-1);if(p===q)return null;if(fl(p)===fl(q)+1)return {t:`${names[p]} lives on the floor immediately above ${names[q]}.`,c:s=>s.indexOf(p)===s.indexOf(q)+1};return null},
    ()=>{const p=ri(0,n-1),q=ri(0,n-1);if(p===q)return null;const d=fl(p)-fl(q);if(d>=2)return {t:`There are exactly ${d-1} floor(s) between ${names[p]} and ${names[q]}, and ${names[p]} is higher.`,c:s=>s.indexOf(p)-s.indexOf(q)===d};return null}];
  const B=build(n,gens);if(!B)return null;const sols=permSolutions(n,B.cons);if(sols.length!==1)return null;return {names,target:sols[0],clues:B.clues}}
add('floors','Puzzles',3,()=>{const n=pick([5,6]);const L=floors(n);if(!L)return null;const f=ri(0,n-1);const ans=L.names[L.target[f]];if(L.clues.some(c=>c.startsWith(ans+' lives on the')&&/(top|ground)/.test(c)))return null;const lab=f===0?'ground floor':`floor ${f}`;
  return mk('Puzzles',3,`${n} persons ${L.names.join(', ')} live on ${n} different floors of a building (the ground floor is the lowest, floor ${n-1} the top). ${L.clues.join(' ')}\nWho lives on the ${lab}?`,ans,L.names.filter(x=>x!==ans).slice(0,3),`Using the clues step by step, the unique arrangement from the ground floor upwards is ${L.target.map(i=>L.names[i]).join(', ')}. So ${ans} lives on the ${lab}.`)});
function circular(n){const names=uniq(n);const target=shuffle([...Array(n).keys()]);// clockwise seats, facing centre; fix person 0 at seat 0 for uniqueness
  const rot=target.indexOf(0);const t0=target.map((_,i)=>target[(i+rot)%n]);const seat=p=>t0.indexOf(p);
  const gens=[()=>{const p=ri(1,n-1),q=ri(0,n-1);if(p===q)return null;const d=(seat(p)-seat(q)+n)%n;const k=d;if(k===1)return {t:`${names[p]} sits immediately to the left of ${names[q]}.`,c:s=>(s.indexOf(p)-s.indexOf(q)+n)%n===1};if(k===n-1)return {t:`${names[p]} sits immediately to the right of ${names[q]}.`,c:s=>(s.indexOf(p)-s.indexOf(q)+n)%n===n-1};return null},
    ()=>{const p=ri(0,n-1),q=ri(0,n-1);if(p===q)return null;if((seat(p)-seat(q)+n)%n===n/2)return {t:`${names[p]} sits exactly opposite to ${names[q]}.`,c:s=>(s.indexOf(p)-s.indexOf(q)+n)%n===n/2};return null},
    ()=>{const p=ri(0,n-1),q=ri(0,n-1);if(p===q)return null;const d=(seat(p)-seat(q)+n)%n;if(d===2)return {t:`${names[p]} sits second to the left of ${names[q]}.`,c:s=>(s.indexOf(p)-s.indexOf(q)+n)%n===2};return null}];
  const B=build(n,gens,[s=>s[0]===0]);if(!B)return null;const sols=permSolutions(n,B.cons);if(sols.length!==1)return null;return {names,target:sols[0],clues:B.clues}}
add('seat_circ','Seating Arrangement',3,()=>{const n=pick([6]);const L=circular(n);if(!L)return null;const t=L.target;const p=ri(1,n-1);const right=t[(t.indexOf(p)-1+n)%n];if(L.clues.some(c=>c===`${L.names[right]} sits immediately to the right of ${L.names[p]}.`||c===`${L.names[p]} sits immediately to the left of ${L.names[right]}.`))return null;
  return mk('Seating Arrangement',3,`${n} persons ${L.names.join(', ')} sit around a circular table facing the centre. For the arrangement, take ${L.names[0]} as the reference seat. ${L.clues.join(' ')}\nWho sits immediately to the right of ${L.names[p]}? (For a person facing the centre, "left" means clockwise and "right" means anticlockwise.)`,L.names[right],L.names.filter(x=>x!==L.names[right]&&x!==L.names[p]).slice(0,3),`The unique clockwise order starting from ${L.names[0]} is ${t.map(i=>L.names[i]).join(' → ')}. The person to the immediate right (anticlockwise) of ${L.names[p]} is ${L.names[right]}.`)});
/* ---------- venn, counting, cubes, analogy, DS, symbols, machine ---------- */
add('venn3','Venn Diagram',2,()=>{const A=ri(25,45),B=ri(25,45),C=ri(20,40),AB=ri(8,14),BC=ri(6,12),AC=ri(5,11),ABC=ri(2,5);const U=A+B+C-AB-BC-AC+ABC;const k=ri(0,2);
  if(k===0)return mk('Venn Diagram',2,`In a group, ${A} people like tea, ${B} like coffee and ${C} like juice. ${AB} like tea and coffee, ${BC} like coffee and juice, ${AC} like tea and juice, and ${ABC} like all three. How many people like at least one drink?`,U,[U+ABC,U-ABC,A+B+C-AB-BC-AC,U+5],`Union = ${A}+${B}+${C} − ${AB} − ${BC} − ${AC} + ${ABC} = ${U}.`);
  if(k===1){const only=A-AB-AC+ABC;return mk('Venn Diagram',2,`In a group, ${A} people like tea, ${AB} like both tea and coffee, ${AC} like both tea and juice and ${ABC} like all three. How many like only tea?`,only,[only+ABC,only-ABC,A-AB-AC,only+3],`Only tea = ${A} − ${AB} − ${AC} + ${ABC} = ${only}.`)}
  const two=AB+BC+AC-3*ABC;return mk('Venn Diagram',2,`${AB} people like tea and coffee, ${BC} like coffee and juice, ${AC} like tea and juice, and ${ABC} like all three. How many like exactly two of the drinks?`,two,[two+ABC,two+3*ABC,AB+BC+AC,two-ABC],`Exactly two = ${AB}+${BC}+${AC} − 3×${ABC} = ${two}.`)});
add('count_grid','Counting Figures',2,()=>{const n=ri(3,8),m=ri(3,8);const rect=(n*(n+1)/2)*(m*(m+1)/2);let sq=0;for(let k=1;k<=Math.min(n,m);k++)sq+=(n-k+1)*(m-k+1);const type=ri(0,1);
  let b=0;for(let a=0;a<=n;a++)for(let c=a+1;c<=n;c++)for(let d=0;d<=m;d++)for(let e=d+1;e<=m;e++)b++;if(b!==rect)return null;
  return type?mk('Counting Figures',2,`How many squares of all sizes are there in a ${n} × ${m} rectangular grid (made of ${n*m} unit squares)?`,sq,[rect,sq+n,sq-m,n*m],`Squares = ${[...Array(Math.min(n,m))].map((_,i)=>`${n-i}×${m-i}`).join(' + ')} = ${sq}.`):mk('Counting Figures',2,`How many rectangles (including squares) are there in a ${n} × ${m} grid?`,rect,[sq,rect+n,rect-m,n*m*2],`Rectangles = C(${n+1},2) × C(${m+1},2) = ${n*(n+1)/2} × ${m*(m+1)/2} = ${rect}.`)});
add('tri_count','Counting Figures',2,()=>{const n=ri(3,9);const tr=n*(n+1)/2;return mk('Counting Figures',2,`A triangle has an apex at the top and ${n} equal segments on its base (so ${n-1} extra lines join the apex to the base). How many triangles are there in the figure?`,tr,[tr+n,tr-1,n*n,tr+2],`Triangles = number of ways to choose 2 of the ${n+1} base points = C(${n+1},2) = ${tr}.`)});
add('cube_paint','Cubes and Dice',2,()=>{const n=ri(3,7);const k=ri(1,3);const cnt=k===3?8:k===2?12*(n-2):6*(n-2)*(n-2);let br=0;for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++){const e=(x===0||x===n-1)+(y===0||y===n-1)+(z===0||z===n-1);if(e===k)br++}
  if(br!==cnt)return null;return mk('Cubes and Dice',2,`A cube of side ${n} cm is painted on all its faces and then cut into 1 cm cubes. How many small cubes have exactly ${k} painted face${k>1?'s':''}?`,cnt,[cnt+n,cnt-4,cnt*2,(n-2)**3],`${k===3?'Corner cubes: 8.':k===2?'Edge cubes: 12 × (n − 2) = 12 × '+(n-2)+'.':'Face cubes: 6 × (n − 2)² = 6 × '+(n-2)+'².'} = ${cnt}.`)});
add('analogy_num','Analogy',1,()=>{const r=ri(0,3);const a=ri(3,12),b=ri(3,12);let f,desc;if(r===0){f=x=>x*x;desc='square'}else if(r===1){f=x=>x*x*x;desc='cube';}else if(r===2){const k=ri(2,5);f=x=>x*k+1;desc=`multiply by ${k} and add 1`}else{const k=ri(3,9);f=x=>x+k*x;desc=`${1+k} times`}
  const ans=f(b);return mk('Analogy',1,`${a} : ${f(a)} :: ${b} : ?`,ans,[ans+ri(1,5),ans-ri(1,5),f(b)+b,ans+10],`The relation is "${desc}": ${a} → ${f(a)}, so ${b} → ${ans}.`)});
add('odd_one','Analogy',2,()=>{const types=[()=>{const p=[2,3,5,7,11,13,17,19,23,29,31,37];const s=shuffle(p).slice(0,3);let o=pick([4,6,8,9,10,12,15,21,25,27]);return {s:[...s,o],odd:o,why:'three are prime numbers, the odd one is composite'}},()=>{const sq=[16,25,36,49,64,81,100,121,144];const s=shuffle(sq).slice(0,3);const o=pick([20,30,45,50,72,90]);return {s:[...s,o],odd:o,why:'the others are perfect squares'}},()=>{const e=[12,18,24,30,42,54,66,78];const s=shuffle(e).slice(0,3);const o=pick([13,15,25,35,45,49]);return {s:[...s,o],odd:o,why:'the others are even numbers, the odd one is not'}}];
  const t=pick(types)();const sh=shuffle(t.s);return mk('Analogy',2,`Find the odd one out: ${sh.join(', ')}`,t.odd,sh.filter(x=>x!==t.odd),`${t.why}: ${t.odd} does not fit.`)});
add('ds','Data Sufficiency',3,()=>{const OPT=['Statement I alone is sufficient','Statement II alone is sufficient','Statement I and II together are sufficient, neither alone is sufficient','Either statement I or II alone is sufficient','Both statements together are not sufficient'];
  for(let t=0;t<50;t++){const X=ri(2,9),Y=ri(2,9);const mkS=()=>{const a=ri(1,3),b=ri(-2,3),c=a*X+b*Y;return {t:`${a===1?'':a}x ${b<0?'−':'+'} ${Math.abs(b)===1?'':Math.abs(b)}y = ${c}`.replace('+ 0y','+ 0y'),f:(x,y)=>a*x+b*y===c}};const s1=mkS(),s2=Math.random()<.4?{t:`x ${pick(['>','<'])} y`,f:null}:mkS();if(!s2.f){const g=s2.t.includes('>');s2.f=(x,y)=>g?x>y:x<y;if(!s2.f(X,Y))continue}
    const dom=[];for(let x=1;x<=12;x++)for(let y=1;y<=12;y++)dom.push([x,y]);const unique=(sl)=>{const xs=new Set(sl.map(p=>p[0]));return xs.size===1};
    const S1=dom.filter(p=>s1.f(...p)),S2=dom.filter(p=>s2.f(...p)),B=S1.filter(p=>s2.f(...p));const u1=unique(S1),u2=unique(S2),ub=unique(B);
    const ans=u1&&u2?3:u1?0:u2?1:ub?2:4;if(B.length===0)continue;
    return {t:'Data Sufficiency',d:3,ty:'mcq',q:`Given that x and y are positive integers not greater than 12. What is the value of x?\nStatement I: ${s1.t}\nStatement II: ${s2.t}`,o:OPT,a:ans,e:`Solve with each statement alone, then together over the allowed values (1 to 12): ${['Statement I alone gives one value of x.','Statement II alone gives one value of x.','Only combining them gives a single value of x.','Each statement alone gives a single value of x.','Even together, x is not fixed.'][ans]}`}}return null});
add('sym_ops','Symbol Operations',2,()=>{const syms=['+','−','×','÷'];const perm=shuffle(syms);const map={};syms.forEach((s,i)=>map[s]=perm[i]);if(syms.some(s=>map[s]===s))return null;
  for(let t=0;t<60;t++){const a=ri(2,30),b=ri(2,9),c=ri(2,9),d=ri(2,9);const ops=[pick(syms),pick(syms),pick(syms)];const expr=`${a} ${ops[0]} ${b} ${ops[1]} ${c} ${ops[2]} ${d}`;
    const real=`${a} ${map[ops[0]]} ${b} ${map[ops[1]]} ${c} ${map[ops[2]]} ${d}`.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');let v;try{v=Function('"use strict";return ('+real+')')()}catch(e){continue}
    if(!Number.isFinite(v)||Math.abs(v-Math.round(v))>1e-9||Math.abs(v)>500)continue;v=Math.round(v);const inv={};syms.forEach(s=>inv[s]=map[s]);
    return mk('Symbol Operations',2,`If '+' means '${map['+']}', '−' means '${map['−']}', '×' means '${map['×']}' and '÷' means '${map['÷']}', find the value of ${expr}.`,v,[v+ri(1,4),v-ri(1,5),v*2-1,v+10],`Replace the signs: ${real.replace(/\*/g,'×').replace(/\//g,'÷').replace(/-/g,'−')}. By BODMAS this equals ${v}.`)}return null});
add('machine','Input-Output',3,()=>{const n=5,arr=shuffle([...Array(60).keys()].map(x=>x+10)).slice(0,n);const asc=Math.random()<.5;const steps=[];let cur=arr.slice();for(let i=0;i<n-1;i++){let idx=i;for(let j=i+1;j<n;j++)if(asc?cur[j]<cur[idx]:cur[j]>cur[idx])idx=j;const v=cur[idx];cur.splice(idx,1);cur.splice(i,0,v);steps.push(cur.slice())}
  if(steps[0].join()===arr.join()||steps[1].join()===steps[0].join())return null;const k=ri(2,3);const ans=steps[k].join(' ');const wrong=[steps[k-1].join(' '),steps[Math.min(k+1,steps.length-1)].join(' '),shuffle(steps[k]).join(' ')].filter(x=>x!==ans);if(new Set([ans,...wrong]).size<4)return null;
  return mk('Input-Output',3,`A machine rearranges numbers step by step. Input: ${arr.join(' ')}. Step 1: ${steps[0].join(' ')}. Step 2: ${steps[1].join(' ')}. What will be Step ${k+1}?`,ans,wrong,`In each step the ${asc?'smallest':'largest'} remaining number is moved to the next position on the left. Step ${k+1}: ${ans}.`)});
add('digit_pat','Alphabet Test',2,()=>{const n=14,d=[...Array(n)].map(()=>pick([3,5,7,2,5,3,3,5]));const cnt=(()=>{let c=0;for(let i=0;i<n-1;i++)if(d[i]===3&&d[i+1]===5&&!(i>0&&d[i-1]===7))c++;return c})();
  return mk('Alphabet Test',2,`In the series ${d.join(' ')}, how many 3s are immediately followed by 5 but not immediately preceded by 7?`,cnt,[cnt+1,cnt+2,Math.max(0,cnt-1),cnt+3],`Scan every pair "3 5" and reject those where the 3 has a 7 just before it. Count = ${cnt}.`)});
G.F=F;
const MAXTRY=40;
G.make=f=>{for(let i=0;i<MAXTRY;i++){let q=null;try{q=f.gen()}catch(e){q=null}if(q&&q.o&&q.o.length>=4&&q.a>=0&&new Set(q.o).size===q.o.length)return Object.assign({id:f.id+'_'+Math.random().toString(36).slice(2,8),fam:f.id},q)}return null};
G.topics=[...new Set(F.map(f=>f.t))];
G.byTopic=t=>t==='All'?F:F.filter(f=>f.t===t);
G.next=(topic,diff)=>{let pool=G.byTopic(topic||'All');if(diff)pool=pool.filter(f=>diff===1?f.d===1:diff===2?f.d<=2:true);if(!pool.length)pool=F;for(let i=0;i<30;i++){const q=G.make(pick(pool));if(q)return q}return null};
G.paper=n=>{const out=[];const fams=shuffle(F);let i=0;const used={};while(out.length<n&&i<fams.length*3){const f=fams[i%fams.length];i++;if((used[f.t]||0)>=2&&i<fams.length)continue;const q=G.make(f);if(q){out.push(q);used[f.t]=(used[f.t]||0)+1}}return out};
})(window.NG=window.NG||{});
