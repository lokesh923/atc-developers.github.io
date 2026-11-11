"""Build a Graphy-format Word quiz (.docx) for a behavioural mock test.

Usage: python3 build_mock.py <template.docx> <mock_module> <out.docx>
The template's styles and page settings are kept; its sample content is replaced.

Item kinds supported (see mock*.py):
  ("L", text, topic, dir, core)    self-rating statement, agreement scale          (Mock 1)
  ("S", text, topic, dir, core)    situational statement, agreement scale          (Mock 1)
  ("H", text, "lie"|"norm")        honesty check, agreement scale                  (Mock 1)
  ("J", text, topic, opts, right, expl, diff)  situational judgement, fixed order (Mock 1)
  ("F", text, topic, dir, core)    frequency scale  (Never ... Always)
  ("I", text, topic, dir, core)    importance scale (Not important ... Extremely important)
  ("E", text, topic, dir, core)    effectiveness of another person's behaviour
  ("M", fmt, topic, question, [correct, wrong, wrong, ...], expl, diff)
                                   multiple choice; correct listed first, options are shuffled
  ("MF", fmt, topic, question, options, right, expl, diff)
                                   multiple choice with a fixed option order
dir: +1 positive quality, -1 reversed. core: 1 = clear-cut / core value (answer firmly).
"""
import importlib
import random
import sys

import docx

SUBJECT = "Behavioural Assessment"
SCALES = {
    "agree": ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
    "freq": ["Never", "Rarely", "Sometimes", "Often", "Always"],
    "imp": ["Not important", "Slightly important", "Moderately important", "Very important", "Extremely important"],
    "eff": ["Very ineffective", "Ineffective", "Neither effective nor ineffective", "Effective", "Very effective"],
}
SCALE_FMT = {
    "L": ("agree", "Self-rating statement", 'How far does this statement describe you? "{t}"'),
    "S": ("agree", "Situational statement", 'Rate how likely you are to act this way: "{t}"'),
    "F": ("freq", "Frequency rating", "{t}"),
    "I": ("imp", "Importance rating", "{t}"),
    "E": ("eff", "Behaviour effectiveness rating", "{t} How effective is this behaviour at work?"),
}


def key(dir_, core):
    """(best, acceptable) option numbers on a 5-point scale."""
    if dir_ > 0:
        return (5, 4) if core else (4, 5)
    return (1, 2) if core else (2, 1)


def scale_expl(kind, topic, dir_, core, best, ok):
    s = SCALES[SCALE_FMT[kind][0]]
    if kind == "E":
        side = "a good workplace behaviour" if dir_ > 0 else "a poor workplace behaviour"
    elif kind == "I":
        side = "a value that helps at work" if dir_ > 0 else "a value that can hurt teamwork or results"
    elif kind == "F":
        side = "a good habit" if dir_ > 0 else "an unhelpful habit"
    else:
        side = "positive" if dir_ > 0 else "reversed (it describes the opposite of a good quality)"
    if kind in ("L", "S"):
        side = f"The statement is {side}."
    else:
        side = f"This describes {side}."
    if kind in ("L", "S"):  # wording kept identical to the approved Mock 1
        strength = ("This is a core value, so answer firmly." if core
                    else "This is not a core value, so a firm but not extreme answer looks most balanced.")
    else:
        strength = ("It is clear-cut, so answer firmly." if core
                    else "It is not an extreme case, so a firm but balanced answer fits best.")
    return f"Trait: {topic}. {side} {strength} Best: {s[best - 1]} ({s[ok - 1]} is also acceptable)."


def to_question(item, rng):
    kind = item[0]
    if kind in SCALE_FMT:
        _, text, topic, dir_, core = item
        scale, fmt, pattern = SCALE_FMT[kind]
        best, ok = key(dir_, core)
        diff = "Easy" if core else ("Medium" if dir_ > 0 else "Hard")
        return dict(topic=topic, text=pattern.format(t=text), options=SCALES[scale], right=best,
                    expl=scale_expl(kind, topic, dir_, core, best, ok), diff=diff, fmt=fmt)
    if kind == "H":
        _, text, hk = item
        if hk == "lie":
            best, expl = 2, ("Honesty check: this is a 'too perfect' claim that no real person can make. "
                             "Agreeing makes a profile look unrealistic. Best: Disagree (Neutral is acceptable).")
        else:
            best, expl = 4, ("Honesty check: this is a normal human experience. Admitting it makes your profile "
                             "believable. Best: Agree (Neutral is acceptable).")
        return dict(topic="Honesty & Consistency Check", text=f'How far does this statement describe you? "{text}"',
                    options=SCALES["agree"], right=best, expl=expl, diff="Hard", fmt="Honesty check")
    if kind == "J":
        _, text, topic, opts, right, expl, diff = item
        return dict(topic=topic, text=text, options=opts, right=right, expl=expl, diff=diff,
                    fmt="Situational judgement")
    if kind == "M":
        _, fmt, topic, q, opts, expl, diff = item
        order = list(range(len(opts)))
        rng.shuffle(order)
        shuffled = [opts[i] for i in order]
        return dict(topic=topic, text=q, options=shuffled, right=order.index(0) + 1, expl=expl, diff=diff, fmt=fmt)
    if kind == "MF":
        _, fmt, topic, q, opts, right, expl, diff = item
        return dict(topic=topic, text=q, options=opts, right=right, expl=expl, diff=diff, fmt=fmt)
    raise ValueError(kind)


def fmt_of(item):
    k = item[0]
    if k in SCALE_FMT:
        return SCALE_FMT[k][1]
    if k in ("M", "MF"):
        return item[1]
    return k


def interleave(items, rng):
    """Shuffle so that, where possible, no two neighbouring questions share a format."""
    best, best_bad = items[:], 10 ** 9
    for _ in range(3000):
        cand = items[:]
        rng.shuffle(cand)
        bad = sum(fmt_of(a) == fmt_of(b) for a, b in zip(cand, cand[1:]))
        if bad < best_bad:
            best, best_bad = cand, bad
        if bad == 0:
            break
    return best


def questions(mod):
    rng = random.Random(1000 + mod.MOCK_NO)
    items = list(mod.ITEMS)
    if getattr(mod, "SHUFFLE", False):
        items = interleave(items, rng)
    return [to_question(it, rng) for it in items]


def build(template, mod_name, out):
    mod = importlib.import_module(mod_name)
    qs = questions(mod)
    d = docx.Document(template)
    body = d.element.body
    sect = body.find(docx.oxml.ns.qn("w:sectPr"))
    for el in list(body):
        if el is not sect:
            body.remove(el)
    tag = f"accenture, psychometric, behavioural, mock test {mod.MOCK_NO}"
    for n, q in enumerate(qs, 1):
        lines = ["{QUESTION BEGINS}", f"{{QUESTION NUMBER}} {n}", f"{{SUBJECT}} {SUBJECT}",
                 f"{{TOPIC}} {q['topic']}", f"{{TAGS}} {tag}, {q['fmt'].lower()}",
                 "{QUESTION TYPE} SINGLECORRECT", f"{{QUESTION TEXT}} {q['text']}", ""]
        for i in range(10):
            opt = q["options"][i] if i < len(q["options"]) else ""
            lines.append(f"{{OPTION {i + 1}}} {opt}".rstrip())
        lines += [f"{{RIGHT ANSWER}} {q['right']}", f"{{EXPLANATION}} {q['expl']}", "{CORRECT MARKS} 1",
                  "{NEGATIVE MARKS} 0", f"{{DIFFICULTY}} {q['diff']}", "{QUESTION ENDS}", "", ""]
        for line in lines:
            d.add_paragraph(line)
    d.save(out)
    return qs


if __name__ == "__main__":
    sys.path.insert(0, ".")
    qs = build(sys.argv[1], sys.argv[2], sys.argv[3])
    print(f"wrote {len(qs)} questions to {sys.argv[3]}")
