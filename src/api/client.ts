import axios from "axios";

// En dev usamos el proxy de Vite (vite.config.ts → server.proxy['/api']) para
// evitar CORS: axios manda la URL relativa, el navegador la dispara contra
// localhost:5173, y Vite la reenvía server-to-server al backend AWS.
// En el build de producción usamos la URL absoluta del backend.
export const API_BASE_URL = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_BASE_URL as string);

export const TOKEN_KEY = "ss_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      setToken(null);
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    return Promise.reject(err);
  }
);
