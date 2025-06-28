// app/metrics/[id]/page.tsx

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

// Components
import Layout from "@/components/layout/Layout";
import MetricLogsSection from "@/components/pages/metrics/detail/MetricLogSection";
import MetricSettingsSection from "@/components/pages/metrics/detail/MetricSettingsSection";
import MetricHeaderSection from "@/components/pages/metrics/detail/MetricHeaderSection";

// Utilities
import { CreateMetricLogRequestDTO } from "@/src/types/dtos/metric-log.dto";
import MetricLogFormModal from "@/components/pages/logs/LogFormModal";
import { withAuth } from "@/components/hoc/withAuth";

 function MetricDetailPage() {
  const params = useParams();
  const metricId = params?.id as string;
  const [isLogFormOpen, setLogFormOpen] = useState(false);

  const handleAddLog = async (_form: CreateMetricLogRequestDTO) => {
    // try {
    //   // Example: call API
    //   await createMetricLogAPI(metricId, form); // implement this function
    //   toast.success("Log added!");
    //   setAddLogOpen(false);
    //   // Trigger data refetch if needed!
    //   queryClient.invalidateQueries(["metricDetail", metricId]);
    // } catch (e) {
    //   toast.error("Failed to add log");
    // }
  };

  // Sort logs newest to oldest (if present)
  // const sortedLogs = useMemo(() => {
  //   // Handles case where metric or logs are undefined/null
  //   if (!metric || !Array.isArray(metric.logs)) return [];

  //   // Ensure logs are sorted by loggedAt in descending order
  //   return [...metric.logs].sort(
  //     (a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
  //   );
  // }, [metric]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Breadcrumbs */}
        {/* <Breadcrumbs
          categoryName={metric.category?.name}
          categoryId={metric.category?.id}
          metricName={metric.name}
        /> */}

        {/* Metric Card Header */}
        <MetricHeaderSection metricId={metricId} onEditMetric={() => {}} />

        {/* Metric Insight Section */}
        {/* <MetricInsightSection logs={sortedLogs} /> */}

        {/* Logs Section */}
        <MetricLogsSection
          metricId={metricId}
          onAddLog={() => setLogFormOpen(true)}
        />
        <MetricLogFormModal
          open={isLogFormOpen}
          onClose={() => setLogFormOpen(false)}
          onSubmit={() =>
            handleAddLog({
              logValue: 0, // Placeholder value, replace with actual input
              type: "manual", // Placeholder type, replace with actual input
              loggedAt: new Date(),
            })
          }
        />

        {/* Settings Section */}
        {/* TODO: Development stuck here because no strategy yet to how to handle Metric that not have/generated MetricSettings yet */}
        <MetricSettingsSection id={metricId} metricId={metricId} />
      </div>
    </Layout>
  );
}

export default withAuth(MetricDetailPage);