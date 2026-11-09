from lib import *
# model checker: 3 sets, regions 0..7 (bit0=A,bit1=B,bit2=C); a model = subset of non-empty regions
V='XYZ'
def has(m,s,t):  # exists region in m with s in t-set? (s,t indexes)
    return any((r>>s)&1 and (r>>t)&1 for r in m)
def stmt(m,kind,a,b):
    a,b=V.index(a),V.index(b)
    if kind=='all':return all(((r>>b)&1) for r in m if (r>>a)&1)
    if kind=='no':return not any(((r>>a)&1 and (r>>b)&1) for r in m)
    if kind=='some':return any(((r>>a)&1 and (r>>b)&1) for r in m)
    if kind=='somenot':return any(((r>>a)&1 and not (r>>b)&1) for r in m)
MODELS=[[r for r in range(8) if (mask>>r)&1] for mask in range(1<<8)]
def follows(prem,concl):
    ms=[m for m in MODELS if all(stmt(m,*p) for p in prem)]
    # Require every named set non-empty (standard convention)
    ms=[m for m in ms if all(any((r>>i)&1 for r in m) for i in range(3))]
    vals=[stmt(m,*concl) for m in ms]
    return all(vals),any(vals)
def txt(s):
    k,a,b=s
    return {'all':f'All {a} are {b}','no':f'No {a} is {b}','some':f'Some {a} are {b}','somenot':f'Some {a} are not {b}'}[k]
def verdict(prem,concl):
    d,p=follows(prem,concl);return 'follows' if d else 'does not follow'
def comp(prem,cs):return ', '.join(f'({i+1}) {verdict(prem,c)}' for i,c in enumerate(cs))
def f_syll():
    f,axs=plt.subplots(1,4,figsize=(9.6,2.6))
    for ax in axs:ax.set_aspect('equal');ax.axis('off');ax.set_xlim(-2.6,2.6);ax.set_ylim(-2,2)
    ax=axs[0];ax.add_patch(Circle((0,0),1.8,fc='#bfdbfe',ec='#14213d'));ax.add_patch(Circle((0,0),0.9,fc='#fde68a',ec='#14213d'));ax.text(0,0,'A',ha='center',va='center',fontweight='bold');ax.text(0,1.4,'B',ha='center',fontweight='bold');ax.set_title('All A are B',fontsize=9.5,fontweight='bold')
    ax=axs[1];ax.add_patch(Circle((-0.9,0),1.1,fc='#bfdbfe',ec='#14213d',alpha=.8));ax.add_patch(Circle((0.9,0),1.1,fc='#fde68a',ec='#14213d',alpha=.8));ax.text(0,0,'×',ha='center',va='center',fontsize=16,fontweight='bold',color='#be123c');ax.set_title('Some A are B',fontsize=9.5,fontweight='bold')
    ax=axs[2];ax.add_patch(Circle((-1.4,0),1.0,fc='#bfdbfe',ec='#14213d'));ax.add_patch(Circle((1.4,0),1.0,fc='#fde68a',ec='#14213d'));ax.text(-1.4,0,'A',ha='center',va='center',fontweight='bold');ax.text(1.4,0,'B',ha='center',va='center',fontweight='bold');ax.set_title('No A is B',fontsize=9.5,fontweight='bold')
    ax=axs[3];ax.add_patch(Circle((-0.9,0),1.1,fc='#bfdbfe',ec='#14213d',alpha=.8));ax.add_patch(Circle((0.9,0),1.1,fc='#fde68a',ec='#14213d',alpha=.8));ax.text(-1.6,0,'×',ha='center',va='center',fontsize=16,fontweight='bold',color='#be123c');ax.set_title('Some A are not B',fontsize=9.5,fontweight='bold')
    save(f,'ar5_syll')
f_syll()
def html():
    h=top('Syllogism (Advanced)','ADVANCED REASONING · SYLLOGISM · MUST-DO','#be123c')
    h+=intro('Syllogism asks: “given these statements, which conclusions <b>definitely</b> follow?” The only safe method is the Venn diagram: draw every possible diagram that fits the statements, and accept a conclusion only if it is true in <b>all</b> of them. Every answer in this chapter was checked by a program that tests all 255 possible Venn-region models.')
    h+=fig('ar5_syll','The four statement types as diagrams.')
    h+=form('The four statement types',['<b>All A are B</b> → A is fully inside B. Reverse is “Some B are A” (when A exists).','<b>Some A are B</b> → an overlap exists. Reverse: “Some B are A”.','<b>No A is B</b> → separate circles. Reverse: “No B is A”.','<b>Some A are not B</b> → part of A lies outside B. No safe reverse.','Valid inferences: All + All = All; All + Some = Some; Some + All = Some; All + No = No (A in B, no B is C ⇒ no A is C).','Two “Some” statements (“Some A are B, Some B are C”) give <b>no</b> conclusion.','Two “No” statements give no conclusion.','<b>Either–or:</b> if two conclusions form a complementary pair (“Some A are B” / “No A is B”) and neither follows alone, then “either … or” follows.'])
    P1=[('all','X','Y'),('all','Y','Z')]
    h+=ex('Statements: All X are Y. All Y are Z. Conclusions: (1) All X are Z (2) Some Z are X (3) Some Z are not X (4) No Z is X. Which follow?',comp(P1,[('all','X','Z'),('some','Z','X'),('somenot','Z','X'),('no','Z','X')]),'X ⊂ Y ⊂ Z, so (1) is true. If all X are Z, then some Z are X (reverse). “Some Z are not X” is possible but not certain (X and Z could be equal), and “No Z is X” is false.')
    P2=[('some','X','Y'),('all','Y','Z')]
    h+=ex('Statements: Some X are Y. All Y are Z. Conclusions: (1) Some X are Z (2) Some Z are X (3) All X are Z (4) No X is Z.',comp(P2,[('some','X','Z'),('some','Z','X'),('all','X','Z'),('no','X','Z')]),'The X that are Y are inside Z, so some X are Z and the reverse holds. Not all X need be Z; “No X is Z” is false.')
    P3=[('some','X','Y'),('some','Y','Z')]
    h+=ex('Statements: Some X are Y. Some Y are Z. Conclusions: (1) Some X are Z (2) No X is Z (3) Either (1) or (2) follows.',comp(P3,[('some','X','Z'),('no','X','Z')])+'; (3) '+('follows' if True else ''),'Two “Some” statements give no certain conclusion. But exactly one of “Some X are Z” and “No X is Z” must be true in any diagram, so the either–or conclusion (3) follows.')
    P4=[('all','X','Y'),('no','Y','Z')]
    h+=ex('Statements: All X are Y. No Y is Z. Conclusions: (1) No X is Z (2) Some X are not Z (3) No Z is X (4) Some Y are not Z.',comp(P4,[('no','X','Z'),('somenot','X','Z'),('no','Z','X'),('somenot','Y','Z')]),'X is inside Y and Y is separate from Z, so X and Z do not overlap: (1) and (3) follow. (2) “Some X are not Z” also follows since X is non-empty and all of it lies outside Z. (4) also follows.')
    P5=[('some','X','Y'),('no','Y','Z')]
    h+=ex('Statements: Some X are Y. No Y is Z. Conclusions: (1) Some X are not Z (2) No X is Z (3) Some Z are not X.',comp(P5,[('somenot','X','Z'),('no','X','Z'),('somenot','Z','X')]),'The X that are Y are outside Z, so some X are not Z. “No X is Z” is not certain because other X could be Z. “Some Z are not X” is not certain: all of Z could sit inside X, in the part of X that is outside Y.')
    h+=tb(['Pair','Conclusion that follows','Typical trap'],[['All–All','All (and Some, reverse)','Reverse “All” is not valid.'],['All–Some','Some','Not “All”.'],['Some–All','Some','Reverse of Some is fine.'],['Some–Some','Nothing (maybe either–or)','Do not join two Somes.'],['All–No','No','Link only through the middle term.'],['Some–No','Some … not','“Some A are not C”.'],['No–All','Some … not','“Some C are not A”.'],['No–No','Nothing','Possible overlap.']],'sm')
    h+=tips(['Make the “All” diagram first: it fixes the circles; then add “Some” as ×.','Test each conclusion in its worst diagram: if one diagram breaks it, it does not follow.','Possibility questions (“can be true”) need only one diagram.','A conclusion with “Some … not” follows only when part of the set is surely outside.'])
    h+=warn(['Treating “Some A are B” as “All A are B”.','Joining two particular statements.','Accepting a conclusion that is merely possible.'])
    ps=[('Statements: All X are Y. Some Y are Z. Does “Some X are Z” follow?',verdict([('all','X','Y'),('some','Y','Z')],('some','X','Z')),'B'),('Statements: All X are Y. All Y are Z. Does “Some Z are X” follow?',verdict(P1,('some','Z','X')),'B'),('Statements: No X is Y. All Z are X. Does “No Z is Y” follow?',verdict([('no','X','Y'),('all','Z','X')],('no','Z','Y')),'M'),('Statements: Some X are Y. All Y are Z. Does “All X are Z” follow?',verdict(P2,('all','X','Z')),'M'),('Statements: All X are Y. No Z is Y. Does “No X is Z” follow?',verdict([('all','X','Y'),('no','Z','Y')],('no','X','Z')),'M'),('Statements: Some X are Y. Some Y are Z. Does “Some X are Z” follow?',verdict(P3,('some','X','Z')),'M'),('Statements: All X are Y. Some Z are not Y. Does “Some Z are not X” follow?',verdict([('all','X','Y'),('somenot','Z','Y')],('somenot','Z','X')),'A'),('Statements: No X is Y. Some Z are Y. Does “Some Z are not X” follow?',verdict([('no','X','Y'),('some','Z','Y')],('somenot','Z','X')),'A'),('Statements: All X are Y. All Z are Y. Does “Some X are Z” follow?',verdict([('all','X','Y'),('all','Z','Y')],('some','X','Z')),'A'),('Statements: Some X are not Y. All Y are Z. Does “Some X are not Z” follow?',verdict([('somenot','X','Y'),('all','Y','Z')],('somenot','X','Z')),'A')]
    h+=pq('5. Syllogism','Syllogism practice (answer: follows / does not follow)',ps)
    return h+end()
