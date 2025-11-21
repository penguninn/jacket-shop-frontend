import { useState } from "react";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ProductVariantTableToolbar } from "./ProductVariantTableToolbar";
import { BulkActionsBar } from "./BulkActionsBar";
import { columns } from "./ProductVariantTableColumns";
import { useProductVariants } from "../hooks";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTablePagination } from "@/shared/components/data-table/DataTablePagination";

interface ProductVariantsTableProps {
  productId?: number;
}

export function ProductVariantsTable({ productId }: ProductVariantsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const primarySort = sorting[0];

  const { data, isLoading } = useProductVariants({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortBy: primarySort?.id,
    sortDir: primarySort ? (primarySort.desc ? "desc" : "asc") : undefined,
    status: columnFilters.find((f) => f.id === "status")?.value as string[],
    search: columnFilters.find((f) => f.id === "name")?.value as string,
    product: productId,
  });

  const table = useReactTable({
    data: data?.contents ?? [],
    columns,
    pageCount: data?.totalPages ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className="space-y-2">
      {selectedRows.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.length}
          selectedRows={selectedRows}
          onClearSelection={() => table.resetRowSelection()}
        />
      )}
      <ProductVariantTableToolbar table={table} />
      <DataTable table={table} columns={columns} isLoading={isLoading} />
      <DataTablePagination table={table} />
    </div>
  );
}
