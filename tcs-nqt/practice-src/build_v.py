import json,os,shutil,zipfile
B=json.loads(open('../plat/pkg/bank.js').read()[len('window.BANK='):-1])
sc=[dict(id=q['id'],t=q['t'],q=q['q'],o=q['o'],a=q['a'],e=q['e']) for q in B['S3']]
pr=[dict(id=p['id'],title=p['title'],p=p['p'],m=p['m'],facts=p['f']) for p in B['PR']]
em=[dict(id=e['id'],title=e['title'],sc=e['sc'],model=e['model'],facts=e['facts']) for e in B['EM']]
bank='window.VBANK='+json.dumps(dict(sc=sc,pr=pr,em=em),ensure_ascii=False,separators=(',',':'))+';'
css=open('base.css').read()+open('vp.css').read();gen=open('gen_sc.js').read()+'\n'+open('gen_pr.js').read();app=open('vp.js').read()
body='<div id="app"></div><div id="lightbox" onclick="this.style.display=\'none\'"><img id="lbimg"></div>'
head='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TCS NQT Verbal Ability Practice</title>'
single=head+'<style>'+css+'</style></head><body>'+body+''.join('<script>'+p.replace('</script>','<\\/script>')+'</script>\n' for p in (bank,gen,app))+'<script>VP.start();</script></body></html>'
open('TCS_NQT_Verbal_Practice.html','w').write(single)
d='scorm';shutil.rmtree(d,ignore_errors=True);os.makedirs(d)
open(d+'/style.css','w').write(css);open(d+'/bank.js','w').write(bank);open(d+'/gen.js','w').write(gen);open(d+'/app.js','w').write(app)
open(d+'/index.html','w').write(head+'<link rel="stylesheet" href="style.css"></head><body>'+body+'<script src="bank.js"></script><script src="gen.js"></script><script src="app.js"></script><script>VP.start();</script></body></html>')
files=sorted(os.listdir(d))
res=''.join(f'      <file href="{f}"/>\n' for f in files)
mf=f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="ATC_NQT_VERBAL_PRACTICE" version="1.0" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="ORG_1"><organization identifier="ORG_1"><title>TCS NQT Verbal Ability Practice</title>
    <item identifier="ITEM_1" identifierref="RES_1" isvisible="true"><title>TCS NQT Verbal Ability Practice</title><adlcp:masteryscore>60</adlcp:masteryscore></item></organization></organizations>
  <resources><resource identifier="RES_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
{res}  </resource></resources>
</manifest>
'''
open(d+'/imsmanifest.xml','w').write(mf)
import xml.dom.minidom as m;m.parse(d+'/imsmanifest.xml')
z=zipfile.ZipFile('TCS_NQT_Verbal_Practice_SCORM.zip','w',zipfile.ZIP_DEFLATED);z.write(d+'/imsmanifest.xml','imsmanifest.xml')
for f in files:z.write(os.path.join(d,f),f)
z.close();print(len(sc),len(pr),len(em),os.path.getsize('TCS_NQT_Verbal_Practice.html')//1024,'KB')
