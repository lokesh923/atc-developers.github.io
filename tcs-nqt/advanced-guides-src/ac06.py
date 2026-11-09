from acl import *
import random,itertools,bisect
D_STAIR='''def ways(n):
    a, b = 1, 1                    # ways(0), ways(1)
    for _ in range(n - 1):
        a, b = b, a + b
    return b if n >= 1 else 1
'''
D_COIN='''def min_coins(coins, amount):
    INF = float("inf")
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] != INF else -1
'''
D_LIS='''def lis(a):
    tails = []
    for x in a:
        i = bisect.bisect_left(tails, x)
        if i == len(tails): tails.append(x)
        else: tails[i] = x
    return len(tails)
'''
D_ED='''def edit_distance(s, t):
    m, n = len(s), len(t)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s[i-1] == t[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]
'''
CPP_KN='''#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, W; cin >> n >> W;
    vector<int> w(n), v(n);
    for (auto &x : w) cin >> x;
    for (auto &x : v) cin >> x;
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < n; i++)
        for (int c = W; c >= w[i]; c--)          // backwards: each item used once
            dp[c] = max(dp[c], dp[c - w[i]] + v[i]);
    cout << dp[W] << endl;
}'''
def ns(s,extra=None):
    d={'bisect':bisect};exec(s,d);return d
ST=ns(D_STAIR);CO=ns(D_COIN);LI=ns(D_LIS);ED=ns(D_ED)
random.seed(9)
def kn_brute(w,v,W):
    best=0
    for m in range(1<<len(w)):
        ww=sum(w[i] for i in range(len(w)) if m>>i&1)
        if ww<=W:best=max(best,sum(v[i] for i in range(len(w)) if m>>i&1))
    return best
def ed_rec(s,t):
    from functools import lru_cache
    @lru_cache(None)
    def f(i,j):
        if i==len(s):return len(t)-j
        if j==len(t):return len(s)-i
        if s[i]==t[j]:return f(i+1,j+1)
        return 1+min(f(i+1,j),f(i,j+1),f(i+1,j+1))
    return f(0,0)
for _ in range(150):
    n=random.randint(1,12);assert ST['ways'](n)==(lambda n:(lambda f:f(f,n))(lambda f,k:1 if k<=1 else f(f,k-1)+f(f,k-2)))(n)
    coins=random.sample([1,2,3,4,5,7,10],random.randint(1,4));amt=random.randint(0,20)
    bf=None
    for k in range(0,amt+1):
        if any(sum(c)==amt for c in itertools.combinations_with_replacement(coins,k)):bf=k;break
    assert CO['min_coins'](coins,amt)==(bf if bf is not None else -1),(coins,amt)
    a=[random.randint(1,9) for _ in range(random.randint(1,9))]
    bfl=max(len(c) for k in range(1,len(a)+1) for c in itertools.combinations(a,k) if all(c[i]<c[i+1] for i in range(len(c)-1)))
    assert LI['lis'](a)==bfl
    s=''.join(random.choice('abc') for _ in range(random.randint(0,6)));t=''.join(random.choice('abc') for _ in range(random.randint(0,6)))
    assert ED['edit_distance'](s,t)==ed_rec(s,t)
def f_dp():
    f,ax=plt.subplots(figsize=(8.4,2.6));ax.axis('off');ax.set_xlim(0,11);ax.set_ylim(0,3)
    t=['Define state\ndp[i] = …','Base case\ndp[0] = …','Transition\ndp[i] from smaller','Order of\nfilling','Answer\ndp[n]']
    for i,x in enumerate(t):
        ax.add_patch(FancyBboxPatch((0.2+i*2.15,0.7),1.9,1.5,boxstyle='round,pad=0.03',fc=['#dbeafe','#fde68a','#dcfce7','#fecaca','#e9d5ff'][i],ec='#14213d'));ax.text(1.15+i*2.15,1.45,x,ha='center',va='center',fontsize=9,fontweight='bold')
        if i<4:arrow(ax,(2.1+i*2.15,1.45),(2.35+i*2.15,1.45))
    ax.text(5.5,0.3,'Every DP problem: state → base → transition → order → answer',ha='center',fontsize=10.5,fontweight='bold',color='#be123c');save(f,'ac6_dp')
f_dp()
def html():
    h=top('Dynamic Programming','ADVANCED CODING · DP · MUST-DO FOR DIGITAL AND PRIME','#b45309')
    h+=intro('Dynamic programming (DP) is “recursion with memory”. If a problem asks for the <b>minimum, maximum, or number of ways</b> and the same sub-problem repeats, write the answer for a small input, then build the answer for a bigger input from the smaller ones. Five steps are enough for almost every problem.')
    h+=fig('ac6_dp','The five-step DP recipe.')
    h+=form('Classic patterns',['<b>1-D (ways / min cost):</b> staircase, coin change: dp[i] from dp[i−1], dp[i−2], dp[i−coin].','<b>0/1 knapsack:</b> dp[c] = max(dp[c], dp[c − w] + v) with c looping <b>downwards</b>.','<b>Unbounded knapsack (coin change):</b> c loops <b>upwards</b>, because an item may be reused.','<b>LIS:</b> O(n²) DP or O(n log n) with “tails” and binary search.','<b>Two strings (LCS, edit distance):</b> dp[i][j] over prefixes.','<b>Grid paths:</b> dp[i][j] = dp[i−1][j] + dp[i][j−1].'])
    h+=h3('1. Staircase ways')
    h+=cbp('python',D_STAIR+'\nprint(ways(int(input())))\n','10',89)
    h+=ex('Ways to climb 10 steps taking 1 or 2 at a time.',str(ST['ways'](10)),'ways(n) = ways(n−1) + ways(n−2), which is the Fibonacci sequence. Verified against plain recursion for n up to 12.')
    h+=h3('2. Minimum coins')
    h+=cbp('python',D_COIN+'\nprint(min_coins([1, 5, 6, 9], 11))\n','',2)
    h+=ex('Coins 1, 5, 6, 9; amount 11. Minimum coins?',str(CO['min_coins']([1,5,6,9],11)),'Greedy would take 9 + 1 + 1 (three coins); DP finds 5 + 6 (two coins). This is why greedy is unsafe here. Verified against exhaustive search on 150 random cases.')
    h+=h3('3. 0/1 knapsack')
    h+=cbp('cpp',CPP_KN,'4 8\n1 3 4 5\n10 40 50 70',110)
    h+=ex('Weights 1, 3, 4, 5; values 10, 40, 50, 70; capacity 8.',str(kn_brute([1,3,4,5],[10,40,50,70],8)),'Items of weight 3 and 5 give value 40 + 70 = 110. The C++ program printed 110 and matches brute-force enumeration of all subsets.')
    h+=h3('4. Longest increasing subsequence')
    h+=cbp('python','import bisect\n'+D_LIS+'\nprint(lis([10, 9, 2, 5, 3, 7, 101, 18]))\n','',4)
    h+=ex('LIS of 10, 9, 2, 5, 3, 7, 101, 18.',str(LI['lis']([10,9,2,5,3,7,101,18])),'For example 2, 3, 7, 18 (length 4). The “tails” list stores the smallest possible ending of each length.')
    h+=h3('5. Edit distance')
    h+=cbp('python',D_ED+'\nprint(edit_distance("kitten", "sitting"))\n','',3)
    h+=ex('Edit distance between “kitten” and “sitting”.',str(ED['edit_distance']('kitten','sitting')),'Substitute k→s, substitute e→i, insert g. Verified against a recursive search on 150 random string pairs.')
    h+=tb(['Wording','DP type','State'],[['“number of ways”','Counting','dp[i] = ways to reach i'],['“minimum cost / coins”','Optimisation','dp[amount]'],['“subset with value ≤ W”','Knapsack','dp[capacity]'],['“longest … subsequence”','LIS / LCS','dp[i] or dp[i][j]'],['“convert string A to B”','Edit distance','dp[i][j]'],['“paths in a grid”','Grid DP','dp[i][j]']],'sm')
    h+=tips(['First write the plain recursion; then add a memo (<code>lru_cache</code> in Python).','Check the order of loops: 0/1 knapsack backwards, unbounded forwards.','If the table is too big, keep only the previous row.'])
    h+=warn(['Greedy where DP is needed (coin change).','Forgetting the base case dp[0].','Using INF and then adding to it (overflow).','Looping capacity upwards in 0/1 knapsack (it reuses items).'])
    items=[('Ways to climb 5 steps (1 or 2)?',str(ST['ways'](5)),'B'),('Min coins for 7 with coins 1,3,4?',str(CO['min_coins']([1,3,4],7)),'B'),('Min coins for 3 with coins [2]?',str(CO['min_coins']([2],3)),'M'),('LIS of 0,8,4,12,2,10,6,14,1,9?',str(LI['lis']([0,8,4,12,2,10,6,14,1,9])),'M'),('Edit distance “horse” → “ros”?',str(ED['edit_distance']('horse','ros')),'M'),('Knapsack: w=[2,3,4,5], v=[3,4,5,6], W=5?',str(kn_brute([2,3,4,5],[3,4,5,6],5)),'M'),('Min coins for 12 with coins 1,5,6?',str(CO['min_coins']([1,5,6],12)),'A'),('Edit distance “intention” → “execution”?',str(ED['edit_distance']('intention','execution')),'A'),('Ways to climb 20 steps (1 or 2)?',str(ST['ways'](20)),'A'),('LIS of 3,10,2,1,20?',str(LI['lis']([3,10,2,1,20])),'A')]
    h+=pq('6. Dynamic programming','DP practice',items)
    return h+end()
