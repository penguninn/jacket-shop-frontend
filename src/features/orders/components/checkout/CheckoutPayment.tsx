import { useEffect } from "react";
import { usePaymentMethods } from "@/features/payment-methods/hooks";

interface CheckoutPaymentProps {
    selectedMethodId: number | null;
    onChange: (id: number) => void;
}

export function CheckoutPayment({ selectedMethodId, onChange }: CheckoutPaymentProps) {
    const { data: paymentData } = usePaymentMethods({ page: 1, size: 100 });
    const paymentMethods = paymentData?.contents || [];

    useEffect(() => {
        if (!selectedMethodId && paymentMethods.length > 0) {
            onChange(paymentMethods[0].id);
        }
    }, [paymentMethods, selectedMethodId, onChange]);

    return (
        <div className="bg-white p-6 shadow-sm rounded-sm">
            <div className="flex items-start gap-4">
                <h2 className="text-lg font-medium w-48">Payment Method</h2>
                <div className="flex-1 flex flex-wrap gap-2">
                    {paymentMethods.map(method => (
                        <button
                            key={method.id}
                            onClick={() => onChange(method.id)}
                            className={`px-4 py-2 border rounded-sm text-sm font-medium transition-colors ${selectedMethodId === method.id
                                    ? "border-red-500 text-red-500 bg-red-50"
                                    : "border-gray-200 hover:border-red-500 hover:text-red-500"
                                }`}
                        >
                            {method.name}
                            {selectedMethodId === method.id && (
                                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 clip-triangle-corner"></span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
            {/* Dynamic description based on selection */}
            <div className="mt-6 border-t pt-6">
                <div className="flex gap-4">
                    <div className="w-full">
                        <label className="text-gray-500 block mb-2 font-medium">Payment Details</label>
                        {selectedMethodId && paymentMethods.find(m => m.id === selectedMethodId)?.name.toLowerCase().includes("bank") ? (
                            <div className="bg-blue-50 p-4 rounded text-sm text-blue-700">
                                Please transfer to: <br />
                                Bank: MB Bank <br />
                                Account: 999999999 <br />
                                Content: ORDER_ID
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">
                                Pay when you receive the items.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
