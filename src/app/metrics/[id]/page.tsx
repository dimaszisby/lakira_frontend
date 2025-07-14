// app/metrics/[id]/page.tsx

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";

// Components
import Layout from "@/components/layout/Layout";
import MetricLogsSection from "@/components/pages/metrics/detail/MetricLogSection";
import MetricSettingsSection from "@/components/pages/metrics/detail/MetricSettingsSection";
import MetricHeaderSection from "@/components/pages/metrics/detail/MetricHeaderSection";
import MetricLogFormModal from "@/components/pages/logs/LogFormModal";
import { withAuth } from "@/components/hoc/withAuth";
import SkeletonLoader from "@/components/ui/SekeletonLoader";

// Hooks
import { useMetricDetails } from "@/features/metrics/hooks";

// Utilities
import { extractMetricCore } from "@/features/metrics/helper";

function MetricDetailPage() {
  const params = useParams();
  const metricId = params?.id as string;
  const [isLogFormOpen, setLogFormOpen] = useState(false);

  const {
    data: metricDetail,
    isLoading,
    error,
  } = useMetricDetails(metricId, [
    "settings",
    "category",
    // Dev Note: Logs is fetched in MetricLogsSection to maintain decoupling
  ]);

  if (isLoading) return <SkeletonLoader />;
  if (error) return <div>Error loading metric details: {error.message}</div>; // Handle error gracefully
  if (!metricDetail) return <div>Empty metric details</div>; // Or handle gracefully

  const metricCore = extractMetricCore(metricDetail);

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
        <MetricHeaderSection metric={metricCore} onEditMetric={() => {}} />

        {/* Metric Insight Section */}
        {/* <MetricInsightSection logs={sortedLogs} /> */}

        {/* Logs Section */}
        <MetricLogsSection
          metricId={metricId}
          onAddLog={() => setLogFormOpen(true)}
        />
        <MetricLogFormModal
          metricId={metricId}
          open={isLogFormOpen}
          onClose={() => setLogFormOpen(false)}
        />

        {/* Settings Section */}
        {/* TODO: Development stuck here because no strategy yet to how to handle Metric that not have/generated MetricSettings yet */}
        <MetricSettingsSection settings={metricDetail?.settings} />
      </div>
    </Layout>
  );
}

export default withAuth(MetricDetailPage);
