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
import { useState } from "react";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTablePagination } from "@/shared/components/data-table/DataTablePagination";
import { columns } from "./SaleTableColumns";
import { SaleTableToolbar } from "./SaleTableToolbar";
import { type SaleResponse } from "../model/schemas";

interface Props {
    data: SaleResponse[];
    isLoading: boolean;
}

export function SaleTable({ data, isLoading }: Props) {
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    return (
        <div className="space-y-4">
            <SaleTableToolbar table={table} />
            <DataTable table={table} columns={columns} isLoading={isLoading} />
            <DataTablePagination table={table} />
        </div>
    );
}
