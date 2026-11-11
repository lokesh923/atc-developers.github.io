"""Generate the Game 1 (Bubbles) Zero-to-Hero guide HTML.

Practice questions are generated with a fixed seed, and the answer key is computed,
so every printed order is mathematically correct.
Usage: python3 build_game1_guide.py <base_style.html> <out.html>
"""
import random
import sys
from fractions import Fraction

rng = random.Random(2027)

# ---------- expression helpers ----------
def ev(e):
    a, op, b = e
    return {"+": a + b, "-": a - b, "×": a * b, "÷": Fraction(a, b)}[op]

def show(e):
    a, op, b = e
    return f"{a} {'−' if op == '-' else op} {b}"

def val_str(v):
    v = Fraction(v)
    return str(v.numerator) if v.denominator == 1 else f"{float(v):g}"

def gen(level):
    """Return one expression for the given level."""
    if level == 1:
        op = rng.choice("+-")
        if op == "+":
            return (rng.randint(5, 60), "+", rng.randint(5, 45))
        a = rng.randint(20, 95)
        return (a, "-", rng.randint(3, a - 2))
    if level == 2:
        op = rng.choice("+-×÷")
        if op == "+":
            return (rng.randint(12, 79), "+", rng.randint(11, 69))
        if op == "-":
            a = rng.randint(30, 99)
            return (a, "-", rng.randint(5, a - 5))
        if op == "×":
            return (rng.randint(3, 12), "×", rng.randint(3, 12))
        b = rng.randint(2, 12)
        return (b * rng.randint(2, 12), "÷", b)
    # level 3: bigger numbers, mixed, used to build close sets
    op = rng.choice("+-×÷")
    if op == "+":
        return (rng.randint(25, 89), "+", rng.randint(25, 89))
    if op == "-":
        a = rng.randint(60, 180)
        return (a, "-", rng.randint(15, 59))
    if op == "×":
        return (rng.randint(6, 15), "×", rng.randint(4, 12))
    b = rng.randint(3, 12)
    return (b * rng.randint(6, 20), "÷", b)

def make_q(level):
    while True:
        exprs = [gen(level) for _ in range(3)]
        vals = [ev(e) for e in exprs]
        if len(set(vals)) < 3:
            continue
        if len({e[1] for e in exprs}) < (1 if level == 1 else 2):
            continue
        spread = max(vals) - min(vals)
        if level == 1 and not (8 <= spread <= 70):
            continue
        if level == 2 and not (4 <= spread <= 60):
            continue
        if level == 3 and not (2 <= spread <= 14):   # close values: estimation alone is not enough
            continue
        return exprs

LAYOUTS = [  # (left%, top px) for 3 bubbles inside a screen box
    [(14, 18), (60, 6), (34, 92)],
    [(8, 70), (40, 10), (70, 72)],
    [(58, 16), (20, 40), (66, 96)],
    [(30, 8), (8, 96), (64, 60)],
    [(70, 10), (40, 84), (10, 30)],
]

def screen(exprs, qlabel, small=True, order=None, highlight=None, timer="00:15", layout=None):
    lay = layout or rng.choice(LAYOUTS)
    cls = "screen sm" if small else "screen"
    h = []
    h.append(f'<div class="{cls}"><div class="sbar"><b>{qlabel}</b><span class="gtag">GAME: BUBBLES</span>'
             f'<span class="tmr">⏱ {timer}</span></div><div class="sins">Tap the bubbles in ASCENDING order of their result.</div><div class="arena">')
    for i, (e, (x, y)) in enumerate(zip(exprs, lay)):
        badge = ""
        if order is not None:
            badge = f'<i class="ord">{order[i]}</i>'
        extra = " hl" if highlight is not None and highlight == i else ""
        h.append(f'<div class="bub{extra}" style="left:{x}%;top:{y}px">{show(e)}{badge}</div>')
    h.append("</div></div>")
    return "".join(h)

def ranks(exprs):
    vals = [ev(e) for e in exprs]
    s = sorted(range(3), key=lambda i: vals[i])
    r = [0] * 3
    for pos, i in enumerate(s):
        r[i] = pos + 1
    return r

def key_row(n, exprs):
    vals = [ev(e) for e in exprs]
    order = sorted(range(3), key=lambda i: vals[i])
    calc = " · ".join(f"{show(e)} = <b>{val_str(v)}</b>" for e, v in zip(exprs, vals))
    tap = " → ".join(show(exprs[i]) for i in order)
    return f"<tr><td>{n}</td><td>{calc}</td><td><b>{tap}</b></td></tr>"

# ---------- practice sets ----------
sets = []
for level, title, note in [
    (1, "Level 1 · Warm-up", "Addition and subtraction only. Target: under 10 seconds per question."),
    (2, "Level 2 · Exam level", "All four operators, mixed. Target: under 13 seconds per question."),
    (3, "Level 3 · Hard: close values", "Results are close together, so estimation alone won't work. Target: under 15 seconds per question."),
]:
    qs = [make_q(level) for _ in range(12)]
    sets.append((level, title, note, qs))

def practice_html():
    out = []
    qn = 0
    for level, title, note, qs in sets:
        out.append(f'<div class="avoid-head"><h3>{title}</h3><p class="lead" style="margin:0 0 8px">{note} Cover the answer key, set a 15-second timer for each question and write down your tap order.</p></div>')
        out.append('<div class="pgrid">')
        for q in qs:
            qn += 1
            out.append(screen(q, f"P{qn}"))
        out.append("</div>")
    return "".join(out)

def key_html():
    out = []
    qn = 0
    for level, title, note, qs in sets:
        out.append(f"<h3>{title}: answers</h3><table class='keyt'><thead><tr><th>#</th><th>Values</th><th>Correct tap order</th></tr></thead><tbody>")
        for q in qs:
            qn += 1
            out.append(key_row(f"P{qn}", q))
        out.append("</tbody></table>")
    return "".join(out)

# ---------- fixed teaching examples ----------
EX_LAYOUT = [(18, 30), (62, 6), (40, 96)]
EX_SCREEN = [(53, "+", 7), (58, "+", 77), (60, "-", 5)]          # the sample screen from the brief
WORKED = [
    [(9, "×", 8), (12, "-", 9), (36, "÷", 4)],
    [(48, "+", 27), (9, "×", 9), (100, "-", 21)],
    [(84, "÷", 7), (3, "×", 5), (40, "-", 26)],
    [(7, "×", 6), (90, "÷", 2), (18, "+", 25)],
]

def worked_html():
    rows = []
    for ex in WORKED:
        r = ranks(ex)
        vals = [ev(e) for e in ex]
        order = sorted(range(3), key=lambda i: vals[i])
        rows.append('<div class="wk avoid">' + screen(ex, "Example", order=r) +
                    '<div class="wtxt"><ul>' +
                    "".join(f"<li><code>{show(e)}</code> = <b>{val_str(v)}</b></li>" for e, v in zip(ex, vals)) +
                    f"</ul><p class='tap'>Tap: {' → '.join(show(ex[i]) for i in order)}</p></div></div>")
    return "".join(rows)

def main(base, out):
    style = open(base).read()
    html = open(__file__.replace("build_game1_guide.py", "game1_template.html")).read()
    html = (html.replace("<!--BASE_STYLE-->", style)
                .replace("<!--SCREEN_BLANK-->", screen(EX_SCREEN, "Q3", small=False, layout=EX_LAYOUT))
                .replace("<!--SCREEN_STEP1-->", screen(EX_SCREEN, "Q3", layout=EX_LAYOUT))
                .replace("<!--SCREEN_STEP3-->", screen(EX_SCREEN, "Q3", order=ranks(EX_SCREEN), layout=EX_LAYOUT))
                .replace("<!--WORKED-->", worked_html())
                .replace("<!--PRACTICE-->", practice_html())
                .replace("<!--KEY-->", key_html()))
    open(out, "w").write(html)
    print("ok", out)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
