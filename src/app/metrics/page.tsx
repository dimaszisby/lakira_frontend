// app/metrics/page.tsx

"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Services
import { handleApiError } from "@/services/api/handleApiError";
import {
  useCreateMetricDummy,
  useMetricsLibrary,
} from "@/src/features/metrics/hooks";

// Components
import { withAuth } from "@/components/hoc/withAuth";
import SkeletonLoader from "@/src/components/ui/SekeletonLoader";
import MetricForm from "@/src/components/pages/metrics/MetricForm";
import Layout from "@/src/components/layout/Layout";
import MetricEmptyState from "@/src/components/pages/metrics/MetricEmptyState";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import { Pagination } from "@/src/components/ui/Pagination";
import { MetricTable } from "@/src/components/pages/metrics/MetricTable";

function MetricsPage() {
  const queryClient = useQueryClient();

  // * Const
  const PAGE_SIZE = 20;
  const DEFAULT_SORT_BY = "createdAt";
  const DEFAULT_SORT_ORDER = "DESC";

  // * State
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>(DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC" | null>(
    DEFAULT_SORT_ORDER
  );

  // * Mutation Hooks
  // UseMutation for API request for MetricsLibrary with pagination
  const { metrics, isLoading, isError, total } = useMetricsLibrary(
    page,
    PAGE_SIZE,
    sortBy,
    sortOrder
  );

  // UseMutation for API request for Creating Dummy Metrics
  const {
    createMetricDummy,
    isPending: isCreatingDummy,
    error: createDummyError,
  } = useCreateMetricDummy(async () => {
    queryClient.invalidateQueries({ queryKey: ["metrics"] });
  });

  // * Handlers
  const onDummyDataSubmit = async () => {
    try {
      console.log("Submitting request for metric dummy with count 50");
      await createMetricDummy({ count: 50 }); // Hardcoded count for now
    } catch (error) {
      const errorMessages = handleApiError(error as Error);
      console.error("Mutation error:", errorMessages);
    }
  };

  const handleAddMetric = () => {
    setModalOpen(true);
  };

  const handleSort = (column: string) => {
    if (sortBy !== column) {
      // New column: always start with ascending
      setSortBy(column);
      setSortOrder("ASC");
    } else {
      // Same column: cycle ASC → DESC → NONE
      if (sortOrder === "ASC") {
        setSortOrder("DESC");
      } else if (sortOrder === "DESC") {
        // Cycle back to default/none (restore backend default)
        setSortBy(DEFAULT_SORT_BY);
        setSortOrder(DEFAULT_SORT_ORDER);
      }
    }
    setPage(1); // reset page when sort changes
  };

  // * Derived State / Computed Values
  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;
  const errorMsg = createDummyError?.message || "";

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

        <div className="inline-block h-2 mb-4">
          {errorMsg && <p className="text-red-500 text-xs mb-2">{errorMsg}</p>}
        </div>

        <div className="flex justify-end mb-4">
          <PrimaryButton
            onClick={onDummyDataSubmit}
            ariaLabel="Generate Metric"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isCreatingDummy ? "Saving..." : "Add"}
          </PrimaryButton>

          <PrimaryButton
            onClick={handleAddMetric}
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
            <MetricTable
              metrics={metrics || []}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />

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

        <MetricForm
          metricId={null}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          initialMetric={null}
        />
      </div>
    </Layout>
  );
}

export default withAuth(MetricsPage);
