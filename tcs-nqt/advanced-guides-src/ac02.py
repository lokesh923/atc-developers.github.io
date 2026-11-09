from acl import *
import random
DEF_K='''def max_subarray(a):
    best = cur = a[0]
    for x in a[1:]:
        cur = max(x, cur + x)      # extend or restart
        best = max(best, cur)
    return best
'''
DEF_SUMK='''def count_sum_k(a, k):
    seen = {0: 1}                  # prefix sum -> how many times seen
    pre = ans = 0
    for x in a:
        pre += x
        ans += seen.get(pre - k, 0)
        seen[pre] = seen.get(pre, 0) + 1
    return ans
'''
DEF_WIN='''def longest_unique(s):
    last = {}
    start = best = 0
    for i, ch in enumerate(s):
        if ch in last and last[ch] >= start:
            start = last[ch] + 1   # shrink window
        last[ch] = i
        best = max(best, i - start + 1)
    return best
'''
DEF_TWO='''def pairs_with_sum(a, k):
    a = sorted(a)
    i, j, cnt = 0, len(a) - 1, 0
    while i < j:
        s = a[i] + a[j]
        if s == k:
            cnt += 1; i += 1; j -= 1
        elif s < k:
            i += 1
        else:
            j -= 1
    return cnt
'''
CPP_SUMK='''#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; long long k; cin >> n >> k;
    unordered_map<long long,long long> seen; seen[0] = 1;
    long long pre = 0, ans = 0;
    for (int i = 0; i < n; i++) {
        long long x; cin >> x; pre += x;
        if (seen.count(pre - k)) ans += seen[pre - k];
        seen[pre]++;
    }
    cout << ans << endl;
}'''
def ns(src):
    d={};exec(src,d);return d
K=ns(DEF_K);SK=ns(DEF_SUMK);WU=ns(DEF_WIN);TW=ns(DEF_TWO)
# brute-force checks
random.seed(7)
for _ in range(300):
    a=[random.randint(-5,5) for _ in range(random.randint(1,9))];k=random.randint(-4,6)
    assert K['max_subarray'](a)==max(sum(a[i:j]) for i in range(len(a)) for j in range(i+1,len(a)+1))
    assert SK['count_sum_k'](a,k)==sum(1 for i in range(len(a)) for j in range(i+1,len(a)+1) if sum(a[i:j])==k)
    s=''.join(random.choice('abc') for _ in range(random.randint(1,9)))
    assert WU['longest_unique'](s)==max(len(set(s[i:j])) if len(set(s[i:j]))==j-i else 0 for i in range(len(s)) for j in range(i+1,len(s)+1))
    b=[random.randint(1,6) for _ in range(random.randint(0,8))]
    # distinct index pairs via sorted two-pointer counts unique value pairs -> compare on distinct arrays
    bd=list(set(b));kk=random.randint(2,12)
    assert TW['pairs_with_sum'](bd,kk)==sum(1 for i in range(len(bd)) for j in range(i+1,len(bd)) if bd[i]+bd[j]==kk)
def f_pre():
    a=[2,1,3,4,2,5];pre=[0]
    for x in a:pre.append(pre[-1]+x)
    f,ax=plt.subplots(figsize=(8.4,2.6));ax.axis('off');ax.set_xlim(0,10);ax.set_ylim(0,3)
    for i,x in enumerate(a):
        ax.add_patch(Rectangle((0.7+i*1.4,1.6),1.2,0.8,fc='#bfdbfe',ec='#14213d'));ax.text(1.3+i*1.4,2.0,str(x),ha='center',va='center',fontweight='bold');ax.text(1.3+i*1.4,2.6,f'a[{i}]',ha='center',fontsize=8)
    for i,x in enumerate(pre):
        ax.text(0.1+i*1.4,1.0,str(x),ha='center',va='center',fontsize=10,color='#be123c',fontweight='bold')
    ax.text(5,0.3,'prefix[i] = a[0]+…+a[i−1]  ·  sum(l..r) = prefix[r+1] − prefix[l]   e.g. a[2..4] = 17 − 6 = 11',ha='center',fontsize=9.5,fontweight='bold')
    ax.text(5,2.95,'',ha='center');save(f,'ac2_pre')
f_pre()
def html():
    h=top('Arrays: Prefix Sums, Two Pointers, Sliding Window','ADVANCED CODING · ARRAYS · MUST-DO','#2563eb')
    h+=intro('Arrays are the most common topic: roughly half of all coding problems reduce to a running sum, two moving indices, or a hash map of what you have seen. If a problem says <b>“subarray”, “contiguous”, “pairs”, “longest/shortest segment”</b>, start here.')
    h+=fig('ac2_pre','Prefix sums turn any range sum into one subtraction.')
    h+=form('Patterns',['<b>Prefix sum:</b> sum(l..r) = prefix[r+1] − prefix[l]. O(n) to build, O(1) per query.','<b>Prefix + hash map:</b> to count subarrays with sum K, look up how many earlier prefixes equal (current − K).','<b>Kadane:</b> best subarray ending here = max(x, previous + x).','<b>Two pointers (sorted):</b> move i up if the sum is too small, j down if too large.','<b>Sliding window:</b> grow right end, shrink left end when the condition breaks. O(n).','<b>Difference array:</b> add v to l..r in O(1), rebuild with one pass.'])
    h+=h3('1. Maximum subarray sum (Kadane)')
    h+=p('Given an array with negative numbers, find the largest sum of a contiguous subarray. Brute force is O(n²); Kadane is O(n).')
    src=DEF_K+'\nn = int(input())\na = list(map(int, input().split()))\nprint(max_subarray(a))\n'
    h+=cbp('python',src,'9\n-2 1 -3 4 -1 2 1 -5 4',6)
    h+=ex('Maximum subarray sum of −2 1 −3 4 −1 2 1 −5 4.','6','The best segment is 4, −1, 2, 1 with sum 6. The code was checked against a brute-force search on 300 random arrays.')
    h+=h3('2. Subarrays with sum K (prefix sums + hash map)')
    h+=p('Count the contiguous subarrays whose sum is exactly K. A TCS problem (“rooms with exactly K coins”) is this pattern.')
    h+=cbp('cpp',CPP_SUMK,'5 7\n3 4 7 2 -3',2)
    h+=ex('Count subarrays of [3, 4, 7, 2, −3] with sum 7.',str(SK['count_sum_k']([3,4,7,2,-3],7)),'The segments are [3,4] and [7]. The C++ program above printed 2, and the Python version was compared with brute force on 300 random arrays.')
    h+=h3('3. Longest substring without repeating characters (sliding window)')
    src=DEF_WIN+'\nprint(longest_unique(input().strip()))\n'
    h+=cbp('python',src,'abcabcbb',3)
    h+=ex('Longest substring without repeating letters in “abcabcbb”.',str(WU['longest_unique']('abcabcbb')),'“abc” has length 3. The left end jumps just past the previous copy of a repeated letter.')
    h+=h3('4. Pairs with a given sum (two pointers)')
    src=DEF_TWO+'\nk = int(input())\na = list(map(int, input().split()))\nprint(pairs_with_sum(a, k))\n'
    h+=cbp('python',src,'10\n1 2 3 4 5 6 7 8 9',4)
    h+=ex('Pairs of distinct values in 1..9 with sum 10.',str(TW['pairs_with_sum'](list(range(1,10)),10)),'(1,9), (2,8), (3,7), (4,6). Sort first; two pointers finish in O(n log n).')
    h+=tb(['Wording','Pattern','Cost'],[['“largest sum of a contiguous part”','Kadane','O(n)'],['“number of subarrays with sum K”','Prefix + dict','O(n)'],['“longest substring with …”','Sliding window','O(n)'],['“pair with sum K” (sorted)','Two pointers','O(n)'],['“range sum, many queries”','Prefix array','O(1) each'],['“add v to l..r, many times”','Difference array','O(1) each']],'sm')
    h+=tips(['If negative numbers are present, sliding window for “sum = K” fails: use prefix + hash map.','Initialise the hash map with {0: 1} so subarrays starting at index 0 are counted.','Use 64-bit sums in C/C++/Java.'])
    h+=warn(['Using a sliding window on arrays that contain negatives.','Forgetting {0: 1} in the prefix map.','Using Kadane with the initial best = 0 (wrong when all numbers are negative).'])
    items=[('Max subarray sum of [5, −9, 6, −2, 3]?',str(K['max_subarray']([5,-9,6,-2,3])),'B'),('Max subarray sum of [−3, −1, −2]?',str(K['max_subarray']([-3,-1,-2])),'B'),('Subarrays of [1, 1, 1] with sum 2?',str(SK['count_sum_k']([1,1,1],2)),'M'),('Subarrays of [1, 2, 3, −3, 3] with sum 3?',str(SK['count_sum_k']([1,2,3,-3,3],3)),'M'),('Longest substring without repeats in “pwwkew”?',str(WU['longest_unique']('pwwkew')),'M'),('Longest substring without repeats in “abba”?',str(WU['longest_unique']('abba')),'A'),('Pairs summing to 8 in [1,2,3,4,5,6,7]?',str(TW['pairs_with_sum'](list(range(1,8)),8)),'A'),('Subarrays of [0, 0, 0, 0] with sum 0?',str(SK['count_sum_k']([0,0,0,0],0)),'A')]
    h+=pq('2. Arrays','Array practice',items)
    return h+end()
