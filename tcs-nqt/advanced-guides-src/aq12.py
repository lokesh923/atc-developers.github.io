from lib import *
from fractions import Fraction as Fr
def f_cp():
    f,ax=plt.subplots(figsize=(7.8,3.2));ax.axis('off');ax.set_xlim(0,10);ax.set_ylim(0,4)
    for x,t,c in ((0.3,'Cost Price\n100','#bfdbfe'),(3.8,'Selling Price\n100 + P%','#bbf7d0'),(7.3,'Marked Price\nSP ÷ (1 − d%)','#fde68a')):
        ax.add_patch(FancyBboxPatch((x,1.5),2.5,1.5,boxstyle='round,pad=0.05',fc=c,ec='#14213d'));ax.text(x+1.25,2.25,t,ha='center',va='center',fontsize=10,fontweight='bold')
    ax.annotate('',xy=(3.7,2.25),xytext=(2.9,2.25),arrowprops=dict(arrowstyle='-|>',lw=2));ax.annotate('',xy=(7.2,2.25),xytext=(6.4,2.25),arrowprops=dict(arrowstyle='-|>',lw=2))
    ax.text(3.3,2.65,'+ profit',ha='center',fontsize=8.5);ax.text(6.8,2.65,'+ markup',ha='center',fontsize=8.5)
    ax.text(5,0.6,'Profit / loss % is always on CP.  Discount % is always on MP.',ha='center',fontsize=10.5,color='#be123c',fontweight='bold')
    save(f,'aq12_cp')
f_cp()
def f_mix():
    f,ax=plt.subplots(figsize=(7.4,3.2));ax.axis('off');ax.set_xlim(0,10);ax.set_ylim(0,4.4)
    ax.text(1.5,3.9,'Cheaper (c)',ha='center',fontsize=10,fontweight='bold');ax.text(8.5,3.9,'Dearer (d)',ha='center',fontsize=10,fontweight='bold')
    ax.text(5,3.3,'Mean (m)',ha='center',fontsize=11,fontweight='bold',color='#be123c')
    ax.plot([1.5,5,8.5],[3.7,3.0,3.7],color='#14213d');ax.plot([1.5,5,8.5],[0.5,1.4,0.5],color='#14213d') if False else None
    ax.plot([1.5,5],[3.7,1.7],color='#14213d');ax.plot([8.5,5],[3.7,1.7],color='#14213d')
    ax.text(3.0,2.2,'d − m',ha='center',fontsize=11,color='#0f7d6b',fontweight='bold');ax.text(7.0,2.2,'m − c',ha='center',fontsize=11,color='#0f7d6b',fontweight='bold')
    ax.text(5,0.5,'Quantity of cheaper : Quantity of dearer  =  (d − m) : (m − c)',ha='center',fontsize=10.5,fontweight='bold')
    save(f,'aq12_mix')
f_mix()
def html():
    h=top('Percentages, Profit and Loss, Mixtures, Partnership','ADVANCED QUANT · PERCENT AND MIXTURES · HIGH PRIORITY','#7c3aed')
    h+=intro('This chapter bundles the topics that are all <b>ratio thinking in disguise</b>: percentages, profit and loss, discounts, alligation (mixtures) and partnership. Convert every percentage to a multiplier (20% up = ×1.2, 20% down = ×0.8) and most questions become one multiplication.')
    h+=fig('aq12_cp','Know which base each percentage is applied on.')
    h+=form('Formulas',['<b>Profit% = (SP − CP)/CP × 100</b>; <b>Loss% = (CP − SP)/CP × 100</b>. SP = CP × (1 ± p/100).','<b>Discount% = (MP − SP)/MP × 100</b>, SP = MP × (1 − d/100).','<b>Successive changes</b> a% and b%: net = a + b + ab/100 (use signs).','<b>Two successive discounts</b> d₁ and d₂: single discount = d₁ + d₂ − d₁d₂/100.','<b>Equal SP, one gain x% and one loss x%</b> ⇒ always a loss of (x/10)%.','<b>Population / depreciation:</b> P × (1 ± r/100)ⁿ.','<b>Alligation:</b> cheaper : dearer = (d − m) : (m − c).','<b>Replacement of mixture:</b> after n replacements of a fraction x of a container, remaining = V(1 − x)ⁿ.','<b>Partnership:</b> profit share ∝ investment × time.','If x% of A is y% of B then A : B = y : x.'])
    h+=ex('A shopkeeper marks an article 25% above cost and gives 20% discount. Find the profit or loss percentage.',str(Fr(125*80,100)-100),'Let CP = 100. MP = 125. SP = 125 × 0.8 = 100. Profit = 0%.')
    h+=ex('Price rises by 20% then falls by 20%. Net change?',str(Fr(120*80,100)-100),'1.2 × 0.8 = 0.96, a net 4% decrease. Formula: 20 − 20 − 400/100 = −4.')
    h+=ex('A man sells two articles at ₹1,000 each; one at 25% profit and one at 25% loss. Overall result?',f'{1000/1.25+1000/0.75:.2f} cost; loss {2000-(1000/1.25+1000/0.75):.2f}',f'CP₁ = 1000/1.25 = 800, CP₂ = 1000/0.75 = 1333.33. Total CP = {1000/1.25+1000/0.75:.2f}, SP = 2000. Loss = {1000/1.25+1000/0.75-2000:.2f}, i.e. (25/10)% = 6.25% of the total cost.')
    h+=ex('Two successive discounts of 20% and 10% are equal to a single discount of?',str(20+10-Fr(200,100)),'20 + 10 − 20×10/100 = 28%.')
    h+=ex('In what ratio must rice at ₹40/kg be mixed with rice at ₹60/kg to get a mixture worth ₹48/kg?',f'{60-48} : {48-40}','Cheaper : dearer = (60−48) : (48−40) = 12 : 8 = 3 : 2.')
    V=Fr(80);rem=V*(1-Fr(20,80))**2
    h+=ex('A vessel has 80 litres of milk. 20 litres are removed and replaced with water, and the process is repeated once. How much milk is left?',str(rem),'Remaining = 80 × (1 − 20/80)² = 80 × (3/4)² = 45 litres.')
    h+=ex('A, B and C invest ₹20,000, ₹30,000 and ₹50,000. B joins after 4 months, C after 6 months of a year. In what ratio is a profit divided?',f'{20000*12} : {30000*8} : {50000*6}','A: 20000×12 = 240000; B: 30000×8 = 240000; C: 50000×6 = 300000. Ratio 8 : 8 : 10 = 4 : 4 : 5.')
    h+=ex('If 40% of A = 25% of B, find A : B.',str(Fr(25,40)),'A : B = 25 : 40 = 5 : 8.')
    h+=ex('A population of 50,000 grows 10% a year. What is it after 2 years?',str(Fr(50000)*Fr(11,10)**2),'50000 × 1.1² = 60,500.')
    h+=fig('aq12_mix','The alligation cross: write cheaper and dearer, subtract diagonally.')
    h+=tb(['Pattern','Wording','Method'],[['Chain of changes','“up 20% then down 20%”','Multiply the factors.'],['Mark-up and discount','“marked 25% above, discount 20%”','Take CP = 100.'],['Two articles','“same SP, gain and loss”','Loss of (x/10)%.'],['Alligation','“mix to get ₹48/kg”','Cross method.'],['Replacement','“removes 20 L and replaces”','V(1 − x)ⁿ.'],['Partnership','“joins after 4 months”','Money × months.'],['Percent of percent','“x% of A is y% of B”','Ratio y : x.']],'sm')
    h+=tips(['Assume the base as 100 (or 1000) to avoid fractions.','Percentages up then down never cancel.','Alligation always needs the three prices: cheap, dear and mean.','If the discount is on the marked price and profit on cost, choose the base accordingly.'])
    h+=warn(['Applying profit % on selling price.','Adding successive percentages directly.','Mixing the order of the alligation cross (cheap is subtracted from mean in the dear column).','Ignoring time in partnership when partners join late.'])
    items=[('A number is increased by 25% and then decreased by 20%. Net change in %?',str(Fr(125*80,100)-100),'B'),('CP = ₹500, SP = ₹600. Profit %?',str(Fr(100,500)*100),'B'),('Two successive discounts of 10% and 10% equal a single discount of what percent?',str(20-Fr(100,100)),'B'),('In what ratio must milk at ₹30 be mixed with water (₹0) so the mixture costs ₹24/L?','4 : 1','M'),('A trader marks a product 40% above cost and offers a 30% discount. Profit or loss %?',str(Fr(140*70,100)-100),'M'),('A vessel contains 100 L of milk. 10 L is taken and replaced by water, repeated twice more (3 times total). Milk left?',str(100*Fr(9,10)**3),'M'),('A and B invest in the ratio 3 : 5 for 12 and 8 months. Profit ₹7,600; B’s share?',str(Fr(7600*40,76)),'A'),('The price of sugar rises 25%. By what % should consumption fall to keep expenditure the same?',str(Fr(100,5)),'A'),('A sells at a loss of 10%. If the SP were ₹60 more, there would be a 5% gain. Find CP.',str(Fr(60*100,15)),'A'),('The ratio of 2 alloys with 20% and 50% copper to get 35% copper?','1 : 1','A')]
    h+=pq('12. Percentages, P&L, Mixtures','Practice set',items)
    return h+end()
