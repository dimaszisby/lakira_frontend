// components/MetricTable.tsx

import { MetricLogResponseDTO } from "@/src/types/dtos/metric-log.dto";
import { LogTableRow } from "./LogTableRow";

interface LogTableProps {
  logs: MetricLogResponseDTO[];
}

export const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-sm bg-red-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50 text-gray-700 text-left">
            <th className="px-4 py-3">Log Date</th>
            <th className="px-4 py-3">Value</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <LogTableRow key={log.id} log={log} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
