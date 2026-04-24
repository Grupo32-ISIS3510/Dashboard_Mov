import SavingsCard from "./cards/SavingsCard";
import WasteSummaryCard from "./cards/WasteSummaryCard";
import SegmentCard from "./cards/SegmentCard";
import CameraCrashRateCard from "./cards/CameraCrashRateCard";

type Props = { refreshKey: number };

export default function DashboardGrid({ refreshKey }: Props) {
  return (
    <div
      key={refreshKey}
      className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto"
    >
      <CameraCrashRateCard />
      <WasteSummaryCard />
      <SavingsCard />
      <SegmentCard />
    </div>
  );
}
