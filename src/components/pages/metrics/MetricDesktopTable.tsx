import { memo } from "react";
import { Table, TableColumn } from "@/components/ui/Table";
import { MetricPreviewResponseDTO } from "@/src/types/dtos/metric.dto";
import { MetricTableProps } from "./type";

const columns: TableColumn<MetricPreviewResponseDTO>[] = [
  {
    key: "category",
    label: "CATEGORY",
    align: "center",
    width: "w-[50px]",
    responsiveWidth: { md: "w-[60px]" }, // Slightly wider on medium+
    sortable: true,
    renderCell: (met) => {
      return (
        <div
          className={`flex px-2 py-1 rounded-lg gap-2 ${
            met.category ? "text-black" : "text-white"
          }`}
          style={{
            backgroundColor: met.category ? met.category.color : "#808080",
          }}
          aria-label="Category Chip"
        >
          <span>{met.category ? met.category.icon : "🗂️"}</span>
          <span> {met.category ? met.category.name : "uncategorized"}</span>
        </div>
      );
    },
  },
  {
    key: "name",
    label: "NAME",
    align: "center",
    width: "w-[60px]",
    responsiveWidth: { md: "w-[80px]" },
    sortable: true,
  },
  {
    key: "description",
    label: "DESCRIPTION",
    align: "left",
    sortable: true,
    width: "w-[140px]",
    responsiveWidth: { md: "w-1/3" },
  },
  {
    key: "defaultUnit",
    label: "UNIT",
    align: "center",
    width: "w-[70px]",
    responsiveWidth: { md: "w-[100px]" },
    sortable: true,
  },
  {
    key: "isPublic",
    label: "VISIBILITY",
    align: "center",
    width: "w-[70px]",
    responsiveWidth: { md: "w-[100px]" },
    sortable: true,
  },
  {
    key: "logCount",
    label: "Logs",
    align: "center",
    width: "w-[70px]",
    responsiveWidth: { md: "w-[100px]" },
    sortable: true,
  },
];

const MetricDesktopTable = memo(
  ({
    metrics,
    sortBy,
    sortOrder,
    onSort,
    onEdit,
    onDelete,
    onRowClick,
  }: MetricTableProps) => {
    return (
      <Table
        data={metrics}
        columns={columns}
        sortBy={sortBy as keyof MetricPreviewResponseDTO}
        sortOrder={sortOrder}
        onSort={(col) => onSort(String(col))}
        rowKey={(cat) => cat.id}
        onEdit={onEdit}
        onDelete={onDelete}
        onRowClick={onRowClick}
        // Optionally: custom row component for editing/deleting per row
        // renderRow={(category) => <MetricCategoryTableRow key={category.id} category={category} />}
      />
    );
  }
);

MetricDesktopTable.displayName = "MetricDesktopTable";

export default MetricDesktopTable;
