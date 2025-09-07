const HEADER_ALIASES = {
  date: ['Day', 'Reporting starts', 'Reporting Ends', 'Date'],
  campaign_id: ['Campaign ID'],
  campaign_name: ['Campaign name'],
  ad_set_name: ['Ad Set Name'],
  ad_name: ['Ad name', 'Ad Name'],
  campaign_delivery: ['Campaign Delivery'],
  adset_delivery: ['Ad Set Delivery'],
  ad_delivery: ['Ad Delivery'],
  amount_spent: ['Amount Spent (USD)', 'Amount Spent'],
  impressions: ['Impressions'],
  link_clicks: ['Link clicks', 'Link Clicks'],
  purchases: ['Purchases', 'Reservations', 'Results'],
  ctr_link: ['CTR (link)', 'Link CTR'],
  cpc_link: ['CPC (link)', 'Cost per link click'],
  cpm: ['CPM'],
  landing_page_views: ['Landing page views', 'LPV', 'Views of LP']
};

const ESSENTIAL = ['date', 'campaign_id', 'campaign_name', 'ad_set_name', 'ad_name', 'amount_spent', 'impressions'];

function normalizeHeader(h) {
  h = h.trim();
  for (const [norm, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.some(a => a.toLowerCase() === h.toLowerCase())) return norm;
  }
  return h.toLowerCase().replace(/\s+/g, '_');
}

function parseLine(line) {
  const res = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      res.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  res.push(cur);
  return res.map(s => s.trim());
}

export function parseText(text, log = []) {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length);
  if (!lines.length) return [];
  const headers = parseLine(lines.shift()).map(normalizeHeader);
  const rows = lines.map(line => {
    const cols = parseLine(line);
    const row = {};
    headers.forEach((h, i) => row[h] = cols[i]);
    return row;
  });
  ESSENTIAL.forEach(key => {
    if (!headers.includes(key)) log.push(`Missing column: ${key}`);
  });
  return rows;
}

export async function parseFile(file, log = []) {
  const text = await file.text();
  return parseText(text, log);
}
