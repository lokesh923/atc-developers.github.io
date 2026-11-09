from acl import *
import random,heapq,functools
D_DIJ='''import heapq
def dijkstra(n, edges, src):
    g = [[] for _ in range(n)]
    for u, v, w in edges:
        g[u].append((v, w)); g[v].append((u, w))
    dist = [float("inf")] * n; dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        for v, w in g[u]:
            if d + w < dist[v]:
                dist[v] = d + w; heapq.heappush(pq, (dist[v], v))
    return dist
'''
D_DSU='''def components(n, edges):
    p = list(range(n))
    def find(x):
        while p[x] != x:
            p[x] = p[p[x]]; x = p[x]
        return x
    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru != rv: p[ru] = rv
    return len({find(i) for i in range(n)})
'''
D_TREE='''class Node:
    def __init__(self, v): self.v = v; self.l = self.r = None
def insert(root, v):
    if not root: return Node(v)
    if v < root.v: root.l = insert(root.l, v)
    else: root.r = insert(root.r, v)
    return root
def height(t): return 0 if not t else 1 + max(height(t.l), height(t.r))
def inorder(t): return [] if not t else inorder(t.l) + [t.v] + inorder(t.r)
'''
D_LL='''class N:
    def __init__(self, v, nxt=None): self.v = v; self.next = nxt
def reverse(head):
    prev = None
    while head:
        head.next, prev, head = prev, head, head.next
    return prev
def to_list(h):
    out = []
    while h: out.append(h.v); h = h.next
    return out
'''
def ns(s):
    d={};exec(s,d);return d
DJ=ns(D_DIJ);DS=ns(D_DSU);TR=ns(D_TREE);LL=ns(D_LL)
random.seed(6)
for _ in range(150):
    n=random.randint(2,7);edges=[(random.randrange(n),random.randrange(n),random.randint(1,9)) for _ in range(random.randint(1,10))]
    INF=float('inf');d=[[INF]*n for _ in range(n)]
    for i in range(n):d[i][i]=0
    for u,v,w in edges:d[u][v]=min(d[u][v],w);d[v][u]=min(d[v][u],w)
    for k in range(n):
        for i in range(n):
            for j in range(n):d[i][j]=min(d[i][j],d[i][k]+d[k][j])
    assert DJ['dijkstra'](n,edges,0)==d[0]
    ref=len({tuple(i for i in range(n) if d[i][j]<INF) for j in range(n)})
    assert DS['components'](n,[(u,v) for u,v,w in edges])==ref
    vals=[random.randint(0,20) for _ in range(random.randint(1,9))];root=None
    for v in vals:root=TR['insert'](root,v)
    assert TR['inorder'](root)==sorted(vals)
    head=None
    for v in reversed(vals):head=LL['N'](v,head)
    assert LL['to_list'](LL['reverse'](head))==vals[::-1]
E=[(0,1,4),(0,2,1),(2,1,2),(1,3,1),(2,3,5),(3,4,3)]
def f_graph():
    f,ax=plt.subplots(figsize=(8,3.0));ax.axis('off');ax.set_xlim(0,10);ax.set_ylim(0,3.4)
    P={0:(1,1.7),1:(3.3,2.8),2:(3.3,0.6),3:(5.8,1.7),4:(8.2,1.7)}
    for u,v,w in E:
        ax.plot([P[u][0],P[v][0]],[P[u][1],P[v][1]],color='#14213d');ax.text((P[u][0]+P[v][0])/2,(P[u][1]+P[v][1])/2+0.18,str(w),color='#be123c',fontweight='bold',fontsize=10)
    for k,(x,y) in P.items():
        ax.add_patch(Circle((x,y),0.3,fc='#bfdbfe',ec='#14213d'));ax.text(x,y,str(k),ha='center',va='center',fontweight='bold')
    dist=DJ['dijkstra'](5,E,0)
    ax.text(0.1,3.2,'Dijkstra from 0: '+str(dist),fontsize=10,fontweight='bold',color='#0f7d6b');save(f,'ac10_graph')
f_graph()
def bst(vals):return functools.reduce(TR['insert'],vals,None)
def html():
    h=top('Graphs, Trees, Linked Lists and DSU','ADVANCED CODING · GRAPHS AND TREES · IMPORTANT FOR PRIME','#7c2d92')
    h+=intro('Not every TCS problem is about an array. Some give you cities and roads, a family tree, or a chain of nodes. Four tools cover nearly all of it: <b>adjacency lists with BFS/DFS</b>, <b>Dijkstra</b> for weighted shortest paths, <b>union–find (DSU)</b> for “connected groups”, and <b>recursion on trees</b>.')
    h+=fig('ac10_graph','Weighted graph with shortest distances from node 0.')
    h+=form('Which tool?',['<b>Unweighted shortest path:</b> BFS.','<b>Weighted, no negative edges:</b> Dijkstra with a min-heap, O((V+E) log V).','<b>“How many groups / are X and Y connected?”:</b> DSU (union by merging roots, path compression).','<b>Tree height, size, traversal:</b> recursion. Inorder of a BST is sorted.','<b>Linked list reverse:</b> keep prev, current, next.','<b>Cycle detection (undirected):</b> an edge that joins two nodes already in the same DSU group.'])
    h+=h3('1. Dijkstra')
    h+=cbp('python',D_DIJ+'\nE = [(0,1,4),(0,2,1),(2,1,2),(1,3,1),(2,3,5),(3,4,3)]\nprint(dijkstra(5, E, 0))\n','',str(DJ['dijkstra'](5,E,0)))
    h+=ex('Shortest distances from node 0 in the graph shown.',str(DJ['dijkstra'](5,E,0)),'0→2 costs 1, then 2→1 costs 2 (total 3), 1→3 costs 1 (total 4), 3→4 costs 3 (total 7). The direct edge 0→1 (4) is worse. Compared with Floyd–Warshall on 150 random graphs.')
    h+=h3('2. Connected components (DSU)')
    h+=cbp('python',D_DSU+'\nprint(components(6, [(0,1),(1,2),(3,4)]))\n','',3)
    h+=ex('6 nodes, edges (0,1), (1,2), (3,4). How many groups?',str(DS['components'](6,[(0,1),(1,2),(3,4)])),'{0,1,2}, {3,4}, {5}. Three groups.')
    h+=h3('3. Binary search tree')
    h+=cbp('python',D_TREE+'\nroot = None\nfor v in [8, 3, 10, 1, 6, 14, 4]:\n    root = insert(root, v)\nprint(height(root), inorder(root))\n','',"4 [1, 3, 4, 6, 8, 10, 14]")
    h+=ex('Insert 8, 3, 10, 1, 6, 14, 4 into a BST. Height and inorder?','4; [1, 3, 4, 6, 8, 10, 14]','Longest root-to-leaf path is 8 → 3 → 6 → 4 (4 nodes). Inorder of a BST is always sorted.')
    h+=h3('4. Reverse a linked list')
    h+=cbp('python',D_LL+'\nh = N(1, N(2, N(3, N(4))))\nprint(to_list(reverse(h)))\n','','[4, 3, 2, 1]')
    h+=tb(['Signal','Tool','Cost'],[['“minimum number of roads”','BFS','O(V+E)'],['“cheapest route with costs”','Dijkstra','O((V+E) log V)'],['“how many friend groups”','DSU / DFS','near O(E)'],['“height / depth of a tree”','Recursion','O(n)'],['“reverse / middle of list”','Pointers','O(n)'],['“is there a cycle”','DSU or DFS','O(E)']],'sm')
    h+=tips(['Draw the graph for the sample, then trace your algorithm by hand.','Dijkstra fails with negative edge weights.','Store graphs as adjacency lists, not matrices, unless n ≤ 500.'])
    h+=warn(['Using BFS on weighted edges.','Forgetting nodes with no edges when counting components.','Recursing 10⁵ deep in Python (use iteration or raise the limit).'])
    items=[('Groups for n = 5 with no edges?',str(DS['components'](5,[])),'B'),('Groups for 4 nodes with edges (0,1),(2,3)?',str(DS['components'](4,[(0,1),(2,3)])),'B'),('Dijkstra: distance 0→4 in the graph above?',str(DJ['dijkstra'](5,E,0)[4]),'M'),('BST height after inserting 1,2,3,4,5?',str(TR['height'](bst([1,2,3,4,5]))),'M'),('BST height after inserting 3,1,5,2,4?',str(TR['height'](bst([3,1,5,2,4]))),'M'),('Dijkstra on edges (0,1,10),(0,2,3),(2,1,4): distance 0→1?',str(DJ['dijkstra'](3,[(0,1,10),(0,2,3),(2,1,4)],0)[1]),'A'),('Groups: 6 nodes, edges (0,1),(1,2),(2,0),(3,4)?',str(DS['components'](6,[(0,1),(1,2),(2,0),(3,4)])),'A'),('Reverse of [1,2,3]: first element?',str(LL['to_list'](LL['reverse'](LL['N'](1,LL['N'](2,LL['N'](3)))))[0]),'A')]
    h+=pq('10. Graphs, trees, lists','Practice',items)
    return h+end()
