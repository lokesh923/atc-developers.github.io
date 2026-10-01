// Shared helpers for generating the figure-based questions (SVG strings use the theme classes in style.css).
const r1 = n => +(+n).toFixed(1);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let uid = 0;
const MARK = `<defs><marker id='ah{ID}' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' class='mk'/></marker></defs>`;

function fig(w, h, inner, title) {
  const id = 'f' + (++uid);
  return `<div class='fig'><svg viewBox='0 0 ${w} ${h}' width='${w}' role='img' aria-label='${esc(title || 'Figure')}' xmlns='http://www.w3.org/2000/svg'>${MARK.replace('{ID}', id)}${inner.replace(/url\(#ah\)/g, `url(#ah${id})`)}</svg></div>`;
}
const T = (x, y, t, o = {}) => `<text x='${r1(x)}' y='${r1(y)}' font-size='${o.s || 12}' text-anchor='${o.a || 'middle'}'${o.b ? " font-weight='700'" : ''}${o.rot ? ` transform='rotate(${o.rot} ${r1(x)} ${r1(y)})'` : ''} class='${o.c || ''}'>${t}</text>`;
const L = (x1, y1, x2, y2, c = 'ln', extra = '') => `<line x1='${r1(x1)}' y1='${r1(y1)}' x2='${r1(x2)}' y2='${r1(y2)}' class='${c}' ${extra}/>`;
const A = (x1, y1, x2, y2, c = 'ln') => L(x1, y1, x2, y2, c, "stroke-width='2.2' marker-end='url(#ah)'");
const R = (x, y, w, h, c = 'paper sline', extra = '') => `<rect x='${r1(x)}' y='${r1(y)}' width='${r1(w)}' height='${r1(h)}' class='${c}' ${extra}/>`;
const C = (x, y, r, c = 'paper sline') => `<circle cx='${r1(x)}' cy='${r1(y)}' r='${r1(r)}' class='${c}'/>`;
const P = (pts, c = 'paper sline') => `<polygon points='${pts.map(p => p.map(r1).join(',')).join(' ')}' class='${c}'/>`;

const SER = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

// ---------- charts ----------
function legend(names, w) { let x = w - 14; const parts = []; for (let k = names.length - 1; k >= 0; k--) { const tw = names[k].length * 6.4 + 22; x -= tw; parts.push(R(x, 4, 10, 10, SER[k], '') + T(x + 14, 13, names[k], { a: 'start', s: 11 })); x -= 12; } return parts.join(''); }
function barChart({ cats, series, max, step, w = 460, h = 280, ylabel = '', names, title = 'Bar chart', stacked = false }) {
  const x0 = 56, y0 = h - 34, top = 22, plotW = w - x0 - 14, plotH = y0 - top;
  let s = '';
  for (let v = 0; v <= max; v += step) {
    const y = y0 - v / max * plotH;
    s += L(x0, y, w - 14, y, 'grd') + T(x0 - 6, y + 4, v, { a: 'end', s: 11 });
  }
  if (ylabel) s += T(14, top + plotH / 2, ylabel, { s: 11, rot: -90 });
  const gw = plotW / cats.length, n = series.length, bw = Math.min(34, gw * 0.7 / (stacked ? 1 : n));
  cats.forEach((c, i) => {
    const cx = x0 + gw * (i + 0.5);
    if (stacked) {
      let acc = 0;
      series.forEach((se, k) => {
        const v = se[i], hh = v / max * plotH, y = y0 - (acc + v) / max * plotH;
        s += R(cx - bw / 2, y, bw, hh, SER[k]) + (hh > 14 ? T(cx, y + hh / 2 + 4, v, { s: 10, c: 'onfill' }) : '');
        acc += v;
      });
    } else {
      series.forEach((se, k) => {
        const v = se[i], hh = v / max * plotH, x = cx - n * bw / 2 + k * bw, y = y0 - hh;
        s += R(x, y, bw - 2, hh, SER[k]) + T(x + bw / 2 - 1, y - 4, v, { s: 11 });
      });
    }
    s += T(cx, y0 + 16, c, { s: 12 });
  });
  s += L(x0, y0, w - 14, y0, 'sline') + L(x0, top, x0, y0, 'sline');
  if (names) s += legend(names, w);
  return fig(w, h, s, title);
}

function lineChart({ cats, series, min, max, step, w = 460, h = 280, ylabel = '', names, title = 'Line graph' }) {
  const x0 = 56, y0 = h - 34, top = 26, plotW = w - x0 - 20, plotH = y0 - top;
  let s = '';
  for (let v = min; v <= max; v += step) {
    const y = y0 - (v - min) / (max - min) * plotH;
    s += L(x0, y, w - 14, y, 'grd') + T(x0 - 6, y + 4, v, { a: 'end', s: 11 });
  }
  if (ylabel) s += T(14, top + plotH / 2, ylabel, { s: 11, rot: -90 });
  const gw = plotW / cats.length;
  const px = i => x0 + gw * (i + 0.5), py = v => y0 - (v - min) / (max - min) * plotH;
  series.forEach((se, k) => {
    s += `<polyline points='${se.map((v, i) => r1(px(i)) + ',' + r1(py(v))).join(' ')}' class='${SER[k]} nofill' fill='none' stroke-width='2.4' style='fill:none;stroke:var(--${['accent', 'signal', 'good', 'bad'][k]})'/>`;
    se.forEach((v, i) => { s += C(px(i), py(v), 4, SER[k]) + T(px(i), py(v) + (k % 2 ? 16 : -8), v, { s: 11 }); });
  });
  cats.forEach((c, i) => { s += T(px(i), y0 + 16, c, { s: 12 }); });
  s += L(x0, y0, w - 14, y0, 'sline') + L(x0, top, x0, y0, 'sline');
  if (names) s += legend(names, w);
  return fig(w, h, s, title);
}

function pieChart({ slices, total, w = 440, h = 300, title = 'Pie chart' }) {
  const cx = w / 2, cy = h / 2 + 4, rad = 96;
  let ang = -Math.PI / 2, s = '';
  const sum = slices.reduce((a, b) => a + b.pct, 0);
  slices.forEach((sl, i) => {
    const a2 = ang + sl.pct / sum * 2 * Math.PI;
    const x1 = cx + rad * Math.cos(ang), y1 = cy + rad * Math.sin(ang), x2 = cx + rad * Math.cos(a2), y2 = cy + rad * Math.sin(a2);
    s += `<path d='M${r1(cx)},${r1(cy)} L${r1(x1)},${r1(y1)} A${rad},${rad} 0 ${a2 - ang > Math.PI ? 1 : 0} 1 ${r1(x2)},${r1(y2)} Z' class='${SER[i]} wedge'/>`;
    const m = (ang + a2) / 2, lx = cx + (rad + 14) * Math.cos(m), ly = cy + (rad + 14) * Math.sin(m);
    s += T(lx, ly + 4, `${sl.label} ${sl.pct}%`, { a: Math.cos(m) >= 0 ? 'start' : 'end', s: 12 });
    ang = a2;
  });
  if (total) s += T(cx, h - 6, total, { s: 12, b: 1 });
  return fig(w, h, s, title);
}

function histogram({ bins, counts, w = 440, h = 270, ymax, step = 3, xlabel = 'Marks', ylabel = 'Students' }) {
  const x0 = 50, y0 = h - 44, top = 18, plotW = w - x0 - 14, plotH = y0 - top, bw = plotW / bins.length;
  let s = '';
  for (let v = 0; v <= ymax; v += step) { const y = y0 - v / ymax * plotH; s += L(x0, y, w - 14, y, 'grd') + T(x0 - 6, y + 4, v, { a: 'end', s: 11 }); }
  bins.forEach((b, i) => {
    const hh = counts[i] / ymax * plotH;
    s += R(x0 + bw * i + 1, y0 - hh, bw - 2, hh, 'a') + T(x0 + bw * (i + 0.5), y0 - hh - 4, counts[i], { s: 11 }) + T(x0 + bw * (i + 0.5), y0 + 16, b, { s: 12 });
  });
  s += L(x0, y0, w - 14, y0, 'sline') + L(x0, top, x0, y0, 'sline') + T(x0 + plotW / 2, h - 6, xlabel, { s: 12, b: 1 }) + T(14, top + plotH / 2, ylabel, { s: 11, rot: -90 });
  return fig(w, h, s, 'Histogram');
}

// Three-set Venn. v = {A,B,C,AB,BC,AC,ABC,none}
function venn3({ names, v, total, w = 400, h = 320 }) {
  let s = `<circle cx='150' cy='120' r='80' class='vc1'/><circle cx='250' cy='120' r='80' class='vc2'/><circle cx='200' cy='205' r='80' class='vc3'/>`;
  s += T(92, 48, names[0], { b: 1, s: 14 }) + T(308, 48, names[1], { b: 1, s: 14 }) + T(200, 312, names[2], { b: 1, s: 14 });
  s += T(115, 108, v.A, { b: 1, s: 15 }) + T(285, 108, v.B, { b: 1, s: 15 }) + T(200, 252, v.C, { b: 1, s: 15 });
  s += T(200, 92, v.AB, { b: 1, s: 15 }) + T(256, 188, v.BC, { b: 1, s: 15 }) + T(144, 188, v.AC, { b: 1, s: 15 }) + T(200, 155, v.ABC, { b: 1, s: 15 });
  if (v.none !== undefined) s += R(330, 252, 62, 44, 'soft', "rx='6'") + T(361, 270, 'None', { s: 11 }) + T(361, 288, v.none, { b: 1, s: 14 });
  if (total) s += T(14, 16, `Total = ${total}`, { a: 'start', b: 1, s: 12 });
  return fig(w, h, s, 'Venn diagram of three sets');
}
function venn2({ names, v, w = 360, h = 220 }) {
  let s = `<circle cx='140' cy='110' r='80' class='vc1'/><circle cx='220' cy='110' r='80' class='vc2'/>`;
  s += T(100, 26, names[0], { b: 1, s: 14 }) + T(260, 26, names[1], { b: 1, s: 14 });
  s += T(100, 115, v.A, { b: 1, s: 16 }) + T(180, 115, v.AB, { b: 1, s: 16 }) + T(260, 115, v.B, { b: 1, s: 16 });
  return fig(w, h, s, 'Venn diagram of two sets');
}

// Seating circle. seats[i] = label (seat 1 at top, numbered clockwise). cw arrow shown.
function circleSeats({ seats, labels = true, w = 360, h = 330, facing = 'centre' }) {
  const n = seats.length, cx = w / 2, cy = h / 2, rt = 56, rs = 100;
  let s = C(cx, cy, rt, 'soft') + T(cx, cy + 4, 'TABLE', { s: 12, b: 1 });
  seats.forEach((p, i) => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n, x = cx + rs * Math.cos(a), y = cy + rs * Math.sin(a);
    s += C(x, y, 19) + T(x, y + 5, p || '?', { s: 15, b: 1 });
    if (facing === 'mixed') { const out = i % 2 === 1, d = out ? 1 : -1, x1 = cx + (rs + d * -0) * Math.cos(a), x0 = cx + (rs + d * 19) * Math.cos(a), y0 = cy + (rs + d * 19) * Math.sin(a), x2 = cx + (rs + d * 31) * Math.cos(a), y2 = cy + (rs + d * 31) * Math.sin(a); s += A(x0, y0, x2, y2, 'ln sb'); }
    if (labels) { const lr = rs + 30, c = Math.cos(a); s += T(cx + lr * c + (Math.abs(c) > 0.3 ? Math.sign(c) * 14 : 0), cy + lr * Math.sin(a) + 4, `Seat ${i + 1}`, { s: 10, c: 'muted', a: Math.abs(c) < 0.3 ? 'middle' : c > 0 ? 'start' : 'end' }); }
  });
  s += T(w - 8, 18, 'Seats are numbered clockwise', { a: 'end', s: 10 });
  s += T(cx, h - 4, facing === 'centre' ? 'All face the centre.' : facing === 'mixed' ? 'Arrows show the direction each person faces.' : 'All face outside.', { s: 11 });
  return fig(w, h, s, 'Circular seating arrangement');
}

// Building with floors (floor 1 bottom). known = {floor: label}
function building({ floors, known, w = 300 }) {
  const fh = 36, top = 34, h = top + floors * fh + 24;
  let s = P([[70, top], [150, 8], [230, top]], 'soft sline');
  for (let f = floors; f >= 1; f--) {
    const y = top + (floors - f) * fh;
    s += R(90, y, 120, fh, 'paper sline') + T(80, y + fh / 2 + 4, `Floor ${f}`, { a: 'end', s: 11 }) + T(150, y + fh / 2 + 6, known[f] || '?', { s: 16, b: 1 });
  }
  return fig(w, h, s, 'Building floors');
}

// Direction paths. Each diagram: {segs:[{d:'N|E|S|W',len,label?}], k, start:'S', end:'E', cap}. Drawn side by side in one figure.
const DV = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] };
function pathsFig(diagrams, { boxW = 200, boxH = 200, north = true } = {}) {
  let s = '';
  const trace = (segs, k) => { const pts = [[0, 0]]; segs.forEach(sg => { const l = sg.len * k, p = pts[pts.length - 1]; pts.push([p[0] + DV[sg.d][0] * l, p[1] + DV[sg.d][1] * l]); }); return pts; };
  diagrams.forEach((dg, di) => {
    const k = dg.k || 14, paths = [{ segs: dg.segs, end: dg.end || 'E', cls: 'sa', endCls: 'b' }].concat(dg.alt ? [{ segs: dg.alt.segs, end: dg.alt.end, cls: 'sb', endCls: 'c' }] : []);
    const all = paths.map(p => trace(p.segs, k)), flat = [].concat(...all);
    const xs = flat.map(p => p[0]), ys = flat.map(p => p[1]);
    const minx = Math.min(...xs), maxx = Math.max(...xs), miny = Math.min(...ys), maxy = Math.max(...ys);
    const ox = di * boxW + (boxW - (maxx - minx)) / 2 - minx, oy = 14 + (boxH - 40 - (maxy - miny)) / 2 - miny;
    paths.forEach((pa, pi) => {
      const pts = all[pi];
      pa.segs.forEach((sg, i) => {
        const a = pts[i], b = pts[i + 1];
        s += A(a[0] + ox, a[1] + oy, b[0] + ox, b[1] + oy, 'ln ' + pa.cls);
        const mx = (a[0] + b[0]) / 2 + ox, my = (a[1] + b[1]) / 2 + oy, h = sg.d === 'E' || sg.d === 'W';
        s += T(mx + (h ? 0 : 7), my + (h ? -7 : 4), sg.label || `${sg.len} km`, { a: h ? 'middle' : 'start', s: 11 });
      });
      const en = pts[pts.length - 1];
      s += C(en[0] + ox, en[1] + oy, 5, pa.endCls) + T(en[0] + ox + (pa.segs.length && pa.segs[pa.segs.length - 1].d === 'W' ? -12 : 12), en[1] + oy + 18, pa.end, { b: 1, s: 13 });
    });
    s += C(ox, oy, 5, 'mk') + T(ox - 10, oy + 16, dg.start || 'S', { b: 1, s: 13 });
    if (dg.cap) s += T(di * boxW + boxW / 2, boxH - 6, dg.cap, { s: 12, b: 1 });
  });
  const W = boxW * diagrams.length + (north ? 30 : 0);
  if (north) s += A(W - 16, 40, W - 16, 10, 'ln') + T(W - 16, 54, 'N', { b: 1, s: 12 });
  return fig(W, boxH, s, 'Path diagrams (North is at the top)');
}
const pathFig = (o) => pathsFig([o], { boxW: o.w || 220, boxH: o.h || 200, north: o.north !== false });

// Clock face
function clock(hh, mm, { size = 150, label = '' } = {}) {
  const r = size / 2 - 6, cx = size / 2, cy = size / 2;
  let s = C(cx, cy, r, 'paper sline').replace("class='", "stroke-width='2.5' class='");
  for (let i = 1; i <= 12; i++) {
    const a = i * Math.PI / 6;
    s += T(cx + (r - 14) * Math.sin(a), cy - (r - 14) * Math.cos(a) + 4, i, { s: 11 });
    s += L(cx + (r - 4) * Math.sin(a), cy - (r - 4) * Math.cos(a), cx + r * Math.sin(a), cy - r * Math.cos(a), 'ln');
  }
  const ha = ((hh % 12) + mm / 60) * Math.PI / 6, ma = mm * Math.PI / 30;
  s += L(cx, cy, cx + r * 0.5 * Math.sin(ha), cy - r * 0.5 * Math.cos(ha), 'ln', "stroke-width='4'");
  s += L(cx, cy, cx + r * 0.78 * Math.sin(ma), cy - r * 0.78 * Math.cos(ma), 'ln sa', "stroke-width='2'");
  s += C(cx, cy, 3, 'mk');
  if (label) s += T(cx, size + 14, label, { b: 1, s: 12 });
  return { w: size, h: size + (label ? 22 : 4), inner: s };
}
function clocks(list, { size = 150 } = {}) {
  let s = '', x = 0, h = 0;
  list.forEach(c => { const k = clock(c.h, c.m, { size, label: c.label }); s += `<g transform='translate(${x},0)'>${k.inner}</g>`; x += size + 20; h = Math.max(h, k.h); });
  return fig(x - 20, h, s, 'Clock faces');
}

// Die (oblique cube) with top,front,right
function dieAt(ox, oy, top, front, right, label) {
  let s = P([[ox, oy + 30], [ox + 56, oy + 30], [ox + 56, oy + 86], [ox, oy + 86]], 'paper sline');
  s += P([[ox, oy + 30], [ox + 26, oy + 6], [ox + 82, oy + 6], [ox + 56, oy + 30]], 'soft sline');
  s += P([[ox + 56, oy + 30], [ox + 82, oy + 6], [ox + 82, oy + 62], [ox + 56, oy + 86]], 'soft2 sline');
  s += T(ox + 28, oy + 66, front, { s: 22, b: 1 }) + T(ox + 41, oy + 24, top, { s: 15, b: 1 }) + T(ox + 69, oy + 52, right, { s: 15, b: 1 });
  if (label) s += T(ox + 41, oy + 104, label, { s: 11 });
  return s;
}
function dice(views, { names } = {}) { // views: [[top,front,right],...]
  let s = '', x = 10;
  views.forEach((v, i) => { s += dieAt(x, 10, v[0], v[1], v[2], names ? names[i] : `View ${i + 1}`); x += 100; });
  return fig(x + 4, 126, s, 'Dice views');
}

// ---------- html helpers ----------
const tbl = (head, rows, cls = 'dt') => `<table class='${cls}'><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const dir = t => `<p class='dir'>${t}</p>`;
const pp = t => `<p>${t}</p>`;

// ---------- question builders ----------
let nextId = 4000;
const bank = [];
function setId(n) { nextId = n; }
// mcq: opts array, ans = index of correct option. Options are shuffled deterministically unless fixed:true.
function mcq(sec, topic, q, opts, ansIdx, exp, extra = {}) {
  if (ansIdx < 0 || ansIdx >= opts.length) throw new Error('bad ans for ' + topic + ' : ' + q.slice(0, 60));
  const dup = new Set(opts.map(String));
  if (dup.size !== opts.length) throw new Error('duplicate options in ' + topic + ': ' + opts);
  const o = { id: nextId++, sec, topic, type: 'mcq', q, exp, opts, ans: ansIdx, ...extra };
  bank.push(o); return o;
}
// Make options with the correct value placed at slot `pos` and distractors filled around it.
function pick(correct, distractors, pos) {
  const d = distractors.filter(x => String(x) !== String(correct));
  const out = d.slice(0, 3); out.splice(pos % 4, 0, correct);
  return { opts: out.map(String), ans: pos % 4 };
}
const fmt = n => (Number.isInteger(n) ? String(n) : String(+n.toFixed(2)));

module.exports = { r1, esc, fig, T, L, A, R, C, P, barChart, lineChart, pieChart, histogram, venn3, venn2, circleSeats, building, pathFig, pathsFig, clock, clocks, dice, dieAt, tbl, dir, pp, mcq, pick, bank, setId, fmt, SER, MARK };
