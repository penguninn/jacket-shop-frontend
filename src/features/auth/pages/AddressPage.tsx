import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";

import { AddressList, AddressDialog } from "@/features/address/components";
import { useCreateAddress, useUpdateAddress } from "@/features/address/hooks";
import type { AddressResponse, AddressRequest } from "@/features/address/model";

export default function AddressPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<AddressResponse | undefined>(undefined);

    const createMutation = useCreateAddress();
    const updateMutation = useUpdateAddress();

    const handleOpenCreate = () => {
        setSelectedAddress(undefined);
        setDialogOpen(true);
    };

    const handleOpenEdit = (address: AddressResponse) => {
        setSelectedAddress(address);
        setDialogOpen(true);
    };

    const handleSubmit = (data: AddressRequest) => {
        if (selectedAddress) {
            updateMutation.mutate(
                { id: selectedAddress.id, data },
                { onSuccess: () => setDialogOpen(false) }
            );
        } else {
            createMutation.mutate(data, {
                onSuccess: () => setDialogOpen(false),
            });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
                <div>
                    <h2 className="text-lg font-medium">My Addresses</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your shipping addresses
                    </p>
                </div>
                <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={handleOpenCreate}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Address
                </Button>
            </div>

            {/* Address List */}
            <div className="p-6">
                <div className="space-y-6">
                    <h3 className="text-lg font-medium text-muted-foreground">Address</h3>
                    <AddressList onEdit={handleOpenEdit} />
                </div>
            </div>

            <AddressDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={selectedAddress}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
}
