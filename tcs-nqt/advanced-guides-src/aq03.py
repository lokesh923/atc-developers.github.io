from lib import *
import math
def tobase(n,b):
    d='0123456789ABCDEF';s=''
    while n:s=d[n%b]+s;n//=b
    return s or '0'
def dr(n):return 1+(n-1)%9 if n else 0
def f_cyc():
    f,ax=plt.subplots(figsize=(9.2,2.8));ax.axis('off');ax.set_xlim(0,13);ax.set_ylim(0,4.2)
    ax.text(6.5,3.85,'Remainder pattern of 2ⁿ when divided by 7 (repeats every 3 steps)',ha='center',fontsize=11,fontweight='bold')
    for i in range(9):
        r=pow(2,i+1,7);x=0.5+i*1.4;ax.add_patch(FancyBboxPatch((x,1.7),1.2,1.2,boxstyle='round,pad=0.02,rounding_size=0.1',fc=['#dbeafe','#fde68a','#dcfce7'][i%3],ec='#14213d'));ax.text(x+0.6,2.5,f'2^{i+1}',ha='center',fontsize=9);ax.text(x+0.6,2.0,str(r),ha='center',fontsize=14,fontweight='bold')
    ax.text(6.5,1.1,'1 → 2 → 4 → 1 → 2 → 4 … so 2^100: 100 mod 3 = 1 → remainder 2',ha='center',fontsize=10,color='#be123c',fontweight='bold')
    ax.text(6.5,0.45,'Find the cycle length, reduce the power modulo that length, read the remainder.',ha='center',fontsize=9.5,color='#14213d')
    save(f,'aq3_cycle')
f_cyc()
def html():
    h=top('Remainders, Cyclicity and Number Systems','ADVANCED QUANT · NUMBER THEORY · MUST-DO','#7c2d92')
    h+=intro('Big powers and big factorials cannot be computed, but their <b>remainders and last digits repeat in short cycles</b>. This chapter shows how to find the unit digit, last two digits and remainders of huge numbers, how to combine remainders (Chinese Remainder idea), and how number systems and digit sums work.')
    h+=fig('aq3_cycle','Remainders repeat. Always look for the cycle first.')
    h+=fig('aq2_cyc','Unit-digit cycles. For digits 0, 1, 5, 6 the unit digit never changes.')
    h+=form('Rules',['<b>Unit digit of aᵇ:</b> take the last digit of a, find its cycle (length 1, 2 or 4), reduce b modulo the cycle length (use the full cycle when the remainder is 0).','<b>Remainder rules:</b> (a×b) mod n = ((a mod n)(b mod n)) mod n, and the same for + and −.','<b>Fermat:</b> if p is prime and p does not divide a, then a^(p−1) ≡ 1 (mod p).','<b>Euler:</b> if gcd(a, n) = 1, then a^φ(n) ≡ 1 (mod n). Use it with φ(100) = 40 for last two digits.','<b>Remainder with a negative number:</b> 24 mod 25 = −1. So 24ⁿ mod 25 = (−1)ⁿ.','<b>Remainder theorem:</b> the remainder of p(x) divided by (x − a) is p(a).','<b>(aⁿ + bⁿ)</b> is divisible by (a + b) when n is odd. <b>(aⁿ − bⁿ)</b> is divisible by (a − b) always and by (a + b) when n is even.','<b>Digit sum / digital root:</b> a number leaves the same remainder as its digit sum when divided by 9 (and by 3).'])
    a=pow(7,2023,10);b=pow(3,200,100);c=pow(2,100,7);d=pow(17,2024,9);e=pow(5,100,13)
    h+=ex('Find the unit digit of 7^2023.',str(a),f'Cycle of 7: 7, 9, 3, 1 (length 4). 2023 mod 4 = 3, so the digit is the 3rd in the cycle: {a}.')
    h+=ex('Find the last two digits of 3^200.',str(b),f'φ(100) = 40 and gcd(3, 100) = 1, so 3⁴⁰ ≡ 1 (mod 100). 200 = 5 × 40, hence 3²⁰⁰ ≡ 1 → last two digits are 01. (Answer entered as {b}.)')
    h+=ex('What is the remainder when 2^100 is divided by 7?',str(c),f'2³ = 8 ≡ 1 (mod 7). 100 = 3 × 33 + 1, so 2¹⁰⁰ ≡ 2¹ = {c}.')
    h+=ex('What is the remainder when 17^2024 is divided by 9?',str(d),f'17 ≡ 8 ≡ −1 (mod 9). So 17²⁰²⁴ ≡ (−1)²⁰²⁴ = 1, remainder {d}.')
    h+=ex('What is the remainder when 5^100 is divided by 13?',str(e),f'5⁴ = 625 = 13 × 48 + 1, so 5⁴ ≡ 1 (mod 13). 100 = 4 × 25 → remainder {e}.')
    x=next(n for n in range(1,10000) if n%7==3 and n%11==5 and n%13==2)
    h+=h3('Combining remainders (Chinese Remainder idea)')
    h+=p('Find a number that leaves different remainders with different divisors. Build it step by step: start with the largest modulus, then add its multiples until the next condition is met.')
    h+=ex('Find the smallest positive number that leaves remainder 3 when divided by 7, remainder 5 when divided by 11 and remainder 2 when divided by 13.',str(x),f'The numbers satisfying the 13-condition are 2, 15, 28, 41, 54, 67, 80, … Among those leaving remainder 5 with 11 come 80 and then every 143. Among those with remainder 3 with 7 the smallest is {x}. It repeats every 7 × 11 × 13 = 1001 numbers.')
    h+=h3('Number systems and digit tricks')
    h+=form('Rules',['Convert from base b to decimal by the place values: 1011₂ = 8 + 0 + 2 + 1 = 11.','Convert from decimal to base b by repeated division, reading remainders from the bottom up.','<b>Digital root</b> of n = 1 + (n − 1) mod 9 (for n &gt; 0). The digital root of a product is the digital root of the product of the roots.','A number and its reversal differ by a multiple of 9. For a two-digit number ab, ab − ba = 9(a − b).','The sum of the digits of numbers from 1 to 99 together is 900. The sum of all numbers from 1 to n is n(n+1)/2.','Squares end only in 0, 1, 4, 5, 6, 9. Squares of numbers ending in 5: (…5)² = n(n+1) followed by 25.'])
    n1=345;b2=tobase(n1,2);b8=tobase(n1,8);dg=dr(987654321*123456789%10**12)
    h+=ex(f'Convert {n1} to binary and to octal.',f'{b2} ; {b8}',f'Repeated division: {n1} = {b2}₂ = {b8}₈. Check: int("{b2}", 2) = {int(b2,2)}.')
    h+=ex('Find the sum of the digits of all the numbers from 1 to 100.',str(sum(sum(map(int,str(i))) for i in range(1,101))),'Numbers 0 to 99 pair as (k, 99 − k) with digit sum 18 each; 50 pairs → 900. Add 100 → digit sum 1, giving 901.')
    h+=ex('Find the remainder when 123456789 × 987654321 is divided by 9.',str(123456789*987654321%9),f'Digit sum of 123456789 is 45 → 0 (mod 9). So the product leaves remainder 0.')
    h+=h3('How these questions appear')+tb(['Pattern','Example wording','Method'],[['Unit digit','“Unit digit of 13^77 + 27^45”','Find each cycle, add last digits.'],['Last two digits','“Last two digits of 7^99”','Euler with φ(100) = 40, or use 7⁴ = 2401 ≡ 01.'],['Remainder of a power','“Remainder when 3^101 is divided by 11”','Find the cycle of remainders or use Fermat.'],['Remainder with two divisors','“Number leaves 2 and 3 on dividing by 5 and 7”','CRT: build from the largest modulus.'],['Number system','“(213)₄ + (132)₄ in base 4”','Convert, add, convert back.'],['Digital root','“Remainder when the product is divided by 9”','Use digit sums.']],'sm')
    h+=tips(['Last two digits of any number ending in 01 stay 01 for all powers; numbers ending in 25 stay 25; 76 stays 76.','7⁴ = 2401 ⇒ last two digits of 7ⁿ repeat every 4: 07, 49, 43, 01.','To check a remainder answer, re-compute with a small power pattern.','For “remainder when divided by 7, 11, 13” numbers, note 1001 = 7 × 11 × 13: a six-digit number abcabc is always divisible by 1001.'])
    h+=warn(['Using the cycle length when the exponent remainder is 0 (you need the last number of the cycle, not the first).','Applying Euler’s theorem when gcd(a, n) ≠ 1.','Treating remainders as negative numbers in the final answer (give the positive remainder).'])
    h+=pq('3. Remainders','Remainders and number systems practice',[('Unit digit of 3^77?',str(pow(3,77,10)),'B'),('Unit digit of 2^99 + 3^99?',str((pow(2,99,10)+pow(3,99,10))%10),'B'),('Remainder when 2^50 is divided by 7?',str(pow(2,50,7)),'M'),('Remainder when 7^100 is divided by 5?',str(pow(7,100,5)),'M'),('Last two digits of 7^99?',f'{pow(7,99,100):02d}','M'),('Convert 255 to binary.',tobase(255,2),'B'),('Remainder when 100! + 5 is divided by 7? (hint: 100! is a multiple of 7)',str((math.factorial(100)+5)%7),'M'),('Smallest positive number leaving remainders 1, 2, 3 when divided by 3, 4, 5 respectively.',str(next(n for n in range(1,1000) if n%3==1 and n%4==2 and n%5==3)),'A'),('Remainder when 3^200 is divided by 17?',str(pow(3,200,17)),'A'),('Last digit of 13^13 × 17^17?',str(pow(13,13,10)*pow(17,17,10)%10),'A')])
    return h+end()
