import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { ArrowUpDown } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { BrandTableRowActions } from "./BrandTableRowActions";
import { formatDistanceToNow } from "date-fns";
import type { Brand } from "../model/schemas";

export const columns: ColumnDef<Brand>[] = [
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
        accessorKey: "logoUrl",
        header: "Logo",
        cell: ({ row }) => {
            const logoUrl = row.getValue("logoUrl") as string | null;
            if (!logoUrl) return <div className="text-muted-foreground">—</div>;
            return (
                <div className="flex items-center gap-2">
                    <img src={logoUrl} alt="Brand logo" className="h-8 w-8 rounded object-cover" />
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
        cell: ({ row }) => <BrandTableRowActions row={row} />,
    },
];
