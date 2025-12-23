import { useEffect } from "react";
import { usePaymentMethods } from "@/features/payment-methods/hooks";

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
        type: type ? [type] : undefined
    });
    const paymentMethods = paymentData?.contents || [];

    useEffect(() => {
        // Auto-select the first method if none selected
        if (!selectedMethodId && paymentMethods.length > 0) {
            onChange(paymentMethods[0].id);
        }
    }, [paymentMethods, selectedMethodId, onChange]);

    // Parse configJson safely
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
            <div className="flex items-start gap-4">
                <h2 className="text-lg font-medium w-48">Payment Method</h2>
                <div className="flex-1 flex flex-wrap gap-2">
                    {paymentMethods.map(method => (
                        <button
                            key={method.id}
                            onClick={() => onChange(method.id)}
                            className={`px-4 py-2 border rounded-sm text-sm font-medium transition-colors relative ${selectedMethodId === method.id
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
            {selectedMethod && (
                <div className="mt-6 border-t pt-6 ml-[13rem]"> {/* Indent to align with buttons if needed, or just normal block */}
                    {/* Re-adjusting layout to match the design implied by "w-48" sidebar style for title */}
                    {/* Actually the previous code had a specific layout. Let's try to keep the description to the right or below?
                    Previous code: 
                    <div className="mt-6 border-t pt-6">
                        <div className="flex gap-4">
                             <div className="w-full"> ... </div>
                        </div>
                    </div>
                 */}

                    <div className="flex gap-4">
                        <div className="hidden sm:block w-48 shrink-0"></div> {/* Spacer to align with title if desired, or remove */}
                        <div className="flex-1">
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
                                            Please transfer to: <br />
                                            {config.bankName && <>Bank: <b>{config.bankName}</b><br /></>}
                                            {config.accountNumber && <>Account: <b>{config.accountNumber}</b><br /></>}
                                            {config.accountName && <>Name: <b>{config.accountName}</b><br /></>}
                                            Content: <b>ORDER_ID</b>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
