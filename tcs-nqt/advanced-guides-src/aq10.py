from lib import *
from fractions import Fraction as Fr
def f_work():
    f,ax=plt.subplots(figsize=(7.8,3.4));ax.axis('off');ax.set_xlim(0,10);ax.set_ylim(0,5)
    ax.text(5,4.6,'Efficiency method: Total work = LCM of the days',ha='center',fontsize=11,fontweight='bold')
    cols=['#fde68a','#bfdbfe','#bbf7d0']
    for i,(n,d,e) in enumerate((('A','12 days','3 units/day'),('B','18 days','2 units/day'),('A+B','','5 units/day'))):
        y=3.4-i*1.15;ax.add_patch(Rectangle((0.4,y),(float(e.split()[0])/5)*6,0.8,fc=cols[i],ec='#14213d'))
        ax.text(0.5,y+0.4,f'{n}  {d}',va='center',fontsize=9.5,fontweight='bold');ax.text(7.4,y+0.4,e,va='center',fontsize=10)
    ax.text(5,0.15,'Total = LCM(12,18) = 36 units  →  together 36 ÷ 5 = 7.2 days',ha='center',fontsize=10,color='#be123c',fontweight='bold')
    save(f,'aq10_work')
f_work()
def f_pipe():
    f,ax=plt.subplots(figsize=(7.4,3.2));ax.axis('off');ax.set_xlim(0,10);ax.set_ylim(0,5)
    ax.add_patch(Rectangle((3.5,0.8),3,2.6,fc='#dbeafe',ec='#14213d',lw=2))
    ax.annotate('',xy=(4.4,3.4),xytext=(4.4,4.7),arrowprops=dict(arrowstyle='-|>',color='#0f7d6b',lw=2.5));ax.text(4.5,4.35,'Inlet +',color='#0f7d6b',fontsize=10,fontweight='bold')
    ax.annotate('',xy=(5.6,4.7),xytext=(5.6,3.4),arrowprops=dict(arrowstyle='-|>',color='#be123c',lw=2.5)) if False else None
    ax.annotate('',xy=(6.2,0.1),xytext=(6.2,0.8),arrowprops=dict(arrowstyle='-|>',color='#be123c',lw=2.5));ax.text(6.4,0.3,'Outlet −',color='#be123c',fontsize=10,fontweight='bold')
    ax.text(5,2.1,'Tank',ha='center',fontsize=12,fontweight='bold')
    ax.text(0.2,3.4,'Inlet = positive work\nOutlet / leak = negative work\nNet rate = Σ inlets − Σ outlets',fontsize=9.5,va='top')
    save(f,'aq10_pipe')
f_pipe()
def html():
    h=top('Time and Work, Pipes and Cisterns','ADVANCED QUANT · TIME AND WORK · HIGH PRIORITY','#c2410c')
    h+=intro('Every Time-and-Work question is one idea: <b>work = rate × time</b>. The trick that makes it easy is the <b>efficiency (units) method</b>: pick the total work as the LCM of the given days, so every rate becomes a whole number. Pipes and cisterns, wages, and alternate-day questions are all the same idea.')
    h+=fig('aq10_work','Choose total work = LCM, then everyone’s rate is an integer.')
    h+=form('Core formulas',['<b>Work = Rate × Time.</b> If A finishes in a days, A’s rate = 1/a per day (or LCM/a units per day).','<b>Together:</b> 1/a + 1/b = (a+b)/(ab), so time = <b>ab/(a+b)</b> for two people.','If A and B together take t days and A alone takes a days: B alone = <b>at/(a−t)</b>.','<b>Efficiency ∝ 1/days.</b> If A is k times as efficient as B, A takes 1/k of B’s time.','<b>Wages are divided in the ratio of work done</b> (efficiency × days), not in the ratio of days alone.','<b>M₁D₁H₁/W₁ = M₂D₂H₂/W₂</b> (men × days × hours per day ÷ work).','<b>Pipes:</b> inlet adds, outlet / leak subtracts. Net rate = Σ inlets − Σ outlets.','<b>Alternate-day work:</b> compute work done in one 2-day cycle, count full cycles, then handle the remainder.'])
    a,b=12,18;L=36
    h+=ex(f'A can do a piece of work in {a} days and B in {b} days. In how many days can they do it together?',str(Fr(a*b,a+b)).replace('/','/')+' = 7.2 days',f'Total = LCM({a},{b}) = {L}. A: {L//a}/day, B: {L//b}/day. Together {L//a+L//b}/day. Time = {L}/{L//a+L//b} = {Fr(L,L//a+L//b)} days = {L/(L//a+L//b)} days.')
    t,aa=8,24;bb=Fr(aa*t,aa-t)
    h+=ex(f'A and B together finish a job in {t} days. A alone takes {aa} days. How long will B alone take?',str(bb),f'LCM(8,24)=24 units. Together 3/day, A 1/day, so B 2/day. B alone = 24/2 = {bb} days… check formula: at/(a−t) = {aa}×{t}/({aa}−{t}) = {bb}.' if False else f'Use B = at/(a−t) = {aa}×{t}/({aa}−{t}) = {bb} days. Units check: total {aa}; together {aa//t}/day; A {aa//aa}/day; B {aa//t-1}/day → {aa//(aa//t-1)} days.')
    # A,B,C
    ra,rb,rc=Fr(1,10),Fr(1,15),Fr(1,30)
    h+=ex('A, B and C can do a job in 10, 15 and 30 days respectively. A and B start; after 3 days A leaves and C joins. How many more days are needed to finish?','',' ')
    h=h.rsplit('<div class="box ex">',1)[0]
    total=30;ua,ub,uc=3,2,1;done=3*(ua+ub);rem=total-done;days=Fr(rem,ub+uc)
    h+=ex('A, B and C can do a job in 10, 15 and 30 days respectively. A and B start; after 3 days A leaves and C joins. How many more days are needed to finish?',str(days),f'Total = LCM = {total}. Rates: A {ua}, B {ub}, C {uc}. First 3 days: 3 × {ua+ub} = {done}. Remaining {rem}. B + C = {ub+uc}/day → {days} days.')
    # alternate days
    def alt(a,b):
        t=Fr(a*b,1);L=a*b//__import__('math').gcd(a,b);ua,ub=L//a,L//b;day=0;w=0
        while w<L:
            day+=1;w+=ua if day%2 else ub
            if w>=L:break
        return day
    h+=ex('A can do a work in 12 days and B in 18 days. They work on alternate days, A starting first. In how many days is the work finished?',str(alt(12,18)),'Total = 36. A = 3/day, B = 2/day. One 2-day cycle = 5 units. 6 cycles (12 days) = 30. Day 13 (A): 33. Day 14 (B): 35. Day 15 (A): 38 ≥ 36. So it finishes on day 15.')
    h+=ex('15 men can complete a job in 24 days working 8 hours a day. How many days will 20 men take working 6 hours a day?',str(Fr(15*24*8,20*6)),'Man-hours = 15×24×8 = 2880. New rate per day = 20×6 = 120. Days = 2880/120 = 24.')
    h+=ex('A can do a work in 15 days; B is 50% more efficient than A. Find B’s time.',str(15/1.5),'B is 1.5× as efficient, so B takes 15/1.5 = 10 days.')
    h+=ex('A and B together earn ₹1,800 for a job. A works 6 days at efficiency 3, B works 9 days at efficiency 2. What is A’s share?',str(1800*18//(18+18)),'Work done: A = 6×3 = 18, B = 9×2 = 18. Equal, so A gets ₹900.')
    h+=h3('Pipes and cisterns')+fig('aq10_pipe','Inlet adds, outlet subtracts.')
    ih,oh=Fr(1,6),Fr(1,10)
    h+=ex('A pipe fills a tank in 6 hours and a leak empties it in 10 hours. How long will the tank take to fill with the leak open?',str(1/(ih-oh)),'Total = LCM(6,10) = 30. Inlet 5/hr, leak 3/hr, net 2/hr. Time = 30/2 = 15 hours.')
    h+=ex('Pipes A and B fill a tank in 20 and 30 minutes; C empties it in 40 minutes. All open together: time to fill?',str(Fr(120,6+4-3)),'Total = LCM(20,30,40) = 120. A 6, B 4, C −3 → net 7/min. Time = 120/7 ≈ 17.14 minutes.')
    h+=h3('How these questions appear')+tb(['Pattern','Wording','Method'],[['Joint work','“A in 10, B in 15, together?”','ab/(a+b) or LCM units.'],['Leaving / joining','“A leaves after 3 days”','Work done so far, then the remainder.'],['Alternate days','“work on alternate days”','One cycle total; count cycles.'],['Efficiency','“20% more efficient”','Efficiency ∝ 1/days.'],['Wages','“Share the ₹ in proportion”','Split by work done.'],['Men-days','“15 men, 24 days, 8 hr”','M·D·H/W constant.'],['Pipes','“leak empties it in …”','Net rate, outlet negative.']],'sm')
    h+=tips(['Total work = LCM of the given days: always, no exceptions.','“k times as efficient” means ratio k : 1 and time ratio 1 : k.','For leaving/joining, compute the units done by each phase and subtract from the total.','In pipe questions with a leak, a tank that “fills in x hours but takes y with the leak” gives leak rate = 1/x − 1/y.'])
    h+=warn(['Dividing wages by days instead of by efficiency × days.','Treating a leak as an inlet (sign error).','In alternate-day work, forgetting the work might finish partway through a day.','Adding days instead of rates.'])
    pq_items=[('A does a job in 20 days, B in 30 days. Together?',str(Fr(600,50)),'B'),('A is twice as fast as B. Together they take 12 days. How many days would A alone take?',str(12*3//2),'B'),('A pipe fills a tank in 8 hours. After 2 hours another pipe, which fills in 12 hours, is also opened. How long from the start to fill?',str(2+Fr(24-6,5)),'M'),('A and B can do a job in 12 and 16 days. They work for 4 days; then B leaves. How long does A need to finish alone?',str(Fr(48-4*7,4)),'M'),('12 men finish a job in 20 days. After 5 days, 6 more men join. In how many more days will it finish?',str(Fr(12*15,18)),'M'),('A can do a work in 10 days, B in 12 days and C in 15 days. They work together; A leaves 2 days before completion. Total days?',str(2+Fr(60-2*9,15)),'A'),('Two pipes fill a tank in 15 and 20 hours; a third empties it in 30. If all three are opened together, how long to fill?',str(Fr(60,4+3-2)),'A'),('A can do a piece of work in 24 days. With B’s help it takes 8 days. In how many days can B alone do it?',str(Fr(24*8,24-8)),'A'),('A and B alternately work, A first. A alone takes 10 days, B alone takes 15. When is the job done?',str(alt(10,15)),'A'),('Time ratio of A to B is 3:4. A and B together finish in 12 days. How long would B alone take?',str(Fr(12*7,3)),'A')]
    h+=pq('10. Time and Work','Time-and-work practice',pq_items)
    return h+end()
