import React from "react";
import MetricCategoryMobileTable from "./MetricCategoryMobileTable";
import MetricCategoryDesktopTable from "./MetricCategoryDesktopTable";
import { CategoryTableProps } from "./type";
import { MetricCategoryResponseDTO } from "@/src/types/dtos/metric-category.dto";

const MetricCategoryTable = React.memo(
  ({
    categories,
    sortBy,
    sortOrder,
    onSort,
    onEdit,
    onDelete,
    onRowClick,
  }: CategoryTableProps) => {
    return (
      <>
        {/* Desktop view */}
        <MetricCategoryDesktopTable
          categories={categories}
          sortBy={sortBy as keyof MetricCategoryResponseDTO}
          sortOrder={sortOrder}
          onSort={onSort}
          onEdit={onEdit}
          onDelete={onDelete}
          onRowClick={onRowClick}
          className="space-y-4"
        />

        {/* Mobile view */}
        <MetricCategoryMobileTable
          categories={categories}
          rowKey={(cat) => cat.id}
          sortBy={sortBy as keyof MetricCategoryResponseDTO}
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

MetricCategoryTable.displayName = "MetricCategoryTable";

export default MetricCategoryTable;
