from lib import *
P='ABCDEF'
Lft=lambda pos,x,y:(pos[y]-pos[x])%6==1
adj=lambda pos,x,y:(pos[y]-pos[x])%6 in(1,5)
opp=lambda pos,x,y:(pos[y]-pos[x])%6==3
CONS=[lambda s:Lft(s,'A','B'),lambda s:opp(s,'B','E'),lambda s:not adj(s,'C','A'),lambda s:Lft(s,'D','C'),lambda s:adj(s,'F','E')]
def circ_sols():
    out=[]
    for perm in itertools.permutations(P):
        if perm[0]!='A':continue
        pos={p:i for i,p in enumerate(perm)}
        if all(c(pos) for c in CONS):out.append(perm)
    return out
CS=circ_sols();assert len(CS)==1;SOL=CS[0]
# linear: 7 people in a row facing north, left to right positions 0..6
R='PQRSTUV'
def lin_sols():
    out=[]
    for perm in itertools.permutations(R):
        pos={p:i for i,p in enumerate(perm)}
        if pos['T']==0 and pos['P']==pos['Q']-2 and abs(pos['R']-pos['S'])==1 and pos['U']==pos['S']+2 and pos['Q']<pos['U']:out.append(perm)
    return out
LS=lin_sols()
def f_circ():
    f,ax=plt.subplots(figsize=(7.6,3.6));ax.set_aspect('equal');ax.axis('off');ax.set_xlim(-6.2,6.2);ax.set_ylim(-2.7,2.7)
    ax.add_patch(Circle((-3.2,0),1.15,fc='#e0e7ff',ec='#14213d'));ax.text(-3.2,0,'table',ha='center',fontsize=9)
    import math as m
    for i,pn in enumerate(SOL):
        a=m.pi/2-i*2*m.pi/6;x,y=-3.2+2.0*m.cos(a),2.0*m.sin(a)
        ax.add_patch(Circle((x,y),0.38,fc='#fde68a',ec='#14213d'));ax.text(x,y,pn,ha='center',va='center',fontweight='bold',fontsize=11)
        ax.annotate('',xy=(-3.2+1.2*m.cos(a),1.2*m.sin(a)),xytext=(x-0.4*m.cos(a),y-0.4*m.sin(a)),arrowprops=dict(arrowstyle='->',color='#6b7280'))
    ax.text(-1.0,0,'Facing the centre:\nyour LEFT = clockwise neighbour\nyour RIGHT = anticlockwise neighbour\n\nFacing outside:\nthe left and right swap.',fontsize=9.5,va='center',color='#14213d')
    save(f,'ar2_circ')
f_circ()
def f_row():
    f,ax=plt.subplots(figsize=(8,2.2));ax.axis('off');ax.set_xlim(0,8);ax.set_ylim(0,2.3)
    for i in range(7):
        ax.add_patch(Rectangle((0.3+i*1.07,0.5),0.9,0.9,fc='#bfdbfe',ec='#14213d'));ax.text(0.75+i*1.07,0.95,str(i+1),ha='center',va='center',fontweight='bold')
    ax.text(0.3,1.75,'LEFT end',fontsize=9.5,color='#be123c',fontweight='bold');ax.text(6.4,1.75,'RIGHT end',fontsize=9.5,color='#be123c',fontweight='bold')
    ax.text(4,0.1,'Facing NORTH: the person’s left is the left of the picture. Facing SOUTH it is reversed.',ha='center',fontsize=9.5)
    save(f,'ar2_row')
f_row()
def html():
    h=top('Seating Arrangements: Linear and Circular','ADVANCED REASONING · SEATING · MUST-DO','#7c3aed')
    h+=intro('Seating questions are the most common puzzle in TCS NQT Reasoning. They are easy when you follow a fixed method: <b>(1) draw the empty seats, (2) fix the most definite person, (3) place others from positive clues, (4) use negative clues to eliminate, (5) verify</b>. The only trap is the direction of left and right.')
    h+=fig('ar2_row','A linear arrangement. Always note which way the people face.')
    h+=form('Rules to memorise',['<b>Facing the centre (circle):</b> your immediate left is the next person clockwise; your immediate right is anticlockwise.','<b>Facing outside:</b> left and right swap.','<b>Opposite in a circle of n people (n even):</b> position + n/2.','<b>Number of arrangements:</b> n! in a line, (n − 1)! in a circle, 2^(n/2)… only when pairs can swap.','“Between X and Y” means in the middle; “X is second to the left of Y” means skip one person.','“Sits next to” = adjacent on either side; “immediate left” = one particular side.','In a circle with n seats, the distance in either direction is d and n − d.'])
    h+=h3('Worked example: circular table, 6 people')
    h+=p('Six people A, B, C, D, E and F sit around a circular table facing the centre. <b>(1)</b> B is the immediate left of A. <b>(2)</b> E sits opposite B. <b>(3)</b> C is not adjacent to A. <b>(4)</b> C is the immediate left of D. <b>(5)</b> F sits next to E. Find who sits opposite A, and between whom D sits.')
    h+=fig('ar2_circ','The unique arrangement, found by exhaustive search of all 120 circular orders.')
    pos={x:i for i,x in enumerate(SOL)};opA=SOL[(pos['A']+3)%6]
    h+=ex('Who sits opposite A, and between which two people does D sit?',f'{opA}; between {SOL[(pos["D"]-1)%6]} and {SOL[(pos["D"]+1)%6]}',f'Fix A at the top. B (immediate left of A) is the next clockwise seat. E is opposite B (three seats away). C cannot be next to A, and C is the immediate left of D, so D must sit just anticlockwise of C: the only fit is B → D → C. Remaining F next to E closes the circle. Clockwise order: {" → ".join(SOL)}. Opposite A is {opA}. D sits between B and C. I checked all five statements on this arrangement, and a program confirmed that no other arrangement works.')
    h+=h3('Worked example: a row of seven people')
    h+=p('Seven people sit in a row facing north. T is at the extreme left. P sits two places to the left of Q. R and S are adjacent. U sits two places to the right of S. Q is to the left of U.')
    h+=ex('Find the order from the left.',''.join(LS[0]),f'T is first. P is two places left of Q, and U is two places right of S with Q left of U. Trying the placements of the adjacent pair R, S, only one keeps every condition. Order from the left: {"".join(LS[0])}. A program tried all 5,040 orders and confirmed it is the only one.')
    h+=h3('Decision flow for any seating question')
    h+=tb(['Step','Do','Why'],[['1','Count seats, draw them','Prevents mixing positions.'],['2','Note direction (north / centre / outside)','Left and right depend on it.'],['3','Place fixed positions (extreme, opposite, “third from left”)','They are the anchors.'],['4','Join people into blocks (“A is left of B”)','Blocks are easier to slide.'],['5','Try two cases for “either/or” clues','Short cases beat guessing.'],['6','Verify every clue','Catches misreads.']],'sm')
    h+=tips(['Make “blocks”: if A is immediate left of B, write AB and treat it as one unit.','In a circle always fix one person; this removes rotation.','Opposite clues in a circle pair up people instantly.','If two answers fit, look for the clue you have not used.'])
    h+=warn(['Using left/right as seen from the picture instead of the person.','Forgetting that “between” excludes the end people.','Placing two people in one seat because a negative clue was applied first.'])
    # practice items computed
    n=6;items=[('In how many ways can 6 people sit around a circular table?',str(math.factorial(5)),'B'),('In how many ways can 5 people sit in a row?',str(math.factorial(5)),'B'),('In a circle of 8 people, whose position is opposite the person at seat 3?','seat 7','B'),('In how many ways can 3 men and 3 women sit in a row alternately (men first)?',str(math.factorial(3)*math.factorial(3)),'M'),('In how many ways can 4 men and 4 women sit alternately around a circular table?',str(math.factorial(3)*math.factorial(4)),'M'),('In how many ways can 5 people sit in a row if A and B must be together?',str(math.factorial(4)*2),'M'),('Seven people sit round a circle. In how many ways can A and B sit together?',str(math.factorial(5)*2),'M'),('Eight friends sit round a table. In how many arrangements are A and B opposite each other?',str(math.factorial(6)),'A'),('In the worked circular example, who is the immediate right of A (facing the centre)?',SOL[-1],'A'),('Five people sit in a row. A and B must not sit together. How many arrangements?',str(math.factorial(5)-math.factorial(4)*2),'A')]
    h+=pq('2. Seating','Seating practice',items)
    return h+end()
