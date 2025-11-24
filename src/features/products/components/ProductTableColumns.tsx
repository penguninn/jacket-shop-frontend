import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { ArrowUpDown } from "lucide-react";

import { ProductTableRowActions } from "./ProductTableRowActions";
import { ProductStatusBadge } from "./ProductStatusBadge";
import { formatDistanceToNow } from "date-fns";
import type { Product } from "@/features/products/model/schemas";

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
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.original.category;
            return <div>{category?.name || "—"}</div>;
        },
    },
    {
        accessorKey: "brand",
        header: "Brand",
        cell: ({ row }) => {
            const brand = row.original.brand;
            return <div>{brand?.name || "—"}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <ProductStatusBadge status={row.getValue("status")} />,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
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
