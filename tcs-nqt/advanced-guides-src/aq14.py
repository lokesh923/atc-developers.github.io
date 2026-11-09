from lib import *
from fractions import Fraction as Fr
import math
def f_shapes():
    f,axs=plt.subplots(1,3,figsize=(8.6,3));
    ax=axs[0];ax.set_aspect('equal');ax.axis('off');ax.add_patch(Polygon([[0,0],[4,0],[1.5,3]],fc='#bfdbfe',ec='#14213d',lw=2));ax.plot([1.5,1.5],[0,3],'--',color='#be123c');ax.text(2,-0.5,'base b',fontsize=9,ha='center');ax.text(1.6,1.4,'h',fontsize=10,color='#be123c');ax.set_title('Triangle: ½·b·h',fontsize=10,fontweight='bold');ax.set_xlim(-0.5,4.5);ax.set_ylim(-1,3.5)
    ax=axs[1];ax.set_aspect('equal');ax.axis('off');ax.add_patch(Circle((0,0),1.5,fc='#bbf7d0',ec='#14213d',lw=2));ax.plot([0,1.5],[0,0],color='#be123c',lw=2);ax.text(0.7,0.15,'r',color='#be123c',fontsize=11);ax.set_title('Circle: πr²,  2πr',fontsize=10,fontweight='bold');ax.set_xlim(-2,2);ax.set_ylim(-2,2)
    ax=axs[2];ax.set_aspect('equal');ax.axis('off');ax.add_patch(Rectangle((0,0),2.2,3,fc='#fde68a',ec='#14213d',lw=2));ax.add_patch(Ellipse((1.1,3),2.2,0.5,fc='#fef3c7',ec='#14213d',lw=1.5));ax.set_title('Cylinder: πr²h, 2πr(r+h)',fontsize=10,fontweight='bold');ax.set_xlim(-0.5,2.7);ax.set_ylim(-0.5,3.6)
    save(f,'aq14_shapes')
f_shapes()
def f_inout():
    f,ax=plt.subplots(figsize=(7,3.2));ax.set_aspect('equal');ax.axis('off')
    ax.add_patch(Rectangle((0,0),4,4,fc='#e5e7eb',ec='#14213d',lw=2));ax.add_patch(Circle((2,2),2,fc='#bfdbfe',ec='#14213d',lw=2));ax.add_patch(Polygon([[2,0],[4,2],[2,4],[0,2]],fc='#fde68a',ec='#14213d',lw=1.5,alpha=.8))
    ax.text(4.3,2,'Square side a:\nincircle r = a/2\nArea circle = πa²/4\nDiagonal = a√2',fontsize=9.5,va='center')
    save(f,'aq14_inout')
f_inout()
def html():
    h=top('Mensuration and Geometry','ADVANCED QUANT · GEOMETRY · MEDIUM PRIORITY','#9a3412')
    h+=intro('Mensuration is a formula-recall topic; geometry questions in NQT are mostly area/perimeter of plane figures, volumes of simple solids, and angle and triangle properties. Memorise the list below and learn the three <b>ratio rules</b>: scale factor k ⇒ lengths ×k, areas ×k², volumes ×k³.')
    h+=fig('aq14_shapes','The three figures that give most questions.')
    h+=form('Plane figures',['Rectangle: area lb, perimeter 2(l+b), diagonal √(l²+b²).','Square: a², 4a, diagonal a√2.','Triangle: ½bh; equilateral (√3/4)a²; Heron √(s(s−a)(s−b)(s−c)); right triangle ½ × legs.','Parallelogram: base × height. Rhombus: ½ d₁ d₂. Trapezium: ½(a+b)h.','Circle: πr², circumference 2πr; sector area (θ/360)πr²; arc (θ/360)2πr.','Regular hexagon: (3√3/2)a².'])
    h+=form('Solids',['Cube: V = a³, TSA 6a², diagonal a√3.','Cuboid: V = lbh, TSA 2(lb+bh+hl), diagonal √(l²+b²+h²).','Cylinder: V = πr²h, CSA 2πrh, TSA 2πr(r+h).','Cone: V = ⅓πr²h, slant l = √(r²+h²), CSA πrl, TSA πr(r+l).','Sphere: V = 4/3 πr³, SA 4πr². Hemisphere: V = 2/3 πr³, TSA 3πr².','Melting and recasting: <b>volume stays the same</b>.'])
    h+=form('Geometry facts',['Triangle angles sum to 180°; exterior angle = sum of the two opposite interior angles.','Polygon with n sides: sum of interior angles = (n−2)×180°; each angle of a regular polygon = (n−2)×180/n.','Pythagorean triples: (3,4,5), (5,12,13), (8,15,17), (7,24,25) and their multiples.','Inscribed angle = half the central angle; angle in a semicircle = 90°.','Similar triangles: sides ∝, areas ∝ square of sides.','Number of diagonals of an n-gon = n(n−3)/2.'])
    h+=fig('aq14_inout','Circle inside a square, square inside a circle.')
    h+=ex('Find the area of a triangle with sides 13, 14, 15.',str(math.sqrt(21*8*7*6)),'s = 21. Area = √(21×8×7×6) = √7056 = 84.')
    h+=ex('A cylinder has radius 7 cm and height 10 cm. Find its volume (π = 22/7).',str(Fr(22,7)*49*10),'V = π r² h = 22/7 × 49 × 10 = 1540 cm³.')
    h+=ex('A metal sphere of radius 6 cm is melted and recast into small cones of radius 3 cm and height 4 cm. How many cones are formed?',str(Fr(4,3)*216/(Fr(1,3)*9*4)),'Volume sphere = 4/3 π 216 = 288π. Cone = ⅓ π 9 × 4 = 12π. Number = 288/12 = 24.')
    h+=ex('The sides of a square are increased by 10%. By what % does the area increase?',str(Fr(121,100)*100-100),'1.1² = 1.21 → 21% increase.')
    h+=ex('Find the number of diagonals of a regular decagon, and the interior angle of a regular octagon.',f'{10*7//2}; {(8-2)*180//8}°','Decagon: 10×7/2 = 35 diagonals. Octagon: 6×180/8 = 135°.')
    h+=ex('Find the length of a diagonal of a cuboid 4 × 3 × 12.',str(int(math.sqrt(16+9+144))),'√(16 + 9 + 144) = √169 = 13.')
    h+=ex('The ratio of the areas of two circles is 4 : 9. Find the ratio of their circumferences.','2 : 3','Area ∝ r², circumference ∝ r. Ratio = √4 : √9 = 2 : 3.')
    h+=ex('A room 8 m × 6 m × 4 m is to be painted on four walls. Find the area (excluding a door of 6 m²).',str(2*(8+6)*4-6),'Walls = 2(l+b)h = 2×14×4 = 112 m². Minus door = 106 m².')
    h+=tb(['Pattern','Wording','Method'],[['Cost of paint / tiles','“area × rate”','Compute the right area first.'],['Melting & recasting','“melted and recast”','Equate volumes.'],['% change in area','“side increased by x%”','(1+x)² − 1.'],['Inscribed figures','“largest circle in square”','r = a/2.'],['Polygons','“interior angle of regular …”','(n−2)180/n.'],['Right triangle','“two sides 5, 12”','Triples.'],['Water in tank','“flows at … into a tank”','Volume = rate × time.']],'sm')
    h+=tips(['Recognise Pythagorean triples instantly.','Ratio rule: area ∝ length², volume ∝ length³.','Use π = 22/7 when the radius is a multiple of 7.','“Largest” figure inside another always touches all the sides.'])
    h+=warn(['Using diameter as radius.','Forgetting to square for area or cube for volume.','Using CSA when TSA is asked (cylinder, cone).','Mixing cm and m.'])
    items=[('Area of a circle with radius 14 cm (π = 22/7)?',str(Fr(22,7)*196),'B'),('Perimeter of a rectangle 12 × 8?',str(2*20),'B'),('Volume of a cube of side 5?',str(125),'B'),('Find the area of a rhombus with diagonals 16 and 12.',str(Fr(16*12,2)),'M'),('Largest circle is cut from a square of side 14 cm. Find its area (π = 22/7).',str(Fr(22,7)*49),'M'),('The radius of a cone is 3 and its height is 4. Find the curved surface area in terms of π.',str(3*5)+'π','M'),('Each interior angle of a regular polygon is 140°. How many sides?',str(360//40),'A'),('A rectangular tank 6 m × 4 m is filled by a pipe of cross-section 0.5 m² at 2 m/s. How long to reach a depth of 3 m?',str(Fr(72,1)),'A'),('The perimeter of a rectangle is 56 and its area is 192. Find its diagonal.',str(int(math.sqrt(12**2+16**2))),'A'),('A wire 88 cm long is bent into a circle then into a square. Find the side of the square.',str(22),'A')]
    # verify: tank volume 72, flow 0.5*2=1 m^3/s -> 72 s
    assert 6*4*3==72 and 0.5*2==1.0
    h+=pq('14. Mensuration and Geometry','Geometry practice',items)
    return h+end()
