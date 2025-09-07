export const DEFAULT_BENCHMARKS = {
  CPR_target: 10.0,        // USD target for pre-launch reservations
  CTR_link_min: 1.2,       // %
  CPC_link_max: 1.50,      // USD
  CPM_max: 18.0,           // USD
  LP_CVR_min: 15.0,        // %
  Purchase_CVR_min: 2.0    // %
};

export const GUARDRAILS = {
  CPR_upper_stop: 20.0,
  Min_Impressions_for_eval: 1500,
  Min_Spend_for_eval: 20.0,
  Trend_window_days: 3,
  Lookback_grid_days: 14
};
