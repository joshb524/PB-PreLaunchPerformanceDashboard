import { DEFAULT_BENCHMARKS, GUARDRAILS } from './benchmarks.js';

// Return recommendation string based on metrics and delivery status
export function getRecommendation(node) {
  const m = node.metrics || {};
  const isActive = /active/i.test(node.delivery || '') && !/inactive/i.test(node.delivery || '');
  const hasData = (m.impressions || 0) >= GUARDRAILS.Min_Impressions_for_eval && (m.spend || 0) >= GUARDRAILS.Min_Spend_for_eval;

  if (isActive && m.CPR <= DEFAULT_BENCHMARKS.CPR_target) {
    return 'Scale budget +20–30%. Monitor CPR drift.';
  }
  if (isActive && m.CPR > DEFAULT_BENCHMARKS.CPR_target && m.CPR <= GUARDRAILS.CPR_upper_stop && m.CTR_link >= DEFAULT_BENCHMARKS.CTR_link_min && m.CPC_link <= DEFAULT_BENCHMARKS.CPC_link_max) {
    return 'Hold budget. Test clarity variant.';
  }
  if (m.CPR > GUARDRAILS.CPR_upper_stop && hasData) {
    return 'Pause or rotate creative. New hook or audience split.';
  }
  if (m.CTR_link < DEFAULT_BENCHMARKS.CTR_link_min && m.CPC_link > DEFAULT_BENCHMARKS.CPC_link_max) {
    return 'Refresh top-of-funnel creative. New thumbnail/first-2s.';
  }
  if (m.CPM > DEFAULT_BENCHMARKS.CPM_max && m.CTR_link >= DEFAULT_BENCHMARKS.CTR_link_min) {
    return 'Broaden/retune audience. Check overlap and frequency.';
  }
  return 'Gather more data.';
}
