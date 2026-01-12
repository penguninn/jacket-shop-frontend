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
import { useMemo, useState } from "react";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTablePagination } from "@/shared/components/data-table/DataTablePagination";
import { columns } from "./SaleTableColumns";
import { SaleTableToolbar } from "./SaleTableToolbar";
import { type SaleResponse } from "../model/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkUpdateSalesStatus } from "../api";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { X, CheckCircle, XCircle } from "lucide-react";

interface Props {
    data: SaleResponse[];
    isLoading: boolean;
}

export function SaleTable({ data, isLoading }: Props) {
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const queryClient = useQueryClient();

    const tableColumns = useMemo(() => columns, []);

    const table = useReactTable({
        data,
        columns: tableColumns,
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

    const selectedRows = table.getFilteredSelectedRowModel().rows;

    const bulkUpdateStatusMutation = useMutation({
        mutationFn: ({ ids, status }: { ids: number[], status: "ACTIVE" | "INACTIVE" }) => bulkUpdateSalesStatus(ids, status),
        onSuccess: () => {
            toast.success("Sales status updated successfully");
            setRowSelection({});
            queryClient.invalidateQueries({ queryKey: ["sales"] });
        },
        onError: () => {
            toast.error("Failed to update sales status");
        },
    });

    const handleBulkActivate = () => {
        const selectedIds = selectedRows.map((row) => row.original.id);
        bulkUpdateStatusMutation.mutate({ ids: selectedIds, status: "ACTIVE" });
    };

    const handleBulkDeactivate = () => {
        const selectedIds = selectedRows.map((row) => row.original.id);
        bulkUpdateStatusMutation.mutate({ ids: selectedIds, status: "INACTIVE" });
    };

    const isBusy = bulkUpdateStatusMutation.isPending;

    return (
        <div className="space-y-4">
            <SaleTableToolbar table={table} />

            {selectedRows.length > 0 && (
                <Alert>
                    <AlertDescription className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{selectedRows.length} row(s) selected</span>
                            <Button variant="ghost" size="sm" onClick={() => setRowSelection({})}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium mr-2">Set Status:</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBulkActivate}
                                disabled={isBusy}
                                className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Active
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBulkDeactivate}
                                disabled={isBusy}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Inactive
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            <DataTable table={table} columns={columns} isLoading={isLoading} />
            <DataTablePagination table={table} />
        </div>
    );
}
