from acl import *
import random
D_ISL='''def islands(g):
    R, C = len(g), len(g[0]); seen = set(); count = 0
    for r in range(R):
        for c in range(C):
            if g[r][c] == "1" and (r, c) not in seen:
                count += 1
                stack = [(r, c)]; seen.add((r, c))
                while stack:
                    x, y = stack.pop()
                    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < R and 0 <= ny < C and g[nx][ny] == "1" and (nx, ny) not in seen:
                            seen.add((nx, ny)); stack.append((nx, ny))
    return count
'''
D_BFS='''from collections import deque
def shortest(g):
    R, C = len(g), len(g[0])
    dist = [[-1] * C for _ in range(R)]
    dist[0][0] = 0; q = deque([(0, 0)])
    while q:
        x, y = q.popleft()
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < R and 0 <= ny < C and g[nx][ny] == "." and dist[nx][ny] < 0:
                dist[nx][ny] = dist[x][y] + 1; q.append((nx, ny))
    return dist[R-1][C-1]
'''
D_SPI='''def spiral(m):
    out = []
    top, bot, left, right = 0, len(m) - 1, 0, len(m[0]) - 1
    while top <= bot and left <= right:
        out += [m[top][c] for c in range(left, right + 1)]
        out += [m[r][right] for r in range(top + 1, bot + 1)]
        if top < bot and left < right:
            out += [m[bot][c] for c in range(right - 1, left - 1, -1)]
            out += [m[r][left] for r in range(bot - 1, top, -1)]
        top += 1; bot -= 1; left += 1; right -= 1
    return out
'''
D_ROT='''def rotate(m):
    return [list(row) for row in zip(*m[::-1])]
'''
JAVA_BFS='''import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int R = sc.nextInt(), C = sc.nextInt();
        String[] g = new String[R];
        for (int i = 0; i < R; i++) g[i] = sc.next();
        int[][] d = new int[R][C];
        for (int[] row : d) Arrays.fill(row, -1);
        ArrayDeque<int[]> q = new ArrayDeque<>();
        d[0][0] = 0; q.add(new int[]{0, 0});
        int[] dx = {1, -1, 0, 0}, dy = {0, 0, 1, -1};
        while (!q.isEmpty()) {
            int[] p = q.poll();
            for (int k = 0; k < 4; k++) {
                int nx = p[0] + dx[k], ny = p[1] + dy[k];
                if (nx >= 0 && nx < R && ny >= 0 && ny < C && g[nx].charAt(ny) == '.' && d[nx][ny] < 0) {
                    d[nx][ny] = d[p[0]][p[1]] + 1; q.add(new int[]{nx, ny});
                }
            }
        }
        System.out.println(d[R-1][C-1]);
    }
}'''
def ns(s):
    d={};exec(s,d);return d
IS=ns(D_ISL);BF=ns(D_BFS);SP=ns(D_SPI);RO=ns(D_ROT)
# brute-force checks
random.seed(4)
def isl_ref(g):
    R,C=len(g),len(g[0]);par={}
    def f(x):
        while par[x]!=x:par[x]=par[par[x]];x=par[x]
        return x
    for r in range(R):
        for c in range(C):
            if g[r][c]=='1':par[(r,c)]=(r,c)
    for (r,c) in list(par):
        for dr,dc in((1,0),(0,1)):
            if (r+dr,c+dc) in par:par[f((r,c))]=f((r+dr,c+dc))
    return len({f(x) for x in par})
def bfs_ref(g):
    R,C=len(g),len(g[0]);best=[None]
    def rec(x,y,seen,d):
        if (x,y)==(R-1,C-1):
            if best[0] is None or d<best[0]:best[0]=d
            return
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            nx,ny=x+dx,y+dy
            if 0<=nx<R and 0<=ny<C and g[nx][ny]=='.' and (nx,ny) not in seen:rec(nx,ny,seen|{(nx,ny)},d+1)
    if g[0][0]=='.':rec(0,0,{(0,0)},0)
    return -1 if best[0] is None else best[0]
for _ in range(120):
    R,C=random.randint(1,4),random.randint(1,4)
    g=[''.join(random.choice('01') for _ in range(C)) for _ in range(R)]
    assert IS['islands'](g)==isl_ref(g)
    m=[''.join(random.choice('..#') for _ in range(C)) for _ in range(R)]
    m[0]='.'+m[0][1:];m[-1]=m[-1][:-1]+'.'
    assert BF['shortest'](m)==bfs_ref(m)
def f_bfs():
    g=['..#.','.##.','....','#.#.'];f,ax=plt.subplots(figsize=(6.4,3.0));ax.set_aspect('equal');ax.axis('off')
    d={};from collections import deque
    d[(0,0)]=0;q=deque([(0,0)])
    while q:
        x,y=q.popleft()
        for dx,dy in((1,0),(-1,0),(0,1),(0,-1)):
            nx,ny=x+dx,y+dy
            if 0<=nx<4 and 0<=ny<4 and g[nx][ny]=='.' and (nx,ny) not in d:d[(nx,ny)]=d[(x,y)]+1;q.append((nx,ny))
    for r in range(4):
        for c in range(4):
            col='#374151' if g[r][c]=='#' else '#dbeafe'
            ax.add_patch(Rectangle((c,3-r),1,1,fc=col,ec='white'))
            if (r,c) in d:ax.text(c+0.5,3-r+0.5,str(d[(r,c)]),ha='center',va='center',fontweight='bold',color='#14213d')
    ax.set_xlim(0,4);ax.set_ylim(0,4);ax.set_title('BFS distances from the top-left cell',fontsize=10,fontweight='bold');save(f,'ac9_bfs')
f_bfs()
def html():
    h=top('Grids: BFS, DFS, Matrices','ADVANCED CODING · GRIDS · MUST-DO','#0f7d6b')
    h+=intro('A grid is a graph: each cell is a node and its four neighbours are edges. <b>DFS</b> (stack or recursion) explores everything reachable, so it counts regions. <b>BFS</b> (queue) explores level by level, so it finds the <b>shortest path</b> when every step costs 1. Matrix questions (spiral, rotate) are just careful index work.')
    h+=fig('ac9_bfs','Dark cells are walls; numbers are BFS step counts.')
    h+=form('Rules',['<b>Directions:</b> <code>(1,0),(−1,0),(0,1),(0,−1)</code>; add the diagonals for 8-direction problems.','<b>Bounds check first</b> (<code>0 ≤ x &lt; R</code>), then the wall/visited check.','<b>Count regions:</b> start a DFS from each unvisited land cell.','<b>Shortest path (equal cost):</b> BFS, mark visited when you push, not when you pop.','<b>Rotate 90° clockwise:</b> reverse the rows, then transpose.','<b>Spiral order:</b> four shrinking boundaries top, bottom, left, right.'])
    h+=h3('1. Number of islands')
    g=['11000','11000','00100','00011']
    h+=cbp('python',D_ISL+'\ng = ["11000", "11000", "00100", "00011"]\nprint(islands(g))\n','',3)
    h+=ex('Count the islands in 11000 / 11000 / 00100 / 00011.',str(IS['islands'](g)),'Three groups of connected 1s. Checked against a union–find count on 120 random grids.')
    h+=h3('2. Shortest path in a maze')
    h+=cbp('java',JAVA_BFS,'4 4\n..#.\n.##.\n....\n#.#.',6)
    h+=ex('Shortest path from the top-left to the bottom-right of the maze above (. is open, # is wall).',str(BF['shortest'](['..#.','.##.','....','#.#.'])),'Down, down, right, right, right, down: 6 moves. The Java program printed 6, and the Python BFS agreed with exhaustive path search on 120 random mazes.')
    h+=h3('3. Spiral order and rotation')
    m=[[1,2,3],[4,5,6],[7,8,9]]
    h+=cbp('python',D_SPI+D_ROT+'\nm = [[1,2,3],[4,5,6],[7,8,9]]\nprint(spiral(m))\nprint(rotate(m))\n','',"[1, 2, 3, 6, 9, 8, 7, 4, 5]\n[[7, 4, 1], [8, 5, 2], [9, 6, 3]]")
    h+=ex('Spiral order of [[1,2,3],[4,5,6],[7,8,9]].',str(SP['spiral'](m)),'Walk the top row, right column, bottom row (reversed), left column (reversed), then shrink.')
    h+=tb(['Signal','Technique','Why'],[['“number of regions / islands”','DFS or BFS from every unvisited cell','Connected components'],['“minimum steps to reach”','BFS','Equal-cost shortest path'],['“can you reach”','DFS/BFS','Reachability'],['“spiral”, “rotate”, “diagonal”','Index arithmetic','Pure implementation'],['“minimum cost” with different weights','Dijkstra','Not BFS']],'sm')
    h+=tips(['Mark a cell visited <b>when you push it</b> to avoid adding it twice.','Use iterative DFS in Python for big grids.','Test the 1 × 1 grid and the case where the start is a wall.'])
    h+=warn(['Checking bounds after indexing.','Running BFS from the wrong cell.','Using DFS for a shortest path.'])
    items=[('Islands in [“10”,“01”]? (4-direction)',str(IS['islands'](['10','01'])),'B'),('Islands in [“111”,“010”,“111”]?',str(IS['islands'](['111','010','111'])),'B'),('Shortest path in [“..”,“..”]?',str(BF['shortest'](['..','..'])),'M'),('Shortest path in [“.#.”,“...”,“.#.”]?',str(BF['shortest'](['.#.','...','.#.'])),'M'),('Spiral of [[1,2],[3,4]]: the 3rd element?',str(SP['spiral']([[1,2],[3,4]])[2]),'M'),('Rotate [[1,2],[3,4]]: the top-left value?',str(RO['rotate']([[1,2],[3,4]])[0][0]),'M'),('Shortest path in [“.#”,“#.”] (−1 if impossible)?',str(BF['shortest'](['.#','#.'])),'A'),('Islands in a 3×3 checkerboard 101/010/101?',str(IS['islands'](['101','010','101'])),'A')]
    h+=pq('9. Grids, BFS and DFS','Practice',items)
    return h+end()
