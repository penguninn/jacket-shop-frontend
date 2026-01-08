import { useEffect } from "react";
import { usePaymentMethods } from "@/features/payment-methods/hooks";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { Banknote } from "lucide-react";

interface CheckoutPaymentProps {
    selectedMethodId: number | null;
    onChange: (id: number) => void;
    type?: string;
}

export function CheckoutPayment({ selectedMethodId, onChange, type }: CheckoutPaymentProps) {
    const { data: paymentData, isLoading } = usePaymentMethods({
        page: 0,
        size: 100,
        status: ["ACTIVE"],
        sortBy: "id",
        sortDir: "asc",
        type: type ? [type] : ["ONLINE"]
    });
    const paymentMethods = paymentData?.contents || [];

    useEffect(() => {
        if (!selectedMethodId && paymentMethods.length > 0) {
            onChange(paymentMethods[0].id);
        }
    }, [paymentMethods, selectedMethodId, onChange]);

    const getPaymentConfig = (json: string | null | undefined) => {
        if (!json) return null;
        try {
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    };

    const selectedMethod = paymentMethods.find(m => m.id === selectedMethodId);

    if (isLoading) {
        return (
            <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm animate-pulse">
                <div className="h-6 w-48 bg-gray-200 mb-4 rounded"></div>
                <div className="flex gap-2 mb-6">
                    <div className="h-10 w-32 bg-gray-200 rounded"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-20 bg-gray-100 rounded"></div>
            </div>
        );
    }

    if (paymentMethods.length === 0) {
        return (
            <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm">
                <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                <p className="text-gray-500">No payment methods available.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm">
            <h2 className="text-lg font-medium mb-4">Payment Method</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((method) => (
                        <Button
                            key={method.id}
                            variant={selectedMethodId === method.id ? "default" : "outline"}
                            className={cn(
                                "justify-start h-auto py-3 px-4",
                                selectedMethodId === method.id && "border-primary"
                            )}
                            onClick={() => onChange(method.id)}
                        >
                            <Banknote className="mr-2 h-4 w-4" />
                            {method.name}
                        </Button>
                    ))}
                </div>

                {/* Dynamic description based on selection */}
                {selectedMethod && (
                    <div className="mt-4 pt-4 border-t">
                        {selectedMethod.description && (
                            <div className="text-sm text-gray-500 mb-4">
                                {selectedMethod.description}
                            </div>
                        )}

                        {(() => {
                            const config = getPaymentConfig(selectedMethod.config);
                            if (config && (config.bankName || config.accountNumber)) {
                                return (
                                    <div className="bg-blue-50 p-4 rounded text-sm text-blue-700">
                                        <div className="font-semibold mb-2">Please transfer to:</div>
                                        <div className="space-y-1">
                                            {config.bankName && <div>Bank: <b>{config.bankName}</b></div>}
                                            {config.accountNumber && <div>Account: <b>{config.accountNumber}</b></div>}
                                            {config.accountName && <div>Name: <b>{config.accountName}</b></div>}
                                            <div>Content: <b>ORDER_ID</b></div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}
