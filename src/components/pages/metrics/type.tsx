import { SortChipsColumns } from "@/components/ui/SortChipGroup";
import { MetricPreviewResponseDTO } from "@/src/types/dtos/metric.dto";

// Shared types for both desktop and mobile tables
// TODO: Create a generic for shared between Metric, MetricCategory, and Logs
export interface MetricTableProps {
  metrics: MetricPreviewResponseDTO[];
  sortBy: string;
  sortOrder: "ASC" | "DESC" | null;
  onSort: (column: string) => void;
  onEdit?: (metric: MetricPreviewResponseDTO) => void;
  onDelete?: (metric: MetricPreviewResponseDTO) => void;
  onRowClick?: (metric: MetricPreviewResponseDTO) => void;
  rowKey?: (item: MetricPreviewResponseDTO) => string; // Mobile, Optional for SwipeableCard
  className?: string;
}

export const mobileColumns: SortChipsColumns<MetricPreviewResponseDTO>[] = [
  {
    key: "category",
    label: "Category",
    sortable: false,
  },
  {
    key: "name",
    label: "Name",
    sortable: false,
  },
  {
    key: "description",
    label: "Description",
    sortable: true,
  },
  {
    key: "defaultUnit",
    label: "Unit",
    sortable: true,
  },
  {
    key: "isPublic",
    label: "Visibility",
    sortable: true,
  },
  {
    key: "logCount",
    label: "Logs",
    sortable: true,
  },
];
