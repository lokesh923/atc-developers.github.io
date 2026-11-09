from lib import *
from fractions import Fraction as Fr
def f_int():
    f,ax=plt.subplots(figsize=(7.6,3.3))
    n=list(range(0,11));P=10000
    ax.plot(n,[P+P*0.1*i for i in n],color='#1d4ed8',lw=2.5,label='Simple interest (10%)')
    ax.plot(n,[P*1.1**i for i in n],color='#be123c',lw=2.5,label='Compound interest (10%)')
    ax.set_xlabel('years');ax.set_ylabel('amount (₹)');ax.grid(alpha=.3);ax.legend(fontsize=9)
    ax.set_title('Simple grows in a straight line, compound curves upward',fontsize=10.5,fontweight='bold')
    save(f,'aq13_int')
f_int()
def ci(P,r,n):return P*(1+Fr(r,100))**n-P
def html():
    h=top('Simple and Compound Interest','ADVANCED QUANT · INTEREST · MEDIUM PRIORITY','#0e7490')
    h+=intro('Interest has only two formulas worth memorising. The rest is shortcuts: the <b>difference between CI and SI</b>, <b>half-yearly compounding</b> and <b>instalments</b>.')
    h+=fig('aq13_int','Same rate: compound pulls ahead each year.')
    h+=form('Formulas',['<b>SI = P × R × T / 100.</b> Amount A = P + SI.','<b>CI: A = P(1 + R/100)ⁿ.</b> CI = A − P.','<b>Half-yearly:</b> rate R/2, time 2n. <b>Quarterly:</b> rate R/4, time 4n.','<b>CI − SI for 2 years</b> = P(R/100)². For 3 years: P(R/100)²(3 + R/100).','<b>Doubling time (SI):</b> 100/R years. <b>Sum becomes k times in t years (SI):</b> R = 100(k−1)/t.','<b>Rule of 72</b> (approximate, CI): doubling years ≈ 72/R.','If a sum doubles in n years with CI, it becomes 8 times in 3n years.','<b>Same sum at SI for 2 years versus CI:</b> CI for year 2 = SI for year 1 + interest on interest.'])
    h+=ex('Find the simple interest on ₹8,000 at 6.5% per annum for 3 years.',str(Fr(8000*65*3,1000)),'SI = 8000 × 6.5 × 3 / 100 = ₹1,560.')
    h+=ex('Find the compound interest on ₹10,000 at 10% p.a. for 2 years.',str(ci(10000,10,2)),'A = 10000 × 1.1² = 12,100. CI = ₹2,100.')
    h+=ex('Find the difference between CI and SI on ₹5,000 at 8% p.a. for 2 years.',str(Fr(5000*64,10000)),'P(R/100)² = 5000 × 0.0064 = ₹32.')
    h+=ex('₹16,000 at 20% per annum compounded half-yearly for 1 year. Find the amount.',str(Fr(16000)*Fr(11,10)**2),'Rate 10% per half-year, 2 periods: 16000 × 1.21 = ₹19,360.')
    h+=ex('A sum at SI becomes ₹2,400 in 2 years and ₹3,000 in 5 years. Find the sum and the rate.',f'{2400-2*200}; {Fr(200*100,2000)}%','SI per year = (3000−2400)/3 = 200. In 2 years SI = 400 so P = 2000. Rate = 200×100/2000 = 10%.')
    h+=ex('In what time will a sum double at 12.5% SI?',str(Fr(100,Fr(25,2))),'Doubling time = 100/R = 100/12.5 = 8 years.')
    h+=ex('₹25,000 is invested at 8% CI for 3 years. Find the amount.',str(Fr(25000)*Fr(27,25)**3),'A = 25000 × (1.08)³ = ₹31,492.80.')
    h+=tb(['Pattern','Wording','Method'],[['Plain SI','“interest on ₹x at r% for t years”','PRT/100.'],['CI direct','“compounded annually”','P(1+r)ⁿ − P.'],['CI vs SI','“difference between … for 2 years”','P(r/100)².'],['Half-yearly','“compounded half-yearly”','Half rate, double time.'],['Doubling','“doubles in … years”','100/R (SI), 72/R (CI).'],['Two-sum','“same amount lent at SI and CI”','Equate and solve.'],['Instalments','“paid in 2 equal instalments”','Present value of each.']],'sm')
    h+=tips(['For 2-year CI use the shortcut r + r + r²/100 as a single percentage.','CI question with r = 10% gets easy with multiplier 1.1, 1.21, 1.331, 1.4641.','Convert time to years before using the formulas (months ÷ 12).','Half-yearly CI is always a little bigger than yearly CI at the same nominal rate.'])
    h+=warn(['Using R/2 without doubling n for half-yearly compounding.','Reading “CI” where the question asks for the amount (or the reverse).','Applying the difference-of-CI-and-SI shortcut to more than 2 years.','Using months directly in years.'])
    items=[('SI on ₹6,000 at 5% for 4 years?',str(Fr(6000*20,100)),'B'),('CI on ₹4,000 at 10% for 2 years?',str(ci(4000,10,2)),'B'),('Amount on ₹12,000 at 5% CI for 2 years?',str(Fr(12000)*Fr(21,20)**2),'B'),('CI − SI on ₹10,000 at 5% for 2 years?',str(Fr(10000*25,10000)),'M'),('A sum triples in 10 years at SI. Find the rate.',str(Fr(100*2,10)),'M'),('₹8,000 at 10% p.a. compounded half-yearly for 1 year: CI?',str(Fr(8000)*Fr('1.05')**2-8000),'M'),('A sum at CI doubles in 4 years. In how many years will it become 16 times?','16','A'),('A person borrows ₹15,000 at 6% SI and lends at 8% SI for 3 years. His gain?',str(Fr(15000*2*3,100)),'A'),('The interest earned in year 2 on a sum at 10% CI is ₹1,100. Find the sum.',str(Fr(1100*100,10)/Fr(11,10)),'A'),('At what rate p.a. will ₹4,000 amount to ₹4,840 in 2 years at CI?','10','A')]
    assert Fr(1210)==Fr(1100)*Fr(11,10) and Fr(4000)*Fr(11,10)**2==4840
    h+=pq('13. Interest','Interest practice',items)
    return h+end()
