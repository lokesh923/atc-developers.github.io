/* Section hubs (Learn, Quick check, Topic practice, Timed tests), fresh-mock builder and the hash router.
   Loaded after app.js, which owns the exam engine (mocks, practice screens, results). */
const ORDER = ['R', 'T', 'V', 'P', 'Z', 'G', 'W'];
const PAT = { R: { n: 15, min: 25, marks: 1 }, T: { n: 10, min: 35, marks: 1 }, V: { n: 20, min: 20, marks: 1 }, P: { n: 5, min: 10, marks: 2 }, Z: { n: 4, min: 10, marks: 2.5 }, G: { n: 5, min: 10, marks: 2 }, W: { n: 1, min: 10, marks: 0 } };
const BLURB = {
  R: 'Data sufficiency, charts and tables, seating and floor puzzles, syllogisms, blood relations, coding and direction sense, with Venn diagrams, dice, clocks and flowcharts.',
  T: 'Number series, ratios, permutation and probability, speed and distance, profit and loss, averages and algebra, many of them built on graphs and figures.',
  V: 'Critical reasoning, corrective usage, error spotting, reading comprehension, para jumbles and vocabulary.',
  P: 'Trace loops, conditionals, sorting and searching, strings and arrays line by line.',
  Z: 'Visual reasoning, word puzzles, number grids and pyramids, Sudoku and logic grids.',
  G: 'Tenses, subject-verb agreement, articles, prepositions, voice, speech and punctuation.',
  W: 'Essays, emails, letters and paragraphs, with model answers and a self-check rubric.',
};
const CAT_RULES = {
  R: [[/Sufficiency/, 'Data Sufficiency'], [/Syllogism/, 'Syllogisms'], [/Statistic|Histogram/, 'Statistical Data Interpretation'], [/Blood|Family/, 'Blood Relations'], [/Coding/, 'Coding-Decoding'], [/Direction/, 'Directional Sense'], [/Arrangement|seating|Linear order|Floor/i, 'Data Arrangement'], [/Interpretation|Bar chart|Pie chart|Line graph|Table/, 'Data Interpretation'], [/Logical|Flowchart/, 'Logical Deduction']],
  T: [[/Series|Progression/, 'Number Series'], [/Permutation|Probability/, 'Permutation, Combination and Probability'], [/Speed|Distance|Boats|track/, 'Time, Speed and Distance'], [/Crypt/, 'Cryptarithmetic'], [/Partnership/, 'Partnerships'], [/Profit/, 'Profit and Loss'], [/Ratio|Mixture|Alligation/, 'Ratios and Proportions'], [/Average|Ages/, 'Averages'], [/Algebra/, 'Algebra'], [/Simplif|Percent|Unit/, 'Simplification']],
  V: [[/Critical/, 'Critical Reasoning'], [/Error Spot/, 'English Error Identification'], [/Sentence Correction|Error Correction/, 'English Error Correction'], [/Reading/, 'Reading Comprehension'], [/Jumble/, 'Para Jumbles'], [/Antonym|Synonym|Analogy|One Word/, 'Synonyms & Antonyms']],
  P: [[/Loop/, 'Loop Tracing (FOR / WHILE)'], [/Switch|Short-circuit|Conditional/, 'Conditional Statements (IF / ELSE)'], [/Algorithm|Search|Sort|Complexity/, 'Basic Algorithms'], [/Array|String|Prefix|Dynamic/, 'Array & String Manipulation Logic']],
  Z: [[/Sudoku/, 'Sudoku'], [/Word/, 'Word Puzzles'], [/Grid|Kakuro/, 'Grid Based Puzzles'], [/Visual/, 'Visual Reasoning']],
  G: [[/Tense/, 'Tenses'], [/Subject-Verb|agreement/i, 'Subject-Verb Agreement'], [/Article|Preposition/, 'Articles & Prepositions'], [/Voice|Passive/, 'Active & Passive Voice'], [/Speech/, 'Direct & Indirect Speech'], [/Punctuation|Confusable/, 'Punctuation']],
  W: [[/Email|Letter/, 'Email / Letter Writing'], [/Essay/, 'Essay Writing']],
};
const CAT_DEFAULT = { R: 'Visual Reasoning', T: 'Other Quantitative', V: 'English Corrective Usage', P: 'Programming Logic', Z: 'Number Based Patterns', G: 'Mixed Grammar', W: 'Paragraph Writing' };
const guideCats = k => (window.GUIDES && GUIDES[k] ? GUIDES[k].chapters.map(c => c.title) : []);
function catsOf(k) { const base = guideCats(k); const extra = [CAT_DEFAULT[k]].filter(c => !base.includes(c)); return base.concat(extra); }
function catOf(q) {
  if (guideCats(q.sec).includes(q.topic)) return q.topic;
  for (const [re, c] of (CAT_RULES[q.sec] || [])) if (re.test(q.topic)) return c;
  return CAT_DEFAULT[q.sec];
}
DATA.questions.forEach(q => { q.cat = catOf(q); if (q.fig === undefined) q.fig = /<svg|<img/.test((q.set || '') + q.q + (q.opts || []).join('')); });
const bySec = k => DATA.questions.filter(q => q.sec === k);

/* ---------- storage: attempts per question ---------- */
const LS = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
};
function noteAnswer(q, a) {
  if (q.type === 'write') return;
  const st = LS.get('infySE_stats', {}); const r = st[q.id] || [0, 0, 0]; r[0]++; const ok = isCorrect(q, a); if (ok) r[1]++; r[2] = ok ? 1 : 0; st[q.id] = r; LS.set('infySE_stats', st);
}
const stats = () => LS.get('infySE_stats', {});
function qHtml(q) { return (q.set ? `<div class="qset">${q.set}</div>` : '') + q.q; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- picking questions ---------- */
// Round-robin over topics so every topic of the section appears, unseen questions first, figure questions preferred when asked.
function pickIds(k, n, o = {}) {
  const st = stats(); const pool = bySec(k).filter(q => (o.fig ? q.fig : true) && (o.cat ? q.cat === o.cat : true));
  const byCat = {}; shuffle(pool).forEach(q => (byCat[q.cat] = byCat[q.cat] || []).push(q));
  const score = q => (st[q.id] ? 2 : 0) + (o.preferFig && !q.fig ? 1 : 0);
  Object.values(byCat).forEach(a => a.sort((x, y) => score(x) - score(y)));
  const cats = shuffle(Object.keys(byCat)), out = [];
  while (out.length < n && cats.some(c => byCat[c].length)) for (const c of cats) { if (out.length >= n) break; const q = byCat[c].shift(); if (q) out.push(q); }
  const order = []; const seen = new Map();
  out.forEach(q => { const key = q.set || ('#' + q.id); if (!seen.has(key)) { seen.set(key, []); order.push(key); } seen.get(key).push(q.id); });
  return [].concat(...order.map(k2 => seen.get(k2)));
}
function freshMock() {
  const n = LS.get('infySE_fresh', 0) + 1; LS.set('infySE_fresh', n);
  const sections = ORDER.map(k => ({ key: k, name: SECNAME[k], ids: pickIds(k, PAT[k].n, { preferFig: ['R', 'T', 'Z'].includes(k) }), minutes: PAT[k].min, marks: PAT[k].marks }));
  startMock({ name: `Fresh Mock ${n}`, note: 'Auto-built from the whole question bank: unseen questions first, every topic covered, figure questions preferred in Reasoning, Technical and Puzzles.', sections });
}

/* ---------- practice sessions ---------- */
function startPractice(k, o = {}) {
  const ids = o.ids || bySec(k).map(q => q.id);
  if (!ids.length) return;
  S = { mode: 'practice', k, ids, qi: 0, ans: {}, checked: {}, start: Date.now(), label: o.label || SECNAME[k], untimed: !!o.untimed, back: location.hash };
  showBar(true); $('#barMock').textContent = o.untimed ? 'Topic practice' : 'Timed practice'; $('#barSec').textContent = S.label;
  stopTimer(); S.timeUp = false;
  if (o.untimed) { $('#timer').textContent = 'Untimed'; $('#timer').classList.remove('low'); S.total = 0; }
  else {
    S.total = Math.round((o.minutes ? o.minutes * 60 : SECRATE[k] * ids.length * 60)); S.deadline = Date.now() + S.total * 1000;
    $('#timer').textContent = fmt(S.total); $('#timer').classList.remove('low');
    tick = setInterval(() => { const left = (S.deadline - Date.now()) / 1000; $('#timer').textContent = fmt(left); $('#timer').classList.toggle('low', left <= 60);
      if (left <= 0) { stopTimer(); S.timeUp = true; S.doneAt = Object.keys(S.checked).length; S.rightAt = S.ids.filter(id => S.checked[id] && isCorrect(QMAP[id], S.ans[id])).length; S.ids.forEach(id => S.checked[id] = true); renderP(); } }, 500);
  }
  renderP();
}

/* ---------- guide rendering ---------- */
const G_ = s => esc(s).replace(/-&gt;/g, '→').replace(/&lt;=/g, '≤').replace(/&gt;=/g, '≥');
const GB = {
  p: b => `<p>${G_(b.x)}</p>`,
  h: b => `<h3 class="gh">${G_(b.x)}</h3>`,
  label: b => `<div class="eyebrow" style="margin-top:14px">${G_(b.x)}</div>`,
  table: b => `<div class="tablewrap"><table class="gt">${b.head ? `<thead><tr>${b.head.map(c => `<th>${G_(c)}</th>`).join('')}</tr></thead>` : ''}<tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${G_(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`,
  box: b => {
    if (b.k === 'tip') return `<div class="gbox tip"><b>Exam tip.</b> ${G_(b.x)}</div>`;
    if (b.k === 'note') return `<div class="gbox note"><b>Note.</b> ${G_(b.x)}</div>`;
    if (b.k === 'ex') return `<div class="gbox ex"><b>Examples</b><ul>${b.items.map(i => `<li>${G_(i)}</li>`).join('')}</ul></div>`;
    if (b.k === 'types') return `<div class="gbox types"><b>Types of questions asked</b><ol>${b.items.map(i => `<li>${G_(i)}</li>`).join('')}</ol></div>`;
    if (b.k === 'model') return `<div class="gbox model"><b>Model answer</b>${b.paras.map(p => `<p style="white-space:pre-line">${G_(p)}</p>`).join('')}</div>`;
    return '';
  },
  fig: b => `<figure class="gfig"><img src="guides/img/${b.src}" alt="${esc(b.cap || 'Figure from the guide')}" loading="lazy">${b.cap ? `<figcaption>${G_(b.cap)}</figcaption>` : ''}</figure>`,
  sol: b => `<div class="gsol"><div class="eyebrow">Solved example ${b.id}</div><p class="gq">${G_(b.q.join(' '))}</p>${b.code ? `<pre>${esc(b.code.join('\n'))}</pre>` : ''}${(b.imgs || []).map(s => `<figure class="gfig"><img src="guides/img/${s}" alt="Figure for solved example ${b.id}" loading="lazy"></figure>`).join('')}
    <details><summary>Show solution</summary><ol class="gsteps">${b.steps.map(s => `<li>${G_(s)}</li>`).join('')}</ol><p class="gans"><b>Answer:</b> ${G_(b.ans)}</p></details></div>`,
  prac: b => `<div class="gprac"><div class="eyebrow">Practice set ${b.n} | ${G_(b.title)}</div><ol>${b.items.map(it => `<li><span>${G_(it.q)}</span>${it.a ? `<details><summary>Answer</summary><b>${G_(it.a)}</b></details>` : ''}</li>`).join('')}</ol>${(b.imgs || []).map(s => `<figure class="gfig"><img src="guides/img/${s}" alt="Figure for the practice set" loading="lazy"></figure>`).join('')}</div>`,
};
const blocksHtml = bl => bl.map(b => (GB[b.t] ? GB[b.t](b) : '')).join('');
const chapStats = c => ({ sol: c.blocks.filter(b => b.t === 'sol').length, prac: c.blocks.filter(b => b.t === 'prac').reduce((a, b) => a + b.items.length, 0) });

/* ---------- router ---------- */
const nav = h => { if (location.hash === h) route(); else location.hash = h; };
window.addEventListener('hashchange', () => { if (!S) route(); });
function route() {
  const p = location.hash.replace(/^#\/?/, '').split('/');
  if (p[0] === 's' && SECNAME[p[1]]) { if (p[2] === 'learn' && p[3] !== undefined) return chapterView(p[1], +p[3]); return hub(p[1], p[2] || 'learn'); }
  renderHome();
}
function home() { stopTimer(); showBar(false); route(); }
const href = h => `href="#/${h}"`;

/* ---------- home ---------- */
function mockCard(m, i) {
  const qn = m.sections.reduce((a, s) => a + s.ids.length, 0), mins = m.sections.reduce((a, s) => a + s.minutes, 0);
  const figN = m.sections.reduce((a, s) => a + s.ids.filter(id => QMAP[id] && QMAP[id].fig).length, 0);
  const short = s => s.key === 'Z' ? 'Puzzle' : s.key === 'G' ? 'Grammar' : s.key === 'W' ? 'Writing' : s.name.split(' ')[0];
  return `<div class="panel mockcard">
    <div class="row"><h2>${m.name}</h2><span class="chip">${qn} questions | ${mins} min</span></div>
    <div class="chips">${m.sections.map(s => `<span class="chip">${short(s)} ${s.ids.length}Q · ${s.minutes}m</span>`).join('')}${figN ? `<span class="chip sig">${figN} figure-based</span>` : ''}</div>
    ${m.note ? `<p class="muted" style="margin:0;font-size:.9rem">${m.note}</p>` : ''}
    <div><button class="btn primary" data-mock="${i}">Start ${m.name}</button></div></div>`;
}
function renderHome() {
  showBar(false); window.scrollTo(0, 0); document.title = 'Infosys SE Practice Arena';
  const hist = store.get(), st = stats();
  const full = [], quick = [];
  DATA.mocks.forEach((m, i) => (m.sections.length >= 7 ? full : quick).push(mockCard(m, i)));
  const secCards = ORDER.map(k => {
    const qs = bySec(k), att = qs.filter(q => st[q.id]).length, fig = qs.filter(q => q.fig).length, g = window.GUIDES && GUIDES[k];
    return `<a class="panel seccard" ${href('s/' + k)}><div class="row"><h3>${SECNAME[k]}</h3><span class="chip">${PAT[k].n} Q | ${PAT[k].min} min</span></div>
      <p class="muted" style="margin:0;font-size:.9rem">${BLURB[k]}</p>
      <div class="chips"><span class="chip">${qs.length} practice questions</span>${fig ? `<span class="chip sig">${fig} with figures</span>` : ''}${g ? `<span class="chip">${g.chapters.length} study chapters</span>` : ''}${att ? `<span class="chip good">${att} attempted</span>` : ''}</div>
      <span class="btn primary" style="align-self:flex-start">Open ${k === 'Z' ? 'Puzzles' : SECNAME[k].split(' ')[0] === 'English' ? SECNAME[k] : SECNAME[k].split(' ')[0]} practice</span></a>`;
  }).join('');
  app.innerHTML = `<div class="stack">
    <section class="stack" style="gap:8px">
      <div class="eyebrow">Infosys Systems Engineer | Written test practice</div>
      <h1>Prepare section by section, then test yourself against the clock</h1>
      <p class="muted" style="margin:0;max-width:70ch">Full mock tests follow the real Infosys SE pattern: seven sections, each with its own timer, answers final once submitted. Every section also has its own practice area with study notes from the guides, quick checks, topic drills and figure-based questions.</p>
    </section>
    <section class="stack" style="gap:10px"><h2>Full mock tests</h2><div class="grid2">${full.join('')}
      <div class="panel mockcard"><div class="row"><h2>Fresh Mock (auto-built)</h2><span class="chip">60 questions | 120 min</span></div>
        <p class="muted" style="margin:0;font-size:.9rem">A new test every time, drawn from the whole bank: unseen questions first, every topic covered, figure questions preferred in Reasoning, Technical and Puzzles.</p>
        <div><button class="btn primary" id="fresh">Build and start a fresh mock</button></div></div></div></section>
    <section class="stack" style="gap:10px"><h2>Practice by section</h2><div class="grid2 seclist">${secCards}</div></section>
    ${quick.length ? `<section class="stack" style="gap:10px"><h2>Quick figure tests</h2><div class="grid2">${quick.join('')}</div></section>` : ''}
    <section class="panel">
      <h2>Exam pattern</h2>
      <div class="tablewrap" style="margin-top:8px"><table class="pat"><thead><tr><th>Section</th><th>Questions</th><th>Marks</th><th>Time</th><th>Safe target (80%)</th></tr></thead><tbody>
      ${ORDER.map(k => `<tr><td>${SECNAME[k]}</td><td>${PAT[k].n}</td><td>${k === 'W' ? 'NA' : +(PAT[k].n * PAT[k].marks).toFixed(1)}</td><td>${PAT[k].min} min</td><td>${k === 'W' ? 'Evaluated separately' : Math.ceil(PAT[k].n * 0.8 - 1e-9) + ' correct'}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="cutbox"><b>About the cutoff.</b> Last year's sectional cutoff was around 70%, but Infosys does not disclose the exact cutoff and it changes with the test's difficulty and the number of open positions. Aim for 80% or more in every section.</div>
    </section>
    ${hist.length ? `<section class="panel"><h2>Your recent attempts</h2><div class="tablewrap" style="margin-top:8px"><table class="pat"><thead><tr><th>Test</th><th>Date</th><th>Score</th><th>Sections in the safe zone</th></tr></thead><tbody>${hist.map(h => `<tr><td>${esc(h.name)}</td><td>${h.date}</td><td>${h.score}</td><td>${h.cleared}</td></tr>`).join('')}</tbody></table></div></section>` : ''}
  </div>`;
  app.querySelectorAll('[data-mock]').forEach(b => b.addEventListener('click', () => startMock(+b.dataset.mock)));
  $('#fresh').addEventListener('click', freshMock);
}

/* ---------- section hub ---------- */
const TABS = [['learn', 'Learn'], ['quick', 'Quick check'], ['topics', 'Topic practice'], ['timed', 'Timed tests']];
function accChip(qs, st) { const t = qs.filter(q => st[q.id]); if (!t.length) return '<span class="muted">not started</span>'; const c = t.filter(q => st[q.id][2]).length; const p = Math.round(c / t.length * 100); return `<span class="chip ${p >= 80 ? 'good' : p >= 60 ? 'sig' : 'bad'}">${p}% (${c}/${t.length})</span>`; }
function hub(k, tab) {
  showBar(false); window.scrollTo(0, 0); document.title = SECNAME[k] + ' | Infosys SE Practice Arena';
  const qs = bySec(k), st = stats(), g = window.GUIDES && GUIDES[k], pt = PAT[k];
  let body = '';
  if (tab === 'learn') {
    body = g ? `<p class="muted" style="margin:0 0 12px">Study notes from the guide, chapter by chapter. High-priority chapters appear most often in the test, so study them first.</p><div class="grid2">${g.chapters.map((c, i) => {
      const s = chapStats(c), n = qs.filter(q => q.cat === c.title).length;
      return `<div class="panel stack" style="gap:8px"><div class="row" style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><h3>${c.n}. ${esc(c.title)}</h3>${c.hp ? '<span class="chip sig">High priority</span>' : ''}</div>
        <div class="chips">${s.sol ? `<span class="chip">${s.sol} solved examples</span>` : ''}${s.prac ? `<span class="chip">${s.prac} quick-check questions</span>` : ''}<span class="chip">${n} drill questions</span></div>
        <div class="secbtns"><a class="btn primary" ${href(`s/${k}/learn/${i}`)}>Read chapter</a>${n ? `<button class="btn" data-drill="${esc(c.title)}">Practise (${n})</button>` : ''}</div></div>`;
    }).join('')}</div>` : '<p class="muted">No study notes for this section.</p>';
  } else if (tab === 'quick') {
    body = g ? `<p class="muted" style="margin:0 0 12px">Short practice sets from the guide with answers. Try each one on paper, then open the answer.</p>` + g.chapters.map(c => c.blocks.filter(b => b.t === 'prac').map(b => `<details class="rv"><summary><strong>${c.n}. ${esc(c.title)}</strong> <span class="muted">| ${b.items.length} questions</span></summary><div style="margin-top:8px">${GB.prac(b)}</div></details>`).join('')).join('') : '';
  } else if (tab === 'topics') {
    const cats = catsOf(k).filter(c => qs.some(q => q.cat === c));
    body = `<p class="muted" style="margin:0 0 12px">Untimed practice with instant feedback and a full explanation after every question. Pick a topic, or only the questions that come with a figure.</p>
      <div class="tablewrap"><table class="pat"><thead><tr><th>Topic</th><th>Questions</th><th>With figures</th><th>Your accuracy</th><th></th></tr></thead><tbody>
      ${cats.map(c => { const a = qs.filter(q => q.cat === c), f = a.filter(q => q.fig); return `<tr><td>${esc(c)}</td><td>${a.length}</td><td>${f.length}</td><td>${accChip(a, st)}</td><td style="white-space:nowrap"><button class="btn" data-drill="${esc(c)}">Practise</button>${f.length ? ` <button class="btn" data-drill="${esc(c)}" data-fig="1">Figures only</button>` : ''}</td></tr>`; }).join('')}
      </tbody></table></div>
      <div class="secbtns" style="margin-top:14px"><button class="btn primary" data-drill="*">All ${qs.length} questions, untimed</button>${qs.some(q => q.fig) ? `<button class="btn" data-drill="*" data-fig="1">All ${qs.filter(q => q.fig).length} figure questions</button>` : ''}<button class="btn warn" id="mistakes">Retry my mistakes</button></div>`;
  } else {
    const nfig = qs.filter(q => q.fig).length;
    body = `<p class="muted" style="margin:0 0 12px">Real exam speed. The timer runs for the whole set and every answer is shown at the end.</p><div class="grid2">
      <div class="panel stack" style="gap:8px"><h3>Exam-pattern sectional test</h3><p class="muted" style="margin:0">${pt.n} question${pt.n > 1 ? 's' : ''} in ${pt.min} minutes, drawn from every topic, unseen questions first.</p><div><button class="btn primary" id="sect">Start sectional test</button></div></div>
      ${nfig >= 3 ? `<div class="panel stack" style="gap:8px"><h3>Figure-based sectional test</h3><p class="muted" style="margin:0">${Math.min(pt.n, nfig)} questions that all come with a chart, diagram or figure, at the real time per question.</p><div><button class="btn primary" id="sectfig">Start figure test</button></div></div>` : ''}
      <div class="panel stack" style="gap:8px"><h3>Whole question bank, timed</h3><p class="muted" style="margin:0">All ${qs.length} questions with one timer (${fmt(Math.round(SECRATE[k] * qs.length * 60))}).</p><div><button class="btn" id="allt">Start</button></div></div></div>`;
  }
  app.innerHTML = `<div class="stack"><div>
    <a class="muted" ${href('')} style="font-size:.9rem">&larr; All sections</a>
    <div class="eyebrow" style="margin-top:10px">Section practice</div><h1>${SECNAME[k]}</h1>
    <div class="chips" style="margin-top:8px"><span class="chip">${pt.n} questions in the exam</span><span class="chip">${pt.min} minutes</span>${k === 'W' ? '' : `<span class="chip">${+(pt.n * pt.marks).toFixed(1)} marks</span>`}<span class="chip">${qs.length} practice questions</span>${qs.some(q => q.fig) ? `<span class="chip sig">${qs.filter(q => q.fig).length} with figures</span>` : ''}<span class="chip">Your accuracy: ${accChip(qs, st)}</span></div></div>
    <nav class="tabs" role="tablist">${TABS.map(([t, l]) => `<a role="tab" aria-selected="${t === tab}" class="${t === tab ? 'on' : ''}" ${href(`s/${k}/${t}`)}>${l}</a>`).join('')}</nav>
    <section>${body}</section></div>`;
  app.querySelectorAll('[data-drill]').forEach(b => b.addEventListener('click', () => {
    const c = b.dataset.drill, fig = !!b.dataset.fig; const ids = qs.filter(q => (c === '*' || q.cat === c) && (!fig || q.fig)).map(q => q.id);
    startPractice(k, { ids, untimed: true, label: `${c === '*' ? SECNAME[k] : c}${fig ? ' (figures)' : ''}` });
  }));
  const on = (id, f) => { const e = $('#' + id); if (e) e.addEventListener('click', f); };
  on('sect', () => startPractice(k, { ids: pickIds(k, pt.n, { preferFig: ['R', 'T', 'Z'].includes(k) }), minutes: pt.min, label: `${SECNAME[k]} sectional` }));
  on('sectfig', () => startPractice(k, { ids: pickIds(k, Math.min(pt.n, qs.filter(q => q.fig).length), { fig: true }), minutes: pt.min * Math.min(pt.n, qs.filter(q => q.fig).length) / pt.n, label: `${SECNAME[k]} figure test` }));
  on('allt', () => startPractice(k, { label: `${SECNAME[k]} full bank` }));
  on('mistakes', () => { const ids = qs.filter(q => st[q.id] && !st[q.id][2]).map(q => q.id); if (!ids.length) { alert('No mistakes recorded yet. Attempt some questions first.'); return; } startPractice(k, { ids, untimed: true, label: 'Retry my mistakes' }); });
}

function chapterView(k, i) {
  const g = window.GUIDES && GUIDES[k], c = g && g.chapters[i]; if (!c) return hub(k, 'learn');
  showBar(false); window.scrollTo(0, 0); document.title = c.title + ' | ' + SECNAME[k];
  const qs = bySec(k), n = qs.filter(q => q.cat === c.title).length, f = qs.filter(q => q.cat === c.title && q.fig).length;
  const prev = g.chapters[i - 1], next = g.chapters[i + 1];
  app.innerHTML = `<div class="stack"><div>
    <a class="muted" ${href(`s/${k}/learn`)} style="font-size:.9rem">&larr; ${SECNAME[k]} chapters</a>
    <div class="eyebrow" style="margin-top:10px">Chapter ${c.n}${c.hp ? ' | High priority' : ''}</div><h1>${esc(c.title)}</h1></div>
    <article class="panel guide">${blocksHtml(c.blocks)}</article>
    <div class="panel stack" style="gap:8px"><h3>Now practise it</h3><p class="muted" style="margin:0">${n ? `${n} questions on this topic${f ? `, ${f} with figures` : ''}.` : 'No drill questions on this topic yet.'}</p>
      <div class="secbtns">${n ? `<button class="btn primary" id="dr">Practise this topic</button>` : ''}${f ? `<button class="btn" id="drf">Figure questions only</button>` : ''}</div></div>
    <div class="actions">${prev ? `<a class="btn" ${href(`s/${k}/learn/${i - 1}`)}>&larr; ${esc(prev.title)}</a>` : '<span></span>'}${next ? `<a class="btn primary" ${href(`s/${k}/learn/${i + 1}`)}>${esc(next.title)} &rarr;</a>` : `<a class="btn" ${href(`s/${k}/topics`)}>Topic practice</a>`}</div></div>`;
  const go = fig => startPractice(k, { ids: qs.filter(q => q.cat === c.title && (!fig || q.fig)).map(q => q.id), untimed: true, label: c.title + (fig ? ' (figures)' : '') });
  if ($('#dr')) $('#dr').addEventListener('click', () => go(false)); if ($('#drf')) $('#drf').addEventListener('click', () => go(true));
}

route();
