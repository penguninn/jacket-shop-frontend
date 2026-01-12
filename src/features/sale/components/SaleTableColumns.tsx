import { Button } from "@/shared/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/shared/ui/badge";
import type { SaleResponse } from "../model/schemas";
import { SaleActions } from "./SaleActions";
import { Checkbox } from "@/shared/ui/checkbox";

export const columns: ColumnDef<SaleResponse>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
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
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.getValue("description") as string | null;
            return (
                <div className="max-w-[200px] truncate" title={description || ""}>
                    {description || <span className="text-muted-foreground italic">No description</span>}
                </div>
            );
        },
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string | null;

            if (status === "ACTIVE") {
                return (
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">
                        Active
                    </Badge>
                );
            }

            return (
                <Badge variant="secondary">
                    {status === "INACTIVE" ? "Inactive" : "N/A"}
                </Badge>
            );
        },
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
