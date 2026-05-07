import SavingsCard from "./cards/SavingsCard";
import WasteSummaryCard from "./cards/WasteSummaryCard";
import SegmentCard from "./cards/SegmentCard";
import CameraCrashRateCard from "./cards/CameraCrashRateCard";
import ExpiryAccuracyCard from "./cards/ExpiryAccuracyCard";
import AbandonmentRateCard from "./cards/AbandonmentRateCard";

type Props = { refreshKey: number };

export default function DashboardGrid({ refreshKey }: Props) {
  return (
    <div
      key={refreshKey}
      className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
    >
      <CameraCrashRateCard />
      <ExpiryAccuracyCard />
      <AbandonmentRateCard />
      <WasteSummaryCard />
      <SavingsCard />
      <SegmentCard />
    </div>
  );
}
