import { useState } from "react";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { CategoryTableToolbar } from "./CategoryTableToolbar";
import { columns } from "./CategoryTableColumns";
import { useCategories, useBulkUpdateStatus } from "../hooks";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTablePagination } from "@/shared/components/data-table/DataTablePagination";
import { DataTableBulkActions } from "@/shared/components/data-table/DataTableBulkActions";
import { type Category } from "../model/schemas";

export function CategoriesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const bulkUpdateStatus = useBulkUpdateStatus();

  const { data, isLoading } = useCategories({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortDir: sorting[0]?.desc ? "desc" : "asc",
    status: (columnFilters.find((f) => f.id === "status")?.value as string[]) || undefined,
    search: (columnFilters.find((f) => f.id === "name")?.value as string) || undefined,
  });

  const table = useReactTable<Category>({
    data: data?.contents ?? [],
    columns,
    pageCount: data?.totalPages ?? 0,
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
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
    <div className="space-y-4">
      <CategoryTableToolbar table={table} />
      {selectedRows.length > 0 && (
        <DataTableBulkActions
          selectedCount={selectedRows.length}
          onClearSelection={() => setRowSelection({})}
          onActivate={() => {
            const selectedIds = selectedRows.map((row) => row.original.id);
            bulkUpdateStatus.mutate({ ids: selectedIds, status: "ACTIVE" });
            setRowSelection({});
          }}
          onDeactivate={() => {
            const selectedIds = selectedRows.map((row) => row.original.id);
            bulkUpdateStatus.mutate({ ids: selectedIds, status: "INACTIVE" });
            setRowSelection({});
          }}
          isLoading={bulkUpdateStatus.isPending}
          deactivateLabel="Deactivate"
        />
      )}
      <DataTable table={table} columns={columns} isLoading={isLoading} />
      <DataTablePagination table={table} />
    </div>
  );
}
