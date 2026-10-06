// Builds a single-file HTML and a SCORM 1.2 zip of infosys-interview into the given output directory.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const src = path.join(__dirname, '..', 'infosys-interview'), out = process.argv[2] || path.join(__dirname, '..', 'dist-interview');
fs.mkdirSync(out, { recursive: true });
let html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
html = html.replace(/<link rel="stylesheet" href="style.css">/, () => '<style>' + fs.readFileSync(path.join(src, 'style.css'), 'utf8') + '</style>');
html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, f) => '<script>' + fs.readFileSync(path.join(src, f), 'utf8').replace(/<\/script>/g, '<\\/script>') + '</script>');
const shim = '<script>(function(){function f(w){for(var i=0;i<8&&w;i++){if(w.API)return w.API;if(w===w.parent)break;w=w.parent}return null}var a=f(window)||(window.opener&&f(window.opener));if(!a)return;try{a.LMSInitialize("");a.LMSSetValue("cmi.core.lesson_status","completed");a.LMSCommit("")}catch(e){}window.addEventListener("beforeunload",function(){try{a.LMSFinish("")}catch(e){}})})();</script>';
const single = path.join(out, 'Infosys_SE_Interview_Prep_standalone.html'); fs.writeFileSync(single, html);
const sc = path.join(out, 'scorm'); fs.rmSync(sc, { recursive: true, force: true }); fs.mkdirSync(sc);
fs.writeFileSync(path.join(sc, 'index.html'), html.replace('</body>', shim + '</body>'));
fs.writeFileSync(path.join(sc, 'imsmanifest.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="infosys-se-interview-prep" version="1" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="org1"><organization identifier="org1"><title>Infosys SE Interview Prep</title>
    <item identifier="i1" identifierref="r1"><title>Infosys SE Interview Prep</title></item></organization></organizations>
  <resources><resource identifier="r1" type="webcontent" adlcp:scormtype="sco" href="index.html"><file href="index.html"/></resource></resources>
</manifest>`);
const zip = path.join(out, 'Infosys_SE_Interview_Prep_SCORM.zip'); fs.rmSync(zip, { force: true });
cp.execSync(`cd "${sc}" && zip -q -r "${zip}" index.html imsmanifest.xml`);
console.log(single, fs.statSync(single).size, zip, fs.statSync(zip).size);
