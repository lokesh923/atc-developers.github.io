from acl import *
import json,random,itertools
P30=json.load(open(D+'/../plat/coding.json'))
S1='''from collections import Counter
def count_pairs(a, k):
    c = Counter(a); total = 0
    for x in c:
        if k == 0:
            total += c[x] * (c[x] - 1) // 2
        elif x + k in c:
            total += c[x] * c[x + k]
    return total
n, k = map(int, input().split())
a = list(map(int, input().split()))
print(count_pairs(a, k))
'''
S2='''def min_jumps(a):
    n = len(a)
    if n == 1: return 0
    jumps = cur_end = far = 0
    for i in range(n - 1):
        far = max(far, i + a[i])
        if i == cur_end:
            if far <= i: return -1
            jumps += 1; cur_end = far
            if cur_end >= n - 1: break
    return jumps
n = int(input())
a = list(map(int, input().split()))
print(min_jumps(a))
'''
S3='''MOD = 10**9 + 7
R, C = map(int, input().split())
g = [input().strip() for _ in range(R)]
dp = [[0] * C for _ in range(R)]
dp[0][0] = 1 if g[0][0] == "." else 0
for i in range(R):
    for j in range(C):
        if g[i][j] == "#": dp[i][j] = 0; continue
        if i: dp[i][j] += dp[i-1][j]
        if j: dp[i][j] += dp[i][j-1]
        dp[i][j] %= MOD
print(dp[R-1][C-1])
'''
def bf1(a,k):return sum(1 for i in range(len(a)) for j in range(i+1,len(a)) if abs(a[i]-a[j])==k)
def bf2(a):
    from collections import deque
    n=len(a);d={0:0};q=deque([0])
    while q:
        u=q.popleft()
        for v in range(u+1,min(n-1,u+a[u])+1):
            if v not in d:d[v]=d[u]+1;q.append(v)
    return d.get(n-1,-1)
def bf3(g):
    R,C=len(g),len(g[0])
    def rec(i,j):
        if g[i][j]=='#':return 0
        if (i,j)==(R-1,C-1):return 1
        return (rec(i+1,j) if i+1<R else 0)+(rec(i,j+1) if j+1<C else 0)
    return rec(0,0)%(10**9+7)
random.seed(21)
ns1={};exec(S1.split('n, k = map')[0],ns1);ns2={};exec(S2.split('n = int(input())')[0],ns2)
for _ in range(150):
    a=[random.randint(0,6) for _ in range(random.randint(1,8))];k=random.randint(0,4)
    assert ns1['count_pairs'](a,k)==bf1(a,k)
    b=[random.randint(0,3) for _ in range(random.randint(1,8))]
    assert ns2['min_jumps'](b)==bf2(b)
for _ in range(60):
    R,C=random.randint(1,5),random.randint(1,5)
    g=[''.join(random.choice('..#') for _ in range(C)) for _ in range(R)]
    ns3_out=run('python',S3,f'{R} {C}\n'+'\n'.join(g))
    assert int(ns3_out)==bf3(g),(g,ns3_out)
flow('ac13_dbg',['Run the\nsample','Wrong?\nprint states','Test n=1,\nall equal','Test max\nsize (time)','Check\noverflow'],'Debugging routine in the last 20 minutes')
A0=[1,5,3,4,2,3]
def html():
    h=top('Debugging, Edge Cases, Mini Test and Final Sheet','ADVANCED CODING · REVISION','#0f766e')
    h+=intro('Most lost marks come from <b>small mistakes</b>, not from missing the algorithm. This chapter gives you a debugging routine, a list of edge cases for every topic, a three-problem mini test with verified solutions, and a one-page cheat sheet.')
    h+=fig('ac13_dbg','Follow the same routine every time.')
    h+=h3('Edge-case checklist')
    h+=tb(['Topic','Always test'],[['Arrays','n = 1, n = 2, all equal, all negative, already sorted, maximum size'],['Strings','Empty or single character, all same letter, uppercase, spaces'],['Prefix sums','K = 0, zeros, subarray starting at index 0'],['Binary search','Value missing, duplicates, first and last element'],['DP','amount = 0, impossible case, n = 1'],['Grids','1 × 1, start or end blocked, no path'],['Math','0, 1, prime, very large value, mod arithmetic'],['Graphs','Disconnected, single node, repeated edges'],['Output','Exactly one answer per test, no extra spaces']],'sm')
    h+=form('Language checklist before you submit',['<b>C/C++:</b> <code>long long</code> for sums and products; array size fits the constraint; no uninitialised variables.','<b>Java:</b> class name must be <code>Main</code> (check the platform); fast input for large n.','<b>Python:</b> recursion limit; read all input quickly; avoid O(n²) loops over 10⁵ items.','<b>All:</b> print exactly the format asked; remove debug prints.'])
    PAIRS=', '.join(f'(a[{i}]={A0[i]}, a[{j}]={A0[j]})' for i in range(len(A0)) for j in range(i+1,len(A0)) if abs(A0[i]-A0[j])==2)
    h+=h3('Mini test: three problems (90 minutes)')
    h+=p('Try each problem yourself first. The solutions below are Python 3 and were run on the sample inputs and compared with a brute-force solver on random small cases.')
    h+=h4('Problem A (Medium): Pairs with difference K')
    h+=p('Given N integers and K, count pairs of positions (i &lt; j) with |a[i] − a[j]| = K. Input: N K, then the array.')
    h+=cbp('python',S1,'6 2\n1 5 3 4 2 3',run('python',S1,'6 2\n1 5 3 4 2 3'))
    h+=h4('Problem B (Medium): Minimum jumps')
    h+=p('a[i] is the maximum jump length from position i. Find the minimum number of jumps from index 0 to the last index, or −1 if impossible.')
    h+=cbp('python',S2,'6\n2 3 1 1 4 2',run('python',S2,'6\n2 3 1 1 4 2'))
    h+=h4('Problem C (Hard): Grid paths avoiding blocks')
    h+=p('A grid has open cells (.) and blocked cells (#). Count the paths from the top-left to the bottom-right moving only right or down, modulo 1,000,000,007.')
    h+=cbp('python',S3,'3 3\n...\n.#.\n...',run('python',S3,'3 3\n...\n.#.\n...'))
    h+=ex('Answers to the three sample inputs.',f'{run("python",S1,"6 2"+chr(10)+"1 5 3 4 2 3")}; {run("python",S2,"6"+chr(10)+"2 3 1 1 4 2")}; {run("python",S3,"3 3"+chr(10)+"..."+chr(10)+".#."+chr(10)+"...")}',f'A: the pairs of values with difference 2 are {PAIRS}; the program counts them with a frequency table, no double loop. B: jump 0→1→4→5 takes 3 jumps (from index 1 with value 3 you can reach index 4, then the last index). C: two paths go around the blocked centre cell.')
    h+=h3('Practice set: the 30 problems in the Practice Arena')
    h+=p('The Practice Arena that goes with this series contains 30 coding problems with test cases. Use them in this order after finishing each chapter.')
    rows=[[x['id'],x['title']] for x in P30]
    half=(len(rows)+1)//2
    h+=two(tb(['ID','Problem'],rows[:half],'sm'),tb(['ID','Problem'],rows[half:],'sm'))
    h+=h3('One-page cheat sheet')
    h+=tb(['If the problem says …','Think …','Time'],[['subarray sum = K','prefix sum + hash','O(n)'],['longest substring / window','sliding window','O(n)'],['pairs with a sum','sort + two pointers','O(n log n)'],['minimum / maximum, repeated sub-problems','DP','O(n²) or less'],['count ways','DP counting','—'],['all subsets / permutations, n ≤ 20','backtracking / bitmask','O(2ⁿ)'],['shortest path in a grid','BFS','O(RC)'],['regions / islands','DFS / BFS','O(RC)'],['weighted shortest path','Dijkstra','O(E log V)'],['groups / connected','DSU','~O(E)'],['repeat after t steps','cycles + LCM','O(n)'],['next greater','monotonic stack','O(n)'],['single non-repeating','XOR','O(n)'],['minimise the maximum','binary search on answer','O(n log R)'],['intervals','sort + merge','O(n log n)']],'sm')
    h+=tips(['Spend the first 5 minutes reading both problems; start with the one whose pattern you recognise.','Always keep 10 minutes at the end for edge cases.','A correct brute force that passes small tests beats an unfinished clever solution.'])
    return h+end()
