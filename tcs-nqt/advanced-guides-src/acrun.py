import subprocess,tempfile,os,textwrap
def run(lang,src,inp='',timeout=20):
    d=tempfile.mkdtemp(prefix='acr_')
    try:
        if lang=='python':
            open(d+'/a.py','w').write(src);cmd=['python3',d+'/a.py']
        elif lang in('c','cpp'):
            f=d+('/a.c' if lang=='c' else '/a.cpp');open(f,'w').write(src)
            r=subprocess.run(['gcc' if lang=='c' else 'g++','-O2','-o',d+'/a.out',f]+(['-lm'] if lang=='c' else ['-std=c++17']),capture_output=True,text=True)
            if r.returncode:raise RuntimeError('compile error\n'+r.stderr[:800])
            cmd=[d+'/a.out']
        elif lang=='java':
            open(d+'/Main.java','w').write(src)
            r=subprocess.run(['javac','-d',d,d+'/Main.java'],capture_output=True,text=True)
            if r.returncode:raise RuntimeError('compile error\n'+r.stderr[:800])
            cmd=['java','-cp',d,'Main']
        p=subprocess.run(cmd,input=inp,capture_output=True,text=True,timeout=timeout)
        if p.returncode:raise RuntimeError('runtime error\n'+p.stderr[:500])
        return p.stdout.strip()
    finally:
        import shutil;shutil.rmtree(d,ignore_errors=True)
def verified(lang,src,inp,expected=None):
    """run; if expected given assert equal; returns (code html block, output)"""
    out=run(lang,src,inp)
    if expected is not None:assert out==str(expected).strip(),(lang,out,expected)
    return out
