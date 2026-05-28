import { useState } from "react";
import Header from "./components/Header";
import DashboardGrid from "./components/DashboardGrid";
import Login from "./components/Login";
import { API_BASE_URL } from "./api/client";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { user, loading, error, login, logout } = useAuth();
  const [days, setDays] = useState<number>(30);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-brand-dim text-sm">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <Login onSubmit={login} loading={loading} error={error} />;
  }

  return (
    <div className="min-h-screen">
      <Header
        user={user}
        days={days}
        onDaysChange={setDays}
        onRefresh={() => setRefreshKey((k) => k + 1)}
        onLogout={logout}
      />
      <main className="px-6 py-6">
        <DashboardGrid refreshKey={refreshKey} />
        <footer className="mt-8 text-center text-[11px] text-brand-dim">
          SecondServing · FastAPI backend @ {API_BASE_URL} · user: {user.email}
        </footer>
      </main>
    </div>
  );
}
