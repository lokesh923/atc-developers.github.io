import json,re,os,base64,shutil,zipfile
B=json.loads(open('../plat/pkg/bank.js').read()[len('window.BANK='):-1])
S1=[dict(id=q['id'],t=q['t'],ty=q['ty'],q=q['q'],o=q.get('o'),a=q['a'],e=q['e']) for q in B['S1']]
for q in S1:
    if q['o'] is None:del q['o']
imgs=sorted(set(re.findall(r'img/([0-9a-f]+\.png)',json.dumps(S1))))
bank='window.NBANK='+json.dumps(S1,ensure_ascii=False,separators=(',',':'))+';'
css=open('np.css').read();gen=open('gen.js').read()+'\n'+open('gen2.js').read();app=open('np.js').read()
body='<div id="app"></div><div id="lightbox" onclick="this.style.display=\'none\'"><img id="lbimg"></div>'
head='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TCS NQT Numerical Ability Practice</title>'
# --- single file
mp={f:'data:image/png;base64,'+base64.b64encode(open('../plat/pkg/img/'+f,'rb').read()).decode() for f in imgs}
fix="window.IMGS=%s;(function(){const fix=n=>{if(n.nodeType!==1)return;(n.tagName==='IMG'?[n]:n.querySelectorAll('img')).forEach(i=>{const s=i.getAttribute('src')||'';if(s.indexOf('img/')===0&&window.IMGS[s.slice(4)])i.setAttribute('src',window.IMGS[s.slice(4)])})};new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(fix))).observe(document.documentElement,{childList:true,subtree:true})})();"%json.dumps(mp)
single=head+'<style>'+css+'</style></head><body>'+body+''.join('<script>'+p.replace('</script>','<\\/script>')+'</script>\n' for p in (fix,bank,gen,app))+'<script>NP.start();</script></body></html>'
open('TCS_NQT_Numerical_Practice.html','w').write(single)
# --- scorm
d='scorm';shutil.rmtree(d,ignore_errors=True);os.makedirs(d+'/img')
for f in imgs:shutil.copy('../plat/pkg/img/'+f,d+'/img/'+f)
open(d+'/style.css','w').write(css);open(d+'/bank.js','w').write(bank);open(d+'/gen.js','w').write(gen);open(d+'/np.js','w').write(app)
open(d+'/index.html','w').write(head+'<link rel="stylesheet" href="style.css"></head><body>'+body+'<script src="bank.js"></script><script src="gen.js"></script><script src="np.js"></script><script>NP.start();</script></body></html>')
files=sorted(os.path.relpath(os.path.join(r,f),d).replace(os.sep,'/') for r,_,fs in os.walk(d) for f in fs)
res=''.join(f'      <file href="{f}"/>\n' for f in files)
mf=f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="ATC_NQT_NUMERICAL_PRACTICE" version="1.0" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="ORG_1"><organization identifier="ORG_1"><title>TCS NQT Numerical Ability Practice</title>
    <item identifier="ITEM_1" identifierref="RES_1" isvisible="true"><title>TCS NQT Numerical Ability Practice</title><adlcp:masteryscore>60</adlcp:masteryscore></item></organization></organizations>
  <resources><resource identifier="RES_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
{res}  </resource></resources>
</manifest>
'''
open(d+'/imsmanifest.xml','w').write(mf)
import xml.dom.minidom as m;m.parse(d+'/imsmanifest.xml')
z=zipfile.ZipFile('TCS_NQT_Numerical_Practice_SCORM.zip','w',zipfile.ZIP_DEFLATED);z.write(d+'/imsmanifest.xml','imsmanifest.xml')
for f in files:z.write(os.path.join(d,f),f)
z.close()
print(len(S1),'bank q',len(imgs),'images',os.path.getsize('TCS_NQT_Numerical_Practice.html')//1024,'KB html',os.path.getsize('TCS_NQT_Numerical_Practice_SCORM.zip')//1024,'KB zip')
