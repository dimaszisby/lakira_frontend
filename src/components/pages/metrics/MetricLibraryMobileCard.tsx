import { useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import IconLabel from "@/components/ui/IconLabel";
import { Eye, Tag, CalendarBlank, FolderSimple } from "phosphor-react";
import { MetricPreviewResponseDTO } from "@/src/types/dtos/metric.dto";

export interface MetricLibraryCardProps {
  metric: MetricPreviewResponseDTO;
  onClick?: (metric: MetricPreviewResponseDTO) => void;
}

/**
 * A Local chip component for rendering category information or a fallback.
 */
const CategoryChip = memo(
  ({ category }: { category: MetricPreviewResponseDTO["category"] | null }) => {
    const hasCategory = Boolean(category);
    const chipClasses = classNames(
      "flex px-4 py-2  text-sm  font-medium  items-center rounded-full bg-opacity-50",
      !hasCategory && "bg-gray-200 text-gray-700"
    );
    const chipStyle = hasCategory
      ? { backgroundColor: category!.color }
      : undefined;

    return (
      <span className={chipClasses} style={chipStyle}>
        <span className="mr-2" aria-hidden="true">
          {hasCategory ? (
            category!.icon
          ) : (
            <FolderSimple size={16} weight="regular" />
          )}
        </span>
        <span className="truncate">{category?.name ?? "Uncategorized"}</span>
      </span>
    );
  }
);
CategoryChip.displayName = "CategoryChip";

/**
 * A card component for displaying a metric in the public library.
 * Implements accessible roles, keyboard focus, and performance optimizations.
 * Handles optional data like category and description gracefully.
 */
const MetricLibraryMobileCard = memo(
  ({ metric, onClick }: MetricLibraryCardProps) => {
    const router = useRouter();
    const { id, name, defaultUnit, isPublic, category, logCount } = metric;

    // * Normalization
    // Normalize description: treat empty or whitespace-only as missing
    // const displayDescription =
    //   description && description.trim() !== "" ? description : "No Description";

    // * Sizing
    // Trim to avoid overflow
    // const maxDescriptionLength = 100;
    // const truncatedDescription =
    //   displayDescription.length > maxDescriptionLength
    //     ? `${displayDescription.slice(0, maxDescriptionLength)}…`
    //     : displayDescription;

    // * Handler
    const handleCardClick = useCallback(() => {
      if (onClick) return onClick(metric); // prefer parent handler
      router.push(`/metrics/${id}`); // fallback behaviour
    }, [onClick, router, id, metric]);

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
        aria-label={`Open metric ${name}`}
      >
        {/* Metric name */}
        <span className="text-lg font-semibold truncate" title={name}>
          {name}
        </span>

        {/* Metric description */}
        {/* <span
          className="text-sm text-gray-600 truncate"
          title={displayDescription}
        >
          {truncatedDescription}
        </span> */}

        <div className="flex items-center justify-between mt-2">
          <span>
            <CategoryChip category={category} />
          </span>

          {/* Default Unit */}
          <span>
            <IconLabel
              icon={Tag}
              label={defaultUnit ?? "-"}
              tone="muted"
              size="sm"
              iconClassName="mr-1"
            />
          </span>

          {/* Visibility */}
          <span>
            <IconLabel
              icon={Eye}
              label={isPublic ? "Public" : "Private"}
              tone="muted"
              size="sm"
              iconClassName="mr-1"
            />
          </span>

          {/* Log Count */}
          <span>
            <IconLabel
              icon={CalendarBlank}
              label={logCount}
              tone="muted"
              size="sm"
              iconClassName="mr-1"
            />
          </span>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev.metric.id === next.metric.id && prev.onClick === next.onClick
);

MetricLibraryMobileCard.displayName = "MetricLibraryCard";

export default MetricLibraryMobileCard;
