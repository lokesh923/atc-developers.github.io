// Parses the seven study-guide PDFs into structured blocks (infosys-se/data/guides.js) and extracts their figures.
// Usage: node tools/parse-guides.js <dir-with-the-pdfs>
const fs = require('fs'), path = require('path'), cp = require('child_process');
const SRC = process.argv[2];
const OUT = path.join(__dirname, '..', 'infosys-se');
const IMG = path.join(OUT, 'guides', 'img');
fs.mkdirSync(IMG, { recursive: true });
const TMP = fs.mkdtempSync('/tmp/guides-');

const GUIDES = [
  { key: 'R', file: /01_Reasoning/, name: 'Reasoning Ability' },
  { key: 'T', file: /02_Technical/, name: 'Technical (Mathematical) Ability' },
  { key: 'V', file: /03_Verbal/, name: 'Verbal Ability' },
  { key: 'P', file: /04_Pseudocode/, name: 'Pseudocode' },
  { key: 'Z', file: /05_Numerical/, name: 'Numerical Puzzles' },
  { key: 'G', file: /English_Grammar/, name: 'English Grammar' },
  { key: 'W', file: /06_English_Writing/, name: 'English Writing' },
];
const files = fs.readdirSync(SRC);
const run = (c) => cp.execSync(c, { maxBuffer: 1 << 28 }).toString();
const norm = s => s.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
const clean = s => s.replace(/\s+/g, ' ').trim();
const ind = s => s.length - s.trimStart().length;
const segs = s => { const out = []; const re = /\S+(?: {1,1}\S+)*/g; let m; while ((m = re.exec(s))) out.push({ t: m[0], at: m.index }); return out; };
const isTabular = s => /\S {2,}\S/.test(s.trim());

function loadGuide(g) {
  const pdf = path.join(SRC, files.find(f => g.file.test(f)));
  const txt = run(`pdftotext -layout "${pdf}" -`);
  const pages = txt.split('\f'); if (!pages[pages.length - 1].trim()) pages.pop();
  // images (skip soft masks)
  const list = run(`pdfimages -list "${pdf}"`).split('\n').slice(2).filter(Boolean).map(l => l.trim().split(/\s+/));
  const dir = path.join(TMP, g.key); fs.mkdirSync(dir);
  run(`pdfimages -png -p "${pdf}" ${dir}/i`);
  const imgs = {};
  list.forEach(r => { if (r[2] !== 'image') return; const page = +r[0], num = +r[1];
    const f = `${dir}/i-${String(page).padStart(3, '0')}-${String(num).padStart(3, '0')}.png`;
    (imgs[page] = imgs[page] || []).push({ f, w: +r[3], h: +r[4] }); });
  return { pages, imgs };
}

// flatten into lines with page numbers, removing running headers/footers
function flatten(pages) {
  const L = [];
  pages.forEach((p, pi) => {
    const lines = p.split('\n').map(s => s.replace(/\s+$/, ''));
    const isLone = t => /^\s*(?:[0-9n]\s+){0,3}[0-9n]\s*$/.test(t) && t.replace(/\s/g, '').length <= 4 && t.trim().length > 0;
    lines.forEach((s, i) => {
      if (/^\s*Page \d+\s*$/.test(s)) return;
      if (isLone(s)) { const nx = lines[i + 1]; if (nx && nx.trim() && isTabular(nx)) L.push({ s: '', page: pi + 1 }); return; }
      if (/- (Complete )?(Study )?Guide$/.test(s.trim()) && s.trim().length < 70 && ind(s) < 3) return;
      L.push({ s, page: pi + 1 });
    });
    L.push({ pb: true, page: pi + 1 });
  });
  return L;
}

function groupsOf(L) {
  // groups of consecutive non-blank lines; blank counts between them
  const G = []; let cur = null, blanks = 0, boundary = false;
  L.forEach(l => {
    if (l.pb) { boundary = true; return; }
    if (!l.s.trim()) { blanks++; return; }
    if (!cur || blanks > 0) { cur = { lines: [], page: l.page, blanksBefore: blanks, boundary: boundary || G.length === 0 }; G.push(cur); blanks = 0; boundary = false; }
    cur.lines.push(l.s);
  });
  return G;
}

const LABELS = [
  [/^EXAM TIP$/, () => ({ k: 'tip' })],
  [/^Note$/, () => ({ k: 'note' })],
  [/^Examples$/, () => ({ k: 'ex' })],
  [/^TYPES OF QUESTIONS ASKED$/, () => ({ k: 'types' })],
  [/^MODEL ANSWER$/, () => ({ k: 'model' })],
  [/^SOLVED EXAMPLE (\d+\.\d+)$/, m => ({ k: 'sol', id: m[1] })],
  [/^PRACTICE SET (\d+) - (.+)$/, m => ({ k: 'prac', n: +m[1], title: m[2] })],
  [/^Formulas & Shortcuts$/, () => ({ k: 'formulas' })],
];
function labelOf(group) {
  const first = group.lines[0], t = first.trim();
  for (const [re, f] of LABELS) { const m = t.match(re); if (m) return f(m); }
  return null;
}

// ---- tables ----
function rowsFromGroups(groups, header) {
  // groups = row groups (each a blank-separated chunk). Column starts from header's first line (or the first row).
  const first = groups[0].lines[0];
  const starts = segs(first).map(s => s.at);
  const cols = starts.length;
  const rows = groups.map(gr => {
    const cells = Array(cols).fill('');
    gr.lines.forEach(line => {
      segs(line).forEach(sg => {
        let c = 0; starts.forEach((st, i) => { if (sg.at >= st - 2) c = i; });
        cells[c] = (cells[c] + ' ' + sg.t).trim();
      });
    });
    return cells.map(clean);
  });
  return rows;
}

function parseGuide(g, data) {
  const L = flatten(data.pages), Gs = groupsOf(L);
  // chapter titles from cover
  const cover = data.pages[0].split('\n').map(l => l.trim().match(/^(\d\d)\s{2,}(.+?)(\s*\(High Priority\))?$/)).filter(Boolean).map(m => ({ n: +m[1], title: m[2].trim(), hp: !!m[3] }));
  const chapters = []; let ch = null;
  // locate chapter starts and the answer key
  let keyStart = Gs.findIndex(x => /^Answer Key$/.test(x.lines[0].trim()));
  if (keyStart < 0) keyStart = Gs.length;
  const body = Gs.slice(0, keyStart);
  // slot detection helper: blank run >=3 inside the flow
  const out = [];
  body.forEach((gr, gi) => {
    const first = gr.lines[0], t = first.trim();
    const m = t.match(/^Chapter (\d+): /);
    if (m) {
      const info = cover[+m[1] - 1]; if (!info) throw new Error(g.key + ' missing cover info ' + m[1]);
      // consume title lines
      const want = norm('Chapter ' + m[1] + ': ' + info.title) + (info.hp ? 'highpriority' : '');
      let acc = '', k = 0; while (k < gr.lines.length && norm(acc).length < want.length) { acc += ' ' + gr.lines[k]; k++; }
      ch = { n: +m[1], title: info.title, hp: info.hp, page: gr.page, blocks: [] }; chapters.push(ch);
      const rest = gr.lines.slice(k);
      if (rest.length) out.push({ ch, gr: { ...gr, lines: rest, blanksBefore: 0, boundary: false } });
      return;
    }
    if (!ch) return;
    out.push({ ch, gr });
  });

  // state machine over groups per chapter
  let curPage = 1;
  const pushB = (ch, b, page) => { b.pg = page || curPage; ch.blocks.push(b); };
  let curBox = null, tableRun = null, headless = false, lastKind = null, formulasNext = false;
  const flushTable = () => {
    if (!tableRun) return;
    const rows = rowsFromGroups(tableRun.groups);
    const blk = tableRun.headless ? { t: 'table', head: null, rows } : { t: 'table', head: rows[0], rows: rows.slice(1) };
    // drop repeated header rows caused by page breaks
    if (blk.head) blk.rows = blk.rows.filter(r => r.join('|') !== blk.head.join('|'));
    pushB(tableRun.ch, blk, tableRun.page); tableRun = null;
  };
  const flushBox = () => { if (!curBox) return; finishBox(curBox); curBox = null; };
  const boxPush = (b, blk) => pushB(b.ch, blk, b.page);
  const pendingFig = { v: false };
  const addFig = (ch, cap, page) => pushB(ch, { t: 'fig', page, cap: cap || '' }, page);

  // a numbered heading sometimes shares its group with the table header that follows it
  for (let i = 0; i < out.length; i++) { const { ch, gr } = out[i];
    if (gr.lines.length >= 2 && ind(gr.lines[0]) <= 1 && (/^\d+\. \S/.test(gr.lines[0].trim()) || gr.lines[0].trim().length < 40) && !isTabular(gr.lines[0]) && isTabular(gr.lines[1]) && !labelOf(gr)) {
      out.splice(i, 1, { ch, gr: { ...gr, lines: [gr.lines[0]] } }, { ch, gr: { ...gr, lines: gr.lines.slice(1), blanksBefore: 1, boundary: false } }); } }
  for (let i = 0; i < out.length; i++) { const { ch, gr } = out[i];
    if (gr.lines.length >= 2 && ind(gr.lines[0]) <= 1 && /^\d+\. [^.:]{3,60}$/.test(gr.lines[0].trim()) && !isTabular(gr.lines[0]) && !isTabular(gr.lines[1]) && !labelOf(gr)) {
      out.splice(i, 1, { ch, gr: { ...gr, lines: [gr.lines[0]] } }, { ch, gr: { ...gr, lines: gr.lines.slice(1), blanksBefore: 1, boundary: false } }); } }
  out.forEach(({ ch, gr }, idx) => {
    curPage = gr.page;
    const lab = labelOf(gr), first = gr.lines[0], t = first.trim(), ind0 = ind(first);
    const bigGap = gr.blanksBefore >= 3 && !gr.boundary;
    // figure slot before this group?
    const isCaption = /^Figure: /.test(t) && ind0 > 8;
    const prevChBlock = ch.blocks[ch.blocks.length - 1];
    if (!lab && !isCaption && bigGap && !curBox) { flushTable(); addFig(ch, '', gr.page); }
    if (isCaption) {
      flushTable(); flushBox();
      const last = ch.blocks[ch.blocks.length - 1];
      if (last && last.t === 'fig' && !last.cap && last.page === gr.page) last.cap = clean(t.replace(/^Figure: /, ''));
      else addFig(ch, clean(t.replace(/^Figure: /, '')), gr.page);
      return;
    }
    if (lab) {
      flushTable(); flushBox();
      if (lab.k === 'formulas') { formulasNext = true; pushB(ch, { t: 'label', x: 'Formulas & shortcuts' }); return; }
      curBox = { ...lab, ch, groups: [gr], page: gr.page, figSlots: 0 };
      if (lab.k === 'sol' || lab.k === 'prac') { /* may contain figure slots */ }
      return;
    }
    // continuation of a box? boxes use indent >= 2 for their content
    if (curBox && (ind0 >= 2 || /^(Q\.|Solution:|Step |Answer:)/.test(t)) && !(/^\d+\. [A-Z]/.test(t) && ind0 === 1)) {
      if (gr.blanksBefore >= 3 && !gr.boundary) curBox.groups.push({ fig: true, page: gr.page });
      curBox.groups.push(gr); return;
    }
    flushBox();
    // heading
    if (ind0 <= 1 && /^\d+\. \S/.test(t) && gr.lines.length === 1 && !isTabular(first)) { flushTable(); pushB(ch, { t: 'h', x: clean(t.replace(/^\d+\.\s*/, '')) }); return; }
    if (ind0 <= 1 && /^(Model [a-z ]+|Strategy|Types of [a-z ]+|When to use which)\b.*$/.test(t) && gr.lines.length === 1 && !isTabular(first) && t.length < 60) { flushTable(); pushB(ch, { t: 'h', x: clean(t) }); return; }
    // table rows
    if (isTabular(first) && ind0 <= 2) {
      if (!tableRun || tableRun.ch !== ch) { flushTable(); tableRun = { ch, groups: [], headless: formulasNext, page: gr.page }; formulasNext = false; }
      tableRun.groups.push(gr); return;
    }
    flushTable();
    // plain paragraph (possibly the indented note-like text)
    pushB(ch, { t: 'p', x: clean(gr.lines.join(' ')) });
  });
  flushTable(); flushBox();

  function finishBox(b) {
    const lines = []; const figs = [];
    b.groups[0] = { ...b.groups[0], lines: b.groups[0].lines.slice(1) };
    b.groups.forEach(gr => { if (gr.fig) { lines.push('\u0000FIG'); return; } gr.lines.forEach(l => lines.push(l)); lines.push(''); });
    if (b.k === 'tip' || b.k === 'note') { boxPush(b, { t: 'box', k: b.k, x: clean(lines.join(' ')) }); return; }
    if (b.k === 'ex' || b.k === 'types') {
      const items = []; lines.forEach(l => { if (!l.trim()) return; const m = l.trim().match(/^(?:•|\d+\.)\s*(.*)$/); if (m) items.push(m[1]); else if (items.length) items[items.length - 1] += ' ' + l.trim(); });
      boxPush(b, { t: 'box', k: b.k, items: items.map(clean) }); return;
    }
    if (b.k === 'model') {
      const paras = []; b.groups.forEach(gr => { if (gr.fig) return; let s = ''; gr.lines.forEach((l, i) => { s += l.trim(); if (i < gr.lines.length - 1) s += l.trim().length >= 88 ? ' ' : '\n'; }); paras.push(s); });
      boxPush(b, { t: 'box', k: 'model', paras }); return;
    }
    if (b.k === 'sol') {
      const sol = { t: 'sol', id: b.id, page: b.page, q: [], code: [], steps: [], ans: '', figs: 0 };
      let mode = 'q', qDone = false;
      lines.forEach(raw => {
        if (raw === '\u0000FIG') { sol.figs++; sol['figAt' + sol.figs] = mode; return; }
        const l = raw.trim(); if (!l) return;
        if (/^Q\.\s*/.test(l) && mode === 'q' && !sol.q.length) { sol.q.push(l.replace(/^Q\.\s*/, '')); return; }
        if (/^Solution:/.test(l)) { mode = 'steps'; return; }
        if (/^Step \d+\./.test(l)) { mode = 'steps'; sol.steps.push(l.replace(/^Step \d+\.\s*/, '')); return; }
        if (/^Answer:/.test(l)) { mode = 'ans'; sol.ans = l.replace(/^Answer:\s*/, ''); return; }
        if (mode === 'q') { sol.code.push(raw.replace(/^ {2}/, '')); }
        else if (mode === 'steps') sol.steps[sol.steps.length - 1] += ' ' + l;
        else if (mode === 'ans') sol.ans += ' ' + l;
      });
      sol.q = sol.q.map(clean); sol.steps = sol.steps.map(clean); sol.ans = clean(sol.ans);
      // a multi-line question that wraps (no code): merge
      if (sol.code.length && g.key !== 'P') { sol.q[0] += ' ' + sol.code.map(clean).join(' '); sol.code = []; }
      if (g.key === 'P' && sol.code.length) {
        // leading prose lines (until the first line that looks like code) belong to the question
        const codeRe = /^(function|Set |for |while |if |do\b|switch|display|arr|s\d? ?=|\w+ ?= ?[\w\[(]|return)/;
        while (sol.code.length && !codeRe.test(sol.code[0].trim()) ) sol.q[0] += ' ' + sol.code.shift().trim();
        sol.code = sol.code.filter(x => x.trim());
      }
      if (!sol.code.length) delete sol.code;
      boxPush(b, sol); return;
    }
    if (b.k === 'prac') {
      const items = []; let figs = 0;
      lines.forEach(raw => { if (raw === '\u0000FIG') { figs++; return; } const l = raw.trim(); if (!l) return; const m = l.match(/^(\d+)\.\s*(.*)$/); if (m && +m[1] === items.length + 1) items.push(m[2]); else if (items.length) items[items.length - 1] += ' ' + l; });
      boxPush(b, { t: 'prac', n: b.n, title: b.title, page: b.page, items: items.map(x => ({ q: clean(x) })), figs }); return;
    }
  }

  // ---- answer key ----
  const key = {};
  let curSet = null, hdr = null, rowGroups = [];
  const flushKey = () => { if (curSet === null || !rowGroups.length) { rowGroups = []; return; }
    const rows = rowsFromGroups(rowGroups); rows.forEach(r => { const n = +r[0]; if (n) (key[curSet] = key[curSet] || {})[n] = { q: r[1], a: r[2] }; }); rowGroups = []; };
  Gs.slice(keyStart).forEach(gr0 => {
    const gr = { ...gr0, lines: gr0.lines.filter(l => !/^\s*Answer Key\s*$/.test(l)) };
    if (!gr.lines.length) return;
    const t = gr.lines[0].trim(); const m = t.match(/^Practice Set (\d+): (.+)$/);
    if (m) { flushKey(); curSet = +m[1]; hdr = null; const rest = gr.lines.slice(1).filter(l => !/^\s*#\s+Question\s+Answer/.test(l)); if (rest.length) rowGroups.push({ ...gr, lines: rest }); return; }
    if (/^#\s+Question\s+Answer/.test(t)) { hdr = gr; return; }
    if (curSet !== null) {
      // a row group may start with the "#  Question  Answer" header kept in the same group
      rowGroups.push(gr);
    }
  });
  flushKey();
  chapters.forEach(c => c.blocks.forEach(b => { if (b.t === 'prac') { b.items.forEach((it, i) => { const k = (key[b.n] || {})[i + 1]; if (k) it.a = k.a; else console.warn('  no answer', g.key, b.n, i + 1); }); } }));

  // ---- figures ----
  const slots = []; chapters.forEach(c => c.blocks.forEach(b => { if (b.t === 'fig') slots.push({ b, c, page: b.page }); else if (b.t === 'sol' && b.figs) for (let i = 0; i < b.figs; i++) slots.push({ b, c, page: b.page || c.page, sol: true }); else if (b.t === 'prac' && b.figs) for (let i = 0; i < b.figs; i++) slots.push({ b, c, page: c.page, prac: true }); }));
  return { chapters, key, slots, cover };
}

const result = {};
GUIDES.forEach(g => {
  console.log('==', g.name);
  const data = loadGuide(g);
  const p = parseGuide(g, data);
  result[g.key] = { g, p, data };
});

// ---- assign images to figure slots (matched by page, in document order) ----
function assign(key, p, data) {
  const imgs = [].concat(...Object.keys(data.imgs).map(Number).sort((a, b) => a - b).map(pg => data.imgs[pg].map(i => ({ ...i, page: pg }))));
  const slots = p.slots.map(s => ({ ...s, used: false }));
  let n = 0, orphan = 0;
  imgs.forEach(im => {
    const name = `${key.toLowerCase()}${++n}.png`;
    run(`convert "${im.f}" -strip -background white -alpha remove "${path.join(IMG, name)}"`);
    let sl = slots.find(s => !s.used && s.page === im.page) || slots.find(s => !s.used && Math.abs(s.page - im.page) === 1);
    if (sl) { sl.used = true; if (sl.sol || sl.prac) (sl.b.imgs = sl.b.imgs || []).push(name); else sl.b.src = name; sl.b.w = im.w; }
    else { orphan++; const c = p.chapters.filter(c => c.page <= im.page).pop() || p.chapters[0]; let at = -1; c.blocks.forEach((b, i) => { if ((b.pg || 0) <= im.page) at = i; }); c.blocks.splice(at + 1, 0, { t: 'fig', src: name, cap: '', w: im.w, orphan: true, pg: im.page }); }
  });
  p.chapters.forEach(c => { c.blocks = c.blocks.filter(b => b.t !== 'fig' || b.src); c.blocks.forEach(b => { delete b.page; delete b.figs; delete b.pg; }); });
  console.log(`  ${key}: images ${imgs.length}, slots ${slots.length}, unused slots ${slots.filter(s => !s.used).length}, orphan images ${orphan}`);
}
Object.entries(result).forEach(([k, v]) => assign(k, v.p, v.data));

// ---- restore superscripts (x^2, a^n ...) using PyMuPDF's font flags ----
function supFixer(pdfName) {
  const raw = JSON.parse(run(`python3 "${path.join(__dirname, 'sup.py')}" "${path.join(SRC, pdfName)}"`));
  const strip = (w, m, wo) => { const pre = (w.match(/^(?:•\s*|Step \d+\.\s*|Q\.\s*|\d+\.\s*|Answer:\s*)+/) || [''])[0]; return [w.slice(pre.length), m.slice(pre.length), wo.slice(pre.length)]; };
  const rx = k => new RegExp(k.replace(/\s+/g, '').split('').map(c => c.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')).join('\\s*'), 'g');
  const withMap = [], woMap = new Map();
  raw.forEach(r => { const [w, m, wo] = strip(clean(r.with), clean(r.marked), clean(r.without)); withMap.push([w, m]); (woMap.get(wo) || woMap.set(wo, new Set()).get(wo)).add(m); });
  withMap.sort((a, b) => b[0].length - a[0].length);
  const W = withMap.filter(([w]) => w.replace(/\s/g, '').length >= 4).map(([w, m]) => [rx(w), m]);
  const WO = [...woMap.entries()].filter(([k, v]) => v.size === 1 && k.replace(/\s/g, '').length >= 5).map(([k, v]) => [k.replace(/\s/g, '').length >= 9 ? rx(k) : new RegExp('^' + rx(k).source + '$'), [...v][0]]).sort((a, b) => b[0].source.length - a[0].source.length);
  return str => { let t = str, hit = false; for (const [r, m] of W) { r.lastIndex = 0; if (r.test(t)) { r.lastIndex = 0; t = t.replace(r, () => m); hit = true; } }
    if (!hit) for (const [r, m] of WO) { r.lastIndex = 0; if (r.test(t) && !t.includes(m)) { r.lastIndex = 0; t = t.replace(r, () => m); } } return t; };
}
function walk(o, f, key) { if (typeof o === 'string') return key === 'src' || key === 't' || key === 'k' || key === 'id' ? o : f(o); if (Array.isArray(o)) return o.map(x => walk(x, f, key)); if (o && typeof o === 'object') { const r = {}; for (const k of Object.keys(o)) r[k] = k === 'code' ? o[k] : walk(o[k], f, k); return r; } return o; }
GUIDES.forEach(g => { const fx = supFixer(files.find(f => g.file.test(f))); result[g.key].p.chapters = walk(result[g.key].p.chapters, fx); });

const guides = {};
GUIDES.forEach(g => { const p = result[g.key].p; guides[g.key] = { key: g.key, name: g.name, chapters: p.chapters.map(c => ({ n: c.n, title: c.title, hp: c.hp, blocks: c.blocks })) }; });
fs.writeFileSync(path.join(OUT, 'data', 'guides.js'), '// Generated by tools/parse-guides.js from the study-guide PDFs - do not edit by hand.\nwindow.GUIDES=' + JSON.stringify(guides) + ';\n');
fs.writeFileSync(path.join(TMP, 'dump.json'), JSON.stringify(guides, null, 1));
console.log('guides.js written;', (fs.statSync(path.join(OUT, 'data', 'guides.js')).size / 1024).toFixed(0) + ' KB; dump', path.join(TMP, 'dump.json'));
