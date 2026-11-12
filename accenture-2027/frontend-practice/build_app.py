"""Assemble the front-end practice app into one self-contained index.html, a SCORM 1.2 zip and a standalone HTML.

Usage: python3 build_app.py
Inputs: app_template.html, questions.js, vendor/ (React 18.3.1, ReactDOM 18.3.1, Vue 3.4.38, Babel standalone 7.25.6).
"""
import json
import os
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))


def js_string(text):
    """A JS string literal that is safe inside an HTML <script> element."""
    return json.dumps(text).replace("</", "<\\/").replace("<!--", "<\\!--")


def main():
    p = lambda *a: os.path.join(HERE, *a)
    html = open(p("app_template.html"), encoding="utf-8").read()
    libs = {"LIB_REACT": "react.production.min.js", "LIB_REACTDOM": "react-dom.production.min.js",
            "LIB_VUE": "vue.global.prod.js", "LIB_BABEL": "babel.min.js"}
    for key, fn in libs.items():
        token = "/*" + key + "*/"
        assert html.count(token) == 1, key
        html = html.replace(token, js_string(open(p("vendor", fn), encoding="utf-8").read()))
    q = open(p("questions.js"), encoding="utf-8").read()
    assert "</script" not in q.lower()
    q = q.replace("<!--", "<\\!--")  # only appears inside string/template literals, where \! is just !
    assert html.count("/*QUESTIONS_JS*/") == 1
    html = html.replace("/*QUESTIONS_JS*/", q)
    open(p("Frontend-Technology-Practice.html"), "w", encoding="utf-8").write(html)
    with zipfile.ZipFile(p("Frontend-Technology-Practice-SCORM.zip"), "w", zipfile.ZIP_DEFLATED) as z:
        z.write(p("imsmanifest.xml"), "imsmanifest.xml")
        z.writestr("index.html", html)
    print("index.html", round(len(html) / 1024), "KB")


if __name__ == "__main__":
    main()
