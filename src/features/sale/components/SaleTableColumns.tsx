import { Button } from "@/shared/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { formatCurrency } from "@/shared/utils/format";
import { format } from "date-fns";
import { Badge } from "@/shared/ui/badge";
import type { SaleResponse } from "../model/schemas";
import { SaleActions } from "./SaleActions";

export const columns: ColumnDef<SaleResponse>[] = [
    {
        accessorKey: "variantId",
        header: "ID",
        cell: ({ row }) => <div className="w-[40px]">{row.getValue("variantId")}</div>,
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => {
            const image = row.getValue("image") as string | null;
            return (
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border bg-muted/50">
                    {image ? (
                        <img
                            src={image}
                            alt="Product variant"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            No img
                        </div>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "productName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Product
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{row.getValue("productName")}</span>
                    <span className="text-xs text-muted-foreground">SKU: {row.original.sku}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "originalPrice",
        header: "Price",
        cell: ({ row }) => {
            const originalPrice = row.original.originalPrice;
            const salePrice = row.original.salePrice;

            return (
                <div className="flex flex-col">
                    {salePrice && (
                        <span className="font-bold text-red-600">
                            {formatCurrency(salePrice)}
                        </span>
                    )}
                    <span className={salePrice ? "text-xs text-muted-foreground line-through" : ""}>
                        {formatCurrency(originalPrice || 0)}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "discountPercentage",
        header: "Discount",
        cell: ({ row }) => {
            const discount = row.getValue("discountPercentage") as number | null;
            return discount ? <Badge variant="destructive">-{discount}%</Badge> : null;
        }
    },
    {
        accessorKey: "saleStartDate",
        header: "Duration",
        cell: ({ row }) => {
            const start = row.original.saleStartDate;
            const end = row.original.saleEndDate;
            if (!start || !end) return <span className="text-muted-foreground">—</span>;

            return (
                <div className="flex flex-col text-sm">
                    <span>{format(new Date(start), "dd/MM/yyyy")}</span>
                    <span className="text-xs text-muted-foreground">to</span>
                    <span>{format(new Date(end), "dd/MM/yyyy")}</span>
                </div>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <SaleActions row={row} />,
    },
];
