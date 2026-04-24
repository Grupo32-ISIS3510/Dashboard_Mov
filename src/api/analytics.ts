import { api } from "./client";
import type {
  DashboardResponse,
  EventsSummaryResponse,
  SavingsResponse,
  ScanStatsResponse,
  UserSegmentResponse,
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

export async function getScanStats(): Promise<ScanStatsResponse> {
  const { data } = await api.get<ScanStatsResponse>(`${BASE}/scan-stats`);
  return data;
}
