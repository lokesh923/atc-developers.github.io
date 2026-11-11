"""Generate the Game 3 (Key Collection) Zero-to-Hero guide HTML.

* Board illustrations are original SVG drawings.
* Practice puzzles are generated and solved with BFS (shortest path), trying every key order,
  so every "minimum moves" answer and route in the key is verified.
Usage: python3 build_game3_guide.py <base_style.html> <out.html>
"""
import itertools
import random
import sys
from collections import deque

rng = random.Random(3033)
ROWS = "ABCDEFGHIJ"
VEC = {"U": (-1, 0), "D": (1, 0), "L": (0, -1), "R": (0, 1)}

def nm(p):
    return f"{ROWS[p[0]]}{p[1] + 1}"

# ---------------------------------------------------------------- icons
def key_icon(x, y, k=1.0, col="#d4a017"):
    return (f'<g transform="translate({x},{y}) scale({k})"><circle cx="-6" cy="0" r="6" fill="none" stroke="{col}" stroke-width="3.4"/>'
            f'<path d="M0,0 H12 M8,0 V5 M12,0 V4" stroke="{col}" stroke-width="3.4" stroke-linecap="round" fill="none"/></g>')

def door_icon(x, y, k=1.0, col="#1f2430"):
    return (f'<g transform="translate({x},{y}) scale({k})"><path d="M-9,13 V-12 H9 V13 M-13,13 H13" fill="none" stroke="{col}" stroke-width="2.4" stroke-linejoin="round"/>'
            f'<circle cx="4.5" cy="1" r="1.8" fill="{col}"/></g>')

def person_icon(x, y, k=1.0, col="#fff"):
    return (f'<g transform="translate({x},{y}) scale({k})"><circle cx="0" cy="-6" r="5.2" fill="{col}"/>'
            f'<path d="M-10,11 Q-10,0 0,0 Q10,0 10,11 Z" fill="{col}"/></g>')

def board(n, walls=(), revealed=(), trail=(), player=None, keys=(), got=(), door=None, s=46,
          arrows=True, hidden_dashed=False, bump=None, labels=True, route=None, done=False):
    pad_l, pad_t = (22, 18) if labels else (4, 4)
    W, H = pad_l + n * s + 6, pad_t + n * s + 6
    o = [f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" xmlns="http://www.w3.org/2000/svg" class="kb">']
    o.append(f'<rect x="{pad_l-3}" y="{pad_t-3}" width="{n*s+6}" height="{n*s+6}" rx="5" fill="#d3d7df"/>')
    if labels:
        for c in range(n):
            o.append(f'<text x="{pad_l+c*s+s/2}" y="{pad_t-6}" text-anchor="middle" class="lb">{c+1}</text>')
        for r in range(n):
            o.append(f'<text x="{pad_l-11}" y="{pad_t+r*s+s/2+4}" text-anchor="middle" class="lb">{ROWS[r]}</text>')
    walls, revealed, trail = set(walls), set(revealed), set(trail)
    for r in range(n):
        for c in range(n):
            x, y = pad_l + c * s, pad_t + r * s
            fill = "#ffffff"
            if (r, c) in trail: fill = "#dbe7ff"
            if done and (r, c) in trail: fill = "#dcfce7"
            o.append(f'<rect x="{x+1.5}" y="{y+1.5}" width="{s-3}" height="{s-3}" fill="{fill}" rx="2"/>')
            if (r, c) in revealed or ((r, c) in walls and not hidden_dashed):
                o.append(f'<rect x="{x+1.5}" y="{y+1.5}" width="{s-3}" height="{s-3}" fill="#4b5160" rx="2"/>'
                         f'<path d="M{x+s*0.3},{y+s*0.3} L{x+s*0.7},{y+s*0.7} M{x+s*0.7},{y+s*0.3} L{x+s*0.3},{y+s*0.7}" stroke="#f87171" stroke-width="2.4" stroke-linecap="round"/>'
                         if (r, c) in revealed else
                         f'<rect x="{x+1.5}" y="{y+1.5}" width="{s-3}" height="{s-3}" fill="#4b5160" rx="2"/>')
            elif (r, c) in walls and hidden_dashed:
                o.append(f'<rect x="{x+4}" y="{y+4}" width="{s-8}" height="{s-8}" fill="none" stroke="#9aa0ad" stroke-width="1.6" stroke-dasharray="4 3" rx="2"/>')
    if route:
        pts = " ".join(f"{pad_l+c*s+s/2},{pad_t+r*s+s/2}" for r, c in route)
        o.append(f'<polyline points="{pts}" fill="none" stroke="#2563eb" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" opacity=".75"/>')
    for i, kp in enumerate(keys):
        if kp in got: continue
        o.append(key_icon(pad_l + kp[1] * s + s / 2 + 1, pad_t + kp[0] * s + s / 2, s / 46))
        if len(keys) > 1:
            o.append(f'<text x="{pad_l+kp[1]*s+s-8}" y="{pad_t+kp[0]*s+12}" class="kn">{i+1}</text>')
    if door:
        o.append(door_icon(pad_l + door[1] * s + s / 2, pad_t + door[0] * s + s / 2, s / 46,
                           "#16a34a" if done else "#1f2430"))
    if bump:
        (br, bc), d = bump
        x, y = pad_l + bc * s + s / 2, pad_t + br * s + s / 2
        o.append(f'<text x="{x}" y="{y+5}" text-anchor="middle" class="bp">💥</text>')
    if player:
        r, c = player
        x, y = pad_l + c * s, pad_t + r * s
        o.append(f'<rect x="{x+1.5}" y="{y+1.5}" width="{s-3}" height="{s-3}" fill="#1f2430" rx="2"/>')
        o.append(person_icon(x + s / 2, y + s / 2 + 1, s / 46))
        if arrows:
            for d, (dr, dc) in VEC.items():
                nr, nc = r + dr, c + dc
                if not (0 <= nr < n and 0 <= nc < n): continue
                cx, cy = x + s / 2 + dc * (s / 2 + 1), y + s / 2 + dr * (s / 2 + 1)
                pts = {"U": f"{cx-6},{cy+2} {cx},{cy-5} {cx+6},{cy+2}", "D": f"{cx-6},{cy-2} {cx},{cy+5} {cx+6},{cy-2}",
                       "L": f"{cx+2},{cy-6} {cx-5},{cy} {cx+2},{cy+6}", "R": f"{cx-2},{cy-6} {cx+5},{cy} {cx-2},{cy+6}"}[d]
                o.append(f'<polygon points="{pts}" fill="#9aa0ad"/>')
    o.append("</svg>")
    return "".join(o)

def hud(svg, timer="3:42", text="Collect <b>1 KEY</b><br>then get to the <b>DOOR</b>", keys_line=None):
    k = f'<div class="hk">{keys_line}</div>' if keys_line else ""
    return (f'<div class="shot">{svg}<div class="hud"><div class="ring"><span>{timer}</span></div>'
            f'<div class="ht">{text}{k}</div></div></div>')

# ---------------------------------------------------------------- BFS
def bfs(n, walls, src):
    dist = {src: 0}; prev = {src: None}; q = deque([src])
    while q:
        cur = q.popleft()
        for d, (dr, dc) in VEC.items():
            nx = (cur[0] + dr, cur[1] + dc)
            if 0 <= nx[0] < n and 0 <= nx[1] < n and nx not in walls and nx not in dist:
                dist[nx] = dist[cur] + 1; prev[nx] = (cur, d); q.append(nx)
    return dist, prev

def path_to(prev, dst):
    moves, cells = [], [dst]
    while prev[dst] is not None:
        p, d = prev[dst]; moves.append(d); cells.append(p); dst = p
    return moves[::-1], cells[::-1]

def solve(n, walls, start, keys, door):
    pts = [start] + list(keys) + [door]
    best = None
    for perm in itertools.permutations(range(len(keys))):
        order = [start] + [keys[i] for i in perm] + [door]
        total, moves, cells = 0, [], [start]
        ok = True
        for a, b in zip(order, order[1:]):
            dist, prev = bfs(n, walls, a)
            if b not in dist: ok = False; break
            m, cl = path_to(prev, b); total += len(m); moves += m; cells += cl[1:]
        if ok and (best is None or total < best[0]):
            best = (total, perm, moves, cells)
    return best

def manhattan(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def compress(moves):
    out, i = [], 0
    while i < len(moves):
        j = i
        while j < len(moves) and moves[j] == moves[i]: j += 1
        out.append(f"{moves[i]}{j-i if j-i > 1 else ''}"); i = j
    return " ".join(out)

def make_level(n, nkeys, nwalls, min_detour):
    while True:
        cells = [(r, c) for r in range(n) for c in range(n)]
        rng.shuffle(cells)
        start, door = cells[0], cells[1]
        if manhattan(start, door) < n - 1: continue
        keys = cells[2:2 + nkeys]
        walls = set(cells[2 + nkeys:2 + nkeys + nwalls])
        sol = solve(n, walls, start, keys, door)
        if not sol: continue
        # lower bound if there were no walls (best key order)
        lb = min(sum(manhattan(a, b) for a, b in zip([start] + [keys[i] for i in p] + [door],
                                                         [keys[i] for i in p] + [door]))
                 for p in itertools.permutations(range(nkeys)))
        if sol[0] - lb < min_detour: continue
        # a key must not sit on the door/start; route must be reasonably long
        if sol[0] < n + 1: continue
        return dict(n=n, start=start, door=door, keys=keys, walls=walls, best=sol[0], perm=sol[1],
                    moves=sol[2], cells=sol[3], lb=lb)

def practice():
    spec = [("Easy", 4, 1, 3, 0)] * 4 + [("Medium", 6, 1, 8, 2)] * 2 + [("Medium", 6, 2, 8, 2)] * 2 + \
           [("Hard", 8, 2, 16, 2)] * 2 + [("Hard", 8, 3, 16, 2)] * 2
    return [(lvl, make_level(n, k, w, d)) for lvl, n, k, w, d in spec]

def practice_html(levels):
    o, last = [], None
    for i, (lvl, L) in enumerate(levels, 1):
        if lvl != last:
            if last: o.append("</div>")
            desc = {"Easy": "4×4 grid · 1 key", "Medium": "6×6 grid · 1–2 keys", "Hard": "8×8 grid · 2–3 keys"}[lvl]
            o.append(f'<div class="avoid-head"><h3>{lvl} · {desc}</h3></div><div class="pzgrid {lvl.lower()}">')
            last = lvl
        s = {4: 40, 6: 30, 8: 30}[L["n"]]
        svg = board(L["n"], walls=L["walls"], player=L["start"], keys=L["keys"], door=L["door"], s=s, arrows=False)
        kk = f'{len(L["keys"])} key' + ("s" if len(L["keys"]) > 1 else "")
        o.append(f'<div class="pz"><div class="pzh">Q{i} <span>{lvl}</span></div>{svg}<div class="pzq">{kk} · minimum moves = ?</div></div>')
    o.append("</div>")
    return "".join(o)

def key_html(levels):
    o = ["<table class='keyt'><thead><tr><th>#</th><th>Level</th><th>Min. moves</th><th>Key order</th><th>One shortest route</th></tr></thead><tbody>"]
    for i, (lvl, L) in enumerate(levels, 1):
        order = " → ".join(nm(L["keys"][j]) for j in L["perm"])
        o.append(f"<tr><td>Q{i}</td><td>{lvl}</td><td><b>{L['best']}</b> <span class='mut'>(no-wall minimum {L['lb']})</span></td>"
                 f"<td>{order}</td><td class='mono'>{compress(L['moves'])}</td></tr>")
    o.append("</tbody></table>")
    return "".join(o)

# ---------------------------------------------------------------- worked play-through (5x5, hidden walls)
N5 = 5
A, B, C, D, E = range(5)
START, KEY, DOOR = (E, 0), (A, 2), (C, 4)
HIDDEN = {(C, 0), (C, 1), (B, 3), (D, 3), (E, 3), (A, 0)}

def playthrough():
    f1 = hud(board(N5, walls=HIDDEN, hidden_dashed=True, player=START, keys=[KEY], door=DOOR), "4:00")
    t2 = [START, (D, 0), (D, 1)]
    f2 = hud(board(N5, walls=HIDDEN, hidden_dashed=True, revealed={(C, 0), (C, 1)}, trail=t2[:-1], player=(D, 1),
                   keys=[KEY], door=DOOR, bump=None), "3:51")
    t3 = [START, (D, 0), (D, 1), (D, 2), (C, 2), (B, 2), (A, 2)]
    f3 = hud(board(N5, walls=HIDDEN, hidden_dashed=True, revealed={(C, 0), (C, 1)}, trail=t3[:-1], player=KEY,
                   keys=[KEY], got={KEY}, door=DOOR, route=t3), "3:40", keys_line="🔑 Key collected ✓")
    t4 = t3 + [(A, 3)]
    f4 = hud(board(N5, walls=HIDDEN, hidden_dashed=True, revealed={(C, 0), (C, 1), (B, 3)}, trail=t4[:-1], player=(A, 3),
                   keys=[KEY], got={KEY}, door=DOOR), "3:35", keys_line="🔑 Key collected ✓")
    t5 = t4 + [(A, 4), (B, 4), (C, 4)]
    f5 = hud(board(N5, walls=HIDDEN, revealed={(C, 0), (C, 1), (B, 3)}, trail=t5, player=None, keys=[KEY], got={KEY},
                   door=DOOR, route=t5, done=True), "3:29", text="<b>Level complete!</b><br>10 moves · 3 bumps",
             keys_line="🔑 1/1 · 🚪 reached")
    return f1, f2, f3, f4, f5

def manhattan_svg():
    pts = [(D, 0), (D, 1), (D, 2), (D, 3), (C, 3), (B, 3)]
    return board(5, player=(D, 0), keys=[(B, 3)], route=pts, s=40, arrows=False, trail=set(pts[1:-1]))

def multikey_svgs():
    """Find a 6x6 open-grid layout where key order matters a lot (worst order >= best + 10)."""
    n, start, door = 6, (5, 0), (0, 5)
    r2 = random.Random(77)
    cells = [(r, c) for r in range(n) for c in range(n) if (r, c) not in (start, door)]
    while True:
        keys = r2.sample(cells, 3)
        totals = []
        for perm in itertools.permutations(range(3)):
            order = [start] + [keys[i] for i in perm] + [door]
            tot, cl_all = 0, [start]
            for a, b in zip(order, order[1:]):
                dist, prev = bfs(n, set(), a); m, cl = path_to(prev, b); tot += len(m); cl_all += cl[1:]
            totals.append((tot, perm, cl_all))
        totals.sort(key=lambda t: t[0])
        best, worst = totals[0], totals[-1]
        if worst[0] - best[0] >= 10:
            break
    gsvg = board(n, player=start, keys=keys, door=door, route=best[2], s=34, arrows=False)
    bsvg = board(n, player=start, keys=keys, door=door, route=worst[2], s=34, arrows=False)
    fmt = lambda perm: " → ".join(nm(keys[i]) for i in perm)
    return gsvg, bsvg, best[0], worst[0], fmt(best[1]), fmt(worst[1])

def main(base, out):
    style = open(base).read()
    tpl = open(__file__.replace("build_game3_guide.py", "game3_template.html")).read()
    f1, f2, f3, f4, f5 = playthrough()
    levels = practice()
    g, b, gm, bm, go, bo = multikey_svgs()
    screen = hud(board(3, player=(1, 2), trail={(1, 1)}, keys=[(0, 0)], door=(2, 2), s=70), "4:00")
    html = (tpl.replace("<!--BASE_STYLE-->", style)
               .replace("<!--SCREEN-->", screen)
               .replace("<!--F1-->", f1).replace("<!--F2-->", f2).replace("<!--F3-->", f3)
               .replace("<!--F4-->", f4).replace("<!--F5-->", f5)
               .replace("<!--MANHATTAN-->", manhattan_svg())
               .replace("<!--MK_GOOD-->", g).replace("<!--MK_BAD-->", b)
               .replace("<!--MK_GM-->", str(gm)).replace("<!--MK_BM-->", str(bm))
               .replace("<!--MK_GO-->", go).replace("<!--MK_BO-->", bo)
               .replace("<!--PRACTICE-->", practice_html(levels))
               .replace("<!--KEY-->", key_html(levels)))
    open(out, "w").write(html)
    print("ok", out, "| practice best moves:", [L["best"] for _, L in levels])

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
