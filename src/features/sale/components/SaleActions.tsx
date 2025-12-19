import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { type SaleResponse } from "../model/schemas";
import { deleteSale } from "../api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useState } from "react";
import { SaleFormDialog } from "./SaleFormDialog";

interface SaleActionsProps {
    sale: SaleResponse;
}

export function SaleActions({ sale }: SaleActionsProps) {
    const queryClient = useQueryClient();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const deleteMutation = useMutation({
        mutationFn: deleteSale,
        onSuccess: () => {
            toast.success("Sale removed successfully");
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            setShowDeleteDialog(false);
        },
        onError: () => {
            toast.error("Failed to remove sale");
        },
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Sale
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600 focus:text-red-600"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Remove Sale
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Remove Sale"
                description={`Are you sure you want to remove the sale "${sale.name}"? This action cannot be undone.`}
                onConfirm={() => deleteMutation.mutate(sale.id)}
                isLoading={deleteMutation.isPending}
            />

            <SaleFormDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                sale={sale}
            />
        </>
    );
}
