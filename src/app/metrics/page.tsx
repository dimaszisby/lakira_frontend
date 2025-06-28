// app/metrics/page.tsx

// "use client";

// import { useState } from "react";
// import useMetrics from "@/hooks/useMetrics"; // Import the new hook
// import SkeletonLoader from "@/components/ui/SekeletonLoader";
// import MetricForm from "@/components/pages/metrics/MetricForm";
// import Modal from "@/components/ui/Modal";
// import Layout from "@/components/layout/Layout";
// import { MetricLibraryDomain } from "@/src/types/domain/metric.domain";
// import MetricEmptyState from "@/components/pages/metrics/MetricEmptyState"; // Import the new component
// import MetricLibraryCard from "@/components/pages/metrics/MetricLibraryCard"; // Import the MetricLibraryCard component
// import PrimaryButton from "@/components/ui/PrimaryButton";

// console.log("MetricsIndex component rendering");

// export default function MetricsPage() {
//   // State for controlling the visibility of the metric creation modal
//   const [isModalOpen, setModalOpen] = useState(false);

//   // Use the useMetrics hook to fetch metrics data
//   const { metrics, isLoading, isError } = useMetrics();

//   // Display an error message if there was an error loading the metrics
//   if (isError) return <p className="text-red-500">Error loading metrics.</p>;

//   return (
//     <Layout>
//       {/* Wrap page inside Layout component for consistent styling */}
//       <div className="container mx-auto p-6">
//         <h1 className="text-3xl font-bold mb-4">📊 My Metrics</h1>

//         {/* Button to open the metric creation modal */}
//         <div className="flex justify-end mb-4">
//           <PrimaryButton
//             onClick={() => setModalOpen(true)}
//             ariaLabel="Create Your First Metric"
//             className="mt-4"
//           >
//             ➕ Create Your First Metric
//           </PrimaryButton>
//         </div>

//         {/* Display a skeleton loader while the metrics are loading */}
//         {isLoading ? (
//           <SkeletonLoader count={10} className="h-10" />
//         ) : metrics.length === 0 ? (
//           // Display the MetricEmptyState component if there are no metrics
//           <MetricEmptyState onOpenModal={() => setModalOpen(true)} />
//         ) : (
//           // Display the list of metrics
//           <ul className="list-item space-y-4">
//             {metrics.map((metric: MetricLibraryDomain) => (
//               <MetricLibraryCard key={metric.id} metric={metric} />
//             ))}
//           </ul>
//         )}

//         {/* Modal for creating a new metric */}
//         <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
//           <MetricForm onClose={() => setModalOpen(false)} />
//         </Modal>
//       </div>
//     </Layout>
//   );
// }

"use client";

import { useState } from "react";
import useMetrics from "@/hooks/useMetrics";
import SkeletonLoader from "@/components/ui/SekeletonLoader";
import MetricForm from "@/components/pages/metrics/MetricForm";
import Modal from "@/components/ui/Modal";
import Layout from "@/components/layout/Layout";
import MetricEmptyState from "@/components/pages/metrics/MetricEmptyState";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Pagination } from "@/components/ui/Pagination"; // Assume this is your pagination component
import { MetricTable } from "@/components/pages/metrics/MetricTable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleApiError } from "@/utils/handleApiError";
import { createMetricDummy } from "@/utils/interactors/metric.api";
import { withAuth } from "@/components/hoc/withAuth";

const PAGE_SIZE = 20;

function MetricsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Use the new useMetrics with pagination
  const { metrics, isLoading, isError, total } = useMetrics(page, PAGE_SIZE);

  // Calculate total pages
  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;

  /**
   * * Dummy Metrics
   * UseMutation for API request for Creating Dummy Metrics
   */
  const { mutateAsync } = useMutation({
    mutationFn: createMetricDummy,
    /**
     * onSuccess callback for the useMutation hook.
     * Invalidates the 'metrics' query and closes the modal.
     */
    onSuccess: () => {
      console.log("Mutation succeeded");
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
    /**
     * onError callback for the useMutation hook.
     * Logs the error and sets isSubmitting to false.
     * @param {unknown} error - The error object.
     */
    onError: (error: unknown) => {
      const errorMessages = handleApiError(error as Error);
      console.error("Mutation error:", errorMessages);
    },
  });

  /**
   * * Dummy Metrics
   * Form Submit Handler for generating dummy metrics.
   */
  const onDummyDataSubmit = async () => {
    try {
      console.log("Submitting request for metric dummy with count 50");
      await mutateAsync({ count: 50 }); // Hardcoded count for now
      console.log("mutateAsync completed successfully");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  if (isError) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <p className="text-red-500">Error loading metrics.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">📊 My Metrics</h1>
        <div className="flex justify-end mb-4">
          <PrimaryButton
            onClick={onDummyDataSubmit}
            ariaLabel="Generate Metric"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Generate Metric
          </PrimaryButton>

          <PrimaryButton
            onClick={() => setModalOpen(true)}
            ariaLabel="Create Metric"
            className="mt-4 ml-2"
          >
            + Create Metric
          </PrimaryButton>
        </div>

        {isLoading ? (
          <SkeletonLoader count={10} className="h-10" />
        ) : metrics.length === 0 ? (
          <MetricEmptyState onOpenModal={() => setModalOpen(true)} />
        ) : (
          <>
            <MetricTable metrics={metrics || []} />

            {/**Pagination Segment */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  page={page}
                  total={total}
                  pageSize={PAGE_SIZE}
                  onChange={setPage}
                />
              </div>
            )}
          </>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
          <MetricForm onClose={() => setModalOpen(false)} />
        </Modal>
      </div>
    </Layout>
  );
}

export default withAuth(MetricsPage);
