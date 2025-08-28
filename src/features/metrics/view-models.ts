type GoalType = "cumulative" | "incremental";
type ChartType = "line" | "bar" | "area" | "pie";

export type MetricDetailCompositeVM = {
  header: MetricHeaderVM;
  settings: MetricSettingsVM;
};

export type MetricHeaderVM = {
  id: string;
  name: string;
  defaultUnit: string;
  isPublic: boolean;
  description: string | null; // let this be null-safe for UI
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; color: string; icon: string } | null;
};

export type DisplayVM = {
  showOnDashboard: boolean | null;
  priority: number | null;
  chartType: ChartType | null; // precise union, not string
  color: string | null;
};

export type MetricSettingsVM = {
  id: string | null;
  isActive: boolean | null;
  goalType: GoalType | null;
  goalValue: number | null;
  startDate: string | null; // ISO date (yyyy-mm-dd) as string
  deadlineDate: string | null;
  alertEnabled: boolean | null;
  alertThresholds: number | null;
  display: DisplayVM | null; // nested VM
};

// ===== Helpers & safe defaults =====
// TODO: Refactor
export const DEFAULT_DISPLAY: DisplayVM = {
  showOnDashboard: false,
  priority: 1,
  chartType: "line",
  color: "#E897A3",
};

// TODO: Refactor
export function isChartType(x: unknown): x is ChartType {
  return x === "line" || x === "bar" || x === "area" || x === "pie";
}
