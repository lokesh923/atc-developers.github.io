from lib import *
import math,itertools
C=math.comb;P=math.perm
def f_flow():
    f,ax=plt.subplots(figsize=(9.2,3.9));ax.axis('off');ax.set_xlim(0,13);ax.set_ylim(0,6)
    boxes(ax,[('Does order matter?','#dbeafe')],4.8,4.9,3.4,0.9,0)
    boxes(ax,[('YES → arrangement\n(nPr, n!, circular,\nrepeated letters)','#fde68a')],0.4,2.9,4.6,1.4,0,fs=9);boxes(ax,[('NO → selection\n(nCr, committees,\nhandshakes, diagonals)','#dcfce7')],8.0,2.9,4.6,1.4,0,fs=9)
    arrow(ax,(5.5,4.9),(2.7,4.3));arrow(ax,(7.5,4.9),(10.3,4.3))
    boxes(ax,[('Repeats allowed?  nʳ\nAll distinct?  nPr\nIdentical items?  n!/(p!q!…)\nCircle?  (n−1)!','#fff7ed')],0.4,0.4,4.6,1.9,0,fs=8.6);boxes(ax,[('Restrictions? count the\nTOTAL minus the BAD ways,\nor place the restricted\nitem first','#fff7ed')],8.0,0.4,4.6,1.9,0,fs=8.6)
    arrow(ax,(2.7,2.9),(2.7,2.3));arrow(ax,(10.3,2.9),(10.3,2.3))
    ax.text(6.5,5.95,'Choosing the right counting tool',ha='center',fontsize=11.5,fontweight='bold')
    save(f,'aq6_flow')
f_flow()
def lattice(m,n):
    dp=[[1]*(n+1) for _ in range(m+1)]
    for i in range(1,m+1):
        for j in range(1,n+1):dp[i][j]=dp[i-1][j]+dp[i][j-1]
    return dp[m][n]
def derange(n):
    d=[1,0]
    for i in range(2,n+1):d.append((i-1)*(d[-1]+d[-2]))
    return d[n]
def html():
    h=top('Permutation and Combination','ADVANCED QUANT · COUNTING · MUST-DO','#5b3fb3')
    h+=intro('Counting questions are a favourite of the advanced section because the wording is short and the trap is the method. Decide first: <b>does order matter?</b> Then check for repeated items, restrictions and circular arrangements. A clean setup gives the answer in two lines; a wrong setup cannot be repaired by arithmetic.')
    h+=fig('aq6_flow','Pick the tool before you pick the numbers.')
    h+=form('Core formulas',['<b>nPr = n!/(n−r)!</b>, <b>nCr = n!/(r!(n−r)!)</b>, nCr = nC(n−r), nCr + nC(r−1) = (n+1)Cr.','<b>Repeated letters:</b> n!/(p! q! r!…).','<b>Circular arrangement</b> of n distinct objects: (n − 1)!. If clockwise and anticlockwise are the same (necklace): (n − 1)!/2.','<b>With repetition allowed:</b> r positions, n choices each = nʳ.','<b>Distribution of identical objects</b> among r people: C(n + r − 1, r − 1) (anyone may get zero); each at least one: C(n − 1, r − 1).','<b>Number of diagonals</b> of an n-gon = nC2 − n. Handshakes among n people = nC2. Triangles from n points (none three collinear) = nC3.','<b>Derangements</b> (no item in its own place): D₂ = 1, D₃ = 2, D₄ = 9, D₅ = 44, D₆ = 265.','<b>Paths in a grid</b> going only right and up across an m × n grid: C(m + n, m).'])
    h+=h3('Standard question types with worked solutions')
    w='LEADER';
    h+=ex('In how many ways can the letters of the word EQUATION be arranged so that all the vowels come together?',str(math.factorial(4)*math.factorial(5)),'Vowels E, U, A, I, O = 5, consonants Q, T, N = 3. Treat the vowels as one block: (3 + 1)! = 24 arrangements of block and consonants, times 5! = 120 inside the block: 24 × 120 = 2880.' if False else 'Vowels E, U, A, I, O (5) and consonants Q, T, N (3). Treat the vowels as one block: 4! × 5! = 24 × 120 = 2880.')
    h+=ex('In how many ways can the letters of the word MISSISSIPPI be arranged?',str(math.factorial(11)//(math.factorial(4)*math.factorial(4)*math.factorial(2))),'11!/(4! 4! 2!) because I appears 4 times, S 4 times, P 2 times.')
    h+=ex('In how many ways can 8 people be seated around a round table if two particular people must not sit together?',str(math.factorial(7)-2*math.factorial(6)),'Total = 7! = 5040. Together = 2 × 6! = 1440. Not together = 5040 − 1440 = 3600.')
    h+=ex('A committee of 5 is to be chosen from 6 men and 4 women with at least 2 women. In how many ways?',str(sum(C(4,k)*C(6,5-k) for k in range(2,5))),'Cases: 2 women: 4C2 × 6C3 = 120; 3 women: 4C3 × 6C2 = 60; 4 women: 4C4 × 6C1 = 6. Total 186.')
    h+=ex('In how many ways can 10 identical chocolates be distributed among 4 children, each getting at least one?',str(C(9,3)),'Give one to each first, or use C(10 − 1, 4 − 1) = C(9, 3) = 84.')
    h+=ex('How many 4-digit numbers can be formed from the digits 1, 2, 3, 4, 5, 6 without repetition that are divisible by 5?',str(P(5,3)),'The last digit must be 5. The first three places are filled from the remaining 5 digits: 5 × 4 × 3 = 60.')
    h+=ex('How many triangles can be formed from 10 points of which 4 are collinear?',str(C(10,3)-C(4,3)),'Choose any 3 points: 10C3 = 120, but 3 collinear points make no triangle: subtract 4C3 = 4. Answer 116.')
    h+=ex('A grid has 5 blocks east and 4 blocks north. In how many shortest ways can you walk from the bottom-left corner to the top-right corner?',str(lattice(5,4)),'Every path has 5 E moves and 4 N moves in some order: C(9, 4) = 126.')
    h+=ex('Five letters are placed in five addressed envelopes. In how many ways can all be placed wrongly?',str(derange(5)),'Derangement D₅ = 5! (1 − 1/1! + 1/2! − 1/3! + 1/4! − 1/5!) = 44.')
    w='STONE';perms=sorted(set(''.join(p) for p in itertools.permutations(w)));rk=perms.index(w)+1
    assert rk==96
    h+=ex('If all arrangements of the letters of the word STONE are written in dictionary order, what is the rank of STONE?',str(rk),'Alphabetical order of letters: E, N, O, S, T. Count the words before STONE position by position: first letter S: 3 smaller letters (E, N, O) × 4! = 72. Second letter T (from E, N, O, T): 3 smaller × 3! = 18. Third letter O (from E, N, O): 2 smaller × 2! = 4. Fourth letter N (from E, N): 1 smaller × 1! = 1. Fifth letter E: 0. Words before = 72 + 18 + 4 + 1 = 95, so the rank is 96. (Checked by listing all 120 arrangements.)')
    h+=h3('How these questions appear')+tb(['Pattern','Wording','Method'],[['Letters of a word','“Vowels together”, “start and end with a consonant”, “no two vowels together”','Block method; gap method for “no two together”.'],['Committee selection','“At least 2 women”, “a particular person included/excluded”','Cases; fix the special member; or total − bad.'],['Digits from a set','“Even/odd numbers, divisible by 5, greater than 5000”','Fill the restricted place first.'],['Circular seating','“Two persons together/apart”','(n − 1)!, treat pairs as a block.'],['Distribution','“Identical sweets among children”','Stars and bars.'],['Geometry counting','“Triangles, diagonals, rectangles in a figure”','Choose points/lines; subtract the impossible.'],['Grid paths','“Shortest routes”','C(m + n, m) or add paths at the corners.']],'sm')
    h+=tips(['<b>No two together:</b> arrange the others first, then choose gaps: for n others there are n + 1 gaps.','“At least one” = total − none.','If a question says “distinct” items always check for hidden repeated letters.','Test your formula on a tiny case (3 objects) before trusting it.'])
    h+=warn(['Using nPr when order does not matter.','Forgetting to multiply by the inside arrangement of a block.','Treating circular arrangements as linear (n! instead of (n − 1)!).','Double counting when cases overlap.'])
    h+=pq('6. Permutation and Combination','Counting practice',[('Number of ways to arrange the letters of BANANA?',str(math.factorial(6)//(math.factorial(3)*math.factorial(2))),'B'),('Value of 10C3?',str(C(10,3)),'B'),('Number of handshakes among 12 people?',str(C(12,2)),'B'),('Diagonals of a hexagon?',str(C(6,2)-6),'B'),('In how many ways can 6 people sit around a round table?',str(math.factorial(5)),'M'),('Number of 3-digit numbers with distinct digits formed from 0–9?',str(9*9*8),'M'),('A committee of 4 from 7 men and 3 women with exactly 2 women?',str(C(3,2)*C(7,2)),'M'),('Number of ways to distribute 12 identical balls among 3 boxes (zero allowed)?',str(C(14,2)),'M'),('In how many ways can the letters of LEADER be arranged so that the two E’s are together?',str(sum(1 for p in set(itertools.permutations('LEADER')) if 'EE' in ''.join(p))),'A'),('Number of derangements of 4 objects?',str(derange(4)),'A'),('Shortest paths on a 6 × 3 grid (right and up)?',str(lattice(6,3)),'A')])
    return h+end()
