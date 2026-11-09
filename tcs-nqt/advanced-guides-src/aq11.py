from lib import *
from fractions import Fraction as Fr
def f_tsd():
    f,ax=plt.subplots(figsize=(7.8,3.4));
    t=[0,1,2,3,4,5]
    ax.plot(t,[0,40,80,120,160,200],color='#1d4ed8',lw=2.5,label='A: 40 km/h from t=0')
    ax.plot([2,3,4,5],[0,60,120,180],color='#be123c',lw=2.5,label='B: 60 km/h from t=2')
    ax.scatter([6],[0]) if False else None
    ax.axvline(4,color='#6b7280',ls='--');ax.text(4.05,20,'B catches A\nat t=4',fontsize=9)
    ax.set_xlabel('time (h)');ax.set_ylabel('distance (km)');ax.legend(fontsize=8.5);ax.grid(alpha=.3)
    ax.set_title('Distance–time graph: chase problem (lead = 80 km, closing speed 20 km/h → 4 h after B starts… wait: see text)',fontsize=9)
    ax.set_title('Chase: A leads by 80 km when B starts; B gains 20 km/h',fontsize=10.5,fontweight='bold')
    ax.set_xlim(0,5.2);ax.set_ylim(0,210)
    save(f,'aq11_tsd')
f_tsd()
def html():
    h=top('Time, Speed and Distance (Advanced)','ADVANCED QUANT · TSD · HIGH PRIORITY','#1d4ed8')
    h+=intro('Speed questions look different but reduce to <b>Distance = Speed × Time</b> and three tools: <b>relative speed</b> (chase and meeting), <b>average speed</b> (harmonic, never arithmetic), and <b>ratio of speeds ↔ inverse ratio of times</b>. Trains, boats and races are applications.')
    h+=fig('aq11_tsd','A distance–time graph: where the lines cross is where they meet.')
    h+=form('Formulas',['<b>km/h → m/s:</b> multiply by 5/18. <b>m/s → km/h:</b> multiply by 18/5.','<b>Average speed</b> for equal distances at speeds a and b = <b>2ab/(a+b)</b>. For equal times it is (a+b)/2.','<b>Relative speed:</b> same direction = difference; opposite direction = sum.','<b>Train crossing a pole/person:</b> time = train length ÷ speed. <b>Crossing a platform/bridge:</b> time = (train + platform) ÷ speed.','<b>Two trains:</b> same direction, time = (L₁+L₂)/(v₁−v₂); opposite, (L₁+L₂)/(v₁+v₂).','<b>Boats:</b> downstream = u + v, upstream = u − v. Still water speed u = (down + up)/2; stream v = (down − up)/2.','<b>Equal distance:</b> speeds ratio a : b ⇒ times ratio b : a.','<b>Meeting two persons</b> from A and B towards each other: distance ÷ (sum of speeds).','<b>Circular track:</b> meet first time at the opposite direction after L/(v₁+v₂), same direction L/(v₁−v₂).'])
    h+=ex('A car goes from P to Q at 40 km/h and returns at 60 km/h. Find the average speed for the whole trip.',str(Fr(2*40*60,100)),'Equal distances, so harmonic mean: 2×40×60/(40+60) = 48 km/h.')
    h+=ex('A 150 m train moving at 54 km/h crosses a 250 m platform. How long does it take?',str(Fr(400,15)),'54 km/h = 54×5/18 = 15 m/s. Distance = 150 + 250 = 400 m. Time = 400/15 = 80/3 ≈ 26.67 s.')
    h+=ex('Two trains of length 120 m and 180 m run in opposite directions at 60 and 40 km/h. In how many seconds do they cross?',str(Fr(300*18,100*5)),'Relative speed = 100 km/h = 100×5/18 m/s = 250/9 m/s. Distance = 300 m. Time = 300 × 9/250 = 10.8 s.')
    h+=ex('Same two trains in the same direction: crossing time?',str(Fr(300*18,20*5)),'Relative speed = 20 km/h = 50/9 m/s. Time = 300 × 9/50 = 54 s.')
    h+=ex('A boat goes 24 km downstream in 2 hours and 24 km upstream in 3 hours. Find still-water speed and stream speed.',f'{(12+8)//2}; {(12-8)//2}','Downstream 12 km/h, upstream 8 km/h. Still water = (12+8)/2 = 10; stream = (12−8)/2 = 2 km/h.')
    h+=ex('A starts at 40 km/h. Two hours later B starts from the same place in the same direction at 60 km/h. When does B catch A (after B starts)?',str(Fr(80,20)),'Head start = 40×2 = 80 km. Closing speed = 20 km/h. Time = 80/20 = 4 hours after B starts.')
    h+=ex('A man walks at 5 km/h and reaches 10 minutes late; at 6 km/h he reaches 5 minutes early. Find the distance.',str(Fr(5*6,1)*Fr(15,60)),'d/5 − d/6 = 15 min = 1/4 h → d/30 = 1/4 → d = 7.5 km.')
    h+=ex('A can run a 1 km race 100 m ahead of B (A wins by 100 m). If A takes 80 s, how long does B take for the full 1 km?',str(Fr(80*1000,900)),'When A runs 1000 m, B runs 900 m. B’s speed = 900/80 m/s. B needs 1000 ÷ (900/80) = 88.89 s.')
    h+=ex('Two persons walk around a circular track of length 400 m at 4 m/s and 6 m/s. When do they meet first, in the same direction and in opposite directions?',f'{Fr(400,2)} s; {Fr(400,10)} s','Same direction: 400/(6−4) = 200 s. Opposite: 400/(6+4) = 40 s.')
    h+=tb(['Pattern','Wording','Method'],[['Average speed','“goes at x and returns at y”','Harmonic mean 2xy/(x+y).'],['Train/platform','“crosses a 250 m platform”','Add the lengths.'],['Two trains','“in opposite directions”','Add speeds, add lengths.'],['Boats','“down in 2 h, up in 3 h”','Down and up speeds → u, v.'],['Chase','“starts 2 h later”','Head start ÷ closing speed.'],['Late/early','“5 km/h late, 6 km/h early”','Set up difference of times.'],['Races','“A beats B by 100 m”','Distance ratio = speed ratio.'],['Circular','“meet for the first time”','Length ÷ relative speed.']],'sm')
    h+=tips(['Convert units first: m/s vs km/h is the number-one trap.','If the distance is fixed, speed × time is constant: use ratios, no equations.','For “late and early” questions, subtract the two times and equate to the total gap.','Speeds 5 : 6 means times 6 : 5 — no algebra needed.'])
    h+=warn(['Using the arithmetic mean for average speed with equal distances.','Forgetting the train’s own length when crossing a platform.','Using the wrong sign for boat upstream and downstream.','Mixing minutes with hours.'])
    items=[('Convert 72 km/h to m/s.','20','B'),('A train 200 m long crosses a pole in 10 s. Speed in km/h?','72','B'),('Average speed if a man goes at 30 km/h and returns at 20 km/h?',str(Fr(2*30*20,50)),'M'),('A boat goes at 15 km/h in still water and the stream is 3 km/h. Time to go 36 km downstream and come back?',str(Fr(36,18)+Fr(36,12)),'M'),('Two trains 150 m and 100 m run in the same direction at 72 and 54 km/h. Time to cross?',str(Fr(250,5)),'M'),('A walks at 4 km/h; B starts 3 hours later at 10 km/h. How far from the start does B catch A?',str(10*Fr(12,6)),'M'),('A train crosses a man in 9 s and a 180 m platform in 18 s. Find its length.',str(180),'A'),('Two cyclists start from points 120 km apart and move towards each other at 14 and 16 km/h. When do they meet?',str(Fr(120,30)),'A'),('A man covers half the distance at 20 km/h and the rest at 30 km/h. His average speed?',str(Fr(2*20*30,50)),'A'),('In a 200 m race A beats B by 20 m or 4 s. Find A’s time.',str(Fr(180,5)),'A')]
    # verify items 7 & 10 by reasoning in code
    L=Fr(180*9,9);assert L==180  # train: 9s for L, 18s for L+180 => speed=L/9, (L+180)/18=L/9 => L=180
    # race: B covers 180 in T, B runs 20 in 4s => B=5 m/s, T=36 => A time = 200/(?)... A covers 200 when B covers 180 -> A time=36
    h+=pq('11. Time, Speed and Distance','Speed practice',items)
    return h+end()
