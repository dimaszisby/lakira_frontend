import { memo } from "react";
import MetricDesktopTable from "./MetricDesktopTable";
import { MetricPreviewResponseDTO } from "@/src/types/dtos/metric.dto";
import MetricMobileTable from "./MetricMobileTable";
import { MetricTableProps } from "./type";

const MetricTable = memo(
  ({
    metrics,
    sortBy,
    sortOrder,
    onSort,
    onEdit,
    onDelete,
  }: MetricTableProps) => {
    return (
      <>
        {/* Desktop view */}
        <MetricDesktopTable
          metrics={metrics}
          sortBy={sortBy as keyof MetricPreviewResponseDTO}
          sortOrder={sortOrder}
          onSort={onSort}
          onEdit={onEdit}
          onDelete={onDelete}
          className="space-y-4"
        />

        {/* Mobile view */}
        <MetricMobileTable
          metrics={metrics}
          rowKey={(met) => met.id}
          sortBy={sortBy as keyof MetricPreviewResponseDTO}
          sortOrder={sortOrder}
          onSort={onSort}
          onEdit={onEdit}
          onDelete={onDelete}
          className="block sm:hidden"
        />
      </>
    );
  }
);

MetricTable.displayName = "MetricCategoryTable";

export default MetricTable;
