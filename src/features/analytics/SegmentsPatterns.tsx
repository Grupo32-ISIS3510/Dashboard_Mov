import { useMemo } from "react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useApi } from "../../hooks/useApi";
import { getSegmentsPatterns } from "../../api/analytics";
import BQCard from "../../components/BQCard";
import { theme } from "../../styles/theme";
import type {
  SegmentPattern,
  SegmentPatternKind,
} from "../../types/api";

const SEGMENT_META: Record<
  SegmentPatternKind,
  { label: string; color: string; bg: string; border: string }
> = {
  passive: {
    label: "Passive",
    color: theme.danger,
    bg: "rgba(255, 92, 119, 0.10)",
    border: "rgba(255, 92, 119, 0.55)",
  },
  neutral: {
    label: "Neutral",
    color: theme.warn,
    bg: "rgba(255, 181, 71, 0.10)",
    border: "rgba(255, 181, 71, 0.55)",
  },
  proactive: {
    label: "Proactive",
    color: theme.ok,
    bg: "rgba(74, 222, 128, 0.10)",
    border: "rgba(74, 222, 128, 0.55)",
  },
};

const SEGMENT_ORDER: SegmentPatternKind[] = ["passive", "neutral", "proactive"];

function findSegment(
  segments: SegmentPattern[],
  kind: SegmentPatternKind
): SegmentPattern | undefined {
  return segments.find((s) => s.segment === kind);
}

function fmtHours(h: number | null): string {
  if (h == null) return "—";
  if (h < 1) return `${Math.round(h * 60)}m`;
  if (h < 24) return `${h.toFixed(1)}h`;
  return `${(h / 24).toFixed(1)}d`;
}

function fmtNumber(n: number, digits = 1): string {
  return n.toFixed(digits);
}

function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

type MetricRow = {
  icon: string;
  label: string;
  format: (s: SegmentPattern) => string;
};

const METRIC_ROWS: MetricRow[] = [
  {
    icon: "🍳",
    label: "Recetas cocinadas (30d)",
    format: (s) => fmtNumber(s.avg_recipes_cooked_30d),
  },
  {
    icon: "🔔",
    label: "Open rate notificaciones",
    format: (s) => fmtPct(s.avg_notification_open_rate),
  },
  {
    icon: "📦",
    label: "Ítems registrados (30d)",
    format: (s) => fmtNumber(s.avg_items_registered_30d),
  },
  {
    icon: "🗑️",
    label: "Ítems desperdiciados (30d)",
    format: (s) => fmtNumber(s.avg_items_wasted_30d),
  },
  {
    icon: "⚡",
    label: "Respuesta a alertas",
    format: (s) => fmtHours(s.avg_alert_response_hours),
  },
  {
    icon: "⭐",
    label: "Favoritos",
    format: (s) => fmtNumber(s.avg_favorites),
  },
];

const RADAR_AXES: {
  key: string;
  label: string;
  pick: (s: SegmentPattern) => number | null;
  inverse: boolean;
}[] = [
  {
    key: "cocinadas",
    label: "Cocinadas",
    pick: (s) => s.avg_recipes_cooked_30d,
    inverse: false,
  },
  {
    key: "openrate",
    label: "Open rate",
    pick: (s) => s.avg_notification_open_rate,
    inverse: false,
  },
  {
    key: "registrados",
    label: "Registrados",
    pick: (s) => s.avg_items_registered_30d,
    inverse: false,
  },
  {
    key: "no_waste",
    label: "No-waste",
    pick: (s) => s.avg_items_wasted_30d,
    inverse: true,
  },
  {
    key: "respuesta",
    label: "Respuesta",
    pick: (s) => s.avg_alert_response_hours,
    inverse: true,
  },
];

type RadarRow = { axis: string } & Record<string, number | string>;

function buildRadarData(segments: SegmentPattern[]): RadarRow[] {
  return RADAR_AXES.map((axis) => {
    const rawBySegment = SEGMENT_ORDER.map((kind) => {
      const seg = findSegment(segments, kind);
      const v = seg ? axis.pick(seg) : null;
      return { kind, value: v };
    });
    const validValues = rawBySegment
      .map((r) => r.value)
      .filter((v): v is number => v != null);
    const max = validValues.length ? Math.max(...validValues) : 0;

    const row: RadarRow = { axis: axis.label };
    for (const { kind, value } of rawBySegment) {
      let score = 0;
      if (max > 0 && value != null) {
        score = axis.inverse ? (max - value) / max : value / max;
      }
      row[kind] = Number((score * 100).toFixed(1));
    }
    return row;
  });
}

export default function SegmentsPatterns() {
  const { data, loading, error, refetch } = useApi(
    () => getSegmentsPatterns(30),
    []
  );

  const orderedSegments = useMemo(() => {
    if (!data) return [];
    return SEGMENT_ORDER.map((kind) => findSegment(data.segments, kind)).filter(
      (s): s is SegmentPattern => !!s
    );
  }, [data]);

  const radarData = useMemo(
    () => (data ? buildRadarData(data.segments) : []),
    [data]
  );

  const isEmpty = data && data.total_users_analyzed === 0;

  return (
    <BQCard
      id="T4.1"
      title="Patrones de comportamiento — Passive vs Neutral vs Proactive (30d)"
      type="User Experience"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {data && (
        <div className="flex-1 flex flex-col gap-4">
          <div className="text-center text-xs text-brand-dim">
            {data.total_users_analyzed.toLocaleString("es-CO")} usuarios
            analizados · ventana {data.period_days}d
          </div>

          {isEmpty ? (
            <div className="flex-1 flex items-center justify-center text-brand-dim text-sm">
              No hay usuarios suficientes para analizar el periodo
            </div>
          ) : (
            <>
              <div className="min-h-[260px]">
                <div className="text-[11px] text-brand-dim uppercase tracking-wider mb-1 text-center">
                  Radar comparativo (normalizado · más lejos = mejor)
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid stroke={theme.border} />
                    <PolarAngleAxis
                      dataKey="axis"
                      tick={{ fill: theme.dim, fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: theme.dim, fontSize: 9 }}
                      stroke={theme.border}
                    />
                    {SEGMENT_ORDER.map((kind) => {
                      const meta = SEGMENT_META[kind];
                      return (
                        <Radar
                          key={kind}
                          name={meta.label}
                          dataKey={kind}
                          stroke={meta.color}
                          fill={meta.color}
                          fillOpacity={0.18}
                          strokeWidth={2}
                        />
                      );
                    })}
                    <Tooltip
                      contentStyle={{
                        background: theme.panel2,
                        border: `1px solid ${theme.border}`,
                        borderRadius: 8,
                        color: theme.text,
                        fontSize: 12,
                      }}
                      formatter={(value) => {
                        const v =
                          typeof value === "number" ? value : Number(value) || 0;
                        return [`${v.toFixed(0)} / 100`, ""];
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontSize: 11,
                        color: theme.dim,
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {orderedSegments.map((seg) => {
                  const meta = SEGMENT_META[seg.segment];
                  const pct =
                    data.total_users_analyzed > 0
                      ? (seg.user_count / data.total_users_analyzed) * 100
                      : 0;
                  return (
                    <div
                      key={seg.segment}
                      className="rounded-xl border flex flex-col"
                      style={{
                        background: meta.bg,
                        borderColor: meta.border,
                      }}
                    >
                      <div
                        className="px-3 py-2 flex items-baseline justify-between"
                        style={{ borderBottom: `1px solid ${meta.border}` }}
                      >
                        <span
                          className="font-bold uppercase tracking-wider text-sm"
                          style={{ color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <span className="text-xs text-brand-dim">
                          <span
                            className="font-bold text-base"
                            style={{ color: meta.color }}
                          >
                            {seg.user_count}
                          </span>{" "}
                          · {pct.toFixed(1)}%
                        </span>
                      </div>

                      <div className="flex flex-col divide-y divide-brand-border/40">
                        {METRIC_ROWS.map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center justify-between px-3 py-1.5 text-xs"
                          >
                            <span className="flex items-center gap-2 text-brand-dim">
                              <span aria-hidden>{row.icon}</span>
                              {row.label}
                            </span>
                            <span className="font-semibold text-brand-text">
                              {row.format(seg)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {seg.top_features.length > 0 && (
                        <div
                          className="px-3 py-2 flex flex-wrap gap-1"
                          style={{ borderTop: `1px solid ${meta.border}` }}
                        >
                          {seg.top_features.slice(0, 3).map((f) => (
                            <span
                              key={f}
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                color: meta.color,
                                border: `1px solid ${meta.border}`,
                              }}
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </BQCard>
  );
}
