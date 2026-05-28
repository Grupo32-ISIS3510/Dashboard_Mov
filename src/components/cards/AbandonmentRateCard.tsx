import { useApi } from "../../hooks/useApi";
import { getAbandonmentStats } from "../../api/telemetry";
import BQCard from "../BQCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { chartPalette, theme } from "../../styles/theme";

export default function AbandonmentRateCard() {
  const { data, loading, error, refetch } = useApi(
    () => getAbandonmentStats(),
    [],
  );

  const chartData = data
    ? data.screens
        .map((s) => ({
          screen: formatScreenName(s.screen_name),
          rate: Math.round(s.abandonment_rate * 100),
          enters: s.total_enters,
          completed: s.completed,
          abandoned: s.abandoned,
        }))
        .sort((a, b) => b.rate - a.rate)
    : [];

  const avgRate =
    chartData.length > 0
      ? chartData.reduce((sum, s) => sum + s.rate, 0) / chartData.length
      : 0;

  const rateColor =
    avgRate >= 50
      ? theme.danger
      : avgRate >= 25
        ? theme.warn
        : theme.ok;

  return (
    <BQCard
      id="T3.5"
      title="Abandonment Rate by Screen"
      type="Feature Analysis"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <span
                className="text-4xl font-bold"
                style={{ color: rateColor }}
              >
                {avgRate.toFixed(1)}%
              </span>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider mt-1">
                avg abandonment
              </div>
            </div>
            <div className="text-center">
              <span className="text-2xl font-semibold text-brand-text">
                {data.total_sessions}
              </span>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider mt-1">
                sessions
              </div>
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="flex-1 min-h-[160px] mt-1">
              <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1">
                By screen
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 4, right: 8, bottom: 0, left: 8 }}
                >
                  <CartesianGrid
                    stroke={theme.border}
                    strokeDasharray="3 3"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{ fill: theme.dim, fontSize: 10 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="screen"
                    tick={{ fill: theme.dim, fontSize: 10 }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme.panel2,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      color: theme.text,
                      fontSize: 12,
                    }}
                    formatter={(value, _name, entry) => {
                      const rate =
                        typeof value === "number" ? value : Number(value) || 0;
                      const p = entry.payload as (typeof chartData)[number];
                      return [
                        `${rate}% (${p.abandoned} left / ${p.enters} entered)`,
                        "Abandonment",
                      ];
                    }}
                  />
                  <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                    {chartData.map((row, i) => (
                      <Cell
                        key={i}
                        fill={
                          row.rate >= 50
                            ? theme.danger
                            : row.rate >= 25
                              ? theme.warn
                              : chartPalette[i % chartPalette.length]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-[11px] text-brand-dim mt-2">
              No screen events recorded yet
            </div>
          )}
        </div>
      )}
    </BQCard>
  );
}

function formatScreenName(raw: string): string {
  return raw
    .replace(/_/g, " ")
    .replace(/screen$/i, "")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
