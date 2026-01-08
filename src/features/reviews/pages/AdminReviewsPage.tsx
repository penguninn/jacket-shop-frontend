import { useState } from "react";
import { useAllReviews } from "../hooks";
import { columns } from "../components/AdminReviewColumns";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTablePagination } from "@/shared/components/data-table/DataTablePagination";
import { useReactTable, getCoreRowModel, getPaginationRowModel, type ColumnFiltersState, type SortingState } from "@tanstack/react-table";
import { ReviewTableToolbar } from "../components/ReviewTableToolbar";

export default function AdminReviewsPage() {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    // Table state
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    // Extract filters
    const ratingFilter = columnFilters.find(f => f.id === 'rating')?.value as string[];
    const ratingParam = ratingFilter?.length === 1 ? parseInt(ratingFilter[0]) : undefined;

    const { data: reviewData, isLoading, error } = useAllReviews({
        page,
        size,
        search: globalFilter || undefined,
        rating: ratingParam,
        // Backend sort params can be added here
    });

    const table = useReactTable({
        data: reviewData?.contents ?? [],
        columns,
        pageCount: reviewData?.totalPages ?? 0,
        state: {
            pagination: { pageIndex: page, pageSize: size },
            columnFilters,
            globalFilter,
            sorting,
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater({ pageIndex: page, pageSize: size });
                setPage(newState.pageIndex);
                setSize(newState.pageSize);
            } else {
                setPage(updater.pageIndex);
                setSize(updater.pageSize);
            }
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        manualPagination: true,
        manualFiltering: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Reviews Management</h1>
            <p className="text-muted-foreground mb-6">Manage customer reviews and feedback.</p>

            {error ? (
                <div className="bg-red-50 text-red-500 p-4 rounded-md border border-red-200 mb-6">
                    Error loading reviews. Check if the backend endpoint `GET / api / reviews` exists.
                </div>
            ) : null}

            <div className="space-y-4">
                <ReviewTableToolbar table={table} />
                <DataTable table={table} columns={columns} isLoading={isLoading} />
                <DataTablePagination table={table} />
            </div>
        </div>
    );
}
