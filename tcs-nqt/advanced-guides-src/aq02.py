from lib import *
import math
def divs(n):return [i for i in range(1,n+1) if n%i==0]
def nd(n):
    c=0;i=1
    while i*i<=n:
        if n%i==0:c+=1 if i*i==n else 2
        i+=1
    return c
def phi(n):return sum(1 for i in range(1,n+1) if math.gcd(i,n)==1)
def tz(n):
    c=0;p=5
    while p<=n:c+=n//p;p*=5
    return c
tablefig('aq2_div',['Divisor','Test','Example'],[['2, 4, 8','last 1, 2, 3 digits divisible by 2, 4, 8','5 7 6 → 576/8 = 72 ✓'],['3, 9','digit sum divisible by 3, 9','4 8 6 → 18 ✓ for 3 and 9'],['5, 25','last digit 0/5; last two digits 00/25/50/75','1 2 7 5 ✓ for 25'],['6','divisible by 2 and 3','2 1 6 ✓'],['7','drop last digit, subtract twice it','343: 34 − 6 = 28 ✓'],['11','(sum odd places) − (sum even places) = 0 or 11k','9 1 8 → (9+8)−1 = 16 ✗ ; 2 7 5 6 3: (2+5+3)−(7+6)=−3 ✗'],['13','add 4 × last digit to the rest','91: 9 + 4 = 13 ✓']],[1.5,4.3,3.4],fs=8.6,rowh=0.62,title='Divisibility tests you must know')
cyc={2:[2,4,8,6],3:[3,9,7,1],4:[4,6],7:[7,9,3,1],8:[8,4,2,6],9:[9,1],5:[5],6:[6],0:[0],1:[1]}
tablefig('aq2_cyc',['Last digit','Cycle of unit digits','Length'],[[str(k),' → '.join(map(str,v)),str(len(v))] for k,v in cyc.items() if k not in(0,1)],[2.0,5.0,2.0],fs=9,rowh=0.55,title='Unit digit cycles of powers')
def html():
    h=top('Number Theory: Factors, HCF, LCM and Divisibility','ADVANCED QUANT · NUMBER THEORY · MUST-DO','#7c2d92')
    h+=intro('Number theory is the most dependable scoring area of the advanced quant section. Questions look scary (huge powers, many conditions) but each is solved by a <b>short formula</b>: count factors from the prime factorisation, use HCF and LCM for “greatest” and “least” numbers, use the unit-digit cycle for big powers. Learn the formulas and the 20-second techniques below.')
    h+=fig('aq2_div','Divisibility tests: the 7, 11 and 13 tests save the most time.')
    h+=form('Factors (N = pᵃ qᵇ rᶜ …)',['Number of factors = <b>(a+1)(b+1)(c+1)…</b>.','Sum of factors = (pᵃ⁺¹−1)/(p−1) × (qᵇ⁺¹−1)/(q−1) × …','Product of all factors = N^(d/2), where d is the number of factors.','Number of <b>odd</b> factors: ignore the power of 2. Number of <b>even</b> factors = total − odd.','A number is a perfect square exactly when every power is even, i.e. it has an <b>odd</b> number of factors.','Ways to write N as a product of two factors = d/2 (or (d+1)/2 for a perfect square when order does not matter).','Numbers below N that are coprime to N (Euler): φ(N) = N × (1−1/p)(1−1/q)…'])
    n1=7200;d1=len(divs(n1));odd1=len([d for d in divs(n1) if d%2]);s360=sum(divs(360));ph=phi(360)
    h+=ex(f'How many factors does {n1} have? How many of them are odd? How many are perfect squares?',f'{d1}; {odd1}; {sum(1 for d in divs(n1) if int(d**.5)**2==d)}',f'{n1} = 2⁵ × 3² × 5². Factors = 6 × 3 × 3 = {d1}. Odd factors ignore the 2s: 3 × 3 = {odd1}. Square factors take even powers: (0,2,4) × (0,2) × (0,2) = 3 × 2 × 2 = {sum(1 for d in divs(n1) if int(d**.5)**2==d)}.')
    h+=ex('Find the sum of all positive factors of 360 and the count of numbers up to 360 that are coprime to 360.',f'{s360}; {ph}',f'360 = 2³ × 3² × 5. Sum = (2⁴−1)/1 × (3³−1)/2 × (5²−1)/4 = 15 × 13 × 6 = {s360}. φ(360) = 360 × ½ × ⅔ × ⅘ = {ph}.')
    best=next(n for n in range(1,10**6) if nd(n)==15)
    h+=ex('What is the smallest positive integer that has exactly 15 factors?',str(best),f'15 = 15 × 1 or 5 × 3. The smallest is with 5 × 3: 2⁴ × 3² = {best}. (Always put the largest power on the smallest prime.)')
    h+=h3('HCF and LCM: the four standard question types')
    h+=form('Rules',['<b>HCF × LCM = product of the two numbers</b> (only for two numbers).','Greatest number that divides a, b, c leaving remainders r₁, r₂, r₃: <b>HCF(a − r₁, b − r₂, c − r₃)</b>.','Least number that leaves the <b>same remainder r</b> when divided by x, y, z: <b>LCM(x, y, z) + r</b>.','Least number that is <b>r short</b> of a multiple (x − a = y − b = k): <b>LCM − k</b>.','Greatest number that divides a, b, c leaving the <b>same remainder</b>: HCF of the differences (a−b, b−c).','LCM of fractions = LCM(numerators)/HCF(denominators); HCF of fractions = HCF(numerators)/LCM(denominators).','Bells, traffic lights and runners meeting again: answer is the <b>LCM of their time periods</b>.'])
    g=math.gcd(math.gcd(1657-6,2037-5),1);l=math.lcm(12,15,20)+5
    d3=math.gcd(math.gcd(1305-1,4665-1),6905-1)
    h+=ex('Find the greatest number that divides 1657 and 2037 leaving remainders 6 and 5 respectively.',str(math.gcd(1651,2032)),f'Required number = HCF(1657−6, 2037−5) = HCF(1651, 2032) = {math.gcd(1651,2032)}.')
    h+=ex('Find the least number which leaves remainder 5 when divided by 12, 15 and 20.',str(l),f'LCM(12, 15, 20) = {math.lcm(12,15,20)}, so the number is {math.lcm(12,15,20)} + 5 = {l}.')
    h+=ex('Three bells ring at intervals of 18, 24 and 30 minutes and ring together at 8:00 a.m. At what time will they next ring together?',f'{math.lcm(18,24,30)} minutes later = 8:00 a.m. + {math.lcm(18,24,30)//60} h {math.lcm(18,24,30)%60} min = 2:00 p.m.' if False else '2:00 p.m.',f'LCM(18, 24, 30) = {math.lcm(18,24,30)} minutes = {math.lcm(18,24,30)//60} hours. 8:00 a.m. + 6 hours = 2:00 p.m.')
    h+=form('Trailing zeros and the power of a prime in n!',['Trailing zeros in n! = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …','Highest power of a prime p in n! = ⌊n/p⌋ + ⌊n/p²⌋ + ⌊n/p³⌋ + …','Trailing zeros of a product: count the pairs (2, 5) in its prime factorisation.'])
    t100=tz(100);t250=tz(250);p2=sum(100//2**i for i in range(1,8))
    h+=ex('How many trailing zeros are in 100!? In 250!?',f'{t100}; {t250}',f'100!: 20 + 4 = {t100}. 250!: 50 + 10 + 2 = {t250}.')
    h+=ex('What is the highest power of 2 that divides 100!?',str(p2),f'⌊100/2⌋ + ⌊100/4⌋ + ⌊100/8⌋ + ⌊100/16⌋ + ⌊100/32⌋ + ⌊100/64⌋ = 50 + 25 + 12 + 6 + 3 + 1 = {p2}.')
    h+=h3('How these questions appear in the exam')+tb(['Pattern','Typical wording','Method'],[['Count factors','“How many divisors of 2400 are multiples of 10?”','Prime factorise, restrict the powers.'],['Smallest number with k factors','“Smallest number with 12 factors”','Largest power on the smallest prime.'],['HCF/LCM word problem','Bells, tiles, ropes, runners, greatest length measuring','HCF for “greatest”, LCM for “least / together”.'],['Remainders with HCF/LCM','“Divides 100 and 140 leaving remainders…”','Subtract remainders, then HCF.'],['Factorial zeros','“Number of zeros at the end of 200!”','Divide by 5, 25, 125.']],'sm')
    h+=tips(['A multiple of 10 needs at least one 2 and one 5: count factors with powers restricted to ≥1 of each.','Two numbers with HCF h are h·a and h·b with a, b coprime. Use this to build the numbers.','For “greatest number … same remainder” always use the difference of the numbers.','Test your answer: does it really leave the stated remainders?'])
    h+=warn(['Using HCF × LCM = product for three numbers.','Forgetting to include 1 and N itself when counting factors.','Subtracting the remainder in an LCM problem (it is added) or adding it in an HCF problem (it is subtracted).'])
    h+=pq('2. Number theory I','Factors, HCF and LCM practice',[('How many factors does 2520 have?',str(len(divs(2520))),'B'),('What is the sum of the factors of 100?',str(sum(divs(100))),'B'),('Find the HCF of 36 and 84.',str(math.gcd(36,84)),'B'),('Find the LCM of 12, 18 and 27.',str(math.lcm(12,18,27)),'B'),('How many trailing zeros does 150! have?',str(tz(150)),'M'),('Find the least number which, when divided by 6, 8 and 12, leaves remainder 3 each time.',str(math.lcm(6,8,12)+3),'M'),('How many divisors of 3600 are perfect squares?',str(sum(1 for d in divs(3600) if int(round(d**.5))**2==d)),'M'),('Find the greatest number that divides 245 and 1029 leaving remainder 5 in each case.',str(math.gcd(240,1024)),'A'),('How many integers from 1 to 500 are coprime to 500?',str(phi(500)),'A'),('Find the smallest number having exactly 18 factors.',str(next(n for n in range(1,10**5) if nd(n)==18)),'A')])
    return h+end()
