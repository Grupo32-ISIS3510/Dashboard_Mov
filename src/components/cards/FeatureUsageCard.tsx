import { useApi } from "../../hooks/useApi";
import { getFeatureUsageStats } from "../../api/telemetry";
import BQCard from "../BQCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { theme } from "../../styles/theme";

const BUCKET_COLORS: Record<string, string> = {
  "1": "#94a3b8",
  "2-5": "#60a5fa",
  "6-10": "#34d399",
  "11+": "#f59e0b",
};

const BUCKETS_ORDER = ["1", "2-5", "6-10", "11+"];

// Etiquetas amigables para los feature ids que emite la app movil
// (ver FeatureIds en feature_usage_telemetry_service.dart).
const FEATURE_LABELS: Record<string, string> = {
  inventory: "Inventory",
  scan_receipt: "Scan Receipt",
  recipes: "Recipes",
  shopping_list: "Shopping List",
  analytics: "Dashboard",
  notifications: "Notifications",
};

export default function FeatureUsageCard() {
  const { data, loading, error, refetch } = useApi(
    () => getFeatureUsageStats(7),
    [],
  );

  // Datos para el gráfico apilado: una fila por feature, una columna por bucket.
  const chartData = data
    ? data.features
        .map((f) => {
          const row: Record<string, number | string> = {
            feature: formatFeatureName(f.feature),
            avg: f.avg_uses_per_user,
          };
          for (const b of BUCKETS_ORDER) {
            const match = f.distribution.find((d) => d.bucket === b);
            row[b] = match ? match.users : 0;
          }
          return row;
        })
        .sort((a, b) => (b.avg as number) - (a.avg as number))
    : [];

  // Lista de features trackeadas, ordenada por total de usos descendente.
  const trackedFeatures = data
    ? [...data.features].sort((a, b) => b.total_uses - a.total_uses)
    : [];

  return (
    <BQCard
      id="T3.1"
      title="Weekly Feature Usage Frequency"
      type="Feature Analysis"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-6">
            <div
              className="text-center"
              title="Distinct users that opened at least one tracked feature in the window"
            >
              <span className="text-4xl font-bold text-brand-text">
                {data.active_users}
              </span>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider mt-1">
                active users
              </div>
            </div>
            <div
              className="text-center"
              title="Number of distinct feature ids seen in the window"
            >
              <span className="text-2xl font-semibold text-brand-text">
                {data.features.length}
              </span>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider mt-1">
                features tracked
              </div>
            </div>
            <div
              className="text-center"
              title="Length of the analysis window in days"
            >
              <span className="text-2xl font-semibold text-brand-text">
                {data.period_days}d
              </span>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider mt-1">
                window
              </div>
            </div>
          </div>

          {/* Lista de features trackeadas con su total de usos */}
          {trackedFeatures.length > 0 && (
            <div>
              <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1">
                Tracked features (uses in window)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {trackedFeatures.map((f) => (
                  <span
                    key={f.feature}
                    title={`${f.active_users} users · avg ${f.avg_uses_per_user.toFixed(1)} uses/user`}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] bg-brand-panel2 border border-brand-border text-brand-text"
                  >
                    <span>{formatFeatureName(f.feature)}</span>
                    <span className="text-brand-dim font-mono">
                      {f.total_uses}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {chartData.length > 0 ? (
            <div className="flex-1 min-h-[200px] mt-1">
              <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1">
                Users per usage bucket (uses/week)
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 4, right: 8, bottom: 0, left: 8 }}
                  stackOffset="expand"
                >
                  <CartesianGrid
                    stroke={theme.border}
                    strokeDasharray="3 3"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: theme.dim, fontSize: 10 }}
                    tickFormatter={(v) => `${Math.round(v * 100)}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="feature"
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
                    formatter={(value, name) => [
                      `${typeof value === "number" ? value : Number(value) || 0} users`,
                      `${name} uses`,
                    ]}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: 11,
                      color: theme.dim,
                      paddingTop: 4,
                    }}
                  />
                  {BUCKETS_ORDER.map((bucket, i) => (
                    <Bar
                      key={bucket}
                      dataKey={bucket}
                      stackId="usage"
                      fill={BUCKET_COLORS[bucket]}
                      radius={
                        i === BUCKETS_ORDER.length - 1 ? [0, 4, 4, 0] : 0
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-[11px] text-brand-dim mt-2">
              No feature usage recorded yet
            </div>
          )}
        </div>
      )}
    </BQCard>
  );
}

function formatFeatureName(raw: string): string {
  if (FEATURE_LABELS[raw]) return FEATURE_LABELS[raw];
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
