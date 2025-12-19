import { Button } from "@/shared/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/shared/ui/badge";
import type { SaleResponse } from "../model/schemas";
import { SaleActions } from "./SaleActions";

export const columns: ColumnDef<SaleResponse>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="w-[40px]">{row.getValue("id")}</div>,
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
        cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
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
        accessorKey: "startDate",
        header: "Valid From",
        cell: ({ row }) => {
            const dateStr = row.getValue("startDate") as string | null;
            if (!dateStr) return <span className="text-muted-foreground">—</span>;
            const date = new Date(dateStr);
            return (
                <div className="text-sm text-muted-foreground">
                    {format(date, "MMM dd, yyyy")}
                </div>
            );
        },
    },
    {
        accessorKey: "endDate",
        header: "Valid To",
        cell: ({ row }) => {
            const dateStr = row.getValue("endDate") as string | null;
            if (!dateStr) return <span className="text-muted-foreground">—</span>;
            const date = new Date(dateStr);
            const isExpired = date < new Date();
            return (
                <div
                    className={`text-sm ${isExpired ? "text-red-600 font-medium" : "text-muted-foreground"}`}
                >
                    {format(date, "MMM dd, yyyy")}
                </div>
            );
        },
    },
    {
        id: "variantsCount",
        header: "Variants",
        cell: ({ row }) => {
            const count = row.original.variants?.length || 0;
            return <Badge variant="outline">{count} items</Badge>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <SaleActions sale={row.original} />,

    },
];
