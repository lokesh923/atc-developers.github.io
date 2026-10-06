/* Infosys SE Interview Prep: router, renderers, mock interview, progress (all in the browser, nothing is sent anywhere). */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const app = $('#app');
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const LVL = { basic: 'Basic', medium: 'Medium', adv: 'Advanced' };

  /* ---------- storage ---------- */
  const store = {
    get() { try { return JSON.parse(localStorage.getItem('ivState')) || {}; } catch (e) { return {}; } },
    set(s) { try { localStorage.setItem('ivState', JSON.stringify(s)); } catch (e) {} },
    upd(f) { const s = this.get(); s.done = s.done || {}; s.bm = s.bm || {}; s.plan = s.plan || {}; s.hist = s.hist || []; f(s); this.set(s); return s; },
  };
  const st = () => { const s = store.get(); s.done = s.done || {}; s.bm = s.bm || {}; s.plan = s.plan || {}; s.hist = s.hist || []; return s; };

  /* ---------- mini markdown + syntax colours ---------- */
  const KW = {
    java: 'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new null package private protected public return short static super switch synchronized this throw throws try void volatile while true false var',
    python: 'and as assert break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield self print',
    c: 'auto break case char const continue default do double else enum extern float for goto if int long register return short signed sizeof static struct switch typedef union unsigned void volatile while NULL include define printf scanf',
    sql: 'select from where group by having order limit offset join inner left right full outer cross on as and or not in is null like between distinct union all insert into values update set delete create table alter drop index primary key foreign references unique default check count sum avg min max case when then else end exists any desc asc view begin commit rollback savepoint',
  };
  KW.cpp = KW.c + ' class public private protected new delete virtual namespace using template this cout cin endl'; KW.js = KW.java; KW.javascript = KW.java; KW.bash = 'if then else fi for do done echo cd ls grep cat chmod sudo'; KW.json = 'true false null';
  function hl(code, lang) {
    lang = (lang || '').toLowerCase(); const kws = new Set(((KW[lang] || '') + (lang === 'sql' ? ' ' + KW.sql.toUpperCase() : '')).split(/\s+/).filter(Boolean));
    const sqlCI = lang === 'sql';
    const re = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*|--[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_][A-Za-z0-9_]*)\b/g;
    return code.replace(re, (m, com, str, num, id, off) => {
      if (com !== undefined) { if (m[0] === '#' && (lang === 'c' || lang === 'cpp')) return `<span class="k">${esc(m)}</span>`; if ((m[0] === '#' && lang !== 'python' && lang !== 'bash') || (m.startsWith('--') && lang !== 'sql') || ((m.startsWith('//')) && lang === 'python')) return esc(m); return `<span class="c">${esc(m)}</span>`; }
      if (str !== undefined) return `<span class="s">${esc(m)}</span>`;
      if (num !== undefined) return `<span class="n">${m}</span>`;
      if (id !== undefined && (kws.has(id) || (sqlCI && kws.has(id.toLowerCase())))) return `<span class="k">${id}</span>`;
      return esc(m);
    });
  }
  const inline = t => esc(t).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/(^|[\s(])_([^_\n]+)_(?=[\s).,;:]|$)/g, '$1<i>$2</i>');
  function md(src) {
    const L = String(src).replace(/\r/g, '').split('\n'); let h = '', i = 0;
    while (i < L.length) {
      const l = L[i];
      if (/^#{2,3} /.test(l)) { h += l.startsWith('###') ? `<h4 style="margin:1em 0 .2em">${inline(l.slice(4))}</h4>` : `<h3 style="margin:1.2em 0 .3em;font-size:1.12rem">${inline(l.slice(3))}</h3>`; i++; continue; }
      if (/^```/.test(l)) { const lang = l.slice(3).trim(), c = []; i++; while (i < L.length && !/^```/.test(L[i])) c.push(L[i++]); i++; for (let k = c.length - 1; k >= 0; k--) if (/^\s*(\/\/|#|--) *(runnable|expect:)/.test(c[k])) c.splice(k, 1); h += `<pre class="code" data-lang="${esc(lang)}"><code>${hl(c.join('\n'), lang)}</code></pre>`; continue; }
      if (/^\|/.test(l)) { const rows = []; while (i < L.length && /^\|/.test(L[i])) rows.push(L[i++]); const cells = r => r.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(x => x.trim().replace(/\\\|/g, '|'));
        const body = rows.filter(r => !/^\|[\s:|-]+\|?$/.test(r)).map(cells); h += `<div class="tablewrap"><table class="t"><thead><tr>${body[0].map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.slice(1).map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; continue; }
      if (/^(- |\* )/.test(l)) { const it = []; while (i < L.length && /^(- |\* |  +\S)/.test(L[i])) { if (/^(- |\* )/.test(L[i])) it.push(L[i].slice(2)); else it[it.length - 1] += ' ' + L[i].trim(); i++; } h += `<ul>${it.map(x => `<li>${inline(x)}</li>`).join('')}</ul>`; continue; }
      if (/^\d+\. /.test(l)) { const it = []; while (i < L.length && /^(\d+\. |  +\S)/.test(L[i])) { if (/^\d+\. /.test(L[i])) it.push(L[i].replace(/^\d+\. /, '')); else it[it.length - 1] += ' ' + L[i].trim(); i++; } h += `<ol>${it.map(x => `<li>${inline(x)}</li>`).join('')}</ol>`; continue; }
      if (/^> /.test(l)) { const c = []; while (i < L.length && /^> /.test(L[i])) c.push(L[i++].slice(2)); h += `<div class="callout"><p>${inline(c.join(' '))}</p></div>`; continue; }
      if (!l.trim()) { i++; continue; }
      const p = []; while (i < L.length && L[i].trim() && !/^(```|\||- |\* |\d+\. |> |#{2,3} )/.test(L[i])) p.push(L[i++]); h += `<p>${inline(p.join(' '))}</p>`;
    }
    return h;
  }

  /* ---------- data helpers ---------- */
  const modules = () => IV.modules;
  const qid = (m, i) => `${m.id}-${i + 1}`;
  const allQ = () => { const out = []; modules().forEach(m => (m.qa || []).forEach((q, i) => out.push({ ...q, id: qid(m, i), mod: m }))); return out; };
  const byId = id => allQ().find(q => q.id === id);
  const modStats = (m, s) => { const n = (m.qa || []).length; let got = 0, rev = 0; (m.qa || []).forEach((q, i) => { const d = s.done[qid(m, i)]; if (d === 1) got++; if (d === 2) rev++; }); return { n, got, rev }; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- shared pieces ---------- */
  function qCard(q, s) {
    const d = s.done[q.id], bm = s.bm[q.id];
    return `<details class="qa ${d === 1 ? 'got' : d === 2 ? 'revise' : ''}" id="q-${q.id}" data-q="${q.id}"><summary><div class="qtext">${inline(q.q)}<div class="meta"><span class="chip ${q.lvl === 'basic' ? 'good' : q.lvl === 'adv' ? 'bad' : 'sig'}">${LVL[q.lvl] || q.lvl}</span>${q.hot ? '<span class="chip sig">Frequently asked</span>' : ''}${(q.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('')}${bm ? '<span class="chip">Bookmarked</span>' : ''}</div></div></summary>
      <div class="ans"><div class="md">${md(q.a)}</div><div class="qactions"><button class="btn sm good" data-act="got">I know this</button><button class="btn sm warn" data-act="rev">Revise later</button><button class="btn sm" data-act="bm">${bm ? 'Remove bookmark' : 'Bookmark'}</button><button class="btn sm" data-act="clr">Clear</button></div></div></details>`;
  }
  function wireCards(root, after) {
    $$('details.qa', root).forEach(d => {
      d.addEventListener('click', e => {
        const b = e.target.closest('[data-act]'); if (!b) return; e.preventDefault(); const id = d.dataset.q, a = b.dataset.act;
        store.upd(s => { if (a === 'got') s.done[id] = 1; if (a === 'rev') s.done[id] = 2; if (a === 'clr') delete s.done[id]; if (a === 'bm') { if (s.bm[id]) delete s.bm[id]; else s.bm[id] = 1; } });
        const s = st(), q = byId(id); const wasOpen = d.open; const n = document.createElement('div'); n.innerHTML = qCard(q, s); const nd = n.firstElementChild; nd.open = wasOpen; d.replaceWith(nd); wireCards(nd.parentNode, after); if (after) after();
      });
    });
  }
  function setNav(k) { $$('.topnav a').forEach(a => a.classList.toggle('on', a.dataset.nav === k)); }
  const href = h => `href="#/${h}"`;

  /* ---------- home ---------- */
  function home() {
    setNav('home'); const s = st(), P = IV.process || { rounds: [], facts: [] };
    const groups = [['tech', 'Technical subjects'], ['lang', 'Programming languages'], ['hr', 'HR and project rounds']];
    const total = allQ().length, got = Object.values(s.done).filter(v => v === 1).length;
    app.innerHTML = `<div class="stack">
      <section class="stack hero" style="gap:10px"><div class="eyebrow">Infosys Systems Engineer</div><h1>Everything you need for the technical and HR interview, in one place</h1>
        <p class="muted" style="margin:0">${total} questions with detailed answers, ${IV.coding.length} coding problems with Java, Python and C solutions, SQL practice, cheat sheets, HR and project answers, a study plan and a mock interview. Mark what you know, bookmark what you want to revise, and your progress stays in this browser.</p>
        <div class="row"><a class="btn primary" ${href('mock')}>Start a mock interview</a><a class="btn" ${href('plan')}>Open the study plan</a><a class="btn" ${href('m/hr')}>HR questions</a></div></section>
      <section class="panel stack" style="gap:10px"><h2>The Infosys SE selection process</h2><div class="rounds">${(P.rounds || []).map((r, i) => `<div class="round"><div class="eyebrow">Step ${i + 1}</div><b>${esc(r.name)}</b><div class="muted" style="font-size:.93rem">${inline(r.text)}</div></div>`).join('')}</div>
        <a class="muted" ${href('m/process')}>Read the full guide to the process, role and training &rarr;</a></section>
      <section class="panel"><div class="row" style="justify-content:space-between"><h2>Your progress</h2><span class="muted">${got} of ${total} questions marked as known</span></div><div class="bar" style="margin-top:8px"><i style="width:${total ? got / total * 100 : 0}%"></i></div></section>
      ${groups.map(([g, t]) => { const ms = modules().filter(m => m.group === g); if (!ms.length) return ''; return `<section class="stack" style="gap:10px"><h2>${t}</h2><div class="grid">${ms.map(m => { const x = modStats(m, s); return `<a class="panel card" ${href('m/' + m.id)}><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h3>${esc(m.title)}</h3><span class="chip">${x.n} Q</span></div><div class="muted" style="font-size:.92rem">${esc(m.blurb)}</div><div class="bar"><i style="width:${x.n ? x.got / x.n * 100 : 0}%"></i></div><div class="muted" style="font-size:.82rem">${x.got} known${x.rev ? ` | ${x.rev} to revise` : ''}</div></a>`; }).join('')}</div></section>`; }).join('')}
      <section class="stack" style="gap:10px"><h2>Practice tools</h2><div class="grid">
        <a class="panel card" ${href('coding')}><h3>Coding problems</h3><div class="muted">${IV.coding.length} programs asked in interviews, each with the approach, complexity and solutions in Java, Python and C.</div></a>
        <a class="panel card" ${href('sql')}><h3>SQL practice</h3><div class="muted">${IV.sql.items.length} queries on a sample database, with the output you should get.</div></a>
        <a class="panel card" ${href('sheets')}><h3>Cheat sheets</h3><div class="muted">${IV.sheets.length} one-page revision sheets: complexities, OSI model, SQL joins, SDLC models and more.</div></a>
        <a class="panel card" ${href('mock')}><h3>Mock interview</h3><div class="muted">Random questions one by one, like a real interviewer. Rate yourself and see your weak topics.</div></a>
        <a class="panel card" href="../infosys-se/"><h3>Aptitude practice arena</h3><div class="muted">Mock tests and section practice for the Infosys written test (reasoning, technical, verbal, pseudocode, puzzles).</div></a></div></section>
    </div>`;
  }

  /* ---------- module (Q&A list) ---------- */
  const F = { lvl: 'all', hot: false, st: 'all', q: '' };
  function moduleView(id) {
    const m = modules().find(x => x.id === id); if (!m) return home(); setNav('home'); const s = st();
    if (m.page) { app.innerHTML = `<div class="stack"><div><a class="muted" ${href('')} style="font-size:.9rem">&larr; Home</a><div class="eyebrow" style="margin-top:8px">Guide</div><h1>${esc(m.title)}</h1></div><article class="panel md">${md(m.page)}</article></div>`; document.title = m.title + ' | Infosys SE Interview Prep'; return; }
    document.title = m.title + ' | Infosys SE Interview Prep';
    const draw = () => {
      const s2 = st(), qq = $('#qs'); const ql = F.q.trim().toLowerCase();
      const list = m.qa.map((q, i) => ({ ...q, id: qid(m, i) })).filter(q => (F.lvl === 'all' || q.lvl === F.lvl) && (!F.hot || q.hot) && (F.st === 'all' || (F.st === 'new' && !s2.done[q.id]) || (F.st === 'rev' && s2.done[q.id] === 2) || (F.st === 'bm' && s2.bm[q.id])) && (!ql || (q.q + ' ' + q.a + ' ' + (q.tags || []).join(' ')).toLowerCase().includes(ql)));
      qq.innerHTML = list.length ? list.map(q => qCard(q, s2)).join('') : '<p class="muted">No questions match these filters.</p>'; wireCards(qq, upd); $('#cnt').textContent = `${list.length} of ${m.qa.length} questions`;
    };
    const upd = () => { const x = modStats(m, st()); $('#prog').innerHTML = `<i style="width:${x.n ? x.got / x.n * 100 : 0}%"></i>`; $('#progt').textContent = `${x.got} known, ${x.rev} to revise, ${x.n - x.got - x.rev} not seen`; };
    const pill = (k, v, l) => `<button class="pill ${F[k] === v ? 'on' : ''}" data-k="${k}" data-v="${v}">${l}</button>`;
    app.innerHTML = `<div class="stack"><div><a class="muted" ${href('')} style="font-size:.9rem">&larr; Home</a><div class="eyebrow" style="margin-top:8px">${esc(m.group === 'tech' ? 'Technical' : m.group === 'lang' ? 'Programming language' : 'Interview round')}</div><h1>${esc(m.title)}</h1><p class="muted" style="margin:6px 0 0;max-width:70ch">${esc(m.blurb)}</p></div>
      <div class="panel stack" style="gap:8px"><div class="bar" id="prog"></div><div class="muted" id="progt" style="font-size:.88rem"></div></div>
      <div class="filters"><input class="finput" id="mq" type="search" placeholder="Search in ${esc(m.title)}" value="${esc(F.q)}" aria-label="Search in this module">${['all', 'basic', 'medium', 'adv'].map(v => pill('lvl', v, v === 'all' ? 'All levels' : LVL[v])).join('')}${pill('hot', true, 'Frequently asked')}${['all', 'new', 'rev', 'bm'].map(v => pill('st', v, { all: 'Any status', new: 'Not seen', rev: 'To revise', bm: 'Bookmarked' }[v])).join('')}<button class="btn sm" id="expand">Open all</button></div>
      <div class="muted" id="cnt" style="font-size:.88rem"></div><div class="stack" style="gap:10px" id="qs"></div></div>`;
    $$('.pill').forEach(b => b.addEventListener('click', () => { const k = b.dataset.k; if (k === 'hot') F.hot = !F.hot; else F[k] = b.dataset.v; $$(`.pill[data-k="${k}"]`).forEach(x => x.classList.toggle('on', k === 'hot' ? F.hot : x.dataset.v === F[k])); draw(); }));
    $('#mq').addEventListener('input', e => { F.q = e.target.value; draw(); });
    let open = false; $('#expand').addEventListener('click', e => { open = !open; $$('#qs details').forEach(d => d.open = open); e.target.textContent = open ? 'Close all' : 'Open all'; });
    draw(); upd();
    const h = location.hash.match(/#\/m\/[^/]+\/(.+)$/); if (h) { const el = $('#q-' + h[1]); if (el) { el.open = true; el.scrollIntoView(); } }
  }

  /* ---------- coding ---------- */
  function codingList() {
    setNav('coding'); document.title = 'Coding problems | Infosys SE Interview Prep'; const s = st(); let fl = 'all', ft = 'all', fq = '';
    const topics = [...new Set(IV.coding.map(c => c.topic))];
    const draw = () => { const l = IV.coding.filter(c => (fl === 'all' || c.lvl === fl) && (ft === 'all' || c.topic === ft) && (!fq || (c.title + c.topic).toLowerCase().includes(fq))); $('#cl').innerHTML = l.map(c => `<a class="panel card" ${href('coding/' + c.id)}><div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h3>${esc(c.title)}</h3>${s.done['c-' + c.id] ? '<span class="chip good">Done</span>' : ''}</div><div class="chips"><span class="chip ${c.lvl === 'basic' ? 'good' : c.lvl === 'adv' ? 'bad' : 'sig'}">${LVL[c.lvl]}</span><span class="chip">${esc(c.topic)}</span>${c.hot ? '<span class="chip sig">Frequently asked</span>' : ''}</div></a>`).join('') || '<p class="muted">Nothing matches.</p>'; };
    app.innerHTML = `<div class="stack"><div><a class="muted" ${href('')} style="font-size:.9rem">&larr; Home</a><h1 style="margin-top:6px">Coding problems</h1><p class="muted" style="margin:6px 0 0;max-width:70ch">Programs that Infosys interviewers and online coding rounds ask again and again. Try each one on paper first, then compare with the approach and the three solutions. Every solution here was compiled and run with the sample input.</p></div>
      <div class="filters"><input class="finput" id="cq" type="search" placeholder="Search problems" aria-label="Search problems">${['all', 'basic', 'medium', 'adv'].map(v => `<button class="pill ${v === 'all' ? 'on' : ''}" data-l="${v}">${v === 'all' ? 'All levels' : LVL[v]}</button>`).join('')}<select class="finput" id="ct" style="flex:0 0 auto" aria-label="Topic"><option value="all">All topics</option>${topics.map(t => `<option>${esc(t)}</option>`).join('')}</select></div><div class="grid" id="cl"></div></div>`;
    $$('[data-l]').forEach(b => b.addEventListener('click', () => { fl = b.dataset.l; $$('[data-l]').forEach(x => x.classList.toggle('on', x === b)); draw(); }));
    $('#ct').addEventListener('change', e => { ft = e.target.value; draw(); }); $('#cq').addEventListener('input', e => { fq = e.target.value.toLowerCase(); draw(); }); draw();
  }
  function codingView(id) {
    const c = IV.coding.find(x => x.id === id); if (!c) return codingList(); setNav('coding'); document.title = c.title + ' | Coding problems'; const s = st(); let lang = 'java';
    const draw = () => { $('#sol').innerHTML = `<pre class="code" data-lang="${lang}"><code>${hl(c.sol[lang], lang)}</code></pre>`; $$('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.lg === lang)); };
    const i = IV.coding.indexOf(c), prev = IV.coding[i - 1], next = IV.coding[i + 1];
    app.innerHTML = `<div class="stack"><div><a class="muted" ${href('coding')} style="font-size:.9rem">&larr; All problems</a><h1 style="margin-top:6px">${esc(c.title)}</h1><div class="chips" style="margin-top:8px"><span class="chip ${c.lvl === 'basic' ? 'good' : c.lvl === 'adv' ? 'bad' : 'sig'}">${LVL[c.lvl]}</span><span class="chip">${esc(c.topic)}</span><span class="chip">Time ${esc(c.time)}</span><span class="chip">Space ${esc(c.space)}</span></div></div>
      <div class="panel md"><h3>Problem</h3>${md(c.stmt)}${(c.examples || []).length ? `<h3 style="margin-top:12px">Sample</h3><div class="tablewrap"><table class="t"><thead><tr><th>Input</th><th>Output</th></tr></thead><tbody>${c.examples.map(e => `<tr><td><code>${esc(e.in)}</code></td><td><code>${esc(e.out)}</code></td></tr>`).join('')}</tbody></table></div>` : ''}</div>
      <div class="panel md"><h3>Approach</h3>${md(c.approach)}</div>
      <div class="panel"><h3>Solution</h3><div class="tabs" role="tablist" style="margin-top:8px"><button data-lg="java">Java</button><button data-lg="python">Python</button><button data-lg="c">C</button></div><div id="sol"></div></div>
      <div class="row"><button class="btn good" id="cdone">${s.done['c-' + c.id] ? 'Marked as done' : 'Mark as done'}</button>${prev ? `<a class="btn" ${href('coding/' + prev.id)}>&larr; ${esc(prev.title)}</a>` : ''}${next ? `<a class="btn primary" ${href('coding/' + next.id)}>${esc(next.title)} &rarr;</a>` : ''}</div></div>`;
    $$('.tabs button').forEach(b => b.addEventListener('click', () => { lang = b.dataset.lg; draw(); })); draw();
    $('#cdone').addEventListener('click', e => { store.upd(x => { if (x.done['c-' + c.id]) delete x.done['c-' + c.id]; else x.done['c-' + c.id] = 1; }); e.target.textContent = st().done['c-' + c.id] ? 'Marked as done' : 'Mark as done'; });
  }

  /* ---------- sql ---------- */
  function sqlView() {
    setNav('sql'); document.title = 'SQL practice | Infosys SE Interview Prep'; const D = IV.sql;
    app.innerHTML = `<div class="stack"><div><a class="muted" ${href('')} style="font-size:.9rem">&larr; Home</a><h1 style="margin-top:6px">SQL practice</h1><p class="muted" style="margin:6px 0 0;max-width:70ch">Every query below was run on exactly these tables, and the output shown is the real result. Write your own query first, then open the answer.</p></div>
      <div class="panel stack" style="gap:10px"><h2>Sample database</h2>${D.schema.map(t => `<div><b>${esc(t.table)}</b> <span class="muted">(${t.cols.join(', ')})</span><div class="tablewrap"><table class="t"><thead><tr>${t.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r => `<tr>${r.map(c => `<td>${c === null ? '<i>NULL</i>' : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`).join('')}</div>
      <div class="stack" style="gap:10px">${D.items.map((it, i) => `<details class="qa"><summary><div class="qtext">${i + 1}. ${inline(it.q)}<div class="meta"><span class="chip ${it.lvl === 'basic' ? 'good' : it.lvl === 'adv' ? 'bad' : 'sig'}">${LVL[it.lvl]}</span></div></div></summary><div class="ans"><pre class="code" data-lang="sql"><code>${hl(it.sql, 'sql')}</code></pre>${it.out ? `<div class="tablewrap"><table class="t"><thead><tr>${it.out.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${it.out.rows.map(r => `<tr>${r.map(c => `<td>${c === null ? '<i>NULL</i>' : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}<div class="md">${md(it.explain || '')}</div></div></details>`).join('')}</div></div>`;
  }

  /* ---------- sheets ---------- */
  function sheetsView(id) {
    setNav('sheets'); document.title = 'Cheat sheets | Infosys SE Interview Prep';
    if (id) { const sh = IV.sheets.find(x => x.id === id); if (sh) { app.innerHTML = `<div class="stack"><div><a class="muted" ${href('sheets')} style="font-size:.9rem">&larr; All sheets</a><h1 style="margin-top:6px">${esc(sh.title)}</h1></div><article class="panel md">${md(sh.body)}</article></div>`; return; } }
    app.innerHTML = `<div class="stack"><div><a class="muted" ${href('')} style="font-size:.9rem">&larr; Home</a><h1 style="margin-top:6px">Cheat sheets</h1><p class="muted" style="margin:6px 0 0">One-page revision sheets for the night before the interview.</p></div><div class="grid">${IV.sheets.map(x => `<a class="panel card" ${href('sheets/' + x.id)}><h3>${esc(x.title)}</h3><div class="muted" style="font-size:.92rem">${esc(x.blurb || '')}</div></a>`).join('')}</div></div>`;
  }

  /* ---------- plan ---------- */
  function planView(pid) {
    setNav('plan'); document.title = 'Study plan | Infosys SE Interview Prep'; const s = st(); const plans = IV.plan; const p = plans.find(x => x.id === pid) || plans[0];
    const keys = p.days.flatMap((d, di) => d.tasks.map((t, ti) => `${p.id}.${di}.${ti}`)), done = keys.filter(k => s.plan[k]).length;
    app.innerHTML = `<div class="stack"><div><a class="muted" ${href('')} style="font-size:.9rem">&larr; Home</a><h1 style="margin-top:6px">Study plan</h1><p class="muted" style="margin:6px 0 0;max-width:70ch">Pick the plan that fits the time you have. Tick tasks as you finish them; your ticks are saved in this browser.</p></div>
      <div class="filters">${plans.map(x => `<a class="pill ${x.id === p.id ? 'on' : ''}" ${href('plan/' + x.id)} style="text-decoration:none">${esc(x.title)}</a>`).join('')}</div>
      <div class="panel"><div class="row" style="justify-content:space-between"><b id="pt">${done} of ${keys.length} tasks done</b></div><div class="bar" style="margin-top:8px"><i id="pb" style="width:${keys.length ? done / keys.length * 100 : 0}%"></i></div></div>
      ${p.days.map((d, di) => `<section class="panel stack" style="gap:8px"><div class="eyebrow">${esc(d.day)}</div><h3>${esc(d.title)}</h3><ul class="checklist">${d.tasks.map((t, ti) => { const k = `${p.id}.${di}.${ti}`; return `<li class="${s.plan[k] ? 'done' : ''}"><label><input type="checkbox" data-k="${k}" ${s.plan[k] ? 'checked' : ''}><span>${inline(t)}</span></label></li>`; }).join('')}</ul></section>`).join('')}</div>`;
    $$('.checklist input').forEach(cb => cb.addEventListener('change', () => { store.upd(x => { if (cb.checked) x.plan[cb.dataset.k] = 1; else delete x.plan[cb.dataset.k]; }); cb.closest('li').classList.toggle('done', cb.checked); const n = keys.filter(k => st().plan[k]).length; $('#pt').textContent = `${n} of ${keys.length} tasks done`; $('#pb').style.width = (keys.length ? n / keys.length * 100 : 0) + '%'; }));
  }

  /* ---------- mock interview ---------- */
  let M = null;
  function mockSetup() {
    setNav('mock'); document.title = 'Mock interview | Infosys SE Interview Prep'; M = null;
    app.innerHTML = `<div class="stack mockcard"><div><a class="muted" ${href('')} style="font-size:.9rem">&larr; Home</a><h1 style="margin-top:6px">Mock interview</h1><p class="muted" style="margin:6px 0 0">The questions come one by one. Answer out loud first, then reveal the model answer and rate yourself honestly. At the end you get your weak topics and a revision list.</p></div>
      <div class="panel stack" style="gap:12px"><div><div class="eyebrow">Pick topics</div><div class="filters" style="margin-top:6px">${modules().filter(m => m.qa && m.qa.length).map(m => `<label class="pill" style="display:flex;gap:6px;align-items:center;cursor:pointer"><input type="checkbox" class="mm" value="${m.id}" ${m.group !== 'lang' ? 'checked' : ''}> ${esc(m.title)}</label>`).join('')}</div></div>
        <div class="row"><label>Questions <select id="mn" class="finput" style="flex:0 0 auto"><option>10</option><option selected>15</option><option>20</option><option>30</option></select></label><label>Level <select id="ml" class="finput" style="flex:0 0 auto"><option value="all">All levels</option><option value="basic">Basic only</option><option value="medium">Medium and advanced</option></select></label><label class="row" style="gap:6px"><input type="checkbox" id="mh"> Frequently asked only</label></div>
        <div class="row"><button class="btn primary" id="mgo">Start interview</button><button class="btn" id="mhr">HR round only (10 questions)</button></div><p class="muted" id="mer" style="margin:0;color:var(--bad)"></p></div>
      ${st().hist.length ? `<div class="panel"><h3>Your last interviews</h3><div class="tablewrap"><table class="t"><thead><tr><th>Date</th><th>Questions</th><th>Knew it</th><th>Partly</th><th>Missed</th></tr></thead><tbody>${st().hist.slice(0, 8).map(h => `<tr><td>${esc(h.date)}</td><td>${h.n}</td><td>${h.got}</td><td>${h.part}</td><td>${h.miss}</td></tr>`).join('')}</tbody></table></div></div>` : ''}</div>`;
    const start = (mods, n, lvl, hot) => {
      let pool = allQ().filter(q => mods.includes(q.mod.id) && (lvl === 'all' || (lvl === 'basic' ? q.lvl === 'basic' : q.lvl !== 'basic')) && (!hot || q.hot));
      if (!pool.length) { $('#mer').textContent = 'No questions match these choices. Select more topics or relax the filters.'; return; }
      M = { qs: shuffle(pool).slice(0, n), i: 0, rate: {}, t0: Date.now(), shown: false }; mockQ();
    };
    $('#mgo').addEventListener('click', () => start($$('.mm:checked').map(c => c.value), +$('#mn').value, $('#ml').value, $('#mh').checked));
    $('#mhr').addEventListener('click', () => start(['hr'], 10, 'all', false));
  }
  function mockQ() {
    const q = M.qs[M.i], n = M.qs.length;
    app.innerHTML = `<div class="stack mockcard"><div class="row" style="justify-content:space-between"><div class="eyebrow">Question ${M.i + 1} of ${n}</div><span class="timer" id="mt">00:00</span></div><div class="bar"><i style="width:${M.i / n * 100}%"></i></div>
      <div class="panel stack" style="gap:10px"><div class="chips"><span class="chip">${esc(q.mod.title)}</span><span class="chip ${q.lvl === 'basic' ? 'good' : q.lvl === 'adv' ? 'bad' : 'sig'}">${LVL[q.lvl]}</span></div><h2 style="font-size:1.2rem">${inline(q.q)}</h2><p class="muted" style="margin:0">Say your answer out loud in 1 to 2 minutes, then reveal the model answer.</p>
        <div id="rv"><button class="btn primary" id="show">Show model answer</button></div></div></div>`;
    M.qt = Date.now(); clearInterval(M.tk); M.tk = setInterval(() => { const e = $('#mt'); if (!e) return clearInterval(M.tk); const sec = Math.floor((Date.now() - M.qt) / 1000); e.textContent = String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); }, 500);
    $('#show').addEventListener('click', () => { $('#rv').innerHTML = `<div class="ans" style="padding:0;border:0"><div class="md">${md(q.a)}</div></div><div class="eyebrow" style="margin-top:14px">How well did you answer?</div><div class="row" style="margin-top:6px"><button class="btn good" data-r="1">Knew it</button><button class="btn warn" data-r="2">Partly</button><button class="btn bad" data-r="3">Missed it</button></div>`;
      $$('[data-r]').forEach(b => b.addEventListener('click', () => { M.rate[q.id] = +b.dataset.r; store.upd(s => { if (b.dataset.r === '1') s.done[q.id] = 1; else s.done[q.id] = 2; }); if (M.i < n - 1) { M.i++; mockQ(); } else mockEnd(); })); });
  }
  function mockEnd() {
    clearInterval(M.tk); const n = M.qs.length, c = [0, 0, 0, 0]; M.qs.forEach(q => c[M.rate[q.id] || 3]++); const per = {}; M.qs.forEach(q => { const k = q.mod.title; per[k] = per[k] || [0, 0]; per[k][1]++; if (M.rate[q.id] === 1) per[k][0]++; });
    store.upd(s => { s.hist.unshift({ date: new Date().toLocaleDateString(), n, got: c[1], part: c[2], miss: c[3] }); s.hist = s.hist.slice(0, 20); });
    const pct = Math.round(c[1] / n * 100), weak = M.qs.filter(q => M.rate[q.id] !== 1);
    app.innerHTML = `<div class="stack mockcard"><div class="panel"><div class="eyebrow">Interview finished</div><div class="row" style="gap:28px;margin-top:6px"><div><div class="big">${pct}%</div><div class="muted">answered well</div></div><div class="chips"><span class="chip good">${c[1]} knew it</span><span class="chip sig">${c[2]} partly</span><span class="chip bad">${c[3]} missed</span></div></div><p class="muted" style="margin:8px 0 0">${pct >= 80 ? 'Strong. Keep revising the few misses and do one more round tomorrow.' : pct >= 55 ? 'A decent base. Go through the topics below again before your next attempt.' : 'You have good ground to cover. Use the study plan and read the answers of each topic once.'}</p></div>
      <div class="panel"><h3>Topic-wise result</h3><div class="tablewrap"><table class="t"><thead><tr><th>Topic</th><th>Answered well</th></tr></thead><tbody>${Object.entries(per).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${v[0]} of ${v[1]}</td></tr>`).join('')}</tbody></table></div></div>
      ${weak.length ? `<div class="panel stack" style="gap:8px"><h3>Revise these</h3>${weak.map(q => `<a href="#/m/${q.mod.id}/${q.id}">${inline(q.q)}</a>`).join('')}</div>` : ''}
      <div class="row"><button class="btn primary" id="again">Another interview</button><a class="btn" ${href('progress')}>My progress</a></div></div>`;
    $('#again').addEventListener('click', mockSetup);
  }

  /* ---------- progress / search ---------- */
  function progressView() {
    setNav('progress'); document.title = 'My progress | Infosys SE Interview Prep'; const s = st(), all = allQ();
    const rev = all.filter(q => s.done[q.id] === 2), bm = all.filter(q => s.bm[q.id]), got = all.filter(q => s.done[q.id] === 1);
    const list = (t, l, empty) => `<section class="panel stack" style="gap:8px"><h2>${t} <span class="muted" style="font-size:.9rem">(${l.length})</span></h2>${l.length ? l.slice(0, 80).map(q => `<div><a href="#/m/${q.mod.id}/${q.id}">${inline(q.q)}</a> <span class="muted" style="font-size:.85rem">${esc(q.mod.title)}</span></div>`).join('') : `<p class="muted" style="margin:0">${empty}</p>`}</section>`;
    app.innerHTML = `<div class="stack"><div><a class="muted" ${href('')} style="font-size:.9rem">&larr; Home</a><h1 style="margin-top:6px">My progress</h1></div>
      <div class="panel"><div class="row" style="justify-content:space-between"><div><div class="big">${got.length}<span class="muted" style="font-size:1rem"> / ${all.length}</span></div><div class="muted">questions marked as known</div></div><div class="muted">${IV.coding.filter(c => s.done['c-' + c.id]).length} of ${IV.coding.length} coding problems done</div></div></div>
      <div class="panel"><h3>By topic</h3><div class="tablewrap"><table class="t"><thead><tr><th>Topic</th><th>Known</th><th>To revise</th><th>Total</th></tr></thead><tbody>${modules().filter(m => m.qa && m.qa.length).map(m => { const x = modStats(m, s); return `<tr><td><a ${href('m/' + m.id)}>${esc(m.title)}</a></td><td>${x.got}</td><td>${x.rev}</td><td>${x.n}</td></tr>`; }).join('')}</tbody></table></div></div>
      ${list('To revise', rev, 'Nothing marked for revision yet.')}${list('Bookmarked', bm, 'No bookmarks yet. Open any question and press Bookmark.')}
      <div><button class="btn bad" id="reset">Reset all my progress</button></div></div>`;
    $('#reset').addEventListener('click', e => { if (e.target.dataset.sure) { store.set({}); progressView(); } else { e.target.dataset.sure = 1; e.target.textContent = 'Click again to erase everything'; } });
  }
  function searchView(q) {
    setNav(''); document.title = 'Search | Infosys SE Interview Prep'; const ql = (q || '').toLowerCase().trim(), s = st();
    const res = ql ? allQ().filter(x => (x.q + ' ' + x.a + ' ' + (x.tags || []).join(' ')).toLowerCase().includes(ql)) : [];
    const cod = ql ? IV.coding.filter(c => (c.title + ' ' + c.topic).toLowerCase().includes(ql)) : [];
    app.innerHTML = `<div class="stack"><div><a class="muted" ${href('')} style="font-size:.9rem">&larr; Home</a><h1 style="margin-top:6px">Search</h1><p class="muted" style="margin:4px 0 0">${ql ? `${res.length} question${res.length === 1 ? '' : 's'} and ${cod.length} coding problem${cod.length === 1 ? '' : 's'} for "${esc(q)}"` : 'Type in the search box at the top.'}</p></div>
      ${cod.length ? `<div class="grid">${cod.map(c => `<a class="panel card" ${href('coding/' + c.id)}><h3>${esc(c.title)}</h3><div class="muted">Coding problem | ${esc(c.topic)}</div></a>`).join('')}</div>` : ''}
      <div class="stack" style="gap:10px" id="sr">${res.slice(0, 60).map(x => `<div class="muted" style="font-size:.8rem;margin-bottom:-6px">${esc(x.mod.title)}</div>${qCard(x, s)}`).join('')}</div></div>`; wireCards($('#sr'));
  }

  /* ---------- router ---------- */
  function route() {
    const p = decodeURIComponent(location.hash.replace(/^#\/?/, '')).split('/'); window.scrollTo(0, 0); document.title = 'Infosys SE Interview Prep';
    try {
      if (!p[0]) return home();
      if (p[0] === 'm') return moduleView(p[1]);
      if (p[0] === 'coding') return p[1] ? codingView(p[1]) : codingList();
      if (p[0] === 'sql') return sqlView();
      if (p[0] === 'sheets') return sheetsView(p[1]);
      if (p[0] === 'plan') return planView(p[1]);
      if (p[0] === 'mock') return mockSetup();
      if (p[0] === 'progress') return progressView();
      if (p[0] === 'search') return searchView(p.slice(1).join('/'));
      home();
    } catch (e) { app.innerHTML = `<div class="panel"><h2>Something went wrong</h2><p class="muted">${esc(e.message)}</p><a class="btn" href="#/">Back to home</a></div>`; console.error(e); }
  }
  window.addEventListener('hashchange', route);
  $('#gs').addEventListener('submit', e => { e.preventDefault(); const q = $('#gsq').value.trim(); if (q) location.hash = '#/search/' + encodeURIComponent(q); });
  window.IVapp = { md, hl, route };
  route();
})();
