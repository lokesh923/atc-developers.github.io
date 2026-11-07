import docx,glob,hashlib,json,os,re
G='/home/user/atc-developers.github.io/tcs-nqt/graphy/'
os.makedirs('pkg/img',exist_ok=True)
NS={'a':'http://schemas.openxmlformats.org/drawingml/2006/main','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
def para_parts(d,p):
    """return list of ('t',text) / ('i',filename)"""
    out=[]
    for r in p.runs:
        for rid in r._element.xpath('.//a:blip/@r:embed'):
            blob=d.part.related_parts[rid].blob;h=hashlib.md5(blob).hexdigest()[:12];fn=f'img/{h}.png'
            if not os.path.exists('pkg/'+fn):open('pkg/'+fn,'wb').write(blob)
            out.append(('i',fn))
        if r.text:out.append(('t',r.text))
    return out
def parse(f):
    d=docx.Document(f);qs=[];cur=None;field=None
    for p in d.paragraphs:
        t=p.text;parts=para_parts(d,p)
        m=re.match(r'\{([A-Z0-9 ]+?)\}\s?(.*)',t,re.S)
        if m:
            tag=m.group(1)
            if tag=='QUESTION BEGINS':cur=dict(topic='',type='',text=[],opts={},ans='',expl=[],file=os.path.basename(f));field=None;continue
            if tag=='QUESTION ENDS':qs.append(cur);cur=None;continue
            if cur is None:continue
            rest=m.group(2)
            if tag=='TOPIC':cur['topic']=rest;field=None
            elif tag=='QUESTION TYPE':cur['type']=rest.strip();field=None
            elif tag=='QUESTION TEXT':field='text';cur['text']=[]
            elif tag.startswith('OPTION'):
                n=int(tag.split()[1]);cur['opts'][n]=[];field=('opt',n)
            elif tag=='RIGHT ANSWER':cur['ans']=rest.strip();field=None
            elif tag=='EXPLANATION':field='expl';cur['expl']=[]
            else:field=None
            # inline content after the tag
            first=[x for x in parts if not (x[0]=='t')]
            if field=='text':
                if rest:cur['text'].append(('t',rest))
                cur['text']+=[x for x in parts if x[0]=='i']
            elif isinstance(field,tuple):
                if rest:cur['opts'][field[1]].append(('t',rest))
                cur['opts'][field[1]]+=[x for x in parts if x[0]=='i']
            elif field=='expl':
                if rest:cur['expl'].append(('t',rest))
                cur['expl']+=[x for x in parts if x[0]=='i']
        elif cur is not None and field:
            if field=='text':cur['text'].append(('n',''));cur['text']+=parts
            elif field=='expl':cur['expl'].append(('n',''));cur['expl']+=parts
            elif isinstance(field,tuple):cur['opts'][field[1]].append(('n',''));cur['opts'][field[1]]+=parts
    return qs
def html(parts):
    h=''
    for k,v in parts:
        if k=='t':h+=v.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
        elif k=='n':h+='<br>'
        else:h+=f'<img src="{v}">'
    return h.strip()
SECT={'S1':['Numerical_Mock'],'S2':['Reasoning_'],'S4':['Advanced_Quant','Advanced_Reasoning'],'S3':['Verbal_Mock']}
def sect(fn):
    if 'Advanced_Quant' in fn or 'Advanced_Reasoning' in fn:return 'S4'
    if 'Numerical_Mock' in fn:return 'S1'
    if 'Reasoning' in fn:return 'S2'
    if 'Verbal_Mock' in fn:return 'S3'
bank={'S1':[],'S2':[],'S3':[],'S4':[]};seen=set()
for f in sorted(glob.glob(G+'*.docx')):
    fn=os.path.basename(f)
    if 'Email' in fn:continue
    s=sect(fn)
    if not s:print('skip',fn);continue
    for q in parse(f):
        txt=html(q['text']);key=re.sub(r'\W+','',re.sub(r'<[^>]+>','',txt)).lower()+''.join(re.findall(r'img/(\w+)',txt))
        if key in seen:continue
        seen.add(key)
        typ=q['type'];
        o=[html(q['opts'][i]) for i in sorted(q['opts']) if html(q['opts'][i])]
        item=dict(s=s,topic=q['topic'],type='mcq' if typ=='SINGLECORRECT' else 'num' if typ=='NUMERICAL' else 'fill',q=txt,exp=html(q['expl']),src=fn)
        if item['type']=='mcq':
            item['o']=o;item['a']=int(q['ans'])-1
            if not(0<=item['a']<len(o)):print('bad ans',fn,q['ans']);continue
        else:item['a']=q['ans']
        bank[item['s']].append(item)
for s,v in bank.items():print(s,len(v),sum(1 for x in v if '<img' in x['q']),sum(1 for x in v if x['type']!='mcq'))
json.dump(bank,open('bank_raw.json','w'),ensure_ascii=False)
print(len(os.listdir('pkg/img')),'images')
