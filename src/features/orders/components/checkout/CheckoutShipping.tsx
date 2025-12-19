import { useState, useEffect } from "react";
import { useShippingMethods } from "@/features/shipping-methods/hooks";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import type { ShippingMethod } from "@/features/shipping-methods/model";

interface CheckoutShippingProps {
    selectedMethodId: number | null;
    onSelect: (method: ShippingMethod) => void;
}

export function CheckoutShipping({ selectedMethodId, onSelect }: CheckoutShippingProps) {
    const { data: shippingData } = useShippingMethods({ page: 1, size: 100 });
    const shippingMethods = shippingData?.contents || [];

    const [isOpen, setIsOpen] = useState(false);

    const selectedMethod = shippingMethods.find(m => m.id === selectedMethodId);

    // Auto-select first if none selected
    useEffect(() => {
        if (!selectedMethodId && shippingMethods.length > 0) {
            onSelect(shippingMethods[0]);
        }
    }, [shippingMethods, selectedMethodId, onSelect]);

    // Format helper
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <div className="flex justify-between items-start border-l border-dashed pl-6 ml-6 py-2 w-1/2">
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-teal-600">Shipping Option:</span>
                    <div className="flex gap-4">
                        <span className="font-bold">{selectedMethod?.name || "Standard"}</span>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="text-blue-500 font-medium uppercase text-sm h-auto p-0 hover:bg-transparent hover:text-blue-600">Change</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Select Shipping Method</DialogTitle>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                    {shippingMethods.map(method => (
                                        <div key={method.id} className="flex items-center space-x-2 border p-3 rounded hover:bg-gray-50 cursor-pointer" onClick={() => { onSelect(method); setIsOpen(false); }}>
                                            <input
                                                type="radio"
                                                checked={selectedMethodId === method.id}
                                                readOnly
                                                className="w-4 h-4 text-red-600"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{method.name}</div>
                                                <div className="text-xs text-gray-500">{method.description}</div>
                                            </div>
                                            <div className="font-bold text-red-500">
                                                {formatPrice(method.fee ?? 30000)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="text-sm text-gray-500 mb-1">
                    Guaranteed delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
                </div>
                <div className="text-xs text-gray-400">
                    Receive ₫15.000 voucher if order arrives late
                </div>
            </div>
            <div className="text-sm font-medium ml-4 w-24 text-right">
                {selectedMethod ? formatPrice(selectedMethod.fee ?? 30000) : formatPrice(0)}
            </div>
        </div>
    );
}
