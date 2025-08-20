// MetricHeaderSection.tsx

import { useState } from "react";

// components
import DataLabel from "@/src/components/ui/DataLabel";
import { PencilSimple } from "phosphor-react";

// types
import { MetricCore } from "@/src/features/metrics/types";

// utlis
import { formatDate } from "@/utils/helpers/dateHelper";
import { safeLabel } from "@/utils/helpers/labelHelper";
import MetricForm from "../MetricForm";

/**
 * Metric detail header card, matching Figma layout.
 * A static view components, only updated when the parent view refreshed.
 */

interface MetricHeaderSectionProps {
  metric: MetricCore;
}

const MetricHeaderSection = ({ metric }: MetricHeaderSectionProps) => {
  // TODO - Developer Note: Metric Category component is WIP

  // States
  const [modalOpen, setModalOpen] = useState(false);

  // Handlers
  const handleUpdateMetric = () => {
    setModalOpen(true);
  };

  return (
    <>
      <MetricForm
        metricId={metric.id}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMetric={metric}
      />

      <section className="w-full bg-white rounded-2xl shadow p-6 relative">
        {/* Edit Button */}
        <button
          className="absolute top-5 right-5 rounded-full p-2 bg-[#F4C3CD] text-[#C76576] hover:bg-[#E897A3] transition"
          aria-label="Edit Metric"
          onClick={handleUpdateMetric}
        >
          <PencilSimple size={22} />
        </button>

        {/* Metric Title */}
        <DataLabel
          title="Metric Name"
          value={safeLabel(metric?.name, "Not Set")}
          valueStyle="xl"
          className="mb-4"
        />

        {/* Metric Unit, Category, Visibility */}
        <div className="flex sm:flex-wrap lg:flex-row gap-8 items-start content-start justify-start mb-4">
          <DataLabel
            title="Default Unit"
            value={safeLabel(metric?.defaultUnit, "Not Set")}
          />

          <DataLabel
            title="Category"
            value={safeLabel(metric?.categoryId, "Not Set")}
            renderValue={
              <div className={`block bg-gray-200 px-3 py-1  rounded-xl`}>
                {metric.categoryId ? `${metric.categoryId}` : "No Category"}
              </div>
            }
          />

          <DataLabel
            title="Visibility"
            value={safeLabel(metric?.isPublic, "Not Set")}
            renderValue={
              <div
                className={metric.isPublic ? "text-green-600" : "text-red-600"}
              >
                {metric.isPublic ? "Public" : "Private"}
              </div>
            }
          />
        </div>

        <DataLabel
          title="Description"
          value={safeLabel(metric?.description, "Not Description Provided")}
          valueStyle="sm"
        />

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
    </>
  );
};

export default MetricHeaderSection;
