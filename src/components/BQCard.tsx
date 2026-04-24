import type { ReactNode } from "react";
import { typeColors } from "../styles/theme";

type Props = {
  id: string;
  title: string;
  type: "Telemetry" | "User Experience" | "Feature Analysis" | "Mixed Impact";
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children?: ReactNode;
};

export default function BQCard({ id, title, type, loading, error, onRetry, children }: Props) {
  const tc = typeColors[type];
  return (
    <div className="bg-brand-panel border border-brand-border rounded-2xl shadow-card p-5 flex flex-col min-h-[320px]">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-brand-primary/15 border border-brand-primary/50 text-brand-primary text-xs font-bold tracking-wider">
            {id}
          </span>
          <span
            className="px-2 py-0.5 rounded-md text-xs font-semibold border"
            style={{ background: tc.bg, color: tc.text, borderColor: tc.border }}
          >
            {type}
          </span>
        </div>
      </div>
      <h3 className="text-brand-text font-semibold leading-snug mb-4 text-sm">{title}</h3>
      <div className="flex-1 flex flex-col">
        {loading && <SkeletonBlock />}
        {!loading && error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
            <div className="text-brand-danger text-sm font-medium">Failed to load</div>
            <div className="text-brand-dim text-xs max-w-xs break-words">{error}</div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 text-xs px-3 py-1 rounded-md bg-brand-panel2 border border-brand-border hover:border-brand-primary text-brand-text"
              >
                Retry
              </button>
            )}
          </div>
        )}
        {!loading && !error && children}
      </div>
    </div>
  );
}

function SkeletonBlock() {
  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="skeleton h-6 w-1/3" />
      <div className="skeleton flex-1 min-h-[120px]" />
      <div className="skeleton h-4 w-2/3" />
      <div className="skeleton h-4 w-1/2" />
    </div>
  );
}
