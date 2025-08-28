import { useQuery, useMutation } from "@tanstack/react-query";
import { PaginatedMetricLogListResponseDTO } from "@/src/types/dtos/metric-log.dto";
import {
  getMetricLogs,
  createMetricLog,
  createMetricLogDummy,
  deleteMetricLog,
  updateMetricLog,
} from "@/src/features/metricLogs/api";

// * =========== Query Hooks ===========

/**
 * Custom hook to fetch paginated metric logs for a specific metric.
 * @param {string} metricId - The ID of the metric to fetch logs for.
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of logs to fetch per page.
 * @returns {Object} - An object containing the logs, total count, loading state,
 * error state, and a refetch function.
 * @throws {Error} - If the API request fails.
 * */
const useMetricLogs = (metricId: string, page: number, limit: number = 20) => {
  const { data, isLoading, isError } = useQuery<
    PaginatedMetricLogListResponseDTO | undefined,
    Error
  >({
    // Commented due to caching issue when creating new logs
    queryKey: ["metricLogs", metricId, page, limit],
    // queryKey: ["metricLogs", metricId],
    queryFn: () => getMetricLogs({ metricId, page, limit }),
    placeholderData: (
      previousData: PaginatedMetricLogListResponseDTO | undefined
    ) => previousData, // for smooth pagination UX
  });

  const logs = data?.logs ?? [];
  const total = data?.total ?? 0;

  return {
    logs,
    total,
    isLoading,
    isError,
  };
};

// * =========== Mutation Hooks ===========

// TODO: Overhaul to new approach (use Metric's hook(s) as an example)

/**
 * Custom hook to create a new metric log entry.
 * @param {Function} onSuccess - Callback function to be called on successful creation.
 * @param {Function} onError - Callback function to be called on error.
 * @returns {Object} - An object containing the createMetricLog function and isError state.
 * @throws {Error} - If the API request fails.
 */
const useCreateMetricLog = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: createMetricLog,
    onSuccess,
    onError,
  });

  return {
    createMetricLog: mutateAsync,
    onSuccess,
    onError,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

const useDeleteMetricLog = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: deleteMetricLog,
    onSuccess,
    onError,
  });

  return {
    deleteMetricLog: mutateAsync,
    onSuccess,
    onError,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

const useUpdateMetricLog = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: updateMetricLog,
    onSuccess,
    onError,
  });

  return {
    updateMetricLog: mutateAsync,
    onSuccess,
    onError,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

/** * Custom hook to create dummy metric logs.
 * @param {Function} onSuccess - Callback function to be called on successful creation.
 * @param {Function} onError - Callback function to be called on error.
 * @returns {Object} - An object containing the createMetricLogDummy function and isError state.
 * @throws {Error} - If the API request fails.
 */
const useCreateMetricLogDummy = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: createMetricLogDummy,
    onSuccess,
    onError,
  });

  return {
    createMetricLogDummy: mutateAsync,
    onSuccess,
    onError,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

export {
  useMetricLogs,
  useCreateMetricLog,
  useUpdateMetricLog,
  useDeleteMetricLog,
  useCreateMetricLogDummy,
};
