"use client";

import React from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/layout/Layout";
import MetricLogsSection from "@/components/pages/metrics/detail/MetricLogSection";
import MetricSettingsSection from "@/components/pages/metrics/detail/MetricSettingsSection";
import MetricHeaderSection from "@/components/pages/metrics/detail/MetricHeaderSection";
import { withAuth } from "@/components/hoc/withAuth";
import SkeletonLoader from "@/components/ui/SekeletonLoader";
import { useMetricDetails } from "@/features/metrics/hooks";
import { extractMetricCore } from "@/features/metrics/helper";

function MetricDetailPage() {
  const params = useParams();
  const metricId = params?.id as string;

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
  if (error) return <div>Error loading metric details: {error.message}</div>;
  if (!metricDetail) return <div>Empty metric details</div>;

  const metricCore = extractMetricCore(metricDetail);

  return (
    <Layout>
      <div className="flex-row max-w-6xl mx-auto m-2 space-y-4">
        {/* <Breadcrumbs
          categoryName={metric.category?.name}
          categoryId={metric.category?.id}
          metricName={metric.name}
        /> */}

        <MetricHeaderSection metric={metricCore} />

        {/* <MetricInsightSection logs={sortedLogs} /> */}

        <MetricLogsSection metricId={metricId} />

        {/* Settings Section */}
        <MetricSettingsSection settings={metricDetail?.settings} />
      </div>
    </Layout>
  );
}

export default withAuth(MetricDetailPage);
