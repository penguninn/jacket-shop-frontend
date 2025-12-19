import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";

import { useAddresses, useDeleteAddress, useSetDefaultAddress } from "../hooks";
import type { AddressResponse } from "../model";

interface AddressListProps {
    onEdit: (address: AddressResponse) => void;
}

export function AddressList({ onEdit }: AddressListProps) {
    const { data: addresses, isLoading } = useAddresses();
    const deleteMutation = useDeleteAddress();
    const setDefaultMutation = useSetDefaultAddress();

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-6 w-6" /></div>;
    }

    if (!addresses || addresses.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No addresses found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {addresses.map((address, index) => (
                <div key={address.id}>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-base border-r pr-2 border-gray-300">
                                    {address.recipientName}
                                </span>
                                <span className="text-muted-foreground text-sm">
                                    {address.recipientPhone}
                                </span>
                            </div>

                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>{address.addressLine}</p>
                                <p>
                                    {address.ward.name}, {address.district.name}, {address.province.name}
                                </p>
                            </div>

                            <div className="flex gap-2 pt-1 flex-wrap">
                                {address.isDefault && (
                                    <Badge variant="outline" className="border-orange-500 text-orange-500 font-normal rounded-sm px-2 py-0.5">
                                        Default
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end gap-2 md:gap-4 md:pl-4">
                            <div className="flex items-center gap-2 text-sm order-2 md:order-1">
                                <Button
                                    variant="link"
                                    className="p-0 h-auto text-primary underline-offset-4 hover:underline"
                                    onClick={() => onEdit(address)}
                                >
                                    Edit
                                </Button>
                                {!address.isDefault && (
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto text-destructive underline-offset-4 hover:underline"
                                        onClick={() => handleDelete(address.id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="text-gray-600 font-normal order-1 md:order-2"
                                disabled={!!address.isDefault || setDefaultMutation.isPending}
                                onClick={() => setDefaultMutation.mutate(address.id)}
                            >
                                Set as default
                            </Button>
                        </div>
                    </div>
                    {index < addresses.length - 1 && (
                        <Separator className="mt-6" />
                    )}
                </div>
            ))}
        </div>
    );
}
