import { useCallback, useMemo, useState } from "react";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import SectionCard from "@/src/components/ui/SectionCard";
import SkeletonLoader from "@/src/components/ui/SekeletonLoader";
import { Pagination } from "@/src/components/ui/Pagination";
import EmptyDataIndicator from "@/src/components/ui/EmptyDataIndicator";
import { MetricPreviewResponseDTO } from "@/src/features/metrics/metric.dto";
import MetricForm from "../../metrics/MetricForm";
import MetricTable from "../../metrics/MetricTable";
import { useRouter } from "next/navigation";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import {
  useDeleteMetric,
  useMetricsListPaginationViaCursor,
} from "@/src/features/metrics/hooks";
import {
  METRICS_PAGE_SIZE,
  MetricSortParamViaCursor,
  nextSortForColumn,
  parseSort,
} from "@/src/features/metrics/sort";
import SearchInput from "@/src/components/ui/SearchInput";

// TODO: Migrate to Cursor based

interface MetricCategorySectionProps {
  categoryId: string;
}

const MetricListSection: React.FC<MetricCategorySectionProps> = ({
  categoryId,
}) => {
  const router = useRouter();

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
  const [filterCategory] = useState<string>(categoryId);

  const params = useMemo(() => {
    const p: {
      limit: number;
      sort: MetricSortParamViaCursor;
      q?: string;
      filter?: { name?: string; categoryId?: string };
    } = { limit: PAGE_SIZE, sort };

    if (debouncedQ) p.q = debouncedQ;

    const f: { name?: string; categoryId?: string } = {};
    if (filterName) f.name = filterName;
    if (filterCategory) f.categoryId = filterCategory;
    if (Object.keys(f).length) p.filter = f;

    console.log(`----- [View]: Filter`, p.filter);
    console.log(`----- [View]: Limit`, p.limit);

    return p;
  }, [PAGE_SIZE, sort, debouncedQ, filterName, filterCategory]);

  // Hook consumtion based on mode
  const pages = useMetricsListPaginationViaCursor({
    ...params,
    enabled: true,
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

  const {
    deleteMetric,
    isPending: isDeleting,
    error: deleteError,
  } = useDeleteMetric();

  // * Handlers
  // Handlers for table row click
  const handleRowClick = useCallback(
    (met: MetricPreviewResponseDTO) => router.push(`/metrics/${met.id}`),
    [router]
  );

  // Handler for add log button (create mode)
  const handleAddMetricClick = () => {
    setEditingMetric(null); // No log = create mode
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

  // Derived
  // const errorMsg = deleteError?.message;
  const loading = pages.isFetching && pages.items.length === 0;
  const empty = pages.items.length === 0;

  return (
    <>
      {/* Log Form Modal (handles add/edit/delete) */}
      <MetricForm
        key={modalOpen ? editingMetric?.id ?? "create" : "closed"}
        metricId={null}
        initialMetric={null}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMetric(null);
        }}
      />

      <SectionCard
        title="Metrics"
        className="mb-8"
        headerComponent={
          <div className="flex bg-items-center justify-between space-x-4 mb-4">
            <SearchInput
              value={search}
              onChange={setSearch}
              onClear={() => setSearch("")}
              isLoading={pages.isFetching && !!pages.items.length}
              placeholder="Search by name…"
              className="flex-1"
            />

            <PrimaryButton onClick={handleAddMetricClick}>
              Add Metrics
            </PrimaryButton>
          </div>
        }
      >
        <>
          {/* Pagination Placeholder (unchanged) */}
          {loading ? (
            <SkeletonLoader count={10} className="h-10" />
          ) : empty ? (
            <EmptyDataIndicator
              title="No Data Available"
              description="You haven't created any data yet."
              tooltip="Create your first data"
            />
          ) : (
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

              {/**Pagination Segment */}
              <Pagination
                page={pages.page}
                pageSize={PAGE_SIZE}
                total={pages.totalCount}
                onChange={pages.setPage}
                canPrev={pages.canPrev}
                canNext={pages.canNext}
              />
            </>
          )}
        </>
      </SectionCard>
    </>
  );
};

export default MetricListSection;
