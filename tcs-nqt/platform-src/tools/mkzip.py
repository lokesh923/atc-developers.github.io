import os,zipfile,shutil
def build(name,relaxed):
    d='build_'+name;shutil.rmtree(d,ignore_errors=True);shutil.copytree('pkg',d)
    if relaxed:
        c=open(d+'/config.js').read().replace('requireCamera:true','requireCamera:false').replace('requireMic:true','requireMic:false');open(d+'/config.js','w').write(c)
    files=[]
    for r,_,fs in os.walk(d):
        for f in fs:files.append(os.path.relpath(os.path.join(r,f),d).replace(os.sep,'/'))
    files.sort()
    res=''.join(f'      <file href="{f}"/>\n' for f in files)
    mf=f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="ATC_TCS_NQT_LIVE_TEST" version="1.0" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="ORG_1"><organization identifier="ORG_1"><title>TCS NQT 2027 Live Practice Test</title>
    <item identifier="ITEM_1" identifierref="RES_1" isvisible="true"><title>TCS NQT 2027 Live Practice Test</title><adlcp:masteryscore>60</adlcp:masteryscore></item></organization></organizations>
  <resources><resource identifier="RES_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
{res}  </resource></resources>
</manifest>
'''
    open(d+'/imsmanifest.xml','w').write(mf)
    import xml.dom.minidom as m;m.parse(d+'/imsmanifest.xml')
    z=zipfile.ZipFile(f'TCS_NQT_Live_Test_Platform_{name}.zip','w',zipfile.ZIP_DEFLATED)
    z.write(d+'/imsmanifest.xml','imsmanifest.xml')
    for f in files:z.write(os.path.join(d,f),f)
    z.close();print(name,len(files),'files',os.path.getsize(f'TCS_NQT_Live_Test_Platform_{name}.zip')//1024,'KB')
build('Strict_Camera_Required',False);build('Relaxed_Camera_Optional',True)
