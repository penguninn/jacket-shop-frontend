import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { AddressForm } from "./AddressForm";
import type { AddressRequest, AddressResponse } from "../model";

interface AddressDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: AddressResponse;
    onSubmit: (data: AddressRequest) => void;
    isLoading?: boolean;
    title?: string;
}

export function AddressDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isLoading,
    title,
}: AddressDialogProps) {
    const defaultValues: Partial<AddressRequest> | undefined = initialData
        ? {
            recipientName: initialData.recipientName || "",
            recipientPhone: initialData.recipientPhone || "",
            addressLine: initialData.addressLine,
            provinceId: initialData.province?.id,
            districtId: initialData.district?.id,
            wardId: initialData.ward?.id,
            isDefault: initialData.isDefault || false,
        }
        : undefined;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{title || (initialData ? "Edit Address" : "Add New Address")}</DialogTitle>
                    <DialogDescription>
                        {initialData ? "Update your address details below." : "Enter your new address details below."}
                    </DialogDescription>
                </DialogHeader>
                <AddressForm
                    defaultValues={defaultValues}
                    initialData={initialData}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    );
}
