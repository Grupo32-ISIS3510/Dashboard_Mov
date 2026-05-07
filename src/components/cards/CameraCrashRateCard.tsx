import { useApi } from "../../hooks/useApi";
import { getScanStats } from "../../api/telemetry";
import BQCard from "../BQCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { chartPalette, theme } from "../../styles/theme";

export default function CameraCrashRateCard() {
  const { data, loading, error, refetch } = useApi(() => getScanStats(), []);

  const crashRatePct = data ? data.crash_rate * 100 : 0;
  const breakdownRows = data
    ? [...data.failure_breakdown].sort((a, b) => b.count - a.count)
    : [];

  const rateColor =
    crashRatePct >= 20
      ? theme.danger
      : crashRatePct >= 10
      ? theme.warn
      : theme.ok;

  return (
    <BQCard
      id="T1.2"
      title="Camera Crash Rate"
      type="Telemetry"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold" style={{ color: rateColor }}>
              {crashRatePct.toFixed(1)}%
            </span>
            <span className="text-xs text-brand-dim uppercase tracking-wider">
              crash rate
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-brand-border">
            <div>
              <div className="text-base font-semibold text-brand-text">
                {data.total_scans}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">
                total
              </div>
            </div>
            <div>
              <div className="text-base font-semibold text-brand-ok">
                {data.successful_scans}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">
                success
              </div>
            </div>
            <div>
              <div className="text-base font-semibold text-brand-danger">
                {data.failed_scans}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">
                failed
              </div>
            </div>
            <div>
              <div className="text-base font-semibold text-brand-primary">
                {(data.avg_duration_ms / 1000).toFixed(1)}s
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">
                avg
              </div>
            </div>
          </div>

          {breakdownRows.length > 0 ? (
            <div className="flex-1 min-h-[140px] mt-2">
              <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1">
                Failure breakdown
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={breakdownRows}
                  layout="vertical"
                  margin={{ top: 4, right: 8, bottom: 0, left: 8 }}
                >
                  <CartesianGrid
                    stroke={theme.border}
                    strokeDasharray="3 3"
                    horizontal={false}
                  />
                  <XAxis type="number" tick={{ fill: theme.dim, fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="reason"
                    tick={{ fill: theme.dim, fontSize: 10 }}
                    width={130}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme.panel2,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      color: theme.text,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill={chartPalette[3]} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-[11px] text-brand-dim mt-2">
              No failures recorded
            </div>
          )}
        </div>
      )}
    </BQCard>
  );
}
