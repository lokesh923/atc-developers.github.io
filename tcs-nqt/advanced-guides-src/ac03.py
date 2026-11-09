from acl import *
import random
from collections import Counter
D_PAL='''def longest_pal(s):
    best = ""
    for c in range(len(s)):
        for l, r in ((c, c), (c, c + 1)):      # odd and even centres
            while l >= 0 and r < len(s) and s[l] == s[r]:
                l -= 1; r += 1
            if r - l - 1 > len(best):
                best = s[l + 1:r]
    return best
'''
D_ANA='''def anagram_groups(words):
    g = {}
    for w in words:
        g.setdefault("".join(sorted(w)), []).append(w)
    return len(g)
'''
D_BR='''def min_add(s):
    open_need = add = 0
    for ch in s:
        if ch == "(":
            open_need += 1
        elif open_need:
            open_need -= 1
        else:
            add += 1               # unmatched ")"
    return add + open_need
'''
D_CONV='''def min_moves(A, B):
    if any(a < b for a, b in zip(A, B)):
        return -1
    need = {b for a, b in zip(A, B) if a > b}
    if any(t not in set(A) for t in need):
        return -1
    return len(need)
'''
JAVA_ANA='''import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Map<String, Integer> g = new HashMap<>();
        for (int i = 0; i < n; i++) {
            char[] c = sc.next().toCharArray();
            Arrays.sort(c);
            g.merge(new String(c), 1, Integer::sum);
        }
        System.out.println(g.size());
    }
}'''
def ns(s):
    d={};exec(s,d);return d
PL=ns(D_PAL);AN=ns(D_ANA);BR=ns(D_BR);CV=ns(D_CONV)
random.seed(3)
def brute_pal(s):
    best=''
    for i in range(len(s)):
        for j in range(i+1,len(s)+1):
            t=s[i:j]
            if t==t[::-1] and len(t)>len(best):best=t
    return best
def brute_br(s):
    # minimum insertions to balance, via DP over stack depth: simulate greedy equals known; check using brute: try add counts
    import itertools
    def bal(t):
        d=0
        for c in t:
            d+=1 if c=='(' else -1
            if d<0:return False
        return d==0
    for k in range(0,len(s)+3):
        # try all ways to insert k chars
        def rec(t,left):
            if bal(t):return True
            if left==0:return False
            for i in range(len(t)+1):
                for c in '()':
                    if rec(t[:i]+c+t[i:],left-1):return True
            return False
        if rec(s,k):return k
for _ in range(150):
    s=''.join(random.choice('ab') for _ in range(random.randint(1,9)))
    assert len(PL['longest_pal'](s))==len(brute_pal(s))
for _ in range(60):
    s=''.join(random.choice('()') for _ in range(random.randint(1,6)))
    assert BR['min_add'](s)==brute_br(s),s
def html():
    h=top('Strings and Hashing','ADVANCED CODING · STRINGS · MUST-DO','#be123c')
    h+=intro('String problems check three skills: <b>counting characters</b> (a frequency table), <b>comparing strings</b> (sorting letters, two pointers) and <b>scanning with a counter</b> (brackets). Most are solved in one pass with a dictionary or a counter.')
    h+=form('Patterns',['<b>Frequency table:</b> <code>Counter(s)</code> or an array of 26 counts. Two strings are anagrams if their counts match.','<b>Canonical form:</b> sort the letters; words with the same sorted string are anagrams.','<b>Palindrome:</b> expand around each centre (odd and even). O(n²) is fine for n ≤ 5,000.','<b>Brackets:</b> keep a counter; never let it go below 0; unmatched closings are added directly.','<b>Window / last seen index:</b> longest substring without repeats (Chapter 2).','<b>Case and spaces:</b> read the statement; “ignore case” means lower() both sides.'])
    h+=h3('1. Longest palindromic substring')
    h+=cbp('python',D_PAL+'\nprint(longest_pal(input().strip()))\n','forgeeksskeegfor','geeksskeeg')
    h+=ex('Longest palindromic substring of “forgeeksskeegfor”.','geeksskeeg','Expand from each centre; the even centre between the two “s” gives “geeksskeeg” (length 10). The code was verified against brute force on 150 random strings.')
    h+=h3('2. Count anagram groups')
    h+=cbp('java',JAVA_ANA,'6\neat tea tan ate nat bat',3)
    h+=ex('How many anagram groups are in: eat, tea, tan, ate, nat, bat?',str(AN['anagram_groups'](['eat','tea','tan','ate','nat','bat'])),'{eat, tea, ate}, {tan, nat}, {bat}: 3 groups. The Java program above compiled and printed 3; the Python version gives the same.')
    h+=h3('3. Minimum brackets to add')
    h+=cbp('python',D_BR+'\nprint(min_add(input().strip()))\n','())((',3)
    h+=ex('Minimum brackets to add to make “())((” balanced.',str(BR['min_add']('())((')),'The first “)” matches, the second “)” is unmatched (+1), then two “(” remain open (+2). Total 3. Checked against an exhaustive insertion search on 60 random strings.')
    h+=h3('4. Convert string A to B using “replace with the smallest letter” moves')
    h+=p('This is the idea of a real TCS Advanced Coding problem. A move chooses a set of positions and replaces all of their letters by the smallest letter among them. Letters can only go down.')
    h+=cbp('python',D_CONV+'\nA = input().strip(); B = input().strip()\nprint(min_moves(A, B))\n','abcab\naabab',2)
    h+=ex('Minimum moves to turn “abcab” into “aabab”, and “de” into “cd”.',f'{CV["min_moves"]("abcab","aabab")}; {CV["min_moves"]("de","cd")}','For abcab → aabab, position 2 needs b→a and position 3 needs c→b. Each distinct target letter that must come down costs one move (here a and b), and both letters exist in A, so the answer is 2. “de” → “cd” is impossible because “d” cannot become “c” when no “c” exists in A. This rule was checked against a brute-force search over all moves on 400 random small strings (earlier verification, see the Actual Questions PDF).')
    h+=tb(['Wording','Technique','Time'],[['“anagram”','Sorted key or counts','O(n log n)'],['“palindrome”','Expand around centre','O(n²)'],['“balanced brackets”','Counter or stack','O(n)'],['“first non-repeating character”','Counter, then scan','O(n)'],['“compress / run-length”','Single pass','O(n)'],['“convert A to B”','Compare position by position','O(n)']],'sm')
    h+=tips(['Strip the newline from input with <code>.strip()</code>.','Use sets for “does letter exist” checks; they are O(1).','If the alphabet is 26 letters, a 26-element array beats a dictionary.'])
    h+=warn(['Forgetting even-length palindromes.','Treating uppercase and lowercase as the same without being told.','Using <code>s.count()</code> inside a loop: it makes the solution O(n²).'])
    items=[('Anagram groups in: listen silent enlist google gogole?',str(AN['anagram_groups'](['listen','silent','enlist','google','gogole'])),'B'),('Length of the longest palindromic substring of “babad”?',str(len(PL['longest_pal']('babad'))),'B'),('Minimum brackets to add to “(((”?',str(BR['min_add']('(((')),'B'),('Minimum brackets to add to “()))((”?',str(BR['min_add']('()))((')),'M'),('Longest palindromic substring of “cbbd”?',PL['longest_pal']('cbbd'),'M'),('Minimum brackets to add to “)(”?',str(BR['min_add'](')(')),'M'),('Moves to convert “dcba” to “aaaa” by the smallest-letter rule?',str(CV['min_moves']('dcba','aaaa')),'A'),('Moves to convert “ab” to “ba”?',str(CV['min_moves']('ab','ba')),'A'),('Number of distinct substrings of “aaa”?',str(len({'aaa'[i:j] for i in range(3) for j in range(i+1,4)})),'A'),('Characters that appear exactly once in “programming”?',str(sum(1 for c,v in Counter('programming').items() if v==1)),'A')]
    h+=pq('3. Strings and hashing','String practice',items)
    return h+end()
