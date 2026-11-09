from lib import *
N='PQRST';COL=['Red','Blue','Green','Yellow','White']
def fsols():
    out=[]
    for fl in itertools.permutations(range(1,6)):
        f=dict(zip(N,fl))
        if f['P']!=3 or f['Q']!=f['R']+1 or f['T']!=1:continue
        for cp in itertools.permutations(COL):
            c=dict(zip(N,cp));cf={c[n]:f[n] for n in N}
            if c['T']=='Red' and cf['Blue']==f['S']+2 and c['P']=='Green' and cf['Yellow']>cf['White']:out.append((f,c))
    return out
FS=fsols();assert len(FS)==1;F,C=FS[0]
DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday']
def dsols():
    out=[]
    for perm in itertools.permutations('ABCDE'):
        d={x:i for i,x in enumerate(perm)}
        if d['C']==2 and d['B']-d['A']==2 and d['E']<d['D'] and d['D']!=0 and d['A']!=0:out.append(perm)
    return out
DS=dsols();assert len(DS)==1
def f_grid():
    rows=[[str(fl),n,C[n]] for n,fl in sorted(F.items(),key=lambda x:-x[1])]
    colmap={'Red':'#fecaca','Blue':'#bfdbfe','Green':'#bbf7d0','Yellow':'#fef08a','White':'#f3f4f6'}
    colors=[[None,None,colmap[r[2]]] for r in rows]
    tablefig('ar3_grid',['Floor','Person','Colour'],rows,[1.2,1.6,2],colors=colors,title='Final grid for the floor puzzle')
f_grid()
flow('ar3_method',['List persons and\nattributes','Draw a grid\n(rows × attributes)','Fill sure facts\nfirst','Use “either/or”\nand eliminate','Verify every\nclue'],'The grid method for multi-attribute puzzles')
def html():
    h=top('Multi-Attribute Puzzles: Floors, Days, Colours','ADVANCED REASONING · PUZZLES · MUST-DO','#b45309')
    h+=intro('These puzzles give you 5–8 people and 2–3 attributes (floor, colour, day, profession). The only reliable tool is a <b>grid</b>: one row per item, one column per attribute. Fill the sure facts, eliminate with the others, and verify. They look long but each puzzle usually contains <b>one anchor clue</b> that cracks the rest.')
    h+=fig('ar3_method','The five-step grid method.')
    h+=form('Rules',['<b>Anchor clue:</b> an exact value (“P lives on floor 3”). Start there.','<b>“Immediately above” = +1; “two floors above” = +2; “somewhere above” = any greater floor.</b>','<b>“Between X and Y”</b> means the middle value, not equal to either.','<b>Negative clues</b> remove options; use them when the grid is almost full.','<b>Chain clues:</b> A > B, B > C ⇒ A > C: write them as a chain first.','Count: if three people can only take two values, you made a mistake somewhere.'])
    h+=h3('Worked puzzle 1: five floors and five colours')
    h+=p('P, Q, R, S and T live on different floors of a five-storey building (floor 1 is the lowest). Each likes a different colour among Red, Blue, Green, Yellow and White. <b>(1)</b> P lives on floor 3 and likes Green. <b>(2)</b> T lives on floor 1 and likes Red. <b>(3)</b> Q lives immediately above R. <b>(4)</b> The person who likes Blue lives two floors above S. <b>(5)</b> The Yellow lover lives higher than the White lover.')
    h+=fig('ar3_grid','The unique solution, found by checking all 14,400 floor and colour combinations.')
    h+=ex('Who lives on floor 5 and what colour does that person like?',f'{[n for n,x in F.items() if x==5][0]}; {C[[n for n,x in F.items() if x==5][0]]}',f'P is on 3 and T on 1, so Q, R, S take 2, 4, 5. Q is immediately above R: R = 4, Q = 5, leaving S = 2. Blue is two above S = floor 4, so R likes Blue. Yellow and White remain for floors 2 (S) and 5 (Q); Yellow is higher, so Q likes Yellow and S likes White.')
    h+=ex('Which person lives immediately below P, and which colour does that person like?',f'{[n for n,x in F.items() if x==2][0]}; {C[[n for n,x in F.items() if x==2][0]]}','Floor 2 is S, who likes White.')
    h+=h3('Worked puzzle 2: five days')
    h+=p('Five friends A, B, C, D and E each visit a museum on a different day from Monday to Friday. <b>(1)</b> C visits on Wednesday. <b>(2)</b> B visits two days after A. <b>(3)</b> E visits before D. <b>(4)</b> A and D do not visit on Monday.')
    h+=ex('On which day does each friend visit?',', '.join(f'{p_}: {DAYS[i]}' for i,p_ in enumerate(DS[0])),'C = Wednesday. B is two days after A with A not on Monday: A = Tuesday, B = Thursday (A = Monday is forbidden; A = Wednesday clashes with C). The remaining days are Monday and Friday for D and E. D cannot be Monday and E is before D, so E = Monday, D = Friday. A program tried all 120 orders; this is the only one.')
    h+=tb(['Type','Example','Key idea'],[['Floors / positions','“Q lives immediately above R”','Differences of +1, +2.'],['Days / months','“B visits two days after A”','Position arithmetic; wrap around week.'],['Professions','“The doctor does not like red”','Grid of ✔ and ✘.'],['Counting','“How many people live above S?”','Final grid, then count.'],['Conditional','“If P is on 4 then …”','Branch cases.']],'sm')
    h+=tips(['Mark every cell ✔ or ✘ rather than writing nothing: you see contradictions early.','Positive clues with exact values come first; “not” clues come last.','When two persons can swap, a later clue is always waiting to break the tie.','Redraw the grid after each major deduction to keep it readable.'])
    h+=warn(['Using “above” as “immediately above”.','Forgetting that “between” is strict.','Not checking the very first clue again at the end.'])
    items=[('Floors 1 to 5: the sum of floor numbers of all five persons?',str(sum(range(1,6))),'B'),('In puzzle 1, on which floor does the Blue lover live?',str(F[[n for n in N if C[n]=="Blue"][0]]),'B'),('In puzzle 1, who lives on floor 2?',[n for n,x in F.items() if x==2][0],'B'),('In puzzle 2, which friend visits on Tuesday?',DS[0][1],'M'),('In puzzle 2, who visits the day after C?',DS[0][3],'M'),('In puzzle 1, how many people live above P?','2','M'),('In puzzle 2, how many friends visit before B?','3','M'),('In puzzle 1, who likes White?',[n for n in N if C[n]=='White'][0],'A'),('How many different arrangements of 5 people into 5 floors exist?',str(math.factorial(5)),'A'),('Puzzle 1 has how many solutions in total (found by program)?',str(len(FS)),'A')]
    h+=pq('3. Multi-attribute puzzles','Puzzle practice',items)
    return h+end()
