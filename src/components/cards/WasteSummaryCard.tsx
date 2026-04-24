import { useApi } from "../../hooks/useApi";
import { getWasteSummary } from "../../api/analytics";
import BQCard from "../BQCard";

export default function WasteSummaryCard() {
  const { data, loading, error, refetch } = useApi(() => getWasteSummary(), []);

  const consumed = data?.total_consumed ?? 0;
  const discarded = data?.total_discarded ?? 0;
  const total = consumed + discarded;
  const consumedPct = total > 0 ? (consumed / total) * 100 : 0;

  return (
    <BQCard
      id="A2"
      title="Consumption vs Waste"
      type="Telemetry"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="text-3xl font-bold text-brand-ok">{consumed}</div>
              <div className="text-[11px] text-brand-dim uppercase tracking-wider">Consumed</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold text-brand-danger">{discarded}</div>
              <div className="text-[11px] text-brand-dim uppercase tracking-wider">Discarded</div>
            </div>
          </div>

          <div className="h-2 bg-brand-panel2 rounded-full overflow-hidden flex">
            <div
              className="bg-brand-ok h-full"
              style={{ width: `${consumedPct}%` }}
            />
            <div
              className="bg-brand-danger h-full"
              style={{ width: `${100 - consumedPct}%` }}
            />
          </div>

          <div className="text-xs text-brand-dim space-y-1 pt-3 border-t border-brand-border">
            <div>
              Streak: <span className="text-brand-text font-semibold">{data.no_waste_streak_days}d</span> without waste
            </div>
            <div>
              Most wasted category:{" "}
              <span className="text-brand-text">{data.most_wasted_category ?? "—"}</span>
            </div>
            <div>
              Most discarded item:{" "}
              <span className="text-brand-text">{data.most_discarded_item ?? "—"}</span>
            </div>
          </div>
        </div>
      )}
    </BQCard>
  );
}
