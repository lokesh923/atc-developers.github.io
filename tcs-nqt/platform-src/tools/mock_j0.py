import http.server,json,base64,subprocess,tempfile,os,shutil,uuid,time,socketserver
LANG={50:'c',54:'cpp',62:'java',71:'python'}
STORE={}
def b(s):return base64.b64encode(s.encode()).decode() if s else None
def run(lang,code,stdin,cpu):
    d=tempfile.mkdtemp()
    try:
        comp=''
        if lang=='c':
            open(d+'/a.c','w').write(code);r=subprocess.run(['gcc','-O2','-o',d+'/a',d+'/a.c','-lm'],capture_output=True,text=True)
            if r.returncode:return dict(status={'id':6,'description':'Compilation Error'},compile_output=b(r.stderr))
            cmd=[d+'/a']
        elif lang=='cpp':
            open(d+'/a.cpp','w').write(code);r=subprocess.run(['g++','-O2','-std=c++17','-o',d+'/a',d+'/a.cpp'],capture_output=True,text=True)
            if r.returncode:return dict(status={'id':6,'description':'Compilation Error'},compile_output=b(r.stderr))
            cmd=[d+'/a']
        elif lang=='java':
            open(d+'/Main.java','w').write(code);r=subprocess.run(['javac','Main.java'],cwd=d,capture_output=True,text=True)
            if r.returncode:return dict(status={'id':6,'description':'Compilation Error'},compile_output=b(r.stderr))
            cmd=['java','-Xmx256m','-cp',d,'Main']
        else:
            open(d+'/a.py','w').write(code);cmd=['python3',d+'/a.py']
        t=time.time()
        try:
            p=subprocess.run(cmd,input=stdin,capture_output=True,text=True,timeout=cpu+8)
        except subprocess.TimeoutExpired:
            return dict(status={'id':5,'description':'Time Limit Exceeded'},time='5.0')
        el=time.time()-t
        if el>cpu:return dict(status={'id':5,'description':'Time Limit Exceeded'},time=str(round(el,2)))
        if p.returncode:return dict(status={'id':11,'description':'Runtime Error (NZEC)'},stdout=b(p.stdout),stderr=b(p.stderr),time=str(round(el,2)))
        return dict(status={'id':3,'description':'Accepted'},stdout=b(p.stdout),stderr=b(p.stderr),time=str(round(el,2)),memory=1000)
    finally:shutil.rmtree(d,ignore_errors=True)
class H(http.server.BaseHTTPRequestHandler):
    def cors(self):
        self.send_header('Access-Control-Allow-Origin','*');self.send_header('Access-Control-Allow-Headers','*');self.send_header('Access-Control-Allow-Methods','*')
    def do_OPTIONS(self):self.send_response(204);self.cors();self.end_headers()
    def send(self,o,code=200):
        self.send_response(code);self.cors();self.send_header('Content-Type','application/json');self.end_headers();self.wfile.write(json.dumps(o).encode())
    def do_GET(self):
        if self.path.startswith('/languages'):return self.send([{'id':k,'name':v} for k,v in LANG.items()])
        if self.path.startswith('/submissions/'):
            tk=self.path.split('/')[2].split('?')[0];return self.send(STORE.get(tk,{}))
        self.send({'error':'nf'},404)
    def do_POST(self):
        n=int(self.headers.get('Content-Length',0));body=json.loads(self.rfile.read(n) or b'{}')
        if self.path.startswith('/submissions'):
            dec=lambda s:base64.b64decode(s).decode() if s else ''
            r=run(LANG[body['language_id']],dec(body['source_code']),dec(body.get('stdin')),body.get('cpu_time_limit',5))
            tk=str(uuid.uuid4());r['token']=tk;STORE[tk]=r;return self.send(r,201)
        self.send({},404)
    def log_message(self,*a):pass
class S(socketserver.ThreadingMixIn,http.server.HTTPServer):daemon_threads=True
S(('127.0.0.1',2358),H).serve_forever()
