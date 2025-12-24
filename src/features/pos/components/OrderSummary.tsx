import { usePosStore } from "../hooks/usePosState";
import { Separator } from "@/shared/ui/separator";
import { Button } from "@/shared/ui/button";
import { Banknote, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { usePaymentMethods } from "@/features/payment-methods/hooks";
import { useCompletePosDraft, useUpdatePosDraftInfo } from "../hooks/usePosApi";
import { toast } from "sonner";
import { formatCurrency } from "@/shared/utils/format";

export function OrderSummary() {
    const { currentDraft, setCurrentDraft, clearCurrentDraft } = usePosStore();

    const { data: paymentMethodsData } = usePaymentMethods({
        page: 0,
        size: 100,
        type: ["POS"],
        status: ["ACTIVE"],
    });

    const { mutate: updateInfo } = useUpdatePosDraftInfo();
    const { mutate: completeDraft, isPending } = useCompletePosDraft();

    if (!currentDraft) {
        return (
            <div className="bg-background border rounded-lg shadow-sm p-4">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                <p className="text-sm text-muted-foreground text-center py-8">
                    No active draft
                </p>
            </div>
        );
    }

    const items = currentDraft.details || [];
    const subtotal = currentDraft.subtotal || 0;
    const shippingFee = currentDraft.shippingFee || 0;
    const discount = currentDraft.discount || 0;
    const total = currentDraft.total || 0;
    const paymentMethodId = currentDraft.paymentMethodId;

    const handlePaymentChange = (methodId: number) => {
        updateInfo({
            id: currentDraft.id,
            data: {
                paymentMethodId: methodId
            }
        }, {
            onSuccess: (updatedDraft) => {
                setCurrentDraft(updatedDraft);
            }
        });
    };

    const handleCheckout = () => {
        if (items.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        if (!paymentMethodId) {
            toast.error("Please select a payment method");
            return;
        }

        completeDraft(currentDraft.id, {
            onSuccess: () => {
                toast.success("Order completed successfully!");
                clearCurrentDraft();
            },
            onError: (error: any) => {
                toast.error("Failed to complete order", {
                    description: error.response?.data?.message || "Something went wrong"
                });
            }
        });
    };

    return (
        <div className="bg-background border rounded-lg shadow-sm p-4 space-y-4">
            <h3 className="font-semibold text-lg">Order Summary</h3>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span>{formatCurrency(shippingFee)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between items-center text-primary">
                        <span className="font-medium">Discount</span>
                        <span>-{formatCurrency(discount)}</span>
                    </div>
                )}

                <Separator className="my-2" />

                <div className="flex justify-between items-center text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(total)}</span>
                </div>
            </div>

            <Separator />

            {/* Payment Method Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <div className="grid grid-cols-1 gap-2">
                    {paymentMethodsData?.contents.map((method) => (
                        <button
                            key={method.id}
                            onClick={() => handlePaymentChange(method.id)}
                            className={cn(
                                "flex items-center gap-2 p-3 rounded-md border-2 transition-all text-left",
                                paymentMethodId === method.id
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/50"
                            )}
                        >
                            <Banknote className={cn(
                                "h-5 w-5",
                                paymentMethodId === method.id ? "text-primary" : "text-muted-foreground"
                            )} />
                            <div className="flex-1">
                                <p className="font-medium text-sm">{method.name}</p>
                                {method.description && (
                                    <p className="text-xs text-muted-foreground">{method.description}</p>
                                )}
                            </div>
                            {paymentMethodId === method.id && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => clearCurrentDraft()}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button
                    className="flex-1"
                    onClick={handleCheckout}
                    disabled={items.length === 0 || isPending}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Complete
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
