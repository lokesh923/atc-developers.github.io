from lib import *
AL='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
def shift(w,k):return ''.join(AL[(AL.index(c)+k)%26] for c in w)
def opp(w):return ''.join(AL[25-AL.index(c)] for c in w)
def val(w):return sum(AL.index(c)+1 for c in w)
def machine(words,nums):
    # rule: each step puts the smallest number then the alphabetically first word, alternating at the front
    w=sorted(words);n=sorted(nums);steps=[];cur=list(words)+list(nums)
    return steps
def io_steps(items):
    # Step i: bring the i-th element of the target order to the front (target = numbers ascending then words alphabetical)
    nums=sorted([x for x in items if x.isdigit()],key=int);wds=sorted([x for x in items if not x.isdigit()])
    cur=list(items);order=[];steps=[cur[:]]
    tgt=[]
    for i in range(max(len(nums),len(wds))):
        if i<len(nums):tgt.append(nums[i])
        if i<len(wds):tgt.append(wds[i])
    for t in tgt[:3]:
        cur.remove(t);cur.insert(0,t);steps.append(cur[:])
    return steps
tablefig('ar12_series',['Type','Example','Next'],[['Arithmetic','4, 7, 10, 13','16'],['Geometric','3, 6, 12, 24','48'],['Squares / cubes','1, 8, 27, 64','125'],['Difference of differences','2, 3, 6, 11, 18','27'],['Alternating','2, 5, 4, 7, 6','9'],['Fibonacci type','1, 1, 2, 3, 5','8'],['n² ± n','2, 6, 12, 20','30'],['Primes','2, 3, 5, 7','11']],[2.2,3.2,1.2],title='Series types to recognise')
def nxt(seq):
    d1=[b-a for a,b in zip(seq,seq[1:])];d2=[b-a for a,b in zip(d1,d1[1:])]
    if len(set(d1))==1:return seq[-1]+d1[0],'arithmetic'
    if len(set(d2))==1:return seq[-1]+d1[-1]+d2[0],'second difference constant'
    r=[b/a for a,b in zip(seq,seq[1:])]
    if len(set(r))==1:return int(seq[-1]*r[0]),'geometric'
    return None,'other'
def html():
    h=top('Input–Output, Coding–Decoding and Series','ADVANCED REASONING · PATTERNS · MUST-DO','#b45309')
    h+=intro('Pattern questions reward a short checklist: for numbers check <b>difference, ratio, squares, cubes, primes</b>; for letters check <b>shift, reverse alphabet position, sum of values</b>; for input–output machines find the <b>rule of one step</b>, then apply it again.')
    h+=fig('ar12_series','Recognise these eight patterns and most series are solved in seconds.')
    h+=form('Coding rules',['<b>Letter value:</b> A=1 … Z=26. Opposite letter: A↔Z, B↔Y (sum 27).','<b>Shift coding:</b> every letter moves +k. CAT → +1 → DBU.','<b>Reverse coding:</b> write the word backward.','<b>Number coding:</b> letters replaced by position values; compare words to find the value of each letter.','<b>Condition coding:</b> a rule depends on whether a letter is a vowel / consonant.'])
    h+=ex('If TCS is coded as UDT (+1 shift), how is NQT coded?',shift('NQT',1),'Every letter moves forward by 1: N→O, Q→R, T→U.')
    h+=ex('If the opposite-letter code is used (A↔Z, B↔Y …), how is CODE written?',opp('CODE'),'C↔X, O↔L, D↔W, E↔V.')
    h+=ex('If A = 1 … Z = 26, what is the value of the word TCS?',str(val('TCS')),'T = 20, C = 3, S = 19. Sum = 42.')
    h+=ex('In a code, GOD is 26 and DOG is also 26. What is the code for BAD if the code is the sum of letter positions?',str(val('BAD')),'B = 2, A = 1, D = 4 → 7.')
    h+=h3('Series')
    sq=[[4,7,10,13],[2,3,6,11,18],[3,6,12,24],[1,4,9,16]]
    for s in sq[:3]:
        n,k=nxt(s);h+=ex(f'Next term of {", ".join(map(str,s))}, ?',str(n),f'Pattern: {k}.')
    h+=ex('Next term: 1, 4, 9, 16, 25, ?',str(36),'Squares of 1, 2, 3, 4, 5, 6.')
    h+=ex('Next term: 2, 6, 12, 20, 30, ?',str(42),'n(n+1): the 6th term is 6 × 7.')
    h+=ex('Next letters: A, C, F, J, ?',AL[AL.index('J')+5],'Gaps increase: +2, +3, +4, +5. J + 5 = O.')
    h+=h3('Input–output machines')
    items=['58','pen','12','zoo','bat','37']
    st=io_steps(items)
    h+=p('A machine rearranges a list step by step. Rule: in step 1 the <b>smallest number</b> is moved to the front; in step 2 the <b>alphabetically first word</b> is moved to the front; step 3 moves the next smallest number, and so on.')
    h+=tb(['Step','Arrangement'],[['Input',' · '.join(st[0])]]+[[f'Step {i}',' · '.join(s)] for i,s in enumerate(st[1:],1)],'sm')
    h+=ex('What is the arrangement after step 3 of the machine above?',' · '.join(st[3]),'Step 1 moves 12 to the front, step 2 moves “bat”, step 3 moves 37. Each step is applied to the previous result.')
    h+=tb(['Type','Rule','First check'],[['Number series','Difference','d₁, d₂, ratio'],['Letter series','Position gaps','A=1 … Z=26'],['Coding','Shift / reverse / value','Compare two words'],['I/O machine','Simple sort rule','Do steps 1 and 2 to see the pattern'],['Odd one out','Common property','Parity, prime, square']],'sm')
    h+=tips(['For a long series, split the odd and even positions into two sequences.','For letter series, convert to numbers.','In input–output, never guess the rule from one step: use two.'])
    h+=warn(['Skipping the letter value check (J + 5 = O, not P).','Using a pattern that fits only the first three terms.','Applying the rule from the original input instead of the last step.'])
    items2=[('Next: 5, 10, 15, 20, ?','25','B'),('TCS shifted by +2: ?',shift('TCS',2),'B'),('Value of NQT (A=1) :',str(val('NQT')),'B'),('Next: 3, 9, 27, 81, ?','243','M'),('Next: 1, 2, 4, 7, 11, ?','16','M'),('Opposite-letter code of ATC?',opp('ATC'),'M'),('Next: 2, 3, 5, 7, 11, 13, ?','17','A'),('Next: 1, 1, 2, 3, 5, 8, 13, ?','21','A'),('Next: 2, 5, 4, 7, 6, ?','9','A'),('Next letter: B, D, G, K, ?',AL[AL.index('K')+5],'A')]
    h+=pq('12. Input–output, coding, series','Pattern practice',items2)
    return h+end()
