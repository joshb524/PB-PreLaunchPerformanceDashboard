import { colorFor } from './compute.js';
import { getRecommendation } from './recs.js';
import { GUARDRAILS } from './benchmarks.js';

export function renderTotals(totals) {
  const el = document.getElementById('totals');
  if (!totals) { el.textContent = ''; return; }
  el.innerHTML = `Spend: $${totals.spend.toFixed(2)} | Purchases: ${totals.purchases} | CPR: $${totals.CPR.toFixed(2)}`;
}

export function renderTree(campaigns) {
  const tree = document.getElementById('tree');
  tree.innerHTML = '';
  const ul = document.createElement('ul');
  campaigns.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.name} ($${c.metrics.spend.toFixed(2)})`;
    const rec = document.createElement('div');
    rec.textContent = getRecommendation(c);
    li.appendChild(rec);
    const ulSet = document.createElement('ul');
    c.children.forEach(s => {
      const liSet = document.createElement('li');
      liSet.textContent = `${s.name} ($${s.metrics.spend.toFixed(2)})`;
      const ulAd = document.createElement('ul');
      s.children.forEach(a => {
        const liAd = document.createElement('li');
        liAd.textContent = `${a.name} CPR $${a.metrics.CPR.toFixed(2)}`;
        ulAd.appendChild(liAd);
      });
      liSet.appendChild(ulAd);
      ulSet.appendChild(liSet);
    });
    li.appendChild(ulSet);
    ul.appendChild(li);
  });
  tree.appendChild(ul);
}

export function renderGrid(campaigns) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  const table = document.createElement('table');
  const header = document.createElement('tr');
  header.innerHTML = '<th>Ad</th>';
  const dates = getDates();
  dates.forEach(d => { const th = document.createElement('th'); th.textContent = d.slice(5); header.appendChild(th); });
  table.appendChild(header);
  campaigns.forEach(c => c.children.forEach(s => s.children.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${a.name}</td>`;
    dates.forEach(d => {
      const cell = document.createElement('td');
      const day = a.daily[d];
      if (day) {
        cell.textContent = `$${day.spend.toFixed(1)}`;
        cell.title = `Spend $${day.spend.toFixed(2)}\nPurchases ${day.purchases}`;
      }
      tr.appendChild(cell);
    });
    table.appendChild(tr);
  })));
  grid.appendChild(table);
}

function getDates() {
  const arr = [];
  const today = new Date();
  for (let i = GUARDRAILS.Lookback_grid_days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0,10));
  }
  return arr;
}
