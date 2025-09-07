import { DEFAULT_BENCHMARKS, GUARDRAILS } from './benchmarks.js';

function num(v) { const n = parseFloat(v); return isNaN(n) ? 0 : n; }

export function buildHierarchy(rows) {
  const campaigns = {};
  rows.forEach(r => {
    const date = r.date;
    const spend = num(r.amount_spent);
    const impr = num(r.impressions);
    const clicks = num(r.link_clicks);
    const purchases = num(r.purchases);
    const campaign = campaigns[r.campaign_id] ||= { id: r.campaign_id, name: r.campaign_name, delivery: r.campaign_delivery, children: {}, metrics: initMetrics(), daily: {} };
    const adset = campaign.children[r.ad_set_name] ||= { name: r.ad_set_name, delivery: r.adset_delivery, children: {}, metrics: initMetrics(), daily: {} };
    const ad = adset.children[r.ad_name] ||= { name: r.ad_name, delivery: r.ad_delivery, metrics: initMetrics(), daily: {} };

    accumulate(ad.metrics, spend, impr, clicks, purchases);
    accumulate(adset.metrics, spend, impr, clicks, purchases);
    accumulate(campaign.metrics, spend, impr, clicks, purchases);

    addDaily(ad.daily, date, spend, purchases);
  });

  return Object.values(campaigns).map(c => ({ ...c, children: Object.values(c.children).map(s => ({ ...s, children: Object.values(s.children) })) }));
}

function initMetrics() { return { spend: 0, impressions: 0, link_clicks: 0, purchases: 0, CPR: 0, CTR_link: 0, CPC_link: 0, CPM: 0 }; }

function accumulate(m, spend, impr, clicks, purchases) {
  m.spend += spend; m.impressions += impr; m.link_clicks += clicks; m.purchases += purchases;
  m.CPR = m.spend / Math.max(m.purchases, 0.00001);
  m.CTR_link = 100 * m.link_clicks / Math.max(m.impressions, 1);
  m.CPC_link = m.spend / Math.max(m.link_clicks, 1);
  m.CPM = 1000 * m.spend / Math.max(m.impressions, 1);
}

function addDaily(map, date, spend, purchases) {
  const d = map[date] ||= { spend: 0, purchases: 0 };
  d.spend += spend; d.purchases += purchases;
}

export function trend(values) {
  if (values.length < 3) return 'insufficient';
  const [a, b, c] = values.slice(-3);
  if (c > b && b > a) return 'improving';
  if (c < b && b < a) return 'decreasing';
  if (Math.abs((c - a) / (a || 1)) <= 0.03) return 'holding';
  return 'mixed';
}

export function colorFor(metric, value) {
  if (value == null || isNaN(value)) return 'gray';
  switch (metric) {
    case 'CPR':
      if (value <= DEFAULT_BENCHMARKS.CPR_target) return 'green';
      if (value <= GUARDRAILS.CPR_upper_stop) return 'yellow';
      return 'red';
    case 'CTR_link':
      if (value >= DEFAULT_BENCHMARKS.CTR_link_min) return 'green';
      if (value >= DEFAULT_BENCHMARKS.CTR_link_min * 0.8) return 'yellow';
      return 'red';
    case 'CPC_link':
      if (value <= DEFAULT_BENCHMARKS.CPC_link_max) return 'green';
      if (value <= DEFAULT_BENCHMARKS.CPC_link_max * 1.2) return 'yellow';
      return 'red';
    case 'CPM':
      if (value <= DEFAULT_BENCHMARKS.CPM_max) return 'green';
      if (value <= DEFAULT_BENCHMARKS.CPM_max * 1.2) return 'yellow';
      return 'red';
    default:
      return 'gray';
  }
}
