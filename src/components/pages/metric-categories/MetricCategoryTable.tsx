// src/components/pages/metric-categories/MetricCategoryTable.tsx

import { MetricCategoryResponseDTO } from "@/src/types/dtos/metric-category.dto";
import { Table, TableColumn } from "../../ui/Table";
import SwipeableCard from "../../ui/SwipeableCard";
import SortingChips, { SortChipsColumns } from "../../ui/SortingChips";

// Shared types for both desktop and mobile views
interface CategoryTableProps {
  categories: MetricCategoryResponseDTO[];
  sortBy: string;
  sortOrder: "ASC" | "DESC" | null;
  onSort: (column: string) => void;
  onEdit?: (category: MetricCategoryResponseDTO) => void;
  onDelete?: (category: MetricCategoryResponseDTO) => void;
  rowKey?: (item: MetricCategoryResponseDTO) => string; // Mobile, Optional for SwipeableCard
  className?: string;
}

const desktopColumns: TableColumn<MetricCategoryResponseDTO>[] = [
  {
    key: "icon",
    label: "ICON",
    align: "center",
    width: "w-[50px]",
    responsiveWidth: { md: "w-[60px]" }, // Slightly wider on medium+
    renderCell: (cat) => <span>{cat.icon}</span>,
    sortable: false,
  },
  {
    key: "color",
    label: "COLOR",
    align: "center",
    width: "w-[60px]",
    responsiveWidth: { md: "w-[80px]" },
    renderCell: (cat) => (
      <span
        className="inline-block w-5 h-5 rounded-full"
        style={{ backgroundColor: cat.color }}
        aria-label={cat.color}
      />
    ),
    sortable: false,
  },
  {
    key: "name",
    label: "NAME",
    align: "left",
    sortable: true,
    width: "w-[140px]",
    responsiveWidth: { md: "w-1/3" }, // Expands on larger screens
  },
  {
    key: "metricCount",
    label: "METRIC #",
    align: "center",
    width: "w-[70px]",
    responsiveWidth: { md: "w-[100px]" },
    sortable: true,
  },
];

const mobileColumns: SortChipsColumns<MetricCategoryResponseDTO>[] = [
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

export const MetricCategoryTable = ({
  categories,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}: CategoryTableProps) => {
  return (
    <>
      {/* Desktop view */}
      <Table
        data={categories}
        columns={desktopColumns}
        sortBy={sortBy as keyof MetricCategoryResponseDTO}
        sortOrder={sortOrder}
        onSort={(col) => onSort(String(col))}
        rowKey={(cat) => cat.id}
        onEdit={onEdit} // ✅ Forward props
        onDelete={onDelete} // ✅ Forward props
        // Optionally: custom row component for editing/deleting per row
        // renderRow={(category) => <MetricCategoryTableRow key={category.id} category={category} />}
      />

      {/* Mobile view */}
      <div className="sm:hidden">
        <MetricCategoryMobileTable
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
          rowKey={(cat) => cat.id}
          sortBy={sortBy as keyof MetricCategoryResponseDTO}
          sortOrder={sortOrder}
          onSort={onSort}
          className="block sm:hidden"
        />
      </div>
    </>
  );
};

// Custom Table for mobile view using SwipeableCard for unique specifically built for MetricCategory
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
      <SortingChips
        sortBy={sortBy as keyof MetricCategoryResponseDTO}
        sortOrder={sortOrder} // No sorting in mobile view
        onSort={onSort}
        className="mb-4"
        columns={mobileColumns}
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
              {desktopColumns.map((col) => (
                <div
                  key={String(col.key)}
                  className="flex justify-between py-1"
                >
                  <span className="text-gray-500 text-xs font-medium">
                    {col.label}
                  </span>
                  <span className="w-full text-right text-gray-900 text-sm font-semibold">
                    {col.renderCell
                      ? col.renderCell(item)
                      : String(item[col.key] ?? "")}
                  </span>
                </div>
              ))}
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

export default MetricCategoryTable;
