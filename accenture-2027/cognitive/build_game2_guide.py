"""Generate the Game 2 (Pathfinding) Zero-to-Hero guide HTML.

* Illustrations of the game screen are drawn as SVG (track tiles, rocket, planet, controls).
* Practice puzzles use the arrow-tile model and are generated + solved by code,
  so every answer in the key is verified.
Usage: python3 build_game2_guide.py <base_style.html> <out.html>
"""
import random
import sys

rng = random.Random(4242)
ROWS = "ABCDEFGH"
VEC = {"U": (-1, 0), "R": (0, 1), "D": (1, 0), "L": (0, -1)}
ARROW = {"U": "↑", "R": "→", "D": "↓", "L": "←"}
OPP = {"U": "D", "D": "U", "L": "R", "R": "L"}
CW = {"U": "R", "R": "D", "D": "L", "L": "U"}

def cell_name(r, c):
    return f"{ROWS[r]}{c + 1}"

# ======================================================================
#  SVG: track-tile illustrations of the real game screen
# ======================================================================
def side_pt(cx, cy, s, side):
    h = s / 2
    return {"U": (cx, cy - h), "D": (cx, cy + h), "L": (cx - h, cy), "R": (cx + h, cy)}[side]

def chevron(x, y, dx, dy, col="#fff", w=1.8, k=1.0):
    nx, ny = -dy, dx
    a = (x - dx * 3 * k + nx * 3.6 * k, y - dy * 3 * k + ny * 3.6 * k)
    b = (x + dx * 2.4 * k, y + dy * 2.4 * k)
    c = (x - dx * 3 * k - nx * 3.6 * k, y - dy * 3 * k - ny * 3.6 * k)
    return (f'<polyline points="{a[0]:.1f},{a[1]:.1f} {b[0]:.1f},{b[1]:.1f} {c[0]:.1f},{c[1]:.1f}" '
            f'fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')

def rocket(x, y, k=1.0, d="R"):
    rot = {"R": 0, "D": 90, "L": 180, "U": -90}[d]
    return (f'<g transform="translate({x},{y}) rotate({rot}) scale({k})">'
            '<path d="M-14,-6 L6,-6 Q16,0 6,6 L-14,6 Z" fill="#334155"/>'
            '<path d="M-14,-6 L-20,-12 L-10,-6 Z M-14,6 L-20,12 L-10,6 Z" fill="#475569"/>'
            '<circle cx="2" cy="0" r="2.6" fill="#93c5fd"/>'
            '<path d="M-14,-3 L-22,0 L-14,3 Z" fill="#f97316"/></g>')

def planet(x, y, k=1.0):
    return (f'<g transform="translate({x},{y}) scale({k})">'
            '<circle r="10" fill="#2563eb"/><path d="M-6,-5 q4,2 2,6 q-3,3 1,6" fill="none" stroke="#86efac" stroke-width="2.4"/>'
            '<ellipse rx="15" ry="4.5" fill="none" stroke="#1e293b" stroke-width="1.8" transform="rotate(-18)"/></g>')

def track_grid(n, tiles, start, goal, s=54, path=(), broken=(), selected=(), fixed=(), labels=True,
               badges=None, dialog=None, controls=True, timer="4:12", qlabel="Puzzle"):
    """tiles: {(r,c): (sideA, sideB, flow_in)}; flow_in = side the rocket enters from (or None).
    start=(r, side_of_grid_entry, c) as ('L', row) etc.  goal=(row,col,side) where planet sits outside."""
    pad_l, pad_t = 46, 30
    W = pad_l + n * s + 70
    H = pad_t + n * s + (60 if controls else 18)
    o = [f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" xmlns="http://www.w3.org/2000/svg" class="pf">']
    o.append(f'<rect x="{pad_l-4}" y="{pad_t-4}" width="{n*s+8}" height="{n*s+8}" rx="6" fill="#d9dde5"/>')
    if labels:
        for c in range(n):
            o.append(f'<text x="{pad_l+c*s+s/2}" y="{pad_t-10}" text-anchor="middle" class="lb">{c+1}</text>')
        for r in range(n):
            o.append(f'<text x="{pad_l-14}" y="{pad_t+r*s+s/2+4}" text-anchor="middle" class="lb">{ROWS[r]}</text>')
    for r in range(n):
        for c in range(n):
            x, y = pad_l + c * s, pad_t + r * s
            fill = "#eef0f4"
            if (r, c) in fixed: fill = "#dcfce7"
            if (r, c) in broken: fill = "#ffe4e6"
            o.append(f'<rect x="{x+1}" y="{y+1}" width="{s-2}" height="{s-2}" fill="{fill}" stroke="#c9ced8"/>')
    for (r, c), (a, b, fin) in tiles.items():
        cx, cy = pad_l + c * s + s / 2, pad_t + r * s + s / 2
        on = (r, c) in path
        col = "#16a34a" if on else "#5b6170"
        if (r, c) in broken: col = "#e11d48"
        for side in (a, b):
            px, py = side_pt(cx, cy, s, side)
            o.append(f'<line x1="{cx}" y1="{cy}" x2="{px}" y2="{py}" stroke="{col}" stroke-width="{s*0.26:.1f}" stroke-linecap="square"/>')
        o.append(f'<rect x="{cx-s*0.13:.1f}" y="{cy-s*0.13:.1f}" width="{s*0.26:.1f}" height="{s*0.26:.1f}" fill="{col}"/>')
        ent = fin if fin in (a, b) else a
        ext = b if ent == a else a
        # entry half: arrow points toward centre; exit half: arrow points toward exit side
        ex, ey = side_pt(cx, cy, s, ent)
        dx, dy = (cx - ex) / (s / 2), (cy - ey) / (s / 2)
        o.append(chevron((ex + cx) / 2, (ey + cy) / 2, dx, dy))
        xx, xy = side_pt(cx, cy, s, ext)
        dx, dy = (xx - cx) / (s / 2), (xy - cy) / (s / 2)
        o.append(chevron((xx + cx) / 2, (xy + cy) / 2, dx, dy))
    for (r, c) in selected:
        x, y = pad_l + c * s, pad_t + r * s
        o.append(f'<rect x="{x+2}" y="{y+2}" width="{s-4}" height="{s-4}" fill="none" stroke="#f59e0b" stroke-width="3.4" rx="3"/>')
    for (r, c) in broken:
        x, y = pad_l + c * s, pad_t + r * s
        o.append(f'<rect x="{x+2}" y="{y+2}" width="{s-4}" height="{s-4}" fill="none" stroke="#e11d48" stroke-width="2.4" stroke-dasharray="4 3" rx="3"/>')
    if badges:
        for (r, c), t in badges.items():
            x, y = pad_l + c * s + s - 9, pad_t + r * s + 9
            o.append(f'<circle cx="{x}" cy="{y}" r="9" fill="#14122b" stroke="#fff" stroke-width="1.5"/>'
                     f'<text x="{x}" y="{y+3.6}" text-anchor="middle" class="bd">{t}</text>')
    # rocket (start) and planet (goal) outside the grid
    sr, sside = start
    if sside == "L":
        o.append(rocket(pad_l - 26, pad_t + sr * s + s / 2, 0.9, "R"))
    gr, gc, gside = goal
    gx = pad_l + gc * s + s / 2 + (s / 2 + 18 if gside == "R" else 0)
    gy = pad_t + gr * s + s / 2 - (s / 2 + 16 if gside == "U" else 0)
    o.append(planet(gx, gy, 0.95))
    if controls:
        by = pad_t + n * s + 14
        cx0 = pad_l + n * s / 2
        o.append(f'<circle cx="{cx0-92}" cy="{by+18}" r="15" fill="#fff" stroke="#14122b" stroke-width="2.2"/>'
                 f'<text x="{cx0-92}" y="{by+22}" text-anchor="middle" class="tm">{timer}</text>')
        for i, (sym, lab) in enumerate([("⟳", "Rotate"), ("⇄", "Swap"), ("✓", "Check")]):
            bx = cx0 - 48 + i * 48
            o.append(f'<rect x="{bx-17}" y="{by+2}" width="34" height="32" rx="5" fill="#2b2f3a"/>'
                     f'<text x="{bx}" y="{by+24}" text-anchor="middle" class="bt">{sym}</text>')
    if dialog:
        mx, my = pad_l + n * s / 2, pad_t + n * s / 2
        o.append(f'<rect x="{mx-92}" y="{my-30}" width="184" height="60" rx="6" fill="#fff" stroke="#c9ced8"/>'
                 f'<text x="{mx}" y="{my-8}" text-anchor="middle" class="dg">{dialog}</text>'
                 f'<rect x="{mx-38}" y="{my+4}" width="76" height="20" rx="3" fill="#111"/>'
                 f'<text x="{mx}" y="{my+18}" text-anchor="middle" class="dc">CONTINUE</text>')
    o.append("</svg>")
    return "".join(o)

# ---------------- worked play-through (4x4) ----------------
A, B, C, D = 0, 1, 2, 3
SOLUTION_PATH = [(C, 0), (C, 1), (B, 1), (A, 1), (A, 2), (A, 3)]
def base_tiles():
    return {
        (A, 0): ("D", "R", "D"), (A, 1): ("D", "R", "D"), (A, 2): ("L", "D", "L"), (A, 3): ("L", "R", "L"),
        (B, 0): ("U", "D", "U"), (B, 1): ("D", "U", "D"), (B, 2): ("L", "R", "L"), (B, 3): ("U", "D", "U"),
        (C, 0): ("L", "R", "L"), (C, 1): ("L", "D", "L"), (C, 2): ("U", "R", "U"), (C, 3): ("L", "D", "L"),
        (D, 0): ("U", "R", "U"), (D, 1): ("L", "R", "L"), (D, 2): ("L", "R", "L"), (D, 3): ("L", "U", "L"),
    }
START = (C, "L")
GOAL = (A, 3, "R")

def step_svgs():
    t1 = base_tiles()
    s1 = track_grid(4, t1, START, GOAL, qlabel="Puzzle")
    s2 = track_grid(4, t1, START, GOAL, path={(C, 0)}, broken={(C, 1)},
                    badges={(C, 0): "1", (C, 1): "✗"})
    t3 = dict(t1); t3[(C, 1)] = ("L", "U", "L")             # rotate C2 once clockwise: {L,D} -> {U,L}
    s3 = track_grid(4, t3, START, GOAL, path={(C, 0), (C, 1), (B, 1), (A, 1)}, broken={(A, 2)},
                    selected={(C, 1)}, badges={(C, 0): "1", (C, 1): "2", (B, 1): "3", (A, 1): "4", (A, 2): "✗"})
    t4 = dict(t3); t4[(A, 2)], t4[(D, 2)] = ("L", "R", "L"), ("L", "D", "L")   # swap A3 <-> D3
    s4 = track_grid(4, t4, START, GOAL, path=set(SOLUTION_PATH), selected={(A, 2), (D, 2)},
                    badges={(A, 2): "⇄", (D, 2): "⇄"})
    s5 = track_grid(4, t4, START, GOAL, path=set(SOLUTION_PATH), fixed=set(SOLUTION_PATH),
                    badges={p: str(i + 1) for i, p in enumerate(SOLUTION_PATH)}, dialog="Valid route – well done!")
    return s1, s2, s3, s4, s5

# ---------------- tile anatomy mini-SVGs ----------------
def mini_tile(a, b, fin, label, rot_note=""):
    s = 54
    t = {(0, 0): (a, b, fin)}
    svg = track_grid(1, t, (0, "X"), (0, 0, "none"), s=s, labels=False, controls=False)
    # strip planet (goal "none" draws at centre) -> rebuild simply without rocket/planet
    svg = svg.split('<g transform="translate(')[0] + "</svg>"
    return f'<div class="tile-demo">{svg}<b>{label}</b><span>{rot_note}</span></div>'

def rotation_strip():
    out = []
    a, b = "L", "D"
    for i in range(4):
        out.append(mini_tile(a, b, a, ["Start", "1 tap", "2 taps", "3 taps"][i],
                             f"connects {a}–{b}".replace("U", "Up").replace("D", "Down").replace("L", "Left").replace("R", "Right")))
        a, b = CW[a], CW[b]
    return '<div class="strip">' + '<span class="arr">→</span>'.join(out) + "</div>"

# ======================================================================
#  Arrow-tile practice puzzles (generated + solved by code)
# ======================================================================
N = 5

def simulate(g, start, target, n=N):
    r, c = start
    seen, path = set(), []
    while True:
        if (r, c) == target:
            path.append((r, c)); return "reach", path, None
        if (r, c) in seen:
            path.append((r, c)); return "loop", path, (r, c)
        seen.add((r, c)); path.append((r, c))
        dr, dc = VEC[g[(r, c)]]
        nr, nc = r + dr, c + dc
        if not (0 <= nr < n and 0 <= nc < n):
            return "exit", path, g[(r, c)]
        r, c = nr, nc

def rand_grid(n=N):
    return {(r, c): rng.choice("URDL") for r in range(n) for c in range(n)}

def trace_puzzle(want):
    while True:
        g = rand_grid()
        start = (rng.randrange(N), rng.randrange(N))
        target = (rng.randrange(N), rng.randrange(N))
        if start == target or abs(start[0]-target[0]) + abs(start[1]-target[1]) < 3:
            continue
        res, path, info = simulate(g, start, target)
        if res == want and 6 <= len(path) <= 12:
            return dict(g=g, start=start, target=target, res=res, path=path, info=info)

def self_avoiding(start, target, minlen=7, maxlen=11):
    for _ in range(4000):
        path, cur, seen = [start], start, {start}
        while cur != target and len(path) < maxlen + 1:
            nbrs = [(cur[0]+dr, cur[1]+dc) for dr, dc in VEC.values()]
            nbrs = [p for p in nbrs if 0 <= p[0] < N and 0 <= p[1] < N and p not in seen]
            if not nbrs: break
            # bias toward target
            nbrs.sort(key=lambda p: abs(p[0]-target[0]) + abs(p[1]-target[1]) + rng.random() * 2.2)
            cur = nbrs[0] if rng.random() < 0.6 else rng.choice(nbrs)
            path.append(cur); seen.add(cur)
        if cur == target and minlen <= len(path) <= maxlen + 1:
            return path
    return None

def dir_between(a, b):
    d = (b[0]-a[0], b[1]-a[1])
    return [k for k, v in VEC.items() if v == d][0]

def fix_puzzle():
    while True:
        start = (rng.randrange(N), rng.randrange(N))
        target = (rng.randrange(N), rng.randrange(N))
        if abs(start[0]-target[0]) + abs(start[1]-target[1]) < 3: continue
        path = self_avoiding(start, target)
        if not path: continue
        g = rand_grid()
        for a, b in zip(path, path[1:]):
            g[a] = dir_between(a, b)
        # break one tile on the path (not the first two, so there is something to trace)
        idx = rng.randrange(2, len(path) - 1)
        cell = path[idx]
        good = g[cell]
        g[cell] = rng.choice([d for d in "URDL" if d != good])
        if simulate(g, start, target)[0] == "reach": continue
        # uniqueness: exactly one single-tile change reaches the target
        sols = []
        for cc in g:
            if cc == target: continue
            for d in "URDL":
                if d == g[cc]: continue
                h = dict(g); h[cc] = d
                if simulate(h, start, target)[0] == "reach":
                    sols.append((cc, d))
        if sols == [(cell, good)]:
            fixed = dict(g); fixed[cell] = good
            res, fpath, _ = simulate(fixed, start, target)
            broken_res, bpath, binfo = simulate(g, start, target)
            return dict(g=g, start=start, target=target, cell=cell, good=good, bad=g[cell],
                        fpath=fpath, bres=broken_res, bpath=bpath)

def arrow_svg(g, start, target, s=34, mark_path=(), mark_cell=None):
    pad_l, pad_t = 22, 18
    W, H = pad_l + N * s + 6, pad_t + N * s + 6
    o = [f'<svg viewBox="0 0 {W} {H}" width="{W}" height="{H}" xmlns="http://www.w3.org/2000/svg" class="ag">']
    for c in range(N):
        o.append(f'<text x="{pad_l+c*s+s/2}" y="{pad_t-6}" text-anchor="middle" class="lb2">{c+1}</text>')
    for r in range(N):
        o.append(f'<text x="{pad_l-9}" y="{pad_t+r*s+s/2+4}" text-anchor="middle" class="lb2">{ROWS[r]}</text>')
    for r in range(N):
        for c in range(N):
            x, y = pad_l + c * s, pad_t + r * s
            fill = "#f1f3f7"
            if (r, c) in mark_path: fill = "#dcfce7"
            if (r, c) == mark_cell: fill = "#fde68a"
            o.append(f'<rect x="{x+.5}" y="{y+.5}" width="{s-1}" height="{s-1}" fill="{fill}" stroke="#cfd4dd"/>')
            cx, cy = x + s / 2, y + s / 2
            if (r, c) == target:
                o.append(planet(cx, cy, 0.85)); continue
            dr, dc = VEC[g[(r, c)]]
            L = s * 0.3
            o.append(f'<line x1="{cx-dc*L:.1f}" y1="{cy-dr*L:.1f}" x2="{cx+dc*L*0.55:.1f}" y2="{cy+dr*L*0.55:.1f}" stroke="#3b3f4b" stroke-width="2.6"/>')
            o.append(chevron(cx + dc * L * 0.55, cy + dr * L * 0.55, dc, dr, "#3b3f4b", 2.6, 1.15))
            if (r, c) == start:
                o.append(f'<circle cx="{x+7}" cy="{y+7}" r="5.5" fill="#f97316"/><text x="{x+7}" y="{y+9.5}" text-anchor="middle" class="st">S</text>')
    o.append("</svg>")
    return "".join(o)

def fmt_path(p):
    return " → ".join(cell_name(*x) for x in p)

def practice():
    traces = [trace_puzzle(w) for w in ["reach", "exit", "loop", "reach", "exit", "loop"]]
    rng.shuffle(traces)
    fixes = [fix_puzzle() for _ in range(6)]
    return traces, fixes

def practice_html(traces, fixes):
    o = ['<div class="avoid-head"><h3>Set A · Trace the rocket (6 puzzles)</h3>'
         '<p class="lead" style="margin:0 0 8px">The rocket starts on the orange <b>S</b> tile and moves one tile at a time in the direction of each arrow. '
         'Write down the full route using cell names (for example C2 → C3 → B3). Does it <b>reach the planet</b>, <b>leave the grid</b> or get stuck in a <b>loop</b>?</p></div>',
         '<div class="pzgrid">']
    for i, t in enumerate(traces, 1):
        o.append(f'<div class="pz"><div class="pzh">A{i}</div>{arrow_svg(t["g"], t["start"], t["target"])}'
                 f'<div class="pzq">Start: <b>{cell_name(*t["start"])}</b> · Planet: <b>{cell_name(*t["target"])}</b></div></div>')
    o.append("</div>")
    o.append('<div class="avoid-head"><h3>Set B · Fix one tile (6 puzzles)</h3>'
             '<p class="lead" style="margin:0 0 8px">Exactly <b>one</b> tile is pointing the wrong way. Find it and say which direction it should point so the rocket reaches the planet. '
             'This is the core skill of the real game.</p></div><div class="pzgrid">')
    for i, f in enumerate(fixes, 1):
        o.append(f'<div class="pz"><div class="pzh">B{i}</div>{arrow_svg(f["g"], f["start"], f["target"])}'
                 f'<div class="pzq">Start: <b>{cell_name(*f["start"])}</b> · Planet: <b>{cell_name(*f["target"])}</b></div></div>')
    o.append("</div>")
    return "".join(o)

def key_html(traces, fixes):
    o = ["<h3>Set A: answers</h3><table class='keyt'><thead><tr><th>#</th><th>Route</th><th>Result</th></tr></thead><tbody>"]
    for i, t in enumerate(traces, 1):
        if t["res"] == "reach":
            res = '<span class="badge b-no">Reaches the planet ✓</span>'
        elif t["res"] == "exit":
            last = t["path"][-1]
            res = f'<span class="badge b-yes">Leaves the grid</span> from {cell_name(*last)} going {ARROW[t["info"]]}'
        else:
            res = f'<span class="badge b-mid">Loop</span> returns to {cell_name(*t["info"])}'
        o.append(f"<tr><td>A{i}</td><td class='mono'>{fmt_path(t['path'])}</td><td>{res}</td></tr>")
    o.append("</tbody></table><h3>Set B: answers</h3><table class='keyt'><thead><tr><th>#</th><th>Wrong tile → fix</th><th>Corrected route</th></tr></thead><tbody>")
    for i, f in enumerate(fixes, 1):
        o.append(f"<tr><td>B{i}</td><td><b>{cell_name(*f['cell'])}</b>: {ARROW[f['bad']]} → <b>{ARROW[f['good']]}</b></td>"
                 f"<td class='mono'>{fmt_path(f['fpath'])}</td></tr>")
    o.append("</tbody></table>")
    return "".join(o)

def solved_example_html(fixes):
    """Show the first fix puzzle solved visually (before / after)."""
    f = fixes[0]
    before = arrow_svg(f["g"], f["start"], f["target"], s=40, mark_path=set(f["bpath"]), mark_cell=f["cell"])
    g2 = dict(f["g"]); g2[f["cell"]] = f["good"]
    after = arrow_svg(g2, f["start"], f["target"], s=40, mark_path=set(f["fpath"]), mark_cell=f["cell"])
    return before, after, f

def main(base, out):
    style = open(base).read()
    tpl = open(__file__.replace("build_game2_guide.py", "game2_template.html")).read()
    s1, s2, s3, s4, s5 = step_svgs()
    traces, fixes = practice()
    # a separate, fixed teaching example (not in the practice set)
    teach = fix_puzzle()
    before, after, f = solved_example_html([teach])
    html = (tpl.replace("<!--BASE_STYLE-->", style)
               .replace("<!--S1-->", s1).replace("<!--S2-->", s2).replace("<!--S3-->", s3)
               .replace("<!--S4-->", s4).replace("<!--S5-->", s5)
               .replace("<!--ROTATION-->", rotation_strip())
               .replace("<!--TEACH_BEFORE-->", before).replace("<!--TEACH_AFTER-->", after)
               .replace("<!--TEACH_START-->", cell_name(*f["start"]))
               .replace("<!--TEACH_TARGET-->", cell_name(*f["target"]))
               .replace("<!--TEACH_BROKEN-->", fmt_path(f["bpath"]))
               .replace("<!--TEACH_BRES-->", {"exit": "leaves the grid", "loop": "gets stuck in a loop", "reach": "reaches"}[f["bres"]])
               .replace("<!--TEACH_CELL-->", cell_name(*f["cell"]))
               .replace("<!--TEACH_BAD-->", ARROW[f["bad"]]).replace("<!--TEACH_GOOD-->", ARROW[f["good"]])
               .replace("<!--TEACH_FIXED-->", fmt_path(f["fpath"]))
               .replace("<!--PRACTICE-->", practice_html(traces, fixes))
               .replace("<!--KEY-->", key_html(traces, fixes)))
    open(out, "w").write(html)
    print("ok", out)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
