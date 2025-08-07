import React from "react";
import { Table, TableColumn } from "@/components/ui/Table";
import { MetricCategoryResponseDTO } from "@/types/dtos/metric-category.dto";
import { CategoryTableProps } from "./type";

const columns: TableColumn<MetricCategoryResponseDTO>[] = [
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
    responsiveWidth: { md: "w-1/3" },
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

const MetricCategoryDesktopTable = React.memo(
  ({
    categories,
    sortBy,
    sortOrder,
    onSort,
    onEdit,
    onDelete,
  }: CategoryTableProps) => {
    return (
      <Table<MetricCategoryResponseDTO>
        data={categories}
        columns={columns}
        sortBy={sortBy as keyof MetricCategoryResponseDTO}
        sortOrder={sortOrder}
        onSort={(col) => onSort(String(col))}
        rowKey={(cat) => cat.id}
        onEdit={onEdit}
        onDelete={onDelete}
        // Optionally: custom row component for editing/deleting per row
        // renderRow={(category) => <MetricCategoryTableRow key={category.id} category={category} />}
      />
    );
  }
);

MetricCategoryDesktopTable.displayName = "MetricCategoryDesktopTable";

export default MetricCategoryDesktopTable;
