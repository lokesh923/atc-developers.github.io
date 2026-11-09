import json,re,os,base64,shutil,zipfile,sys
B=json.loads(open('../plat/pkg/bank.js').read()[len('window.BANK='):-1])
def std(sec):
    out=[]
    for q in B[sec]:
        o=dict(id=q['id'],t=q['t'],ty=q['ty'],q=q['q'],a=q['a'],e=q['e'])
        if q.get('o') is not None:o['o']=q['o']
        out.append(o)
    return out
V=dict(sc=[dict(id=q['id'],t=q['t'],q=q['q'],o=q['o'],a=q['a'],e=q['e']) for q in B['S3']],
 pr=[dict(id=p['id'],title=p['title'],p=p['p'],m=p['m'],facts=p['f']) for p in B['PR']],
 em=[dict(id=e['id'],title=e['title'],sc=e['sc'],model=e['model'],facts=e['facts']) for e in B['EM']])
coding=json.load(open('../plat/coding.json'))
DATA=dict(S1=std('S1'),S2=std('S2'),S4=std('S4'),V=V,S5=coding)
imgs=sorted(set(re.findall(r'img/([0-9a-f]+\.png)',json.dumps([DATA['S1'],DATA['S2'],DATA['S4']]))))
CFGJS='''window.ARENA_CFG={brand:"TCS NQT Practice Arena",sub:"Online Learning Team | 2027 batch",passMark:60,speed:1,
 compiler:{backends:[
  {type:"judge0",url:"https://ce.judge0.com",headers:{},langs:{c:50,cpp:54,java:62,python:71},cpuSec:5,memKB:256000},
  {type:"piston",url:"https://emkc.org/api/v2/piston",langs:{c:"c",cpp:"c++",java:"java",python:"python"}}
 ]}};
'''
cfgjs=CFGJS
datajs='window.ARENA_DATA='+json.dumps(DATA,ensure_ascii=False,separators=(',',':'))+';'
rd=lambda p:open(p).read()
G_NUM=rd('../np/gen.js')+'\n'+rd('../np/gen2.js')+'\nwindow.NG_NUM=window.NG;window.NG=undefined;\n'
G_REA=rd('../rp/gen_r.js')+'\nwindow.NG_REA=window.NG;window.NG=Object.assign({},window.NG_REA,{F:window.NG_REA.F.map(function(f){return Object.assign({},f)})});\n'
G_ADV=rd('../rp/gen_a.js')+'\nwindow.NG_ADV=window.NG;window.NG=undefined;\n'
G_V=rd('../vp/gen_sc.js')+'\n'+rd('../vp/gen_pr.js')+'\n'
logic=rd('practice.js')+'\n'+rd('verbal.js')+'\n'+rd('cd.js')+'\n'+rd('hub.js')
css=rd('arena.css')
body='<div id="app"></div><div id="lightbox" onclick="this.style.display=\'none\'"><img id="lbimg"></div>'
head='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TCS NQT Practice Arena</title>'
OUT=sys.argv[1] if len(sys.argv)>1 else 'TCS_NQT_Practice_Arena'
# single file
mp={f:'data:image/png;base64,'+base64.b64encode(open('../plat/pkg/img/'+f,'rb').read()).decode() for f in imgs}
fix="window.IMGS=%s;(function(){const fix=n=>{if(n.nodeType!==1)return;(n.tagName==='IMG'?[n]:n.querySelectorAll('img')).forEach(i=>{const s=i.getAttribute('src')||'';if(s.indexOf('img/')===0&&window.IMGS[s.slice(4)])i.setAttribute('src',window.IMGS[s.slice(4)])})};new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(fix))).observe(document.documentElement,{childList:true,subtree:true})})();"%json.dumps(mp)
parts=[cfgjs,fix,datajs,G_NUM,G_REA,G_ADV,G_V,logic]
single=head+'<style>'+css+'</style></head><body>'+body+''.join('<script>'+p.replace('</script>','<\\/script>')+'</script>\n' for p in parts)+'<script>ARENA.start();</script></body></html>'
open(OUT+'.html','w').write(single)
# scorm
d='scorm_arena';shutil.rmtree(d,ignore_errors=True);os.makedirs(d+'/img')
for f in imgs:shutil.copy('../plat/pkg/img/'+f,d+'/img/'+f)
names=[('config.js',cfgjs),('data.js',datajs),('gen_num.js',G_NUM),('gen_rea.js',G_REA),('gen_adv.js',G_ADV),('gen_verbal.js',G_V),('app.js',logic)]
for n,c in names:open(d+'/'+n,'w').write(c)
open(d+'/style.css','w').write(css)
open(d+'/index.html','w').write(head+'<link rel="stylesheet" href="style.css"></head><body>'+body+''.join(f'<script src="{n}"></script>' for n,_ in names)+'<script>ARENA.start();</script></body></html>')
files=sorted(os.path.relpath(os.path.join(r,f),d).replace(os.sep,'/') for r,_,fs in os.walk(d) for f in fs)
res=''.join(f'      <file href="{f}"/>\n' for f in files)
mf=f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="ATC_TCS_NQT_PRACTICE_ARENA" version="1.0" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="ORG_1"><organization identifier="ORG_1"><title>TCS NQT Practice Arena</title>
    <item identifier="ITEM_1" identifierref="RES_1" isvisible="true"><title>TCS NQT Practice Arena</title><adlcp:masteryscore>60</adlcp:masteryscore></item></organization></organizations>
  <resources><resource identifier="RES_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
{res}  </resource></resources>
</manifest>
'''
open(d+'/imsmanifest.xml','w').write(mf)
import xml.dom.minidom as m;m.parse(d+'/imsmanifest.xml')
z=zipfile.ZipFile(OUT+'_SCORM.zip','w',zipfile.ZIP_DEFLATED);z.write(d+'/imsmanifest.xml','imsmanifest.xml')
for f in files:z.write(os.path.join(d,f),f)
z.close()
print('images',len(imgs),'html',os.path.getsize(OUT+'.html')//1024,'KB','zip',os.path.getsize(OUT+'_SCORM.zip')//1024,'KB','files',len(files))
