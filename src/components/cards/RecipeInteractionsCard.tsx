import { useApi } from "../../hooks/useApi";
import {
  getRecipeInteractionsSummary,
  getTopCookedRecipes,
  getViewsVsCooks,
  getMatchDistribution,
} from "../../api/analytics";
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

function KpiBox({
  value,
  label,
  color,
}: {
  value: string | number;
  label: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center bg-brand-panel2 rounded-xl p-3 gap-1">
      <div className="text-xl font-bold" style={{ color: color ?? theme.text }}>
        {value}
      </div>
      <div className="text-[10px] text-brand-dim uppercase tracking-wider text-center leading-tight">
        {label}
      </div>
    </div>
  );
}

export default function RecipeInteractionsCard() {
  const summary = useApi(() => getRecipeInteractionsSummary(30), []);
  const topCooked = useApi(() => getTopCookedRecipes(30, 10), []);
  const viewsVsCooks = useApi(() => getViewsVsCooks(30, 10), []);
  const matchDist = useApi(() => getMatchDistribution(30), []);

  const loading =
    summary.loading ||
    topCooked.loading ||
    viewsVsCooks.loading ||
    matchDist.loading;
  const error =
    summary.error ?? topCooked.error ?? viewsVsCooks.error ?? matchDist.error;
  const refetch = () => {
    summary.refetch();
    topCooked.refetch();
    viewsVsCooks.refetch();
    matchDist.refetch();
  };

  const cookRate = summary.data?.cook_through_rate ?? 0;
  const cookRateColor =
    cookRate >= 30 ? theme.ok : cookRate >= 15 ? theme.warn : theme.danger;

  const allLoaded =
    summary.data && topCooked.data && viewsVsCooks.data && matchDist.data;

  return (
    <BQCard
      id="T2.3"
      title="Recipe Interactions — Recomendación & Cook-through (30d)"
      type="Feature Analysis"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {allLoaded && (
        <div className="flex-1 flex flex-col gap-5">
          {/* Bloque A — KPIs */}
          <div className="grid grid-cols-2 gap-2">
            <KpiBox
              value={summary.data!.total_cooked.toLocaleString()}
              label="Recetas cocinadas"
              color={theme.ok}
            />
            <KpiBox
              value={summary.data!.total_viewed.toLocaleString()}
              label="Recetas vistas"
              color={theme.accent}
            />
            <KpiBox
              value={`${cookRate.toFixed(1)}%`}
              label="Cook-through rate"
              color={cookRateColor}
            />
            <KpiBox
              value={
                summary.data!.avg_inventory_matches_on_cook != null
                  ? summary.data!.avg_inventory_matches_on_cook.toFixed(1)
                  : "—"
              }
              label="Avg inventory matches al cocinar"
              color={theme.primary}
            />
          </div>

          {/* Bloque B — Top 10 más cocinadas */}
          {topCooked.data!.length > 0 && (
            <div>
              <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-2">
                Top 10 recetas más cocinadas
              </div>
              <div className="min-h-[200px]">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={topCooked.data!}
                    layout="vertical"
                    margin={{ top: 2, right: 16, bottom: 2, left: 8 }}
                  >
                    <CartesianGrid
                      stroke={theme.border}
                      strokeDasharray="3 3"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: theme.dim, fontSize: 10 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: theme.dim, fontSize: 10 }}
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        background: theme.panel2,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 8,
                        color: theme.text,
                        fontSize: 12,
                      }}
                      formatter={(v) => [
                        typeof v === "number" ? v : Number(v) || 0,
                        "cocinadas",
                      ]}
                    />
                    <Bar dataKey="cooks" fill={chartPalette[0]} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Bloque C — Vistas vs Cocinadas */}
          {viewsVsCooks.data!.length > 0 && (
            <div>
              <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-2">
                Vistas vs cocinadas por receta
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-brand-dim uppercase tracking-wider">
                      <th className="text-left pb-1 pr-2">Receta</th>
                      <th className="text-right pb-1 pr-2">Vistas</th>
                      <th className="text-right pb-1 pr-2">Cocinadas</th>
                      <th className="text-right pb-1">Rate %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewsVsCooks.data!.map((row) => (
                      <tr
                        key={row.name}
                        className="border-t border-brand-border"
                      >
                        <td className="py-1 pr-2 text-brand-text truncate max-w-[120px]">
                          {row.name}
                        </td>
                        <td className="py-1 pr-2 text-right text-brand-dim">
                          {row.views}
                        </td>
                        <td className="py-1 pr-2 text-right font-semibold text-brand-ok">
                          {row.cooks}
                        </td>
                        <td
                          className="py-1 text-right font-semibold"
                          style={{
                            color:
                              row.rate_pct == null
                                ? theme.dim
                                : row.rate_pct >= 30
                                ? theme.ok
                                : row.rate_pct >= 15
                                ? theme.warn
                                : theme.danger,
                          }}
                        >
                          {row.rate_pct != null ? `${row.rate_pct}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bloque D — Histograma inventory_matches */}
          {matchDist.data!.length > 0 && (
            <div>
              <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-2">
                Distribución inventory_matches al cocinar
              </div>
              <div className="min-h-[120px]">
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart
                    data={matchDist.data!}
                    margin={{ top: 2, right: 8, bottom: 2, left: 0 }}
                  >
                    <CartesianGrid
                      stroke={theme.border}
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="matches"
                      tick={{ fill: theme.dim, fontSize: 11 }}
                      label={{
                        value: "matches",
                        position: "insideBottom",
                        offset: -2,
                        fill: theme.dim,
                        fontSize: 10,
                      }}
                    />
                    <YAxis tick={{ fill: theme.dim, fontSize: 10 }} width={28} />
                    <Tooltip
                      contentStyle={{
                        background: theme.panel2,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 8,
                        color: theme.text,
                        fontSize: 12,
                      }}
                      formatter={(v) => [
                        typeof v === "number" ? v : Number(v) || 0,
                        "cocciones",
                      ]}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {matchDist.data!.map((_, i) => (
                        <Cell
                          key={i}
                          fill={chartPalette[i % chartPalette.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </BQCard>
  );
}
