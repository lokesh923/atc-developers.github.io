from lib import *
import datetime
def ang(h,m):
    a=abs(30*h-5.5*m);a=min(a,360-a);return int(a) if a==int(a) else a
def f_clock():
    f,ax=plt.subplots(figsize=(3.6,3.6));ax.set_aspect('equal');ax.axis('off')
    ax.add_patch(Circle((0,0),1,fc='white',ec='#14213d',lw=2))
    for k in range(12):
        a=math.radians(90-k*30);ax.plot([0.88*math.cos(a),math.cos(a)],[0.88*math.sin(a),math.sin(a)],color='#14213d');ax.text(0.76*math.cos(a),0.76*math.sin(a),str(k or 12),ha='center',va='center',fontsize=8)
    h,m=4,20;ah=math.radians(90-(h*30+m*0.5));am=math.radians(90-m*6)
    ax.plot([0,0.5*math.cos(ah)],[0,0.5*math.sin(ah)],color='#be123c',lw=3.5);ax.plot([0,0.8*math.cos(am)],[0,0.8*math.sin(am)],color='#1d4ed8',lw=2.2)
    ax.set_xlim(-1.1,1.1);ax.set_ylim(-1.3,1.1);ax.text(0,-1.2,'4:20 → angle = |30·4 − 5.5·20| = 10°',ha='center',fontsize=8.5,fontweight='bold');save(f,'ar11_clock')
f_clock()
def f_cube():
    f,ax=plt.subplots(figsize=(8,2.8));ax.axis('off');ax.set_xlim(0,12);ax.set_ylim(0,4)
    rows=[('3 faces painted','corners','8'),('2 faces painted','edges','12(n−2)'),('1 face painted','face centres','6(n−2)²'),('0 faces painted','inner cube','(n−2)³')]
    cols=['#fecaca','#fde68a','#bbf7d0','#bfdbfe']
    for i,(a,b,c) in enumerate(rows):
        ax.add_patch(FancyBboxPatch((0.2+i*2.95,0.6),2.7,2.2,boxstyle='round,pad=0.03',fc=cols[i],ec='#14213d'));ax.text(1.55+i*2.95,2.2,a,ha='center',fontweight='bold',fontsize=9.5);ax.text(1.55+i*2.95,1.6,b,ha='center',fontsize=9);ax.text(1.55+i*2.95,1.0,c,ha='center',fontsize=11,fontweight='bold',color='#be123c')
    ax.text(6,3.5,'A painted cube of side n cut into n³ unit cubes',ha='center',fontweight='bold');save(f,'ar11_cube')
f_cube()
def tri_count(n):
    # triangles in a triangle with n lines per side subdivided: n(n+2)(2n+1)//8 floor
    return n*(n+2)*(2*n+1)//8
def sq_count(n):return sum(k*k for k in range(1,n+1))
def rect_count(n,m):return n*(n+1)//2*m*(m+1)//2
def html():
    h=top('Calendar, Clock, Cubes, Dice and Counting Figures','ADVANCED REASONING · SPATIAL AND TIME · IMPORTANT','#0e7490')
    h+=intro('These questions look different but each uses one memorised result. Calendar: <b>odd days</b>. Clock: the <b>5.5 degrees per minute</b> rule. Cubes: counting corners, edges, faces. Dice: opposite faces. Figures: counting formulas for triangles, squares, rectangles.')
    h+=h3('Calendar')
    h+=form('Odd-day method',['An ordinary year has 365 = 52 weeks + 1 odd day; a leap year has 2 odd days.','<b>100 years = 5 odd days; 200 years = 3; 300 years = 1; 400 years = 0.</b>','Days of a month in odd days: 31 → 3, 30 → 2, Feb → 0 (or 1 if leap).','<b>Leap year:</b> divisible by 4; century years must be divisible by 400.','Odd days → day: 0 Sunday, 1 Monday … 6 Saturday (if counting from Sunday).','Same calendar repeats after 28 years (inside a century) or when the first day and leap status match.'])
    d=datetime.date(2027,1,1)
    h+=ex('What day of the week is 15 August 2027?',datetime.date(2027,8,15).strftime('%A'),f'Count days from a known date: 1 January 2027 is a {d.strftime("%A")}. From 1 Jan to 15 Aug is {(datetime.date(2027,8,15)-d).days} days = {(datetime.date(2027,8,15)-d).days//7} weeks + {(datetime.date(2027,8,15)-d).days%7} odd days, so the day is {datetime.date(2027,8,15).strftime("%A")}.')
    h+=ex('How many odd days are there in 400 years, and is 2100 a leap year?',f'0; {"leap" if (2100%4==0 and (2100%100!=0 or 2100%400==0)) else "not a leap year"}','400 years contain exactly 97 leap years: 400 × 365 + 97 = 146,097 days = 20,871 weeks. 2100 is a century not divisible by 400, so it is not leap.')
    h+=ex('If 1 January 2027 is a Friday, what day will 1 January 2028 be?',datetime.date(2028,1,1).strftime('%A'),'2027 has 365 days = 1 odd day, so Friday moves to Saturday.')
    h+=ex('How many Sundays are there in a leap year that begins on a Saturday?',str(sum(1 for i in range(366) if (datetime.date(2028,1,1)+datetime.timedelta(i)).year==2028 and (datetime.date(2028,1,1)+datetime.timedelta(i)).weekday()==6)),'2028 begins on Saturday. 366 = 52 weeks + 2 extra days (Saturday, Sunday), so 53 Sundays.' )
    h+=h3('Clock')+fig('ar11_clock','Minute hand moves 6° per minute, hour hand 0.5° per minute.')
    h+=form('Clock formulas',['<b>Angle at h:m = |30h − 5.5m|</b> (take 360 − result if more than 180).','Hands coincide every 65 5/11 minutes; in 12 hours 11 times; in 24 hours 22 times.','Hands are opposite 11 times in 12 hours.','Hands are at right angles 22 times in 12 hours (44 in 24).','A clock that gains/loses x minutes per hour: compute the total shift over the elapsed time.'])
    h+=ex('Find the angle between the hands at 4:20.',str(ang(4,20)),'|30×4 − 5.5×20| = |120 − 110| = 10°.')
    h+=ex('At what time between 4 and 5 will the hands be together?',f'4:{(4*60)/ (11/ 2):.4f}'.replace('4:4','4:2') if False else '4:21 9/11 (that is 21.818 min past 4)',f'Hands coincide when 30h = 5.5m, so m = 120/5.5 = {120/5.5:.3f} minutes past 4.')
    h+=ex('Angle between the hands at 9:15 and at 3:40?',f'{ang(9,15)}°; {ang(3,40)}°','9:15: |270 − 82.5| = 187.5 → 360 − 187.5 = 172.5°. 3:40: |90 − 220| = 130°.')
    h+=h3('Cubes')+fig('ar11_cube','Painted-cube counts for a cube of side n.')
    n=4
    h+=ex('A cube of side 4 cm is painted on all faces and cut into 1 cm cubes. How many cubes have (a) 3 faces, (b) 2 faces, (c) 1 face, (d) no face painted?',f'8; {12*(n-2)}; {6*(n-2)**2}; {(n-2)**3}',f'Corners 8; edges 12(4−2) = {12*(n-2)}; face centres 6×2² = {6*(n-2)**2}; inner (4−2)³ = {(n-2)**3}. Total {8+12*(n-2)+6*(n-2)**2+(n-2)**3} = 64 ✓.')
    h+=h3('Dice')
    h+=p('A standard die has opposite faces summing to 7 (1–6, 2–5, 3–4). Two views of the same die show the touching faces; a face not shown in either view is opposite to a shown one.')
    h+=ex('A die shows 1 on top, 2 on the front and 3 on the right. What is on the bottom, the back and the left?','6; 5; 4','Opposite faces sum to 7: bottom 6, back 5, left 4.')
    h+=h3('Counting figures')
    h+=tb(['Figure','Count','Formula'],[['Squares in n × n grid',str(sq_count(4))+' (n=4)','Σk²'],['Rectangles in 4 × 3 grid',str(rect_count(4,3)),'C(5,2)·C(4,2)'],['Triangles, 4-line division',str(tri_count(4)),'n(n+2)(2n+1)/8 (floor)'],['Diagonals of n-gon','n(n−3)/2','—'],['Handshakes among n','n(n−1)/2','—']],'sm')
    h+=tips(['For calendars, count weeks and remainder rather than months.','For clock angles, draw the hands.','Cube questions: use the corner/edge/face breakdown, then verify the total n³.','For overlapping rectangles use the formula C(a+1,2)·C(b+1,2).'])
    h+=warn(['Using 365 days for a leap year.','Forgetting to take the smaller angle at the clock.','Assuming the “opposite faces” sum to 7 on a non-standard die.'])
    items=[('Day of week of 26 January 2027?',datetime.date(2027,1,26).strftime('%A'),'B'),('Angle at 6:00?',str(ang(6,0)),'B'),('How many unit cubes in a cube of side 5?',str(125),'B'),('Angle between the hands at 3:30?',str(ang(3,30)),'M'),('How many leap years between 2000 and 2100 inclusive?',str(sum(1 for y in range(2000,2101) if y%4==0 and (y%100 or y%400==0))),'M'),('A cube of side 6 is painted and cut into unit cubes. How many have exactly one face painted?',str(6*16),'M'),('How many squares are there in a 5 × 5 grid?',str(sq_count(5)),'A'),('How many rectangles in a 5 × 5 grid?',str(rect_count(5,5)),'A'),('How many times do the hands of a clock overlap in 24 hours?','22','A'),('2 September 2027: what day?',datetime.date(2027,9,2).strftime('%A'),'A')]
    h+=pq('11. Calendar, clock, cubes','Practice',items)
    return h+end()
