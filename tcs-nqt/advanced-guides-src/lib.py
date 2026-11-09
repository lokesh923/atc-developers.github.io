import base64,io,os,math,itertools,random
import matplotlib;matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle,Circle,Polygon,FancyArrowPatch,Wedge,Ellipse,FancyBboxPatch
import numpy as np
D=os.path.dirname(os.path.abspath(__file__));IMG=D+"/img/"
CSS=open(D+'/base.css').read()+"""
.fi{width:100%;height:auto;display:block;margin:0 auto}.fig.half{width:49%;display:inline-block;vertical-align:top}
.sm{font-size:9pt}.cen{text-align:center}.hl{background:#fff3bf;padding:0 3px;border-radius:3px}
.k{display:inline-block;background:#1e2761;color:#fff;border-radius:6px;padding:0 7px;font-weight:700;font-size:8.5pt}
.step{background:#f8fafc;border-left:4px solid #3b4cca;border-radius:8px;padding:6px 10px;margin:5px 0}
.two3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.tb.sm td,.tb.sm th{font-size:8.6pt;padding:2px 6px}
.ans td{font-size:8.6pt}
"""
COL=dict(blue='#1f4b9e',red='#be123c',green='#0f7d6b',gold='#b45309',purple='#6d28d9',ink='#14213d')
def save(fig,name,dpi=170):
    p=IMG+name+'.png';fig.savefig(p,dpi=dpi,bbox_inches='tight',facecolor='white',pad_inches=0.06);plt.close(fig);return p
def b64(p):return 'data:image/png;base64,'+base64.b64encode(open(p,'rb').read()).decode()
def fig(name,cap,w='100%'):
    return f'<div class="fig" style="width:{w};margin-left:auto;margin-right:auto"><img class="fi" src="{b64(IMG+name+".png")}"><div class="cap">{cap}</div></div>'
def figs2(a,ca,b,cb):
    return f'<div class="two"><div class="fig"><img class="fi" src="{b64(IMG+a+".png")}"><div class="cap">{ca}</div></div><div class="fig"><img class="fi" src="{b64(IMG+b+".png")}"><div class="cap">{cb}</div></div></div>'
NO=[0]
def top(title,kicker,color,no=None):
    NO[0]+=1;n=no or NO[0]
    return f'<div class="pg"><div class="tophead" style="background:{color}"><div class="no">{n:02d}</div><div><small>{kicker}</small><h2>{title}</h2></div></div>'
def intro(t):return f'<div class="box intro">{t}</div>'
def h3(t):return f'<h3>{t}</h3>'
def h4(t,c='#1f4b9e'):return f'<h4 style="color:{c}">{t}</h4>'
def p(t):return f'<p style="margin:4px 0">{t}</p>'
def form(title,items):return f'<div class="box form"><h4>{title}</h4><ul>'+''.join(f'<li>{i}</li>' for i in items)+'</ul></div>'
def ex(q,a,s):return f'<div class="box ex"><div class="q">{q}</div><div class="a">{a}</div><div class="s">{s}</div></div>'
def tips(items,title='Shortcuts and tricks'):return f'<div class="box tips"><h4>{title}</h4><ul>'+''.join(f'<li>{i}</li>' for i in items)+'</ul></div>'
def warn(items,title='Common mistakes'):return f'<div class="box warn"><h4>{title}</h4><ul>'+''.join(f'<li>{i}</li>' for i in items)+'</ul></div>'
def two(a,b):return f'<div class="two"><div>{a}</div><div>{b}</div></div>'
def tb(head,rows,cls=''):
    return f'<table class="tb {cls}"><tr>'+''.join(f'<th>{h}</th>' for h in head)+'</tr>'+''.join('<tr>'+''.join(f'<td>{c}</td>' for c in r)+'</tr>' for r in rows)+'</table>'
def step(t):return f'<div class="step">{t}</div>'
KEY=[]   # (chapter, [answers])
def pq(chapter,title,items):
    """items: list of (question, answer, level)"""
    KEY.append((chapter,[(a,l) for q,a,l in items]))
    col={'B':'#0f7d6b','M':'#b45309','A':'#be123c'};nm={'B':'Basic','M':'Medium','A':'Advanced'}
    rows=''.join(f'<div class="row"><span class="n">{i+1}.</span><span>{q}</span><span class="lv" style="margin-left:auto;background:{col[l]};color:#fff;padding:1px 7px;border-radius:8px;white-space:nowrap">{nm[l]}</span></div>' for i,(q,a,l) in enumerate(items))
    return f'<div class="pq"><h4>Practice set: {title}</h4>{rows}</div>'
def end():return '</div>'
# ---- extra helpers shared by the three advanced guides
def boxes(ax,items,x0,y0,w,h,gap,fs=9.5,vertical=False):
    for i,(t,c) in enumerate(items):
        x=x0+i*(w+gap) if not vertical else x0;y=y0 if not vertical else y0-i*(h+gap)
        ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle='round,pad=0.02,rounding_size=0.12',fc=c,ec='#14213d',lw=1.2))
        ax.text(x+w/2,y+h/2,t,ha='center',va='center',fontsize=fs,fontweight='bold')
def arrow(ax,a,b,c='#14213d'):ax.annotate('',xy=b,xytext=a,arrowprops=dict(arrowstyle='-|>',color=c,lw=1.5))
def tablefig(name,header,rows,widths,fs=9.2,hc='#1e2761',rowh=0.62,colors=None,title=None,figw=9.2):
    n=len(rows)+1;Hh=n*rowh+(0.7 if title else 0.1)
    f,ax=plt.subplots(figsize=(figw,Hh*0.55+0.2));ax.axis('off');tot=sum(widths);ax.set_xlim(0,tot);ax.set_ylim(0,Hh)
    y=Hh-(0.7 if title else 0.05)
    if title:ax.text(tot/2,Hh-0.3,title,ha='center',fontsize=11,fontweight='bold',color='#14213d')
    x=0
    for h,w in zip(header,widths):
        ax.add_patch(Rectangle((x,y-rowh),w,rowh,fc=hc,ec='white'));ax.text(x+w/2,y-rowh/2,h,ha='center',va='center',fontsize=fs,fontweight='bold',color='white');x+=w
    for r,row in enumerate(rows):
        y-=rowh;x=0
        for c,(t,w) in enumerate(zip(row,widths)):
            fc=(colors[r][c] if colors and colors[r][c] else ('#f6f8fd' if r%2 else 'white'))
            ax.add_patch(Rectangle((x,y-rowh),w,rowh,fc=fc,ec='#d5dbea'));ax.text(x+w/2,y-rowh/2,t,ha='center',va='center',fontsize=fs,color='#14213d',fontweight='bold' if c==0 else 'normal');x+=w
    save(f,name)
def flow(name,steps,title=None,colors=None,figw=9.2,fs=9.4,h=1.2):
    n=len(steps);f,ax=plt.subplots(figsize=(figw,1.3+(0.5 if title else 0)));ax.axis('off');ax.set_xlim(0,13);ax.set_ylim(0,2.2 if title else 1.7)
    w=(12.4-0.5*(n-1))/n;cols=colors or ['#dbeafe','#fde68a','#dcfce7','#fecaca','#e9d5ff','#fed7aa']
    y=0.25
    for i,t in enumerate(steps):
        x=0.3+i*(w+0.5);ax.add_patch(FancyBboxPatch((x,y),w,1.2,boxstyle='round,pad=0.03,rounding_size=0.15',fc=cols[i%len(cols)],ec='#14213d',lw=1.2));ax.text(x+w/2,y+0.6,t,ha='center',va='center',fontsize=fs,fontweight='bold')
        if i<n-1:arrow(ax,(x+w,y+0.6),(x+w+0.5,y+0.6))
    if title:ax.text(6.5,1.9,title,ha='center',fontsize=11,fontweight='bold')
    save(f,name)
def mathcard(name,lines,title,figw=9.2,fs=11,colw=2):
    """lines: list of mathtext strings, laid out in `colw` columns"""
    rows=(len(lines)+colw-1)//colw;f,ax=plt.subplots(figsize=(figw,0.55*rows+0.8));ax.axis('off');ax.set_xlim(0,colw*10);ax.set_ylim(0,rows+0.9)
    ax.text(colw*5,rows+0.45,title,ha='center',fontsize=11.5,fontweight='bold')
    for i,l in enumerate(lines):
        c=i%colw;r=i//colw;ax.text(c*10+0.3,rows-r-0.15,l,fontsize=fs,va='center')
    save(f,name)
def code(src,lang=''):
    import html as _h
    return f'<div class="code">{_h.escape(src.strip())}</div>'
def sbs(a,b):return f'<div class="two"><div>{a}</div><div>{b}</div></div>'
