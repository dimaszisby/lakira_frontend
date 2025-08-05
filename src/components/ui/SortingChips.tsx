// File: src/components/ui/MobileSortingChips.tsx

import React from "react";

export interface SortChipsColumns<T> {
  key: keyof T;
  label: string;
  sortable: boolean;
  renderHeader?: (
    isSorted: boolean,
    sortOrder: "ASC" | "DESC" | null
  ) => React.ReactNode;
}

interface SortingChipsProps<T> {
  columns: SortChipsColumns<T>[];
  sortBy: keyof T;
  sortOrder?: "ASC" | "DESC" | null;
  onSort: (column: keyof T) => void;
  className?: string;
}

function getSortOrderClass(sortOrder: "ASC" | "DESC" | null) {
  switch (sortOrder) {
    case "ASC":
      return "bg-blue-500 text-white";
    case "DESC":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-200 text-gray-700 hover:bg-gray-300";
  }
}

const SortingChips = <T,>({
  sortBy,
  sortOrder,
  onSort,
  className = "",
  columns,
}: SortingChipsProps<T>) => {
  return (
    <div className={`bg-red-100 flex flex-wrap items-start gap-2 ${className}`}>
      {columns.map((col) => {
        const isSorted = sortBy === col.key;

        // Render sortable button
        // Use key as string to ensure compatibility with React's key prop
        return (
          <div
            key={String(col.key)}
            aria-sort={
              col.sortable && isSorted
                ? sortOrder === "ASC"
                  ? "ascending"
                  : "descending"
                : undefined
            }
            className="px-4 py-3 font-medium"
          >
            {col.sortable && onSort ? (
              <button
                type="button"
                onClick={() => onSort(col.key)}
                className={`px-3 py-2 ${getSortOrderClass(
                  isSorted ? (sortOrder === "ASC" ? "ASC" : "DESC") : null
                )} rounded-2xl focus:outline-none hover:underline`}
              >
                {col.renderHeader ? (
                  col.renderHeader(isSorted, sortOrder || null)
                ) : (
                  <>
                    {col.label}
                    {isSorted && (
                      <span className="ml-1 text-xs">
                        {sortOrder === "ASC" ? "▲" : "▼"}
                      </span>
                    )}
                  </>
                )}
              </button>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default SortingChips;
