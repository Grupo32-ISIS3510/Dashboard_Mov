import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApi } from "../../hooks/useApi";
import { getWasteReductionByRecipeCategory } from "../../api/analytics";
import BQCard from "../../components/BQCard";
import { chartPalette, theme } from "../../styles/theme";
import type { WasteReductionCategoryItem } from "../../types/api";

const PERIOD_OPTIONS = [7, 30, 90] as const;
const RESCUE_WINDOW_OPTIONS = [1, 3, 5, 7] as const;

type PeriodOption = (typeof PERIOD_OPTIONS)[number];
type RescueWindowOption = (typeof RESCUE_WINDOW_OPTIONS)[number];

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function formatCop(raw: string | number): string {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return "—";
  return copFormatter.format(n);
}

function categoryLabel(c: string | null): string {
  return c ?? "Sin categoría";
}

type SortKey =
  | "category"
  | "cooks"
  | "items_consumed_total"
  | "items_rescued"
  | "rescue_rate"
  | "value_rescued_cop"
  | "unique_users";

type SortDir = "asc" | "desc";

function sortRows(
  rows: WasteReductionCategoryItem[],
  key: SortKey,
  dir: SortDir
): WasteReductionCategoryItem[] {
  const mult = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    let av: number | string;
    let bv: number | string;
    if (key === "category") {
      av = categoryLabel(a.recipe_category).toLowerCase();
      bv = categoryLabel(b.recipe_category).toLowerCase();
    } else if (key === "value_rescued_cop") {
      av = Number(a.value_rescued_cop);
      bv = Number(b.value_rescued_cop);
    } else {
      av = a[key] as number;
      bv = b[key] as number;
    }
    if (av < bv) return -1 * mult;
    if (av > bv) return 1 * mult;
    return 0;
  });
}

function PillSelector<T extends number>({
  label,
  value,
  options,
  suffix,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  suffix: string;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-brand-dim uppercase tracking-wider">
        {label}
      </span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition ${
              value === opt
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-brand-panel2 text-brand-dim border-brand-border hover:border-brand-primary"
            }`}
          >
            {opt}
            {suffix}
          </button>
        ))}
      </div>
    </div>
  );
}

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
        className="text-2xl font-bold leading-tight"
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

function SortHeader({
  label,
  active,
  dir,
  align,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  align: "left" | "right";
  onClick: () => void;
}) {
  const arrow = active ? (dir === "asc" ? "↑" : "↓") : "";
  return (
    <th
      onClick={onClick}
      className={`pb-1 px-2 cursor-pointer select-none text-[10px] uppercase tracking-wider ${
        align === "left" ? "text-left" : "text-right"
      } ${active ? "text-brand-text" : "text-brand-dim hover:text-brand-text"}`}
    >
      {label} <span className="text-brand-primary">{arrow}</span>
    </th>
  );
}

export default function WasteReductionByRecipeCategory() {
  const [days, setDays] = useState<PeriodOption>(30);
  const [rescueWindow, setRescueWindow] = useState<RescueWindowOption>(3);
  const [sortKey, setSortKey] = useState<SortKey>("items_rescued");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data, loading, error, refetch } = useApi(
    () => getWasteReductionByRecipeCategory(days, rescueWindow),
    [days, rescueWindow]
  );

  const sortedRows = useMemo(() => {
    if (!data) return [];
    return sortRows(data.by_category, sortKey, sortDir);
  }, [data, sortKey, sortDir]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return [...data.by_category]
      .sort((a, b) => b.items_rescued - a.items_rescued)
      .map((c) => ({
        category: categoryLabel(c.recipe_category),
        rescatados: c.items_rescued,
        no_rescatados: Math.max(0, c.items_consumed_total - c.items_rescued),
      }));
  }, [data]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "category" ? "asc" : "desc");
    }
  };

  const hasData = data && data.by_category.length > 0;

  return (
    <BQCard
      id="T3.2"
      title="Impacto de recomendaciones de recetas en reducción de desperdicio"
      type="Mixed Impact"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <PillSelector
              label="Periodo"
              value={days}
              options={PERIOD_OPTIONS}
              suffix="d"
              onChange={setDays}
            />
            <PillSelector
              label="Ventana rescate"
              value={rescueWindow}
              options={RESCUE_WINDOW_OPTIONS}
              suffix="d"
              onChange={setRescueWindow}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <KpiBox
              value={data.total_cooks.toLocaleString("es-CO")}
              label="Recetas cocinadas"
              color={theme.primary}
            />
            <KpiBox
              value={data.total_items_rescued.toLocaleString("es-CO")}
              label="Ítems rescatados"
              color={theme.ok}
            />
            <KpiBox
              value={formatCop(data.total_value_rescued_cop)}
              label="Valor rescatado"
              color={theme.accent}
            />
          </div>

          {hasData ? (
            <>
              <div className="min-h-[240px]">
                <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1">
                  Ítems rescatados vs no rescatados, por categoría
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid
                      stroke={theme.border}
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="category"
                      tick={{ fill: theme.dim, fontSize: 10 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={50}
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
                    <Legend
                      wrapperStyle={{
                        fontSize: 11,
                        color: theme.dim,
                        paddingTop: 4,
                      }}
                    />
                    <Bar
                      dataKey="rescatados"
                      stackId="items"
                      name="Rescatados"
                      fill={chartPalette[4]}
                    />
                    <Bar
                      dataKey="no_rescatados"
                      stackId="items"
                      name="No rescatados"
                      fill={chartPalette[3]}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-brand-border">
                      <SortHeader
                        label="Categoría"
                        active={sortKey === "category"}
                        dir={sortDir}
                        align="left"
                        onClick={() => toggleSort("category")}
                      />
                      <SortHeader
                        label="Cocinadas"
                        active={sortKey === "cooks"}
                        dir={sortDir}
                        align="right"
                        onClick={() => toggleSort("cooks")}
                      />
                      <SortHeader
                        label="Ítems consumidos"
                        active={sortKey === "items_consumed_total"}
                        dir={sortDir}
                        align="right"
                        onClick={() => toggleSort("items_consumed_total")}
                      />
                      <SortHeader
                        label="Ítems rescatados"
                        active={sortKey === "items_rescued"}
                        dir={sortDir}
                        align="right"
                        onClick={() => toggleSort("items_rescued")}
                      />
                      <SortHeader
                        label="% rescate"
                        active={sortKey === "rescue_rate"}
                        dir={sortDir}
                        align="right"
                        onClick={() => toggleSort("rescue_rate")}
                      />
                      <SortHeader
                        label="Valor rescatado"
                        active={sortKey === "value_rescued_cop"}
                        dir={sortDir}
                        align="right"
                        onClick={() => toggleSort("value_rescued_cop")}
                      />
                      <SortHeader
                        label="Usuarios"
                        active={sortKey === "unique_users"}
                        dir={sortDir}
                        align="right"
                        onClick={() => toggleSort("unique_users")}
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRows.map((row) => (
                      <tr
                        key={categoryLabel(row.recipe_category)}
                        className="border-b border-brand-border/40 hover:bg-brand-panel2/50"
                      >
                        <td className="py-1.5 px-2 text-brand-text">
                          {categoryLabel(row.recipe_category)}
                        </td>
                        <td className="py-1.5 px-2 text-right text-brand-dim">
                          {row.cooks.toLocaleString("es-CO")}
                        </td>
                        <td className="py-1.5 px-2 text-right text-brand-dim">
                          {row.items_consumed_total.toLocaleString("es-CO")}
                        </td>
                        <td className="py-1.5 px-2 text-right font-semibold text-brand-ok">
                          {row.items_rescued.toLocaleString("es-CO")}
                        </td>
                        <td className="py-1.5 px-2 text-right font-semibold text-brand-accent">
                          {(row.rescue_rate * 100).toFixed(1)}%
                        </td>
                        <td className="py-1.5 px-2 text-right font-semibold text-brand-text">
                          {formatCop(row.value_rescued_cop)}
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
          ) : (
            <div className="flex-1 flex items-center justify-center text-brand-dim text-sm">
              No hay cocciones registradas en el periodo seleccionado
            </div>
          )}
        </div>
      )}
    </BQCard>
  );
}
