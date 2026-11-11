"""Build a Graphy-format Word quiz (.docx) for a behavioural mock test.

Usage: python3 build_mock.py <template.docx> <mock_module> <out.docx>
The template's styles and page settings are kept; its sample content is replaced.
"""
import copy
import importlib
import sys

import docx

SCALE = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
SUBJECT = "Behavioural Assessment"


def likert_key(kind, dir_, core):
    """Return (best option 1-5, acceptable option 1-5)."""
    if kind == "lie":
        return 2, 3
    if kind == "norm":
        return 4, 3
    if dir_ > 0:
        return (5, 4) if core else (4, 5)
    return (1, 2) if core else (2, 1)


def likert_explanation(kind, trait, dir_, core, best, ok):
    if kind == "lie":
        return ("Honesty check: this is a 'too perfect' claim that no real person can make. "
                "Agreeing makes a profile look unrealistic. Best: Disagree (Neutral is acceptable).")
    if kind == "norm":
        return ("Honesty check: this is a normal human experience. Admitting it makes your profile believable. "
                "Best: Agree (Neutral is acceptable).")
    side = "positive" if dir_ > 0 else "reversed (it describes the opposite of a good quality)"
    strength = ("This is a core value, so answer firmly." if core
                else "This is not a core value, so a firm but not extreme answer looks most balanced.")
    return (f"Trait: {trait}. The statement is {side}. {strength} "
            f"Best: {SCALE[best - 1]} ({SCALE[ok - 1]} is also acceptable).")


def to_question(item):
    kind = item[0]
    if kind in ("L", "S"):
        _, text, trait, dir_, core = item
        best, ok = likert_key("trait", dir_, core)
        prefix = ("How far does this statement describe you? " if kind == "L"
                  else "Rate how likely you are to act this way: ")
        diff = "Easy" if core else ("Medium" if dir_ > 0 else "Hard")
        return dict(topic=trait, text=prefix + f'"{text}"', options=SCALE, right=best,
                    expl=likert_explanation("trait", trait, dir_, core, best, ok), diff=diff,
                    fmt="Self-rating statement" if kind == "L" else "Situational statement")
    if kind == "H":
        _, text, hk = item
        best, ok = likert_key(hk, 0, 0)
        return dict(topic="Honesty & Consistency Check",
                    text=f'How far does this statement describe you? "{text}"', options=SCALE, right=best,
                    expl=likert_explanation(hk, None, 0, 0, best, ok), diff="Hard", fmt="Honesty check")
    if kind == "J":
        _, text, trait, opts, right, expl, diff = item
        return dict(topic=trait, text=text, options=opts, right=right, expl=expl, diff=diff,
                    fmt="Situational judgement")
    raise ValueError(kind)


def build(template, mod_name, out):
    mod = importlib.import_module(mod_name)
    d = docx.Document(template)
    body = d.element.body
    sect = body.find(docx.oxml.ns.qn("w:sectPr"))
    for el in list(body):
        if el is not sect:
            body.remove(el)

    def para(text=""):
        p = d.add_paragraph(text)
        return p

    tag = f"accenture, psychometric, behavioural, mock test {mod.MOCK_NO}"
    for n, item in enumerate(mod.ITEMS, 1):
        q = to_question(item)
        para("{QUESTION BEGINS}")
        para(f"{{QUESTION NUMBER}} {n}")
        para(f"{{SUBJECT}} {SUBJECT}")
        para(f"{{TOPIC}} {q['topic']}")
        para(f"{{TAGS}} {tag}, {q['fmt'].lower()}")
        para("{QUESTION TYPE} SINGLECORRECT")
        para(f"{{QUESTION TEXT}} {q['text']}")
        para("")
        for i in range(10):
            opt = q["options"][i] if i < len(q["options"]) else ""
            para(f"{{OPTION {i + 1}}} {opt}".rstrip())
        para(f"{{RIGHT ANSWER}} {q['right']}")
        para(f"{{EXPLANATION}} {q['expl']}")
        para("{CORRECT MARKS} 1")
        para("{NEGATIVE MARKS} 0")
        para(f"{{DIFFICULTY}} {q['diff']}")
        para("{QUESTION ENDS}")
        para("")
        para("")
    d.save(out)
    return mod.ITEMS


if __name__ == "__main__":
    sys.path.insert(0, ".")
    items = build(sys.argv[1], sys.argv[2], sys.argv[3])
    print(f"wrote {len(items)} questions to {sys.argv[3]}")
