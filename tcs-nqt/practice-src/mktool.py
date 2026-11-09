import json,re,os,base64,shutil,zipfile,sys
def build(slug,title,gens,sec,pcfg,outname,ident):
    B=json.loads(open('../plat/pkg/bank.js').read()[len('window.BANK='):-1])
    S=[dict(id=q['id'],t=q['t'],ty=q['ty'],q=q['q'],o=q.get('o'),a=q['a'],e=q['e']) for q in B[sec]]
    for q in S:
        if q['o'] is None:del q['o']
    imgs=sorted(set(re.findall(r'img/([0-9a-f]+\.png)',json.dumps(S))))
    bank='window.NBANK='+json.dumps(S,ensure_ascii=False,separators=(',',':'))+';'
    css=open('../np/np.css').read();gen='\n'.join(open(g).read() for g in gens);app=open('eng.js').read()
    cfg='window.PCFG='+json.dumps(pcfg)+';'
    body='<div id="app"></div><div id="lightbox" onclick="this.style.display=\'none\'"><img id="lbimg"></div>'
    head=f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TCS NQT {title} Practice</title>'
    mp={f:'data:image/png;base64,'+base64.b64encode(open('../plat/pkg/img/'+f,'rb').read()).decode() for f in imgs}
    fix="window.IMGS=%s;(function(){const fix=n=>{if(n.nodeType!==1)return;(n.tagName==='IMG'?[n]:n.querySelectorAll('img')).forEach(i=>{const s=i.getAttribute('src')||'';if(s.indexOf('img/')===0&&window.IMGS[s.slice(4)])i.setAttribute('src',window.IMGS[s.slice(4)])})};new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(fix))).observe(document.documentElement,{childList:true,subtree:true})})();"%json.dumps(mp)
    single=head+'<style>'+css+'</style></head><body>'+body+''.join('<script>'+p.replace('</script>','<\\/script>')+'</script>\n' for p in (cfg,fix,bank,gen,app))+'<script>NP.start();</script></body></html>'
    open(outname+'.html','w').write(single)
    d='scorm_'+slug;shutil.rmtree(d,ignore_errors=True);os.makedirs(d+'/img')
    for f in imgs:shutil.copy('../plat/pkg/img/'+f,d+'/img/'+f)
    open(d+'/style.css','w').write(css);open(d+'/cfg.js','w').write(cfg);open(d+'/bank.js','w').write(bank);open(d+'/gen.js','w').write(gen);open(d+'/app.js','w').write(app)
    open(d+'/index.html','w').write(head+'<link rel="stylesheet" href="style.css"></head><body>'+body+'<script src="cfg.js"></script><script src="bank.js"></script><script src="gen.js"></script><script src="app.js"></script><script>NP.start();</script></body></html>')
    files=sorted(os.path.relpath(os.path.join(r,f),d).replace(os.sep,'/') for r,_,fs in os.walk(d) for f in fs)
    res=''.join(f'      <file href="{f}"/>\n' for f in files)
    mf=f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="{ident}" version="1.0" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="ORG_1"><organization identifier="ORG_1"><title>TCS NQT {title} Practice</title>
    <item identifier="ITEM_1" identifierref="RES_1" isvisible="true"><title>TCS NQT {title} Practice</title><adlcp:masteryscore>60</adlcp:masteryscore></item></organization></organizations>
  <resources><resource identifier="RES_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
{res}  </resource></resources>
</manifest>
'''
    open(d+'/imsmanifest.xml','w').write(mf)
    import xml.dom.minidom as m;m.parse(d+'/imsmanifest.xml')
    z=zipfile.ZipFile(outname+'_SCORM.zip','w',zipfile.ZIP_DEFLATED);z.write(d+'/imsmanifest.xml','imsmanifest.xml')
    for f in files:z.write(os.path.join(d,f),f)
    z.close();print(slug,len(S),'bank q',len(imgs),'images',os.path.getsize(outname+'.html')//1024,'KB html',os.path.getsize(outname+'_SCORM.zip')//1024,'KB zip')
if __name__=='__main__':
    build('reasoning','Reasoning Ability',['gen_r.js'],'S2',{'title':'Reasoning Ability','n':20,'min':25,'gen':14,'bimg':4,'bany':2,'limit':75,'prefix':'rp_','tag':'REAS','pass':60},'TCS_NQT_Reasoning_Practice','ATC_NQT_REASONING_PRACTICE')
