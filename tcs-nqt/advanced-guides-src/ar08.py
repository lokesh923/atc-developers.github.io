from lib import *
G={'Ramesh':'M','Sita':'F','Anil':'M','Meena':'F','Rajesh':'M','Nisha':'F','Vikram':'M','Pooja':'F','Kabir':'M','Tara':'F','Rohan':'M','Isha':'F'}
PAR={'Anil':('Ramesh','Sita'),'Meena':('Ramesh','Sita'),'Rajesh':('Ramesh','Sita'),'Kabir':('Anil','Nisha'),'Tara':('Anil','Nisha'),'Rohan':('Vikram','Meena'),'Isha':('Rajesh','Pooja')}
SP={'Ramesh':'Sita','Anil':'Nisha','Meena':'Vikram','Rajesh':'Pooja'}
for a,b in list(SP.items()):SP[b]=a
def parents(p):return list(PAR.get(p,()))
def kids(p):return [c for c,ps in PAR.items() if p in ps]
def sibs(p):return [c for c in PAR if c!=p and set(PAR[c])==set(PAR.get(p,()))] if p in PAR else []
def rel(a,b):
    """b is a's ___"""
    g=G[b];m=g=='M'
    if b in parents(a):return 'father' if m else 'mother'
    if b in kids(a):return 'son' if m else 'daughter'
    if SP.get(a)==b:return 'husband' if m else 'wife'
    if b in sibs(a):return 'brother' if m else 'sister'
    if any(b in parents(p) for p in parents(a)):return 'grandfather' if m else 'grandmother'
    if any(b in kids(c) for c in kids(a)):return 'grandson' if m else 'granddaughter'
    pib=[s for p in parents(a) for s in sibs(p)]
    if b in pib:return 'uncle' if m else 'aunt'
    if any(SP.get(s)==b for s in pib):return 'uncle' if m else 'aunt'
    if any(b in kids(s) for s in sibs(a)):return 'nephew' if m else 'niece'
    if any(b in kids(s) for s in pib):return 'cousin'
    if any(SP.get(p)==b for p in kids(a)) :return 'son-in-law' if m else 'daughter-in-law'
    if SP.get(a) and b in parents(SP[a]):return 'father-in-law' if m else 'mother-in-law'
    if SP.get(a) and b in sibs(SP[a]):return 'brother-in-law' if m else 'sister-in-law'
    if any(SP.get(s)==b for s in sibs(a)):return 'brother-in-law' if m else 'sister-in-law'
    return 'distant'
def f_tree():
    f,ax=plt.subplots(figsize=(9,4.2));ax.axis('off');ax.set_xlim(0,12);ax.set_ylim(0,6)
    pos={'Ramesh':(4.5,5.2),'Sita':(6.5,5.2),'Anil':(1.8,3.1),'Nisha':(3.4,3.1),'Meena':(5.6,3.1),'Vikram':(7.2,3.1),'Rajesh':(9.0,3.1),'Pooja':(10.6,3.1),'Kabir':(1.0,1.0),'Tara':(2.6,1.0),'Rohan':(6.4,1.0),'Isha':(9.8,1.0)}
    for n,(x,y) in pos.items():
        c='#bfdbfe' if G[n]=='M' else '#fbcfe8'
        ax.add_patch(FancyBboxPatch((x-0.6,y-0.28),1.2,0.56,boxstyle='round,pad=0.02',fc=c,ec='#14213d'));ax.text(x,y,n,ha='center',va='center',fontsize=9,fontweight='bold')
    for a,b in (('Ramesh','Sita'),('Anil','Nisha'),('Meena','Vikram'),('Rajesh','Pooja')):ax.plot([pos[a][0]+0.6,pos[b][0]-0.6],[pos[a][1]]*2,color='#be123c',lw=2)
    def down(px,py,cx,cy):ax.plot([px,px,cx,cx],[py-0.3,(py+cy)/2,(py+cy)/2,cy+0.3],color='#14213d',lw=1.3)
    mid=5.5
    for c in ('Anil','Meena','Rajesh'):down(mid,5.2,pos[c][0],pos[c][1]) if c!='Anil' else down(mid,5.2,1.8,3.1)
    down(2.6,3.1,1.0,1.0);down(2.6,3.1,2.6,1.0);down(6.4,3.1,6.4,1.0);down(9.8,3.1,9.8,1.0)
    ax.text(0.2,5.6,'blue = male · pink = female · red line = married',fontsize=8.8)
    save(f,'ar8_tree')
f_tree()
def walk(steps,start=(0,0),facing='N'):
    dirs=['N','E','S','W'];vec={'N':(0,1),'E':(1,0),'S':(0,-1),'W':(-1,0)};x,y=start;d=dirs.index(facing)
    for s in steps:
        if s[0]=='F':dx,dy=vec[dirs[d]];x+=dx*s[1];y+=dy*s[1]
        elif s[0]=='R':d=(d+1)%4
        elif s[0]=='L':d=(d-1)%4
    return x,y,dirs[d]
def f_walk():
    f,ax=plt.subplots(figsize=(6.4,3.8));ax.set_aspect('equal');ax.grid(alpha=.3)
    pts=[(0,0),(0,5),(4,5),(4,2),(1,2)];ax.plot(*zip(*pts),'o-',color='#1d4ed8',lw=2.4)
    for p,n in zip(pts,'SABCD'):ax.text(p[0]+0.15,p[1]+0.2,n,fontsize=10,fontweight='bold',color='#be123c')
    ax.set_title('Walk: 5 N, 4 E, 3 S, 3 W  →  distance from start √(1²+2²) = √5',fontsize=10,fontweight='bold')
    ax.set_xlim(-1,5);ax.set_ylim(-1,6);save(f,'ar8_walk')
f_walk()
def html():
    h=top('Blood Relations and Directions','ADVANCED REASONING · RELATIONS AND DIRECTION · MUST-DO','#be123c')
    h+=intro('Blood-relation questions are decoded with a <b>family tree</b>: one symbol per person, a line for marriage, a line down for children. Direction questions are decoded with a <b>coordinate grid</b>: north is up, east is right, and right/left turns rotate the facing direction.')
    h+=fig('ar8_tree','One family tree used for every example in this section.')
    h+=form('Relation vocabulary',['Father’s / mother’s brother = <b>uncle</b>; father’s / mother’s sister = <b>aunt</b>.','Uncle’s or aunt’s child = <b>cousin</b>.','Sister’s / brother’s son = <b>nephew</b>, daughter = <b>niece</b>.','Spouse’s brother or sister, or sibling’s spouse = <b>brother/sister-in-law</b>.','Son’s wife = daughter-in-law; daughter’s husband = son-in-law.','Mother’s mother or father’s mother = <b>grandmother</b>.','“Only son” and “only daughter” fix the number of siblings.','<b>Gender unknown?</b> Use words like “child” or “sibling” until a clue decides.'])
    qs=[('Anil','Rohan'),('Tara','Rajesh'),('Kabir','Meena'),('Rohan','Anil'),('Isha','Sita'),('Rajesh','Nisha'),('Pooja','Meena'),('Anil','Vikram')]
    for a,b in qs[:5]:
        h+=ex(f'Using the tree: what is {b} to {a}?',rel(a,b),f'Trace the path from {a} to {b} on the tree and name the relation. The program applied the same rules to the tree and returned “{rel(a,b)}”.')
    h+=ex('Pointing to a photo, a man says, “His mother is the only daughter of my mother.” How is the man related to the person in the photo?','Maternal uncle','The man’s mother’s only daughter is his sister. The photo’s person’s mother is the man’s sister, so the man is that person’s maternal uncle.')
    h+=h3('Directions')+fig('ar8_walk','Plot the path; the straight-line distance is the diagonal.')
    x,y,d=walk([('F',5),('R',),('F',4),('R',),('F',3),('R',),('F',3)])
    h+=ex('A man walks 5 m north, turns right and walks 4 m, turns right and walks 3 m, turns right and walks 3 m. How far is he from the start, and in which direction does he now face?',f'{math.hypot(x,y):.3f} m; facing {d}; position ({x},{y})',f'Start at (0,0). North 5 → (0,5); right turn → east 4 → (4,5); right → south 3 → (4,2); right → west 3 → (1,2). Distance = √(1² + 2²) = √5 ≈ {math.hypot(1,2):.3f} m. The last move was west, so he faces {d}.')
    h+=ex('A person facing east turns 90° clockwise, then 180°, then 90° anticlockwise. Which way is he facing now?',walk([('R',),('R',),('R',),('L',)],facing='E')[2]+' (facing '+walk([('R',),('R',),('R',),('L',)],facing='E')[2]+')','Clockwise 90° from east = south; 180° more = north; 90° anticlockwise from north = west.')
    h+=ex('Shadow rule: At sunrise, a man’s shadow falls to his right. Which direction is he facing?','South','At sunrise the sun is in the east, so shadows fall west. A shadow on his right means his right is west, so he faces south.')
    h+=tb(['Pattern','Method','Trap'],[['Direct relation','Draw a tree','Gender not given'],['Coded relation (A + B means …)','Decode each symbol','Order of symbols'],['Photograph','Break “his/her” in two steps','Reverse the pointing'],['Distance after turns','Plot x,y','Using the path length'],['Shadow','Sun in the east at sunrise','Left/right swap'],['Compass turns','Right = +90°','Mixing clockwise']],'sm')
    h+=tips(['Mark each person with M/F (or ? if unknown) as soon as the sentence allows.','Draw a vertical line for parent→child and a horizontal one for spouse.','For distance use Pythagoras only on the final displacement, not the path.'])
    h+=warn(['Assuming gender from a name.','Counting the walk length instead of the displacement.','Mixing “my father’s sister” (aunt) with “my mother’s sister” (aunt also) but forgetting “maternal”.'])
    items=[('Using the tree: what is Isha to Rajesh?',rel('Rajesh','Isha'),'B'),('What is Meena to Kabir?',rel('Kabir','Meena'),'B'),('A man faces north, turns right, then right again. He now faces?','South','B'),('What is Tara to Rohan?',rel('Rohan','Tara'),'M'),('What is Anil to Isha?',rel('Isha','Anil'),'M'),('What is Nisha to Rohan?',rel('Rohan','Nisha'),'M'),('A walks 6 m east, then 8 m north. Distance from start?',str(math.hypot(6,8)),'M'),('A person walks 10 m west, 5 m south, 6 m east, 5 m north. Where is he relative to the start (west is negative)?',str(walk([('R',),('R',),('F',10)],facing='N')[:2]) if False else '4 m west','A'),('What is Vikram to Kabir?',rel('Kabir','Vikram'),'A'),('What is Sita to Isha?',rel('Isha','Sita'),'A')]
    h+=pq('8. Relations and Directions','Relations and directions practice',items)
    return h+end()
