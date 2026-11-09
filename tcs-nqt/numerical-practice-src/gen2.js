(function(G){
const {ri,pick,gcd,lcm,R2,close,fmt,shuffle,fact,C,frac,names,add}=G.h,F=G.F;
/* ---------- Mixtures ---------- */
add('mix_allig','Mixtures and Alligation',3,()=>{const p=ri(2,6)*10,u=ri(1,4),w=ri(1,4),d=ri(1,4)*10;if(u===w)return null;const q=p+d*(u+w)/gcd(u,w);const mean=(p*w+q*u)/(u+w);const g=gcd(u,w);
  // mean divides q-p in ratio u:w from cheaper side: cheaper:costlier = (q-mean):(mean-p) = u:w
  const cheaper=w/g,costlier=u/g;if(mean<=p||mean>=q)return null;
  return {q:`In what ratio should tea at ₹${p} per kg be mixed with tea at ₹${q} per kg so that the mixture is worth ₹${fmt(mean)} per kg? (Write as cheaper : costlier)`,a:`${cheaper}:${costlier}`,dist:[`${costlier}:${cheaper}`,`${cheaper+1}:${costlier}`,`${cheaper}:${costlier+1}`],e:`By alligation: cheaper : costlier = (${q} − ${fmt(mean)}) : (${fmt(mean)} − ${p}) = ${fmt(q-mean)} : ${fmt(mean-p)} = ${cheaper}:${costlier}.`,v:()=>close((q-mean)*costlier,(mean-p)*cheaper),noTita:true}});
/* ---------- Interest ---------- */
add('si','Simple and Compound Interest',1,()=>{const P=ri(5,50)*100,r=pick([4,5,6,8,10,12]),t=ri(2,6);const I=P*r*t/100;
  return {q:`Find the simple interest on ₹${P} at ${r}% per annum for ${t} years.`,a:I,pre:'₹',dist:[I+P*r/100,P*r*t/10,I/2,P+I],e:`SI = P×R×T/100 = ${P} × ${r} × ${t}/100 = ₹${I}.`,v:()=>{let s=0;for(let i=0;i<t;i++)s+=P*r/100;return close(s,I)}}});
add('ci2','Simple and Compound Interest',2,()=>{const P=ri(1,20)*400,r=pick([5,10,20]);const A=P*(100+r)*(100+r)/10000;const ci=A-P;
  return {q:`Find the compound interest on ₹${P} for 2 years at ${r}% per annum, compounded annually.`,a:ci,pre:'₹',dist:[P*r*2/100,ci+P*r/100,ci-P/50,A],e:`Amount = ${P} × (1 + ${r}/100)² = ₹${A}. CI = ${A} − ${P} = ₹${ci}.`,v:()=>{let p=P;for(let i=0;i<2;i++)p+=p*r/100;return close(p-P,ci)}}});
add('ci_diff','Simple and Compound Interest',2,()=>{const r=pick([5,10,20]),P=ri(1,25)*400;const d=P*r*r/10000;
  return {q:`Find the difference between the compound interest and the simple interest on ₹${P} for 2 years at ${r}% per annum.`,a:d,pre:'₹',dist:[d*2,d+P*r/100,P*r/100,d/2],e:`For 2 years, CI − SI = P × (R/100)² = ${P} × (${r}/100)² = ₹${fmt(d)}.`,v:()=>{let p=P;for(let i=0;i<2;i++)p+=p*r/100;return close((p-P)-P*r*2/100,d)}}});
add('si_double','Simple and Compound Interest',1,()=>{const r=pick([2,4,5,8,10,12.5,20,25]);const t=100/r;
  return {q:`In how many years will a sum of money double itself at ${r}% simple interest per annum?`,a:t,suf:' years',dist:[t*2,t+2,r,t/2],e:`Interest must equal the principal: P × ${r} × T/100 = P, so T = 100/${r} = ${fmt(t)} years.`,v:()=>close(100/r,t)}});
/* ---------- Number system ---------- */
add('unit_digit','Number System',2,()=>{const a=pick([2,3,4,7,8,9,13,17,19,23,27]),b=ri(20,300);const u=Number(BigInt(a)**BigInt(b)%10n);
  return {q:`What is the unit digit of ${a}^${b}?`,a:u,dist:[(u+1)%10,(u+3)%10,(u+6)%10,(u+8)%10],e:`The unit digit depends on the cycle of ${a%10}. The power ${b} falls at position ${((b-1)%4)+1} of the 4-step cycle, giving unit digit ${u}.`,v:()=>{let x=1;for(let i=0;i<b;i++)x=(x*a)%10;return x===u}}});
add('rem','Number System',2,()=>{const a=pick([2,3,5,7]),b=ri(15,120),n=pick([5,7,9,11,13]);if(gcd(a,n)!==1&&n<=a)return null;const r=Number(BigInt(a)**BigInt(b)%BigInt(n));
  return {q:`What is the remainder when ${a}^${b} is divided by ${n}?`,a:r,dist:[(r+1)%n,(r+2)%n,(r+n-1)%n,n-1===r?0:n-1],e:`Using the repeating pattern of remainders of powers of ${a} modulo ${n}, the remainder for the power ${b} is ${r}.`,v:()=>{let x=1;for(let i=0;i<b;i++)x=(x*a)%n;return x===r}}});
add('factors','Number System',2,()=>{const P=[2,3,5,7],e=[ri(1,4),ri(1,3),ri(0,2)];const N=Math.pow(2,e[0])*Math.pow(3,e[1])*Math.pow(5,e[2]);const ans=(e[0]+1)*(e[1]+1)*(e[2]+1);
  return {q:`How many factors does ${N} have (including 1 and itself)?`,a:ans,dist:[ans+2,ans-1,e[0]+e[1]+e[2]+1,ans*2],e:`${N} = 2^${e[0]} × 3^${e[1]}${e[2]?` × 5^${e[2]}`:''}. Number of factors = ${e[0]+1} × ${e[1]+1}${e[2]?` × ${e[2]+1}`:''} = ${ans}.`,v:()=>{let c=0;for(let i=1;i<=N;i++)if(N%i===0)c++;return c===ans}}});
add('zeros','Number System',2,()=>{const n=ri(30,300);let z=0,p=5;while(p<=n){z+=Math.floor(n/p);p*=5}
  return {q:`How many trailing zeros are there in ${n}! (${n} factorial)?`,a:z,dist:[z+1,z-1,Math.floor(n/5),z+4],e:`Count the factors of 5: ${[...Array(4)].map((_,i)=>Math.floor(n/Math.pow(5,i+1))).filter(x=>x>0).join(' + ')} = ${z}.`,v:()=>{const s=fact(n).toString();let c=0;for(let i=s.length-1;i>=0&&s[i]==='0';i--)c++;return c===z}}});
add('hcf_lcm','Number System',1,()=>{const h=ri(2,12),x=ri(2,9),y=ri(2,9);if(gcd(x,y)!==1||x===y)return null;const A=h*x,B=h*y,L=h*x*y;
  return {q:`The HCF of two numbers is ${h} and their LCM is ${L}. If one number is ${A}, what is the other number?`,a:B,dist:[B+h,L/h,B-h,A+h],e:`Product of the numbers = HCF × LCM. Other number = ${h} × ${L}/${A} = ${B}.`,v:()=>gcd(A,B)===h&&lcm(A,B)===L}});
add('bells','Number System',2,()=>{const m=pick([[6,8,12],[10,15,20],[12,18,24],[4,6,10],[8,12,16],[9,12,15],[14,21,28]]);const L=lcm(lcm(m[0],m[1]),m[2]);
  return {q:`Three bells toll at intervals of ${m[0]}, ${m[1]} and ${m[2]} minutes. If they toll together at 8:00 a.m., after how many minutes will they toll together again?`,a:L,suf:' min',dist:[m[0]*m[1]*m[2],L*2,L/2,L+m[0]],e:`LCM of ${m.join(', ')} = ${L}.`,v:()=>{for(let t=1;;t++)if(t%m[0]===0&&t%m[1]===0&&t%m[2]===0)return t===L}}});
add('divis','Number System',1,()=>{const d=pick([7,9,11,13,15,17,19,25]),N=ri(1000,9999);const add_=(d-N%d)%d;if(add_===0)return null;
  return {q:`What is the smallest number that must be added to ${N} so that the sum is exactly divisible by ${d}?`,a:add_,dist:[N%d,add_+d,d-1===add_?1:d-1,add_+1],e:`${N} ÷ ${d} leaves remainder ${N%d}. Number to add = ${d} − ${N%d} = ${add_}.`,v:()=>(N+add_)%d===0&&add_<d}});
add('base','Number System',2,()=>{const n=ri(40,250);const b=n.toString(2);
  return {q:`Convert the decimal number ${n} to binary.`,a:b,dist:[(n+1).toString(2),(n-2).toString(2),(n^4).toString(2)],e:`Dividing ${n} repeatedly by 2 and reading the remainders from the bottom gives ${b}.`,v:()=>parseInt(b,2)===n,noTita:true}});
/* ---------- Permutation, combination, probability ---------- */
add('perm_word','Permutation and Combination',2,()=>{const w=pick(['BANANA','LETTER','APPLE','SUCCESS','BALLOON','COOKIE','PEPPER','LEVEL','ALLAHABAD','TOMATO','BOOKKEEPER'].filter(x=>x.length<=9));const cnt={};for(const c of w)cnt[c]=(cnt[c]||0)+1;let ans=fact(w.length);for(const k in cnt)ans/=fact(cnt[k]);ans=Number(ans);
  return {q:`In how many distinct ways can the letters of the word ${w} be arranged?`,a:ans,dist:[Number(fact(w.length)),ans*2,ans+w.length,Number(fact(w.length))/2],e:`${w.length}! divided by the factorials of repeated letters (${Object.entries(cnt).filter(([k,v])=>v>1).map(([k,v])=>k+':'+v+'!').join(', ')||'none'}) = ${ans}.`,v:()=>{const set=new Set();const perm=(arr,cur)=>{if(!arr.length){set.add(cur);return}const seen=new Set();arr.forEach((c,i)=>{if(seen.has(c))return;seen.add(c);perm(arr.slice(0,i).concat(arr.slice(i+1)),cur+c)})};if(w.length>7)return true;perm(w.split(''),'');return set.size===ans}}});
add('handshake','Permutation and Combination',1,()=>{const n=ri(6,30);const a=n*(n-1)/2;
  return {q:`At a meeting, each of the ${n} participants shakes hands exactly once with every other participant. How many handshakes take place?`,a,dist:[n*(n-1),a+n,n*n/2,a-n],e:`Handshakes = ${n}C2 = ${n} × ${n-1}/2 = ${a}.`,v:()=>{let c=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)c++;return c===a}}});
add('committee','Permutation and Combination',2,()=>{const m=ri(4,8),w=ri(3,6),r=ri(2,4);if(r>w+m-1)return null;const tot=m+w;const ans=C(tot,r)-C(m,r);
  return {q:`A committee of ${r} members is to be formed from ${m} men and ${w} women. In how many ways can it be formed so that at least one woman is included?`,a:ans,dist:[C(tot,r),C(w,r),ans+m,ans-w],e:`Total ways = ${tot}C${r} = ${C(tot,r)}. Committees with no woman = ${m}C${r} = ${C(m,r)}. Required = ${C(tot,r)} − ${C(m,r)} = ${ans}.`,v:()=>{let c=0;const rec=(i,k,hasW)=>{if(k===0){if(hasW)c++;return}if(i>=tot)return;rec(i+1,k-1,hasW||i>=m);rec(i+1,k,hasW)};rec(0,r,false);return c===ans}}});
add('dice','Probability',2,()=>{const s=ri(3,11);let ways=0;for(let i=1;i<=6;i++)for(let j=1;j<=6;j++)if(i+j===s)ways++;const ans=frac(ways,36);
  return {q:`Two fair dice are thrown together. What is the probability that the sum of the numbers is ${s}?`,a:ans,dist:[frac(ways+1,36),frac(ways,18)===ans?frac(ways+2,36):frac(ways,18),frac(ways,12)===ans?frac(ways,6):frac(ways,12),frac(Math.max(1,ways-1),36)],e:`Favourable outcomes with sum ${s}: ${ways}. Total outcomes: 36. Probability = ${ans}.`,v:()=>{let c=0;for(let i=1;i<=6;i++)for(let j=1;j<=6;j++)if(i+j===s)c++;return frac(c,36)===ans},noTita:true}});
add('balls','Probability',3,()=>{const r=ri(3,7),b=ri(3,7),g=ri(2,6),n=r+b+g;const num=C(r,2),den=C(n,2);const ans=frac(num,den);
  return {q:`A bag has ${r} red, ${b} blue and ${g} green balls. Two balls are drawn at random without replacement. What is the probability that both are red?`,a:ans,dist:[frac(r*r,n*n),frac(r*(r-1),n*n),frac(num+1,den),frac(r,n)],e:`Favourable = ${r}C2 = ${num}. Total = ${n}C2 = ${den}. Probability = ${ans}.`,v:()=>close(num/den,(r/n)*((r-1)/(n-1))),noTita:true}});
/* ---------- Mensuration ---------- */
add('cyl','Mensuration',2,()=>{const r=7*ri(1,3),h=ri(5,20);const V=22/7*r*r*h;
  return {q:`Find the volume of a cylinder of radius ${r} cm and height ${h} cm. (Take π = 22/7)`,a:V,suf:' cm³',dist:[2*22/7*r*h,V*2,22/7*r*r,V-r*h],e:`Volume = πr²h = 22/7 × ${r}² × ${h} = ${fmt(V)} cm³.`,v:()=>close(Math.PI*r*r*h,V,0)||Math.abs(Math.PI*r*r*h-V)<V*0.002}});
add('paint','Mensuration',3,()=>{const l=ri(4,10)*2,b=ri(3,8)*2,h=ri(3,4),dr=ri(1,2)*2,rate=ri(5,15)*5;const area=2*h*(l+b)-dr*2;const cost=area*rate;
  return {q:`A room is ${l} m long, ${b} m wide and ${h} m high. Find the cost of painting its four walls at ₹${rate} per m², if there are ${dr/2} door(s) and windows together taking up ${dr*2} m² of the wall area.`,a:cost,pre:'₹',dist:[2*h*(l+b)*rate,(area+dr*2)*rate,cost+rate*10,l*b*rate],e:`Area of four walls = 2h(l + b) = 2 × ${h} × ${l+b} = ${2*h*(l+b)} m². Paintable area = ${2*h*(l+b)} − ${dr*2} = ${area} m². Cost = ${area} × ${rate} = ₹${cost}.`,v:()=>{let a=0;a+=2*(l*h)+2*(b*h);return (a-dr*2)*rate===cost}}});
add('diag','Mensuration',1,()=>{const t=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29]]),k=ri(1,4);const a=t[0]*k,b=t[1]*k,c=t[2]*k;
  return {q:`The sides of a rectangle are ${a} cm and ${b} cm. Find the length of its diagonal.`,a:c,suf:' cm',dist:[a+b,c+k,c-k,Math.sqrt(a*b)],e:`Diagonal = √(${a}² + ${b}²) = √${a*a+b*b} = ${c} cm.`,v:()=>c*c===a*a+b*b}});
add('cube','Mensuration',1,()=>{const a=ri(2,12);const V=a*a*a;
  return {q:`The volume of a cube is ${V} cm³. Find its total surface area.`,a:6*a*a,suf:' cm²',dist:[4*a*a,6*a*a+a,a*a,12*a],e:`Side = ∛${V} = ${a} cm. Total surface area = 6a² = 6 × ${a*a} = ${6*a*a} cm².`,v:()=>Math.round(Math.cbrt(V))===a}});
/* ---------- Algebra, surds, simplification ---------- */
add('roots','Algebra',2,()=>{const S=ri(3,12),P=ri(1,20);const a=S*S-2*P;
  return {q:`If α and β are the roots of the equation x² − ${S}x + ${P} = 0, find the value of α² + β².`,a,dist:[S*S,a+P,S*S+2*P,S+P],e:`α + β = ${S}, αβ = ${P}. α² + β² = (α + β)² − 2αβ = ${S*S} − ${2*P} = ${a}.`,v:()=>{const d=S*S-4*P;if(d<0)return true;const r1=(S+Math.sqrt(d))/2,r2=(S-Math.sqrt(d))/2;return close(r1*r1+r2*r2,a)}}});
add('xinv','Algebra',2,()=>{const k=ri(3,9);const a=k*k-2,c=k*k*k-3*k;const asked=Math.random()<.5;
  return {q:`If x + 1/x = ${k}, find the value of ${asked?'x² + 1/x²':'x³ + 1/x³'}.`,a:asked?a:c,dist:asked?[k*k,k*k+2,a+k,2*k]:[k*k*k,k*k*k-k,c+k,c-6],e:asked?`Square both sides: x² + 1/x² + 2 = ${k*k}, so x² + 1/x² = ${a}.`:`x³ + 1/x³ = (x + 1/x)³ − 3(x + 1/x) = ${k*k*k} − ${3*k} = ${c}.`,v:()=>{const x=(k+Math.sqrt(k*k-4))/2;return close(asked?x*x+1/(x*x):x*x*x+1/(x*x*x),asked?a:c)}}});
add('surd','Surds and Indices',2,()=>{const a=pick([5,7,11,13]),b=pick([2,3]);const ans=2*(a+b);
  return {q:`Find the value of (√${a} + √${b})² + (√${a} − √${b})².`,a:ans,dist:[ans+2*Math.sqrt(a*b),a+b,ans-2,ans*2],e:`(x + y)² + (x − y)² = 2(x² + y²) = 2(${a} + ${b}) = ${ans}.`,v:()=>close((Math.sqrt(a)+Math.sqrt(b))**2+(Math.sqrt(a)-Math.sqrt(b))**2,ans)}});
add('bodmas','Simplification',1,()=>{const a=ri(10,60),b=ri(2,9),c=ri(2,9),d=ri(2,8)*pick([2,3,4]),e=pick([2,4]);if(d%e)return null;const ans=a+b*c-d/e;
  return {q:`Simplify: ${a} + ${b} × ${c} − ${d} ÷ ${e}`,a:ans,dist:[(a+b)*c-d/e,a+b*c-d*e,a+b*(c-d)/e,ans+e],e:`BODMAS: multiplication and division first: ${b}×${c} = ${b*c}, ${d}÷${e} = ${d/e}. Then ${a} + ${b*c} − ${d/e} = ${ans}.`,v:()=>Function('"use strict";return ('+a+'+'+b+'*'+c+'-'+d+'/'+e+')')()===ans}});
add('ap','Series',2,()=>{const a=ri(2,15),d=ri(2,7),n=ri(8,30);const S=n*(2*a+(n-1)*d)/2;
  return {q:`Find the sum of the first ${n} terms of the series ${a}, ${a+d}, ${a+2*d}, ${a+3*d}, …`,a:S,dist:[S+d,S-n,n*(a+(n-1)*d),S+a],e:`Sum = n/2 [2a + (n − 1)d] = ${n}/2 × [${2*a} + ${n-1} × ${d}] = ${S}.`,v:()=>{let t=0;for(let i=0;i<n;i++)t+=a+i*d;return t===S}}});
add('logchain','Logarithms',2,()=>{const k=ri(3,7);const n=Math.pow(2,k);const chain=[];for(let i=2;i<n&&chain.length<4;i++)chain.push(`log<sub>${i}</sub> ${i+1}`);
  // log2 3 × log3 4 × ... × log_{n-1} n = log2 n  (only list first terms and the last)
  const q=`Find the value of log<sub>2</sub> 3 × log<sub>3</sub> 4 × log<sub>4</sub> 5 × … × log<sub>${n-1}</sub> ${n}.`;
  return {q,a:k,dist:[n,k+1,n-1,k-1<1?k+2:k-1],e:`Each log<sub>a</sub> b = ln b / ln a, so the product telescopes to ln ${n} / ln 2 = log<sub>2</sub> ${n} = ${k}.`,v:()=>{let p=1;for(let i=2;i<n;i++)p*=Math.log(i+1)/Math.log(i);return close(p,k)}}});
add('frac_pct','Simplification',1,()=>{const pairs=[[1,8],[3,8],[5,8],[7,8],[1,16],[3,16],[5,16],[1,12],[5,12],[1,6],[5,6],[2,9],[4,15],[7,20],[3,40]];const [n,d]=pick(pairs);const a=R2(n/d*100);
  return {q:`Express ${n}/${d} as a percentage (correct to two decimal places if needed).`,a,suf:'%',dist:[a+12.5,a/2,R2(d/n),a*2],e:`${n}/${d} × 100 = ${fmt(a)}%.`,v:()=>close(n*100/d,n/d*100,0)||Math.abs(n*100/d-a)<0.006}});
/* ---------- builder ---------- */
const sufs=[];
G.make=(fam,opts)=>{opts=opts||{};for(let tries=0;tries<60;tries++){const o=fam.gen();if(!o||o.skip)continue;
  let ok=false;try{ok=o.v()}catch(e){ok=false}if(!ok)continue;
  const pre=o.pre||'',suf=o.suf||'';const show=x=>typeof x==='string'?x:pre+fmt(x)+suf;
  const canTita=typeof o.a==='number'&&!o.noTita&&Number.isFinite(o.a)&&Math.abs(o.a*100-Math.round(o.a*100))<1e-6&&!(pre||suf.trim()==='%'&&false);
  const tita=opts.forceTita||(opts.allowTita!==false&&canTita&&Math.random()<(opts.titaRate===undefined?0.2:opts.titaRate));
  const item={id:fam.id+'_'+Math.random().toString(36).slice(2,8),fam:fam.id,t:fam.t,d:fam.d,e:o.e};
  if(tita&&canTita){item.ty='num';item.q=o.q+(pre?' (Answer in ₹, enter the number only.)':suf?` (Enter the number only; unit: ${suf.trim()}.)`:' (Enter the numerical answer.)');item.a=fmt(o.a);return item}
  const correct=show(o.a);const set=[correct];(o.dist||[]).forEach(x=>{if(typeof x==='number'&&(!Number.isFinite(x)||x<0&&!(typeof o.a==='number'&&o.a<0)))return;const s=show(x);if(!set.includes(s))set.push(s)});
  let k=1;while(set.length<4&&k<30){if(typeof o.a==='number'){const s=show(o.a+(k%2?k:-k)*Math.max(1,Math.round(Math.abs(o.a)*0.1)));if(!set.includes(s)&&!(o.a>=0&&(o.a+(k%2?k:-k)*Math.max(1,Math.round(Math.abs(o.a)*0.1)))<0))set.push(s)}k++}
  if(set.length<4)continue;const opt=shuffle(set.slice(0,4));item.ty='mcq';item.q=o.q;item.o=opt;item.a=opt.indexOf(correct);return item}
  return null};
G.topics=[...new Set(F.map(f=>f.t))];
G.byTopic=t=>t==='All'?F:F.filter(f=>f.t===t);
G.next=(topic,diff)=>{let pool=G.byTopic(topic||'All');if(diff)pool=pool.filter(f=>diff===1?f.d===1:diff===2?f.d<=2:true);if(!pool.length)pool=F;for(let i=0;i<30;i++){const q=G.make(pick(pool));if(q)return q}return null};
/* exam paper: topic-balanced across families */
G.paper=n=>{const out=[];const fams=shuffle(F);let i=0;const used={};while(out.length<n&&i<fams.length*3){const f=fams[i%fams.length];i++;const key=f.t;if((used[key]||0)>=3&&i<fams.length)continue;const q=G.make(f);if(q){out.push(q);used[key]=(used[key]||0)+1}}return out};
})(window.NG);
