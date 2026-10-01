# Finds superscript spans in a guide PDF so the parser can restore x², aⁿ etc. that pdftotext flattens.
# Usage: python3 tools/sup.py file.pdf  ->  JSON list of {with, without, marked}
import sys, json, pymupdf
SUP = {**{str(i): c for i, c in enumerate('⁰¹²³⁴⁵⁶⁷⁸⁹')}, 'n': 'ⁿ', '-': '⁻', '+': '⁺', 'x': 'ˣ'}
def sup(t): return ''.join(SUP.get(c, c) for c in t)
out = {}
for page in pymupdf.open(sys.argv[1]):
    for b in page.get_text('dict')['blocks']:
        for l in b.get('lines', []):
            sp = l['spans']
            if not any((s['flags'] & 1) for s in sp): continue
            w = ''.join(s['text'] for s in sp)
            wo = ''.join(s['text'] for s in sp if not (s['flags'] & 1))
            m = ''.join(sup(s['text']) if (s['flags'] & 1) else s['text'] for s in sp)
            out[(w, wo)] = m
print(json.dumps([{'with': k[0], 'without': k[1], 'marked': v} for k, v in out.items()]))
