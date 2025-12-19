import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { ArrowUpDown } from "lucide-react";

import { ProductVariantsTableRowActions } from "./ProductVariantsTableRowActions";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { formatCurrency } from "@/shared/utils/format";
import type { ProductVariant } from "@/features/product-variants/model/schemas";

export const columns: ColumnDef<ProductVariant>[] = [
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
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="pl-0"
            >
                ID
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="w-[40px]">{row.getValue("id")}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const image = row.getValue("image") as string | null;
            const fallback = row.original.product?.thumbnail;
            const displayImage = image || fallback;

            return (
                <div className="relative size-10 overflow-hidden rounded border">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={row.original.sku || "Variant"}
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
        accessorKey: "sku",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Sku
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("sku") || "—"}</div>,
    },
    {
        id: "productName",
        accessorFn: (row) => row.product?.name,
        header: "Product",
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate" title={row.original.product?.name}>
                {row.original.product?.name || "—"}
            </div>
        ),
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => <div>{row.original.color.name}</div>,
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => <div>{row.original.size.name}</div>,
    },
    {
        accessorKey: "material",
        header: "Material",
        cell: ({ row }) => <div>{row.original.material.name}</div>,
    },
    {
        accessorKey: "costPrice",
        header: "Cost Price",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("costPrice"));
            const formatted = formatCurrency(price);
            return <div>{formatted}</div>;
        },
    },
    {
        accessorKey: "price",
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
            const price = parseFloat(row.getValue("price"));
            const formatted = formatCurrency(price);
            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "availableQuantity",
        header: "Available",
        cell: ({ row }) => <div>{row.getValue("availableQuantity")}</div>,
    },
    {
        accessorKey: "reservedQuantity",
        header: "Reserved",
        cell: ({ row }) => <div>{row.getValue("reservedQuantity")}</div>,
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Total
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const quantity = parseFloat(row.getValue("quantity"));
            return (
                <div className={`font-medium ${quantity === 0 ? "text-red-500" : ""}`}>
                    {quantity}
                </div>
            );
        },
    },
    {
        accessorKey: "soldCount",
        header: "Sold",
        cell: ({ row }) => <div>{row.getValue("soldCount")}</div>,
    },
    {
        accessorKey: "returnCount",
        header: "Returned",
        cell: ({ row }) => <div>{row.getValue("returnCount")}</div>,
    },
    {
        header: "Dimensions (LxWxH)",
        id: "dimensions",
        cell: ({ row }) => {
            const l = row.original.length ?? "-";
            const w = row.original.width ?? "-";
            const h = row.original.height ?? "-";
            if (l === "-" && w === "-" && h === "-") return <div>—</div>;
            return <div className="text-xs">{`${l} x ${w} x ${h} cm`}</div>;
        },
    },
    {
        accessorKey: "weight",
        header: "Weight",
        cell: ({ row }) => {
            const val = row.getValue("weight") as number | null;
            return <div>{val ? `${val}g` : "—"}</div>;
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
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
        cell: ({ row }) => <ProductVariantsTableRowActions row={row} />,
    },
];
