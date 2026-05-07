import { api } from "./client";
import type {
  ScanStatsResponse,
  ExpiryStatsResponse,
  AbandonmentStatsResponse,
} from "../types/api";

const BASE = "/api/v1/telemetry";

export async function getScanStats(days = 30): Promise<ScanStatsResponse> {
  const { data } = await api.get<ScanStatsResponse>(`${BASE}/scan-stats`, {
    params: { days },
  });
  return data;
}

export async function getScanStatsGlobal(days = 30): Promise<ScanStatsResponse> {
  const { data } = await api.get<ScanStatsResponse>(`${BASE}/scan-stats/global`, {
    params: { days },
  });
  return data;
}

export async function getExpiryStats(days = 30): Promise<ExpiryStatsResponse> {
  const { data } = await api.get<ExpiryStatsResponse>(`${BASE}/expiry-stats`, {
    params: { days },
  });
  return data;
}

export async function getAbandonmentStats(days = 30): Promise<AbandonmentStatsResponse> {
  const { data } = await api.get<AbandonmentStatsResponse>(`${BASE}/abandonment-stats`, {
    params: { days },
  });
  return data;
}
