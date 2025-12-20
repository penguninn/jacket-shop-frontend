
import { User, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import type { PosCustomer } from "../types";

interface PosCustomerSectionProps {
    customer: PosCustomer | null;
    isDelivery: boolean;
    onSelectCustomer: () => void; // Trigger search dialog
    onToggleDelivery: (val: boolean) => void;
}

export function PosCustomerSection({
    customer,
    isDelivery,
    onSelectCustomer,
    onToggleDelivery
}: PosCustomerSectionProps) {
    return (
        <div className="bg-white rounded-sm shadow-sm border mb-4">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Customer</h3>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-orange-600 border-orange-200 hover:bg-orange-50 gap-2"
                    onClick={onSelectCustomer}
                >
                    <User className="w-4 h-4" />
                    {customer ? "Change Customer" : "Select Customer"}
                </Button>
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        {/* Avatar Placeholder */}
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                            <User className="w-6 h-6" />
                        </div>

                        <div>
                            {customer ? (
                                <>
                                    <div className="font-bold text-lg text-blue-600">{customer.name}</div>
                                    <div className="text-gray-500">{customer.phone}</div>
                                    {customer.address && <div className="text-gray-400 text-sm mt-1">{customer.address}</div>}
                                </>
                            ) : (
                                <div className="py-1">
                                    <div className="font-medium text-gray-700">Walk-in Customer</div>
                                    <div className="text-xs text-gray-400">Anonymous visitor</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Delivery</span>
                        <Switch
                            checked={isDelivery}
                            onCheckedChange={onToggleDelivery}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>
                </div>

                {/* Delivery Info Fields (Show if delivery is toggled) */}
                {isDelivery && (
                    <div className="mt-6 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="col-span-2 p-3 bg-blue-50 rounded border border-blue-100 text-blue-700 text-sm">
                            Delivery details form will appear here (Phone, Address, Note)...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
