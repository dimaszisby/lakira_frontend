"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { handleApiError } from "@/services/api/handleApiError";
import {
  useCreateMetricDummy,
  useDeleteMetric,
  useMetricsLibrary,
} from "@/src/features/metrics/hooks";

import { withAuth } from "@/components/hoc/withAuth";
import SkeletonLoader from "@/src/components/ui/SekeletonLoader";
import MetricForm from "@/src/components/pages/metrics/MetricForm";
import Layout from "@/src/components/layout/Layout";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import { Pagination } from "@/src/components/ui/Pagination";
import MetricTable from "@/src/components/pages/metrics/MetricTable";
import { MetricPreviewResponseDTO } from "@/src/types/dtos/metric.dto";
import EmptyDataIndicator from "@/src/components/ui/EmptyDataIndicator";
import SortChipGroup from "@/src/components/ui/SortChipGroup";
import { mobileColumns } from "@/src/components/pages/metrics/type";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";

// NEW: central sort contract (server-allowed keys + guard)
import {
  DEFAULT_METRIC_SORT,
  METRICS_PAGE_SIZE,
  ServerSortBy,
  SortState,
  isServerSortableKey,
  nextSort,
  sortFromSearchParams,
} from "@/src/features/metrics/sort";

function MetricsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const PAGE_SIZE = 20;
  // const DEFAULT_SORT_BY: ServerSortBy = "createdAt";
  // const DEFAULT_SORT_ORDER: "ASC" | "DESC" = "DESC";
  const PAGE_SIZE = METRICS_PAGE_SIZE;

  // URL → State
  const initialPage = Number(searchParams?.get("page") ?? 1) || 1;
  const initialQ = searchParams?.get("q") ?? "";
  const currentQs = searchParams?.toString() ?? "";
  // const initialSortBy = (searchParams?.get("sortBy") as ServerSortBy) ?? DEFAULT_SORT_BY;
  // const initialSortOrder =
  //   (searchParams?.get("sortOrder") as "ASC" | "DESC") ?? DEFAULT_SORT_ORDER;
  const initialSort = sortFromSearchParams(
    searchParams ?? new URLSearchParams()
  );

  // State
  const [page, setPage] = useState<number>(initialPage);
  const [q, setQ] = useState<string>(initialQ);
  // const [sortBy, setSortBy] = useState<ServerSortBy>(initialSortBy);
  // const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">(initialSortOrder);
  const [sort, setSort] = useState<SortState<ServerSortBy>>(initialSort);

  const debouncedQ = useDebouncedValue(q, 350);

  // useEffect(() => {
  //   setPage(1);
  // }, [debouncedQ, sortBy, sortOrder]);
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, sort.sortBy, sort.sortOrder]);

  // Sync → URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (page && page !== 1) params.set("page", String(page));
    if (debouncedQ) params.set("q", debouncedQ);
    // if (sortBy !== DEFAULT_SORT_BY) params.set("sortBy", sortBy);
    // if (sortOrder !== DEFAULT_SORT_ORDER) params.set("sortOrder", sortOrder);
    if (sort.sortBy !== DEFAULT_METRIC_SORT.sortBy)
      params.set("sortBy", sort.sortBy);
    if (sort.sortOrder !== DEFAULT_METRIC_SORT.sortOrder)
      params.set("sortOrder", sort.sortOrder);

    const nextQs = params.toString();

    // ✅ Guard to prevent infinite replace→rerender loops
    if (nextQs !== currentQs) {
      router.replace(`/metrics${nextQs ? `?${nextQs}` : ""}`, {
        scroll: false,
      });
    }
  }, [page, debouncedQ, sort.sortBy, sort.sortOrder, currentQs, router]);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
      q: debouncedQ || undefined,
    }),
    [page, PAGE_SIZE, sort, debouncedQ]
  );

  // Queries
  const { metrics, total, isLoading, isError } = useMetricsLibrary(listParams, {
    enabled: true,
    staleTime: 15_000,
  });

  // Mutations
  const {
    createMetricDummy,
    isPending: isCreatingDummy,
    error: createDummyError,
  } = useCreateMetricDummy();

  const {
    deleteMetric,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteMetric();

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] =
    useState<MetricPreviewResponseDTO | null>(null);

  const handleAddMetric = () => {
    setEditingMetric(null);
    setModalOpen(true);
  };

  const handleEditMetric = useCallback((metric: MetricPreviewResponseDTO) => {
    setEditingMetric(metric);
    setModalOpen(true);
  }, []);

  // ✅ Guarded sort handler: accepts UI keys, applies only server-allowed ones
  const handleSort = (column: keyof MetricPreviewResponseDTO) => {
    if (!isServerSortableKey(column)) return; // ignore non-server-sortable keys
    setSort((curr) => nextSort(curr, column, DEFAULT_METRIC_SORT));
  };

  const handleRowClick = useCallback(
    (met: MetricPreviewResponseDTO) => router.push(`/metrics/${met.id}`),
    [router]
  );

  const handleDelete = async (metric: MetricPreviewResponseDTO) => {
    try {
      await deleteMetric(metric.id);
    } catch (error) {
      console.error("Error deleting metric:", error);
    }
  };

  const onDummyDataSubmit = async () => {
    try {
      await createMetricDummy({ count: 50 });
    } catch (error) {
      const msgs = handleApiError(error as Error);
      console.error("Mutation error:", msgs);
    }
  };

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;
  const errorMsg =
    createDummyError?.message ||
    deleteError?.message ||
    (isError ? "Error loading metrics." : "");

  const header = (
    <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
      <h1 className="text-3xl font-bold sm:mb-0">📊 My Metrics</h1>

      <div className="flex w-full sm:w-auto gap-2 sm:ml-auto">
        <input
          type="search"
          inputMode="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search metrics…"
          aria-label="Search metrics"
          className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <PrimaryButton
          onClick={onDummyDataSubmit}
          ariaLabel="Generate Metric"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isCreatingDummy ? "Saving..." : "Add Dummy"}
        </PrimaryButton>

        <PrimaryButton onClick={handleAddMetric} ariaLabel="Create Metric">
          + Create Metric
        </PrimaryButton>
      </div>

      {errorMsg && (
        <p className="text-red-500 text-xs sm:text-sm">{errorMsg}</p>
      )}
    </div>
  );

  const sortControls = (
    <div className="w-full mt-4">
      <SortChipGroup
        // show chips only for keys you actually allow (see step 3 below)
        sortBy={sort.sortBy as keyof MetricPreviewResponseDTO}
        sortOrder={sort.sortOrder}
        onSort={handleSort}
        columns={mobileColumns}
        className="block lg:hidden"
      />
    </div>
  );

  const body = (
    <div className="flex-1 overflow-y-auto sm:static sm:max-h-[calc(100dvh-170px)] px-4 lg:px-8 pt-4 pb-4 lg:overflow-visible lg:max-h-fit">
      <MetricTable
        metrics={metrics || []}
        sortBy={sort.sortBy}
        sortOrder={sort.sortOrder}
        onSort={(col) => handleSort(col as keyof MetricPreviewResponseDTO)}
        onEdit={handleEditMetric}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />

      {totalPages > 1 && (
        <div className="flex justify-center my-4">
          <Pagination
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto bg-white rounded-none lg:rounded-2xl max-h-fit flex flex-col overflow-clip">
        <div className="flex flex-col sm:items-center sm:justify-between p-4 lg:p-8 shadow-md rounded-tl-2xl rounded-tr-2xl">
          {header}
          {sortControls}
        </div>

        {isLoading ? (
          <SkeletonLoader count={10} className="h-10" />
        ) : (metrics?.length ?? 0) === 0 ? (
          <EmptyDataIndicator
            title="No Data Available"
            description="You haven't created any data yet."
            tooltip="Create your first data"
          />
        ) : (
          body
        )}

        <MetricForm
          key={modalOpen ? editingMetric?.id ?? "create" : "closed"}
          metricId={null}
          initialMetric={null}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </Layout>
  );
}

export default withAuth(MetricsPage);
