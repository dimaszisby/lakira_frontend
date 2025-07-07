import { DataLabel } from "@/src/components/ui/DataLabel";
import SectionCard from "@/src/components/ui/SectionCard";
import SubsectionCard from "@/src/components/ui/SubsectionCard";
import { PencilSimple } from "phosphor-react";
import { safeLabel } from "@/utils/helpers/labelHelper";
import { formatDate } from "@/utils/helpers/dateHelper"; // Ensure this utility exists for date formatting
import { UserMetricDetailResponseDTO } from "@/src/types/dtos/metric.dto";

/**
 * Settings panel for a metric, showing goal, alert, and display options.
 */
const MetricSettingsSection: React.FC<{
  settings: UserMetricDetailResponseDTO["settings"] | null;
}> = ({ settings }) => {
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
                label="Goal Type"
                value={safeLabel(settings?.goalType, "Not Set")}
              />
              <DataLabel
                label="Goal Value"
                value={safeLabel(settings?.goalValue, "Not Set")}
              />
              <DataLabel
                label="Start Date"
                value={safeLabel(formatDate(settings?.startDate), "Not Set")}
              />
              <DataLabel
                label="Deadline Date"
                value={safeLabel(formatDate(settings?.deadlineDate), "Not Set")}
              />
            </div>
          </SubsectionCard>

          {/* Alert */}
          <SubsectionCard title="Alert Settings">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <DataLabel
                label="Warn"
                value={safeLabel(settings?.alertThresholds)}
              />
              <DataLabel
                label="Alert"
                value={safeLabel(settings?.alertEnabled)}
              />
            </div>
          </SubsectionCard>
        </div>

        {/* Display Options */}
        <SubsectionCard title="Display Options">
          <div className="grid grid-flow-col gap-x-4 gap-y-2 wrap">
            <DataLabel
              label="Show on Dashboard"
              value={safeLabel(settings?.displayOptions?.showOnDashboard)}
            />
            <DataLabel
              label="Priortiy"
              value={safeLabel(settings?.displayOptions?.priority)}
            />
            <DataLabel
              label="Chart Type"
              value={safeLabel(settings?.displayOptions?.chartType, "Default")}
            />
            <DataLabel
              label="Color"
              value={safeLabel(settings?.displayOptions?.color, "Default")}
            />
          </div>
        </SubsectionCard>
      </div>
    </SectionCard>
  );
};

export default MetricSettingsSection;
