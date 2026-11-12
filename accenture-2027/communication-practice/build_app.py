"""Assemble the Communication live practice into one self-contained HTML (standalone) and a SCORM 1.2 zip.

Question bank = ../communication/comm_data.py (same items as the guide) + practice_data.py.
Usage: python3 build_app.py
"""
import json
import os
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "communication"))
sys.path.insert(0, HERE)
from comm_data import CONVERSE, EMAILS, ERRORS, FILL, LISTEN, REPEAT, TALKS  # noqa: E402
from practice_data import EXTRA_TOPICS, READ_PLAIN  # noqa: E402


def bank():
    def body(text):
        return text
    return {
        "listen": [{"clip": c, "q": q, "model": a} for c, q, a in LISTEN],
        "converse": [{"prompt": p, "model": r} for p, r in CONVERSE],
        "read": [{"text": t} for t in READ_PLAIN],
        "repeat": [{"text": t, "level": lv} for lv, t in REPEAT],
        "fill": [{"text": s, "answer": a, "full": s.replace("___", a), "rule": r} for s, a, r in FILL],
        "errors": [{"wrong": w, "correct": c, "rule": r} for w, c, r in ERRORS],
        "talks": [{"topic": t, "notes": o, "model": a} for t, o, a in TALKS] + [{"topic": t} for t in EXTRA_TOPICS],
        "emails": [{"task": t, "subject": s, "model": body(b)} for t, s, b in EMAILS],
    }


def main():
    b = bank()
    html = open(os.path.join(HERE, "app_template.html"), encoding="utf-8").read()
    data = json.dumps(b, ensure_ascii=False).replace("</", "<\\/").replace("<!--", "<\\!--")
    assert html.count("/*BANK_JSON*/") == 1
    html = html.replace("/*BANK_JSON*/", data)
    open(os.path.join(HERE, "Communication-Practice.html"), "w", encoding="utf-8").write(html)
    with zipfile.ZipFile(os.path.join(HERE, "Communication-Practice-SCORM.zip"), "w", zipfile.ZIP_DEFLATED) as z:
        z.write(os.path.join(HERE, "imsmanifest.xml"), "imsmanifest.xml")
        z.writestr("index.html", html)
    print("items:", {k: len(v) for k, v in b.items()}, "size", round(len(html) / 1024), "KB")


if __name__ == "__main__":
    main()
