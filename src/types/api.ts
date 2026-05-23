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

// Camera scan stats (T1.2 crash rate) — GET /api/v1/telemetry/scan-stats/global
export type FailureBreakdownItem = {
  reason: string;
  count: number;
};

export type ScanStatsResponse = {
  total_scans: number;
  successful_scans: number;
  failed_scans: number;
  crash_rate: number;
  avg_duration_ms: number;
  failure_breakdown: FailureBreakdownItem[];
};

// Notification latency — GET /api/v1/analytics/notification-latency
export type LatencyBucket = {
  bucket: string;
  count: number;
};

export type NotificationLatencyResponse = {
  avg_seconds: number;
  p50_seconds: number;
  p95_seconds: number;
  max_seconds: number;
  sample_size: number;
  histogram: LatencyBucket[];
  period_days: number;
};

// Inventory events summary — GET /api/v1/analytics/inventory-events/summary
export type InventoryEventsSummaryResponse = {
  total_registered: number;
  eligible_for_alert: number;
  period_days: number;
};

// Recipe interactions — GET /api/v1/analytics/recipe-interactions/*
export type RecipeInteractionsSummary = {
  total_cooked: number;
  total_viewed: number;
  cook_through_rate: number;
  avg_inventory_matches_on_cook: number | null;
  period_days: number;
};

export type TopCookedRecipe = {
  name: string;
  cooks: number;
};

export type ViewsVsCooksRow = {
  name: string;
  views: number;
  cooks: number;
  rate_pct: number | null;
};

export type MatchBucket = {
  matches: string;
  count: number;
};

// OCR expiry accuracy by category (T3.3) — GET /api/v1/telemetry/expiry-stats
export type CategoryAccuracyItem = {
  category: string;
  total: number;
  ocr_detected: number;
  accurate: number;
  accuracy_rate: number;
};

export type ExpiryStatsResponse = {
  total_events: number;
  overall_detection_rate: number;
  overall_accuracy_rate: number;
  by_category: CategoryAccuracyItem[];
};

// Screen abandonment rate (T3.5) — GET /api/v1/telemetry/abandonment-stats
export type ScreenAbandonmentItem = {
  screen_name: string;
  total_enters: number;
  completed: number;
  abandoned: number;
  abandonment_rate: number;
};

export type AbandonmentStatsResponse = {
  total_sessions: number;
  screens: ScreenAbandonmentItem[];
};

// Alert response times (T3.4) — GET /api/v1/analytics/alert-response-times
export type AlertResponseBucket = {
  bucket: string;
  count: number;
};

export type AlertResponseCategoryStat = {
  category: string;
  sample_size: number;
  avg_minutes: number;
  p50_minutes: number;
};

export type AlertResponseTimeResponse = {
  avg_minutes: number;
  p50_minutes: number;
  p95_minutes: number;
  max_minutes: number;
  sample_size: number;
  period_days: number;
  histogram: AlertResponseBucket[];
  by_category: AlertResponseCategoryStat[];
};

// Feature usage frequency (T3.1) — GET /api/v1/telemetry/feature-usage-stats
export type FeatureFrequencyBucket = {
  bucket: string; // "1" | "2-5" | "6-10" | "11+"
  users: number;
};

export type FeatureUsageItem = {
  feature: string;
  total_uses: number;
  active_users: number;
  avg_uses_per_user: number;
  distribution: FeatureFrequencyBucket[];
};

export type FeatureUsageStatsResponse = {
  period_days: number;
  active_users: number;
  features: FeatureUsageItem[];
};
