import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CouponStatusBadge } from "./CouponStatusBadge";
import { CouponTypeBadge } from "./CouponTypeBadge";
import { CouponTableRowActions } from "./CouponTableRowActions";
import { formatDistanceToNow, format } from "date-fns";
import type { Coupon } from "@/features/coupons/model/schemas";

export const columns: ColumnDef<Coupon>[] = [
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
        accessorKey: "code",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="font-medium font-mono">{row.getValue("code")}</div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.getValue("description") as string | null;
            return <div className="max-w-[200px] truncate">{description || "—"}</div>;
        },
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <CouponTypeBadge type={row.getValue("type")} />,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            const value = row.getValue("value") as number;
            return (
                <div className="font-medium">
                    {type === "PERCENT" ? `${value}%` : `$${value.toFixed(2)}`}
                </div>
            );
        },
    },
    {
        accessorKey: "usageLimit",
        header: "Usage",
        cell: ({ row }) => {
            const usedCount = row.original.usedCount;
            const usageLimit = row.getValue("usageLimit") as number | null;
            return (
                <div className="text-sm">
                    {usedCount} / {usageLimit || "∞"}
                </div>
            );
        },
    },
    {
        accessorKey: "validFrom",
        header: "Valid From",
        cell: ({ row }) => {
            const date = new Date(row.getValue("validFrom"));
            return (
                <div className="text-sm text-muted-foreground">
                    {format(date, "MMM dd, yyyy")}
                </div>
            );
        },
    },
    {
        accessorKey: "validTo",
        header: "Valid To",
        cell: ({ row }) => {
            const date = new Date(row.getValue("validTo"));
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
        cell: ({ row }) => <CouponStatusBadge status={row.getValue("status")} />,
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
            const date = new Date(row.getValue("createdAt"));
            return (
                <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(date, { addSuffix: true })}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <CouponTableRowActions row={row} />,
    },
];
