import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pen, Trash, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useDeleteBrand, useUpdateBrandStatus } from "../hooks";
import { BrandEditForm } from "./BrandEditForm";
import type { Brand, UpdateBrandStatusInput } from "../model/schemas";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function BrandTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const brand = row.original as Brand;
    const deleteBrand = useDeleteBrand();
    const updateStatus = useUpdateBrandStatus();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        deleteBrand.mutate(brand.id, {
            onSuccess: () => setShowDeleteDialog(false),
        });
    };

    const handleToggleStatus = () => {
        const newStatus = brand.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const payload: UpdateBrandStatusInput = {
            status: newStatus,
        };
        updateStatus.mutate({
            id: brand.id,
            data: payload,
        });
    };

    return (
        <>
            <BrandEditForm
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                brand={brand}
            />

            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Brand"
                description={
                    <span>
                        Are you sure you want to delete brand <strong>{brand.name}</strong>? This action cannot be undone.
                    </span>
                }
                onConfirm={handleDelete}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteBrand.isPending}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleStatus}>
                        {brand.status === "ACTIVE" ? (
                            <>
                                <XCircle className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                Deactivate
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                Activate
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash className="mr-2 h-3.5 w-3.5" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
