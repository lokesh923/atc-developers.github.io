from lib import *
def liar1():
    # A: "B is lying". B: "C is lying". C: "A and B are both lying". Who tells the truth?
    out=[]
    for a,b,c in itertools.product([True,False],repeat=3):
        okA=(a==(not b));okB=(b==(not c));okC=(c==((not a) and (not b)))
        if okA and okB and okC:out.append((a,b,c))
    return out
L1=liar1()
def liar2():
    out=[]
    for t in itertools.product([True,False],repeat=4):
        a,b,c,d=t
        # A: exactly one of us is lying. B: exactly two of us are lying. C: exactly three. D: all four lying.
        lies=sum(1 for x in t if not x)
        st=[lies==1,lies==2,lies==3,lies==4]
        if all(t[i]==st[i] for i in range(4)):out.append(t)
    return out
L2=liar2()
def implication_table():
    rows=[]
    for p,q in itertools.product([True,False],repeat=2):
        imp=(not p) or q;conv=(not q) or p;contra=(not (not q)) or (not p) if False else ((q) or (not p));inv=p or (not q) if False else ((not p) or (not q)) if False else None
    return rows
tablefig('ar9_imp',['If P then Q','Statement','Valid?'],[['Original','If it rains, the road is wet','—'],['Converse','If the road is wet, it rained','No'],['Inverse','If it does not rain, the road is not wet','No'],['Contrapositive','If the road is not wet, it did not rain','Yes']],[1.5,3.8,1.2],colors=[[None,None,None],[None,None,'#fecaca'],[None,None,'#fecaca'],[None,None,'#bbf7d0']],title='Only the contrapositive is always valid')
def ct():
    # verify with truth table: contrapositive equivalent, converse not
    imp=lambda p,q:(not p) or q
    eq=lambda f,g:all(f(p,q)==g(p,q) for p in(0,1) for q in(0,1))
    return eq(lambda p,q:imp(p,q),lambda p,q:imp(not q,not p)),eq(lambda p,q:imp(p,q),lambda p,q:imp(q,p))
CT=ct()
def html():
    h=top('Truth-Tellers, Liars and Critical Reasoning','ADVANCED REASONING · LOGIC · IMPORTANT','#0f766e')
    h+=intro('Two families of logic questions: <b>truth/liar puzzles</b> (try each person as the truth-teller) and <b>critical reasoning</b> (strengthen, weaken, find the assumption, find the flaw). The first is solved by a short table of cases; the second by understanding what a conclusion needs.')
    h+=fig('ar9_imp','The contrapositive is the only equivalent form of an if-then statement.')
    h+=form('Logic rules',['<b>If P then Q</b> equals <b>if not Q then not P</b> (contrapositive). It does <b>not</b> equal “if Q then P”.','<b>“Only if”:</b> “P only if Q” means if P then Q.','<b>“Unless”:</b> “A unless B” means if not B then A.','<b>“Either … or”</b> in puzzles usually means at least one; “exactly one” means not both.','<b>Truth-teller always speaks truth, liar always lies:</b> if X says “I am a liar” the statement is a paradox, so such a puzzle does not exist.','<b>Method:</b> assume person 1 is truthful, follow the consequences, check for contradiction; try the other case.'])
    h+=ex('A says “B is lying.” B says “C is lying.” C says “A and B are both lying.” Who tells the truth?',', '.join(n for n,v in zip('ABC',L1[0]) if v)+' tells the truth' if len(L1)==1 and any(L1[0]) else 'see working','A program tried all 8 truth patterns. '+('Only one is consistent: '+', '.join(f'{n}={"truth" if v else "lie"}' for n,v in zip('ABC',L1[0]))+'.' if len(L1)==1 else f'{len(L1)} patterns fit.'))
    h+=ex('Four people say: A “exactly one of us is lying”, B “exactly two of us are lying”, C “exactly three of us are lying”, D “all four of us are lying”. Who tells the truth?',', '.join(n for n,v in zip('ABCD',L2[0]) if v) if len(L2)==1 else f'{len(L2)} patterns','At most one of these mutually exclusive claims can be true. If exactly three are lying then C is the only truth-teller: C’s own claim “exactly three lie” is then true. A program checked all 16 patterns and confirmed this is the only consistent one.')
    h+=ex('Statement: “If a candidate clears the aptitude round, he is called for the interview.” Aman was not called for the interview. What follows?','He did not clear the aptitude round','Contrapositive: not called ⇒ did not clear the aptitude round. (Truth-table check: contrapositive equivalent = '+str(CT[0])+'; converse equivalent = '+str(CT[1])+'.)')
    h+=h3('Critical reasoning: the four question types')
    h+=tb(['Type','Question','What to do'],[['Assumption','“The argument assumes …”','Find the unstated link between premise and conclusion.'],['Strengthen','“Which most strengthens …”','Add evidence that makes the conclusion more likely.'],['Weaken','“Which most weakens …”','Show an alternative cause or a counter-example.'],['Flaw','“The reasoning is flawed because …”','Look for correlation vs causation, small sample, false either-or.'],['Inference','“Which must be true …”','Only what follows directly; nothing extra.'],['Paradox','“Resolve the apparent contradiction”','The option that makes both facts true.']],'sm')
    h+=ex('Argument: “After the city opened a new metro line, car sales in the city fell. Therefore the metro caused the fall.” Which of the following most weakens the argument? (a) Metro fares are low. (b) Car sales fell in neighbouring cities with no metro. (c) The metro serves 5 lakh people a day. (d) Some people prefer cars.','(b)','If sales fell everywhere, including cities without a metro, the metro is not the cause. The other options do not challenge the causal claim.')
    h+=ex('Argument: “Company X’s ads increased in 2023 and sales increased. So ads increase sales.” What is the assumption?','No other factor caused the sales increase','The argument assumes the sales rose because of the ads, not because of price cuts, festivals or other causes.')
    h+=tips(['Weaken = break the link; strengthen = repair the link.','Be wary of words like “all”, “always”, “only” in options: they are usually too strong.','For “must be true” questions, pick the option that is hardest to deny.'])
    h+=warn(['Using outside knowledge instead of the passage.','Accepting a converse as valid.','Treating correlation as proof of cause.'])
    items=[('“If it rains, the match is cancelled.” The match was not cancelled. What follows?','It did not rain','B'),('Is “If the road is wet, it rained” equivalent to the original “If it rains, the road is wet”?',str(CT[1]).replace('False','No').replace('True','Yes'),'B'),('Is the contrapositive equivalent to the original?',str(CT[0]).replace('True','Yes').replace('False','No'),'B'),('A says “B lies.” B says “A lies.” How many people can tell the truth?','1 (exactly one)','M'),('A: “C is a liar.” B: “A is truthful.” C: “B is a liar.” Who is truthful? (try all 8)',[n for n,v in zip('ABC',[t for t in itertools.product([True,False],repeat=3) if (t[0]==(not t[2])) and (t[1]==t[0]) and (t[2]==(not t[1]))][0]) if v] and ', '.join(n for n,v in zip('ABC',[t for t in itertools.product([True,False],repeat=3) if (t[0]==(not t[2])) and (t[1]==t[0]) and (t[2]==(not t[1]))][0]) if v) or 'none','M'),('“No manager is a fresher; some fresher are tall.” Can we conclude “some tall persons are not managers”?','Yes','M'),('How many truth patterns exist for 5 people?',str(2**5),'A'),('In the 4-person puzzle above, how many are lying?',str(sum(1 for v in L2[0] if not v)),'A'),('A “only if” B means?','If A then B','A'),('“A unless B” is equivalent to?','If not B then A','A')]
    h+=pq('9. Truth-tellers and critical reasoning','Logic practice',items)
    return h+end()
