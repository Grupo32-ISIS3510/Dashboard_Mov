import { api, setToken } from "./client";
import type { LoginRequest, TokenResponse, User } from "../types/api";

export async function login(credentials: LoginRequest): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/api/v1/auth/login", credentials);
  setToken(data.access_token);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post("/api/v1/auth/logout");
  } catch {
    // ignore — clear token regardless
  } finally {
    setToken(null);
  }
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/api/v1/auth/me");
  return data;
}
