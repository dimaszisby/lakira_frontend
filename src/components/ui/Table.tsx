import React from "react";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
  responsiveWidth?: { sm?: string; md?: string; lg?: string; xl?: string }; // ✅ NEW
  sortable?: boolean;
  renderHeader?: (
    sorted: boolean,
    order: "ASC" | "DESC" | null
  ) => React.ReactNode;
  renderCell?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  sortBy?: keyof T;
  sortOrder?: "ASC" | "DESC" | null;
  onSort?: (column: keyof T) => void;
  rowKey: (item: T) => string;
  renderRow?: (item: T) => React.ReactNode;
  className?: string;
  onEdit?: (item: T) => void; // Developer Note: Will be implemented later do not remove
  onDelete?: (item: T) => void; // Developer Note: Will be implemented later do not remove
}

function getAlignClass(align: "left" | "center" | "right" = "left") {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
}

const getResponsiveWidthClass = <T,>(
  width?: string,
  responsiveWidth?: TableColumn<T>["responsiveWidth"]
) => {
  const classes: string[] = [];
  if (width) classes.push(width);
  if (responsiveWidth?.sm) classes.push(`sm:${responsiveWidth.sm}`);
  if (responsiveWidth?.md) classes.push(`md:${responsiveWidth.md}`);
  if (responsiveWidth?.lg) classes.push(`lg:${responsiveWidth.lg}`);
  if (responsiveWidth?.xl) classes.push(`xl:${responsiveWidth.xl}`);
  return classes.join(" ");
};

export const Table = <T,>({
  data,
  columns,
  sortBy,
  sortOrder,
  onSort,
  rowKey,
  renderRow,
  className = "",
}: TableProps<T>) => {
  return (
    <div
      className={`hidden sm:block overflow-x-auto rounded-xl shadow-sm bg-white text-sm text-gray-700 ${className}`}
    >
      <table className="min-w-full table-fixed divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => {
              // Computed Values
              const isSorted = sortBy === col.key;
              const widthClasses = getResponsiveWidthClass<T>(
                col.width,
                col.responsiveWidth
              );

              return (
                <th
                  key={String(col.key)}
                  scope="col"
                  aria-sort={
                    col.sortable && isSorted
                      ? sortOrder === "ASC"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                  className={`${widthClasses} px-4 py-3 font-medium ${getAlignClass(
                    col.align
                  )}`}
                >
                  {col.sortable && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(col.key)}
                      className="w-full text-inherit focus:outline-none hover:underline"
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
                  ) : (
                    col.label
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="bg-gray-50 divide-y divide-gray-200 space-y-2">
          {data.length > 0 ? (
            data.map((item) =>
              renderRow ? (
                renderRow(item)
              ) : (
                <tr
                  key={rowKey(item)}
                  className="hover:bg-gray-50 transition-colors "
                >
                  {columns.map((col) => {
                    // Computed Valus
                    const widthClasses = getResponsiveWidthClass(
                      col.width,
                      col.responsiveWidth
                    );
                    return (
                      <td
                        key={String(col.key)}
                        className={`${widthClasses} px-4 py-2 ${getAlignClass(
                          col.align
                        )}`}
                      >
                        {col.renderCell
                          ? col.renderCell(item)
                          : String(item[col.key] ?? "")}
                      </td>
                    );
                  })}
                </tr>
              )
            )
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.displayName = "Table";

// Memoized version for programmatic use (not for generic JSX)
export const MemoizedTable = React.memo(Table) as typeof Table;
export default MemoizedTable;
