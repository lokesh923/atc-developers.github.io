from acl import *
import random
CPP_BIT='''#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n; cin >> n;
    cout << __builtin_popcountll(n) << " "           // number of set bits
         << ((n & (n - 1)) == 0 && n > 0) << " "      // power of two?
         << (n & -n) << endl;                         // lowest set bit
}'''
D_SINGLE='''def single_number(a):
    x = 0
    for v in a:
        x ^= v                     # equal pairs cancel
    return x
'''
D_TOTAL='''def total_set_bits(n):
    total, p = 0, 1
    while p <= n:
        full, rem = divmod(n + 1, 2 * p)
        total += full * p + max(0, rem - p)
        p *= 2
    return total
'''
D_SUBS='''def xor_subsets_max(a):
    best = 0
    for mask in range(1 << len(a)):
        x = 0
        for i in range(len(a)):
            if mask >> i & 1: x ^= a[i]
        best = max(best, x)
    return best
'''
def ns(s):
    d={};exec(s,d);return d
SN=ns(D_SINGLE);TS=ns(D_TOTAL);XS=ns(D_SUBS)
random.seed(1)
for _ in range(100):
    n=random.randint(0,300)
    assert TS['total_set_bits'](n)==sum(bin(i).count('1') for i in range(n+1))
    a=[random.randint(1,20) for _ in range(random.randint(1,6))]
    d=random.randint(21,40);b=a+a+[d];random.shuffle(b);assert SN['single_number'](b)==d
tablefig('ac11_bits',['Goal','Expression','Example'],[['Check bit i','(n >> i) & 1','5 = 101: bit 2 → 1'],['Set bit i','n | (1 << i)','5 | 2 = 7'],['Clear bit i','n & ~(1 << i)','5 & ~1 = 4'],['Toggle bit i','n ^ (1 << i)','5 ^ 1 = 4'],['Lowest set bit','n & −n','12 & −12 = 4'],['Remove lowest set bit','n & (n − 1)','12 → 8'],['Power of two?','n > 0 and n & (n−1) == 0','16 → yes'],['Multiply / divide by 2^k','n << k / n >> k','3 << 2 = 12']],[2.4,3.2,2.6],title='Bit manipulation cheat table')
def html():
    h=top('Bit Manipulation','ADVANCED CODING · BITS · MEDIUM PRIORITY','#1d4ed8')
    h+=intro('Bit tricks solve problems in O(1) or O(n) that look harder: counting set bits, finding the single number that does not repeat, checking powers of two, and subset problems with n ≤ 20 using a bitmask. They are a small but reliable part of the section.')
    h+=fig('ac11_bits','The eight expressions that cover most questions.')
    h+=form('Key facts',['<b>XOR:</b> a ^ a = 0 and a ^ 0 = a, so XOR-ing all numbers cancels pairs.','<b>AND with (n−1)</b> removes the lowest set bit; repeating it counts set bits.','<b>Bitmask subsets:</b> for mask in 0..2ⁿ−1, bit i says whether item i is chosen.','<b>Shifts:</b> n << k multiplies by 2ᵏ; n >> k divides (floor).','<b>In C/C++/Java use 1LL / 1L</b> for shifts beyond 31 bits.'])
    h+=h3('1. Popcount, power of two and lowest set bit')
    h+=cbp('cpp',CPP_BIT,'40','2 0 8')
    h+=ex('For n = 40 (binary 101000): set bits, power of two (1/0), lowest set bit.','2 0 8','101000 has two 1s; it is not a power of two; the lowest set bit is 1000₂ = 8. The C++ program printed 2 0 8.')
    h+=h3('2. The single number')
    h+=cbp('python',D_SINGLE+'\nprint(single_number([4, 1, 2, 1, 2]))\n','',4)
    h+=ex('Every number appears twice except one: [4, 1, 2, 1, 2].','4','1^1 = 0 and 2^2 = 0, leaving 4. Checked on 100 random arrays.')
    h+=h3('3. Total set bits from 1 to n')
    h+=cbp('python',D_TOTAL+'\nprint(total_set_bits(10), total_set_bits(100))\n','',f'{TS["total_set_bits"](10)} {TS["total_set_bits"](100)}')
    h+=ex('Total number of 1-bits in all numbers from 1 to 100.',str(TS['total_set_bits'](100)),'Each bit position repeats in blocks; the formula counts full blocks and the partial tail. Verified against a direct count for n ≤ 300.')
    h+=h3('4. Maximum XOR of any subset (bitmask)')
    h+=cbp('python',D_SUBS+'\nprint(xor_subsets_max([3, 10, 5, 25, 2, 8]))\n','',XS['xor_subsets_max']([3,10,5,25,2,8]))
    h+=ex('Maximum XOR over all subsets of [3, 10, 5, 25, 2, 8].',str(XS['xor_subsets_max']([3,10,5,25,2,8])),'All 64 subsets are tried with a bitmask (n ≤ 20 is allowed).')
    h+=tb(['Signal','Trick'],[['“every element appears twice except one”','XOR everything'],['“count the 1s / number of set bits”','n & (n−1) loop or popcount'],['“is it a power of two”','n & (n−1) == 0'],['“all subsets” with small n','Bitmask loop'],['“swap without extra variable”','a ^= b; b ^= a; a ^= b'],['“divide / multiply by power of 2”','Shifts']],'sm')
    h+=tips(['Use <code>bin(n).count("1")</code> or <code>n.bit_count()</code> in Python.','Draw the binary form of a small example before coding.','Operator precedence: always put parentheses around bit operations (<code>(n &gt;&gt; i) &amp; 1</code>).'])
    h+=warn(['Using 1 &lt;&lt; i with i ≥ 31 in C/Java <code>int</code>.','Forgetting parentheses with comparisons: <code>n &amp; 1 == 0</code> parses as <code>n &amp; (1 == 0)</code> in C.','Using bitmask for n = 40 (2⁴⁰ is too large).'])
    items=[('Set bits of 13 (1101)?',str(bin(13).count('1')),'B'),('Is 64 a power of two? (1/0)','1','B'),('XOR of [5,7,5]?',str(SN['single_number']([5,7,5])),'M'),('Lowest set bit of 24?',str(24&-24),'M'),('Total set bits 1..16?',str(TS['total_set_bits'](16)),'M'),('Single number in [2,3,5,4,5,3,4]?',str(SN['single_number']([2,3,5,4,5,3,4])),'A'),('Max subset XOR of [1,2,4]?',str(XS['xor_subsets_max']([1,2,4])),'A'),('How many subsets (including empty) does a 10-element set have?',str(2**10),'A')]
    h+=pq('11. Bit manipulation','Practice',items)
    return h+end()
