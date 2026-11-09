from acl import *
_src=open(D+'/../cz/build_pdf.py').read();_ns={}
exec(_src[:_src.index('def chip')],_ns);Q=_ns['Q']
def wrap(no):
    c=Q[no-1]['code'] or ''
    if no==1:return c+'\nn = int(input()); A = input().strip(); B = input().strip()\nprint(solve(A, B))\n'
    if no==2:return c+'\nn = int(input()); B = list(map(int, input().split()))\nprint(beats(B))\n'
    if no==3:return c+'\nn = int(input()); pts = [tuple(map(int, input().split())) for _ in range(n)]\nprint(tina(pts))\n'
    if no==4:return '''n = int(input()); D = list(map(int, input().split()))
if D[0] == D[-1]:
    print(0)
else:
    print(sum(1 for x in D if x != D[0]))
'''
    if no==5:return c+'\nn, K = map(int, input().split()); a = list(map(int, input().split()))\nr = rooms(K, a)\nprint(r[0], r[1])\n'
    if no==6:return c+'\nn, K = map(int, input().split()); a = list(map(int, input().split()))\nprint(stocks(a, K))\n'
    if no==7:return c+'\nn = int(input())\nrows = []\nfor _ in range(n):\n    t = list(map(int, input().split()))\n    rows.append(t[1:])\nprint(contest(rows))\n'
RES={}
for no in range(1,8):
    src=wrap(no);ok=True;outs=[]
    for inp,exp,_ in Q[no-1]['ex']:
        o=run('python',src,inp)
        outs.append((inp,o,exp));ok=ok and o.strip()==exp.strip()
    RES[no]=(src,outs,ok)
ALLOK=all(v[2] for v in RES.values())
def f_map():
    f,ax=plt.subplots(figsize=(8.6,3.4));ax.axis('off')
    rows=[[str(q['no']),q['title'][:38],q['cat'],q['lvl'],'verified' if q['code'] and 'possible' not in ' '.join(q['idea']).lower() else 'possible reading'] for q in Q]
    cols=[[None,None,None,None,'#bbf7d0' if r[4]=='verified' else '#fde68a'] for r in rows]
    tablefig('ac12_map',['#','Problem','Hidden topic','Level','Status'],rows,[0.5,3.9,2.7,1.5,1.7],title='The 7 real TCS Advanced Coding problems we studied',colors=cols,fs=8.4)
f_map()
def html():
    h=top('The Real TCS Problems: What They Hide','ADVANCED CODING · REAL PROBLEMS · MUST-DO','#be123c')
    h+=intro('The best preparation is to look at <b>real problems</b>. We studied 7 Advanced Coding problems from TCS campus-hiring tests. Each one is a classic pattern wearing a story. Learn to see the pattern and the story stops mattering. For each problem below: what the story hides, the idea, a full program, and the sample inputs it was run on. The full statements are in the separate “Actual Questions” PDF.')
    h+=fig('ac12_map','Two of the seven statements were only partly visible in our photos, so those are marked as readings.')
    h+=warn(['Problems 4 and 7 were only partly visible in our source photos. Their code follows a <b>possible reading</b> that matches the examples we have. Do not treat it as the confirmed official solution.','Titles, topics and difficulty labels are ours, for study only.'],'Honest note')
    for q in Q:
        no=q['no'];src,outs,ok=RES[no]
        h+=h3(f'Problem {no}: {q["title"]}')
        h+=tb(['Topic','Level','Complexity'],[[q['cat'],q['lvl'],q['cx']]],'sm')
        h+=''.join(f'<p style="margin:3px 0">{x}</p>' for x in q['idea'])
        tag=f'<span class="k" style="background:#2563eb">Python 3</span>'
        h+=f'<div style="break-inside:avoid">{tag}{code(src)}'
        for inp,o,exp in outs:
            h+=f'<div class="sm"><b>Input</b></div><div class="code" style="background:#1e293b">{_h.escape(inp)}</div><div class="sm"><b>Output</b> (run) · expected from the statement: <b>{_h.escape(exp)}</b> · {"match" if o.strip()==exp.strip() else "MISMATCH"}</div><div class="code" style="background:#064e3b">{_h.escape(o)}</div>'
        h+='</div>'
        h+=f'<div class="box tips" style="margin-top:4px"><b>Verification:</b> {q["ver"]}</div>'
    h+=h3('What these seven problems teach')
    h+=tb(['Story','Pattern','Lesson'],[['Convert A to B','String comparison, distinct letters','Count what must change; check feasibility first'],['Students move to board positions','Permutation cycles, LCM','Simulate small cases to see the cycle'],['Cloth and coordinates','Geometry with a hash set','Try every pair of points, check the other corners'],['T-shirts of friends','Array reading','Read the statement twice; ambiguity costs marks'],['Rooms with exactly K coins','Prefix sum + hash','First occurrence gives the smallest start'],['Restructure stocks','Sort + greedy over t','Only the extremes matter'],['Sweet packing contest','Set + scoring simulation','Implement the rules exactly as written']],'sm')
    h+=tips(['Simulate the sample by hand first; the pattern usually shows itself.','Write the simplest brute force first, then compare it with the clever solution on small random cases (what we did for problems 1, 2, 5 and 6).','If a statement seems ambiguous, choose the reading that matches <b>all</b> examples.'])
    return h+end()
import html as _h
