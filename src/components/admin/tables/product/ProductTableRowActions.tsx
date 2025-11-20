import { useState } from "react";
import { MoreHorizontal, Pencil, Trash, CheckCircle, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteProduct, useUpdateProductStatus } from "@/hooks/product";
import { type Product } from "@/schema/product";
import { ProductEditForm } from "../../forms/ProductEditForm";

interface Props {
    product: Product;
}

export function ProductTableRowActions({ product }: Props) {
    const [editOpen, setEditOpen] = useState(false);
    const deleteProduct = useDeleteProduct();
    const updateStatus = useUpdateProductStatus();

    const handleToggleStatus = () => {
        const newStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        updateStatus.mutate({ id: product.id, data: { status: newStatus } });
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            deleteProduct.mutate(product.id);
        }
    };

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
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleStatus}>
                        {product.status === "ACTIVE" ? (
                            <>
                                <Ban className="mr-2 h-4 w-4" />
                                Deactivate
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>
                            Update product information
                        </DialogDescription>
                    </DialogHeader>
                    <ProductEditForm product={product} onSuccess={() => setEditOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}
