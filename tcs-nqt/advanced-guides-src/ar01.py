from lib import *
def f_ar1():
    f,ax=plt.subplots(figsize=(8,3.6))
    t=['Puzzles / arrangements','Syllogism and inequality','Data sufficiency','Blood relation / direction','Series / coding','Logic and critical reasoning','Calendar / clock / cubes']
    v=[22,14,12,12,14,14,12]
    ax.barh(t[::-1],v[::-1],color=['#7c3aed','#0f7d6b','#b45309','#be123c','#1f4b9e','#0e7490','#7c3aed'][::-1])
    ax.set_xlabel('Our preparation-time suggestion (%)');ax.set_title('Where to spend your Reasoning preparation time',fontsize=10.5,fontweight='bold')
    for i,x in enumerate(v[::-1]):ax.text(x+0.3,i,f'{x}%',va='center',fontsize=9)
    save(f,'ar1_prio')
f_ar1()
flow('ar1_plan',['Read all\nquestions (2 min)','Quick wins:\nsyllogism, series,\nblood relation','Medium: sets,\ninequality,\nsufficiency','Puzzles last,\nwith a grid','Review\nTITA entries'],'A 3-pass plan for the Advanced Reasoning section')
def html():
    h=top('How the Advanced Reasoning Section Works','ADVANCED REASONING · START HERE','#6d28d9')
    h+=intro('Advanced Reasoning in TCS NQT tests whether you can <b>hold several conditions in your head at once</b> and extract one fixed answer. It is not about speed alone: puzzle-style questions reward a method (a grid, a diagram, a table) rather than guesswork. This guide gives you the method for every question type, with a diagram for each.')
    h+=fig('ar1_prio','Our guidance only. TCS does not publish a weightage.')
    h+=h3('The six habits of a high scorer')
    h+=tips(['<b>Draw, never imagine.</b> Every arrangement question gets a diagram; every “who is related to whom” gets a tree.','<b>Start from the most definite statement</b> (a fixed position, a fixed number, “only one”), not from the first line.','<b>Use the negative clues last.</b> “X is not next to Y” only helps after the positive clues are placed.','<b>Make cases when stuck.</b> Two cases, each short, are faster than one long guess.','<b>Always verify the final arrangement against every statement.</b> This catches the common one-clue misread.','<b>TITA means no options:</b> check the answer against the conditions once more before typing it.'],'Habits')
    h+=fig('ar1_plan','Take the quick questions first; never fight a puzzle in the first minutes.')
    h+=h3('Question types in this guide')
    h+=tb(['Type','What you do','Chapter'],[['Seating (linear and circular)','Place people with conditions','2'],['Multi-attribute puzzles','Floors, days, months, professions in a grid','3'],['Tournament and ranking','Counting matches and positions','4'],['Syllogism (advanced)','Venn diagrams for all/some/no','5'],['Inequalities','Coded symbols and chains','6'],['Data sufficiency','Decide if the data is enough','7'],['Blood relation and direction','Trees and coordinate paths','8'],['Truth / liar and critical reasoning','Test the cases; find the flaw','9'],['Cryptarithm and number puzzles','Digits, columns, grids','10'],['Calendar, clock, cubes, dice','Formulas and counting','11'],['Input–output, coding, series','Find the rule','12'],['Caselets and mini test','Mixed practice','13']],'sm')
    h+=warn(['Reading the conditions once and starting to place people at once.','Skipping the “facing the centre / outside” detail in circular arrangements.','Over-spending time on one puzzle that is worth a single mark.'],'What costs marks')
    h+=pq('1. Strategy','Warm-up',[('If A > B and B > C, who is the smallest?','C','B'),('Which letter comes next: A, C, E, G, ?','I','B'),('Five people sit in a row. How many different orders are possible?',str(math.factorial(5)),'B')])
    return h+end()
