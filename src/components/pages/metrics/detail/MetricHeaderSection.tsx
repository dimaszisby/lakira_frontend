import { useState } from "react";
import DataLabel from "@/src/components/ui/DataLabel";
import { PencilSimple } from "phosphor-react";
import { formatDate } from "@/utils/helpers/dateHelper";
import { safeLabel } from "@/utils/helpers/labelHelper";
import MetricForm from "../MetricForm";
import { MetricHeaderVM } from "@/src/features/metrics/view-models";

function MetricHeaderSection(data: MetricHeaderVM) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleUpdateMetric = () => {
    setModalOpen(true);
  };

  return (
    <>
      <MetricForm
        metricId={data.id}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMetric={data}
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
          value={safeLabel(data?.name, "Not Set")}
          valueStyle="xl"
          className="mb-4"
        />

        {/* Metric Unit, Category, Visibility */}
        <div className="flex sm:flex-wrap lg:flex-row gap-8 items-start content-start justify-start mb-4">
          <DataLabel
            title="Default Unit"
            value={safeLabel(data?.defaultUnit, "Not Set")}
          />

          <DataLabel
            title="Category"
            value={safeLabel(data?.category?.name, "Not Set")}
            renderValue={
              <span className={`block bg-gray-200 px-3 py-1  rounded-xl`}>
                {data.category ? data.category.name : "No Category"}
              </span>
            }
          />

          <DataLabel
            title="Visibility"
            value={safeLabel(data?.isPublic, "Not Set")}
            renderValue={
              <div
                className={data.isPublic ? "text-green-600" : "text-red-600"}
              >
                {data.isPublic ? "Public" : "Private"}
              </div>
            }
          />
        </div>

        <DataLabel
          title="Description"
          value={safeLabel(data?.description, "Not Description Provided")}
          valueStyle="sm"
        />

        {/* Created/Updated At */}
        <div className="flex gap-6 text-xs text-gray-400 mt-3">
          <span>
            Created at&nbsp;
            {formatDate(data?.createdAt, true)}
          </span>
          <span>
            Updated at&nbsp;
            {formatDate(data?.updatedAt, true)}
          </span>
        </div>
      </section>
    </>
  );
}

export default MetricHeaderSection;
