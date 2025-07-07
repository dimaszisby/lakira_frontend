// MetricHeaderSection.tsx

// components
import { DataLabel } from "@/src/components/ui/DataLabel";
import OverlineLabel from "@/src/components/ui/OverlineLabel";
import { safeLabel } from "@/utils/helpers/labelHelper";
import { PencilSimple } from "phosphor-react";

// types
import { MetricCore } from "@/src/features/metrics/types";

// utlis
import { formatDate } from "@/utils/helpers/dateHelper";

/**
 * Metric detail header card, matching Figma layout.
 */

interface MetricHeaderSectionProps {
  metric: MetricCore;
  onEditMetric: () => void;
}

const MetricHeaderSection: React.FC<MetricHeaderSectionProps> = ({
  metric,
}) => {
  // Developer Note: Metric Category component is wIP

  return (
    <section className="w-full bg-white rounded-2xl shadow p-6 relative">
      {/* Edit Button */}
      <button
        className="absolute top-5 right-5 rounded-full p-2 bg-[#F4C3CD] text-[#C76576] hover:bg-[#E897A3] transition"
        aria-label="Edit Metric"
      >
        <PencilSimple size={22} />
      </button>

      {/* Metric Title */}
      <div className="mb-4">
        <OverlineLabel text="Metric Name" />
        <div className="font-bold text-xl text-gray-800">{metric?.name}</div>
      </div>

      {/* Metric Unit, Category, Visibility */}
      <div className="flex flex-wrap gap-8 mb-4">
        <DataLabel
          label="Default Unit"
          value={safeLabel(metric?.defaultUnit, "Not Set")}
        />

        <div>
          <OverlineLabel text="Category" />
        </div>
        <div>
          <OverlineLabel text="Visibility" />
          <div className={metric.isPublic ? "text-green-600" : "text-red-600"}>
            {metric.isPublic ? "Public" : "Private"}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-3">
        <OverlineLabel text="Description" />
        <div className="text-gray-600">
          {metric.description || (
            <span className="italic text-gray-400">
              No description provided.
            </span>
          )}
        </div>
      </div>

      {/* Created/Updated At */}
      <div className="flex gap-6 text-xs text-gray-400 mt-3">
        <span>
          Created at&nbsp;
          {formatDate(metric?.createdAt, true)}
        </span>
        <span>
          Updated at&nbsp;
          {formatDate(metric?.updatedAt, true)}
        </span>
      </div>
    </section>
  );
};

export default MetricHeaderSection;
