import { Truck, Plus, Loader2 } from "lucide-react";
import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";
import { usePosStore } from "../hooks/usePosState";
import { Textarea } from "@/shared/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { Button } from "@/shared/ui/button";
import { useUserAddresses, useCreateUserAddress } from "@/features/address/hooks";
import { useState } from "react";
import type { AddressResponse } from "@/features/address/model/schemas";
import { useShippingRates } from "@/features/shipping/hooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { AddressDialog } from "@/features/address/components/AddressDialog";
import { formatCurrency } from "@/shared/utils/format";
import { useUpdatePosDraftShipping } from "../hooks/usePosApi";
import { toast } from "sonner";

export function ShippingSection() {
    const { currentDraft, setCurrentDraft } = usePosStore();
    const { mutate: updateShipping, isPending: isUpdating } = useUpdatePosDraftShipping();

    const [isRatesDialogOpen, setIsRatesDialogOpen] = useState(false);
    const [isCreateAddressOpen, setIsCreateAddressOpen] = useState(false);
    const [availableRates, setAvailableRates] = useState<any[]>([]);

    const createUserAddress = useCreateUserAddress();
    const { mutate: getRates, isPending: isLoadingRates } = useShippingRates();

    const selectedUserId = currentDraft?.userId;
    // Call hook unconditionally
    const { data: addresses } = useUserAddresses(selectedUserId || null);

    if (!currentDraft) {
        return (
            <div className="bg-background border rounded-lg shadow-sm p-4 opacity-50 pointer-events-none">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Truck className="h-4 w-4" /> Shipping
                    </h3>
                    <Switch disabled />
                </div>
            </div>
        );
    }

    const shippingEnabled = currentDraft.orderType === "POS_DELIVERY";
    // selectedUserId is defined above
    const shippingAddressLine = currentDraft.shippingAddressLine;
    const items = currentDraft.details || [];
    const shippingFee = currentDraft.shippingFee || 0;
    const shippingCarrierName = currentDraft.carrierName; // Note: carrierServiceName in backend
    const shippingService = currentDraft.carrierServiceName;

    // Fetch addresses hook moved to top

    const toggleShipping = (enabled: boolean) => {
        const orderType = enabled ? "POS_DELIVERY" : "POS_INSTORE";

        updateShipping({
            id: currentDraft.id,
            data: {
                orderType,
                // Reset shipping fee if disabled
                shippingFee: enabled ? shippingFee : 0,
            }
        }, {
            onSuccess: (updated) => {
                setCurrentDraft(updated);
                toast.success(enabled ? "Shipping enabled" : "Shipping disabled");
            },
            onError: () => {
                toast.error("Failed to update shipping mode");
            }
        });
    };

    const handleAddressSelect = (addressId: string) => {
        const addr = addresses?.find(a => a.id.toString() === addressId);
        if (addr) {
            // 1. Update backend with address info
            const addressString = `${addr.addressLine}, ${addr.ward?.name}, ${addr.district?.name}, ${addr.province?.name}`;

            updateShipping({
                id: currentDraft.id,
                data: {
                    shippingAddressLine: addressString,
                    shippingProvinceCode: addr.province?.goShipId,
                    shippingDistrictCode: addr.district?.goShipId,
                    shippingWardCode: addr.ward?.goShipId,
                    shippingRecipientName: addr.recipientName || undefined,
                    shippingRecipientPhone: addr.recipientPhone || undefined,
                    addressId: addr.id,
                }
            }, {
                onSuccess: (updated) => {
                    setCurrentDraft(updated);
                    // 2. Trigger calculation
                    calculateShipping(addr);
                }
            });
        }
    };

    const calculateShipping = (addr: AddressResponse) => {
        if (!addr.district || !addr.province) return;

        const payload = {
            shipment: {
                address_from: {
                    district: "103000", // Store district (e.g., Hanoi)
                    city: "100000"     // Store city
                },
                address_to: {
                    district: addr.district.goShipId,
                    city: addr.province.goShipId
                },
                parcel: {
                    cod: 0,
                    amount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    width: 10, height: 10, length: 10, weight: 1000 // default or sum
                }
            }
        };

        getRates(payload, {
            onSuccess: (rates) => {
                setAvailableRates(rates);
                if (rates && rates.length > 0) {
                    // Auto select first
                    handleRateSelect(rates[0]);
                } else {
                    toast.warning("No shipping rates found");
                }
            },
            onError: () => {
                setAvailableRates([]);
                toast.error("Failed to calculate rates");
            }
        });
    };

    const handleRateSelect = (rate: any) => {
        updateShipping({
            id: currentDraft.id,
            data: {
                shippingFee: rate.total_fee,
                carrierName: rate.carrier_name,
                carrierServiceName: rate.service, // Map service name
            }
        }, {
            onSuccess: (updated) => {
                setCurrentDraft(updated);
                setIsRatesDialogOpen(false);
            }
        });
    };

    const saveNote = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        const note = e.target.value;
        if (note !== currentDraft.note) {
            updateShipping({
                id: currentDraft.id,
                data: { note }
            }, {
                onSuccess: (updated) => setCurrentDraft(updated)
            });
        }
    };

    return (
        <div className="bg-background border rounded-lg shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Truck className="h-4 w-4" /> Shipping
                </h3>
                <div className="flex items-center gap-2">
                    <Label htmlFor="shipping-mode" className="text-xs">Ship to Customer</Label>
                    <Switch
                        id="shipping-mode"
                        checked={shippingEnabled}
                        onCheckedChange={toggleShipping}
                        disabled={isUpdating}
                    />
                </div>
            </div>

            {shippingEnabled && (
                <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {!selectedUserId ? (
                        <div className="p-3 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-md text-sm">
                            Please select a customer to enable shipping.
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label className="text-xs">Delivery Address</Label>
                                <div className="flex gap-2">
                                    <Select
                                        defaultValue={""}
                                        onValueChange={handleAddressSelect}
                                    >
                                        <SelectTrigger className="flex-1 min-w-0 [&>span]:truncate text-left">
                                            <SelectValue placeholder={shippingAddressLine || "Select address"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {addresses?.map(addr => (
                                                <SelectItem key={addr.id} value={addr.id.toString()}>
                                                    {addr.recipientName} - {addr.recipientPhone} ({addr.addressLine}, {addr.ward?.name}, {addr.district?.name}, {addr.province?.name})
                                                </SelectItem>
                                            ))}
                                            {(!addresses || addresses.length === 0) && (
                                                <div className="p-2 text-xs text-muted-foreground text-center">No addresses found</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        title="Add New Address"
                                        onClick={() => setIsCreateAddressOpen(true)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>

                                    <AddressDialog
                                        open={isCreateAddressOpen}
                                        onOpenChange={setIsCreateAddressOpen}
                                        onSubmit={(data) => {
                                            if (selectedUserId) {
                                                createUserAddress.mutate({ userId: selectedUserId, data }, {
                                                    onSuccess: () => {
                                                        setIsCreateAddressOpen(false);
                                                    }
                                                });
                                            }
                                        }}
                                        isLoading={createUserAddress.isPending}
                                        title="Add Customer Address"
                                    />
                                </div>
                            </div>

                            {/* Shipping Option UI */}
                            {isLoadingRates ? (
                                <div className="flex justify-between items-start border-l border-dashed pl-4 ml-2 py-2">
                                    <div className="flex-1 flex items-center gap-2">
                                        <Loader2 className="animate-spin w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-500">Calculating shipping...</span>
                                    </div>
                                </div>
                            ) : availableRates.length > 0 ? (
                                <div className="flex justify-between items-start border-l border-dashed pl-4 ml-2 py-2">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-teal-600 text-sm">Shipping Option:</span>
                                            <div className="flex gap-2 items-center">
                                                <span className="font-bold text-sm">{shippingCarrierName || "Standard"}</span>
                                                <Dialog open={isRatesDialogOpen} onOpenChange={setIsRatesDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" className="text-blue-500 font-medium uppercase text-xs h-auto p-0 hover:bg-transparent hover:text-blue-600">Change</Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Select Shipping Method</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                                                            {availableRates.map(rate => (
                                                                <div key={rate.id} className="flex items-center space-x-2 border p-3 rounded hover:bg-gray-50 cursor-pointer" onClick={() => handleRateSelect(rate)}>
                                                                    <input
                                                                        type="radio"
                                                                        checked={shippingFee === rate.total_fee && shippingCarrierName === rate.carrier_name}
                                                                        readOnly
                                                                        className="w-4 h-4 text-red-600"
                                                                    />
                                                                    <div className="flex-1">
                                                                        <div className="font-medium flex items-center gap-2 text-sm">
                                                                            {rate.carrier_logo && <img src={rate.carrier_logo} alt={rate.carrier_name} className="h-4 w-auto" />}
                                                                            {rate.carrier_name} - {rate.service}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">Expected: {rate.expected}</div>
                                                                    </div>
                                                                    <div className="font-bold text-red-500 text-sm">
                                                                        {formatCurrency(rate.total_fee)}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mb-1">
                                            {shippingService}
                                        </div>
                                    </div>
                                    <div className="text-sm font-medium ml-4 w-24 text-right">
                                        {formatCurrency(shippingFee)}
                                    </div>
                                </div>
                            ) : shippingAddressLine && (
                                <div className="flex justify-between items-start border-l border-dashed pl-4 ml-2 py-2">
                                    <div className="flex-1">
                                        <span className="text-sm text-gray-500">No rates available for this address.</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <Label className="text-xs">Order Note</Label>
                                <Textarea
                                    className="min-h-[2.25rem] h-9 py-1 text-xs resize-none"
                                    placeholder="Note..."
                                    defaultValue={currentDraft.note || ""}
                                    onBlur={saveNote}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

