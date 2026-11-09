from lib import *
def f_time():
    f,ax=plt.subplots(figsize=(9.2,2.8));ax.axis('off');ax.set_xlim(0,25);ax.set_ylim(0,4.4)
    segs=[(0,3,'Pass 1\nquick wins','#dcfce7'),(3,14,'Pass 2: medium questions (about 100 s each)','#fde68a'),(17,5,'Pass 3: hard\nones','#fecaca'),(22,3,'Check','#dbeafe')]
    segs=[(0,6,'PASS 1  (6 min)\nTake every question you can do in under 60 s','#dcfce7'),(6,13,'PASS 2  (13 min)\nMedium questions, 2 min each, TITA carefully','#fde68a'),(19,4,'PASS 3 (4 min)\nOne hard question','#fecaca'),(23,2,'CHECK','#dbeafe')]
    for s,w,t,c in segs:
        ax.add_patch(Rectangle((s,1.4),w,1.4,fc=c,ec='#14213d',lw=1.4));ax.text(s+w/2,2.1,t,ha='center',va='center',fontsize=8.2,fontweight='bold')
    for t in (0,6,19,23,25):ax.text(t,1.0,f'{t} min',ha='center',fontsize=8.5,color='#444')
    ax.text(12.5,3.7,'25 minutes · 14 questions: a three-pass plan',ha='center',fontsize=11.5,fontweight='bold')
    ax.text(12.5,0.35,'107 seconds per question on average. Never spend more than 2.5 minutes on one question in Pass 1 or 2.',ha='center',fontsize=9.2,color='#be123c',fontweight='bold')
    save(f,'aq1_time')
def f_topics():
    ts=[('Probability',9),('Permutation and Combination',9),('Number Theory',9),('Algebra / Quadratics',8),('Data Interpretation',8),('Mensuration',7),('Set Theory / Venn',7),('Time, Speed, Work',7),('Interest / Mixtures / Partnership',6),('Sequences, Logs, Surds',6)]
    f,ax=plt.subplots(figsize=(9.2,3.6));y=range(len(ts))[::-1]
    ax.barh(list(y),[v for _,v in ts],color=['#be123c' if v>=9 else '#b45309' if v>=7 else '#2f66b3' for _,v in ts])
    ax.set_yticks(list(y));ax.set_yticklabels([t for t,_ in ts],fontsize=9.2);ax.set_xlim(0,10.5);ax.set_xlabel('Our preparation priority (10 = highest)',fontsize=9)
    for yy,(t,v) in zip(y,ts):ax.text(v+0.12,yy,str(v),va='center',fontsize=9,fontweight='bold')
    ax.spines[['top','right']].set_visible(False);ax.set_title('Where to spend your practice time (guidance, not official weightage)',fontsize=10.5,fontweight='bold')
    save(f,'aq1_topics')
f_time();f_topics();flow('aq1_flow',['1. Read the last line first (what is asked)','2. Pick the chapter and formula','3. Set up with easy numbers','4. Compute and sanity-check'],None)
def html():
    h=top('How the Advanced Quant Section Works','ADVANCED QUANT · START HERE','#1f4b9e')
    h+=intro('The Advanced section of the NQT is for candidates aiming at the higher TCS profiles (Digital and Prime). In the Advanced Quantitative and Reasoning block you get <b>14 questions in 25 minutes</b>. The quantitative questions are harder than the Foundation Numerical section: longer wording, two or three steps, and many <b>typed-answer (TITA)</b> questions where there are no options to fall back on. This guide covers the quantitative side from zero to a high level; the companion Advanced Reasoning guide covers the logic side.')
    h+=fig('aq1_time','A three-pass plan for 14 questions in 25 minutes.')
    h+=tb(['Feature','What to expect'],[['Questions and time','14 questions, 25 minutes, so about 107 seconds each.'],['Question types','MCQ with 4 options, and typed numerical answers (TITA).'],['Marking','1 mark each. No negative marking has been reported for this pattern, so attempt everything.'],['Style','Word problems with two or three layers, data tables, probability and counting, number theory with a twist, equations and mixed reasoning puzzles.'],['What is rewarded','Choosing the right method in the first 15 seconds, then clean and accurate arithmetic.']],'sm')
    h+=fig('aq1_topics','Priority order for preparation. Probability, counting and number theory give the most reliable marks.')
    h+=form('The five habits of high scorers',['<b>Classify first.</b> Spend 10 seconds deciding: which chapter, which formula, which shortcut.','<b>Convert to easy numbers.</b> Replace percentages by fractions (12.5% = 1/8), use LCM for work problems, use ratios instead of actual values.','<b>Estimate before you calculate.</b> If options differ by a lot, rough arithmetic is enough.','<b>For TITA, double-check the unit and the form</b> (integer, decimal, fraction) because there is no option to confirm against.','<b>Skip without guilt.</b> A question that is not moving in 2 minutes should be marked and left.'])
    h+=h3('How a question is solved: the 4 steps')+fig('aq1_flow','Read the question twice only if it is a word problem with many conditions.')
    # example computed
    n=2*3*5*7;e1=sum(1 for i in range(1,n+1) if n%i==0)
    h+=ex(f'How many positive factors does {n} have?',str(e1),f'{n} = 2 × 3 × 5 × 7, so the number of factors = (1+1)(1+1)(1+1)(1+1) = {e1}. This is a Number Theory 15-second question: classify, apply the formula, done.')
    h+=ex('A shopkeeper marks an article 25% above cost and gives a 20% discount. What is his profit percent?','0%',f'Cost = 100, marked = 125, selling = 125 × 0.8 = 100. Profit = 0%. Using multipliers: 1.25 × 0.8 = 1.')
    h+=tips(['Do the chapter you love first in Pass 1; confidence saves time later.','Keep the last 2 minutes only for re-checking TITA answers.','Write the key number on the sheet; do not hold it in your head.','Learn the tables in the last chapter (squares to 30, cubes to 15, fractions to percent) before anything else.'])
    h+=warn(['Starting the very first question with a long calculation without checking its type.','Leaving a TITA blank: there is no negative marking, so write your best answer.','Spending 4 minutes on a 3-mark-worth puzzle while easy questions stay untouched.'])
    h+=pq('1. How the section works','Warm-up (time yourself: 90 seconds each)',[('How many positive factors does 360 have?',str(sum(1 for i in range(1,361) if 360%i==0)),'B'),('A number is increased by 20% and then decreased by 20%. Net change in percent (negative = decrease)?','-4','B'),('What is 12.5% of 640?','80','B'),('If the ratio of A to B is 3:5 and A = 27, what is B?','45','B'),('The average of 5 numbers is 24. If one number 30 is removed, the average of the remaining numbers is?','22.5','M'),('How many numbers from 1 to 100 are divisible by 3 or 5?',str(sum(1 for i in range(1,101) if i%3==0 or i%5==0)),'M')])
    return h+end()
