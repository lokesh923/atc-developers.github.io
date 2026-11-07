import json,re,sys
sys.path.insert(0,'../vm')
raw=json.load(open('bank_raw.json'))
import vsc
bank={'S1':[],'S2':[],'S3':[],'S4':[]}
cnt=0
def add(s,item):
    global cnt
    cnt+=1;item['id']=f"{s}{cnt:04d}";bank[s].append(item)
def clean(t):return t.strip()
for s in ('S1','S2','S4'):
    for q in raw[s]:
        item=dict(t=q['topic'].split(':')[0].strip() or 'General',ty=q['type'],q=q['q'],e=q['exp'])
        if q['type']=='mcq':item['o']=q['o'];item['a']=q['a']
        else:item['a']=q['a'].strip()
        if not item['q'].strip():continue
        add(s,item)
# S3 sentence completion: from mock 1 + new bank
for q in raw['S3']:
    add('S3',dict(t=q['topic'].replace('Sentence Completion: ','').strip(),ty='mcq',q=q['q'],o=q['o'],a=q['a'],e=q['exp']))
for t,q,o,a,e in vsc.V:
    add('S3',dict(t=t,ty='mcq',q=q,o=o,a=a,e=e))
# dedupe S3 by stem
seen=set();out=[]
for q in bank['S3']:
    k=re.sub(r'\W+','',q['q']).lower()
    if k in seen:continue
    seen.add(k);out.append(q)
bank['S3']=out
import pr_data
bank['PR']=[dict(id=f'PR{i+1:02d}',title=t,p=p,m=m,f=f) for i,(t,p,m,f) in enumerate(pr_data.D)]
# emails
em=open('../vm/em1.py').read()
ns={}
src=em[:em.index('for k,s,key,m in T:')]
exec(src.replace("import docx","import types as docx"),ns)
EM=[]
for i,(k,s,key,m) in enumerate(ns['T']):
    # required facts: numbers and capitalised proper nouns (not sentence-initial) from the scenario
    nums=re.findall(r'\b\d[\d,.:]*\d\b|\b\d\b',s)
    caps=[w for w in re.findall(r'(?<![.!?] )(?<!^)\b([A-Z][a-z]{2,})\b',s) if w not in('Write','You','Report','Thank','Request','Since','Your','The','After','Invoice','Nova','Institute')]
    facts=sorted(set([x.strip(',.') for x in nums]+caps))[:7]
    EM.append(dict(id=f'EM{i+1:02d}',title=k,sc=s,model=m,facts=facts))
bank['EM']=EM
for e in EM:print(e['title'],e['facts'])
coding=json.load(open('coding.json'))
bank['S5']=coding
for k,v in bank.items():print(k,len(v))
js='window.BANK='+json.dumps(bank,ensure_ascii=False,separators=(',',':'))+';'
open('pkg/bank.js','w').write(js);print(len(js)//1024,'KB')
