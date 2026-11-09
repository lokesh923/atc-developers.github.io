import random,json,itertools,collections,heapq,bisect
R=random.Random(2027)
P=[]
def prob(id,title,level,topic,desc,infmt,outfmt,cons,ref,gen,samples,n_hidden=7,brute=None,small=None):
    tests=[]
    for s in samples:tests.append(s)
    for g in gen:tests.append(g)
    cases=[]
    for inp in tests:
        out=ref(inp);cases.append((inp,out))
    if brute and small:
        for _ in range(60):
            inp=small();assert ref(inp)==brute(inp),(id,inp,ref(inp),brute(inp))
    P.append(dict(id=id,title=title,level=level,topic=topic,desc=desc,infmt=infmt,outfmt=outfmt,cons=cons,samples=[dict(i=i,o=ref(i)) for i in samples[:2]],tests=[dict(i=i,o=o) for i,o in cases]))
def tok(s):return s.split()
R.seed(5)
# 1 second largest distinct
def ref1(s):
    t=tok(s);n=int(t[0]);a=sorted(set(map(int,t[1:1+n])),reverse=True);return str(a[1] if len(a)>1 else -1)
def g1(n,lo,hi):return f"{n}\n"+' '.join(str(R.randint(lo,hi)) for _ in range(n))+"\n"
prob('p1','Second Largest Distinct','Medium','Arrays',"Given an array of N integers, print the second largest <b>distinct</b> value. If it does not exist, print -1.","First line N. Second line: N space-separated integers.","One integer.","1 ≤ N ≤ 2·10<sup>4</sup>; −10<sup>9</sup> ≤ A[i] ≤ 10<sup>9</sup>",ref1,[g1(1,5,5),g1(5,3,3),g1(8,-5,5),g1(100,-1000,1000),g1(20000,-10**9,10**9)],["5\n10 20 20 5 8\n","3\n7 7 7\n"],brute=lambda s:ref1(s),small=lambda:g1(R.randint(1,6),-3,3))
# 2 balanced brackets
def ref2(s):
    st=[];m={')':'(',']':'[','}':'{'}
    for c in s.strip():
        if c in '([{':st.append(c)
        else:
            if not st or st.pop()!=m[c]:return 'NO'
    return 'YES' if not st else 'NO'
def g2(n,bal):
    if bal:
        def build(k):
            if k==0:return ''
            a=R.randint(0,k-1);o,c=R.choice(['()','[]','{}']);return o+build(a)+c+build(k-1-a)
        return build(n)+"\n"
    s=''.join(R.choice('()[]{}') for _ in range(n));return s+"\n"
prob('p2','Balanced Brackets','Medium','Stack',"A string consists only of the characters ( ) [ ] { }. Print YES if the brackets are balanced and properly nested, otherwise NO.","One line containing the string.","YES or NO.","1 ≤ length ≤ 2·10<sup>4</sup>",ref2,[g2(3,True),g2(8,False),g2(1000,True),g2(50000,True),g2(7,False),"([)]\n","((((\n"],["([]{})\n","(]\n"])
# 3 rotate array
def ref3(s):
    t=tok(s);n,k=int(t[0]),int(t[1]);a=t[2:2+n];k%=n;return ' '.join(a[-k:]+a[:-k]) if k else ' '.join(a)
def g3(n,k):return f"{n} {k}\n"+' '.join(str(R.randint(-99,99)) for _ in range(n))+"\n"
prob('p3','Rotate Array','Medium','Arrays',"Rotate an array of N integers to the right by K positions and print the result.","First line: N and K. Second line: N integers.","N space-separated integers.","1 ≤ N ≤ 2·10<sup>4</sup>; 0 ≤ K ≤ 10<sup>9</sup>",ref3,[g3(1,5),g3(6,0),g3(6,6),g3(10,13),g3(20000,10**9)],["5 2\n1 2 3 4 5\n","4 1\n9 8 7 6\n"],brute=lambda s:ref3(s),small=lambda:g3(R.randint(1,6),R.randint(0,20)))
# 4 kadane
def ref4(s):
    t=tok(s);n=int(t[0]);a=list(map(int,t[1:1+n]));best=cur=a[0]
    for x in a[1:]:cur=max(x,cur+x);best=max(best,cur)
    return str(best)
def br4(s):
    t=tok(s);n=int(t[0]);a=list(map(int,t[1:1+n]));return str(max(sum(a[i:j]) for i in range(n) for j in range(i+1,n+1)))
prob('p4','Maximum Subarray Sum','Medium','Arrays / DP',"Find the maximum possible sum of a non-empty contiguous subarray.","First line N. Second line N integers.","One integer.","1 ≤ N ≤ 2·10<sup>4</sup>; −10<sup>4</sup> ≤ A[i] ≤ 10<sup>4</sup>",ref4,[g1(1,-5,-5),g1(6,-9,-1),g1(10,-10,10),g1(1000,-100,100),g1(20000,-10000,10000)],["8\n-2 1 -3 4 -1 2 1 -5\n","3\n-4 -2 -7\n"],brute=br4,small=lambda:g1(R.randint(1,7),-5,5))
# 5 longest unique substring
def ref5(s):
    s=s.strip();last={};st=0;best=0
    for i,c in enumerate(s):
        if c in last and last[c]>=st:st=last[c]+1
        last[c]=i;best=max(best,i-st+1)
    return str(best)
def br5(s):
    s=s.strip();return str(max(j-i for i in range(len(s)) for j in range(i+1,len(s)+1) if len(set(s[i:j]))==j-i))
def g5(n,al):return ''.join(R.choice(al) for _ in range(n))+"\n"
prob('p5','Longest Substring Without Repeating Characters','Medium','Strings',"Given a string, print the length of the longest substring that has no repeated character.","One line with the string (lowercase letters).","One integer.","1 ≤ length ≤ 2·10<sup>4</sup>",ref5,[g5(1,'a'),g5(10,'a'),g5(26,'abcdefghijklmnopqrstuvwxyz'),g5(1000,'abcde'),g5(20000,'abcdefghijklmnopqrstuvwxyz')],["abcabcbb\n","bbbbb\n"],brute=br5,small=lambda:g5(R.randint(1,9),'abc'))
# 6 pair sum count
def ref6(s):
    t=tok(s);n,k=int(t[0]),int(t[1]);a=list(map(int,t[2:2+n]));c=collections.Counter();r=0
    for x in a:r+=c[k-x];c[x]+=1
    return str(r)
def br6(s):
    t=tok(s);n,k=int(t[0]),int(t[1]);a=list(map(int,t[2:2+n]));return str(sum(1 for i in range(n) for j in range(i+1,n) if a[i]+a[j]==k))
def g6(n,k,lo,hi):return f"{n} {k}\n"+' '.join(str(R.randint(lo,hi)) for _ in range(n))+"\n"
prob('p6','Count Pairs With Given Sum','Medium','Hashing',"Count the pairs of indices (i, j) with i &lt; j such that A[i] + A[j] = K.","First line: N and K. Second line: N integers.","One integer.","1 ≤ N ≤ 2·10<sup>4</sup>; |A[i]|, |K| ≤ 10<sup>9</sup>",ref6,[g6(1,4,2,2),g6(6,0,-3,3),g6(10,5,0,5),g6(1000,100,0,100),g6(20000,0,-1000,1000)],["5 6\n1 5 3 3 3\n","4 10\n1 2 3 4\n"],brute=br6,small=lambda:g6(R.randint(1,8),R.randint(-4,4),-3,3))
# 7 palindromes in range
def ref7(s):
    l,r=map(int,tok(s));return str(sum(1 for x in range(l,r+1) if str(x)==str(x)[::-1]))
prob('p7','Count Palindromic Numbers','Medium','Math',"Count the numbers in the range [L, R] (both inclusive) that read the same forwards and backwards.","One line: L and R.","One integer.","1 ≤ L ≤ R ≤ 10<sup>6</sup>",ref7,["1 1\n","10 99\n","1 200000\n","123 456\n","999999 200000\n","500000 600000\n"],["1 100\n","100 200\n"])
# 8 spiral
def ref8(s):
    t=tok(s);n,m=int(t[0]),int(t[1]);a=[list(map(int,t[2+i*m:2+(i+1)*m])) for i in range(n)];out=[]
    top,bot,l,r=0,n-1,0,m-1
    while top<=bot and l<=r:
        out+=a[top][l:r+1];top+=1
        for i in range(top,bot+1):out.append(a[i][r])
        r-=1
        if top<=bot:
            for j in range(r,l-1,-1):out.append(a[bot][j])
            bot-=1
        if l<=r:
            for i in range(bot,top-1,-1):out.append(a[i][l])
            l+=1
    return ' '.join(map(str,out))
def g8(n,m):return f"{n} {m}\n"+'\n'.join(' '.join(str(R.randint(1,99)) for _ in range(m)) for _ in range(n))+"\n"
prob('p8','Spiral Matrix','Medium','Matrix',"Print the elements of an N × M matrix in spiral order starting at the top-left, going right first.","First line: N and M. Then N lines with M integers each.","All elements in spiral order, space separated.","1 ≤ N, M ≤ 120",ref8,[g8(1,1),g8(1,5),g8(5,1),g8(4,4),g8(3,7),g8(120,120)],["3 3\n1 2 3\n4 5 6\n7 8 9\n","2 3\n1 2 3\n4 5 6\n"])
# 9 LIS
def ref9(s):
    t=tok(s);n=int(t[0]);a=list(map(int,t[1:1+n]));d=[]
    for x in a:
        i=bisect.bisect_left(d,x)
        if i==len(d):d.append(x)
        else:d[i]=x
    return str(len(d))
def br9(s):
    t=tok(s);n=int(t[0]);a=list(map(int,t[1:1+n]));dp=[1]*n
    for i in range(n):
        for j in range(i):
            if a[j]<a[i]:dp[i]=max(dp[i],dp[j]+1)
    return str(max(dp))
prob('p9','Longest Increasing Subsequence','Hard','Dynamic Programming',"Find the length of the longest strictly increasing subsequence of the array.","First line N. Second line N integers.","One integer.","1 ≤ N ≤ 2·10<sup>4</sup>; |A[i]| ≤ 10<sup>9</sup>",ref9,[g1(1,3,3),g1(8,-5,5),g1(50,-20,20),g1(2000,-10**6,10**6),g1(20000,-10**9,10**9)],["8\n10 9 2 5 3 7 101 18\n","5\n5 4 3 2 1\n"],brute=br9,small=lambda:g1(R.randint(1,9),-4,4))
# 10 coin change
def ref10(s):
    t=tok(s);n,amt=int(t[0]),int(t[1]);c=list(map(int,t[2:2+n]));INF=10**9;dp=[0]+[INF]*amt
    for a in range(1,amt+1):
        for x in c:
            if x<=a and dp[a-x]+1<dp[a]:dp[a]=dp[a-x]+1
    return str(dp[amt] if dp[amt]<INF else -1)
def g10(n,amt,hi):
    cs=sorted(set(R.randint(1,hi) for _ in range(n)));return f"{len(cs)} {amt}\n"+' '.join(map(str,cs))+"\n"
prob('p10','Minimum Coins','Hard','Dynamic Programming',"Given coin denominations (unlimited supply of each), find the minimum number of coins needed to make the amount. Print -1 if it is impossible.","First line: N (number of denominations) and the amount. Second line: N distinct denominations.","One integer.","1 ≤ N ≤ 50; 1 ≤ coin ≤ 10<sup>4</sup>; 0 ≤ amount ≤ 10<sup>4</sup>",ref10,[ "1 0\n5\n","2 3\n2 4\n",g10(5,100,30),g10(10,9999,100),g10(50,10000,500),"3 11\n1 5 6\n"],["3 11\n1 2 5\n","1 3\n2\n"])
# 11 subarray sum K
def ref11(s):
    t=tok(s);n,k=int(t[0]),int(t[1]);a=list(map(int,t[2:2+n]));c=collections.Counter({0:1});p=0;r=0
    for x in a:p+=x;r+=c[p-k];c[p]+=1
    return str(r)
def br11(s):
    t=tok(s);n,k=int(t[0]),int(t[1]);a=list(map(int,t[2:2+n]));return str(sum(1 for i in range(n) for j in range(i+1,n+1) if sum(a[i:j])==k))
prob('p11','Subarrays With Sum K','Hard','Hashing / Prefix Sum',"Count the contiguous subarrays whose sum is exactly K. The array may contain negative numbers.","First line: N and K. Second line: N integers.","One integer.","1 ≤ N ≤ 2·10<sup>4</sup>; |A[i]| ≤ 10<sup>4</sup>",ref11,[g6(1,0,0,0),g6(8,0,-2,2),g6(10,3,-3,3),g6(1000,5,-5,5),g6(20000,0,-3,3)],["5 3\n1 2 1 2 1\n","3 0\n0 0 0\n"],brute=br11,small=lambda:g6(R.randint(1,8),R.randint(-3,3),-2,2))
# 12 min platforms
def ref12(s):
    t=tok(s);n=int(t[0]);a=sorted(map(int,t[1:1+n]));d=sorted(map(int,t[1+n:1+2*n]));i=j=0;cur=best=0
    while i<n:
        if a[i]<=d[j]:cur+=1;i+=1;best=max(best,cur)
        else:cur-=1;j+=1
    return str(best)
def g12(n):
    a=[R.randint(0,2000) for _ in range(n)];d=[x+R.randint(0,300) for x in a];return f"{n}\n"+' '.join(map(str,a))+"\n"+' '.join(map(str,d))+"\n"
prob('p12','Minimum Platforms','Hard','Greedy',"N trains have arrival and departure times (as integers, e.g. 900 for 9:00). A train that arrives at the same time another departs needs a separate platform. Find the minimum number of platforms required.","First line N. Second line: N arrival times. Third line: N departure times (departure ≥ arrival for the same train).","One integer.","1 ≤ N ≤ 2·10<sup>4</sup>; 0 ≤ time ≤ 10<sup>6</sup>",ref12,[g12(1),g12(5),g12(50),g12(1000),g12(20000)],["6\n900 940 950 1100 1500 1800\n910 1200 1120 1130 1900 2000\n","3\n100 100 100\n200 200 200\n"])
# 13 islands
def ref13(s):
    t=tok(s);n,m=int(t[0]),int(t[1]);g=[list(t[2+i]) for i in range(n)];seen=[[False]*m for _ in range(n)];c=0
    for i in range(n):
        for j in range(m):
            if g[i][j]=='1' and not seen[i][j]:
                c+=1;st=[(i,j)];seen[i][j]=True
                while st:
                    x,y=st.pop()
                    for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
                        a,b=x+dx,y+dy
                        if 0<=a<n and 0<=b<m and g[a][b]=='1' and not seen[a][b]:seen[a][b]=True;st.append((a,b))
    return str(c)
def g13(n,m,p):return f"{n} {m}\n"+'\n'.join(''.join('1' if R.random()<p else '0' for _ in range(m)) for _ in range(n))+"\n"
prob('p13','Number of Islands','Hard','Graphs / Grid',"A grid contains 1 (land) and 0 (water). An island is a group of land cells connected horizontally or vertically. Count the islands.","First line: N and M. Then N lines, each a string of M characters (0 or 1).","One integer.","1 ≤ N, M ≤ 150",ref13,[g13(1,1,1.0),g13(1,1,0.0),g13(5,5,0.5),g13(20,30,0.4),g13(150,150,0.45),g13(150,150,0.9)],["4 5\n11000\n11000\n00100\n00011\n","2 2\n10\n01\n"])
# 14 merge intervals
def ref14(s):
    t=tok(s);n=int(t[0]);iv=sorted((int(t[1+2*i]),int(t[2+2*i])) for i in range(n));out=[]
    for a,b in iv:
        if out and a<=out[-1][1]:out[-1][1]=max(out[-1][1],b)
        else:out.append([a,b])
    return str(len(out))+"\n"+"\n".join(f"{a} {b}" for a,b in out)
def g14(n,hi):
    r=[]
    for _ in range(n):
        a=R.randint(0,hi);r.append((a,a+R.randint(0,hi//10+1)))
    return f"{n}\n"+'\n'.join(f"{a} {b}" for a,b in r)+"\n"
prob('p14','Merge Intervals','Hard','Sorting',"Merge all overlapping intervals (intervals that touch at an endpoint are overlapping). Print the number of merged intervals, followed by the intervals in increasing order.","First line N. Then N lines with two integers (start, end).","First line: count M. Then M lines: start end.","1 ≤ N ≤ 2·10<sup>4</sup>; 0 ≤ start ≤ end ≤ 10<sup>9</sup>",ref14,[g14(1,10),g14(5,20),g14(50,1000),g14(1000,10**5),g14(20000,10**9)],["4\n1 3\n2 6\n8 10\n15 18\n","2\n1 4\n4 5\n"])
# 15 word break
def ref15(s):
    t=tok(s);w=t[0];n=int(t[1]);d=set(t[2:2+n]);dp=[True]+[False]*len(w)
    for i in range(1,len(w)+1):
        for j in range(i):
            if dp[j] and w[j:i] in d:dp[i]=True;break
    return 'YES' if dp[-1] else 'NO'
def g15(k,yes):
    d=[''.join(R.choice('ab') for _ in range(R.randint(1,4))) for _ in range(5)];d=list(set(d))
    if yes:w=''.join(R.choice(d) for _ in range(k))
    else:w=''.join(R.choice('abc') for _ in range(k*2))
    return f"{w}\n{len(d)}\n"+' '.join(d)+"\n"
prob('p15','Word Break','Hard','Dynamic Programming',"Given a string S and a dictionary of N words, print YES if S can be split into a sequence of dictionary words (words may be reused), otherwise NO.","First line S. Second line N. Third line: the N dictionary words.","YES or NO.","1 ≤ |S| ≤ 2000; 1 ≤ N ≤ 1000; words are lowercase",ref15,[g15(1,True),g15(2,False),g15(10,True),g15(200,True),g15(300,False),"leetcode\n2\nleet code\n"],["applepenapple\n2\napple pen\n","catsandog\n5\ncats dog sand and cat\n"])
# 16 knapsack
def ref16(s):
    t=tok(s);n,W=int(t[0]),int(t[1]);w=list(map(int,t[2:2+n]));v=list(map(int,t[2+n:2+2*n]));dp=[0]*(W+1)
    for i in range(n):
        for c in range(W,w[i]-1,-1):dp[c]=max(dp[c],dp[c-w[i]]+v[i])
    return str(dp[W])
def br16(s):
    t=tok(s);n,W=int(t[0]),int(t[1]);w=list(map(int,t[2:2+n]));v=list(map(int,t[2+n:2+2*n]));best=0
    for m in range(1<<n):
        if sum(w[i] for i in range(n) if m>>i&1)<=W:best=max(best,sum(v[i] for i in range(n) if m>>i&1))
    return str(best)
def g16(n,W,hw,hv):return f"{n} {W}\n"+' '.join(str(R.randint(1,hw)) for _ in range(n))+"\n"+' '.join(str(R.randint(1,hv)) for _ in range(n))+"\n"
prob('p16','0/1 Knapsack','Hard','Dynamic Programming',"N items have weights and values. Choose items (each at most once) so that the total weight does not exceed W and the total value is maximum. Print that value.","First line: N and W. Second line: N weights. Third line: N values.","One integer.","1 ≤ N ≤ 200; 1 ≤ W ≤ 10<sup>4</sup>; 1 ≤ weight, value ≤ 10<sup>3</sup>",ref16,[g16(1,5,10,10),g16(5,10,6,20),g16(20,100,40,500),g16(200,10000,1000,1000),g16(200,50,1000,1000)],["3 50\n10 20 30\n60 100 120\n","2 1\n5 6\n10 20\n"],brute=br16,small=lambda:g16(R.randint(1,8),R.randint(1,15),8,20))
# 17 grid shortest path
def ref17(s):
    t=tok(s);n,m=int(t[0]),int(t[1]);g=t[2:2+n];dist={(0,0):0};q=collections.deque([(0,0)])
    if g[0][0]=='#' or g[n-1][m-1]=='#':return '-1'
    while q:
        x,y=q.popleft()
        if (x,y)==(n-1,m-1):return str(dist[(x,y)])
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            a,b=x+dx,y+dy
            if 0<=a<n and 0<=b<m and g[a][b]=='.' and (a,b) not in dist:dist[(a,b)]=dist[(x,y)]+1;q.append((a,b))
    return '-1'
def g17(n,m,p):
    g=[[('#' if R.random()<p else '.') for _ in range(m)] for _ in range(n)];g[0][0]='.';g[n-1][m-1]='.'
    return f"{n} {m}\n"+'\n'.join(''.join(r) for r in g)+"\n"
prob('p17','Shortest Path in a Maze','Hard','Graphs / BFS',"A maze has open cells (.) and walls (#). Starting at the top-left cell, find the minimum number of moves (up, down, left, right) to reach the bottom-right cell. Print -1 if it is unreachable.","First line: N and M. Then N lines of M characters.","One integer.","1 ≤ N, M ≤ 150",ref17,[g17(1,1,0),g17(5,5,0.3),g17(10,10,0.45),g17(80,80,0.25),g17(150,150,0.2),"3 3\n.#.\n###\n.#.\n"],["3 3\n...\n.#.\n...\n","2 2\n.#\n#.\n"])
# 18 next greater element
def ref18(s):
    t=tok(s);n=int(t[0]);a=list(map(int,t[1:1+n]));res=[-1]*n;st=[]
    for i in range(n-1,-1,-1):
        while st and st[-1]<=a[i]:st.pop()
        res[i]=st[-1] if st else -1;st.append(a[i])
    return ' '.join(map(str,res))
def br18(s):
    t=tok(s);n=int(t[0]);a=list(map(int,t[1:1+n]));return ' '.join(str(next((a[j] for j in range(i+1,n) if a[j]>a[i]),-1)) for i in range(n))
prob('p18','Next Greater Element','Medium','Stack',"For every element, print the first element to its right that is strictly greater, or -1 if none exists.","First line N. Second line N integers.","N integers.","1 ≤ N ≤ 2·10<sup>4</sup>; |A[i]| ≤ 10<sup>9</sup>",ref18,[g1(1,3,3),g1(8,-3,3),g1(100,-50,50),g1(1000,0,10),g1(20000,-10**9,10**9)],["4\n4 5 2 25\n","3\n3 2 1\n"],brute=br18,small=lambda:g1(R.randint(1,8),-4,4))

# ---- extra problems 19-30
def ref19(s):
    t=tok(s);n=int(t[0]);g=set(''.join(sorted(w)) for w in t[1:1+n]);return str(len(g))
def g19(n,al,L):return f"{n}\n"+' '.join(''.join(R.choice(al) for _ in range(R.randint(1,L))) for _ in range(n))+"\n"
prob('p19','Count Anagram Groups','Medium','Strings / Hashing',"Given N words, count how many groups of words are anagrams of each other (words in the same group use the same letters with the same counts).","First line N. Second line: N lowercase words.","One integer.","1 ≤ N ≤ 2·10<sup>4</sup>; 1 ≤ length ≤ 8",ref19,[g19(1,'ab',3),g19(6,'abc',3),g19(100,'abcd',4),g19(5000,'abcdef',6),g19(20000,'abcdefgh',8)],["6\nlisten silent enlist google gogole cat\n","3\nabc cab bca\n"],brute=lambda s:ref19(s),small=lambda:g19(R.randint(1,6),'ab',3))
def ref20(s):
    s=s.strip();n=len(s);best=1
    for c in range(n):
        for l,r in((c,c),(c,c+1)):
            while l>=0 and r<n and s[l]==s[r]:l-=1;r+=1
            best=max(best,r-l-1)
    return str(best)
def br20(s):
    s=s.strip();return str(max(j-i for i in range(len(s)) for j in range(i+1,len(s)+1) if s[i:j]==s[i:j][::-1]))
prob('p20','Longest Palindromic Substring','Hard','Strings / DP',"Print the length of the longest contiguous substring of the given string that is a palindrome.","One line with the string (lowercase letters).","One integer.","1 ≤ length ≤ 2000",ref20,[g5(1,'a'),g5(10,'ab'),g5(200,'ab'),g5(1000,'abc'),g5(2000,'a')],["babad\n","cbbd\n"],brute=br20,small=lambda:g5(R.randint(1,10),'ab'))
def ref21(s):
    t=tok(s);n=int(t[0]);h=list(map(int,t[1:1+n]));l,r=0,n-1;lm=rm=0;w=0
    while l<r:
        if h[l]<h[r]:
            lm=max(lm,h[l]);w+=lm-h[l];l+=1
        else:
            rm=max(rm,h[r]);w+=rm-h[r];r-=1
    return str(w)
def br21(s):
    t=tok(s);n=int(t[0]);h=list(map(int,t[1:1+n]));return str(sum(max(0,min(max(h[:i+1]),max(h[i:]))-h[i]) for i in range(n)))
prob('p21','Trapping Rain Water','Hard','Two Pointers',"Given the heights of N bars of width 1, find how many units of water are trapped between the bars after rain.","First line N. Second line N non-negative integers.","One integer.","1 ≤ N ≤ 2·10<sup>4</sup>; 0 ≤ height ≤ 10<sup>5</sup>",ref21,[g1(1,3,3),g1(8,0,6),g1(30,0,10),g1(1000,0,100),g1(20000,0,100000)],["12\n0 1 0 2 1 0 1 3 2 1 2 1\n","6\n4 2 0 3 2 5\n"],brute=br21,small=lambda:g1(R.randint(1,9),0,5))
def ref22(s):
    t=tok(s);n=int(t[0]);h=list(map(int,t[1:1+n]));l,r=0,n-1;b=0
    while l<r:
        b=max(b,min(h[l],h[r])*(r-l))
        if h[l]<h[r]:l+=1
        else:r-=1
    return str(b)
def br22(s):
    t=tok(s);n=int(t[0]);h=list(map(int,t[1:1+n]));return str(max([min(h[i],h[j])*(j-i) for i in range(n) for j in range(i+1,n)] or [0]))
prob('p22','Container With Most Water','Medium','Two Pointers',"N vertical lines are drawn at positions 1..N with the given heights. Choose two lines to form a container; its water is min(height) × distance between them. Print the maximum water. If N = 1, print 0.","First line N. Second line N heights.","One integer.","1 ≤ N ≤ 2·10<sup>4</sup>; 0 ≤ height ≤ 10<sup>4</sup>",ref22,[g1(1,3,3),g1(8,0,9),g1(40,0,50),g1(2000,0,10000),g1(20000,0,10000)],["9\n1 8 6 2 5 4 8 3 7\n","2\n1 1\n"],brute=br22,small=lambda:g1(R.randint(1,8),0,6))
def ref23(s):
    t=tok(s);n,x=int(t[0]),int(t[1]);a=list(map(int,t[2:2+n]));i=bisect.bisect_left(a,x);return str(i+1 if i<n and a[i]==x else -1)
def g23(n,hi):
    a=sorted(R.randint(0,hi) for _ in range(n));x=R.choice(a) if R.random()<.7 else R.randint(0,hi);return f"{n} {x}\n"+' '.join(map(str,a))+"\n"
prob('p23','First Occurrence in Sorted Array','Medium','Binary Search',"Given a sorted array (non-decreasing) and a value X, print the 1-based position of the first occurrence of X, or -1 if X is not present.","First line: N and X. Second line: N sorted integers.","One integer.","1 ≤ N ≤ 2·10<sup>4</sup>; 0 ≤ values ≤ 10<sup>9</sup>",ref23,[g23(1,3),g23(10,5),g23(50,10),g23(1000,100),g23(20000,10**9)],["6 4\n1 2 4 4 4 9\n","3 5\n1 2 3\n"],brute=lambda s:(lambda t:str(next((i+1 for i,v in enumerate(map(int,t[2:2+int(t[0])])) if v==int(t[1])),-1)))(tok(s)),small=lambda:g23(R.randint(1,8),5))
def ref24(s):
    n=int(tok(s)[0]);t=0
    for x in range(1,n+1):t+=bin(x).count('1')
    return str(t)
prob('p24','Total Set Bits','Medium','Bit Manipulation',"Print the total number of 1 bits in the binary representations of all integers from 1 to N.","One integer N.","One integer.","1 ≤ N ≤ 10<sup>6</sup>",ref24,["1\n","2\n","15\n","1000\n","999999\n","1000000\n"],["5\n","8\n"])
def ref25(s):
    n=int(tok(s)[0]);M=10**9+7;d=[1,1,2]+[0]*max(0,n-2)
    for i in range(3,n+1):d[i]=(d[i-1]+d[i-2]+d[i-3])%M
    return str(d[n]%M)
prob('p25','Staircase Ways','Hard','Dynamic Programming',"A staircase has N steps. You can climb 1, 2 or 3 steps at a time. Print the number of distinct ways to reach the top, modulo 1000000007.","One integer N.","One integer.","1 ≤ N ≤ 10<sup>6</sup>",ref25,["1\n","2\n","3\n","10\n","1000\n","1000000\n"],["4\n","7\n"])
def ref26(s):
    s=s.strip();open_=add=0
    for c in s:
        if c=='(':open_+=1
        elif open_:open_-=1
        else:add+=1
    return str(open_+add)
def g26(n):return ''.join(R.choice('()') for _ in range(n))+"\n"
prob('p26','Minimum Brackets To Add','Medium','Stack / Greedy',"A string consists only of ( and ). Print the minimum number of brackets that must be inserted so that the string becomes balanced.","One line with the string.","One integer.","1 ≤ length ≤ 2·10<sup>4</sup>",ref26,[g26(1),g26(6),g26(30),g26(1000),g26(20000)],["())\n","(((\n"])
def ref27(s):
    t=tok(s);n=int(t[0]);a=[list(map(int,t[1+i*n:1+(i+1)*n])) for i in range(n)];r=[[a[n-1-j][i] for j in range(n)] for i in range(n)];return '\n'.join(' '.join(map(str,x)) for x in r)
def g27(n):return f"{n}\n"+'\n'.join(' '.join(str(R.randint(1,99)) for _ in range(n)) for _ in range(n))+"\n"
prob('p27','Rotate Matrix 90° Clockwise','Medium','Matrix',"Rotate an N × N matrix by 90 degrees clockwise and print the result.","First line N. Then N rows with N integers.","N rows of N integers.","1 ≤ N ≤ 150",ref27,[g27(1),g27(2),g27(5),g27(50),g27(150)],["3\n1 2 3\n4 5 6\n7 8 9\n","2\n1 2\n3 4\n"])
def ref28(s):
    t=tok(s);n,k=int(t[0]),int(t[1]);a=list(map(int,t[2:2+n]));c=collections.Counter(a);o=sorted(c,key=lambda x:(-c[x],x));return ' '.join(map(str,o[:k]))
def g28(n,k,hi):return f"{n} {k}\n"+' '.join(str(R.randint(1,hi)) for _ in range(n))+"\n"
prob('p28','Top K Frequent Elements','Hard','Hashing / Sorting',"Print the K most frequent values of the array, ordered by frequency (highest first); values with equal frequency are ordered by value ascending. It is guaranteed that K does not exceed the number of distinct values.","First line: N and K. Second line: N integers.","K integers, space separated.","1 ≤ N ≤ 2·10<sup>4</sup>",ref28,[g28(1,1,5),g28(10,2,3),g28(100,3,8),g28(2000,5,30),g28(20000,10,100)],["8 2\n1 1 1 2 2 3 3 3\n","5 1\n4 4 5 5 6\n"])
def ref29(s):
    l,r=map(int,tok(s));sv=bytearray([1])*(r+1)
    sv[0:2]=b'\x00\x00'[:min(2,r+1)]
    for i in range(2,int(r**.5)+1):
        if sv[i]:sv[i*i::i]=bytearray(len(sv[i*i::i]))
    return str(sum(sv[max(l,0):r+1]))
prob('p29','Primes In Range','Medium','Math / Sieve',"Count the prime numbers in the range [L, R] (both inclusive).","One line: L and R.","One integer.","1 ≤ L ≤ R ≤ 10<sup>6</sup>",ref29,["1 1\n","1 10\n","2 2\n","100 200\n","1 1000000\n","999000 1000000\n"],["1 20\n","10 30\n"],brute=lambda s:(lambda l,r:str(sum(1 for x in range(l,r+1) if x>1 and all(x%d for d in range(2,int(x**.5)+1)))))(*map(int,tok(s))),small=lambda:f"{R.randint(1,50)} {R.randint(50,200)}\n")
def ref30(s):
    a,b=tok(s)[:2];n,m=len(a),len(b);dp=list(range(m+1))
    for i in range(1,n+1):
        pr=dp[:];dp[0]=i
        for j in range(1,m+1):dp[j]=min(pr[j]+1,dp[j-1]+1,pr[j-1]+(a[i-1]!=b[j-1]))
    return str(dp[m])
def g30(n,m):return ''.join(R.choice('abc') for _ in range(n))+' '+''.join(R.choice('abc') for _ in range(m))+"\n"
prob('p30','Edit Distance','Hard','Dynamic Programming',"Given two strings A and B, find the minimum number of operations (insert a character, delete a character, replace a character) needed to convert A into B.","One line with two lowercase strings A and B separated by a space.","One integer.","1 ≤ |A|, |B| ≤ 1000",ref30,[g30(1,1),g30(5,7),g30(30,25),g30(300,400),g30(1000,1000)],["horse ros\n","kitten sitting\n"],brute=None,small=None)

json.dump(P,open('coding.json','w'),ensure_ascii=False)
print(len(P),[len(p['tests']) for p in P],sum(len(json.dumps(p)) for p in P)//1024,'KB')
