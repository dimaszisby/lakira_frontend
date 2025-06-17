import EmptyStateCard from "@/components/ui/EmptyStateCard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SectionCard from "@/components/ui/SectionCard";
import { MetricLogResponseDTO } from "@/src/types/dtos/metric-log.dto";
import { formatDate } from "@/utils/helpers/dateHelper";
import classNames from "classnames";

/**
 * Logs section with search and pagination (dummy).
 */
const MetricLogsSection: React.FC<{ logs: MetricLogResponseDTO[] }> = ({
  logs,
}) => (
  <SectionCard>
    <div className="flex bg-items-center justify-between mb-4">
      <h2 className="text-xl font-bold">Logs</h2>
      {/* ...search and add log button code unchanged... */}
      <PrimaryButton>Add Logs</PrimaryButton>
    </div>
    {logs.length === 0 ? (
      <div className="bg-status-info-bg p-8 rounded-lg">
        <EmptyStateCard
          titleText="List Empty"
          descriptionText="You don’t have any item added to the library"
          tooltipText="You can add Logs by clicking ''+ Add Log'' button"
        />
      </div>
    ) : (
      <>
        <table className="min-w-full">
          <thead>
            <tr className="text-xs uppercase text-gray-500">
              <th className="text-left px-4 py-2 font-semibold">Log Date</th>
              <th className="text-left px-4 py-2 font-semibold">Type</th>
              <th className="text-right px-4 py-2 font-semibold">Value</th>
              <th className="px-2"></th>
            </tr>
          </thead>
          <tbody>
            {/* Log Row */}
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2 text-sm flex items-center">
                  <span className="text-yellow-400 mr-2">⚡</span>
                  {formatDate(log.loggedAt, true)}
                </td>
                <td className="px-4 py-2 text-sm capitalize">{log.type}</td>
                <td className="px-4 py-2 text-right text-base font-semibold text-red-500">
                  {log.logValue}
                </td>
                <td className="px-2 text-right">
                  {/* Placeholder for log actions (edit/delete) */}
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    aria-label="Log Actions"
                  >
                    ⋯
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Placeholder (unchanged) */}
        <div className="flex justify-center mt-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, "...", 10].map((num, i) => (
              <button
                key={i}
                className={classNames(
                  "px-3 py-1 rounded-lg text-sm",
                  num === 1
                    ? "bg-purple-200 text-purple-800 font-bold"
                    : "hover:bg-gray-200 text-gray-700"
                )}
                disabled={num === "..."}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </>
    )}
  </SectionCard>
);

export default MetricLogsSection;
