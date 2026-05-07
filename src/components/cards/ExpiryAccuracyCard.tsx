import { useApi } from "../../hooks/useApi";
import { getExpiryStats } from "../../api/telemetry";
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

export default function ExpiryAccuracyCard() {
  const { data, loading, error, refetch } = useApi(() => getExpiryStats(), []);

  const detectionPct = data ? data.overall_detection_rate * 100 : 0;
  const accuracyPct = data ? data.overall_accuracy_rate * 100 : 0;

  const chartData = data
    ? data.by_category
        .map((c) => ({
          category: c.category,
          accuracy: Math.round(c.accuracy_rate * 100),
          total: c.total,
          detected: c.ocr_detected,
          accurate: c.accurate,
        }))
        .sort((a, b) => b.accuracy - a.accuracy)
    : [];

  return (
    <BQCard
      id="T3.3"
      title="OCR Expiry-Date Accuracy by Category"
      type="Feature Analysis"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <span className="text-4xl font-bold text-brand-accent">
                {accuracyPct.toFixed(1)}%
              </span>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider mt-1">
                accuracy
              </div>
            </div>
            <div className="text-center">
              <span className="text-2xl font-semibold text-brand-primary">
                {detectionPct.toFixed(1)}%
              </span>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider mt-1">
                detection
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-brand-dim pt-1 border-t border-brand-border">
            {data.total_events} scans evaluated
          </div>

          {chartData.length > 0 ? (
            <div className="flex-1 min-h-[160px] mt-1">
              <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1">
                Accuracy by category
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
                    dataKey="category"
                    tick={{ fill: theme.dim, fontSize: 10 }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme.panel2,
                      border: `1px solid ${theme.border}`,
                      borderRadius: 8,
                      color: theme.text,
                      fontSize: 12,
                    }}
                    formatter={(value: number, _name: string, entry) => {
                      const p = entry.payload as (typeof chartData)[number];
                      return [
                        `${value}% (${p.accurate}/${p.detected} of ${p.total})`,
                        "Accuracy",
                      ];
                    }}
                  />
                  <Bar dataKey="accuracy" radius={[0, 4, 4, 0]}>
                    {chartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={chartPalette[i % chartPalette.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-[11px] text-brand-dim mt-2">
              No category data recorded yet
            </div>
          )}
        </div>
      )}
    </BQCard>
  );
}
