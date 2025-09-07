import { parseFile, parseText } from './parse.js';
import { buildHierarchy } from './compute.js';
import { renderTotals, renderTree, renderGrid } from './ui.js';
import { clearAll } from './storage.js';

const logEl = document.getElementById('log');

function log(msg) {
  const div = document.createElement('div');
  div.textContent = msg;
  logEl.appendChild(div);
}

async function handleRows(rows, logMsgs) {
  const campaigns = buildHierarchy(rows);
  renderTree(campaigns);
  renderGrid(campaigns);
  const totals = campaigns.reduce((a, c) => {
    a.spend += c.metrics.spend;
    a.purchases += c.metrics.purchases;
    return a;
  }, { spend: 0, purchases: 0 });
  totals.CPR = totals.spend / Math.max(totals.purchases, 0.00001);
  renderTotals(totals);
  logMsgs.forEach(log);
}

document.getElementById('fileInput').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  const logMsgs = [];
  const rows = await parseFile(file, logMsgs);
  handleRows(rows, logMsgs);
});

document.getElementById('demoBtn').addEventListener('click', async () => {
  const res = await fetch('assets/sample-meta-export.csv');
  const text = await res.text();
  const logMsgs = [];
  const rows = parseText(text, logMsgs);
  handleRows(rows, logMsgs);
});

document.getElementById('clearData').addEventListener('click', () => {
  clearAll();
  log('Local data cleared');
});
