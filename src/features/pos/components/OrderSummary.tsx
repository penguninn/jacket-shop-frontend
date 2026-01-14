import { Separator } from "@/shared/ui/separator";
import { Button } from "@/shared/ui/button";
import { Banknote, ArrowRight, Loader2, QrCode } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import type { Order } from "../model/schemas";
import { formatCurrency } from "@/shared/utils/format";
import { useCompletePosOrder, useUpdatePosPayment, useCancelPosDraft } from "../hooks";
import { usePaymentMethods } from "@/features/payment-methods/hooks";
import type { PaymentMethod } from "@/features/payment-methods/model";
import { useEffect, useState, useCallback } from "react";

interface OrderSummaryProps {
    activeDraft: Order | undefined;
}

export function OrderSummary({ activeDraft }: OrderSummaryProps) {
    const { mutate: completeOrder, isPending: isCompleting } = useCompletePosOrder();
    const { mutate: updatePayment, isPending: isUpdatingPayment } = useUpdatePosPayment();
    const { mutate: cancelDraft, isPending: isCancelling } = useCancelPosDraft();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

    const { data: paymentData, isLoading } = usePaymentMethods({
        page: 0,
        size: 100,
        status: ["ACTIVE"],
        sortBy: "id",
        sortDir: "desc",
        type: ["POS"]
    });
    const paymentMethods = paymentData?.contents || [];

    useEffect(() => {
        if (!activeDraft) {
            setSelectedPaymentMethod(null);
            return;
        }

        if (activeDraft.paymentMethodId) {
            const method = paymentMethods.find(m => m.id === activeDraft.paymentMethodId);
            if (method) {
                setSelectedPaymentMethod(method);
            }
        } else if (paymentMethods.length > 0 && !selectedPaymentMethod) {
            handlePaymentMethodSelect(paymentMethods[0]);
        }
    }, [activeDraft?.id, activeDraft?.paymentMethodId, paymentMethods.length]);

    const handlePaymentMethodSelect = useCallback((method: PaymentMethod) => {
        if (!activeDraft) return;

        setSelectedPaymentMethod(method);

        updatePayment({
            id: activeDraft.id,
            data: {
                paymentMethodId: method.id,
                paymentStatus: "UNPAID"
            }
        });
    }, [activeDraft, selectedPaymentMethod, updatePayment]);

    const handleCompleteOrder = useCallback(() => {
        if (!activeDraft) return;

        completeOrder(activeDraft.id, {
            onSuccess: () => {

            }
        });
    }, [activeDraft, completeOrder]);

    const handleCancelDraft = useCallback(() => {
        if (!activeDraft) return;

        cancelDraft(activeDraft.id);
    }, [activeDraft, cancelDraft]);

    const canComplete = useCallback(() => {
        if (!activeDraft) return false;
        if (itemCount === 0) return false;
        if (!activeDraft.paymentMethodId) return false;
        return true;
    }, [activeDraft]);

    const getPaymentIcon = (method: PaymentMethod) => {
        const iconClass = "mr-2 h-4 w-4";
        switch (method.code) {
            case 'CASH':
                return <Banknote className={iconClass} />;
            case 'QR_INSTORE':
                return <QrCode className={iconClass} />;
            default:
                return <Banknote className={iconClass} />;
        }
    };

    const subtotal = activeDraft?.subtotal || 0;
    const discount = activeDraft?.discount || 0;
    const shippingFee = activeDraft?.shippingFee || 0;
    const total = activeDraft?.total || 0;
    const itemCount = activeDraft?.details?.length || 0;

    if (!activeDraft) {
        return (
            <div className="bg-background border rounded-lg shadow-sm p-4 flex items-center justify-center text-muted-foreground h-[300px]">
                No draft selected
            </div>
        );
    }

    return (
        <div className="bg-background border rounded-lg shadow-sm p-4 space-y-4 h-full flex flex-col">
            <h3 className="font-semibold text-lg">Order Summary</h3>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                {shippingFee > 0 && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping Fee</span>
                        <span>{formatCurrency(shippingFee)}</span>
                    </div>
                )}

                {discount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
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

            <div className="space-y-2 flex-1 overflow-y-auto">
                <label className="text-sm font-medium">
                    Payment Method
                </label>

                {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                ) : paymentMethods.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-4 bg-muted/50 rounded">
                        No payment methods available
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2 py-2">
                        {paymentMethods.map((method) => (
                            <Button
                                key={method.id}
                                variant={selectedPaymentMethod?.id === method.id ? "default" : "outline"}
                                className={cn(
                                    "justify-start h-auto py-3 px-4",
                                    selectedPaymentMethod?.id === method.id && "border-primary"
                                )}
                                disabled={isUpdatingPayment}
                                onClick={() => handlePaymentMethodSelect(method)}
                            >
                                {getPaymentIcon(method)}
                                {method.name}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2 mt-auto">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex-1"
                            disabled={isCancelling || isCompleting}
                        >
                            Cancel
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Draft?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to cancel this draft? All items will be removed.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>No, keep draft</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleCancelDraft}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Yes, cancel draft
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            className="flex-1"
                            disabled={!canComplete() || isCompleting}
                            title={!canComplete() ? "Add items and select payment method" : "Complete order (Ctrl+Enter)"}
                        >
                            {isCompleting ? (
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
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Complete Order?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to complete this order for <strong>{formatCurrency(total)}</strong>?
                                {!activeDraft.userId && (
                                    <span className="block mt-2 text-amber-600">
                                        No customer selected (Please select a customer)
                                    </span>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleCompleteOrder}>
                                Yes, complete order
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}