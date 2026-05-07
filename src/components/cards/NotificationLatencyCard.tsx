import { useApi } from "../../hooks/useApi";
import { getNotificationLatency } from "../../api/analytics";
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

function fmtSeconds(s: number): string {
  if (s < 60) return `${s.toFixed(0)}s`;
  if (s < 3600) return `${(s / 60).toFixed(1)}m`;
  return `${(s / 3600).toFixed(1)}h`;
}

function p95Color(s: number): string {
  if (s <= 300) return theme.ok;
  if (s <= 1800) return theme.warn;
  return theme.danger;
}

export default function NotificationLatencyCard() {
  const { data, loading, error, refetch } = useApi(
    () => getNotificationLatency(30),
    []
  );

  return (
    <BQCard
      id="T2.1"
      title="Notification Latency — item registered → notification received"
      type="Telemetry"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-baseline justify-center gap-2">
            <span
              className="text-5xl font-bold"
              style={{ color: p95Color(data.p95_seconds) }}
            >
              {fmtSeconds(data.avg_seconds)}
            </span>
            <span className="text-xs text-brand-dim uppercase tracking-wider">
              avg latency
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-brand-border">
            <div>
              <div className="text-base font-semibold text-brand-text">
                {fmtSeconds(data.p50_seconds)}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">p50</div>
            </div>
            <div>
              <div
                className="text-base font-semibold"
                style={{ color: p95Color(data.p95_seconds) }}
              >
                {fmtSeconds(data.p95_seconds)}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">p95</div>
            </div>
            <div>
              <div className="text-base font-semibold text-brand-warn">
                {fmtSeconds(data.max_seconds)}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">max</div>
            </div>
            <div>
              <div className="text-base font-semibold text-brand-primary">
                {data.sample_size}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">samples</div>
            </div>
          </div>

          {data.histogram.length > 0 && (
            <div className="flex-1 min-h-[140px] mt-2">
              <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1">
                Distribución de latencia
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.histogram}
                  margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
                >
                  <CartesianGrid
                    stroke={theme.border}
                    strokeDasharray="3 3"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="bucket"
                    tick={{ fill: theme.dim, fontSize: 10 }}
                  />
                  <YAxis tick={{ fill: theme.dim, fontSize: 10 }} width={30} />
                  <Tooltip
                    contentStyle={{
                      background: theme.panel2,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      color: theme.text,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill={chartPalette[0]} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </BQCard>
  );
}
