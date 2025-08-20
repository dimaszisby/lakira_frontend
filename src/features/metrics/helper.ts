import { UserMetricDetailResponseDTO } from "@/src/types/dtos/metric.dto";
import { IncludeKey, MetricCore } from "./types";

export const extractMetricCore = (
  metricDetail: UserMetricDetailResponseDTO
): MetricCore => {
  // Could use lodash.pick or do it manually:
  const {
    id,
    userId,
    categoryId,
    originalMetricId,
    name,
    description,
    defaultUnit,
    isPublic,
    createdAt,
    updatedAt,
  } = metricDetail;
  return {
    id,
    userId,
    categoryId,
    originalMetricId,
    name,
    description,
    defaultUnit,
    isPublic,
    createdAt,
    updatedAt,
  };
};

/** Canonical include normalizer (sorted CSV to match server cache keys) */
export function normalizeIncludes(
  includes: IncludeKey[] = []
): string | undefined {
  const allowed: IncludeKey[] = ["settings", "category", "logs"];
  const normalized = includes
    .filter((s): s is IncludeKey => allowed.includes(s))
    .sort();
  if (normalized.length === 0) return undefined; // "flat" on server
  return normalized.join(","); // e.g., "category,logs,settings"
}
