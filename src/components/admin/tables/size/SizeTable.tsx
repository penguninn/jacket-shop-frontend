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
import { columns } from "./SizeTableColumn";
import { useSizes } from "@/hooks/attribute";
import { SizeTableToolbar } from "./SizeTableToolbar";
import { DataTable } from "../DataTable";
import { DataTablePagination } from "../DataTablePagination";
import { BulkActionsBar } from "./BulkActionsBar";

export function SizeTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading } = useSizes({
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
      <SizeTableToolbar table={table} />
      {selectedRows.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.length}
          selectedRows={selectedRows}
          onClearSelection={() => setRowSelection({})}
        />
      )}
      <DataTable table={table} columns={columns} isLoading={isLoading} />
      <DataTablePagination table={table} />
    </div>
  );
}
