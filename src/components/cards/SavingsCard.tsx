import { useApi } from "../../hooks/useApi";
import { getSavings } from "../../api/analytics";
import BQCard from "../BQCard";

function formatCop(value: string): string {
  const n = Number(value);
  if (!isFinite(n)) return value;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function SavingsCard() {
  const { data, loading, error, refetch } = useApi(() => getSavings(), []);

  return (
    <BQCard
      id="A1"
      title="Savings vs Waste (COP)"
      type="Mixed Impact"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="text-4xl font-bold text-brand-ok">{formatCop(data.saved_cop)}</div>
          <div className="text-xs text-brand-dim uppercase tracking-wider">Saved</div>
          <div className="w-full pt-3 mt-2 border-t border-brand-border flex flex-col items-center gap-1">
            <div className="text-lg font-semibold text-brand-danger">
              {formatCop(data.wasted_cop)}
            </div>
            <div className="text-[11px] text-brand-dim uppercase tracking-wider">Wasted</div>
          </div>
          <div className="text-[11px] text-brand-dim mt-2">Period: {data.period}</div>
        </div>
      )}
    </BQCard>
  );
}
