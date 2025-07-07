// components/pages/metrics/detail/MetricLogSection.tsx

"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

// components
import EmptyStateCard from "@/src/components/ui/EmptyStateCard";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import SectionCard from "@/src/components/ui/SectionCard";
import SkeletonLoader from "@/src/components/ui/SekeletonLoader";
import { Pagination } from "@/src/components/ui/Pagination";
import { LogTable } from "../../logs/LogTable";

// utils
import { handleApiError } from "@/utils/handleApiError";
import { formatDate } from "@/utils/helpers/dateHelper";
import { createMetricLogDummy } from "@/utils/interactors/metric-log.api";
import useMetricLogs from "@/src/hooks/useMetricLogs";

const PAGE_SIZE = 20;

/**
 * Logs section with search and pagination (dummy).
 */
interface MetricLogSectionProps {
  metricId: string;
  onAddLog: () => void;
}

const MetricLogsSection: React.FC<MetricLogSectionProps> = ({
  metricId,
  onAddLog,
}) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // Use the new useMetricLogs with pagination
  const { logs, isLoading, isError, total } = useMetricLogs(
    metricId,
    page,
    PAGE_SIZE
  );

  // Calculate total pages
  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;

  /**
   * * Dummy Metrics
   * UseMutation for API request for Creating Dummy Metrics
   */
  const { mutateAsync, error: mutationError } = useMutation({
    mutationFn: (data: { count: number; metricId: string }) =>
      createMetricLogDummy(data),
    /**
     * onSuccess callback for the useMutation hook.
     * Invalidates the 'metrics' query and closes the modal.
     */
    onSuccess: () => {
      console.log("Mutation succeeded");
      queryClient.invalidateQueries({ queryKey: ["metriclogs"] });
      queryClient.invalidateQueries({ queryKey: ["metricDetail"] });
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
      await mutateAsync({ count: 50, metricId: metricId }); // Hardcoded count for now
      console.log("mutateAsync completed successfully");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  if (isLoading) {
    <div>Loading Logs</div>;
  }
  if (isError) {
    <div> Error Loading Logs</div>;
  }

  return (
    <SectionCard
      title="Logs"
      className="mb-8"
      headerComponent={
        <div className="flex bg-items-center justify-between space-x-4 mb-4">
          <PrimaryButton
            onClick={onDummyDataSubmit}
            ariaLabel="Generate Logs"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Generate Metric
          </PrimaryButton>

          <PrimaryButton onClick={onAddLog}>Add Logs</PrimaryButton>
        </div>
      }
    >
      <>
        {/* Pagination Placeholder (unchanged) */}
        {isLoading ? (
          <SkeletonLoader count={10} className="h-10" />
        ) : logs.length === 0 ? (
          <EmptyStateCard
            titleText="Your log is Empty"
            descriptionText="Your log is Empty"
          />
        ) : (
          <>
            <LogTable logs={logs || []} />

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
      </>
    </SectionCard>
  );
};

export default MetricLogsSection;
