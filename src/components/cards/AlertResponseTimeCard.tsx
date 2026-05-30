import { useApi } from "../../hooks/useApi";
import { getAlertResponseTimes } from "../../api/analytics";
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

function fmtMinutes(m: number): string {
  if (m < 1) return "<1m";
  if (m < 60) return `${Math.round(m)}m`;
  if (m < 1440) return `${(m / 60).toFixed(1)}h`;
  return `${(m / 1440).toFixed(1)}d`;
}

function p95Color(m: number): string {
  if (m <= 360) return theme.ok; // ≤ 6 h
  if (m <= 1440) return theme.warn; // ≤ 24 h
  return theme.danger;
}

export default function AlertResponseTimeCard() {
  const { data, loading, error, refetch } = useApi(
    () => getAlertResponseTimes(30),
    []
  );

  const histogram = data?.histogram ?? [];
  const byCategory = data?.by_category ?? [];

  const categoryData = data
    ? byCategory.map((c) => ({
        category: c.category,
        avg_minutes: Math.round(c.avg_minutes),
        p50_minutes: Math.round(c.p50_minutes),
        sample_size: c.sample_size,
      }))
    : [];

  return (
    <BQCard
      id="T3.4"
      title="Alert Response Time — distribution by category"
      type="Feature Analysis"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-baseline justify-center gap-2">
            <span
              className="text-5xl font-bold"
              style={{ color: p95Color(data.p95_minutes) }}
            >
              {fmtMinutes(data.avg_minutes)}
            </span>
            <span className="text-xs text-brand-dim uppercase tracking-wider">
              avg response
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-brand-border">
            <div>
              <div className="text-base font-semibold text-brand-text">
                {fmtMinutes(data.p50_minutes)}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">
                p50
              </div>
            </div>
            <div>
              <div
                className="text-base font-semibold"
                style={{ color: p95Color(data.p95_minutes) }}
              >
                {fmtMinutes(data.p95_minutes)}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">
                p95
              </div>
            </div>
            <div>
              <div className="text-base font-semibold text-brand-warn">
                {fmtMinutes(data.max_minutes)}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">
                max
              </div>
            </div>
            <div>
              <div className="text-base font-semibold text-brand-primary">
                {data.sample_size}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">
                samples
              </div>
            </div>
          </div>

          {data.sample_size < 5 ? (
            <p className="text-brand-dim text-sm text-center mt-2">
              Sin datos suficientes aún (mínimo 5 alertas con acción)
            </p>
          ) : (
            <>
              {histogram.length > 0 && (
                <div className="flex-1 min-h-[150px] mt-2">
                  <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1">
                    Distribución de tiempos de respuesta
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={histogram}
                      margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
                    >
                      <CartesianGrid
                        stroke={theme.border}
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="bucket"
                        tick={{ fill: theme.dim, fontSize: 9 }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={42}
                      />
                      <YAxis
                        tick={{ fill: theme.dim, fontSize: 10 }}
                        width={30}
                        allowDecimals={false}
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
                      <Bar
                        dataKey="count"
                        fill={chartPalette[0]}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {categoryData.length > 0 && (
                <div className="flex-1 min-h-[140px] mt-2">
                  <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1">
                    Promedio por categoría · más lentas primero
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
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
                        tick={{ fill: theme.dim, fontSize: 10 }}
                        tickFormatter={(v) => fmtMinutes(v as number)}
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
                        formatter={(value, _name, entry) => {
                          const v =
                            typeof value === "number"
                              ? value
                              : Number(value) || 0;
                          const p = entry.payload as (typeof categoryData)[number];
                          return [
                            `${fmtMinutes(v)} avg · p50 ${fmtMinutes(
                              p.p50_minutes
                            )} · n=${p.sample_size}`,
                            "Tiempo de respuesta",
                          ];
                        }}
                      />
                      <Bar dataKey="avg_minutes" radius={[0, 4, 4, 0]}>
                        {categoryData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={chartPalette[i % chartPalette.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </BQCard>
  );
}
