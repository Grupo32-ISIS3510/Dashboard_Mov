import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApi } from "../../hooks/useApi";
import { getFavoritesDistribution } from "../../api/analytics";
import BQCard from "../../components/BQCard";
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
    <div className="flex flex-col items-center justify-center bg-brand-panel2 rounded-xl p-4 gap-1">
      <div
        className="text-3xl font-bold leading-tight"
        style={{ color: color ?? theme.text }}
      >
        {value}
      </div>
      <div className="text-[10px] text-brand-dim uppercase tracking-wider text-center leading-tight">
        {label}
      </div>
    </div>
  );
}

export default function FavoritesDistribution() {
  const [topIngredients, setTopIngredients] = useState<number>(10);
  const { data, loading, error, refetch } = useApi(
    () => getFavoritesDistribution(topIngredients),
    [topIngredients]
  );

  const isEmpty = data && data.total_favorites === 0;

  return (
    <BQCard
      id="T3.6"
      title="Distribución de favoritos — categorías e ingredientes principales"
      type="Feature Analysis"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <KpiBox
              value={data.total_favorites.toLocaleString("es-CO")}
              label="Favoritos totales"
              color={theme.primary}
            />
            <KpiBox
              value={data.unique_users.toLocaleString("es-CO")}
              label="Usuarios únicos"
              color={theme.accent}
            />
          </div>

          {isEmpty ? (
            <div className="flex-1 flex items-center justify-center text-brand-dim text-sm">
              Aún no hay favoritos registrados
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1">
                    Por categoría
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={data.by_category}
                        dataKey="favorites_count"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={2}
                        stroke={theme.panel}
                      >
                        {data.by_category.map((_, i) => (
                          <Cell
                            key={i}
                            fill={chartPalette[i % chartPalette.length]}
                          />
                        ))}
                      </Pie>
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
                            typeof value === "number" ? value : Number(value) || 0;
                          const p = entry.payload as (typeof data.by_category)[number];
                          return [
                            `${v} (${(p.pct_of_total * 100).toFixed(1)}%) · ${p.unique_users} users`,
                            p.category,
                          ];
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 justify-center mt-1">
                    {data.by_category.map((c, i) => (
                      <div
                        key={c.category}
                        className="flex items-center gap-1 text-[10px] text-brand-dim"
                      >
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-sm"
                          style={{
                            background: chartPalette[i % chartPalette.length],
                          }}
                        />
                        {c.category}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-brand-dim uppercase tracking-wider">
                      Top ingredientes
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={1}
                        max={30}
                        value={topIngredients}
                        onChange={(e) =>
                          setTopIngredients(Number(e.target.value))
                        }
                        className="accent-brand-primary w-24"
                      />
                      <span className="text-[11px] font-semibold text-brand-text w-6 text-right">
                        {topIngredients}
                      </span>
                    </div>
                  </div>
                  {data.top_ingredients.length > 0 ? (
                    <ResponsiveContainer
                      width="100%"
                      height={Math.max(
                        160,
                        Math.min(360, data.top_ingredients.length * 24)
                      )}
                    >
                      <BarChart
                        data={data.top_ingredients}
                        layout="vertical"
                        margin={{ top: 4, right: 16, bottom: 0, left: 8 }}
                      >
                        <CartesianGrid
                          stroke={theme.border}
                          strokeDasharray="3 3"
                          horizontal={false}
                        />
                        <XAxis
                          type="number"
                          tick={{ fill: theme.dim, fontSize: 10 }}
                          allowDecimals={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="ingredient_name"
                          tick={{ fill: theme.dim, fontSize: 10 }}
                          width={100}
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
                              typeof value === "number" ? value : Number(value) || 0;
                            const p = entry.payload as (typeof data.top_ingredients)[number];
                            return [
                              `${v} (${(p.pct_of_total * 100).toFixed(1)}%)`,
                              "Favoritos",
                            ];
                          }}
                        />
                        <Bar dataKey="favorites_count" radius={[0, 4, 4, 0]}>
                          {data.top_ingredients.map((_, i) => (
                            <Cell
                              key={i}
                              fill={chartPalette[i % chartPalette.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-brand-dim text-xs py-6">
                      Sin ingredientes registrados
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-brand-border text-brand-dim uppercase tracking-wider text-[10px]">
                      <th className="text-left py-1 px-2">Categoría</th>
                      <th className="text-right py-1 px-2"># favoritos</th>
                      <th className="text-right py-1 px-2">%</th>
                      <th className="text-right py-1 px-2">Usuarios únicos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.by_category.map((row) => (
                      <tr
                        key={row.category}
                        className="border-b border-brand-border/40 hover:bg-brand-panel2/50"
                      >
                        <td className="py-1.5 px-2 text-brand-text">
                          {row.category}
                        </td>
                        <td className="py-1.5 px-2 text-right font-semibold text-brand-text">
                          {row.favorites_count.toLocaleString("es-CO")}
                        </td>
                        <td className="py-1.5 px-2 text-right text-brand-accent font-semibold">
                          {(row.pct_of_total * 100).toFixed(1)}%
                        </td>
                        <td className="py-1.5 px-2 text-right text-brand-dim">
                          {row.unique_users.toLocaleString("es-CO")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </BQCard>
  );
}
