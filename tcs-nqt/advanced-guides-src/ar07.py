from lib import *
def suff(worlds,q,s1,s2):
    def uniq(ws):
        v={q(w) for w in ws};return len(v)==1 and len(ws)>0
    A=uniq([w for w in worlds if s1(w)]);B=uniq([w for w in worlds if s2(w)]);AB=uniq([w for w in worlds if s1(w) and s2(w)])
    if A and B:return 'Either statement alone is sufficient'
    if A:return 'Statement I alone is sufficient'
    if B:return 'Statement II alone is sufficient'
    if AB:return 'Both together are needed'
    return 'Even both together are not sufficient'
W=[(x,y) for x in range(-30,31) for y in range(-30,31)]
POS=[(x,y) for x in range(1,31) for y in range(1,31)]
def yn(worlds,q,s1,s2):
    """yes/no question: sufficient if always yes or always no"""
    return suff(worlds,q,s1,s2)
flow('ar7_flow',['Test I alone','Test II alone','If neither,\ntest I + II','Else: not\nsufficient'],'Data sufficiency: always follow this order')
def html():
    h=top('Data Sufficiency','ADVANCED REASONING · DATA SUFFICIENCY · IMPORTANT','#b45309')
    h+=intro('Data sufficiency does not ask you for the answer. It asks whether the <b>given statements are enough to find one single answer</b>. The classic five options are: (A) Statement I alone, (B) Statement II alone, (C) either alone, (D) both together are needed, (E) not even together. Always test I and II separately before combining.')
    h+=fig('ar7_flow','Never combine before testing each statement alone.')
    h+=form('Rules',['<b>A statement is sufficient if it gives exactly one value</b> (or a definite “yes”, or a definite “no” for yes/no questions).','<b>For “What is x?”</b> sufficiency means a single value, not a range.','<b>For “Is x > 5?”</b> a definite “no” is also sufficient. “Sometimes yes, sometimes no” is not.','<b>Do not use outside knowledge</b> unless the question says it is common knowledge.','<b>Combine only when needed.</b> Both together may give an answer even if neither does alone.','<b>Linear equations:</b> two unknowns need two independent equations. Equations that are multiples of each other count as one.'])
    q=lambda w:w[0]
    h+=ex('What is x? I: x + y = 10. II: x − y = 2.',suff(W,q,lambda w:w[0]+w[1]==10,lambda w:w[0]-w[1]==2),'Each statement alone leaves many (x, y) pairs. Together: x = 6, y = 4. I tested all integer pairs from −30 to 30.')
    h+=ex('What is x? I: 2x + 3y = 12. II: 4x + 6y = 24.',suff(W,q,lambda w:2*w[0]+3*w[1]==12,lambda w:4*w[0]+6*w[1]==24),'II is exactly twice I, so both are the same equation. Even together they leave many solutions.')
    h+=ex('Is x > y? I: x = 5. II: y = 3.',yn(W,lambda w:w[0]>w[1],lambda w:w[0]==5,lambda w:w[1]==3),'Alone, each leaves the other variable free. Together x = 5, y = 3 and the answer is “yes”.')
    h+=ex('Is x even? (x is a positive integer ≤ 30.) I: x is a multiple of 4. II: x is a multiple of 3.',yn([(x,0) for x in range(1,31)],lambda w:w[0]%2==0,lambda w:w[0]%4==0,lambda w:w[0]%3==0),'Multiples of 4 are always even, so I alone settles it (“yes”). Multiples of 3 can be odd or even, so II alone does not.')
    h+=ex('How old is A? (age in whole years 1–100) I: A is 4 years older than B. II: The sum of the ages of A and B is 30.',suff([(a,b) for a in range(1,101) for b in range(1,101)],lambda w:w[0],lambda w:w[0]-w[1]==4,lambda w:w[0]+w[1]==30),'Neither alone fixes A. Together A = 17, B = 13.')
    h+=ex('Is x > 0? I: x² > 4. II: x³ > 0.',yn(W,lambda w:w[0]>0,lambda w:w[0]**2>4,lambda w:w[0]**3>0),'x² > 4 gives x > 2 or x < −2, so x can be negative: not sufficient. x³ > 0 forces x > 0: sufficient.')
    h+=tb(['Situation','Verdict'],[['One equation, two unknowns','Not sufficient alone'],['Two unknowns, two independent equations','Sufficient together'],['Statement is a multiple of the other','Counts as one'],['Yes/no question, statement always “no”','Sufficient'],['Statement gives a range','Not sufficient (for “find x”)'],['x² = 9','x = ±3, not unique unless x > 0 is known']],'sm')
    h+=tips(['Look for hidden constraints: “positive integer”, “prime”, “less than 20”.','For yes/no questions, aim to find one example for yes and one for no; if both exist, not sufficient.','Squares and absolute values hide two answers.'])
    h+=warn(['Combining before testing each statement.','Treating “probably yes” as sufficient.','Missing a negative root.'])
    S=[(x,0) for x in range(1,31)]
    items=[('What is x? I: x = 7. II: y = 3.',suff(W,q,lambda w:w[0]==7,lambda w:w[1]==3),'B'),('What is x? I: x + y = 5. II: x − y = 1.',suff(W,q,lambda w:w[0]+w[1]==5,lambda w:w[0]-w[1]==1),'B'),('What is x? I: x² = 25. II: x > 0.',suff(W,q,lambda w:w[0]**2==25,lambda w:w[0]>0),'M'),('What is x? I: x + y = 8. II: 3x + 3y = 24.',suff(W,q,lambda w:w[0]+w[1]==8,lambda w:3*w[0]+3*w[1]==24),'M'),('Is x > y? I: x = 2y. II: y > 0.',yn(W,lambda w:w[0]>w[1],lambda w:w[0]==2*w[1],lambda w:w[1]>0),'M'),('Is x + y even? I: x is even. II: y is odd.',yn(W,lambda w:(w[0]+w[1])%2==0,lambda w:w[0]%2==0,lambda w:w[1]%2==1),'M'),('Is x positive? I: x² > 0. II: x³ > 0.',yn(W,lambda w:w[0]>0,lambda w:w[0]**2>0,lambda w:w[0]**3>0),'A'),('What is x · y? (positive integers) I: x + y = 5, x > y. II: x = 4.',suff(POS,lambda w:w[0]*w[1],lambda w:w[0]+w[1]==5 and w[0]>w[1],lambda w:w[0]==4),'A'),('What is x? (x is a positive integer ≤ 30) I: x is a prime less than 5. II: x is a multiple of 3.',suff(S,q,lambda w:all(w[0]%d for d in range(2,w[0])) and w[0]>1 and w[0]<5,lambda w:w[0]%3==0),'A'),('Is x an integer multiple of 6? (x positive integer ≤ 30) I: x is a multiple of 2. II: x is a multiple of 3.',yn(S,lambda w:w[0]%6==0,lambda w:w[0]%2==0,lambda w:w[0]%3==0),'A')]
    h+=pq('7. Data sufficiency','Data sufficiency practice',items)
    return h+end()
