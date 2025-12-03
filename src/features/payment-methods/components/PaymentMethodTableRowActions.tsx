import { useState } from "react";
import { type Row } from "@tanstack/react-table";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import {
    MoreHorizontal,
    Edit,
    Trash,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useDeletePaymentMethod, useUpdatePaymentMethodStatus } from "@/features/payment-methods/hooks";
import { type UpdatePaymentMethodStatusInput, type PaymentMethod } from "@/features/payment-methods/model/schemas";
import { PaymentMethodEditForm } from "./PaymentMethodEditForm";

interface Props {
    row: Row<PaymentMethod>;
}

export function PaymentMethodTableRowActions({ row }: Props) {
    const paymentMethod = row.original;
    const updateStatusMutation = useUpdatePaymentMethodStatus();
    const deleteMutation = useDeletePaymentMethod();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleToggleStatus = () => {
        const newStatus = paymentMethod.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const payload: UpdatePaymentMethodStatusInput = {
            status: newStatus,
        };
        updateStatusMutation.mutate({
            id: paymentMethod.id,
            data: payload,
        });
    };

    const handleDelete = () => {
        deleteMutation.mutate(paymentMethod.id, {
            onSuccess: () => setShowDeleteDialog(false),
        });
    };

    return (
        <>
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Payment Method"
                description={
                    <span>
                        Are you sure you want to delete payment method <strong>{paymentMethod.name}</strong>? This action cannot be undone.
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
                    <PaymentMethodEditForm paymentMethod={paymentMethod}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </PaymentMethodEditForm>
                    <DropdownMenuItem onClick={handleToggleStatus}>
                        {paymentMethod.status === "ACTIVE" ? (
                            <>
                                <XCircle className="mr-2 h-4 w-4" />
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
