import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { useAddresses, useCreateAddress, useUpdateAddress } from "@/features/address/hooks";
import type { AddressResponse } from "@/features/address/model";
import { AddressDialog } from "@/features/address/components/AddressDialog";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";

interface AddressSectionProps {
    selectedAddress: AddressResponse | null;
    onSelectAddress: (address: AddressResponse) => void;
    disabled?: boolean;
}

export function AddressSection({ selectedAddress, onSelectAddress, disabled }: AddressSectionProps) {
    const { data: addresses } = useAddresses();
    const [isSelectionOpen, setIsSelectionOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressResponse | undefined>(undefined);
    const createAddress = useCreateAddress();
    const updateAddress = useUpdateAddress();

    useEffect(() => {
        if (!selectedAddress && addresses && addresses.length > 0) {
            const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
            onSelectAddress(defaultAddr);
        }
    }, [addresses, selectedAddress, onSelectAddress]);

    const handleEdit = (address: AddressResponse) => {
        setEditingAddress(address);
        setIsCreateOpen(true);
    };

    const handleCreate = () => {
        setEditingAddress(undefined);
        setIsCreateOpen(true);
    };

    return (
        <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm">
            <div className="flex items-center gap-2 text-orange-500 mb-4">
                <h2 className="text-lg font-medium">Delivery Address</h2>
            </div>

            <div className="flex justify-between items-center">
                {selectedAddress ? (
                    <div>
                        <div className="flex items-center gap-2 font-bold text-gray-800">
                            {selectedAddress.recipientName || "My Name"} ({selectedAddress.recipientPhone || "+84"})
                        </div>
                        <div className="text-gray-600 mt-1">
                            {selectedAddress.addressLine}, {selectedAddress.ward?.name}, {selectedAddress.district?.name}, {selectedAddress.province?.name}
                            {selectedAddress.isDefault && (
                                <span className="border border-red-500 text-red-500 text-xs px-1 ml-2 rounded-[2px]">Default</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-500">No address selected. Please add an address.</div>
                )}

                <div className="flex gap-2">
                    <Dialog open={isSelectionOpen} onOpenChange={setIsSelectionOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                className="text-blue-500 font-medium hover:text-blue-600 hover:bg-transparent uppercase"
                                disabled={disabled}
                            >
                                Change
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>My Address</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                {addresses?.map((addr, idx) => (
                                    <div key={addr.id}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                                <input
                                                    type="radio"
                                                    className="mt-1"
                                                    checked={selectedAddress?.id === addr.id}
                                                    onChange={() => {
                                                        onSelectAddress(addr);
                                                        setIsSelectionOpen(false);
                                                    }}
                                                />
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{addr.recipientName || "My Name"}</span>
                                                        <span className="text-gray-500">|</span>
                                                        <span className="text-gray-500">({addr.recipientPhone || "+84"})</span>
                                                    </div>
                                                    <div className="text-gray-600 text-sm">
                                                        {addr.addressLine}
                                                        <br />
                                                        {addr.ward?.name}, {addr.district?.name}, {addr.province?.name}
                                                    </div>
                                                    {addr.isDefault && <Badge variant="outline" className="text-red-500 border-red-500 rounded-sm font-normal">Default</Badge>}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className="text-blue-500 h-auto p-0 hover:bg-transparent"
                                                onClick={() => handleEdit(addr)}
                                            >
                                                Update
                                            </Button>
                                        </div>
                                        {idx < addresses.length - 1 && <Separator className="mt-4" />}
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="w-full mt-4 flex items-center gap-2"
                                onClick={handleCreate}
                            >
                                <span className="text-lg">+</span> Add New Address
                            </Button>
                        </DialogContent>
                    </Dialog>

                    <AddressDialog
                        open={isCreateOpen}
                        onOpenChange={setIsCreateOpen}
                        initialData={editingAddress}
                        onSubmit={(data) => {
                            if (editingAddress) {
                                updateAddress.mutate({ id: editingAddress.id, data }, {
                                    onSuccess: () => {
                                        setIsCreateOpen(false);
                                        setEditingAddress(undefined);
                                    }
                                });
                            } else {
                                createAddress.mutate(data, {
                                    onSuccess: () => {
                                        setIsCreateOpen(false);
                                    }
                                });
                            }
                        }}
                        isLoading={createAddress.isPending || updateAddress.isPending}
                    />
                </div>
            </div>
        </div>
    );
}
