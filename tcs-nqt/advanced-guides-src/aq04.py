from lib import *
import math,itertools
def f_parab():
    f,ax=plt.subplots(figsize=(9.2,3.4));import numpy as np
    x=np.linspace(-1.5,5.5,200);y=(x-1)*(x-4)
    ax.plot(x,y,color='#1f4b9e',lw=2.5);ax.axhline(0,color='#14213d',lw=1);ax.fill_between(x,y,0,where=(y<0),color='#dbeafe')
    ax.plot([1,4],[0,0],'o',color='#be123c',ms=8);ax.text(1,0.9,'α = 1',ha='center',fontweight='bold',color='#be123c');ax.text(4,0.9,'β = 4',ha='center',fontweight='bold',color='#be123c')
    ax.plot([2.5],[-2.25],'o',color='#0f7d6b',ms=8);ax.text(2.5,-3.0,'vertex x = −b/2a = 2.5\nminimum value = −D/4a = −2.25',ha='center',fontsize=9,color='#0f7d6b',fontweight='bold')
    ax.set_ylim(-4,6);ax.set_xlim(-1.5,5.5);ax.set_title('y = x² − 5x + 4:  α + β = 5 = −b/a,  αβ = 4 = c/a',fontsize=10.5,fontweight='bold');ax.spines[['top','right']].set_visible(False)
    save(f,'aq4_parab')
f_parab()
def html():
    h=top('Algebra: Equations, Quadratics and Inequalities','ADVANCED QUANT · ALGEBRA · MUST-DO','#2f66b3')
    h+=intro('Algebra questions in the advanced section are rarely “solve for x”. They ask for <b>expressions in the roots</b> (α² + β², α³ + β³), for the <b>number of integer solutions</b>, for a <b>maximum or minimum value</b>, or for an unknown found from a pair of equations. The shortcut is nearly always a <b>symmetric identity</b>: express the wanted quantity through the sum and the product of the roots.')
    h+=fig('aq4_parab','A quadratic and its key numbers: roots, sum, product and vertex.')
    h+=form('Quadratic ax² + bx + c = 0',['Roots α, β: <b>α + β = −b/a</b>, <b>αβ = c/a</b>. Discriminant D = b² − 4ac.','D &gt; 0: two real roots; D = 0: equal roots; D &lt; 0: no real roots. Roots are rational only if D is a perfect square.','<b>α² + β² = (α+β)² − 2αβ</b>; <b>(α−β)² = (α+β)² − 4αβ</b>.','<b>α³ + β³ = (α+β)³ − 3αβ(α+β)</b>; 1/α + 1/β = (α+β)/αβ.','New equation with roots α+k, β+k: replace x by (x − k). With roots 1/α, 1/β: reverse the coefficients.','Minimum of ax² + bx + c (a &gt; 0) is at x = −b/2a with value <b>−D/4a</b>. Maximum for a &lt; 0.'])
    h+=form('Identities and inequalities',['(a+b)² = a²+2ab+b²; a³+b³ = (a+b)(a²−ab+b²); a³+b³+c³−3abc = (a+b+c)(a²+b²+c²−ab−bc−ca).','If a + b + c = 0 then a³ + b³ + c³ = 3abc.','<b>If x + 1/x = k:</b> x² + 1/x² = k² − 2 and x³ + 1/x³ = k³ − 3k.','<b>AM ≥ GM:</b> for positive numbers, a + b ≥ 2√(ab). If the sum is fixed the product is maximum when the numbers are equal; if the product is fixed the sum is minimum when equal.','<b>Modulus:</b> |x − a| &lt; b means a − b &lt; x &lt; a + b. |x − a| &gt; b means x &lt; a − b or x &gt; a + b.','Floor function: ⌊x⌋ ≤ x &lt; ⌊x⌋ + 1.','<b>Remainder theorem:</b> p(x) ÷ (x − a) leaves p(a). <b>Factor theorem:</b> (x − a) is a factor if p(a) = 0.'])
    S,P=7,10;a1=S*S-2*P;a2=S**3-3*S*P;a3=S*S-4*P
    h+=ex(f'If α and β are the roots of x² − {S}x + {P} = 0, find α² + β², α³ + β³ and (α − β)².',f'{a1}; {a2}; {a3}',f'α + β = {S}, αβ = {P}. α² + β² = {S}² − 2×{P} = {a1}. α³ + β³ = {S}³ − 3×{P}×{S} = {a2}. (α − β)² = {S}² − 4×{P} = {a3}.')
    k=5
    h+=ex(f'If x + 1/x = {k}, find x³ + 1/x³ and x⁴ + 1/x⁴.',f'{k**3-3*k}; {(k*k-2)**2-2}',f'x² + 1/x² = {k*k-2}. x³ + 1/x³ = {k}³ − 3×{k} = {k**3-3*k}. x⁴ + 1/x⁴ = ({k*k-2})² − 2 = {(k*k-2)**2-2}.')
    cnt=sum(1 for x in range(-50,51) if abs(x-3)<=7 and x!=3 or False)
    cnt2=sum(1 for x in range(-100,100) if x*x-5*x-14<0)
    h+=ex('How many integers x satisfy x² − 5x − 14 &lt; 0?',str(cnt2),f'Factorise: (x − 7)(x + 2) &lt; 0, so −2 &lt; x &lt; 7. Integers: −1, 0, 1, …, 6 → {cnt2}.')
    mx=max(x*(30-x) for x in range(31))
    h+=ex('If x and y are positive integers with x + y = 31, find the maximum value of xy.',str(max(x*(31-x) for x in range(32))),'For a fixed sum the product is maximum when the numbers are as close as possible: 15 × 16 = 240.')
    r=(lambda p:p(2))(lambda x:x**3-6*x**2+11*x-6+10)
    h+=ex('Find the remainder when x³ − 6x² + 11x + 4 is divided by (x − 2).',str(2**3-6*4+22+4),'By the remainder theorem put x = 2: 8 − 24 + 22 + 4 = 10.')
    h+=h3('Word problems that become equations')
    h+=ex('The sum of a number and its reciprocal is 10/3. Find the number(s).','3 or 1/3','x + 1/x = 10/3 ⇒ 3x² − 10x + 3 = 0 ⇒ (3x − 1)(x − 3) = 0.')
    sols=[(x,y) for x in range(1,40) for y in range(1,40) if 3*x+2*y==60 and x>y]
    h+=ex('Pens cost ₹3 and notebooks cost ₹2 each. Ravi bought some of each for exactly ₹60 and bought more pens than notebooks, at least one of each. In how many ways is this possible?',str(len(sols)),'3x + 2y = 60 with x &gt; y ≥ 1. Since 60 and 2y are even, 3x is even, so x is even: x = 2, 4, 6, … and y = (60 − 3x)/2 must be a positive integer smaller than x. Listing the pairs gives '+str(len(sols))+' solutions.')
    h+=h3('How these questions appear')+tb(['Pattern','Wording','Method'],[['Symmetric in the roots','“Find α³ + β³”','Use sum and product of roots.'],['Equation from conditions','“Roots are consecutive integers with product 56”','Set up S and P.'],['Integer solutions','“Number of integers with |x − 2| ≤ 7”','Write the interval and count.'],['Max/min of an expression','“Maximum of xy with x + y = 40”','AM-GM or vertex of the parabola.'],['Linear Diophantine','“Ways to pay ₹60 with 3- and 2-rupee coins”','Parity and list the pairs.'],['Polynomial remainder','“Remainder when p(x) ÷ (x − 2)”','Substitute x = 2.']],'sm')
    h+=tips(['If the question gives S and P, never solve for the roots.','To count integer solutions, convert the inequality to an interval first; the endpoints matter for ≤ and &lt;.','For “maximum value of a product with a fixed sum”, make the numbers equal; for integers make them nearly equal.','For equations with unknown integers, use parity or divisibility to cut the cases.'])
    h+=warn(['Forgetting that D must be a perfect square for rational roots.','Including the endpoints for strict inequalities.','Using AM-GM when the numbers can be negative.'])
    h+=pq('4. Algebra','Algebra practice',[('If α + β = 6 and αβ = 5, find α² + β².',str(36-10),'B'),('If x + 1/x = 3, find x² + 1/x².','7','B'),('Find the sum of the roots of 2x² − 9x + 4 = 0.','4.5','B'),('How many integers satisfy |x − 4| &lt; 6?',str(sum(1 for x in range(-50,60) if abs(x-4)<6)),'M'),('Minimum value of x² − 8x + 20?',str(min(x*x-8*x+20 for x in range(-20,30))),'M'),('Find the remainder when x⁴ − 3x² + 5 is divided by x + 1.',str((-1)**4-3+5),'M'),('If a + b + c = 0, find (a³ + b³ + c³)/abc.','3','M'),('For positive x, the minimum value of x + 16/x?',str(8),'A'),('How many positive integer pairs (x, y) satisfy 4x + 5y = 100?',str(sum(1 for x in range(1,30) for y in range(1,30) if 4*x+5*y==100)),'A'),('If x² + 1/x² = 14 and x &gt; 0, find x + 1/x.','4','A')])
    return h+end()
