import { useState, useMemo } from "react";
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
import { DataTable } from "@/shared/components/data-table/DataTable";
import { DataTablePagination } from "@/shared/components/data-table/DataTablePagination";
import { columns, type ProductSearchTableMeta, type POSProductVariant } from "./ProductSearchColumns";
import { ProductSearchToolbar } from "./ProductSearchToolbar";
import { useProductVariants } from "@/features/product-variants/hooks";
import { useAddItemToPosDraft } from "../hooks";
import type { Order } from "../model/schemas";
import { toast } from "sonner";

interface ProductSearchTableProps {
    activeDraft: Order | undefined;
}

export function ProductSearchTable({ activeDraft }: ProductSearchTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const { mutate: addItem } = useAddItemToPosDraft();

    const { data, isLoading } = useProductVariants({
        page: pagination.pageIndex,
        size: pagination.pageSize,
        sortBy: sorting[0]?.id as any,
        sortDir: sorting[0]?.desc ? "DESC" : "ASC",
        search: columnFilters.find((f) => f.id === "sku")?.value as string,
        status: ["ACTIVE"],
        colorIds: (columnFilters.find((f) => f.id === "color")?.value as string[])?.map(Number),
        sizeIds: (columnFilters.find((f) => f.id === "size")?.value as string[])?.map(Number),
        materialIds: (columnFilters.find((f) => f.id === "material")?.value as string[])?.map(Number),
    });

    const handleAddToCart = (variant: POSProductVariant) => {
        if (!activeDraft) {
            toast.error("Please select a draft first");
            return;
        }

        addItem({
            draftId: activeDraft.id,
            item: {
                productVariantId: variant.id,
                quantity: 1,
            },
        });
    };

    const meta: ProductSearchTableMeta = useMemo(() => ({
        addToCart: handleAddToCart,
    }), [activeDraft, addItem]);


    const table = useReactTable({
        data: (data?.contents as POSProductVariant[]) ?? [],
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
        meta,
    });

    return (
        <div className="h-full flex flex-col space-y-4">
            <ProductSearchToolbar table={table} />
            <div className="flex-1 overflow-auto px-4">
                <DataTable table={table} columns={columns} isLoading={isLoading} />
            </div>
            <div className="px-4 pb-4">
                <DataTablePagination table={table} />
            </div>
        </div>
    );
}
