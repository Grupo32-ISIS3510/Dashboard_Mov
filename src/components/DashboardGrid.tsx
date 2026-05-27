import SavingsCard from "./cards/SavingsCard";
import WasteSummaryCard from "./cards/WasteSummaryCard";
import SegmentCard from "./cards/SegmentCard";
import CameraCrashRateCard from "./cards/CameraCrashRateCard";
import ExpiryAccuracyCard from "./cards/ExpiryAccuracyCard";
import AbandonmentRateCard from "./cards/AbandonmentRateCard";
import FeatureUsageCard from "./cards/FeatureUsageCard";
import NotificationLatencyCard from "./cards/NotificationLatencyCard";
import NotificationVolumeCard from "./cards/NotificationVolumeCard";
import AlertResponseTimeCard from "./cards/AlertResponseTimeCard";
import RecipeInteractionsCard from "./cards/RecipeInteractionsCard";
import WasteReductionByRecipeCategory from "../features/analytics/WasteReductionByRecipeCategory";
import FavoritesDistribution from "../features/analytics/FavoritesDistribution";
import SegmentsPatterns from "../features/analytics/SegmentsPatterns";

type Props = { refreshKey: number };

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2">
      <div className="text-xs font-bold uppercase tracking-widest text-brand-dim border-b border-brand-border pb-1">
        {label}
      </div>
    </div>
  );
}

export default function DashboardGrid({ refreshKey }: Props) {
  return (
    <div
      key={refreshKey}
      className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
    >
      <SectionLabel label="Telemetría" />
      <CameraCrashRateCard />
      <ExpiryAccuracyCard />
      <AbandonmentRateCard />
      <div className="lg:col-span-2 md:col-span-2">
        <FeatureUsageCard />
      </div>

      <SectionLabel label="Notificaciones — Latencia & Engagement" />
      <NotificationLatencyCard />
      <NotificationVolumeCard />
      <AlertResponseTimeCard />
      <SegmentCard />

      <SectionLabel label="Recetas — BQ T2.3" />
      <div className="lg:col-span-3 md:col-span-2">
        <RecipeInteractionsCard />
      </div>

      <SectionLabel label="Recetas — Impacto & Favoritos" />
      <div className="lg:col-span-3 md:col-span-2">
        <WasteReductionByRecipeCategory />
      </div>
      <div className="lg:col-span-3 md:col-span-2">
        <FavoritesDistribution />
      </div>

      <SectionLabel label="Segmentación — Patrones de comportamiento" />
      <div className="lg:col-span-3 md:col-span-2">
        <SegmentsPatterns />
      </div>

      <SectionLabel label="Desperdicio & Ahorro" />
      <WasteSummaryCard />
      <SavingsCard />
    </div>
  );
}
