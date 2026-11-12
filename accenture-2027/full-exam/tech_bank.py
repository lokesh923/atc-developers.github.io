"""Collect the Technical Assessment question bank (all four sections) from the mock builders.

Sections (names as on the exam's section summary):
  1. Common Applications and MS Office        7  (msoffice MOCK_1)
  2. Pseudo Code                              10 per attempt, drawn from pseudocode mocks 1-5
                                                 (mocks 1-3 are actual exam questions) + OOPs mock 1
  3. Fundamentals of Networking, Security and Cloud  14 (network MOCK_1)
  4. Computer Science                         14 (csf MOCK_1)
Images are recompressed and embedded as data URIs.
"""
import base64
import io
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
GM = os.path.join(HERE, "..", "graphy-mocks")
for sub in ("msoffice", "pseudocode", "network", "csf", "oops"):
    sys.path.insert(0, os.path.join(GM, sub))


def img_uri(path, max_w=980, q=62):
    im = Image.open(path).convert("RGB")
    if im.width > max_w:
        im = im.resize((max_w, int(im.height * max_w / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=q, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def html_text(t):
    return t.replace("\n", "<br>")


def bank():
    import build_office_mock as office
    import build_pseudo_mock as pseudo
    import build_network_mock as net
    import build_csf_mock as csf
    import oops_mock1

    out = {"office": [], "pseudo": [], "oops": [], "network": [], "csf": []}
    for n, (app, text, img, w, opts, right, expl, diff) in enumerate(office.MOCK_1, 1):
        out["office"].append({"text": text, "img": img_uri(os.path.join(GM, "msoffice", "img", "m1", img)) if img else None,
                              "opts": opts, "right": right - 1, "expl": expl, "topic": app})
    for m in range(1, 6):
        for n, (text, note, w, opts, right, expl, diff) in enumerate(pseudo.MOCKS[m], 1):
            out["pseudo"].append({"text": text, "note": note, "opts": opts, "right": right - 1, "expl": expl,
                                  "img": img_uri(os.path.join(GM, "pseudocode", "img", f"m{m}", f"q{n:02d}.jpg")),
                                  "actual": m <= 3, "topic": "Pseudocode"})
    for n, q in enumerate(oops_mock1.Q, 1):
        out["oops"].append({"text": q["q"], "note": q["note"], "opts": q["opts"], "right": 0, "expl": q["expl"],
                            "img": img_uri(os.path.join(GM, "oops", "img", "m1", f"q{n:02d}.jpg")), "topic": "OOPs: " + q["c"]})
    for topic, fmt, text, opts, right, expl, diff in net.MOCK_1:
        out["network"].append({"text": text, "opts": opts, "right": right - 1, "expl": expl, "topic": topic})
    for n, (topic, fmt, text, code, opts, right, expl, diff, chk) in enumerate(csf.MOCK_1, 1):
        out["csf"].append({"text": text, "opts": opts, "right": right - 1, "expl": expl, "topic": topic,
                           "img": img_uri(os.path.join(GM, "csf", "img", "m1", f"q{n:02d}.jpg")) if code else None})
    return out


if __name__ == "__main__":
    import json
    b = bank()
    s = json.dumps(b)
    print({k: len(v) for k, v in b.items()}, round(len(s) / 1024), "KB")
