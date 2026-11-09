import itertools
N='PQRST';Col=['Red','Blue','Green','Yellow','White']
def sols(cl):
    out=[]
    for fl in itertools.permutations(range(1,6)):
        f=dict(zip(N,fl))
        for cp in itertools.permutations(Col):
            c=dict(zip(N,cp));cf={c[n]:f[n] for n in N}
            if all(x(f,c,cf) for x in cl):out.append((f,c))
    return out
cl=[lambda f,c,cf:f['P']==3,
    lambda f,c,cf:f['Q']==f['R']+1,
    lambda f,c,cf:c['T']=='Red' and f['T']==1,
    lambda f,c,cf:cf['Blue']==f['S']+2,
    lambda f,c,cf:c['P']=='Green',
    lambda f,c,cf:cf['Yellow']>cf['White']]
r=sols(cl);print(len(r))
for f,c in r:print(f,c)
