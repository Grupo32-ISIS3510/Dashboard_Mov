// Auth
export type LoginRequest = {
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  full_name: string;
  is_premium: boolean;
  location: string | null;
  created_at: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

// Analytics
export type SavingsResponse = {
  saved_cop: string;
  wasted_cop: string;
  period: string;
};

export type WasteSummaryResponse = {
  total_consumed: number;
  total_discarded: number;
  most_wasted_category: string | null;
  most_discarded_item: string | null;
  no_waste_streak_days: number;
};

export type WasteTrendItem = {
  month: string;
  category: string | null;
  items_discarded: number;
  value_lost_cop: string;
};

export type UserSegmentResponse = {
  segment: string;
  recipes_cooked_last_30_days: number;
  open_rate: number;
};

export type DashboardResponse = {
  savings: SavingsResponse;
  waste_trends: WasteTrendItem[];
  waste_summary: WasteSummaryResponse;
  segment: UserSegmentResponse;
};

export type EventCount = {
  event_name: string;
  count: number;
};

export type EventsSummaryResponse = {
  total_events: number;
  period_days: number;
  breakdown: EventCount[];
};

// Camera scan stats (T1.2 crash rate) — GET /api/v1/analytics/scan-stats
export type ScanStatsResponse = {
  total_scans: number;
  successful_scans: number;
  failed_scans: number;
  crash_rate: number;
  avg_duration_ms: number;
  failure_breakdown: Record<string, number>;
};
