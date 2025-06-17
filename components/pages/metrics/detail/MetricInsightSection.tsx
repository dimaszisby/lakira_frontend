import { MetricLogResponseDTO } from "@/src/types/dtos/metric-log.dto";
import classNames from "classnames";

/**
 * Metric insight (chart/aggregate stats) section.
 */
const MetricInsightSection: React.FC<{ logs: MetricLogResponseDTO[] }> = ({
  logs,
}) => (
  <section className="w-full bg-white rounded-2xl shadow p-6 mb-8">
    <div className="flex justify-between items-start mb-4">
      <h2 className="text-xl font-bold">Metric Insight</h2>
      {/* Aggregate stats placeholders */}
      <div className="flex gap-8 text-xs">
        <StatInsight label="Overall" value="9%" positive />
        <StatInsight label="Average" value="4%" />
        <StatInsight label="Delta" value="4%" negative />
      </div>
    </div>
    {/* Chart placeholder */}
    <div className="bg-[#EDE8E4] h-[240px] rounded-lg flex items-center justify-center text-gray-400">
      {/* Replace with Chart.js, recharts, etc */}
      <span>Data visualization coming soon…</span>
    </div>
  </section>
);

/** Stat widget for aggregate stats above the chart */
const StatInsight: React.FC<{
  label: string;
  value: string;
  positive?: boolean;
  negative?: boolean;
}> = ({ label, value, positive, negative }) => (
  <div className="flex flex-col items-center min-w-[60px]">
    <span className="uppercase tracking-wide font-bold text-gray-500">
      {label}
    </span>
    <span
      className={classNames(
        "font-bold text-lg",
        positive && "text-green-600",
        negative && "text-red-500"
      )}
    >
      {value}
    </span>
  </div>
);

export default MetricInsightSection;
