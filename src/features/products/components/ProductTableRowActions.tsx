import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pen, Trash, Eye, Archive, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useDeleteProduct, useUpdateProductStatus } from "../hooks";
import { ProductEditForm } from "./ProductEditForm";
import type { Product, UpdateProductStatusInput } from "../model/schemas";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useNavigate } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function ProductTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const product = row.original as Product;
    const deleteProduct = useDeleteProduct();
    const updateStatus = useUpdateProductStatus();
    const navigate = useNavigate();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        deleteProduct.mutate(product.id, {
            onSuccess: () => setShowDeleteDialog(false),
        });
    };

    const handleToggleStatus = () => {
        const newStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const payload: UpdateProductStatusInput = {
            status: newStatus,
        };
        updateStatus.mutate({
            id: product.id,
            data: payload,
        });
    };

    return (
        <>
            <ProductEditForm
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                product={product}
            />

            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Product"
                description={
                    <span>
                        Are you sure you want to delete product <strong>{product.name}</strong>? This action cannot be undone.
                    </span>
                }
                onConfirm={handleDelete}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteProduct.isPending}
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
                    <DropdownMenuItem onClick={() => navigate(`/dashboard/products/${product.id}`)}>
                        <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleStatus}>
                        {product.status === "ACTIVE" ? (
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
