import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ArrowUpDown, Eye } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/shared/utils/format";
import { cn } from "@/shared/lib/utils";
import { type Order, ORDER_TYPE, ORDER_STATUS, PAYMENT_STATUS } from "../../model";

const TYPE_BADGES = {
    [ORDER_TYPE.POS_INSTORE]: { label: "POS In-Store", className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" },
    [ORDER_TYPE.POS_DELIVERY]: { label: "POS Delivery", className: "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-100" },
    [ORDER_TYPE.ONLINE]: { label: "Online", className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100" },
};

const STATUS_BADGES = {
    [ORDER_STATUS.COMPLETED]: { label: "Completed", className: "bg-purple-100 text-purple-700 border-purple-200" },
    [ORDER_STATUS.CANCELLED]: { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200" }, // Red for cancelled
    [ORDER_STATUS.SHIPPING]: { label: "Delivering", className: "bg-blue-100 text-blue-700 border-blue-200" },
    [ORDER_STATUS.CONFIRMED]: { label: "Confirmed", className: "bg-orange-100 text-orange-700 border-orange-200" },
    [ORDER_STATUS.PENDING]: { label: "Pending", className: "bg-gray-100 text-gray-700 border-gray-200" },
    [ORDER_STATUS.RETURNED]: { label: "Returned", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
};

const PAYMENT_STATUS_BADGES = {
    [PAYMENT_STATUS.UNPAID]: { label: "Unpaid", className: "bg-red-100 text-red-700 border-red-200" },
    [PAYMENT_STATUS.PAID]: { label: "Paid", className: "bg-green-100 text-green-700 border-green-200" },
    [PAYMENT_STATUS.REFUNDED]: { label: "Refunded", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
};

export const columns: ColumnDef<Order>[] = [
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
        accessorKey: "index",
        header: "#",
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
        enableSorting: false,
    },
    {
        accessorKey: "orderCode",
        header: "Code",
        cell: ({ row }) => <div className="font-medium">{row.getValue("orderCode")}</div>,
    },
    {
        accessorKey: "details",
        header: () => (
            <div className="text-center">
                Total Products
            </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.original.details?.length || 0}</div>,
    },
    {
        accessorKey: "total",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Total Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{formatCurrency(row.getValue("total"))}</div>,
    },
    {
        accessorKey: "customerName",
        header: "Customer Name",
        cell: ({ row }) => <div>{row.getValue("customerName")}</div>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Created At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const dateStr = row.getValue("createdAt") as string;
            return <div>{format(new Date(dateStr), "dd/MM/yyyy HH:mm")}</div>;
        },
    },
    {
        accessorKey: "orderType",
        header: () => <div className="text-center">Order Type</div>,
        cell: ({ row }) => {
            const type = row.getValue("orderType") as string;
            // @ts-ignore
            const badge = TYPE_BADGES[type] || { label: type, className: "bg-gray-100" };
            return (
                <div className="text-center">
                    <Badge variant="outline" className={cn("font-normal rounded-full", badge.className)}>
                        {badge.label}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            // @ts-ignore
            const badge = STATUS_BADGES[status] || { label: status, className: "bg-gray-100" };
            return (
                <div className="text-center">
                    <Badge variant="outline" className={cn("font-normal rounded-full", badge.className)}>
                        {badge.label}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "paymentStatus",
        header: () => <div className="text-center">Payment</div>,
        cell: ({ row }) => {
            const paymentStatus = row.getValue("paymentStatus") as string;
            // @ts-ignore
            const badge = PAYMENT_STATUS_BADGES[paymentStatus] || { label: paymentStatus, className: "bg-gray-100" };
            return (
                <div className="text-center">
                    <Badge variant="outline" className={cn("font-normal rounded-full", badge.className)}>
                        {badge.label}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => (
            <div className="flex items-center justify-center gap-2">
                <Link to={`/dashboard/orders/${row.original.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50">
                        <Eye className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        ),
    },
];
