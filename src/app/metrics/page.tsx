// app/metrics/page.tsx

"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Services
import { handleApiError } from "@/services/api/handleApiError";
import { createMetricDummy } from "@/services/api/metric.api";
import { useMetricsLibrary } from "@/src/features/metrics/hooks";

// Components
import { withAuth } from "@/components/hoc/withAuth";
import SkeletonLoader from "@/src/components/ui/SekeletonLoader";
import MetricForm from "@/src/components/pages/metrics/MetricForm";
import Modal from "@/src/components/ui/Modal";
import Layout from "@/src/components/layout/Layout";
import MetricEmptyState from "@/src/components/pages/metrics/MetricEmptyState";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import { Pagination } from "@/src/components/ui/Pagination";
import { MetricTable } from "@/src/components/pages/metrics/MetricTable";

const PAGE_SIZE = 20;

function MetricsPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // Use the new useMetrics with pagination
  const { metrics, isLoading, isError, total } = useMetricsLibrary(
    page,
    PAGE_SIZE
  );

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
