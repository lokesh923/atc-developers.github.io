from acl import *
import random,math
D_CYC='''from math import gcd

def beats(B):
    n = len(B); seen = [False] * n; ans = 1
    for i in range(n):
        if not seen[i]:
            length, j = 0, i
            while not seen[j]:
                seen[j] = True; j = B[j] - 1; length += 1
            ans = ans * length // gcd(ans, length)
    return ans
'''
D_SIEVE='''def primes_in_range(l, r):
    sieve = [True] * (r + 1)
    sieve[0] = False
    if r >= 1: sieve[1] = False
    i = 2
    while i * i <= r:
        if sieve[i]:
            for j in range(i * i, r + 1, i):
                sieve[j] = False
        i += 1
    return [x for x in range(l, r + 1) if sieve[x]]
'''
D_POW='''def power_mod(b, e, m):
    r = 1; b %= m
    while e:
        if e & 1: r = r * b % m
        b = b * b % m
        e >>= 1
    return r
'''
C_SIEVE='''#include <stdio.h>
#include <string.h>
int main() {
    int l, r; scanf("%d %d", &l, &r);
    static char comp[1000001];
    memset(comp, 0, sizeof comp);
    for (long long i = 2; i * i <= r; i++)
        if (!comp[i])
            for (long long j = i * i; j <= r; j += i) comp[j] = 1;
    int cnt = 0;
    for (int x = (l < 2 ? 2 : l); x <= r; x++) if (!comp[x]) cnt++;
    printf("%d\\n", cnt);
    return 0;
}'''
def ns(s):
    d={};exec(s,d);return d
CY=ns(D_CYC);SV=ns(D_SIEVE);PW=ns(D_POW)
def beats_brute(B):
    n=len(B);cur=list(range(1,n+1));t=0
    while True:
        nxt=[0]*n
        for i,x in enumerate(cur):nxt[B[i]-1]=x
        cur=nxt;t+=1
        if cur==list(range(1,n+1)):return t
random.seed(11)
for _ in range(200):
    n=random.randint(1,7);B=list(range(1,n+1));random.shuffle(B)
    assert CY['beats'](B)==beats_brute(B)
for _ in range(100):
    b=random.randint(0,30);e=random.randint(0,30);m=random.randint(1,50)
    assert PW['power_mod'](b,e,m)==pow(b,e,m)
for l,r in((1,50),(10,100),(90,100)):
    assert SV['primes_in_range'](l,r)==[x for x in range(max(l,2),r+1) if all(x%d for d in range(2,int(x**.5)+1))]
def f_cycles():
    f,ax=plt.subplots(figsize=(8,2.9));ax.set_aspect('equal');ax.axis('off');ax.set_xlim(0,10);ax.set_ylim(0,3.2)
    def ring(cx,items,col):
        n=len(items)
        for i,t in enumerate(items):
            a=math.pi/2-i*2*math.pi/n;x,y=cx+0.9*math.cos(a),1.6+0.9*math.sin(a)
            ax.add_patch(Circle((x,y),0.3,fc=col,ec='#14213d'));ax.text(x,y,str(t),ha='center',va='center',fontweight='bold')
            a2=math.pi/2-(i+1)*2*math.pi/n;x2,y2=cx+0.9*math.cos(a2),1.6+0.9*math.sin(a2)
            ax.annotate('',xy=(x2+0.0,y2),xytext=(x,y),arrowprops=dict(arrowstyle='-|>',color='#6b7280',shrinkA=10,shrinkB=10))
    ring(2.0,[1,2,3],'#bfdbfe');ring(5.0,[4,5],'#fde68a')
    ax.text(8.0,1.6,'B = [2,3,1,5,4]\ncycles: (1 2 3) and (4 5)\nlengths 3 and 2\nanswer = LCM(3, 2) = 6',fontsize=10,va='center',fontweight='bold',color='#be123c')
    save(f,'ac5_cyc')
f_cycles()
def html():
    h=top('Math and Number Theory for Coding','ADVANCED CODING · MATH · MUST-DO','#7c3aed')
    h+=intro('TCS likes problems wearing a story but hiding a small piece of maths: gcd/lcm, primes, modular arithmetic, digits, or the cycles of a permutation. Learn the four tools below and you can recognise most of them.')
    h+=form('Tools',['<b>gcd(a, b)</b> by Euclid in O(log n); <b>lcm = a·b / gcd</b>.','<b>Sieve of Eratosthenes</b> lists all primes up to n in O(n log log n).','<b>Fast power:</b> compute b^e mod m in O(log e).','<b>Digits:</b> <code>n % 10</code> is the last digit, <code>n // 10</code> removes it.','<b>Permutation cycles:</b> follow i → B[i]; the number of steps to return to the start is the cycle length. After t steps all return home when t is a multiple of every cycle length (LCM).','<b>Divisors:</b> loop only up to √n and pair d with n/d.','<b>Overflow:</b> multiply before taking the modulus only if the product fits in 64 bits.'])
    h+=h3('1. Beats of the drum (cycles and LCM)')
    h+=p('A permutation B of 1..N is given. Each beat moves the student at index i to index B[i]. After how many beats are all students back in the original order? This is a real TCS problem.')
    h+=fig('ac5_cyc','Students move along cycles; the answer is the LCM of the cycle lengths.')
    h+=cbp('python',D_CYC+'\nn = int(input())\nB = list(map(int, input().split()))\nprint(beats(B))\n','5\n2 3 1 5 4',6)
    h+=ex('B = [2, 3, 1, 5, 4]. How many beats?','6','Cycles (1 2 3) and (4 5), lengths 3 and 2, LCM = 6. The code matched a direct simulation on 200 random permutations.')
    h+=h3('2. Primes in a range (sieve)')
    h+=cbp('c',C_SIEVE,'1 100',25)
    h+=ex('How many primes are there between 1 and 100?','25','The C program built a sieve up to 100 and printed 25.')
    h+=ex('List the primes between 90 and 100.',str(SV['primes_in_range'](90,100)),'Only 97 survives the sieve; checked against trial division for three ranges.')
    h+=h3('3. Fast modular power')
    h+=cbp('python',D_POW+'\nprint(power_mod(2, 100, 1000000007))\n','',pow(2,100,10**9+7))
    h+=ex('Compute 2¹⁰⁰ mod 1,000,000,007.',str(pow(2,100,10**9+7)),'Square-and-multiply needs about 7 steps. Compared with Python’s built-in pow on 100 random cases.')
    h+=h3('4. Digit problems')
    h+=ex('Sum of the digits of all numbers from 1 to 99.',str(sum(sum(map(int,str(n))) for n in range(1,100))),'Computed by loop: each of the 10 digits 0–9 appears 10 times in each place, giving 2 × 10 × 45 = 900.')
    h+=tb(['Hidden maths','Spot it by','Use'],[['“after how many steps does it repeat”','Permutation','Cycle lengths + LCM'],['“divisible by”, “multiple of”','Remainders','Modulus, gcd'],['“number of divisors / factors”','Factors','Loop to √n'],['“prime numbers up to N”','Many queries','Sieve'],['“huge exponent, print mod 10⁹+7”','Large numbers','Fast power'],['“digits of the number”','Reversal, sum','% 10 and // 10']],'sm')
    h+=tips(['In Python, <code>pow(b, e, m)</code> is already fast modular power.','If N ≤ 10⁷, a sieve fits in memory; if N is 10¹² and you test one number, use trial division to √N.','Take the modulus after each multiplication to avoid overflow.'])
    h+=warn(['Using a sieve when N is 10¹⁸.','Forgetting that 1 is not prime.','Overflowing <code>int</code> in <code>a*b</code> before the modulus (use <code>long long</code>).'])
    items=[('gcd(84, 36)?',str(math.gcd(84,36)),'B'),('lcm(12, 18)?',str(12*18//math.gcd(12,18)),'B'),('Beats for B = [1,2,3]?',str(CY['beats']([1,2,3])),'M'),('Beats for B = [2,1,4,3,6,5]?',str(CY['beats']([2,1,4,3,6,5])),'M'),('Beats for B = [2,3,4,5,1]?',str(CY['beats']([2,3,4,5,1])),'M'),('Primes between 10 and 50 (count)?',str(len(SV['primes_in_range'](10,50))),'M'),('Beats for B = [2,3,1,5,6,4,8,7]?',str(CY['beats']([2,3,1,5,6,4,8,7])),'A'),('3^50 mod 13?',str(pow(3,50,13)),'A'),('Last digit of 7^123?',str(pow(7,123,10)),'A'),('Number of divisors of 360?',str(sum(1 for d in range(1,361) if 360%d==0)),'A')]
    h+=pq('5. Math and number theory','Math practice',items)
    return h+end()
