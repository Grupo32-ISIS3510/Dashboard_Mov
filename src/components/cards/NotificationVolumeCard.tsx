import { useApi } from "../../hooks/useApi";
import { getEventsSummary, getInventoryEventsSummary } from "../../api/analytics";
import BQCard from "../BQCard";
import { theme } from "../../styles/theme";

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
      <div
        className="text-2xl font-bold"
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

export default function NotificationVolumeCard() {
  const events = useApi(() => getEventsSummary(30), []);
  const inventory = useApi(() => getInventoryEventsSummary(30), []);

  const loading = events.loading || inventory.loading;
  const error = events.error ?? inventory.error;
  const refetch = () => {
    events.refetch();
    inventory.refetch();
  };

  const delivered =
    events.data?.breakdown.find((e) => e.event_name === "notification_received")
      ?.count ?? 0;
  const opened =
    events.data?.breakdown.find((e) => e.event_name === "notification_opened")
      ?.count ?? 0;
  const openRate = delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : "—";
  const openRateColor =
    delivered > 0
      ? Number(openRate) >= 30
        ? theme.ok
        : Number(openRate) >= 15
        ? theme.warn
        : theme.danger
      : theme.dim;

  const registered = inventory.data?.total_registered ?? 0;
  const eligible = inventory.data?.eligible_for_alert ?? 0;
  const coveragePct =
    registered > 0 ? ((eligible / registered) * 100).toFixed(1) : "—";

  return (
    <BQCard
      id="T2.2"
      title="Notification Volume & Engagement (30d)"
      type="Feature Analysis"
      loading={loading}
      error={error}
      onRetry={refetch}
    >
      {events.data && inventory.data && (
        <div className="flex-1 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <KpiBox
              value={delivered.toLocaleString()}
              label="Notificaciones entregadas"
              color={theme.accent}
            />
            <KpiBox
              value={registered.toLocaleString()}
              label="Ítems registrados"
              color={theme.primary}
            />
            <KpiBox
              value={eligible.toLocaleString()}
              label="Elegibles para alerta"
              color={theme.warn}
            />
            <KpiBox
              value={opened.toLocaleString()}
              label="Notificaciones abiertas"
              color={theme.ok}
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-brand-border">
            <div className="text-center flex-1">
              <div
                className="text-3xl font-bold"
                style={{ color: openRateColor }}
              >
                {openRate}%
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider mt-1">
                open rate
              </div>
            </div>
            <div className="w-px h-10 bg-brand-border" />
            <div className="text-center flex-1">
              <div className="text-3xl font-bold text-brand-text">
                {coveragePct}%
              </div>
              <div className="text-[10px] text-brand-dim uppercase tracking-wider mt-1">
                cobertura alerta
              </div>
            </div>
          </div>
        </div>
      )}
    </BQCard>
  );
}
