from acl import *
import random
D_NGE='''def next_greater(a):
    res = [-1] * len(a)
    st = []                          # indices, values decreasing
    for i, x in enumerate(a):
        while st and a[st[-1]] < x:
            res[st.pop()] = x
        st.append(i)
    return res
'''
D_BAL='''def balanced(s):
    pair = {")": "(", "]": "[", "}": "{"}
    st = []
    for ch in s:
        if ch in "([{":
            st.append(ch)
        elif not st or st.pop() != pair[ch]:
            return False
    return not st
'''
D_RAIN='''def trap(h):
    l, r = 0, len(h) - 1
    lm = rm = water = 0
    while l < r:
        if h[l] < h[r]:
            lm = max(lm, h[l]); water += lm - h[l]; l += 1
        else:
            rm = max(rm, h[r]); water += rm - h[r]; r -= 1
    return water
'''
D_JOS='''from collections import deque
def survivor(n, k):
    q = deque(range(1, n + 1))
    while len(q) > 1:
        q.rotate(-(k - 1))           # skip k-1 people
        q.popleft()                  # k-th person leaves
    return q[0]
'''
CPP_NGE='''#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n; vector<int> a(n), res(n, -1); for (auto &x : a) cin >> x;
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && a[st.top()] < a[i]) { res[st.top()] = a[i]; st.pop(); }
        st.push(i);
    }
    for (int i = 0; i < n; i++) cout << res[i] << (i + 1 < n ? " " : "\\n");
}'''
def ns(s):
    d={};exec(s,d);return d
NG=ns(D_NGE);BA=ns(D_BAL);RN=ns(D_RAIN);JO=ns(D_JOS)
random.seed(8)
for _ in range(200):
    a=[random.randint(1,9) for _ in range(random.randint(1,9))]
    exp=[next((a[j] for j in range(i+1,len(a)) if a[j]>a[i]),-1) for i in range(len(a))]
    assert NG['next_greater'](a)==exp
    h=[random.randint(0,6) for _ in range(random.randint(1,9))]
    assert RN['trap'](h)==sum(max(0,min(max(h[:i+1]),max(h[i:]))-h[i]) for i in range(len(h)))
    s=''.join(random.choice('()[]') for _ in range(random.randint(0,8)))
    def ref(s):
        t=s
        while True:
            u=t.replace('()','').replace('[]','')
            if u==t:return t==''
            t=u
    assert BA['balanced'](s)==ref(s)
def jos_ref(n,k):
    p=list(range(1,n+1));i=0
    while len(p)>1:i=(i+k-1)%len(p);p.pop(i)
    return p[0]
for n in range(1,12):
    for k in range(1,6):assert JO['survivor'](n,k)==jos_ref(n,k)
def f_stack():
    f,ax=plt.subplots(figsize=(8.2,2.7));ax.axis('off');ax.set_xlim(0,12);ax.set_ylim(0,3.2)
    a=[2,1,5,3,6]
    for i,x in enumerate(a):
        ax.add_patch(Rectangle((0.4+i*1.2,0.5),1.0,0.4*x,fc='#bfdbfe',ec='#14213d'));ax.text(0.9+i*1.2,0.5+0.4*x+0.12,str(x),ha='center',fontweight='bold')
    ax.text(7.2,2.7,'Monotonic stack: keep indices with values in decreasing order.',fontsize=9.5,fontweight='bold')
    ax.text(7.2,1.7,'a = [2, 1, 5, 3, 6]\nnext greater = [5, 5, 6, 6, −1]\nEach element is pushed once and popped once → O(n).',fontsize=9.5,va='center',color='#be123c')
    save(f,'ac8_stack')
f_stack()
def html():
    h=top('Stacks, Queues and Monotonic Stacks','ADVANCED CODING · STACK AND QUEUE · IMPORTANT','#6d28d9')
    h+=intro('A <b>stack</b> (last in, first out) remembers the most recent unfinished thing: brackets, nested calls, “next greater element”. A <b>queue</b> (first in, first out) models lines, rotating circles and level-by-level search. Both turn many O(n²) loops into O(n).')
    h+=fig('ac8_stack','A monotonic stack finds the next greater element in one pass.')
    h+=form('Patterns',['<b>Balanced brackets:</b> push openers; on a closer, the top must match.','<b>Next greater / smaller element:</b> stack of indices with monotonic values.','<b>Trapping rain water:</b> water above each bar = min(left max, right max) − height; two pointers do it in O(n).','<b>Circle elimination (Josephus):</b> a queue with rotate.','<b>BFS:</b> queue of states (Chapter 9).','In Python use <code>list</code> for stack and <code>collections.deque</code> for queue (list.pop(0) is O(n)).'])
    h+=h3('1. Next greater element')
    h+=cbp('cpp',CPP_NGE,'5\n2 1 5 3 6','5 5 6 6 -1')
    h+=ex('Next greater element for [4, 5, 2, 25].',str(NG['next_greater']([4,5,2,25])),'Each value looks to the right for the first larger value. The C++ program above printed the same logic for another input; the Python version was checked against brute force on 200 random arrays.')
    h+=h3('2. Balanced brackets with three kinds')
    h+=cbp('python',D_BAL+'\nfor s in ["{[()]}", "{[(])}", "(("]:\n    print(s, balanced(s))\n','',"{[()]} True\n{[(])} False\n(( False")
    h+=h3('3. Trapping rain water')
    h+=cbp('python',D_RAIN+'\nprint(trap([0,1,0,2,1,0,1,3,2,1,2,1]))\n','',6)
    h+=ex('Water trapped by heights 0 1 0 2 1 0 1 3 2 1 2 1.','6','Each bar holds min(left max, right max) − height. Matches a direct formula on 200 random arrays.')
    h+=h3('4. Circle elimination')
    h+=cbp('python',D_JOS+'\nprint(survivor(7, 3))\n','',4)
    h+=ex('7 people stand in a circle and every 3rd person is removed. Who survives?',str(JO['survivor'](7,3)),'Order of removal 3, 6, 2, 7, 5, 1 and person 4 remains. Compared with list simulation for n ≤ 11 and k ≤ 5.')
    h+=tb(['Signal','Structure','Cost'],[['“next greater / smaller”','Monotonic stack','O(n)'],['“valid brackets / nesting”','Stack','O(n)'],['“circle / every k-th person”','Queue with rotate','O(n·k)'],['“water between bars”','Two pointers or stack','O(n)'],['“process in arrival order”','Queue','O(n)']],'sm')
    h+=tips(['Store <b>indices</b> in the stack, not values, when you need distances.','Empty stack: check it before reading the top.','Python lists as queues are slow; use deque.'])
    h+=warn(['Popping from an empty stack.','Not checking that the stack is empty at the end (unmatched openers).','Resetting the monotonic order wrongly (strict vs non-strict).'])
    items=[('Is “([{}])” balanced? (1 = yes, 0 = no)',str(int(BA['balanced']('([{}])'))),'B'),('Is “(]” balanced? (1/0)',str(int(BA['balanced']('(]'))),'B'),('Next greater of [1,3,2,4]: sum of the answers (use −1 for none)?',str(sum(NG['next_greater']([1,3,2,4]))),'M'),('Water trapped by [3,0,2,0,4]?',str(RN['trap']([3,0,2,0,4])),'M'),('Survivor when n = 5, k = 2?',str(JO['survivor'](5,2)),'M'),('Water trapped by [4,2,0,3,2,5]?',str(RN['trap']([4,2,0,3,2,5])),'A'),('Survivor when n = 10, k = 3?',str(JO['survivor'](10,3)),'A'),('Next greater of [9,8,7,6]: how many −1?',str(NG['next_greater']([9,8,7,6]).count(-1)),'A')]
    h+=pq('8. Stack and queue','Practice',items)
    return h+end()
