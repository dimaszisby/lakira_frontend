// components/MetricTableRow.tsx

import { MetricPreviewResponseDTO } from "@/src/types/dtos/metric.dto";
import { Eye, Notebook, Tag } from "phosphor-react";

/**
 * Renders a row in the metric table, with navigation to the metric detail page.
 * The entire row is clickable and accessible (keyboard navigation).
 */

interface MetricTableRowProps {
  metric: MetricPreviewResponseDTO;
}

export const MetricTableRow: React.FC<MetricTableRowProps> = ({ metric }) => {
  // Build the detail URL (adjust to your routing)
  const detailUrl = `/metrics/${metric.id}`;

  return (
    <tr
      tabIndex={0}
      role="button"
      className="bg-white hover:bg-gray-50 cursor-pointer transition"
      onClick={() => (window.location.href = detailUrl)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          window.location.href = detailUrl;
        }
      }}
      aria-label={`View details for ${metric.name}`}
      // Optionally add data-testid for testing
      data-testid={`metric-row-${metric.id}`}
    >
      {/* Metric Category */}
      <td className="px-4 py-2 flex items-center">
        {metric.category ? (
          <span
            className="flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold"
            style={{
              backgroundColor: metric.category.color + "22",
              color: metric.category.color,
            }}
          >
            <span className="mr-1">{metric.category.icon}</span>
            {metric.category.name}
          </span>
        ) : (
          <span className="flex items-center px-2 py-1 rounded bg-gray-100 text-gray-500 text-xs font-semibold">
            <Tag size={12} className="mr-1" />
            Uncategorized
          </span>
        )}
      </td>

      {/* Metric name */}
      <td className="px-4 py-2 font-semibold">{metric.name}</td>

      {/* Metric Description */}
      <td className="px-4 py-2 text-gray-500 truncate max-w-xs">
        {metric.description ?? (
          <span className="italic text-gray-400">No Description</span>
        )}
      </td>

      {/* Default Unit */}
      <td className="px-4 py-2 flex items-center">
        <Notebook size={14} className="mr-1 text-gray-400" />
        {metric.defaultUnit}
      </td>

      {/* Visibility */}
      <td className="px-4 py-2">
        <span className="flex items-center">
          <Eye size={14} className="mr-1 text-gray-400" />
          {metric.isPublic ? "Public" : "Private"}
        </span>
      </td>
      <td className="px-4 py-2 text-center">{metric.logCount}</td>
    </tr>
  );
};
