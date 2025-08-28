import type { QueryClient } from "@tanstack/react-query";
import { metricsKeys } from "./keys";
import type { IncludeKey } from "./types";
import type { MetricDetailCompositeVM, MetricHeaderVM } from "./view-models";

/** Rooted + surgical invalidations (no heavy global predicate) */
export const invalidateMetricLists = (qc: QueryClient) => {
  // Offset-based
  qc.invalidateQueries({ queryKey: metricsKeys.lists(), exact: false });
  // Cursor-based (pages + infinite share the same root)
  qc.invalidateQueries({ queryKey: metricsKeys.cursor.root(), exact: false });
};

export const invalidateMetricDetail = (qc: QueryClient, metricId: string) => {
  qc.invalidateQueries({
    queryKey: metricsKeys.detailByIdRoot(metricId),
    exact: false,
  });
};

export const removeMetricDetail = (qc: QueryClient, metricId: string) => {
  qc.removeQueries({
    queryKey: metricsKeys.detailByIdRoot(metricId),
    exact: false,
  });
};

/** Typed accessors for the common detail variant used by the composite hook */
export const detailKey = (
  metricId: string,
  includes: IncludeKey[] = ["category", "settings"],
  logsLimit?: number
) => metricsKeys.detail(metricId, includes, logsLimit);

export const getMetricDetailVM = (
  qc: QueryClient,
  metricId: string,
  includes: IncludeKey[] = ["category", "settings"],
  logsLimit?: number
) =>
  qc.getQueryData<MetricDetailCompositeVM>(
    detailKey(metricId, includes, logsLimit)
  );

export const setMetricDetailVM = (
  qc: QueryClient,
  metricId: string,
  next: MetricDetailCompositeVM,
  includes: IncludeKey[] = ["category", "settings"],
  logsLimit?: number
) =>
  qc.setQueryData<MetricDetailCompositeVM>(
    detailKey(metricId, includes, logsLimit),
    next
  );

/** Safe optimistic header patcher (keeps settings untouched) */
export const patchMetricHeaderOptimistic = (
  qc: QueryClient,
  metricId: string,
  patch: Partial<
    Pick<MetricHeaderVM, "name" | "defaultUnit" | "isPublic" | "description">
  >
) => {
  const key = detailKey(metricId, ["category", "settings"]);
  const prev = qc.getQueryData<MetricDetailCompositeVM>(key);
  if (!prev) return { key, prev };

  const nextHeader: MetricHeaderVM = { ...prev.header, ...patch };
  qc.setQueryData<MetricDetailCompositeVM>(key, {
    header: nextHeader,
    settings: prev.settings,
  });
  return { key, prev };
};
