from lib import *
def crypt(words,result,distinct=True):
    letters=sorted(set(''.join(words)+result));out=[]
    if len(letters)>10:return out
    lead={w[0] for w in words+[result]}
    for perm in itertools.permutations(range(10),len(letters)):
        d=dict(zip(letters,perm))
        if any(d[l]==0 for l in lead):continue
        val=lambda w:int(''.join(str(d[c]) for c in w))
        if sum(val(w) for w in words)==val(result):out.append(d)
    return out
SM=crypt(['SEND','MORE'],'MONEY')
TW=crypt(['TWO','TWO'],'FOUR')
def magic():
    out=[]
    for p in itertools.permutations(range(1,10)):
        s=15
        if all(sum(p[3*i:3*i+3])==s for i in range(3)) and all(p[j]+p[j+3]+p[j+6]==s for j in range(3)) and p[0]+p[4]+p[8]==s and p[2]+p[4]+p[6]==s:out.append(p)
    return out
MG=magic()
def f_magic():
    p=MG[0];f,ax=plt.subplots(figsize=(3.8,3.8));ax.set_aspect('equal');ax.axis('off');ax.set_xlim(0,3);ax.set_ylim(0,3)
    for i in range(3):
        for j in range(3):
            ax.add_patch(Rectangle((j,2-i),1,1,fc='#fde68a' if (i+j)%2 else '#bfdbfe',ec='#14213d'));ax.text(j+0.5,2-i+0.5,str(p[3*i+j]),ha='center',va='center',fontsize=18,fontweight='bold')
    ax.set_title('3×3 magic square: every line = 15',fontsize=10,fontweight='bold');save(f,'ar10_magic')
f_magic()
def f_crypt():
    f,ax=plt.subplots(figsize=(5.4,3.4));ax.axis('off');ax.set_xlim(0,10);ax.set_ylim(0,6)
    d=SM[0];ax.text(5,5.2,'  S E N D',fontsize=18,family='monospace',ha='center');ax.text(5,4.2,'+ M O R E',fontsize=18,family='monospace',ha='center');ax.plot([2.5,7.5],[3.7,3.7],color='#14213d');ax.text(5,3.0,'M O N E Y',fontsize=18,family='monospace',ha='center')
    ax.text(5,1.6,'M = 1 (carry)   S = 9   O = 0\nE = 5   N = 6   D = 7   R = 8   Y = 2',fontsize=10.5,ha='center',color='#be123c',fontweight='bold')
    save(f,'ar10_crypt')
f_crypt()
def html():
    h=top('Cryptarithm, Number Puzzles and Grids','ADVANCED REASONING · NUMBER PUZZLES · IMPORTANT','#6d28d9')
    h+=intro('Number puzzles replace digits by letters or hide a pattern in a grid. They are won by <b>carries, parity and divisibility</b>, not by guessing. Always begin with the leftmost column: a carry from addition is at most 1.')
    h+=fig('ar10_crypt','The classic cryptarithm. M must be 1 (carry).')
    h+=form('Cryptarithm toolkit',['Adding two 4-digit numbers gives at most 19998, so the carry into the 5th digit is 1.','Leading digits cannot be 0.','Different letters represent different digits (unless said otherwise).','Units column: use the last digit; carry: use ≤ 1 (two numbers) or ≤ 2 (three numbers).','If a letter appears in the same column in both addends: the sum is even.','Digit sum of 3-digit and 4-digit numbers is checked by mod 9.'])
    sm=SM[0] if len(SM)==1 else None
    h+=ex('Solve SEND + MORE = MONEY (distinct digits, no leading zero).',f'{len(SM)} solution: '+', '.join(f'{k}={v}' for k,v in sorted(SM[0].items(),key=lambda x:x[1]))+f'; SEND={"".join(str(SM[0][c]) for c in "SEND")}','M = 1 because the sum of two 4-digit numbers is below 20,000. In the thousands column S + M (+ carry) must produce a 2-digit result, so S = 9 (or 8 with a carry) and O = 0. Following the columns gives the unique digits. A program tried all 1,814,400 digit assignments and found exactly one solution.')
    h+=ex('In TWO + TWO = FOUR (distinct digits, no leading zero), how many solutions exist, and what is the largest value of FOUR?',f'{len(TW)} solutions; max FOUR = {max(int("".join(str(d[c]) for c in "FOUR")) for d in TW)}','F is 1 (carry). T ≥ 5 so that 2T has a carry. A search over all digit assignments gave the count above.')
    h+=h3('Magic squares')+fig('ar10_magic','A 3×3 magic square with magic sum 15.')
    h+=ex('How many different 3×3 magic squares can be made from the digits 1–9, and what is the centre cell?',f'{len(MG)} squares (rotations/reflections of one); centre = 5','A program tested all 362,880 arrangements. Every one has 5 in the centre and the magic sum is 15 = 3 × 5.')
    h+=h3('Number-grid puzzles')
    h+=p('Find the missing number: rows (3, 8, 24), (4, 5, 20), (6, 2, ?). Rule: the third is the product of the first two.')
    h+=ex('(3, 8, 24), (4, 5, 20), (6, 2, ?)',str(6*2),'3 × 8 = 24, 4 × 5 = 20, so 6 × 2 = 12.')
    h+=ex('Find the missing number: 2, 6, 12, 20, 30, ?',str(7*6),'Differences 4, 6, 8, 10, 12. Equivalently n(n+1): 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42.')
    h+=ex('A three-digit number has digits that sum to 12. The tens digit is double the hundreds digit, and the units digit is the average of the other two. Find it.',next(str(100*a+10*b+c) for a in range(1,10) for b in range(10) for c in range(10) if a+b+c==12 and b==2*a and 2*c==a+b),'Let hundreds = a, tens = 2a, units = (a+2a)/2 = 1.5a. Sum = 4.5a = 12 gives a not an integer, so check digits: the program found the only integer solution listed.') if False else ''
    h+=tb(['Pattern','Looks like','Method'],[['Cryptarithm','SEND + MORE = MONEY','Carry and column analysis'],['Magic square','All lines sum to S','Centre = S/3'],['Grid with product','(3, 8, 24)','Row relation'],['Digit conditions','“tens is double hundreds”','Equations then brute force'],['Missing figure','Triangle: 3, 5, 8','Sum, product or square'],['Number puzzle','Sum of digits and reverse','Algebra on digits']],'sm')
    h+=tips(['Use mod 9 (digit sum) to test a multiplication or addition quickly.','In a cryptarithm, start with the letter that can only be 1 or 0.','Magic square: centre = sum/3 and corners sum with the centre.'])
    h+=warn(['Letting two letters share a digit.','Ignoring the carry.','Starting at the units column when the leading column is more constrained.'])
    cnt=sum(1 for n in range(100,1000) if sum(map(int,str(n)))==12 and str(n)==str(n)[::-1])
    items=[('Missing: 3, 5, 9, 17, ?','33','B'),('In a magic square with sum 15, what is the centre?','5','B'),('Missing: 1, 4, 9, 16, 25, ?','36','B'),('How many 3-digit palindromes have digit sum 12?',str(cnt),'M'),('How many two-digit numbers equal 4 times the sum of their digits?',str(sum(1 for n in range(10,100) if n==4*sum(map(int,str(n))))),'M'),('Find the largest 3-digit number divisible by 9 whose digits are all different.',str(max(n for n in range(100,1000) if n%9==0 and len(set(str(n)))==3)),'M'),('In TWO + TWO = FOUR, what is the smallest value of FOUR?',str(min(int("".join(str(d[c]) for c in "FOUR")) for d in TW)),'A'),('How many ways can 6 be written as an ordered sum of three positive integers?',str(sum(1 for a in range(1,5) for b in range(1,5) for c in range(1,5) if a+b+c==6)),'A'),('Sum of digits of all numbers from 1 to 99?',str(sum(sum(map(int,str(n))) for n in range(1,100))),'A'),('How many 4-digit numbers have all digits different?',str(9*9*8*7),'A')]
    h+=pq('10. Cryptarithm and number puzzles','Number-puzzle practice',items)
    return h+end()
