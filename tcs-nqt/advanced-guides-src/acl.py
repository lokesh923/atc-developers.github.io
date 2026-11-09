from lib import *
import html as _h
from acrun import run
LN={'python':'Python 3','cpp':'C++17','c':'C','java':'Java'}
LC={'python':'#2563eb','cpp':'#7c3aed','c':'#0f7d6b','java':'#b45309'}
def cb(lang,src,inp='',expected=None,show_in=True):
    out=run(lang,src.strip('\n'),inp)
    if expected is not None:assert out==str(expected).strip(),(lang,out,expected)
    tag=f'<span class="k" style="background:{LC[lang]}">{LN[lang]}</span>'
    io=''
    if inp!='' and show_in:io+=f'<div class="sm" style="margin:2px 0"><b>Input</b></div><div class="code" style="background:#1e293b">{_h.escape(inp.strip())}</div>'
    io+=f'<div class="sm" style="margin:2px 0"><b>Output</b> (run and checked)</div><div class="code" style="background:#064e3b">{_h.escape(out)}</div>'
    return f'<div style="break-inside:avoid">{tag}{code(src)}{io}</div>',out
def cbp(lang,src,inp='',expected=None,**k):return cb(lang,src,inp,expected,**k)[0]
