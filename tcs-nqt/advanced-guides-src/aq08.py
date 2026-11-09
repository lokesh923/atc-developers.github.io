from lib import *
import itertools
def f_venn():
    f,ax=plt.subplots(figsize=(7.6,4.4));ax.set_aspect('equal');ax.axis('off');ax.set_xlim(-3.6,3.6);ax.set_ylim(-3.3,3.1)
    for (x,y,c) in ((-0.95,0.7,'#fde68a'),(0.95,0.7,'#bfdbfe'),(0,-0.95,'#bbf7d0')):ax.add_patch(Circle((x,y),1.7,fc=c,ec='#14213d',lw=1.6,alpha=.75))
    t=[(-1.95,1.1,'a'),(1.95,1.1,'b'),(0,-2.05,'c'),(0,1.6,'x'),(-1.15,-0.3,'y'),(1.15,-0.3,'z'),(0,0.35,'t')]
    for x,y,s in t:ax.text(x,y,s,ha='center',va='center',fontsize=14,fontweight='bold',color='#be123c')
    ax.text(-2.6,2.5,'A',fontsize=13,fontweight='bold');ax.text(2.6,2.5,'B',fontsize=13,fontweight='bold');ax.text(0.3,-2.95,'C',fontsize=13,fontweight='bold')
    ax.text(-3.4,-2.5,'a, b, c = only one set\nx = A and B only\ny = A and C only\nz = B and C only\nt = all three',fontsize=8.8,va='center',color='#14213d')
    ax.set_title('Three-set Venn diagram: seven regions + outside',fontsize=10.5,fontweight='bold')
    save(f,'aq8_venn')
f_venn()
def html():
    h=top('Set Theory and Venn Diagrams','ADVANCED QUANT · SETS · IMPORTANT','#0f7d6b')
    h+=intro('Set questions give you survey data (how many like tea, coffee, both…) and ask for a region of the Venn diagram. The method is always the same: <b>draw the diagram, fill the innermost region first, then work outwards</b>. Advanced questions add “at least”, “exactly” and “minimum/maximum” overlaps.')
    h+=fig('aq8_venn','Fill t (all three) first, then x, y, z, then the single regions.')
    h+=form('Formulas',['<b>n(A ∪ B) = n(A) + n(B) − n(A ∩ B).</b>','<b>n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A∩B) − n(B∩C) − n(A∩C) + n(A∩B∩C).</b>','Only A = n(A) − n(A∩B) − n(A∩C) + n(A∩B∩C).','<b>Exactly two sets</b> = Σ pairs − 3 × (all three). <b>Exactly one set</b> = Σ singles − 2 × Σ pairs + 3 × (all three).','<b>At least two sets</b> = Σ pairs − 2 × (all three).','<b>Neither</b> = Total − n(A ∪ B ∪ C).','<b>Minimum overlap</b> of A and B in a universe U: max(0, n(A) + n(B) − U). <b>Maximum overlap</b>: min(n(A), n(B)).','For percentages, take the total as 100.'])
    A,B,Cc,AB,BC,AC,ABC=60,50,40,20,15,18,8
    U=A+B+Cc-AB-BC-AC+ABC;onlyA=A-AB-AC+ABC;two=AB+BC+AC-3*ABC;one=A+B+Cc-2*(AB+BC+AC)+3*ABC
    h+=ex(f'In a group, {A} like tea, {B} like coffee and {Cc} like juice. {AB} like tea and coffee, {BC} coffee and juice, {AC} tea and juice, and {ABC} like all three. Find (a) how many like at least one drink, (b) only tea, (c) exactly two drinks, (d) exactly one drink.',f'{U}; {onlyA}; {two}; {one}',f'(a) {A}+{B}+{Cc} − {AB} − {BC} − {AC} + {ABC} = {U}. (b) Only tea = {A} − {AB} − {AC} + {ABC} = {onlyA}. (c) Exactly two = {AB}+{BC}+{AC} − 3×{ABC} = {two}. (d) Exactly one = {A+B+Cc} − 2×{AB+BC+AC} + 3×{ABC} = {one}.')
    h+=ex('In a class of 80 students, 55 like cricket and 45 like football. What is the minimum and the maximum number who like both?',f'{max(0,55+45-80)}; {min(55,45)}','Minimum overlap = 55 + 45 − 80 = 20 (everyone likes at least one). Maximum overlap = the smaller set = 45.')
    h+=ex('In a survey of 200 people, 120 read The Hindu, 90 read the Times and 30 read neither. How many read both?',str(120+90-(200-30)),'Readers of at least one = 200 − 30 = 170. Both = 120 + 90 − 170 = 40.')
    h+=ex('In a town 60% read paper A, 50% read paper B and 40% read paper C. 30% read A and B, 20% read B and C, 25% read A and C, and 10% read all three. What percentage read none?',str(100-(60+50+40-30-20-25+10)),'Union = 60 + 50 + 40 − 30 − 20 − 25 + 10 = 85%. None = 100 − 85 = 15%.')
    h+=h3('Counting numbers divisible by given numbers (a favourite)')
    n3=sum(1 for i in range(1,501) if i%3==0 or i%5==0 or i%7==0)
    h+=ex('How many integers from 1 to 500 are divisible by 3 or 5 or 7?',str(n3),'Use inclusion-exclusion with ⌊500/k⌋: 166 + 100 + 71 − 33 − 23 − 14 + 4 = 271.' if n3==271 else f'Inclusion-exclusion with floors gives {n3}.')
    nc=sum(1 for i in range(1,501) if i%3 and i%5 and i%7)
    h+=ex('How many integers from 1 to 500 are divisible by none of 3, 5 and 7?',str(nc),f'500 − {n3} = {nc}.')
    h+=h3('How these questions appear')+tb(['Pattern','Wording','Method'],[['Survey, 2 sets','“x read A, y read B, z read neither”','Union = total − neither.'],['Survey, 3 sets','Given pairs and all three','Seven-region diagram.'],['Exactly / at least','“Exactly two of the three”','Pair sums − 3 × triple.'],['Min / max overlap','“Minimum number who like both”','Overlap bounds.'],['Divisibility counting','“Numbers up to 1000 divisible by 4 or 6”','Floors and inclusion–exclusion.'],['Percentage sets','“60% like A …”','Use total 100.']],'sm')
    h+=tips(['Always compute the region of all three first.','A missing region = the given total minus all other regions. Check that your seven numbers add to the total.','For “either … or” divisibility count, subtract the multiples of the LCM.'])
    h+=warn(['Subtracting n(A∩B) from n(A) to get “only A” when C also overlaps (you must add back the triple).','Reading “like tea and coffee” as “only tea and coffee”.','Mixing percentages with actual numbers.'])
    h+=pq('8. Sets and Venn','Set theory practice',[('n(A) = 30, n(B) = 25, n(A∩B) = 10. Find n(A∪B).','45','B'),('In a class of 50, 30 take Maths, 25 take Physics and 8 take neither. How many take both?',str(30+25-(50-8)),'B'),('How many integers from 1 to 100 are divisible by 4 or 6?',str(sum(1 for i in range(1,101) if i%4==0 or i%6==0)),'M'),('Of 100 people, 70 like tea and 60 like coffee. Minimum number who like both?','30','M'),('Maximum number who like both, same data?','60','M'),('With A=40, B=35, C=30, AB=12, BC=10, AC=9, ABC=5, find exactly two sets.',str(12+10+9-15),'M'),('Same data: how many like only C?',str(30-10-9+5),'M'),('How many integers from 1 to 1000 are divisible by 2, 3 or 5?',str(sum(1 for i in range(1,1001) if i%2==0 or i%3==0 or i%5==0)),'A'),('How many integers from 1 to 1000 are divisible by none of 2, 3, 5?',str(sum(1 for i in range(1,1001) if i%2 and i%3 and i%5)),'A'),('In a group of 100, 45 know French, 40 know German, 30 know Spanish, 12 French and German, 10 German and Spanish, 8 French and Spanish, 4 all three. How many know none?',str(100-(45+40+30-12-10-8+4)),'A')])
    return h+end()
