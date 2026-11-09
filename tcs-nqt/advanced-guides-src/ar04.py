from lib import *
def f_tour():
    f,ax=plt.subplots(figsize=(8,3.6));ax.axis('off');ax.set_xlim(0,10);ax.set_ylim(0,5)
    ys=[4.4,3.4,2.4,1.4];xs=[0.4,2.8,5.2]
    for i,t in enumerate(['A','B','C','D','E','F','G','H']):pass
    pairs=[(0.4,4.0),(0.4,3.2),(0.4,2.4),(0.4,1.6),(0.4,0.8),(0.4,0.0)] if False else []
    names='ABCDEFGH'
    for i,n in enumerate(names):
        y=4.6-i*0.58;ax.add_patch(Rectangle((0.2,y),0.7,0.45,fc='#bfdbfe',ec='#14213d'));ax.text(0.55,y+0.22,n,ha='center',va='center',fontweight='bold')
    r1=[(0,1),(2,3),(4,5),(6,7)]
    for k,(a,b) in enumerate(r1):
        ya=4.6-a*0.58+0.22;yb=4.6-b*0.58+0.22;ym=(ya+yb)/2
        ax.plot([0.9,2.0,2.0],[ya,ya,ym],color='#14213d');ax.plot([0.9,2.0],[yb,yb],color='#14213d');ax.plot([2.0,2.0],[ya,yb],color='#14213d');ax.plot([2.0,3.0],[ym,ym],color='#14213d')
        ax.add_patch(Rectangle((3.0,ym-0.22),0.7,0.44,fc='#fde68a',ec='#14213d'))
    ax.text(5,4.7,'Knockout: 8 teams → 7 matches (n − 1)',fontsize=10.5,fontweight='bold');ax.text(5,4.0,'Rounds = log₂ 8 = 3\nLeague (round robin): n(n−1)/2 = 28\nDouble league: n(n−1) = 56\nTeams in round k from the end: 2^k',fontsize=10,va='top')
    save(f,'ar4_tour')
f_tour()
def html():
    h=top('Tournaments, Ranking and Ordering','ADVANCED REASONING · RANKING · IMPORTANT','#0e7490')
    h+=intro('Ranking questions use positions in a line (rank from top and rank from bottom). Tournament questions use counting formulas. Both are short once you know the three identities below.')
    h+=fig('ar4_tour','Knockout and league counts.')
    h+=form('Ranking identities',['<b>Total = rank from left + rank from right − 1.</b>','<b>People between X and Y</b> (X left of Y) = Y’s position − X’s position − 1.','<b>Swapping positions:</b> if X and Y exchange places, the new rank of X from left = old rank of Y from left.','<b>Position from the other end</b> = Total + 1 − position.','<b>Counting people who are above X</b> = rank of X − 1.'])
    h+=form('Tournament formulas',['<b>Knockout:</b> n teams → n − 1 matches; rounds = ⌈log₂ n⌉; byes if n is not a power of 2.','<b>League (single round robin):</b> n(n−1)/2 matches; each team plays n − 1.','<b>Double round robin:</b> n(n−1).','<b>Groups:</b> g groups of k teams → g·k(k−1)/2 group matches.','<b>Points tables:</b> total points = matches × points per match.'])
    h+=ex('In a row of 40 students, A is 12th from the left and B is 18th from the right. How many students are between them?',str((40+1-18)-12-1),'B’s position from the left = 40 + 1 − 18 = 23. People between = 23 − 12 − 1 = 10.')
    h+=ex('In a class, a student is 12th from the top and 25th from the bottom. How many students are in the class?',str(12+25-1),'Total = 12 + 25 − 1 = 36.')
    h+=ex('Two students swap places: A moves from 9th to 14th from the left and B moves from 14th to 9th. If the class has 30 students, what is the position of A from the right?',str(30+1-14),'A’s new rank from the left is 14. From the right = 30 + 1 − 14 = 17.')
    h+=ex('A knockout tournament has 37 teams. How many matches are played?',str(36),'Each match removes exactly one team, and 36 teams must be removed to leave one champion: 36 matches. (Byes do not count as matches.)')
    h+=ex('In a league with 12 teams, each team plays every other team twice. How many matches?',str(12*11),'Double round robin: n(n−1) = 12 × 11 = 132.')
    h+=ex('In a cricket league each of 9 teams plays 8 matches; a win is 2 points, a tie 1, a loss 0. How many total points in the table?',str(9*8//2*2),'Matches = 9×8/2 = 36; each gives 2 points in total. Total = 72.')
    h+=ex('Among 5 people A–E: A is taller than B, B is taller than C, D is taller than A but shorter than E. Who is the shortest and who is the second tallest?','C; D','Chain: E > D > A > B > C. Shortest is C, second tallest D.')
    # comparison counting
    h+=ex('Six people have different heights. How many pair-wise comparisons are needed in the worst case to find the tallest?',str(5),'Each comparison eliminates one person from the tallest contest: n − 1 = 5.')
    h+=tb(['Pattern','Wording','Formula'],[['Ranks both ends','“12th from top, 25th from bottom”','12 + 25 − 1'],['People between','“how many are between A and B”','|pos₁ − pos₂| − 1'],['Swaps','“if they swap …”','New rank = other’s old rank'],['Knockout','“37 teams, how many matches”','n − 1'],['League','“every team plays every other”','n(n−1)/2'],['Chain order','“A > B, B > C, D < A”','Draw a chain']],'sm')
    h+=tips(['Draw a line and mark known positions; use the numbers, not the words.','If “top 5” and “bottom 6” overlap, total is at most 10.','When a rank is counted from both ends, the formula never changes.'])
    h+=warn(['Forgetting the −1 in the total (the person is counted twice).','Counting a bye as a match.','Mixing left-to-right with right-to-left ranks.'])
    items=[('A is 5th from the left and 9th from the right in a row. How many are in the row?',str(5+9-1),'B'),('A knockout tournament has 64 teams. How many matches?','63','B'),('How many matches in a single league of 10 teams?',str(10*9//2),'B'),('In a row of 35, M is 9th from the left. What is the rank from the right?',str(35+1-9),'M'),('In a row of 45 students, X is 15th from the left and Y is 20th from the right. How many are between them?',str(45+1-20-15-1),'M'),('A tournament has 100 teams (knockout). How many matches?','99','M'),('Four groups of 5 teams each play a league within the group. How many matches?',str(4*5*4//2),'M'),('A class has 50 students. Rahul is 15th from the top and Sumit is 18th from the bottom. How many students are between them?',str(50+1-18-15-1),'A'),('A and B swap places. A was 7th from the left, B was 15th from the left; the row has 30. A’s new rank from the right?',str(30+1-15),'A'),('A league of n teams has 45 matches. Find n.','10','A')]
    h+=pq('4. Ranking and tournaments','Ranking practice',items)
    return h+end()
