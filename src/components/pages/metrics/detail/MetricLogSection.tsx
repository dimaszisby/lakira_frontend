// components/pages/metrics/detail/MetricLogSection.tsx

"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// components
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import SectionCard from "@/src/components/ui/SectionCard";
import SkeletonLoader from "@/src/components/ui/SekeletonLoader";
import { Pagination } from "@/src/components/ui/Pagination";
import LogTable from "../../logs/LogTable";
import MetricLogFormModal from "../../logs/LogFormModal";

// hooks
import useMetricLogs from "@/src/hooks/useMetricLogs";
import { useCreateMetricLogDummy } from "@/src/features/metricLogs/hooks";
import { MetricLogResponseDTO } from "@/src/types/dtos/metric-log.dto";
import EmptyDataIndicator from "@/src/components/ui/EmptyDataIndicator";

const PAGE_SIZE = 20;

/**
 * Logs section with search and pagination (dummy).
 */
interface MetricLogSectionProps {
  metricId: string;
}

const MetricLogsSection: React.FC<MetricLogSectionProps> = ({ metricId }) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<MetricLogResponseDTO | null>(
    null
  );

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
  const { createMetricLogDummy } = useCreateMetricLogDummy();
  const onDummyDataSubmit = async () => {
    try {
      await createMetricLogDummy({
        count: 5,
        metricId: metricId,
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["metricLogs", metricId],
      //   exact: false,
      // });
      await queryClient.refetchQueries({
        queryKey: ["metricLogs", metricId, 1, PAGE_SIZE],
      });
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // * Handlers
  // Handlers for table row click
  const handleRowClick = (log: MetricLogResponseDTO) => {
    setSelectedLog(log);
    setModalOpen(true);
  };

  // Handler for add log button (create mode)
  const handleAddLogClick = () => {
    setSelectedLog(null); // No log = create mode
    setModalOpen(true);
  };

  if (isLoading) {
    <div>Loading Logs</div>;
  }
  if (isError) {
    <div> Error Loading Logs</div>;
  }

  return (
    <>
      {/* Log Form Modal (handles add/edit/delete) */}
      <MetricLogFormModal
        metricId={metricId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialLog={selectedLog}
      />

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

            <PrimaryButton onClick={handleAddLogClick}>Add Logs</PrimaryButton>
          </div>
        }
      >
        <>
          {/* Pagination Placeholder (unchanged) */}
          {isLoading ? (
            <SkeletonLoader count={10} className="h-10" />
          ) : logs.length === 0 ? (
            <EmptyDataIndicator
              title="No Data Available"
              description="You haven't created any data yet."
              tooltip="Create your first data"
            />
          ) : (
            <>
              <LogTable logs={logs || []} onRowClick={handleRowClick} />

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
    </>
  );
};

export default MetricLogsSection;
