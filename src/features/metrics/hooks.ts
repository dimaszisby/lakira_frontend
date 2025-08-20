import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MetricResponseDTO,
  PaginatedMetricListResponseDTO,
  UpdateMetricRequestDTO,
  UserMetricDetailResponseDTO,
} from "@/types/dtos/metric.dto";
import {
  createMetric,
  createMetricDummy,
  deleteMetric,
  getMetricLibraryList,
  getUserMetricDetails,
  updateMetric,
} from "@/src/features/metrics/metric.api";
import { metricsKeys } from "./keys";
import { IncludeKey, ListOptions, MetricsListParams } from "./types";

// * =========== Query Hooks ===========

const useMetricsLibrary = (
  params: MetricsListParams,
  opts: ListOptions = {}
) => {
  const { data, isLoading, isError } = useQuery<
    PaginatedMetricListResponseDTO | undefined,
    Error
  >({
    queryKey: metricsKeys.list(params),
    queryFn: () => getMetricLibraryList(params),
    placeholderData: (
      previousData: PaginatedMetricListResponseDTO | undefined
    ) => previousData, // for smooth pagination UX
    enabled: opts.enabled ?? true,
    staleTime: opts.staleTime ?? 15_000,
  });

  const metrics = data?.metrics ?? [];
  const total = data?.total ?? 0;

  return {
    metrics,
    total,
    isLoading,
    isError,
  };
};

function useMetricDetails(
  metricId: string,
  includes: IncludeKey[] = [],
  logsLimit?: number
) {
  return useQuery<UserMetricDetailResponseDTO, Error>({
    queryKey: metricsKeys.detail(metricId, includes, logsLimit),
    queryFn: () => getUserMetricDetails(metricId, { includes, logsLimit }),
    enabled: !!metricId,
  });
}

// * =========== Mutation Hooks ===========

const useCreateMetric = (
  onSuccess?: (created: MetricResponseDTO) => void,
  onError?: (error: Error) => void
) => {
  const qc = useQueryClient();
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: createMetric,
    onSuccess: (created) => {
      //  Invalidate lists (name/category/logCount may affect sort/filter)
      qc.invalidateQueries({ queryKey: metricsKeys.lists(), exact: false });

      // Optional: optimistic stitch into the *current* first page if you want:
      // qc.setQueryData(metricsKeys.list({ page: 1, limit: 20, sortBy: "createdAt", sortOrder: "DESC" }), (old: any) => ...);

      onSuccess?.(created);
    },
    onError,
  });

  return { createMetric: mutateAsync, isError, isSuccess, error, isPending };
};

type UpdateMetricVars = {
  metricId: string;
  metric: UpdateMetricRequestDTO;
};

const useUpdateMetric = (
  onSuccess?: (updated: MetricResponseDTO) => void,
  onError?: (error: Error) => void
) => {
  const qc = useQueryClient();
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation<
    MetricResponseDTO,
    Error,
    UpdateMetricVars
  >({
    mutationFn: updateMetric, // variables: { metricId, metric }
    onSuccess: (updated, vars: { metricId: string }) => {
      // Invalidate for this id
      qc.invalidateQueries({
        queryKey: metricsKeys.detail(vars.metricId),
        exact: false,
      });

      //  Invalidate lists (name/category/logCount may affect sort/filter)
      qc.invalidateQueries({ queryKey: metricsKeys.lists(), exact: false });

      // Optional: patch currently cached detail to avoid a flicker:
      // qc.setQueryData(metricsKeys.detail(vars.metricId), (old: any) => merge(old, updated));

      onSuccess?.(updated);
    },
    onError,
  });

  return { updateMetric: mutateAsync, isError, isSuccess, error, isPending };
};

const useDeleteMetric = (
  onSuccess?: (deletedId: string) => void,
  onError?: (error: Error) => void
) => {
  const qc = useQueryClient();
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: deleteMetric, // variables: metricId
    onSuccess: (_res, metricId: string) => {
      // Invalidate for this id
      qc.removeQueries({
        queryKey: metricsKeys.detail(metricId),
        exact: false,
      });

      // Invalidate all lists (name/category/logCount may affect sort/filter)
      qc.invalidateQueries({ queryKey: metricsKeys.lists(), exact: false });

      onSuccess?.(metricId);
    },
    onError,
  });

  return { deleteMetric: mutateAsync, isError, isSuccess, error, isPending };
};

const useCreateMetricDummy = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const qc = useQueryClient();
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: createMetricDummy,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: metricsKeys.lists(), exact: false });
      onSuccess?.();
    },
    onError,
  });

  return {
    createMetricDummy: mutateAsync,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

export {
  useMetricsLibrary,
  useMetricDetails,
  useCreateMetric,
  useUpdateMetric,
  useDeleteMetric,
  useCreateMetricDummy,
};
