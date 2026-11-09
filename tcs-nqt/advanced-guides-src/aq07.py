from lib import *
import math,itertools
from fractions import Fraction as Fr
C=math.comb
def f_tree():
    f,ax=plt.subplots(figsize=(9.2,3.8));ax.axis('off');ax.set_xlim(0,13);ax.set_ylim(0,6)
    ax.text(6.5,5.7,'Tree for two draws without replacement from 4 red + 6 blue balls',ha='center',fontsize=11,fontweight='bold')
    pts={'S':(0.6,3),'R1':(4.2,4.5),'B1':(4.2,1.5),'RR':(9,5.2),'RB':(9,3.8),'BR':(9,2.2),'BB':(9,0.8)}
    for k,(x,y) in pts.items():ax.add_patch(Circle((x,y),0.32,fc='#e0e7ff' if k in('S','R1','B1') else '#fff7ed',ec='#14213d'));ax.text(x,y,{'S':'start','R1':'R','B1':'B','RR':'RR','RB':'RB','BR':'BR','BB':'BB'}[k],ha='center',va='center',fontsize=8.5,fontweight='bold')
    def ln(a,b,t):
        (x1,y1),(x2,y2)=pts[a],pts[b];ax.plot([x1+0.3,x2-0.3],[y1,y2],color='#475569');ax.text((x1+x2)/2,(y1+y2)/2+0.18,t,fontsize=9,color='#be123c',fontweight='bold',ha='center')
    ln('S','R1','4/10');ln('S','B1','6/10');ln('R1','RR','3/9');ln('R1','RB','6/9');ln('B1','BR','4/9');ln('B1','BB','5/9')
    for k,t in (('RR','4/10 × 3/9 = 12/90'),('RB','4/10 × 6/9 = 24/90'),('BR','6/10 × 4/9 = 24/90'),('BB','6/10 × 5/9 = 30/90')):ax.text(pts[k][0]+0.5,pts[k][1],t,va='center',fontsize=9)
    save(f,'aq7_tree')
f_tree()
def html():
    h=top('Probability','ADVANCED QUANT · COUNTING · MUST-DO','#be123c')
    h+=intro('Probability questions ask for a fraction. The safest route is <b>favourable outcomes ÷ total outcomes</b> using counting (combinations) for cards, balls and committees, and the <b>multiplication rule</b> for sequences. Advanced questions add “given that” (conditional probability), repeated trials (binomial) and expectation.')
    h+=fig('aq7_tree','A tree keeps without-replacement sequences organised: multiply along a branch, add across branches.')
    h+=form('Formulas',['<b>P(E) = favourable / total.</b> 0 ≤ P ≤ 1. P(not E) = 1 − P(E).','<b>P(A or B) = P(A) + P(B) − P(A and B).</b> For mutually exclusive events the last term is 0.','<b>Independent events:</b> P(A and B) = P(A) × P(B).','<b>Conditional:</b> P(A | B) = P(A and B)/P(B).','<b>Total probability and Bayes:</b> P(A) = ΣP(Bᵢ)P(A|Bᵢ); P(Bᵢ | A) = P(Bᵢ)P(A|Bᵢ)/P(A).','<b>Binomial:</b> exactly k successes in n independent trials = nCk pᵏ (1 − p)ⁿ⁻ᵏ.','<b>Expectation:</b> E = Σ (value × probability).','<b>“At least one” = 1 − P(none).</b>','<b>Odds in favour</b> = P : (1 − P).','Two dice: 36 outcomes. Sums 2 to 12 have 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1 ways. A pack of cards: 52 cards, 4 suits of 13, 12 face cards, 4 kings.'])
    ways={s:sum(1 for a in range(1,7) for b in range(1,7) if a+b==s) for s in range(2,13)}
    h+=ex('Two fair dice are thrown. Find the probability that the sum is 9 or more, and that the sum is prime.',f'{Fr(sum(ways[s] for s in range(9,13)),36)}; {Fr(sum(ways[s] for s in (2,3,5,7,11)),36)}',f'Sum ≥ 9: ways 4 + 3 + 2 + 1 = {sum(ways[s] for s in range(9,13))} of 36. Prime sums 2, 3, 5, 7, 11: 1 + 2 + 4 + 6 + 2 = {sum(ways[s] for s in (2,3,5,7,11))} of 36.')
    h+=ex('A bag contains 4 red and 6 blue balls. Two balls are drawn without replacement. Find the probability that they are of the same colour.',str(Fr(C(4,2)+C(6,2),C(10,2))),f'(4C2 + 6C2)/10C2 = (6 + 15)/45 = 21/45 = 7/15.')
    h+=ex('A fair coin is tossed 6 times. Probability of at least 2 heads?',str(Fr(sum(C(6,k) for k in range(2,7)),64)),'1 − P(0 or 1 head) = 1 − (1 + 6)/64 = 57/64.')
    sp=Fr(12,52)
    h+=ex('From a pack of 52 cards, one card is drawn. Given that it is a face card, what is the probability it is a king?',str(Fr(4,12)),'Face cards: 12. Kings among them: 4. P = 4/12 = 1/3.')
    h+=ex('Two cards are drawn without replacement from a pack of 52. Probability that both are hearts?',str(Fr(C(13,2),C(52,2))),'13C2/52C2 = 78/1326 = 1/17.')
    pA,pB=Fr(3,10),Fr(7,10);bay=Fr(3,10)*Fr(95,100)/(Fr(3,10)*Fr(95,100)+Fr(7,10)*Fr(2,100))
    h+=ex('Machine A makes 30% of the items and machine B makes 70%. A makes 5% defective items, B makes 2% defective items. An item is picked and found defective. What is the probability it came from A?',str(Fr(3*5,3*5+7*2)),'P(A and defective) = 0.3 × 0.05 = 0.015. P(B and defective) = 0.7 × 0.02 = 0.014. P(A | defective) = 0.015/0.029 = 15/29.')
    ev=Fr(sum(s*ways[s] for s in range(2,13)),36)
    h+=ex('Find the expected value of the sum when two fair dice are thrown.',str(ev),'E(one die) = 3.5, so E(sum) = 7.')
    p_both=sum(1 for a,b in itertools.product(range(1,7),repeat=2) if a%2==0 and b%2==0)
    h+=ex('Three friends A, B, C try to solve a problem with probabilities of solving 1/2, 1/3, 1/4 independently. What is the probability that the problem is solved?',str(1-Fr(1,2)*Fr(2,3)*Fr(3,4)),'P(none solves) = (1/2)(2/3)(3/4) = 1/4. So P(solved) = 3/4.')
    h+=h3('How these questions appear')+tb(['Pattern','Wording','Method'],[['Dice and coins','“Sum is 8”, “at least one six”','List outcomes or use complement.'],['Cards','“Both are kings”, “one red, one face”','Combinations, or sequential multiplication.'],['Balls from a bag','“Without replacement”, “with replacement”','Combinations vs repeated fractions.'],['Conditional','“Given that …”','Restrict the sample space.'],['Bayes','Factories, tests, defective items','Weighted fractions.'],['Binomial','“Exactly 3 heads in 5 tosses”','nCk pᵏ qⁿ⁻ᵏ.'],['Meeting/geometric','Birthdays, same-sex pairs','Complement trick.']],'sm')
    h+=tips(['For “at least one” always use 1 − P(none).','Without replacement, probabilities of later draws change; with replacement they do not.','For conditional probability redraw the sample space after the condition.','Give the answer as a reduced fraction unless the question asks for a decimal or percentage.'])
    h+=warn(['Adding probabilities of events that are not mutually exclusive.','Forgetting that without replacement the denominator reduces.','Treating dependent events as independent.'])
    h+=pq('7. Probability','Probability practice',[('A die is thrown once. Probability of an even number greater than 2?',str(Fr(2,6)),'B'),('Two coins are tossed. Probability of exactly one head?','1/2','B'),('Probability that a card drawn from a pack is a red king?',str(Fr(2,52)),'B'),('A bag has 5 red and 3 green balls. Two drawn together. Probability both red?',str(Fr(C(5,2),C(8,2))),'M'),('Three dice are thrown. Probability that the sum is 6?',str(Fr(sum(1 for t in itertools.product(range(1,7),repeat=3) if sum(t)==6),216)),'M'),('A coin is tossed 5 times. Probability of exactly 3 heads?',str(Fr(C(5,3),32)),'M'),('Probability that in a group of 3 people at least two share a birth day of the week?',str(1-Fr(7*6*5,343)),'A'),('A and B take turns tossing a coin; A starts; first head wins. Probability A wins?','2/3','A'),('Two dice are thrown. Given that the sum is 8, probability that both numbers are even?',str(Fr(sum(1 for a,b in itertools.product(range(1,7),repeat=2) if a+b==8 and a%2==0 and b%2==0),5)),'A'),('Probability that a number selected from 1 to 100 is divisible by 4 or 6?',str(Fr(sum(1 for i in range(1,101) if i%4==0 or i%6==0),100)),'A')])
    return h+end()
