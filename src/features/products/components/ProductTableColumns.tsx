import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { ArrowUpDown, Star } from "lucide-react";

import { ProductTableRowActions } from "./ProductTableRowActions";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import type { Product } from "@/features/products/model/schemas";
import { formatCurrency } from "@/shared/utils/format";

export const columns: ColumnDef<Product>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="w-[60px]">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "thumbnail",
        header: "Thumbnail",
        cell: ({ row }) => {
            const thumbnail = row.getValue("thumbnail") as string | null;
            return (
                <div className="relative size-10 overflow-hidden rounded border">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt={row.getValue("name")}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                            No Img
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }) => {
            const brand = row.original.brand;
            return <div>{brand?.name || "—"}</div>;
        },
        filterFn: (row, _id, value) => {
            const brand = row.original.brand;
            if (!brand) return false;
            return value.includes(brand.id.toString());
        },
    },
    {
        accessorKey: "style",
        header: "Style",
        cell: ({ row }) => {
            const style = row.original.style;
            return <div>{style?.name || "—"}</div>;
        },
        filterFn: (row, _id, value) => {
            const style = row.original.style;
            if (!style) return false;
            return value.includes(style.id.toString());
        },
    },
    {
        accessorKey: "isFeatured",
        header: "Featured",
        cell: ({ row }) => {
            const isFeatured = row.getValue("isFeatured");
            return (
                <div className="flex justify-center">
                    {isFeatured ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ) : (
                        <div className="h-4 w-4" /> // Empty placeholder
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "price", // Virtual accessor for sorting if needed, or use custom id
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const min = row.original.minPrice || 0;
            const max = row.original.maxPrice || 0;
            if (min === max) {
                return <div className="font-medium">{formatCurrency(min)}</div>;
            }
            return (
                <div className="font-medium">
                    {formatCurrency(min)} - {formatCurrency(max)}
                </div>
            );
        },
    },
    {
        accessorKey: "soldCount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Sold
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.getValue("soldCount")}</div>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const dateStr = row.getValue("createdAt") as string | null;
            if (!dateStr) return <div className="text-sm text-muted-foreground">—</div>;
            const date = new Date(dateStr);
            return (
                <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(date, { addSuffix: true })}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ProductTableRowActions row={row} />,
    },
];
