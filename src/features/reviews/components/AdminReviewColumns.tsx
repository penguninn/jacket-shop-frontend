import type { ColumnDef } from "@tanstack/react-table";
import type { ReviewResponse } from "../model/schemas";
import { Button } from "@/shared/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteReview } from "../hooks";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";

const ActionCell = ({ id }: { id: number }) => {
    const deleteReview = useDeleteReview();

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
                if (confirm("Are you sure you want to delete this review?")) {
                    deleteReview.mutate(id);
                }
            }}
            disabled={deleteReview.isPending}
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
};

export const columns: ColumnDef<ReviewResponse>[] = [
    {
        accessorKey: "id",
        header: "ID",
        size: 60,
    },
    {
        accessorKey: "productName",
        header: "Product",
    },
    {
        accessorKey: "userName",
        header: "User",
    },
    {
        accessorKey: "rating",
        header: "Rating",
        cell: ({ row }) => (
            <div className="flex text-[#FFC633]">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={cn("w-3 h-3 rounded-full", i < row.original.rating ? "bg-[#FFC633]" : "bg-gray-200")}
                    />
                ))}
            </div>
        )
    },
    {
        accessorKey: "comment",
        header: "Comment",
        cell: ({ row }) => <span className="truncate max-w-[300px] block" title={row.original.comment || ""}>{row.original.comment}</span>
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => row.original.createdAt ? format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm") : "N/A"
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => <ActionCell id={row.original.id} />,
    },
];
