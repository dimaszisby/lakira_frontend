"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { handleApiError } from "@/services/api/handleApiError";
import {
  useCreateMetricDummy,
  useDeleteMetric,
  useMetricInfiniteViaCursor,
  useMetricsListPaginationViaCursor,
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
import {
  METRICS_PAGE_SIZE,
  MetricSortParamViaCursor,
  MetricSortableKeyViaCursor,
} from "@/src/features/metrics/sort";
import { useListMode } from "@/src/hooks/useListMode";
import SearchInput from "@/src/components/ui/SearchInput";

// TODO: Refactor to helpers
const parseSort = (s: MetricSortParamViaCursor) => {
  const dir = s.startsWith("-") ? "DESC" : "ASC";
  const field = s.startsWith("-") ? s.slice(1) : s;
  return { field, dir } as { field: string; dir: "ASC" | "DESC" };
};

const nextSortForColumn = (
  current: MetricSortParamViaCursor,
  column: MetricSortableKeyViaCursor
): MetricSortParamViaCursor => {
  const { field, dir } = parseSort(current);
  if (field === column) {
    return (dir === "ASC" ? `-${column}` : column) as MetricSortParamViaCursor; // toggle direction
  }
  if (column === "name") return "name"; // default direction per field: dates & numbers -> DESC, strings -> ASC
  return `-${column}` as MetricSortParamViaCursor;
};

function MetricsPage() {
  const router = useRouter();
  const { isPages } = useListMode(); // desktop or mobile switch

  // constants
  const PAGE_SIZE = METRICS_PAGE_SIZE;
  const [sort, setSort] = useState<MetricSortParamViaCursor>("-createdAt");
  const { field: sortField, dir: sortDir } = useMemo(
    () => parseSort(sort),
    [sort]
  );

  // * Search
  const [search, setSearch] = useState("");
  const debouncedQ = useDebouncedValue(search, 350);
  const [filterName] = useState<string>("");

  const params = useMemo(() => {
    const p: {
      limit: number;
      sort: MetricSortParamViaCursor;
      q?: string;
      filter?: { name: string };
    } = { limit: PAGE_SIZE, sort };

    if (debouncedQ) p.q = debouncedQ;
    if (filterName) p.filter = { name: filterName };

    return p;
  }, [PAGE_SIZE, sort, debouncedQ, filterName]);

  // Hook consumtion based on mode
  const infinite = useMetricInfiniteViaCursor({ ...params, enabled: !isPages });
  const pages = useMetricsListPaginationViaCursor({
    ...params,
    enabled: isPages,
  });

  const onColumnSort = useCallback((column: string) => {
    if (
      column === "createdAt" ||
      column === "updatedAt" ||
      column === "name" ||
      column === "logCount"
    ) {
      setSort((cur) => nextSortForColumn(cur, column));
    }
  }, []);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] =
    useState<MetricPreviewResponseDTO | null>(null);

  // Mutations
  const {
    createMetricDummy,
    isPending: isCreatingDummy,
    error: createDummyError,
  } = useCreateMetricDummy();

  const { deleteMetric, error: deleteError } = useDeleteMetric();

  // Handlers
  const handleRowClick = useCallback(
    (met: MetricPreviewResponseDTO) => router.push(`/metrics/${met.id}`),
    [router]
  );

  const handleAddMetric = () => {
    setEditingMetric(null);
    setModalOpen(true);
  };

  const handleEditMetric = useCallback((metric: MetricPreviewResponseDTO) => {
    setEditingMetric(metric);
    setModalOpen(true);
  }, []);

  const handleDelete = async (metric: MetricPreviewResponseDTO) => {
    try {
      await deleteMetric(metric.id);
    } catch (error) {
      console.error("Error deleting metric:", error);
    }
  };

  const handleleDummyDataSubmit = async () => {
    try {
      await createMetricDummy({ count: 50 });
    } catch (error) {
      const msgs = handleApiError(error as Error);
      console.error("Mutation error:", msgs);
    }
  };

  // Derived
  const errorMsg = createDummyError?.message || deleteError?.message;
  const loading = isPages
    ? pages.isFetching && pages.items.length === 0
    : infinite.isLoading;
  const empty = isPages
    ? pages.items.length === 0
    : infinite.items.length === 0;

  const header = (
    <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
      <h1 className="text-3xl font-bold sm:mb-0">📊 My Metrics</h1>

      <div className="flex w-full sm:w-auto gap-2 sm:ml-auto">
        <SearchInput
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
          isLoading={
            isPages
              ? pages.isFetching && !!pages.items.length
              : infinite.isFetching && !infinite.isFetchingNextPage
          }
          placeholder="Search by name…"
          className="flex-1"
        />

        <PrimaryButton
          onClick={handleleDummyDataSubmit}
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
        sortBy={sortField as keyof MetricPreviewResponseDTO}
        sortOrder={sortDir}
        onSort={(key) => onColumnSort(String(key))}
        columns={mobileColumns}
        className="block lg:hidden"
      />
    </div>
  );

  const mobileTableAndPagination = (
    <>
      <MetricTable
        metrics={infinite.items}
        sortBy={sortField}
        sortOrder={sortDir}
        onSort={(col) => onColumnSort(col as keyof MetricPreviewResponseDTO)}
        onEdit={handleEditMetric}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />

      {infinite.hasNextPage && (
        <div className="flex justify-center my-4">
          <PrimaryButton
            onClick={() => infinite.fetchNextPage()}
            ariaLabel="Load more"
          >
            {infinite.isFetchingNextPage ? "Loading..." : "Load more"}
          </PrimaryButton>
        </div>
      )}
      <div className="sr-only" aria-live="polite">
        {infinite.isFetchingNextPage ? "Loading more metrics" : ""}
      </div>
    </>
  );

  const desktopTableAndPagination = (
    <>
      <MetricTable
        metrics={pages.items}
        sortBy={sortField}
        sortOrder={sortDir}
        onSort={(col) => onColumnSort(String(col))}
        onEdit={handleEditMetric}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />

      <Pagination
        page={pages.page}
        pageSize={PAGE_SIZE}
        total={pages.totalCount}
        onChange={pages.setPage}
        canPrev={pages.canPrev}
        canNext={pages.canNext}
      />
    </>
  );

  return (
    <Layout>
      <div className="container mx-auto bg-white rounded-none lg:rounded-2xl max-h-fit flex flex-col overflow-clip">
        <div className="flex flex-col sm:items-center sm:justify-between p-4 lg:p-8 shadow-md rounded-tl-2xl rounded-tr-2xl">
          {header}
          {sortControls}
        </div>

        {loading ? (
          <SkeletonLoader count={10} className="h-10" />
        ) : empty ? (
          <EmptyDataIndicator
            title="No Data Available"
            description="You haven't created any data yet."
            tooltip="Create your first data"
          />
        ) : (
          <div className="flex-1 overflow-y-auto bg-gray-100 sm:bg-gray-100 lg:bg-white sm:static sm:max-h-[calc(100dvh-170px)] px-4 sm:px-4 lg:px-8 pt-4 sm:pt-4 lg:pt-0 pb-4 sm:pb-4 lg:pb-0 lg:overflow-visible lg:max-h-fit lg:mb-8 transition-all ">
            {isPages ? desktopTableAndPagination : mobileTableAndPagination}
          </div>
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
