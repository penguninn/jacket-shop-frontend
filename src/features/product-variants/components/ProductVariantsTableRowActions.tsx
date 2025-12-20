import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import {
    MoreHorizontal,
    Trash,
    Eye,
    CheckCircle2,
    Archive,
    Pen,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useDeleteProductVariant, useUpdateProductVariantStatus } from "../hooks";
import type { ProductVariant } from "../model/schemas";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useNavigate } from "react-router-dom";
import { ProductVariantEditForm } from "./ProductVariantEditForm";
import { ProductVariantStockAdjustmentDialog } from "./ProductVariantStockAdjustmentDialog";
import { ProductVariantCheckStockDialog } from "./ProductVariantCheckStockDialog";
import { ArrowLeftRight, ClipboardCheck } from "lucide-react";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function ProductVariantsTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    const variant = row.original as ProductVariant;
    const deleteVariant = useDeleteProductVariant();
    const updateStatus = useUpdateProductVariantStatus();
    const navigate = useNavigate();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showStockAdjustDialog, setShowStockAdjustDialog] = useState(false);
    const [showCheckStockDialog, setShowCheckStockDialog] = useState(false);

    const handleDelete = () => {
        deleteVariant.mutate(variant.id, {
            onSuccess: () => {
                setShowDeleteDialog(false);
            },
        });
    };

    const handleToggleStatus = () => {
        const newStatus = variant.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        updateStatus.mutate({
            id: variant.id,
            data: { status: newStatus },
        });
    };

    return (
        <>
            <ProductVariantEditForm
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                variant={variant}
            />
            <ProductVariantStockAdjustmentDialog
                open={showStockAdjustDialog}
                onOpenChange={setShowStockAdjustDialog}
                variant={variant}
            />
            <ProductVariantCheckStockDialog
                open={showCheckStockDialog}
                onOpenChange={setShowCheckStockDialog}
                variant={variant}
            />
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Variant"
                description={`Are you sure you want to delete SKU ${variant.sku || variant.id}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                variant="destructive"
                isLoading={deleteVariant.isPending}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => {
                        if (variant.productId) {
                            navigate(`/dashboard/products/${variant.productId}`);
                        }
                    }}>
                        <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        View Product
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowStockAdjustDialog(true)}>
                        <ArrowLeftRight className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Adjust Stock
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowCheckStockDialog(true)}>
                        <ClipboardCheck className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Check Stock
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleToggleStatus}>
                        {variant.status === "ACTIVE" ? (
                            <>
                                <Archive className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
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
