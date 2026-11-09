from lib import *
import datetime
# caselet: 6 employees, departments and cities, brute-force unique
EMP='ABCDEF';DEP=['HR','IT','Sales']
def cas():
    out=[]
    for perm in itertools.permutations(range(6)):
        # perm[i] = seat (0..5) of EMP[i] in two rows of 3? simpler: assign department pair
        pass
    for dep in itertools.product(DEP,repeat=6):
        if any(dep.count(d)!=2 for d in DEP):continue
        d=dict(zip(EMP,dep))
        if d['A']==d['B'] or d['C']!=d['D'] or d['E']==d['F'] or d['A']!='HR' or d['C']=='HR' or d['B']!='IT' or d['E']=='IT':continue
        out.append(d)
    return out
CS=cas()
tablefig('ar13_sheet',['Topic','One-line method'],[['Seating','Fix one person; make blocks; verify.'],['Puzzle grid','Anchor first, negatives last.'],['Ranking','L + R − 1 = total.'],['Syllogism','Venn: accept only what holds in every diagram.'],['Inequality','Same direction links only.'],['Sufficiency','Test I, test II, then both.'],['Relations','Draw the tree; mark gender.'],['Directions','x, y coordinates; Pythagoras.'],['Liar puzzles','Try each person as the truth-teller.'],['Cryptarithm','Carry and leading digit first.'],['Calendar','Weeks + odd days.'],['Clock','|30h − 5.5m|.'],['Cubes','8 / 12(n−2) / 6(n−2)² / (n−2)³.'],['Series','d₁, d₂, ratio, squares.']],[2.0,6.2],title='Advanced Reasoning one-page sheet',figw=9.2)
def html():
    h=top('Caselets, Mini Test and Final Sheet','ADVANCED REASONING · REVISION','#0f766e')
    h+=intro('Caselets mix several types: a short story with a few questions. The skill is to <b>decode the story once into a table</b> and answer every question from it. After the caselet comes a timed mini test and a one-page revision sheet.')
    h+=fig('ar13_sheet','Keep this table for the last day.')
    h+=h3('Caselet: six employees, three departments')
    h+=p('Six employees A, B, C, D, E, F work in three departments: HR, IT and Sales. Exactly two employees work in each department. A and B are in different departments; C and D are in the same department; E and F are in different departments; A is in HR; C is not in HR; B is in IT; E is not in IT.')
    ds=CS[0] if len(CS)==1 else None
    h+=ex('Who works in Sales, and where does F work?',', '.join(k for k,v in ds.items() if v=='Sales')+f'; F in {ds["F"]}','Tabulate: A = HR, B = IT. C and D are together and C is not in HR, so they are in IT or Sales. IT already has B, so C and D cannot both fit in IT; they form the Sales pair. HR then needs one more and IT one more among E, F. E is not in IT, so E = HR and F = IT. A program checked all 90 ways to place two employees in each department; exactly one satisfies every clue.') if len(CS)==1 else ''
    h+=ex('Who works with A?',[k for k,v in ds.items() if v==ds['A'] and k!='A'][0],'A is in HR; the other HR employee is E.') if len(CS)==1 else ''
    h+=h3('Timed mini test: 12 questions, 25 minutes')
    ex_ok=lambda a:a
    qs=[('Five people sit in a row. How many ways if A and B must sit together?',str(math.factorial(4)*2),'B'),('X is 14th from the left and 22nd from the right. Total?',str(14+22-1),'B'),('P > Q ≥ R = S. Is P > S true / false / uncertain?','true','B'),('All X are Y. All Y are Z. Does “All Z are X” follow?','does not follow','M'),('How many matches in a 33-team knockout?','32','M'),('A man walks 9 m east and 12 m north. Distance from start?','15','M'),('Angle between clock hands at 7:20?','100','M'),('Next: 2, 6, 12, 20, 30, ?','42','M'),('Which day is 1 January 2028 if 1 January 2027 is Friday?','Saturday','M'),('A cube of side 5 is painted and cut into 1 cm cubes. How many have no painted face?',str(27),'A'),('How many different 3-digit numbers can be made from 1–5 without repetition?',str(5*4*3),'A'),('Trailing logic: “If P then Q”. Not Q. What follows?','Not P','A')]
    h+=pq('13. Caselets and mini test','Mini test (set a 25-minute timer)',qs)
    h+=tips(['Score 10+ : exam-ready; 7–9: revise weak chapters; below 7: redo chapters 2–6 first.','Review every wrong answer: mark whether the mistake was reading, method or arithmetic.'])
    return h+end()
