import React from "react";
import { useRouter } from "next/navigation";
import { MetricLibraryDomain } from "@/src/types/domain/metric.domain";

/**
 * Props for the MetricLibraryCard component.
 */
interface MetricLibraryCardProps {
  /**
   * The metric to display.
   */
  metric: MetricLibraryDomain;
}

/**
 * A component that displays a metric in the metric library.
 */
const MetricLibraryCard: React.FC<MetricLibraryCardProps> = React.memo(
  function MetricLibraryCardComponent({ metric }) {
    const router = useRouter();

    return (
      <div
        key={metric.id}
        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
      >
        {/* TODO: Sanitize the metric name to prevent XSS vulnerabilities */}
        <h2 className="text-xl font-semibold">{metric.name}</h2>
        {/* TODO: Sanitize the metric description to prevent XSS vulnerabilities */}
        <p className="text-gray-600">
          {metric.description || "No description available."}
        </p>
        <p className="text-sm text-gray-500">
          Default Unit: {metric.defaultUnit}
        </p>

        {/* Button to view the metric details */}
        <button
          onClick={() => router.push(`/metrics/${metric.id}`)}
          className="mt-3 bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition"
          aria-label={`View Details for ${metric.name}`}
          role="button"
        >
          View Details
        </button>
      </div>
    );
  }
);

MetricLibraryCard.displayName = "MetricLibraryCard";

export default MetricLibraryCard;
