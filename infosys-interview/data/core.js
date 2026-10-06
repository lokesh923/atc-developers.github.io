// Content registry. Every data file adds to window.IV.
window.IV = { modules: [], coding: [], sql: { schema: [], items: [] }, sheets: [], plan: [], process: null };
IV.addModule = m => IV.modules.push(m);
