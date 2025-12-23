import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/ui/dialog";
import { Loader2 } from "lucide-react";

interface CheckoutShippingProps {
    rates: any[]; // GoshipRateData
    selectedRate: any | null; // GoshipRateData
    onSelect: (rate: any) => void;
    isLoading?: boolean;
}

export function CheckoutShipping({ rates, selectedRate, onSelect, isLoading }: CheckoutShippingProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Auto-select first if none selected
    useEffect(() => {
        if (!selectedRate && rates.length > 0) {
            onSelect(rates[0]);
        }
    }, [rates, selectedRate, onSelect]);

    // Format helper
    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    if (isLoading) {
        return (
            <div className="flex justify-between items-start border-l border-dashed pl-6 ml-6 py-2 w-1/2">
                <div className="flex-1 flex items-center gap-2">
                    <Loader2 className="animate-spin w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Calculating shipping...</span>
                </div>
            </div>
        );
    }

    if (rates.length === 0) {
        return (
            <div className="flex justify-between items-start border-l border-dashed pl-6 ml-6 py-2 w-1/2">
                <div className="flex-1">
                    <span className="text-sm text-gray-500">Enter address to calculate shipping</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-start border-l border-dashed pl-6 ml-6 py-2 w-1/2">
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-teal-600">Shipping Option:</span>
                    <div className="flex gap-4">
                        <span className="font-bold">{selectedRate?.carrier_name || "Standard"}</span>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="text-blue-500 font-medium uppercase text-sm h-auto p-0 hover:bg-transparent hover:text-blue-600">Change</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Select Shipping Method</DialogTitle>
                                </DialogHeader>
                                <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                                    {rates.map(rate => (
                                        <div key={rate.id} className="flex items-center space-x-2 border p-3 rounded hover:bg-gray-50 cursor-pointer" onClick={() => { onSelect(rate); setIsOpen(false); }}>
                                            <input
                                                type="radio"
                                                checked={selectedRate?.id === rate.id}
                                                readOnly
                                                className="w-4 h-4 text-red-600"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium flex items-center gap-2">
                                                    {rate.carrier_logo && <img src={rate.carrier_logo} alt={rate.carrier_name} className="h-4 w-auto" />}
                                                    {rate.carrier_name} - {rate.service}
                                                </div>
                                                <div className="text-xs text-gray-500">Expected: {rate.expected}</div>
                                            </div>
                                            <div className="font-bold text-red-500">
                                                {formatPrice(rate.total_fee)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <div className="text-sm text-gray-500 mb-1">
                    Estimated delivery: {selectedRate?.expected || "N/A"}
                </div>
            </div>
            <div className="text-sm font-medium ml-4 w-24 text-right">
                {selectedRate ? formatPrice(selectedRate.total_fee) : formatPrice(0)}
            </div>
        </div>
    );
}
