/* Unlimited numerical question generators. Each family builds a question from random numbers and
   carries an independent check function (v) that recomputes the answer a different way. */
(function(G){
const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[ri(0,a.length-1)],gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),lcm=(a,b)=>a/gcd(a,b)*b;
const R2=x=>Math.round(x*100)/100,close=(a,b)=>Math.abs(a-b)<1e-6*Math.max(1,Math.abs(b));
const fmt=x=>typeof x==='string'?x:String(R2(x));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const fact=n=>{let r=1n;for(let i=2n;i<=BigInt(n);i++)r*=i;return r};
const C=(n,r)=>Number(fact(n)/(fact(r)*fact(n-r)));
const F=[];const add=(id,t,d,gen)=>F.push({id,t,d,gen});
const frac=(a,b)=>{const g=gcd(a,b);return (a/g)+'/'+(b/g)};
const names=['Amit','Riya','Karan','Neha','Rahul','Sita','Vikram','Pooja','Arjun','Meera','Sanjay','Divya'];
/* ---------- Percentages ---------- */
add('pct_of','Percentages',1,()=>{const x=pick([5,8,12,15,16,18,20,24,25,32,35,36,45,48,55,60,64,72,75,85]),y=pick([40,60,80,120,160,200,240,320,360,400,480,600,800,1200]);const a=x*y/100;
  return {q:`What is ${x}% of ${y}?`,a,dist:[a+y/20,a-y/50,x*y/10,a*2],e:`${x}% of ${y} = ${x}/100 × ${y} = ${fmt(a)}.`,v:()=>close(a,y*x/100)}});
add('pct_succ','Percentages',2,()=>{const a=pick([10,20,25,30,40,50]),b=pick([10,20,25,40,50]);const net=a-b-a*b/100;
  return {q:`The price of an item is first increased by ${a}% and then decreased by ${b}%. What is the net percentage change? (Increase is positive, decrease is negative.)`,a:net,suf:'%',dist:[a-b,net+5,-net,a-b+a*b/100],e:`Net change = a + b + ab/100 with a = +${a}, b = −${b}: ${a} − ${b} − ${a*b}/100 = ${fmt(net)}%.`,v:()=>close(net,(100*(1+a/100)*(1-b/100)-100))}});
add('pct_pop','Percentages',2,()=>{const r=pick([10,20,25]),P=ri(1,25)*400;const a=P*(100+r)*(100+r)/10000;
  return {q:`The population of a town is ${P}. It increases by ${r}% every year. What will the population be after 2 years?`,a,dist:[P*(1+2*r/100),a+P/20,P*(100+r)/100,a-P/10],e:`Population = ${P} × (1 + ${r}/100)² = ${P} × ${(100+r)/100}² = ${a}.`,v:()=>{let p=P;for(let i=0;i<2;i++)p=p*(100+r)/100;return close(p,a)}}});
add('pct_restore','Percentages',2,()=>{const p=pick([25,100,150,300,400,900]);const x=100*p/(100+p);
  return {q:`The price of sugar rises by ${p}%. By what percentage must a family reduce its consumption so that the expenditure remains the same?`,a:x,suf:'%',dist:[p,x+10,100-x,x/2],e:`Reduction = p/(100 + p) × 100 = ${p}/${100+p} × 100 = ${fmt(x)}%.`,v:()=>close((1-100/(100+p))*100,x)}});
add('pct_marks','Percentages',3,()=>{const T=ri(2,12)*100,a=pick([30,32,35,36]),p=pick([38,40,42,45]),b=pick([48,50,52,55]);const f=(p-a)*T/100,g=(b-p)*T/100;const ans=p*T/100;
  return {q:`A student who scores ${a}% marks fails by ${f} marks. Another student who scores ${b}% marks gets ${g} marks more than the pass marks. What are the pass marks?`,a:ans,dist:[ans+f,ans-g,T,ans+50],e:`The difference between the two scores is ${b-a}% of the total = ${f}+${g} = ${f+g}, so the total = ${f+g}/${b-a}×100 = ${T}. Pass marks = ${a}% of ${T} + ${f} = ${a*T/100} + ${f} = ${ans}.`,v:()=>{const t=(f+g)*100/(b-a);return close(t,T)&&close(a*t/100+f,ans)}}});
/* ---------- Profit & Loss ---------- */
add('pl_profit','Profit and Loss',1,()=>{const cp=ri(5,60)*20,pr=pick([5,10,12.5,15,20,25,30,40]);const sp=cp*(100+pr)/100;
  return {q:`An article bought for ₹${cp} is sold for ₹${sp}. Find the profit percentage.`,a:pr,suf:'%',dist:[pr+5,pr/2,pr*2,100*(sp-cp)/sp],e:`Profit = ${sp} − ${cp} = ${sp-cp}. Profit % = ${sp-cp}/${cp} × 100 = ${pr}%.`,v:()=>close((sp-cp)/cp*100,pr)}});
add('pl_markup','Profit and Loss',2,()=>{const m=pick([20,25,30,40,50]),d=pick([10,20,25]);const a=(100+m)*(100-d)/100-100;
  return {q:`A shopkeeper marks his goods ${m}% above the cost price and allows a discount of ${d}%. Find his profit or loss percentage. (Profit is positive, loss is negative.)`,a,suf:'%',dist:[m-d,a+5,-a,m*d/100+m-d],e:`Let CP = 100. MP = ${100+m}. SP = ${100+m} × (1 − ${d}/100) = ${(100+m)*(100-d)/100}. Profit % = ${fmt(a)}%.`,v:()=>{const cp=100,mp=cp*(1+m/100),sp=mp*(1-d/100);return close((sp-cp)/cp*100,a)}}});
add('pl_same_sp','Profit and Loss',2,()=>{const x=pick([5,8,10,12,15,20,25]),S=ri(5,40)*100;const a=x*x/100;
  return {q:`Two articles are sold at ₹${S} each. On one there is a gain of ${x}% and on the other a loss of ${x}%. What is the overall result as a percentage of the total cost? (Loss is negative.)`,a:-a,suf:'%',dist:[0,a,x,-x],e:`When two articles are sold at the same price, one at x% gain and the other at x% loss, there is always a loss of x²/100 = ${x*x}/100 = ${fmt(a)}%.`,v:()=>{const c1=S/(1+x/100),c2=S/(1-x/100);return close((2*S-(c1+c2))/(c1+c2)*100,-a)}}});
add('pl_succ_disc','Profit and Loss',2,()=>{const a=pick([10,20,25,30,40]),b=pick([10,15,20,25,50]);const e=a+b-a*b/100;
  return {q:`Two successive discounts of ${a}% and ${b}% are equal to a single discount of how many percent?`,a:e,suf:'%',dist:[a+b,e+3,Math.abs(a-b),e-4],e:`Single discount = a + b − ab/100 = ${a} + ${b} − ${a*b/100} = ${fmt(e)}%.`,v:()=>close(100-100*(1-a/100)*(1-b/100),e)}});
add('pl_weight','Profit and Loss',3,()=>{const w=pick([800,625,500,400,250,200]);const a=(1000-w)/w*100;
  return {q:`A dishonest shopkeeper claims to sell at cost price but uses a weight of ${w} g in place of 1 kg. Find his gain percentage.`,a,suf:'%',dist:[(1000-w)/10,a+10,a/2,100*(1000-w)/1000*2],e:`Gain % = (error ÷ true weight used) × 100 = (1000 − ${w})/${w} × 100 = ${fmt(a)}%.`,v:()=>close(((1000/w)-1)*100,a)}});
/* ---------- Time, Speed, Distance ---------- */
add('tsd_avg','Time, Speed and Distance',2,()=>{const k=ri(1,6)*5,a=2*k,b=3*k;const s=2*a*b/(a+b);
  return {q:`A car travels from A to B at ${a} km/h and returns along the same road at ${b} km/h. What is the average speed for the whole journey?`,a:s,suf:' km/h',dist:[(a+b)/2,s+2,s-3,Math.sqrt(a*b)],e:`Average speed for equal distances = 2ab/(a+b) = 2 × ${a} × ${b}/(${a}+${b}) = ${fmt(s)} km/h.`,v:()=>{const D=a*b;return close(2*D/(D/a+D/b),s)}}});
add('tsd_train','Time, Speed and Distance',2,()=>{const v=pick([36,54,72,90]),t=ri(5,15),P=ri(2,8)*50;const ms=v*5/18,L=ms*t;const ans=(L+P)/ms;
  return {q:`A train running at ${v} km/h crosses a pole in ${t} seconds. How long will it take to cross a platform ${P} m long?`,a:ans,suf:' s',dist:[t+P/ms*2,ans+5,P/ms,ans-3],e:`Speed = ${v} × 5/18 = ${ms} m/s. Length of train = ${ms} × ${t} = ${L} m. Time to cross the platform = (${L} + ${P})/${ms} = ${fmt(ans)} s.`,v:()=>close((v*1000/3600*t+P)/(v*1000/3600),ans)}});
add('tsd_meet','Time, Speed and Distance',1,()=>{const a=ri(4,12)*5,b=ri(4,12)*5,t=ri(2,6);const D=(a+b)*t;
  return {q:`Two cars start at the same time from two cities ${D} km apart and move towards each other at ${a} km/h and ${b} km/h. After how many hours do they meet?`,a:t,suf:' h',dist:[t+1,t*2,D/Math.abs(a-b),t-1<1?t+2:t-1],e:`Relative speed = ${a} + ${b} = ${a+b} km/h. Time = ${D}/${a+b} = ${t} hours.`,v:()=>close(D/(a+b),t)}});
add('tsd_boat','Time, Speed and Distance',3,()=>{const u=pick([8,10,12,15]),s=pick([2,3,4,5]).valueOf();if(s>=u)return null;const l=lcm(u+s,u-s),D=l*ri(1,3);const T=D/(u+s)+D/(u-s);
  return {q:`A boat goes ${D} km downstream and comes back to the starting point. Its speed in still water is ${u} km/h and the speed of the stream is ${s} km/h. Find the total time taken.`,a:T,suf:' h',dist:[2*D/u,T+1,D/(u+s),T-1],e:`Downstream speed = ${u+s}, upstream speed = ${u-s}. Time = ${D}/${u+s} + ${D}/${u-s} = ${fmt(D/(u+s))} + ${fmt(D/(u-s))} = ${fmt(T)} h.`,v:()=>{let t=0,x=0;while(x<D-1e-9){x+=(u+s)/60;t+=1/60}let y=0;while(y<D-1e-9){y+=(u-s)/60;t+=1/60}return Math.abs(t-T)<0.05}}});
/* ---------- Time and Work ---------- */
const TW=[];for(let a=6;a<=60;a++)for(let b=a;b<=60;b++)if(a!==b&&(a*b)%(a+b)===0)TW.push([a,b]);
add('tw_two','Time and Work',1,()=>{const [a,b]=pick(TW);const t=a*b/(a+b);
  return {q:`${pick(names)} can finish a work in ${a} days and ${pick(names)} can finish the same work in ${b} days. Working together, in how many days will they finish it?`,a:t,suf:' days',dist:[(a+b)/2,t+2,t-1,a+b],e:`One day's work = 1/${a} + 1/${b} = ${a+b}/${a*b}. Days = ${a*b}/${a+b} = ${fmt(t)}.`,v:()=>close(1/(1/a+1/b),t)}});
add('tw_three','Time and Work',2,()=>{const L=pick([60,120,180,240]);const divs=[];for(let i=2;i<=20;i++)if(L%i===0)divs.push(i);const eA=pick(divs),eB=pick(divs),eC=pick(divs);const T=L/(eA+eB+eC);if(!Number.isInteger(T)||eA===eB||eB===eC||eA===eC)return null;
  return {q:`A, B and C can complete a piece of work alone in ${L/eA}, ${L/eB} and ${L/eC} days respectively. In how many days will they complete it working together?`,a:T,suf:' days',dist:[T+1,T*2,(L/eA+L/eB+L/eC)/3,T+3],e:`Take total work = ${L} units. Efficiencies: ${eA}, ${eB}, ${eC} units/day, total ${eA+eB+eC}. Days = ${L}/${eA+eB+eC} = ${T}.`,v:()=>{let w=0,d=0;while(w<L){w+=eA+eB+eC;d++}return d===T}}});
add('tw_pipe','Time and Work',2,()=>{const PL=[];for(let a=4;a<=30;a++)for(let b=a+1;b<=60;b++)if((a*b)%(b-a)===0)PL.push([a,b]);const [a,b]=pick(PL);const t=a*b/(b-a);
  return {q:`A pipe can fill a tank in ${a} hours. Because of a leak at the bottom, it takes ${t} hours to fill the tank. In how many hours can the leak alone empty the full tank?`,a:b,suf:' h',dist:[t-a,b+a,t,b-2],e:`Leak empties in x hours: 1/${a} − 1/x = 1/${t}. So 1/x = 1/${a} − 1/${t} = ${(t-a)}/${a*t}, so x = ${b} hours.`,v:()=>close(1/(1/a-1/t),b)}});
add('tw_mandays','Time and Work',1,()=>{const m=ri(2,12)*2,d=pick([6,8,10,12,15,18,20]),n=pick([3,4,6,9,12].filter(x=>(m*d)%x===0)||[1]);if(!n||(m*d)%n)return null;const ans=m*d/n;
  return {q:`${m} men can complete a job in ${d} days. How many men are needed to complete the same job in ${n} days?`,a:ans,dist:[ans+m,ans-2,m*n,Math.round(ans/2)],e:`Man-days = ${m} × ${d} = ${m*d}. Men needed = ${m*d}/${n} = ${ans}.`,v:()=>close(m*d/n,ans)}});
/* ---------- Ratio, Averages, Mixture, Ages, Partnership ---------- */
add('ratio_div','Ratio and Proportion',1,()=>{const a=ri(1,6),b=ri(1,6),c=ri(1,6),k=ri(2,15)*10,N=(a+b+c)*k;const w=pick([a,b,c]);const nm=w===a?'A':w===b?'B':'C';
  return {q:`₹${N} is divided among A, B and C in the ratio ${a}:${b}:${c}. How much does ${nm} get?`,a:w*k,pre:'₹',dist:[w*k+k,N/3,w*k-k,N/(a+b+c)],e:`Total parts = ${a+b+c}. One part = ${N}/${a+b+c} = ${k}. ${nm}'s share = ${w} × ${k} = ₹${w*k}.`,v:()=>close(N*w/(a+b+c),w*k)}});
add('ratio_change','Ratio and Proportion',3,()=>{const a=ri(2,7),b=ri(2,7),k=ri(2,9),x=ri(3,20);if(a===b)return null;const A=a*k,B=b*k;const c=A+x,d=B+x;const g=gcd(c,d);
  return {q:`The ratio of the present salaries of two persons is ${a}:${b}. If each gets an increase of ₹${x}, the ratio becomes ${c/g}:${d/g}. Find the smaller of the two original salaries.`,a:Math.min(A,B),pre:'₹',dist:[Math.max(A,B),Math.min(A,B)+x,Math.min(A,B)-k,Math.min(A,B)*2],e:`Let the salaries be ${a}k and ${b}k. (${a}k + ${x}) : (${b}k + ${x}) = ${c/g} : ${d/g}. Solving gives k = ${k}. Salaries are ${A} and ${B}.`,v:()=>close((a*k+x)*(d/g),(b*k+x)*(c/g))}});
add('avg_new','Averages',2,()=>{const n=ri(4,15),m=ri(20,60),dlt=ri(1,5);const x=m+(n+1)*dlt;
  return {q:`The average of ${n} numbers is ${m}. When one more number is included, the average becomes ${m+dlt}. Find the number that was included.`,a:x,dist:[m+dlt,x-dlt,x+n,m+n*dlt],e:`New total = ${n+1} × ${m+dlt} = ${(n+1)*(m+dlt)}. Old total = ${n} × ${m} = ${n*m}. Included number = ${(n+1)*(m+dlt)} − ${n*m} = ${x}.`,v:()=>close((n+1)*(m+dlt)-n*m,x)}});
add('avg_wt','Averages',2,()=>{const n1=ri(2,6)*5,n2=ri(2,6)*5,a1=ri(40,70),a2=ri(40,80);const t=(n1*a1+n2*a2)/(n1+n2);
  return {q:`The average marks of ${n1} students of section A is ${a1} and of ${n2} students of section B is ${a2}. What is the average marks of all the students taken together?`,a:t,dist:[(a1+a2)/2,t+1.5,t-2,Math.max(a1,a2)],e:`Total marks = ${n1}×${a1} + ${n2}×${a2} = ${n1*a1+n2*a2}. Average = ${n1*a1+n2*a2}/${n1+n2} = ${fmt(t)}.`,v:()=>close((a1*n1+a2*n2)/(n1+n2),t)}});
add('avg_odd','Averages',1,()=>{const n=ri(8,40);const s=n*n;
  return {q:`What is the sum of the first ${n} odd natural numbers?`,a:s,dist:[n*(n+1),s-n,s+n,n*(n+1)/2],e:`The sum of the first n odd numbers is n². So the sum = ${n}² = ${s}.`,v:()=>{let t=0;for(let i=0;i<n;i++)t+=2*i+1;return t===s}}});
add('age_sum','Ages',2,()=>{const a=ri(2,6),b=ri(2,6),k=ri(2,8),n=ri(3,10);if(a===b)return null;const S=(a+b)*k+2*n;
  return {q:`The present ages of a mother and her daughter are in the ratio ${a}:${b}. After ${n} years, the sum of their ages will be ${S} years. Find the present age of the elder one.`,a:Math.max(a,b)*k,suf:' years',dist:[Math.min(a,b)*k,Math.max(a,b)*k+n,Math.max(a,b)*k-n,S/2],e:`Present sum = ${S} − 2 × ${n} = ${S-2*n}. Ratio sum = ${a+b}, so one part = ${(S-2*n)/(a+b)}. Elder = ${Math.max(a,b)} × ${k} = ${Math.max(a,b)*k}.`,v:()=>close((a*k+n)+(b*k+n),S)}});
add('partner','Ratio and Proportion',3,()=>{const x=ri(2,9)*1000,y=ri(2,9)*1000,m=pick([2,3,4,6]);const wa=x*12,wb=y*(12-m);const g=gcd(wa,wb),P=(wa/g+wb/g)*ri(1,6)*100;const sh=P*wb/(wa+wb);
  return {q:`A starts a business with ₹${x}. After ${m} months, B joins with ₹${y}. At the end of the year the profit is ₹${P}. What is B's share of the profit?`,a:sh,pre:'₹',dist:[P-sh,P/2,sh+500,P*y/(x+y)],e:`Ratio of capital × time = ${x}×12 : ${y}×${12-m} = ${wa/g}:${wb/g}. B's share = ${wb/g}/${wa/g+wb/g} × ${P} = ₹${fmt(sh)}.`,v:()=>close(P*(y*(12-m))/(x*12+y*(12-m)),sh)}});
G.F=F;G.h={ri,pick,gcd,lcm,R2,close,fmt,shuffle,fact,C,frac,names,add};
})(window.NG=window.NG||{});
