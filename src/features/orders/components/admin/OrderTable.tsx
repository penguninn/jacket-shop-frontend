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
    type PaginationState,
} from "@tanstack/react-table";
import { OrderTableToolbar } from "./OrderTableToolbar";
import { columns } from "./OrderTableColumns";
import { useOrders } from "../../hooks";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTablePagination } from "@/shared/components/data-table/DataTablePagination";
import { type OrderFilterParams } from "../../model";

interface OrdersTableProps {
    status?: string | string[];
}

export function OrderTable({ status }: OrdersTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const queryParams: OrderFilterParams = {
        page: pagination.pageIndex + 1, // API uses 1-based pagination
        size: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortDir: sorting[0]?.desc ? "DESC" : "ASC",
        orderCode: columnFilters.find((f) => f.id === "orderCode")?.value as string,
        type: (columnFilters.find((f) => f.id === "orderType")?.value as string[])?.[0]?.toUpperCase(),
        status: status === 'all' ? undefined : (Array.isArray(status) ? status[0] : status),
    };

    const { data: response, isLoading, isError } = useOrders(queryParams);

    const table = useReactTable({
        data: response?.contents ?? [],
        columns,
        pageCount: response?.totalPages ?? 0,
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

    if (isError) {
        return (
            <div className="p-4 text-center text-red-500">
                Failed to load orders.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <OrderTableToolbar table={table} />
            <div className="rounded-md border">
                <DataTable table={table} columns={columns} isLoading={isLoading} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
