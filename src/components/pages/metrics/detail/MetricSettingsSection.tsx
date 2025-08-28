import { useState } from "react";
import DataLabel from "@/src/components/ui/DataLabel";
import SectionCard from "@/src/components/ui/SectionCard";
import SubsectionCard from "@/src/components/ui/SubsectionCard";
import { PencilSimple } from "phosphor-react";
import { safeLabel } from "@/utils/helpers/labelHelper";
import { formatDate } from "@/utils/helpers/dateHelper";
import { MetricSettingsVM } from "@/src/features/metrics/view-models";

const MetricSettingsSection = ({ data }: { data: MetricSettingsVM }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  return (
    <SectionCard
      title="Metric Settings"
      headerComponent={
        <div>
          {/* Edit Button */}
          <button
            className="w-full flex rounded-full p-2 bg-[#F4C3CD] text-[#C76576] hover:bg-[#E897A3] transition"
            aria-label="Edit Metric"
          >
            <PencilSimple size={22} />
          </button>
        </div>
      }
    >
      {/* Settings Segment */}
      <div className="flex-col">
        {/* Goal & Alert */}
        <div className="grid grid-flow-col gap-2 rounded-xl mb-2">
          {/* Goal */}
          <SubsectionCard title="Goal Settings">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <DataLabel
                title="Goal Type"
                value={safeLabel(data?.goalType, "Not Set")}
              />
              <DataLabel
                title="Goal Value"
                value={safeLabel(data?.goalValue, "Not Set")}
              />
              <DataLabel
                title="Start Date"
                value={safeLabel(formatDate(data?.startDate), "Not Set")}
              />
              <DataLabel
                title="Deadline Date"
                value={safeLabel(formatDate(data?.deadlineDate), "Not Set")}
              />
            </div>
          </SubsectionCard>

          {/* Alert */}
          <SubsectionCard title="Alert Settings">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <DataLabel
                title="Warn"
                value={safeLabel(data?.alertThresholds)}
              />
              <DataLabel title="Alert" value={safeLabel(data?.alertEnabled)} />
            </div>
          </SubsectionCard>
        </div>

        {/* Display Options */}
        <SubsectionCard title="Display Options">
          <div className="grid grid-flow-col gap-x-4 gap-y-2 wrap">
            <DataLabel
              title="Show on Dashboard"
              value={safeLabel(data?.display?.showOnDashboard)}
            />
            <DataLabel
              title="Priortiy"
              value={safeLabel(data?.display?.priority)}
            />
            <DataLabel
              title="Chart Type"
              value={safeLabel(data?.display?.chartType, "Default")}
            />
            <DataLabel
              title="Color"
              value={safeLabel(data?.display?.color, "Default")}
            />
          </div>
        </SubsectionCard>
      </div>
    </SectionCard>
  );
};

export default MetricSettingsSection;
