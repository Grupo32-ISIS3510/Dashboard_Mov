import { useApi } from "../../hooks/useApi";
import { getSegment } from "../../api/analytics";
import BQCard from "../BQCard";

const SEGMENT_COLORS: Record<string, string> = {
  active: "text-brand-ok",
  engaged: "text-brand-accent",
  passive: "text-brand-warn",
  churned: "text-brand-danger",
};

export default function SegmentCard() {
  const { data, loading, error, refetch } = useApi(() => getSegment(), []);

  const segmentClass = data ? SEGMENT_COLORS[data.segment.toLowerCase()] ?? "text-brand-primary" : "";

  return (
    <BQCard
      id="A3"
      title="User Segment"
      type="User Experience"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className={`text-4xl font-bold uppercase ${segmentClass}`}>
            {data.segment}
          </div>
          <div className="text-xs text-brand-dim">Current classification</div>
          <div className="w-full pt-3 border-t border-brand-border space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-brand-dim">Recipes cooked (30d)</span>
              <span className="text-brand-text font-semibold">
                {data.recipes_cooked_last_30_days}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-dim">Open rate</span>
              <span className="text-brand-text font-semibold">
                {(data.open_rate * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </BQCard>
  );
}
