// File: src/components/ui/SortControllerChips.tsx

import SortChip from "./SortChip";

/**
 * SortControllerChips.tsx
 * - Stateless Component
 *
 * @description
 * This component renders a set of sortable chips for controlling the sorting of a list.
 * Each chip corresponds to a column and can be clicked to change the sort order.
 * It supports both ascending and descending sort orders, and can render custom headers.
 */

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
  sortOrder: "ASC" | "DESC" | null;
  onSort: (column: keyof T) => void;
  className?: string;
}

const SortControllerChips = <T,>({
  sortBy,
  sortOrder,
  onSort,
  className = "",
  columns,
}: SortingChipsProps<T>) => {
  return (
    <div className={`flex flex-wrap items-start ${className}`}>
      {columns.map((col) => {
        const isSorted = sortBy === col.key;

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
            className="font-medium"
          >
            {col.sortable && onSort ? (
              <SortChip
                label={col.label}
                sortOrder={isSorted ? sortOrder : null}
                onClick={() => onSort(col.key)}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export { SortControllerChips };
