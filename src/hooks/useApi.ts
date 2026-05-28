import { useCallback, useEffect, useState } from "react";
import { getToken } from "../api/client";

export type UseApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useApi<T>(fn: () => Promise<T>, deps: unknown[] = []): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!getToken()) {
      setData(null);
      setError("Debes iniciar sesión para cargar esta tarjeta.");
      setLoading(false);
      return;
    }
    try {
      const res = await fn();
      setData(res);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } }; message?: string };
      const msg =
        err?.response?.data?.detail || err?.message || "Request failed";
      setError(typeof msg === "string" ? msg : "Request failed");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: () => setNonce((n) => n + 1) };
}
