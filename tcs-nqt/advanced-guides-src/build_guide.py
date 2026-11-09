import sys,importlib,json,re,os,subprocess
import lib
from lib import *
def build(CHS,cover,about_extra,outname,footer,kicker,stats):
    """CHS: [(module,title,priority)]"""
    colr={'Must-do':'#b8860b','Important':'#2f66b3','Advanced':'#7c2d92','Final':'#14213d','Foundation':'#0f7d6b'}
    pages=json.load(open(outname+'_pages.json')) if os.path.exists(outname+'_pages.json') and len(sys.argv)>1 and sys.argv[1]=='pass2' else {}
    body=''
    for m,t,p in CHS:body+=importlib.import_module(m).html()
    nex=body.count('class="box ex"');nq=sum(len(a) for c,a in lib.KEY);nimg=len(os.listdir(IMG))
    cv=f'<div class="cover"><div><span class="tag">{cover["tag"]}</span><h1>{cover["h1"]}</h1><p class="sub">{cover["sub"]}</p></div><div><div class="cstats"><div><b>{len(CHS)}</b><span>chapters, zero to hero</span></div><div><b>{nex}</b><span>solved examples</span></div><div><b>{nq}</b><span>practice questions</span></div><div><b>{nimg}</b><span>diagrams and charts</span></div></div><div style="margin-top:12px;font-size:9pt;color:#9fb0e6;letter-spacing:1px">ONLINE LEARNING MOCK TEST SERIES · ATC DEVELOPERS</div></div></div>'
    toc=''.join(f'<div><span>{i+1}. {t}</span><span style="display:flex;align-items:center"><em style="background:{colr.get(p,"#2f66b3")}">{p}</em><b style="margin-left:8px;color:#1e2761">{pages.get(str(i+1),"")}</b></span></div>' for i,(m,t,p) in enumerate(CHS))
    about=f'<div class="pg"><h2 class="ch">About this guide</h2><div class="bar"></div><p class="lead">{cover["about"]}</p><div class="two"><div class="box intro"><h4>How each chapter is built</h4><ul style="padding-left:16px"><li><b>Idea</b> in plain words, then a diagram.</li><li><b>Formulas and rules</b> in the yellow box.</li><li><b>How the questions appear</b> in the exam.</li><li><b>Solved examples</b> with full steps.</li><li><b>Shortcuts and mistakes</b> to avoid.</li><li><b>Practice set</b> (Basic, Medium, Advanced) with answers at the end.</li></ul></div><div class="box intro"><h4>How to study</h4><ul style="padding-left:16px">{about_extra}</ul></div></div><h3>Contents</h3><div class="toc">{toc}</div><div class="box warn"><h4>Honest note</h4><ul><li>Every number in the solved examples and in the practice answers was calculated by a program while this guide was made, and puzzle answers were found by exhaustive search where possible.</li><li>TCS does not publish its question weightage. Priority labels are our preparation guidance.</li></ul></div></div>'
    col={'B':'Basic','M':'Medium','A':'Advanced'}
    key='<div class="pg"><h2 class="ch">Answer key</h2><div class="bar"></div><p class="lead">Answers to every practice set. B = Basic, M = Medium, A = Advanced.</p><div class="key">'
    for c,al in lib.KEY:key+=f'<div><b>{c}</b><br>'+'<br>'.join(f'{i+1}. {a} <span style="color:#8a93b2">({l})</span>' for i,(a,l) in enumerate(al))+'</div>'
    key+=f'</div><div class="foot">{footer}</div></div>'
    html=f'<!doctype html><html><head><meta charset="utf-8"><title>{cover["title"]}</title><style>{CSS}</style></head><body>{cv}{about}{body}{key}</body></html>'
    open(outname+'.html','w').write(html)
    open('render.js','w').write("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+process.cwd()+'/%s.html');await p.waitForTimeout(1200);await p.pdf({path:'%s.pdf',format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:'<div style=\"font-size:8px;color:#8a93b2;width:100%%;text-align:center\">%s · Page <span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></div>',margin:{top:'13mm',bottom:'14mm',left:'0',right:'0'}});await b.close()})();"%(outname,outname,footer))
    subprocess.run(['node','render.js'],check=True)
    n=int(re.search(r'Pages:\s+(\d+)',subprocess.run(['pdfinfo',outname+'.pdf'],capture_output=True,text=True).stdout).group(1))
    pg=[p for p in range(3,n+1) if kicker in subprocess.run(['pdftotext','-f',str(p),'-l',str(p),outname+'.pdf','-'],capture_output=True,text=True).stdout[:220]]
    if len(pg)==len(CHS):json.dump({str(i+1):p for i,p in enumerate(pg)},open(outname+'_pages.json','w'))
    print(outname,'pages',n,'chapters detected',len(pg),'/',len(CHS),'examples',nex,'questions',nq)
    return len(pg)==len(CHS)
