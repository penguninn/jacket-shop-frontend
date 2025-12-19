import { useState } from "react";
import { type Row } from "@tanstack/react-table";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import {
    MoreHorizontal,
    Edit,
    Trash,
    CheckCircle2,
    XCircle,
    Eye,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useDeleteShippingMethod, useUpdateShippingMethodStatus } from "../hooks";
import { type UpdateShippingMethodStatusInput, type ShippingMethod } from "../model/schemas";
import { ShippingMethodEditForm } from "./ShippingMethodEditForm";
import { useNavigate } from "react-router-dom";

interface Props {
    row: Row<ShippingMethod>;
}

export function ShippingMethodTableRowActions({ row }: Props) {
    const shippingMethod = row.original;
    const updateStatusMutation = useUpdateShippingMethodStatus();
    const deleteMutation = useDeleteShippingMethod();
    const navigate = useNavigate();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleToggleStatus = () => {
        const newStatus = shippingMethod.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const payload: UpdateShippingMethodStatusInput = {
            status: newStatus,
        };
        updateStatusMutation.mutate({
            id: shippingMethod.id,
            data: payload,
        });
    };

    const handleDelete = () => {
        deleteMutation.mutate(shippingMethod.id, {
            onSuccess: () => setShowDeleteDialog(false),
        });
    };

    return (
        <>
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Shipping Method"
                description={
                    <span>
                        Are you sure you want to delete <strong>{shippingMethod.name}</strong>? This action cannot be undone.
                    </span>
                }
                onConfirm={handleDelete}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteMutation.isPending}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/dashboard/shipping-methods/${shippingMethod.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </DropdownMenuItem>
                    <ShippingMethodEditForm shippingMethod={shippingMethod}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </ShippingMethodEditForm>
                    <DropdownMenuItem onClick={handleToggleStatus}>
                        {shippingMethod.status === "ACTIVE" ? (
                            <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Activate
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
