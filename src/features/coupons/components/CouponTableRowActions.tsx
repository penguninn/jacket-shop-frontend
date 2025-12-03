import { useState } from "react";
import { type Row } from "@tanstack/react-table";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import {
    MoreHorizontal,
    Edit,
    Trash,
    Ban,
    CheckCircle,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useDeleteCoupon, useUpdateCouponStatus } from "@/features/coupons/hooks";
import { type UpdateCouponStatusInput, type Coupon } from "@/features/coupons/model/schemas";
import { CouponEditForm } from "./CouponEditForm";

interface Props {
    row: Row<Coupon>;
}

export function CouponTableRowActions({ row }: Props) {
    const coupon = row.original;
    const updateCouponStatusMutation = useUpdateCouponStatus();
    const deleteCouponMutation = useDeleteCoupon();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleToggleStatus = () => {
        const newStatus = coupon.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const payload: UpdateCouponStatusInput = {
            status: newStatus,
        };
        updateCouponStatusMutation.mutate({
            id: coupon.id,
            data: payload,
        });
    };

    const handleDelete = () => {
        deleteCouponMutation.mutate(coupon.id, {
            onSuccess: () => setShowDeleteDialog(false),
        });
    };

    return (
        <>
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Coupon"
                description={
                    <span>
                        Are you sure you want to delete coupon <strong>{coupon.code}</strong>? This action cannot be undone.
                    </span>
                }
                onConfirm={handleDelete}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteCouponMutation.isPending}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <CouponEditForm coupon={coupon}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </CouponEditForm>
                    <DropdownMenuItem onClick={handleToggleStatus}>
                        {coupon.status === "ACTIVE" ? (
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
