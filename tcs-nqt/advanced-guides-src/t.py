import itertools
P='ABCDEF'
def sols(cons):
    out=[]
    for perm in itertools.permutations(P):
        if perm[0]!='A':continue   # fix A to kill rotation
        pos={p:i for i,p in enumerate(perm)}
        if all(c(pos) for c in cons):out.append(perm)
    return out
L=lambda pos,x,y:(pos[y]-pos[x])%6==1   # y is immediate left (clockwise) of x
adj=lambda pos,x,y:(pos[y]-pos[x])%6 in(1,5)
opp=lambda pos,x,y:(pos[y]-pos[x])%6==3
cons=[lambda s:L(s,'A','B'),lambda s:opp(s,'B','E'),lambda s:not adj(s,'C','A') ,lambda s:L(s,'D','C') ,lambda s:adj(s,'F','E')]
r=sols(cons);print(len(r),r)
