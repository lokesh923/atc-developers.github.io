from acl import *
import itertools,random
D_SUB='''def subsets_with_sum(a, k):
    count = 0
    def go(i, total):
        nonlocal count
        if i == len(a):
            if total == k: count += 1
            return
        go(i + 1, total + a[i])    # take a[i]
        go(i + 1, total)           # skip a[i]
    go(0, 0)
    return count
'''
D_PERM='''def permutations(s):
    out = []
    def go(path, used):
        if len(path) == len(s):
            out.append("".join(path)); return
        for i in range(len(s)):
            if not used[i]:
                used[i] = True; path.append(s[i])
                go(path, used)
                path.pop(); used[i] = False   # undo (backtrack)
    go([], [False] * len(s))
    return out
'''
D_NQ='''def n_queens(n):
    cols, d1, d2 = set(), set(), set()
    def go(r):
        if r == n: return 1
        total = 0
        for c in range(n):
            if c in cols or r - c in d1 or r + c in d2: continue
            cols.add(c); d1.add(r - c); d2.add(r + c)
            total += go(r + 1)
            cols.remove(c); d1.remove(r - c); d2.remove(r + c)
        return total
    return go(0)
'''
CPP_COMB='''#include <bits/stdc++.h>
using namespace std;
int n, k; vector<int> cur; int cnt = 0;
void go(int start) {
    if ((int)cur.size() == k) { cnt++; return; }
    for (int i = start; i <= n; i++) { cur.push_back(i); go(i + 1); cur.pop_back(); }
}
int main() { cin >> n >> k; go(1); cout << cnt << endl; }'''
def ns(s):
    d={};exec(s,d);return d
SS=ns(D_SUB);PM=ns(D_PERM);NQ=ns(D_NQ)
random.seed(2)
for _ in range(100):
    a=[random.randint(1,6) for _ in range(random.randint(1,8))];k=random.randint(1,15)
    assert SS['subsets_with_sum'](a,k)==sum(1 for m in range(1<<len(a)) if sum(a[i] for i in range(len(a)) if m>>i&1)==k)
for s in('abc','abcd','aab'):
    assert sorted(PM['permutations'](s))==sorted(''.join(p) for p in itertools.permutations(s))
def f_tree():
    f,ax=plt.subplots(figsize=(8,3.2));ax.axis('off');ax.set_xlim(0,10);ax.set_ylim(0,4)
    pts={'':(5,3.5),'a':(2.5,2.4),'b':(7.5,2.4),'ab':(1.4,1.2),'a_':(3.6,1.2),'b_':(6.4,1.2),'∅':(8.6,1.2)}
    nm={'':'start','a':'take a','b':'skip a','ab':'take b','a_':'skip b','b_':'take b','∅':'skip b'}
    for k,(x,y) in pts.items():
        ax.add_patch(FancyBboxPatch((x-0.8,y-0.28),1.6,0.56,boxstyle='round,pad=0.02',fc='#bfdbfe',ec='#14213d'));ax.text(x,y,nm[k],ha='center',va='center',fontsize=9,fontweight='bold')
    for a,b in(('','a'),('','b'),('a','ab'),('a','a_'),('b','b_'),('b','∅')):ax.plot([pts[a][0],pts[b][0]],[pts[a][1]-0.28,pts[b][1]+0.28],color='#14213d')
    ax.text(5,0.35,'Each level makes one choice: 2 choices × n levels = 2ⁿ leaves ({a,b} → {a,b} {a} {b} {})',ha='center',fontsize=10,fontweight='bold',color='#be123c');save(f,'ac7_tree')
f_tree()
def html():
    h=top('Recursion and Backtracking','ADVANCED CODING · RECURSION · IMPORTANT','#0e7490')
    h+=intro('Backtracking means: <b>choose, explore, undo</b>. It is the tool for “generate all”, “count all ways” and puzzles with small input (n ≤ 20). It is slow by nature (2ⁿ or n!), so look at the constraint before using it. If n is large, you probably need DP or greedy instead.')
    h+=fig('ac7_tree','A decision tree: at each element, take it or skip it.')
    h+=form('Template',['<b>1.</b> Base case: when the path is complete, record or count it.','<b>2.</b> Loop over choices that are still valid.','<b>3.</b> Make the choice, recurse, <b>undo the choice</b>.','<b>Prune early:</b> stop as soon as the partial answer cannot work (sum already too large, queen attacked).','<b>Sizes:</b> subsets 2ⁿ (n ≤ 20); permutations n! (n ≤ 9); N-Queens roughly n! with pruning (n ≤ 12).','Python recursion limit is 1000; raise it with <code>sys.setrecursionlimit</code> or use a loop.'])
    h+=h3('1. Count subsets with sum K')
    h+=cbp('python',D_SUB+'\nprint(subsets_with_sum([2, 3, 5, 6, 8, 10], 10))\n','',3)
    h+=ex('Subsets of 2, 3, 5, 6, 8, 10 with sum 10.',str(SS['subsets_with_sum']([2,3,5,6,8,10],10)),'{10}, {2, 8}, {2, 3, 5}. Compared with a bitmask enumeration on 100 random inputs.')
    h+=h3('2. All permutations')
    h+=cbp('python',D_PERM+'\nprint(permutations("abc"))\n','',"['abc', 'acb', 'bac', 'bca', 'cab', 'cba']")
    h+=ex('Number of permutations of “abcd”.',str(len(PM['permutations']('abcd'))),'4! = 24. The “undo” lines (pop and used = False) are what make backtracking correct.')
    h+=h3('3. Combinations C(n, k) by recursion')
    h+=cbp('cpp',CPP_COMB,'6 3',20)
    h+=ex('How many ways to choose 3 numbers from 1..6?','20','C(6,3) = 20. The C++ program printed 20.')
    h+=h3('4. N-Queens (count placements)')
    h+=cbp('python',D_NQ+'\nprint([n_queens(n) for n in range(1, 9)])\n','','[1, 0, 0, 2, 10, 4, 40, 92]')
    h+=ex('Number of ways to place 8 non-attacking queens on an 8 × 8 board.',str(NQ['n_queens'](8)),'The famous 92 solutions. Row, column and both diagonals are tracked in sets so each check is O(1).')
    h+=tb(['Signal','Technique','Limit'],[['“generate all subsets”','Take / skip','n ≤ 20'],['“all arrangements”','Permutation backtracking','n ≤ 9'],['“place without attacking”','Prune with sets','n ≤ 12'],['“count ways”, large n','DP, not backtracking','—'],['“maze all paths”','DFS with visited','small grid']],'sm')
    h+=tips(['Draw the decision tree for a tiny input first.','Add pruning: if sum &gt; K and all numbers are positive, return at once.','If sub-problems repeat, add memoisation: it becomes DP.'])
    h+=warn(['Forgetting to undo the choice.','Appending the same list object instead of a copy when saving a path.','Using recursion where n = 10⁵ (stack overflow).'])
    items=[('Permutations of “abc”: how many?',str(len(PM['permutations']('abc'))),'B'),('Subsets of {1,2,3,4}: how many?',str(2**4),'B'),('Subsets of [1,2,3,4,5] with sum 5?',str(SS['subsets_with_sum']([1,2,3,4,5],5)),'M'),('N-Queens count for n = 5?',str(NQ['n_queens'](5)),'M'),('N-Queens count for n = 6?',str(NQ['n_queens'](6)),'M'),('Distinct permutations of “aab”?',str(len(set(PM['permutations']('aab')))),'A'),('Subsets of [3,34,4,12,5,2] with sum 9?',str(SS['subsets_with_sum']([3,34,4,12,5,2],9)),'A'),('N-Queens count for n = 7?',str(NQ['n_queens'](7)),'A')]
    h+=pq('7. Recursion and backtracking','Practice',items)
    return h+end()
