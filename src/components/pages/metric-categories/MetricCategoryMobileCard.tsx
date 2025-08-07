import React from "react";
import { MetricCategoryResponseDTO } from "@/types/dtos/metric-category.dto";

interface MetricCategoryMobileCardProps {
  category: MetricCategoryResponseDTO;
}

const MetricCategoryMobileCard = React.memo(
  ({ category }: MetricCategoryMobileCardProps) => {
    return (
      <div className="flex-row space-y-2">
        <span className="text-gray-900 text-base font-semibold">
          {category.name}
        </span>

        <div className="flex items-center justify-between">
          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            {category.icon}
          </span>

          <span
            className="inline-block w-6 h-6 border-gray-200 border-2 rounded-full"
            style={{ backgroundColor: category.color }}
            aria-label={category.color}
          />

          <span className="text-gray-500 text-sm font-regular">
            {category.metricCount} metrics
          </span>
        </div>
      </div>
    );
  }
);

MetricCategoryMobileCard.displayName = "MetricCategoryMobileCard";

export default MetricCategoryMobileCard;
