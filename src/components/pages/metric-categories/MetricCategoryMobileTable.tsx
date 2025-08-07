import React from "react";
import SwipeableCard from "@/components/ui/SwipeableCard";
import MetricCategoryMobileCard from "./MetricCategoryMobileCard";
import { CategoryTableProps } from "./type";
import { MetricCategoryResponseDTO } from "@/src/types/dtos/metric-category.dto";

const MetricCategoryMobileTable = React.memo(
  ({
    categories,
    rowKey = (item: MetricCategoryResponseDTO) => item.id,
    onEdit,
    onDelete,
    className = "",
  }: CategoryTableProps) => {
    return (
      <div className={`block space-y-4 ${className}`}>
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
    );
  }
);

MetricCategoryMobileTable.displayName = "MetricCategoryMobileTable";

export default MetricCategoryMobileTable;
