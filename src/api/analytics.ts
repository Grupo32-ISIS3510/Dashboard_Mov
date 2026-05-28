import { api } from "./client";
import type {
  AlertResponseTimeResponse,
  DashboardResponse,
  EventsSummaryResponse,
  FavoritesDistributionResponse,
  InventoryEventsSummaryResponse,
  MatchBucket,
  NotificationLatencyResponse,
  RecipeInteractionsSummary,
  SavingsResponse,
  SegmentsPatternsResponse,
  TopCookedRecipe,
  UserSegmentResponse,
  ViewsVsCooksRow,
  WasteReductionByRecipeCategoryResponse,
  WasteSummaryResponse,
  WasteTrendItem,
} from "../types/api";

const BASE = "/api/v1/analytics";

export async function getDashboard(
  month?: number,
  year?: number
): Promise<DashboardResponse> {
  const { data } = await api.get<DashboardResponse>(`${BASE}/dashboard`, {
    params: { month, year },
  });
  return data;
}

export async function getSavings(
  month?: number,
  year?: number
): Promise<SavingsResponse> {
  const { data } = await api.get<SavingsResponse>(`${BASE}/savings`, {
    params: { month, year },
  });
  return data;
}

export async function getWasteSummary(): Promise<WasteSummaryResponse> {
  const { data } = await api.get<WasteSummaryResponse>(`${BASE}/summary`);
  return data;
}

export async function getWasteTrends(months = 6): Promise<WasteTrendItem[]> {
  const { data } = await api.get<WasteTrendItem[]>(`${BASE}/waste`, {
    params: { months },
  });
  return data;
}

export async function getSegment(): Promise<UserSegmentResponse> {
  const { data } = await api.get<UserSegmentResponse>(`${BASE}/segment`);
  return data;
}

export async function getEventsSummary(days = 30): Promise<EventsSummaryResponse> {
  const { data } = await api.get<EventsSummaryResponse>(`${BASE}/events/summary`, {
    params: { days },
  });
  return data;
}

export async function getNotificationLatency(days = 30): Promise<NotificationLatencyResponse> {
  const { data } = await api.get<NotificationLatencyResponse>(`${BASE}/notification-latency`, {
    params: { days },
  });
  return data;
}

export async function getInventoryEventsSummary(days = 30): Promise<InventoryEventsSummaryResponse> {
  const { data } = await api.get<InventoryEventsSummaryResponse>(`${BASE}/inventory-events/summary`, {
    params: { days },
  });
  return data;
}

export async function getRecipeInteractionsSummary(days = 30): Promise<RecipeInteractionsSummary> {
  const { data } = await api.get<RecipeInteractionsSummary>(`${BASE}/recipe-interactions/summary`, {
    params: { days },
  });
  return data;
}

export async function getTopCookedRecipes(days = 30, limit = 10): Promise<TopCookedRecipe[]> {
  const { data } = await api.get<TopCookedRecipe[]>(`${BASE}/recipe-interactions/top-cooked`, {
    params: { days, limit },
  });
  return data;
}

export async function getViewsVsCooks(days = 30, limit = 10): Promise<ViewsVsCooksRow[]> {
  const { data } = await api.get<ViewsVsCooksRow[]>(`${BASE}/recipe-interactions/views-vs-cooks`, {
    params: { days, limit },
  });
  return data;
}

export async function getMatchDistribution(days = 30): Promise<MatchBucket[]> {
  const { data } = await api.get<MatchBucket[]>(`${BASE}/recipe-interactions/match-distribution`, {
    params: { days },
  });
  return data;
}

export async function getAlertResponseTimes(
  days = 30
): Promise<AlertResponseTimeResponse> {
  const { data } = await api.get<AlertResponseTimeResponse>(
    `${BASE}/alert-response-times`,
    { params: { days } }
  );
  return data;
}

export async function getWasteReductionByRecipeCategory(
  days = 30,
  rescue_window_days = 3
): Promise<WasteReductionByRecipeCategoryResponse> {
  const { data } = await api.get<WasteReductionByRecipeCategoryResponse>(
    `${BASE}/waste-reduction-by-recipe-category`,
    { params: { days, rescue_window_days } }
  );
  return data;
}

export async function getFavoritesDistribution(
  top_ingredients = 10
): Promise<FavoritesDistributionResponse> {
  const { data } = await api.get<FavoritesDistributionResponse>(
    `${BASE}/favorites-distribution`,
    { params: { top_ingredients } }
  );
  return data;
}

export async function getSegmentsPatterns(
  days = 30
): Promise<SegmentsPatternsResponse> {
  const { data } = await api.get<SegmentsPatternsResponse>(
    `${BASE}/segments/patterns`,
    { params: { days } }
  );
  return data;
}

