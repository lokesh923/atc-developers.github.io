import itertools
R='PQRSTUV'
C=[lambda p:p['T']==0,lambda p:p['P']==p['Q']-2,lambda p:abs(p['R']-p['S'])==1,lambda p:p['V']>p['R'],lambda p:p['U']==p['S']+2,lambda p:abs(p['Q']-p['V'])==1,lambda p:p['Q']<p['U'],lambda p:p['U']==6]
for k in range(5,9):
  for sub in itertools.combinations(range(8),k):
    r=[perm for perm in itertools.permutations(R) if all(C[i]({x:j for j,x in enumerate(perm)}) for i in sub)]
    if len(r)==1:print(sub,r);break
  else:continue
  break
