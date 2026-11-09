from acl import *
import random,bisect
D_MERGE='''def merge(iv):
    iv.sort()
    out = [iv[0][:]]
    for s, e in iv[1:]:
        if s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out
'''
D_PLAT='''def platforms(arr, dep):
    arr.sort(); dep.sort()
    i = j = cur = best = 0
    while i < len(arr):
        if arr[i] <= dep[j]:
            cur += 1; i += 1
            best = max(best, cur)
        else:
            cur -= 1; j += 1
    return best
'''
D_SHIP='''def min_capacity(w, days):
    lo, hi = max(w), sum(w)
    while lo < hi:
        mid = (lo + hi) // 2
        d, load = 1, 0
        for x in w:
            if load + x > mid:
                d += 1; load = 0
            load += x
        if d <= days:
            hi = mid
        else:
            lo = mid + 1
    return lo
'''
CPP_LB='''#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, x; cin >> n >> x;
    vector<int> a(n);
    for (auto &v : a) cin >> v;
    int i = lower_bound(a.begin(), a.end(), x) - a.begin();   // first position >= x
    if (i < n && a[i] == x) cout << i << endl; else cout << -1 << endl;
}'''
def ns(s):
    d={};exec(s,d);return d
MG=ns(D_MERGE);PL=ns(D_PLAT);SH=ns(D_SHIP)
random.seed(5)
for _ in range(200):
    iv=[]
    for _ in range(random.randint(1,6)):
        s=random.randint(0,15);iv.append([s,s+random.randint(0,5)])
    pts=set()
    for s,e in iv:pts.update(range(s,e+1))
    m=MG['merge']([x[:] for x in iv]);cov=set()
    for s,e in m:cov.update(range(s,e+1))
    assert pts==cov and all(m[i][1]<m[i+1][0] for i in range(len(m)-1))
    arr=[random.randint(0,20) for _ in range(random.randint(1,6))];dep=[a+random.randint(0,6) for a in arr]
    bf=max(sum(1 for a,d in zip(arr,dep) if a<=t<=d) for t in range(0,40))
    assert PL['platforms'](arr[:],dep[:])==bf
    w=[random.randint(1,9) for _ in range(random.randint(1,7))];days=random.randint(1,len(w))
    def feas(c):
        d,l=1,0
        for x in w:
            if x>c:return False
            if l+x>c:d+=1;l=0
            l+=x
        return d<=days
    bf=next(c for c in range(1,sum(w)+1) if feas(c))
    assert SH['min_capacity'](w,days)==bf
def html():
    h=top('Sorting, Binary Search and Greedy','ADVANCED CODING · SORT, SEARCH, GREEDY · MUST-DO','#0f7d6b')
    h+=intro('If the order of the data does not matter, <b>sort it first</b>: many hard-looking problems (intervals, schedules, pairs) become one pass. If the data is sorted or the answer lies in a range, <b>binary search</b> halves the work each time. <b>Greedy</b> means making the locally best choice; it works only when you can argue why it never hurts.')
    h+=form('Patterns',['<b>Sort then scan:</b> intervals, meeting rooms, minimum platforms.','<b>lower_bound / bisect_left:</b> first position with value ≥ x. <b>bisect_right:</b> first position with value > x.','<b>Binary search on the answer:</b> if “answer ≤ X is feasible” is monotonic, search X between low and high.','<b>Greedy proof idea:</b> exchange argument — swapping to the greedy choice never makes the answer worse.','<b>Canonical coin systems (1, 2, 5, 10, …):</b> greedy works. For arbitrary coins, use DP (Chapter 6).','<b>Custom sort:</b> sort by end time (activity selection), by ratio (fractional knapsack).'])
    h+=h3('1. First occurrence in a sorted array')
    h+=cbp('cpp',CPP_LB,'8 4\n1 2 4 4 4 6 7 9',2)
    h+=ex('First index of 4 in [1,2,4,4,4,6,7,9].','2','lower_bound returns the first position whose value is ≥ 4. The C++ program printed 2.')
    h+=h3('2. Merge overlapping intervals')
    h+=cbp('python',D_MERGE+'\nprint(merge([[1,3],[2,6],[8,10],[15,18],[9,11]]))\n','',[[1,6],[8,11],[15,18]])
    h+=ex('Merge [1,3], [2,6], [8,10], [15,18], [9,11].','[[1, 6], [8, 11], [15, 18]]','Sort by start. [1,3] and [2,6] merge; [8,10] and [9,11] merge. Checked on 200 random interval sets.')
    h+=h3('3. Minimum platforms')
    h+=cbp('python',D_PLAT+'\nprint(platforms([900,940,950,1100,1500,1800],[910,1200,1120,1130,1900,2000]))\n','',3)
    h+=ex('Arrivals 900, 940, 950, 1100, 1500, 1800; departures 910, 1200, 1120, 1130, 1900, 2000. Minimum platforms?','3','Sort both lists; add a platform when the next arrival is not after the earliest departure. At 11:00 three trains (940, 950, 1100) are in the station. Verified against a brute-force check at every time.')
    h+=h3('4. Binary search on the answer')
    h+=p('Packages of given weights must be shipped in order within D days. Find the smallest ship capacity. The answer lies between max(weights) and sum(weights), and “capacity X works” is monotonic.')
    h+=cbp('python',D_SHIP+'\nprint(min_capacity([1,2,3,4,5,6,7,8,9,10], 5))\n','',15)
    h+=ex('Weights 1..10 in order, 5 days. Smallest capacity?','15','Feasibility is checked in O(n); the search takes O(n log(sum)). Compared with a linear search on 200 random cases.')
    h+=tb(['Signal','Technique','Typical cost'],[['“minimum platforms / rooms”','Sort + two pointers','O(n log n)'],['“overlapping intervals”','Sort by start, merge','O(n log n)'],['“first / last occurrence”','Binary search','O(log n)'],['“minimum possible maximum”','Binary search on answer','O(n log range)'],['“maximum number of tasks”','Greedy by end time','O(n log n)'],['“smallest number of coins” (canonical)','Greedy','O(n)']],'sm')
    h+=tips(['When a problem asks for “minimum of the maximum” or “maximum of the minimum”, think binary search on the answer.','Always sort a copy if the original order is needed later.','In C++ sort pairs by <code>second</code> using a lambda comparator.'])
    h+=warn(['Using greedy for coin change with unusual coins.','Binary search with <code>mid = (lo+hi)/2</code> and an infinite loop when <code>lo = mid</code> is used.','Not handling equal values in the interval condition (<code>s &lt;= end</code> vs <code>s &lt; end</code>).'])
    items=[('First index of 7 in [1,3,7,7,9] (0-based)?',str(bisect.bisect_left([1,3,7,7,9],7)),'B'),('Merge [1,4],[4,5]. How many intervals?',str(len(MG['merge']([[1,4],[4,5]]))),'B'),('How many merged intervals: [1,2],[3,4],[2,3]?',str(len(MG['merge']([[1,2],[3,4],[2,3]]))),'M'),('Minimum platforms: arrivals 900,940 departures 910,1200?',str(PL['platforms']([900,940],[910,1200])),'M'),('Smallest capacity: weights [3,2,2,4,1,4], 3 days?',str(SH['min_capacity']([3,2,2,4,1,4],3)),'M'),('Smallest capacity: weights [1,2,3,1,1], 4 days?',str(SH['min_capacity']([1,2,3,1,1],4)),'A'),('Minimum platforms: arrivals 100,110,120, departures 200,210,220?',str(PL['platforms']([100,110,120],[200,210,220])),'A'),('Count of values ≤ 5 in sorted [1,2,5,5,7,9]?',str(bisect.bisect_right([1,2,5,5,7,9],5)),'A')]
    h+=pq('4. Sorting, search and greedy','Practice',items)
    return h+end()
