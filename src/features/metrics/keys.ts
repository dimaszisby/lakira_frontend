import { normalizeIncludes } from "./helper";
import { IncludeKey, MetricsListParams } from "./types";

// Cache invalidations based on => List or Details
export const metricsKeys = {
  all: ["metrics"] as const,

  // Lists
  lists: () => [...metricsKeys.all, "list"] as const,
  list: (params: MetricsListParams) =>
    [
      ...metricsKeys.lists(),
      {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        sortBy: params.sortBy ?? "createdAt",
        sortOrder: params.sortOrder ?? "DESC",
        // include filters that affect the result set:
        q: params.q ?? undefined,
        name: params.name ?? undefined,
        categoryId: params.categoryId ?? undefined,
        isPublic: params.isPublic ?? undefined,
      },
    ] as const,

  // Details
  details: () => [...metricsKeys.all, "detail"] as const,
  detail: (metricId: string, includes: IncludeKey[] = [], logsLimit?: number) =>
    [
      ...metricsKeys.details(),
      metricId,
      {
        includes: normalizeIncludes(includes), // canonical array
        logsLimit: logsLimit ?? 20,
      },
    ] as const,
};
