// components/MetricTable.tsx

import { ArrowDown, ArrowUp } from "phosphor-react";
import { MetricTableRow } from "./MetricTableRow";
import { MetricPreviewResponseDTO } from "@/src/types/dtos/metric.dto";

interface MetricTableProps {
  metrics: MetricPreviewResponseDTO[];
  sortBy: string;
  sortOrder: "ASC" | "DESC" | null;
  onSort: (column: string) => void;
}

const COLUMN_CONFIG = [
  { key: "category", label: "Category" },
  { key: "name", label: "Metric Name" },
  { key: "description", label: "Description" },
  { key: "defaultUnit", label: "Unit" },
  { key: "isPublic", label: "Visibility" },
  { key: "logCount", label: "Logs", align: "center" },
];

export const MetricTable: React.FC<MetricTableProps> = ({
  metrics,
  sortBy,
  sortOrder,
  onSort,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50 text-gray-700 text-left">
            {COLUMN_CONFIG.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 ${
                  col.align === "center" ? "text-center" : ""
                }`}
                scope="col"
              >
                <button
                  type="button"
                  onClick={() => onSort(col.key)}
                  className="flex items-center font-semibold hover:text-blue-600 focus:outline-none"
                  aria-sort={
                    sortBy === col.key
                      ? sortOrder === "ASC"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                >
                  {col.label}
                  {sortBy === col.key ? (
                    sortOrder === "ASC" ? (
                      <ArrowUp size={16} className="ml-1" />
                    ) : (
                      <ArrowDown size={16} className="ml-1" />
                    )
                  ) : null}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <MetricTableRow key={metric.id} metric={metric} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
