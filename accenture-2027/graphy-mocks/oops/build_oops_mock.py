"""Build OOPs pseudocode mocks in Graphy Word format.

Steps: (1) compile and run each question's equivalent Java program and check that its output equals the
correct option, (2) draw the pseudocode images with ../pseudocode/render_code.js, (3) place the correct answers
evenly across options 1-4, (4) write the .docx from the Graphy template.
Usage: python3 build_oops_mock.py <mock no> <out.docx> <workdir>
"""
import importlib
import json
import os
import random
import subprocess
import sys

import docx
from docx.shared import Inches
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, "..", "pseudocode", "template8.docx")
RENDER = os.path.join(HERE, "..", "pseudocode", "render_code.js")


def verify(Q, work):
    bad = 0
    for n, q in enumerate(Q, 1):
        d = os.path.join(work, f"q{n:02d}")
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "Main.java"), "w").write(q["java"])
        subprocess.run(["javac", "Main.java"], cwd=d, check=True, capture_output=True)
        out = subprocess.run(["java", "-cp", ".", "Main"], cwd=d, capture_output=True, text=True).stdout.strip()
        ok = out == q["opts"][0]
        bad += not ok
        print(f"Q{n:2} {q['c']:32} java: {out!r:24} {'OK' if ok else 'MISMATCH, expected ' + repr(q['opts'][0])}")
        assert len(set(q["opts"])) == 4
    return bad


def main(mock_no, out, work):
    Q = importlib.import_module(f"oops_mock{mock_no}").Q
    assert verify(Q, work) == 0, "an answer does not match its Java program"
    img = os.path.join(HERE, "img", f"m{mock_no}")
    os.makedirs(img, exist_ok=True)
    spec = os.path.join(work, "lines.json")
    json.dump([{"file": f"q{n:02d}.jpg", "lines": q["lines"]} for n, q in enumerate(Q, 1)], open(spec, "w"))
    subprocess.run(["node", RENDER, spec, img], check=True)
    rng = random.Random(7000 + mock_no)
    pos = ([1, 2, 3, 4] * 3)[:len(Q)]
    rng.shuffle(pos)
    d = docx.Document(TEMPLATE)
    body = d.element.body
    sect = body.find(docx.oxml.ns.qn("w:sectPr"))
    for el in list(body):
        if el is not sect:
            body.remove(el)
    for n, (q, p) in enumerate(zip(Q, pos), 1):
        opts = q["opts"][1:]
        opts.insert(p - 1, q["opts"][0])
        tags = f"accenture, technical assessment, pseudocode, oops, {q['c'].lower()}, oops mock test {mock_no}, {q['d'].lower()}"
        for line in ["{QUESTION BEGINS}", f"{{QUESTION NUMBER}} {n}", "{SUBJECT} Technical Assessment",
                     "{TOPIC} Pseudocode - OOPs", f"{{TAGS}} {tags}", "{QUESTION TYPE} SINGLECORRECT"]:
            d.add_paragraph(line)
        par = d.add_paragraph(f"{{QUESTION TEXT}} {q['q']}")
        r = par.add_run()
        r.add_break()
        f = os.path.join(img, f"q{n:02d}.jpg")
        px = Image.open(f).width
        r.add_picture(f, width=Inches(max(3.6, min(6.0, px / 1.5 / 130))))
        if q["note"]:
            par.add_run().add_break()
            par.add_run(q["note"])
        d.add_paragraph("")
        for i in range(10):
            d.add_paragraph(f"{{OPTION {i + 1}}} {opts[i] if i < len(opts) else ''}".rstrip())
        for line in [f"{{RIGHT ANSWER}} {p}", f"{{EXPLANATION}} {q['expl']}", "{CORRECT MARKS} 1",
                     "{NEGATIVE MARKS} 0", f"{{DIFFICULTY}} {q['d']}", "{QUESTION ENDS}", "", ""]:
            d.add_paragraph(line)
    d.save(out)
    print("answers at options", pos, "-> wrote", out)


if __name__ == "__main__":
    sys.path.insert(0, HERE)
    main(int(sys.argv[1]), sys.argv[2], sys.argv[3])
