from lib import *
OPS={'>':lambda a,b:a>b,'<':lambda a,b:a<b,'≥':lambda a,b:a>=b,'≤':lambda a,b:a<=b,'=':lambda a,b:a==b}
def models(chain,vars_):
    # chain like ['P','>','Q','≥','R'] ; returns all assignments over range(len(vars_)) satisfying
    out=[]
    for vals in itertools.product(range(len(vars_)),repeat=len(vars_)):
        d=dict(zip(vars_,vals))
        if all(OPS[chain[i]](d[chain[i-1]],d[chain[i+1]]) for i in range(1,len(chain),2)):out.append(d)
    return out
def truth(chain,concl):
    vs=sorted(set(x for x in chain if x.isalpha()))
    ms=models(chain,vs);a,o,b=concl
    r=[OPS[o](m[a],m[b]) for m in ms]
    return 'true' if all(r) else ('false' if not any(r) else 'uncertain')
def chain_models(chains):
    vs=sorted({x for c in chains for x in c if x.isalpha()});out=[]
    for vals in itertools.product(range(len(vs)),repeat=len(vs)):
        d=dict(zip(vs,vals))
        if all(OPS[c[i]](d[c[i-1]],d[c[i+1]]) for c in chains for i in range(1,len(c),2)):out.append(d)
    return out
def truth2(chains,concl):
    ms=chain_models(chains);a,o,b=concl
    r=[OPS[o](m[a],m[b]) for m in ms]
    return 'true' if all(r) else ('false' if not any(r) else 'uncertain')
def f_ineq():
    f,ax=plt.subplots(figsize=(8,2.6));ax.axis('off');ax.set_xlim(0,10);ax.set_ylim(0,3)
    xs=[0.6,2.4,4.2,6.0,7.8]
    for x,n in zip(xs,'PQRST'):ax.add_patch(Circle((x+0.45,1.8),0.45,fc='#bfdbfe',ec='#14213d'));ax.text(x+0.45,1.8,n,ha='center',va='center',fontweight='bold')
    for x,o in zip([1.6,3.4,5.2,7.0],['>','≥','=','<']):ax.text(x+0.45,1.8,o,ha='center',va='center',fontsize=16,color='#be123c',fontweight='bold')
    ax.text(5,0.7,'P > Q ≥ R = S < T :  P > R and P > S are definite; P vs T is uncertain.',ha='center',fontsize=10.5,fontweight='bold')
    save(f,'ar6_chain')
f_ineq()
CODE={'@':'>','#':'<','$':'≥','%':'≤','*':'='}
def html():
    h=top('Inequalities: Direct and Coded','ADVANCED REASONING · INEQUALITY · MUST-DO','#1d4ed8')
    h+=intro('An inequality question gives a chain (or several chains) and asks which conclusion is <b>definitely true</b>. The tools: (1) a chain only connects ends when every link points the same way, (2) “=” can be dropped into either direction, (3) a conclusion with “≥ or ≤” is true if the chain gives a strict or equal link.')
    h+=fig('ar6_chain','Strict links > and < , loose links ≥ and ≤ , equal =.')
    h+=form('Rules',['<b>Same direction chain:</b> A > B ≥ C ⇒ A > C (strict + loose = strict). A ≥ B ≥ C ⇒ A ≥ C.','<b>Mixed directions give no relation:</b> A > B < C says nothing about A and C.','<b>Equal sign:</b> A = B ≥ C ⇒ A ≥ C.','<b>Either–or conclusions:</b> if “A > C” and “A = C” both fail separately but together cover cases, the answer is “either … or”. For ≥ the complete pair is “A > C” or “A = C”.','<b>Coded symbols:</b> first decode (e.g. @ = >, # = <), then solve as a normal chain.'])
    ch=['P','>','Q','≥','R','=','S','<','T']
    h+=ex('P > Q ≥ R = S < T. Which are definitely true? (1) P > R (2) P > S (3) P > T (4) R < T (5) Q ≥ S',', '.join(f'({i+1}) {truth(ch,c)}' for i,c in enumerate([('P','>','R'),('P','>','S'),('P','>','T'),('R','<','T'),('Q','≥','S')])),'P > Q ≥ R makes P > R. R = S gives P > S. R = S < T gives R < T. P and T are connected only by opposite directions (P > … < T), so no relation. Q ≥ R = S gives Q ≥ S. I verified each by trying every ordering of the five letters.')
    c1=['A','≥','B','>','C'];c2=['D','=','B']
    h+=ex('A ≥ B > C and D = B. Which hold? (1) A > C (2) D > C (3) A ≥ D (4) D ≥ A',', '.join(f'({i+1}) {truth2([c1,c2],c)}' for i,c in enumerate([('A','>','C'),('D','>','C'),('A','≥','D'),('D','≥','A')])),'A ≥ B > C gives A > C. D = B > C gives D > C. A ≥ B = D gives A ≥ D. D ≥ A would need A = B, which is not certain.')
    h+=h3('Coded inequality')
    h+=p('Symbols: <b>@</b> means “greater than”, <b>#</b> means “less than”, <b>$</b> means “greater than or equal to”, <b>%</b> means “less than or equal to”, <b>*</b> means “equal to”.')
    c=['M','>','N','≥','O','<','P']
    h+=ex('Statement: M @ N $ O # P. Conclusions: (1) M > O (2) N > P (3) M > P (4) P > O',', '.join(f'({i+1}) {truth(c,x)}' for i,x in enumerate([('M','>','O'),('N','>','P'),('M','>','P'),('P','>','O')])),'Decode: M > N ≥ O < P. (1) M > N ≥ O gives M > O. (2) N and P are linked through the opposite directions N ≥ O < P, so unknown. (3) M and P are connected via a valley, unknown. (4) O < P means P > O.')
    h+=h3('Either–or and “at least one”')
    c=['X','≥','Y','>','Z']
    h+=ex('X ≥ Y > Z. Conclusions: (1) X > Z (2) X = Z (3) Z > X (4) Z ≥ X',', '.join(f'({i+1}) {truth(c,x)}' for i,x in enumerate([('X','>','Z'),('X','=','Z'),('Z','>','X'),('Z','≥','X')])),'X ≥ Y > Z means X > Z in every case, so only (1) is true.')
    h+=tb(['Chain','Gives','Reason'],[['A > B > C','A > C','Same direction'],['A ≥ B > C','A > C','One strict link'],['A ≥ B ≥ C','A ≥ C','Loose'],['A > B < C','—','Opposite'],['A = B > C','A > C','Equal passes through'],['A ≥ B, B ≥ A','A = B','Both sides']],'sm')
    h+=tips(['Rewrite the whole statement as one chain before reading any conclusion.','If two letters are linked only by a “valley” (>…<) or a “hill” (<…>), no conclusion.','For “either … or” the two conclusions must be complementary (> and =, or < and =).'])
    h+=warn(['Combining A ≥ B ≤ C.','Dropping the “or equal” and calling a conclusion false.','Misreading the coded symbol.'])
    items=[('P > Q > R. Is P > R true? ',truth(['P','>','Q','>','R'],('P','>','R')),'B'),('A ≥ B ≥ C. Is A > C definite?',truth(['A','≥','B','≥','C'],('A','>','C')),'B'),('A > B < C. Is A > C definite?',truth(['A','>','B','<','C'],('A','>','C')),'B'),('K ≥ L = M > N. Is K > N definite?',truth(['K','≥','L','=','M','>','N'],('K','>','N')),'M'),('D < E ≤ F = G. Is D < G definite?',truth(['D','<','E','≤','F','=','G'],('D','<','G')),'M'),('H > I ≥ J, J = K. Is H > K definite?',truth2([['H','>','I','≥','J'],['J','=','K']],('H','>','K')),'M'),('Decode and test: A % B * C @ D (@ is >, % is ≤, * is =). Is A < D definite?',truth(['A','≤','B','=','C','>','D'],('A','<','D')),'A'),('S ≥ T > U, V ≤ T. Is S > V definite?',truth2([['S','≥','T','>','U'],['V','≤','T']],('S','>','V')),'A'),('W = X, X > Y, Z ≥ Y. Is W > Z definite?',truth2([['W','=','X','>','Y'],['Z','≥','Y']],('W','>','Z')),'A'),('B ≥ C ≥ D, D ≥ B. Is C = D definite?',truth2([['B','≥','C','≥','D'],['D','≥','B']],('C','=','D')),'A')]
    h+=pq('6. Inequalities','Inequality practice (true / false / uncertain)',items)
    return h+end()
