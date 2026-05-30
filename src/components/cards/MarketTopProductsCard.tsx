import { useApi } from "../../hooks/useApi";
import { getTopProducts } from "../../api/analytics";
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

// Colors encode the repurchase rate at a glance — green = loyal product
// (users buy it again ≥ 2 times), gray = popular but one-time purchase.
function repurchaseColor(rate: number): string {
  if (rate >= 0.5) return theme.ok;
  if (rate >= 0.25) return theme.warn;
  return chartPalette[5];
}

function fmtPct(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

export default function MarketTopProductsCard() {
  const { data, loading, error, refetch } = useApi(
    () => getTopProducts(10),
    []
  );

  const products = data?.products ?? [];
  const categories = data?.categories ?? [];

  // Backend already sorts; sort defensively in case of in-flight changes.
  const productData = products
    .slice()
    .sort((a, b) => b.consumption_count - a.consumption_count)
    .map((p) => ({
      product_name: p.product_name,
      category: p.category ?? "Sin categoría",
      consumption_count: p.consumption_count,
      unique_users: p.unique_users,
      repurchase_rate: p.repurchase_rate,
      avg_per_user: p.avg_consumption_per_user,
    }));

  const categoryData = categories
    .slice()
    .sort((a, b) => b.total_consumption - a.total_consumption)
    .map((c) => ({
      category: c.category,
      total_consumption: c.total_consumption,
      unique_users: c.unique_users,
      top_product: c.top_product ?? "—",
    }));

  return (
    <BQCard
      id="T4.2"
      title="Market — top products & categories (cross-user)"
      type="Mixed Impact"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col gap-4">
          {/* Header KPIs */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div>
              <div className="text-2xl font-bold text-brand-primary">
                {data.total_users_analyzed}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">
                users analyzed
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-text">
                {productData.length}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">
                top products
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-text">
                {categoryData.length}
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider">
                categories
              </div>
            </div>
          </div>

          {productData.length === 0 ? (
            <p className="text-brand-dim text-sm text-center mt-2">
              Sin datos suficientes aún. Ejecuta{" "}
              <code className="text-brand-text">
                POST /api/v1/analytics/market/seed-demo
              </code>{" "}
              o espera a que varios usuarios registren consumo de productos.
            </p>
          ) : (
            <>
              {/* Section A — Top Products */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <div className="text-[11px] text-brand-dim uppercase tracking-wider">
                    Top productos — barra = consumo · color = recompra
                  </div>
                  <div className="flex gap-3 text-[10px] text-brand-dim">
                    <span className="flex items-center gap-1">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: theme.ok }}
                      />
                      ≥ 50%
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: theme.warn }}
                      />
                      25–49%
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ background: chartPalette[5] }}
                      />
                      &lt; 25%
                    </span>
                  </div>
                </div>
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(220, productData.length * 28)}
                >
                  <BarChart
                    data={productData}
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
                      dataKey="product_name"
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
                        const v =
                          typeof value === "number"
                            ? value
                            : Number(value) || 0;
                        const p = entry.payload as (typeof productData)[number];
                        return [
                          `${v} consumos · ${p.unique_users} usuarios · recompra ${fmtPct(
                            p.repurchase_rate
                          )} · ${p.avg_per_user.toFixed(1)}/usuario · ${p.category}`,
                          "Producto",
                        ];
                      }}
                    />
                    <Bar dataKey="consumption_count" radius={[0, 4, 4, 0]}>
                      {productData.map((p, i) => (
                        <Cell key={i} fill={repurchaseColor(p.repurchase_rate)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Section B — Top Categories */}
              {categoryData.length > 0 && (
                <div className="flex-1 pt-3 border-t border-brand-border">
                  <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1">
                    Categorías — consumo total · producto estrella en tooltip
                  </div>
                  <ResponsiveContainer
                    width="100%"
                    height={Math.max(160, categoryData.length * 28)}
                  >
                    <BarChart
                      data={categoryData}
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
                          const c = entry.payload as (typeof categoryData)[number];
                          return [
                            `${v} consumos · ${c.unique_users} usuarios · top: ${c.top_product}`,
                            "Categoría",
                          ];
                        }}
                      />
                      <Bar dataKey="total_consumption" radius={[0, 4, 4, 0]}>
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

              <div className="text-[10px] text-brand-dim text-right">
                Generated at {new Date(data.generated_at).toLocaleString()}
              </div>
            </>
          )}
        </div>
      )}
    </BQCard>
  );
}
