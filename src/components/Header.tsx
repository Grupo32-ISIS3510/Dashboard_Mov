import type { User } from "../types/api";

type Props = {
  user: User | null;
  days: number;
  onDaysChange: (d: number) => void;
  onRefresh: () => void;
  onLogout: () => void;
};

export default function Header({ user, days, onDaysChange, onRefresh, onLogout }: Props) {
  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-brand-bg/70 border-b border-brand-border">
      <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-black">
            S
          </div>
          <div>
            <div className="text-brand-text font-bold leading-tight">SecondServing</div>
            <div className="text-[11px] text-brand-dim leading-tight">Analytics Dashboard</div>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-2 ml-2">
            <label className="text-[11px] uppercase tracking-wider text-brand-dim">User</label>
            <div className="bg-brand-panel border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-text">
              {user.full_name}
              <span className="text-brand-dim ml-2">· {user.email}</span>
              {user.is_premium && (
                <span className="ml-2 px-1.5 py-0.5 rounded bg-brand-accent/20 text-brand-accent text-[10px] font-bold">
                  PRO
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-dim mr-1">Range</span>
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => onDaysChange(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                days === d
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-brand-panel text-brand-dim border-brand-border hover:border-brand-primary"
              }`}
            >
              {d}d
            </button>
          ))}
        </div>

        <button
          onClick={onRefresh}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-accent/20 border border-brand-accent/60 text-brand-accent hover:bg-brand-accent/30"
        >
          ↻ Refresh all
        </button>

        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-panel border border-brand-border text-brand-dim hover:border-brand-danger hover:text-brand-danger"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
