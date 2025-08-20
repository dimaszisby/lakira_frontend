import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  MetricPreviewResponseDTO,
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
  getMetricLibraryViaCursor,
  getUserMetricDetails,
  updateMetric,
} from "@/src/features/metrics/metric.api";
import { metricsKeys } from "./keys";
import { IncludeKey, ListOptions, MetricsListParams } from "./types";
import { useEffect, useState } from "react";
import { CursorPage } from "@/src/types/generics/CursorPage";
import { MetricFilterViaCursor, MetricSortViaCursor } from "./sort";

// TODO: FIX caching for Create, Update, Delete

// Cache Key builder
export const mKeys = {
  infinite: (p: {
    limit: number;
    sort: MetricSortViaCursor;
    q?: string;
    filter?: MetricFilterViaCursor;
  }) => ["metricCategories", { ...p }] as const,
  pages: (p: {
    limit: number;
    sort: MetricSortViaCursor;
    q?: string;
    filter?: MetricFilterViaCursor;
    includeTotal?: boolean;
    page?: number;
  }) => ["metricCategories", "pages", { ...p }] as const,
};

// Types
type UseMetricArgs = {
  limit?: number;
  sort?: MetricSortViaCursor;
  q?: string;
  filter?: MetricFilterViaCursor;
};

type CursorResult = CursorPage<MetricPreviewResponseDTO>;

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

export function useMetricsListPaginationViaCursor(params: {
  limit: number;
  sort: MetricSortViaCursor;
  q?: string;
  filter?: MetricFilterViaCursor;
  enabled: boolean;
}) {
  type Map = Record<number, string | null>;
  const [page, setPage] = useState(1);
  const [cursorByPage, setCursorByPage] = useState<Map>({ 1: null });
  const { enabled = true } = params;

  // reset cursors when query changes
  useEffect(() => {
    setPage(1);
    setCursorByPage({ 1: null });
  }, [params.limit, params.sort, params.q, params.filter?.name]);

  const query = useQuery({
    queryKey: mKeys.pages({ ...params, page, includeTotal: true }),
    queryFn: async () => {
      const after = cursorByPage[page] ?? undefined;
      const res = await getMetricLibraryViaCursor({
        ...params,
        after,
        includeTotal: true,
      });
      if (res.nextCursor && cursorByPage[page + 1] !== res.nextCursor) {
        setCursorByPage((m) => ({ ...m, [page + 1]: res.nextCursor! }));
      }
      return res;
    },
    enabled: enabled,
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });

  const items = query.data?.items ?? [];
  const totalCount = query.data?.totalCount;
  const totalPages = totalCount
    ? Math.max(1, Math.ceil(totalCount / params.limit))
    : undefined;

  // navigation helpers (works even if total unknown)
  const canPrev = page > 1;
  const canNext = Boolean(cursorByPage[page + 1] ?? query.data?.nextCursor);

  return {
    items,
    page,
    setPage,
    isFetching: query.isFetching,
    totalCount,
    totalPages,
    canPrev,
    canNext,
  };
}

export function useMetricInfiniteViaCursor(
  opts: UseMetricArgs & { enabled: boolean }
) {
  const { limit = 20, sort = "-createdAt", q, filter, enabled = true } = opts;

  const query = useInfiniteQuery<
    CursorResult, // TQueryFnData
    Error, // TError
    InfiniteData<CursorResult, string | undefined>, // TData (no select -> keep InfiniteData)
    ReturnType<typeof mKeys.infinite>, // TQueryKey
    string | undefined // TPageParam
  >({
    queryKey: mKeys.infinite({ limit, sort, q, filter }),
    queryFn: ({ pageParam }) =>
      getMetricLibraryViaCursor({
        limit,
        sort,
        q,
        filter,
        after: pageParam, // pageParam is TParam here
      }),
    enabled: enabled,
    initialPageParam: undefined, // ✅ REQUIRED in v5
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const items = query.data?.pages.flatMap((p) => p.items) ?? [];
  const hasNextPage = query.hasNextPage;
  const loadMore = () => query.fetchNextPage();

  return { ...query, items, hasNextPage, loadMore };
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
