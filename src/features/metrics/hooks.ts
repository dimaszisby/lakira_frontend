// hooks/useMetrics.ts

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  PaginatedMetricListResponseDTO,
  UserMetricDetailResponseDTO,
} from "@/types/dtos/metric.dto";

import {
  createMetric,
  createMetricDummy,
  deleteMetric,
  getMetricLibraryList,
  getUserMetricDetails,
  updateMetric,
} from "@/src/services/api/metric.api";

// * =========== Query Hooks ===========

const useMetricsLibrary = (
  page: number,
  limit: number = 20,
  sortBy: string = "createdAt",
  sortOrder: "ASC" | "DESC" | null = "DESC"
) => {
  const { data, isLoading, isError } = useQuery<
    PaginatedMetricListResponseDTO | undefined,
    Error
  >({
    queryKey: ["metrics", page, limit, sortBy, sortOrder],
    queryFn: () => getMetricLibraryList({ page, limit, sortBy, sortOrder }),
    placeholderData: (
      previousData: PaginatedMetricListResponseDTO | undefined
    ) => previousData, // for smooth pagination UX
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

function useMetricDetails(metricId: string, includes: string[] = []) {
  // Parameter `includes` is an array of strings to include in the API request
  const includeParam =
    includes.length > 0 ? `?include=${includes.join(",")}` : "";

  return useQuery<UserMetricDetailResponseDTO, Error>({
    queryKey: ["metricDetail", metricId, ...includes],
    queryFn: () => getUserMetricDetails(metricId, includeParam),
    enabled: !!metricId,
  });
}

// * =========== Mutation Hooks ===========

const useCreateMetric = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: createMetric,
    onSuccess,
    onError,
  });

  return {
    createMetric: mutateAsync,
    onSuccess,
    onError,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

const useUpdateMetric = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: updateMetric,
    onSuccess,
    onError,
  });

  return {
    updateMetric: mutateAsync,
    onSuccess,
    onError,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

const useDeleteMetric = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: deleteMetric,
    onSuccess,
    onError,
  });

  return {
    deleteMetric: mutateAsync,
    onSuccess,
    onError,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

const useCreateMetricDummy = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: createMetricDummy,
    onSuccess,
    onError,
  });

  return {
    createMetricDummy: mutateAsync,
    onSuccess,
    onError,
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
