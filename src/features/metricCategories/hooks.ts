import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  createMetricCategory,
  createMetricCategoryDummy,
  deleteMetricCategory,
  getMetricCategoryById,
  listMetricCategories,
  updateMetricCategory,
} from "@/src/features/metricCategories/api";
import { MetricCategoryResponseDTO } from "@/src/types/dtos/metric-category.dto";
import { CursorPage } from "@/src/types/generics/CursorPage";
import { useEffect, useMemo, useState } from "react";
import { MetricsListParams } from "../metrics/types";
import { useMetricsLibrary } from "../metrics/hooks";
import { MetricCategoryFilter, MetricCategorySort } from "./sort";

// TODO: Overhaul,use Metric's hook(s) as an example

// TODO: Overhaul, uses key and cache helper like Metrics
export const mcKeys = {
  infinite: (p: {
    limit: number;
    sort: MetricCategorySort;
    q?: string;
    filter?: MetricCategoryFilter;
  }) => ["metricCategories", { ...p }] as const,
  pages: (p: {
    limit: number;
    sort: MetricCategorySort;
    q?: string;
    filter?: MetricCategoryFilter;
    includeTotal?: boolean;
    page?: number;
  }) => ["metricCategories", "pages", { ...p }] as const,
};

// Types
type UseMetricCategoriesArgs = {
  limit?: number;
  sort?: MetricCategorySort;
  q?: string;
  filter?: MetricCategoryFilter;
};

type CursorResult = CursorPage<MetricCategoryResponseDTO>;

// * =========== Query Hooks ===========

export function useCursorPagination(params: {
  limit: number;
  sort: MetricCategorySort;
  q?: string;
  filter?: MetricCategoryFilter;
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
    queryKey: mcKeys.pages({ ...params, page, includeTotal: true }),
    queryFn: async () => {
      const after = cursorByPage[page] ?? undefined;
      const res = await listMetricCategories({
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

// Infinite Mobile
const useMetricCategories = (
  opts: UseMetricCategoriesArgs & { enabled: boolean }
) => {
  const { limit = 20, sort = "-createdAt", q, filter, enabled = true } = opts;

  const query = useInfiniteQuery<
    CursorResult, // TQueryFnData
    Error, // TError
    InfiniteData<CursorResult, string | undefined>, // TData (no select -> keep InfiniteData)
    ReturnType<typeof mcKeys.infinite>, // TQueryKey
    string | undefined // TPageParam
  >({
    queryKey: mcKeys.infinite({ limit, sort, q, filter }),
    queryFn: ({ pageParam }) =>
      listMetricCategories({
        limit,
        sort,
        q,
        filter,
        after: pageParam,
      }),
    enabled: enabled,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const items = query.data?.pages.flatMap((p) => p.items) ?? [];
  const hasNextPage = query.hasNextPage;
  const loadMore = () => query.fetchNextPage();

  return { ...query, items, hasNextPage, loadMore };
};

// MetricCategoryDetailPage
const useMetricCategoryById = (categoryId: string) => {
  return useQuery<MetricCategoryResponseDTO, Error>({
    queryKey: ["metricCategoryDetail", categoryId],
    queryFn: () => getMetricCategoryById(categoryId),
    enabled: !!categoryId,
  });
};

// Adapter for MetricLibraryList
type CategoryMetricsParams = Omit<MetricsListParams, "categoryId">;

export const useCategoryMetrics = (
  categoryId: string | undefined,
  params: CategoryMetricsParams = {},
  opts?: { enabled?: boolean; staleTime?: number }
) => {
  const merged = useMemo(
    () => ({ ...params, categoryId }),
    [params, categoryId]
  );

  return useMetricsLibrary(merged, {
    enabled: (opts?.enabled ?? true) && !!categoryId,
    staleTime: opts?.staleTime,
  });
};

// * =========== Mutation Hooks ===========

const useCreateMetricCategory = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: createMetricCategory,
    onSuccess,
    onError,
  });

  return {
    createMetricCategory: mutateAsync,
    onSuccess,
    onError,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

const useUpdateMetricCategory = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: updateMetricCategory,
    onSuccess,
    onError,
  });

  return {
    updateMetricCategory: mutateAsync,
    onSuccess,
    onError,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

const useDeleteMetricCategory = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: deleteMetricCategory,
    onSuccess,
    onError,
  });

  return {
    deleteMetricCategory: mutateAsync,
    onSuccess,
    onError,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

const useCreateMetricCategoryDummy = (
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  const { mutateAsync, isError, isSuccess, error, isPending } = useMutation({
    mutationFn: createMetricCategoryDummy,
    onSuccess,
    onError,
  });

  return {
    createCategoryDummy: mutateAsync,
    onSuccess,
    onError,
    isError,
    isSuccess,
    error,
    isPending,
  };
};

export {
  useMetricCategories,
  useMetricCategoryById,
  useCreateMetricCategory,
  useUpdateMetricCategory,
  useDeleteMetricCategory,
  useCreateMetricCategoryDummy,
};
