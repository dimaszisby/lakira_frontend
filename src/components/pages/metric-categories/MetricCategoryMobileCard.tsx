import { memo, useCallback } from "react";
import { MetricCategoryResponseDTO } from "@/src/types/dtos/metric-category.dto";
import { useRouter } from "next/navigation";

interface MetricCategoryMobileCardProps {
  category: MetricCategoryResponseDTO;
  onClick?: (metric: MetricCategoryResponseDTO) => void;
}

const MetricCategoryMobileCard = memo(
  ({ category, onClick }: MetricCategoryMobileCardProps) => {
    const router = useRouter();

    const { id, name, color, icon, metricCount } = category;

    const handleCardClick = useCallback(() => {
      if (onClick) return onClick(category); // prefer parent handler
      router.push(`/metric-categories/${id}`); // fallback behaviour
    }, [onClick, router, id, category]);

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        // className="cursor-pointer flex items-center p-4 bg-gray-500 rounded-2xl shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        className=""
        aria-label={`Open category ${name}`}
      >
        <span className="text-gray-900 text-base font-semibold">{name}</span>

        <div className="flex items-center justify-between">
          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
            {icon}
          </span>

          <span
            className="inline-block w-6 h-6 border-gray-200 border-2 rounded-full"
            style={{ backgroundColor: color }}
            aria-label={color}
          />

          <span className="text-gray-500 text-sm font-regular">
            {metricCount} metrics
          </span>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.category.id === next.category.id && prev.onClick === next.onClick
);

MetricCategoryMobileCard.displayName = "MetricCategoryMobileCard";

export default MetricCategoryMobileCard;
