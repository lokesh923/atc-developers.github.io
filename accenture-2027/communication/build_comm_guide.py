"""Build the Communication Assessment zero-to-hero guide.

Checks before building:
  * every 45-second model talk is 85-110 words (about 45 s at a calm 120-130 words per minute)
  * every model email body is at least 50 words (the exam minimum)
  * every fill-in item has exactly one blank and every error item really changes the sentence
  * every listening answer is a full sentence (ends with a full stop, at least 6 words)
Usage: python3 build_comm_guide.py <base_style.html> <out.html>
"""
import html
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from comm_data import CONVERSE, EMAILS, ERRORS, FILL, LISTEN, READ, REPEAT, TALKS  # noqa: E402

e = html.escape


def email_body(text):
    return text.split("\n\n", 1)[1].rsplit("\n\n", 1)[0]


def check():
    for t, _, a in TALKS:
        n = len(a.split())
        assert 85 <= n <= 110, (t, n)
    for t, s, b in EMAILS:
        n = len(email_body(b).split())
        assert n >= 50, (s, n)
    for s, a, _ in FILL:
        assert s.count("___") == 1, s
    for w, c, _ in ERRORS:
        assert w != c, w
    for _, q, a in LISTEN:
        assert a.endswith(".") and len(a.split()) >= 6, a
    print(f"checks passed: {len(TALKS)} talks, {len(EMAILS)} emails, {len(FILL)} fill-ins, {len(ERRORS)} corrections")


def listen_html():
    out = []
    for i, (clip, q, a) in enumerate(LISTEN, 1):
        out.append(f'<div class="lc"><div class="lh"><span class="no">A{i}</span><span class="aud">&#127911; Audio transcript</span></div>'
                   f'<p class="clip">“{e(clip)}”</p><p class="q"><b>Q:</b> {e(q)}</p>'
                   f'<p class="ans"><b>Model answer:</b> {e(a)}</p></div>')
    return '<div class="lgrid">' + "".join(out) + "</div>"


def converse_html():
    rows = "".join(f"<tr><td>{i}</td><td>{e(p)}</td><td>{e(r)}</td></tr>" for i, (p, r) in enumerate(CONVERSE, 1))
    return f'<table class="tight"><thead><tr><th style="width:4%">#</th><th style="width:38%">What you hear</th><th>A strong reply</th></tr></thead><tbody>{rows}</tbody></table>'


def read_html():
    def fmt(s):
        toks = s.split(" ")
        out = []
        for k, t in enumerate(toks):
            if t in ("/", "//"):
                out.append(f'<span class="ps">{"|" if t == "/" else "||"}</span>')
                continue
            core = re.match(r"^([A-Z][A-Z.]+)([,.]?)$", t)
            if core and len(core.group(1).replace(".", "")) > 1:
                w = core.group(1).lower()
                if k == 0:
                    w = w.capitalize()
                out.append(f"<b>{e(w)}</b>{e(core.group(2))}")
            else:
                out.append(e(t))
        return " ".join(out)
    return "<ol class=\"rl\">" + "".join(f"<li>{fmt(s)}</li>" for s in READ) + "</ol>"


def repeat_html():
    cols = {}
    for lvl, s in REPEAT:
        cols.setdefault(lvl, []).append(s)
    return '<div class="three">' + "".join(
        f'<div class="def"><b class="t">{lvl} ({len(v[0].split())}–{len(v[-1].split())}+ words)</b><ol>' +
        "".join(f"<li>{e(x)}</li>" for x in v) + "</ol></div>" for lvl, v in cols.items()) + "</div>"


def fill_html():
    q = "".join(f"<li>{e(s).replace('___', '<span class=bl>______</span>')}</li>" for s, _, _ in FILL)
    k = "".join(f"<tr><td>{i}</td><td><b>{e(a)}</b></td><td>{e(r)}</td></tr>" for i, (_, a, r) in enumerate(FILL, 1))
    return (f'<ol class="qs">{q}</ol><h3>Answer key</h3><table class="tight keyx"><thead><tr><th style="width:4%">#</th>'
            f'<th style="width:15%">Answer</th><th>Rule</th></tr></thead><tbody>{k}</tbody></table>')


def errors_html():
    q = "".join(f"<li>{e(w)}</li>" for w, _, _ in ERRORS)
    k = "".join(f"<tr><td>{i}</td><td>{e(c)}</td><td>{e(r)}</td></tr>" for i, (_, c, r) in enumerate(ERRORS, 1))
    return (f'<ol class="qs">{q}</ol><h3>Answer key</h3><table class="tight keyx"><thead><tr><th style="width:4%">#</th>'
            f'<th style="width:42%">Correct sentence</th><th>Rule</th></tr></thead><tbody>{k}</tbody></table>')


def talks_html():
    out = []
    for i, (t, outline, a) in enumerate(TALKS, 1):
        notes = "".join(f"<li>{e(x)}</li>" for x in outline)
        out.append(f'<div class="talk"><div class="lh"><span class="no">G{i}</span><b>{e(t)}</b><span class="wc">{len(a.split())} words ≈ 45 s</span></div>'
                   f'<div class="tgrid"><div class="notes"><b class="t">30-second prep notes</b><ul>{notes}</ul></div>'
                   f'<p class="model">{e(a)}</p></div></div>')
    return "".join(out)


def emails_html():
    out = []
    for i, (task, subj, body) in enumerate(EMAILS, 1):
        n = len(email_body(body).split())
        b = e(body).replace("\n\n", "</p><p>").replace("\n", "<br>")
        out.append(f'<div class="mail"><div class="lh"><span class="no">E{i}</span><span class="task">{e(task)}</span><span class="wc">{n} words</span></div>'
                   f'<div class="env"><div class="subj"><b>Subject:</b> {e(subj)}</div><p>{b}</p></div></div>')
    return '<div class="mgrid">' + "".join(out) + "</div>"


def main(base, out):
    check()
    t = open(os.path.join(HERE, "comm_template.html"), encoding="utf-8").read()
    style = open(base, encoding="utf-8").read()
    t0 = open(os.path.join(HERE, "..", "technical", "tech_0.html"), encoding="utf-8").read()
    style += "\n<style>" + t0.split("<style>")[1].split("</style>")[0] + "</style>"
    parts = {"BASE_STYLE": style, "LISTEN": listen_html(), "CONVERSE": converse_html(), "READ": read_html(),
             "REPEAT": repeat_html(), "FILL": fill_html(), "ERRORS": errors_html(), "TALKS": talks_html(),
             "EMAILS": emails_html(), "N_FILL": str(len(FILL)), "N_ERR": str(len(ERRORS)), "N_TALK": str(len(TALKS)),
             "N_MAIL": str(len(EMAILS))}
    for k, v in parts.items():
        tok = f"<!--{k}-->"
        assert tok in t, tok
        t = t.replace(tok, v)
    left = re.findall(r"<!--[A-Z_]+-->", t)
    assert not left, left
    open(out, "w", encoding="utf-8").write(t)
    print("wrote", out)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
