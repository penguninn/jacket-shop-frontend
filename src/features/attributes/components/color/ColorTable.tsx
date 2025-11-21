import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import { columns } from "./ColorTableColumn";
import { useColors, useBulkUpdateStatusColors } from "../../hooks";
import { ColorTableToolbar } from "./ColorTableToolbar";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTablePagination } from "@/shared/components/data-table/DataTablePagination";
import { DataTableBulkActions } from "@/shared/components/data-table/DataTableBulkActions";

export function ColorTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const bulkUpdateStatus = useBulkUpdateStatusColors();

  const { data, isLoading } = useColors({
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortBy: sorting[0]?.id,
    sortDir: sorting[0]?.desc ? "desc" : "asc",
    search: columnFilters.find(f => f.id === "name")?.value as string,
    status: columnFilters.find(f => f.id === "status")?.value as string[],
  });

  const table = useReactTable({
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
      <ColorTableToolbar table={table} />
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
