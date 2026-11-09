from acl import *
def f_cx():
    f,ax=plt.subplots(figsize=(8.4,3.4));ax.axis('off')
    rows=[['n ≤ 10','O(n!) or O(2ⁿ·n)','brute force, backtracking'],['n ≤ 20','O(2ⁿ)','bitmask, subsets'],['n ≤ 500','O(n³)','three loops, Floyd–Warshall'],['n ≤ 5,000','O(n²)','nested loops, 2-D DP'],['n ≤ 10⁵','O(n log n)','sort, binary search, heap'],['n ≤ 10⁶','O(n)','one pass, prefix sums, hashing'],['n ≤ 10¹⁸','O(log n)','math, fast power, gcd']]
    tablefig('ac1_cx',['Constraint','Allowed complexity','Typical technique'],rows,[2.0,2.6,4.2],title='Read the constraint, pick the algorithm')
f_cx()
flow('ac1_plan',['Read both\nproblems (5 min)','Easier one:\nsolve (30 min)','Test on samples\n+ 3 edge cases','Harder one:\nfull solution','Partial marks:\nbrute force if stuck'],'A 90-minute plan for two coding problems')
SRC={'python':'''n = int(input())
a = list(map(int, input().split()))
print(sum(a), max(a))''','cpp':'''#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long s = 0, mx = a[0];
    for (auto x : a) { s += x; mx = max(mx, x); }
    cout << s << " " << mx << endl;
}''','c':'''#include <stdio.h>
int main() {
    int n; scanf("%d", &n);
    long long s = 0, mx = -1000000000000LL, x;
    for (int i = 0; i < n; i++) { scanf("%lld", &x); s += x; if (x > mx) mx = x; }
    printf("%lld %lld\\n", s, mx);
    return 0;
}''','java':'''import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long s = 0, mx = Long.MIN_VALUE;
        for (int i = 0; i < n; i++) { long x = sc.nextLong(); s += x; mx = Math.max(mx, x); }
        System.out.println(s + " " + mx);
    }
}'''}
def html():
    h=top('How TCS Advanced Coding Works','ADVANCED CODING · START HERE','#0f172a')
    h+=intro('Advanced Coding is the section that decides Digital and Prime. In the pattern used in this series it has <b>two problems in about 90 minutes</b>, solved in C, C++, Java or Python, and marked by <b>hidden test cases</b>. A program that is correct on the samples but slow on large inputs, or wrong on one edge case, loses marks. This guide teaches the patterns behind the problems, with code that was <b>compiled and run</b> while the guide was built. Check the official TCS portal for the latest pattern.')
    h+=fig('ac1_plan','Take the easier problem first; keep 10 minutes for edge cases.')
    h+=h3('The four things the judge checks')
    h+=tb(['Check','Meaning','How to pass'],[['Correct output','Exact text, spaces and newlines','Print exactly what is asked; no extra prompts'],['Time limit','Usually 1–2 seconds','Choose algorithm by constraint'],['Memory limit','Typically 256 MB','Avoid huge 2-D arrays when n = 10⁵'],['Hidden cases','Edge and large cases','n = 1, all equal, negative numbers, maximum n']],'sm')
    h+=fig('ac1_cx','About 10⁸ simple operations fit in one second.')
    h+=h3('Input and output templates')
    h+=p('Every problem starts the same way: read n, read n numbers, compute, print. Here is the same program (sum and maximum) in all four languages. Each one was compiled and run on the same input and all four printed the same answer.')
    inp='5\n3 -1 4 1 5'
    for lg in('python','cpp','c','java'):h+=cbp(lg,SRC[lg],inp,'12 5')
    h+=ex('What does each of the four programs print for the input 5 / 3 −1 4 1 5?','12 5','Sum = 3 − 1 + 4 + 1 + 5 = 12; maximum = 5. All four were executed and returned the same text.')
    h+=form('Language traps',['<b>C / C++:</b> use <code>long long</code> when sums can pass 2³¹ − 1 (about 2.1 × 10⁹). Overflow is silent.','<b>C++:</b> add <code>ios::sync_with_stdio(false); cin.tie(nullptr);</code> for 10⁵ or more numbers.','<b>Java:</b> <code>Scanner</code> is slow for big input; use <code>BufferedReader</code> with <code>StreamTokenizer</code> or split on spaces.','<b>Python:</b> use <code>sys.stdin.readline</code> or read all at once for large input; recursion depth is 1000 by default.','<b>All:</b> integer division truncates toward zero in C/C++/Java but floors in Python for negatives.'])
    h+=h3('Reading TCS problem statements')
    h+=tb(['Story words','Usually means','Chapter'],[['“students stand in a row … each moves to index B[i]”','Permutation cycles, LCM','Math'],['“minimum number of moves/coins”','Greedy or DP','Greedy, DP'],['“number of subarrays with sum K”','Prefix sum + hash map','Arrays'],['“rooms / houses in a line”','Array problem','Arrays'],['“minimum letters / convert string A to B”','String comparison, greedy','Strings'],['“grid / maze / islands”','BFS or DFS','Grids'],['“all possible ways”','DP counting or backtracking','DP, Recursion']],'sm')
    h+=tips(['Write the constraint on paper first; it tells you the target complexity.','Always test: n = 1, n = 2, all equal, already sorted, maximum size.','Print the answer with a newline only. Do not print “Enter n”.','If stuck, submit a brute-force solution: it earns marks on small tests.'])
    h+=warn(['Using <code>int</code> where the sum needs <code>long long</code>.','Reading the input in the wrong order.','Printing extra spaces or text.','Spending 60 minutes on one problem.'])
    return h+end()
