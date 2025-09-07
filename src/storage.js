import { DEFAULT_BENCHMARKS } from './benchmarks.js';

const NS = 'METAADS_DASHBOARD_V1';

function read() {
  try {
    return JSON.parse(localStorage.getItem(NS)) || { iterations: [], changes: [] };
  } catch (e) {
    return { iterations: [], changes: [] };
  }
}

function write(data) {
  localStorage.setItem(NS, JSON.stringify(data));
}

export function clearAll() {
  localStorage.removeItem(NS);
}

export function getIterations() {
  return read().iterations;
}

export function saveIteration(iter) {
  const data = read();
  const i = data.iterations.findIndex(x => x.id === iter.id);
  if (i >= 0) data.iterations[i] = iter; else data.iterations.push(iter);
  write(data);
}

export function getChanges() {
  return read().changes;
}

export function saveChange(change) {
  const data = read();
  const i = data.changes.findIndex(c => c.changeId === change.changeId);
  if (i >= 0) data.changes[i] = change; else data.changes.push(change);
  write(data);
}

export function evaluateChange(change) {
  const base = change.baselineSnapshot || {};
  const cur = change.currentSnapshot || {};
  if (!base.CPR || !cur.CPR) return 'No signal';
  const movement = (base.CPR - cur.CPR) / base.CPR;
  if (movement >= 0.1) return 'On track';
  if (movement <= -0.1) return 'Off track';
  return 'No signal';
}
