import { useState } from "react";
import DataLabel from "@/src/components/ui/DataLabel";
import { PencilSimple } from "phosphor-react";
import { formatDate } from "@/utils/helpers/dateHelper";
import { safeLabel } from "@/utils/helpers/labelHelper";
import MetricCategoryForm from "../MetricCategoryForm";
import { useMetricCategoryById } from "@/src/features/metricCategories/hooks";
import SkeletonLoader from "@/src/components/ui/SekeletonLoader";

// TODO: Should use ViewModel instead as static params. Data should be fetched on main Page
const MetricCategoryHeaderSection = ({
  categoryId,
}: {
  categoryId: string;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: category,
    isLoading,
    error,
  } = useMetricCategoryById(categoryId);

  const handleUpdateCategory = () => {
    setModalOpen(true);
  };

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return <div>Error loading metric category details: {error.message}</div>;

  return (
    <>
      <MetricCategoryForm
        categoryId={category ? category.id : null}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialCategory={category ? category : null}
      />

      <section className="w-full bg-white rounded-2xl shadow p-6 relative">
        {/* Edit Button */}
        <button
          className="absolute top-5 right-5 rounded-full p-2 bg-[#F4C3CD] text-[#C76576] hover:bg-[#E897A3] transition"
          aria-label="Edit Metric"
          onClick={handleUpdateCategory}
        >
          <PencilSimple size={22} />
        </button>

        {/* Metric Title */}
        <DataLabel
          title="NAME"
          value={safeLabel(category?.name, "Not Set")}
          valueStyle="xl"
          className="mb-4"
        />

        {/* Metric Unit, Category, Visibility */}
        <div className="flex sm:flex-wrap lg:flex-row gap-8 items-start content-start justify-start mb-4">
          <DataLabel
            title="COLOR"
            value={safeLabel(category?.color, "Not Set")}
          />

          <DataLabel
            title="ICON"
            value={safeLabel(category?.icon, "Not Set")}
          />
        </div>

        {/* Created/Updated At */}
        <div className="flex gap-6 text-xs text-gray-400 mt-3">
          <span>
            Created at&nbsp;
            {formatDate(category?.createdAt, true)}
          </span>
          <span>
            Updated at&nbsp;
            {formatDate(category?.updatedAt, true)}
          </span>
        </div>
      </section>
    </>
  );
};

export default MetricCategoryHeaderSection;
