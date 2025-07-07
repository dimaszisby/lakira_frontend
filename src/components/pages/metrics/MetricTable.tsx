// components/MetricTable.tsx

import { MetricTableRow } from "./MetricTableRow";
import { MetricPreviewResponseDTO } from "@/src/types/dtos/metric.dto";

interface MetricTableProps {
  metrics: MetricPreviewResponseDTO[];
}

export const MetricTable: React.FC<MetricTableProps> = ({ metrics }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50 text-gray-700 text-left">
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Metric Name</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Unit</th>
            <th className="px-4 py-3">Visibility</th>
            <th className="px-4 py-3 text-center">Logs</th>
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
