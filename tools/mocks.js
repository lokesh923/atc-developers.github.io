// Mock definitions for the generated questions.
const NAMES = { R: 'Reasoning Ability', T: 'Technical Ability', V: 'Verbal Ability', P: 'Pseudocode', Z: 'Numerical Puzzle', G: 'English Grammar', W: 'English Writing' };
const PAT = { R: [15, 25, 1], T: [10, 35, 1], V: [20, 20, 1], P: [5, 10, 2], Z: [4, 10, 2.5], G: [5, 10, 2], W: [1, 10, 0] };
module.exports = qs => {
  const sections = Object.keys(PAT).map(k => {
    const ids = qs.filter(q => q.mm === 'M4' && q.sec === k).map(q => q.id);
    if (ids.length !== PAT[k][0]) throw new Error(`Master mock section ${k} has ${ids.length} questions, expected ${PAT[k][0]}`);
    return { key: k, name: NAMES[k], ids, minutes: PAT[k][1], marks: PAT[k][2] };
  });
  const pdf = qs.filter(q => q.pdf).map(q => q.id);
  return [
    { name: 'Full Mock Test 4: Master (image-based)', note: 'All-new, figure-heavy mock built to the real pattern: charts, mixed-facing seating, graphs, timelines, flowcharts, call trees, Sudoku and logic grids. Every answer is computed and checked by code.', sections },
    { name: 'Reasoning Image Test: 50 hard questions', note: '13 figure sets (bar chart, circular table, pie chart, routes, line graph, Venn, floors, histogram, counting figures, dice, family tree, clocks, flowchart). Take it at 25 minutes per 15 questions.', sections: [{ key: 'R', name: 'Reasoning Ability', ids: pdf, minutes: Math.round(25 * pdf.length / 15), marks: 1 }] },
  ];
};
