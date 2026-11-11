"""Assemble the SQL practice app into one self-contained index.html, the SCORM 1.2 zip and a standalone HTML.

Usage: python3 build_app.py
Needs build/questions.json (from build_sql_bank.py) and vendor/sql-wasm.js + vendor/sql-wasm.wasm (sql.js 1.10.3).
"""
import base64
import json
import os
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    p = lambda *a: os.path.join(HERE, *a)
    html = open(p("app_template.html"), encoding="utf-8").read()
    js = open(p("vendor", "sql-wasm.js"), encoding="utf-8").read()
    assert "</script" not in js.lower()
    wasm = base64.b64encode(open(p("vendor", "sql-wasm.wasm"), "rb").read()).decode()
    bank = json.load(open(p("build", "questions.json"), encoding="utf-8"))
    data = json.dumps(bank, ensure_ascii=False).replace("</", "<\\/")
    for key, val in (("/*SQLJS*/", js), ("/*WASM_B64*/", wasm), ("/*QUESTIONS_JSON*/", data)):
        assert html.count(key) == 1, key
        html = html.replace(key, val)
    open(p("SQL-Assessment-Practice.html"), "w", encoding="utf-8").write(html)
    with zipfile.ZipFile(p("SQL-Assessment-Practice-SCORM.zip"), "w", zipfile.ZIP_DEFLATED) as z:
        z.write(p("imsmanifest.xml"), "imsmanifest.xml")
        z.writestr("index.html", html)
    print("index.html", round(len(html) / 1024), "KB;", len(bank), "questions")


if __name__ == "__main__":
    main()
