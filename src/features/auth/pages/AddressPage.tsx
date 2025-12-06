import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";

interface Address {
    id: string;
    name: string;
    phone: string;
    detail: string;
    location: string;
    isDefault: boolean;
    isReturnAddress?: boolean;
    isPickupAddress?: boolean;
}

const MOCK_ADDRESSES: Address[] = [
    {
        id: "1",
        name: "Mạc Vũ Anh Đại",
        phone: "(+84) 969 477 050",
        detail: "Số nhà 26 thôn Tân Thành",
        location: "Xã Bình Dương, Thị Xã Đông Triều, Quảng Ninh",
        isDefault: true,
        isReturnAddress: true,
    },
    {
        id: "2",
        name: "mạc vũ anh đại",
        phone: "(+84) 969 477 050",
        detail: "doi dien Số 22, Ngách 4 Ngõ 266 Đường 422b",
        location: "Xã Vân Canh, Huyện Hoài Đức, Hà Nội",
        isDefault: false,
        isPickupAddress: true,
    },
    {
        id: "3",
        name: "mạc vũ anh đại",
        phone: "(+84) 969 477 050",
        detail: "25 ngõ 147 đan khê",
        location: "Xã Di Trạch, Huyện Hoài Đức, Hà Nội",
        isDefault: false,
    },
];

export default function AddressPage() {
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
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Address
                </Button>
            </div>

            {/* Address List */}
            <div className="p-6">
                <div className="space-y-6">
                    <h3 className="text-lg font-medium text-muted-foreground">Address</h3>

                    <div className="space-y-6">
                        {MOCK_ADDRESSES.map((address, index) => (
                            <div key={address.id}>
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-medium text-base border-r pr-2 border-gray-300">
                                                {address.name}
                                            </span>
                                            <span className="text-muted-foreground text-sm">
                                                {address.phone}
                                            </span>
                                        </div>

                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p>{address.detail}</p>
                                            <p>{address.location}</p>
                                        </div>

                                        <div className="flex gap-2 pt-1 flex-wrap">
                                            {address.isDefault && (
                                                <Badge variant="outline" className="border-orange-500 text-orange-500 font-normal rounded-sm px-2 py-0.5">
                                                    Default
                                                </Badge>
                                            )}
                                            {address.isReturnAddress && (
                                                <Badge variant="outline" className="border-gray-300 text-gray-500 font-normal rounded-sm px-2 py-0.5">
                                                    Return Address
                                                </Badge>
                                            )}
                                            {address.isPickupAddress && (
                                                <Badge variant="outline" className="border-gray-300 text-gray-500 font-normal rounded-sm px-2 py-0.5">
                                                    Pickup Address
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end gap-2 md:gap-4 md:pl-4">
                                        <div className="flex items-center gap-2 text-sm order-2 md:order-1">
                                            <Button variant="link" className="p-0 h-auto text-primary underline-offset-4 hover:underline">
                                                Edit
                                            </Button>
                                            {!address.isDefault && (
                                                <Button variant="link" className="p-0 h-auto text-destructive underline-offset-4 hover:underline">
                                                    Delete
                                                </Button>
                                            )}
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-gray-600 font-normal order-1 md:order-2"
                                            disabled={address.isDefault}
                                        >
                                            Set as default
                                        </Button>
                                    </div>
                                </div>
                                {index < MOCK_ADDRESSES.length - 1 && (
                                    <Separator className="mt-6" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
