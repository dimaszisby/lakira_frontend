// File: src/components/pages/metric-categories/MetricCategoryMobileTable.tsx

import React from "react";
import {
  SortControllerChips,
  SortChipsColumns,
} from "@/components/ui/SortControllerChips";
import SwipeableCard from "@/components/ui/SwipeableCard";
import { CategoryTableProps } from "./type";
import MetricCategoryMobileCard from "./MetricCategoryMobileCard";
import { MetricCategoryResponseDTO } from "@/src/types/dtos/metric-category.dto";

const columns: SortChipsColumns<MetricCategoryResponseDTO>[] = [
  {
    key: "icon",
    label: "Icon",
    sortable: false,
  },
  {
    key: "color",
    label: "Color",
    sortable: false,
  },
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "metricCount",
    label: "Metrics",
    sortable: true,
  },
];

const MetricCategoryMobileTable = ({
  categories,
  rowKey = (item: MetricCategoryResponseDTO) => item.id,
  onEdit,
  onDelete,
  onSort,
  sortBy,
  sortOrder,
}: CategoryTableProps) => {
  return (
    <div>
      <SortControllerChips
        sortBy={sortBy as keyof MetricCategoryResponseDTO}
        sortOrder={sortOrder}
        onSort={onSort}
        className="mb-4"
        columns={columns}
      />

      <div className="block space-y-4">
        {categories.length > 0 ? (
          categories.map((item) => (
            <SwipeableCard
              key={rowKey(item)}
              actions={[
                {
                  label: "Edit",
                  color: "bg-blue-500",
                  onClick: () => onEdit?.(item),
                  icon: <span>✏️</span>,
                },
                {
                  label: "Delete",
                  color: "bg-red-500",
                  onClick: () => onDelete?.(item),
                  icon: <span>🗑️</span>,
                },
              ]}
            >
              <MetricCategoryMobileCard category={item} />
            </SwipeableCard>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-4">
            No data available
          </p>
        )}
      </div>
    </div>
  );
};

export default MetricCategoryMobileTable;
