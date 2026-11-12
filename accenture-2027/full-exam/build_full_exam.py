"""Build the full Accenture 2026-2027 exam simulation (all 5 rounds) as one HTML file + a SCORM 1.2 zip.

Rounds and the apps they use:
  1 Behavioural    ../practice/index.html                       (54 statements, 20 min)
  2 Cognitive      ../cognitive/{bubbles,pathfinding,keycollection}-practice/index.html
  3 Technical      tech_exam.html + tech_bank.py (45 MCQs in the 4 exam sections)
  4 Coding         coding_exam.html (DSA via Skulpt/Web Worker, SQL via sql.js, Front-end via the
                   front-end practice engine) - one 60-minute timer
  5 Communication  ../communication-practice/Communication-Practice.html
The shell (shell.html) runs each round in an iframe and gives it a SCORM API, so every round reports its
score to the shell; the shell reports the overall score to the real LMS.
Usage: python3 build_full_exam.py
"""
import json
import os
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, "coding"))


def rd(*p):
    return open(os.path.join(ROOT, *p), encoding="utf-8").read()


def js_string(text):
    return json.dumps(text, ensure_ascii=False).replace("</", "<\\/").replace("<!--", "<\\!--")


def fill(html, key, val):
    tok = "/*" + key + "*/"
    assert html.count(tok) == 1, key
    return html.replace(tok, val)


def segment(src, start, end):
    i = src.index(start)
    return src[i:src.index(end, i)]


def tech_html():
    from tech_bank import bank
    return fill(rd("full-exam", "tech_exam.html"), "TECH_BANK", js_string(bank())[1:-1] if False else json.dumps(bank()).replace("</", "<\\/"))


def dsa_bank():
    from coding_problems import P
    ok_path = os.path.join(HERE, "dsa_ok.json")
    ok = set(json.load(open(ok_path))) if os.path.exists(ok_path) else None
    return [{"id": p["id"], "title": p["title"], "statement": p["statement"], "fmt": p["fmt"], "tests": p["tests"],
             "py": p["py"], "approach": p["approach"]} for p in P if ok is None or p["id"] in ok]


def coding_html():
    import base64
    h = rd("full-exam", "coding_exam.html")
    sqlt, fet = rd("sql-practice", "app_template.html"), rd("frontend-practice", "app_template.html")
    sql_core = segment(sqlt, "/* ================= SQL engine", "/* ================= UI helpers")
    fe_core = segment(fet, "/* ================= stacks & document builder", "/* ================= UI helpers")
    for name, text in (("SQLJS", rd("sql-practice", "vendor", "sql-wasm.js")), ("SKULPT", rd("full-exam", "vendor", "skulpt.min.js")),
                       ("SKULPT_STDLIB", rd("full-exam", "vendor", "skulpt-stdlib.js")), ("SQL_CORE", sql_core), ("FE_CORE", fe_core),
                       ("FE_BANK", rd("frontend-practice", "questions.js").replace("<!--", "<\\!--"))):
        assert "</script" not in text.lower(), name
        h = fill(h, name, text)
    h = fill(h, "WASM_B64", base64.b64encode(open(os.path.join(ROOT, "sql-practice", "vendor", "sql-wasm.wasm"), "rb").read()).decode())
    for key, fn in (("LIB_REACT", "react.production.min.js"), ("LIB_REACTDOM", "react-dom.production.min.js"),
                    ("LIB_VUE", "vue.global.prod.js"), ("LIB_BABEL", "babel.min.js")):
        h = fill(h, key, js_string(rd("frontend-practice", "vendor", fn)))
    h = fill(h, "SQL_BANK", json.dumps(json.load(open(os.path.join(ROOT, "sql-practice", "build", "questions.json")))).replace("</", "<\\/"))
    h = fill(h, "DSA_BANK", json.dumps(dsa_bank()).replace("</", "<\\/"))
    return h


def main():
    apps = {
        "behavioural": rd("practice", "index.html"),
        "bubbles": rd("cognitive", "bubbles-practice", "index.html"),
        "pathfinding": rd("cognitive", "pathfinding-practice", "index.html"),
        "keys": rd("cognitive", "keycollection-practice", "index.html"),
        "technical": tech_html(),
        "coding": coding_html(),
        "communication": rd("communication-practice", "Communication-Practice.html"),
    }
    os.makedirs(os.path.join(HERE, "build"), exist_ok=True)
    for k in ("technical", "coding"):  # handy for testing a round on its own
        open(os.path.join(HERE, "build", k + ".html"), "w", encoding="utf-8").write(apps[k])
    shell = fill(rd("full-exam", "shell.html"), "APPS_JSON", js_string(apps)[0:0] + json.dumps(apps, ensure_ascii=False).replace("</", "<\\/").replace("<!--", "<\\!--"))
    out = os.path.join(HERE, "Accenture-Full-Exam-Simulation.html")
    open(out, "w", encoding="utf-8").write(shell)
    with zipfile.ZipFile(os.path.join(HERE, "Accenture-Full-Exam-Simulation-SCORM.zip"), "w", zipfile.ZIP_DEFLATED) as z:
        z.write(os.path.join(HERE, "imsmanifest.xml"), "imsmanifest.xml")
        z.writestr("index.html", shell)
    print({k: f"{round(len(v) / 1024)} KB" for k, v in apps.items()}, "shell", round(len(shell) / 1024 / 1024, 1), "MB")


if __name__ == "__main__":
    main()
