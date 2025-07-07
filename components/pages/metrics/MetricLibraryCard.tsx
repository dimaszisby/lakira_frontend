// import React from "react";
// import { useRouter } from "next/navigation";
// import { MetricLibraryDomain } from "@/src/types/domain/metric.domain";
// import DOMPurify from 'dompurify';

// /**
//  * Props for the MetricLibraryCard component.
//  */
// interface MetricLibraryCardProps {
//   /**
//    * The metric to display.
//    */
//   metric: MetricLibraryDomain;
// }

// /**
//  * A component that displays a metric in the metric library.
//  */
// const MetricLibraryCard: React.FC<MetricLibraryCardProps> = React.memo(
//   function MetricLibraryCardComponent({ metric }) {
//     const router = useRouter();

//     // Sanitize the metric name and description to prevent XSS vulnerabilities
//     const sanitizedName = DOMPurify.sanitize(metric.name);
//     const sanitizedDescription = DOMPurify.sanitize(metric.description || "No description available.");

//     return (
//       <div
//         key={metric.id}
//         className="flex items-center p-4 rounded-lg shadow-md hover:shadow-lg transition bg-white"
//       >
//         <div className="flex-shrink-0">
//           {metric.category?.name && (
//             <span className="bg-green-200 text-green-700 rounded-full px-3 py-1 text-sm font-medium mr-2">
//               {metric.category.name}
//             </span>
//           )}
//         </div>
//         <div className="ml-4">
//           <h2 className="text-xl font-semibold">{sanitizedName}</h2>
//           <p className="text-gray-600">{sanitizedDescription}</p>
//           <p className="text-sm text-gray-500">
//             Default Unit: {metric.defaultUnit}
//           </p>
//         </div>
//         <div className="ml-auto">
//           {/* Button to view metric details */}
//           <button
//             onClick={() => router.push(`/metrics/${metric.id}`)}
//             className="bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition"
//             aria-label={`View Details for ${metric.name}`}
//             role="button"
//           >
//             View Details
//           </button>
//         </div>
//       </div>
//     );
//   }
// );

// MetricLibraryCard.displayName = "MetricLibraryCard";

// export default MetricLibraryCard;

"use client";

import React, { FC, useCallback, memo, ReactNode } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames";
import {
  Eye,
  Tag,
  CalendarBlank,
  FolderSimple,
  IconProps,
} from "phosphor-react";
import { MetricLibraryDomain } from "@/src/types/domain/metric.domain";

export interface MetricLibraryCardProps {
  /**
   * The metric to display in the library card
   */
  metric: MetricLibraryDomain;
}

interface MetadataItemProps {
  /**
   * Icon component (from phosphor-react)
   */
  icon: FC<IconProps>;
  /**
   * Label text or node to display next to the icon
   */
  label: ReactNode;
  /**
   * Optional Tailwind class for icon color (e.g. "text-green-500")
   */
  iconColorClass?: string;
}

/**
 * A chip component for rendering category information or a fallback.
 */
const CategoryChip: FC<{ category?: MetricLibraryDomain["category"] }> = memo(
  ({ category }) => {
    const hasCategory = Boolean(category);
    const chipClasses = classNames(
      "px-4 py-2 flex items-center rounded-full text-sm font-medium bg-opacity-20",
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
 * A generic metadata item (icon + label) for use in metric cards.
 */
const MetadataItem: FC<MetadataItemProps> = memo(
  ({ icon: Icon, label, iconColorClass }) => (
    <div className="flex items-center text-sm text-gray-500">
      <Icon
        size={16}
        weight="regular"
        className={classNames("mr-1", iconColorClass)}
        aria-hidden={true}
      />
      <span>{label}</span>
    </div>
  )
);
MetadataItem.displayName = "MetadataItem";

/**
 * A card component for displaying a metric in the public library.
 * Implements accessible roles, keyboard focus, and performance optimizations.
 * Handles optional data like category and description gracefully.
 */
const MetricLibraryCard: FC<MetricLibraryCardProps> = memo(
  ({ metric }) => {
    const router = useRouter();
    const { id, name, description, defaultUnit, isPublic, category, logCount } =
      metric;

    // Normalize description: treat empty or whitespace-only as missing
    const displayDescription =
      description && description.trim() !== "" ? description : "No Description";
    // Trim to avoid overflow
    const maxDescriptionLength = 100;
    const truncatedDescription =
      displayDescription.length > maxDescriptionLength
        ? `${displayDescription.slice(0, maxDescriptionLength)}…`
        : displayDescription;

    const handleCardClick = useCallback(() => {
      router.push(`/metrics/${id}`);
    }, [router, id]);

    return (
      <tr
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
        className="bg-white p-4 rounded-2xl shadow-sm hover:bg-gray-50 transition"
        aria-label={`Open metric ${name}`}
      >
        <td>
          <CategoryChip category={category} />
        </td>

        {/* Metric name */}
        <td className="text-lg font-semibold truncate" title={name}>
          {name}
        </td>

        {/* Metric description */}
        <td
          className="text-sm text-gray-600 truncate"
          title={displayDescription}
        >
          {truncatedDescription}
        </td>

        {/* Default Unit */}
        <td>
          <MetadataItem
            icon={Tag}
            label={defaultUnit ?? "-"}
            iconColorClass="text-green-500"
          />
        </td>

        {/* Visibility */}
        <td>
          {isPublic && (
            <MetadataItem
              icon={Eye}
              label="Public"
              iconColorClass="text-green-500"
            />
          )}
        </td>

        {/* Log Count */}
        <td>
          <MetadataItem
            icon={CalendarBlank}
            label={logCount}
            iconColorClass="text-green-500"
          />
        </td>
      </tr>
    );
  },
  (prev, next) => prev.metric.id === next.metric.id
);

MetricLibraryCard.displayName = "MetricLibraryCard";
export default MetricLibraryCard;
