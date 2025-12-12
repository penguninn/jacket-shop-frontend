import { useState, useCallback } from "react";
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
  type PaginationState,
} from "@tanstack/react-table";
import { UserTableToolbar } from "./UserTableToolbar";
import { columns } from "./UserTableColumns";
import { useUsers, useBulkUpdateStatus } from "../hooks";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTablePagination } from "@/shared/components/data-table/DataTablePagination";
import { DataTableBulkActions } from "@/shared/components/data-table/DataTableBulkActions";
import type { UserFilterParams } from "../model/schemas";
import type { Status } from "@/shared/api/schemas";

// ============================================
// CONSTANTS
// ============================================
const USER_TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_SORT: {
    id: 'createdAt',
    desc: true,
  },
  COLUMN_IDS: {
    USERNAME: 'username',
    STATUS: 'status',
    ROLES: 'roles',
  },
} as const;

function getFilterValue<T = unknown>(
  filters: ColumnFiltersState,
  columnId: string
): T | undefined {
  return filters.find((f) => f.id === columnId)?.value as T | undefined;
}

function buildUserQueryParams(
  pagination: PaginationState,
  sorting: SortingState,
  columnFilters: ColumnFiltersState
): UserFilterParams {
  const sort = sorting[0];

  return {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sortBy: sort?.id,
    sortDir: sort?.desc ? "DESC" : "ASC",
    search: getFilterValue<string>(
      columnFilters,
      USER_TABLE_CONFIG.COLUMN_IDS.USERNAME
    ),
    status: getFilterValue<Status[]>(
      columnFilters,
      USER_TABLE_CONFIG.COLUMN_IDS.STATUS
    ),
    roles: getFilterValue<string[]>(
      columnFilters,
      USER_TABLE_CONFIG.COLUMN_IDS.ROLES
    ),
  };
}

function getSelectedRowIds<T extends { id: number }>(
  rows: Array<{ original: T }>
): number[] {
  return rows.map((row) => row.original.id);
}

export function UsersTable() {
  const [sorting, setSorting] = useState<SortingState>([
    USER_TABLE_CONFIG.DEFAULT_SORT,
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: USER_TABLE_CONFIG.DEFAULT_PAGE_SIZE,
  });

  const queryParams = buildUserQueryParams(pagination, sorting, columnFilters);
  const { data, isLoading, isError } = useUsers(queryParams);

  const bulkUpdateStatus = useBulkUpdateStatus();
  const table = useReactTable({
    data: data?.contents ?? [],
    columns,
    pageCount: data?.totalPages ?? 0,
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
  const selectedIds = getSelectedRowIds(selectedRows);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
  }, []);

  const handleBulkStatusUpdate = useCallback(
    (status: Status) => {
      bulkUpdateStatus.mutate(
        { ids: selectedIds, status },
        {
          onSuccess: () => {
            handleClearSelection();
          },
        }
      );
    },
    [selectedIds, bulkUpdateStatus, handleClearSelection]
  );

  if (isError) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Failed to load users. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UserTableToolbar table={table} />

      {selectedRows.length > 0 && (
        <DataTableBulkActions
          selectedCount={selectedRows.length}
          onClearSelection={handleClearSelection}
          onActivate={() => handleBulkStatusUpdate("ACTIVE")}
          onDeactivate={() => handleBulkStatusUpdate("INACTIVE")}
          isLoading={bulkUpdateStatus.isPending}
          deactivateLabel="Deactivate"
        />
      )}

      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
      />

      <DataTablePagination table={table} />
    </div>
  );
}
