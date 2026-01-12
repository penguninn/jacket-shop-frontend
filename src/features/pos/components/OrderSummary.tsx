import { Separator } from "@/shared/ui/separator";
import { Button } from "@/shared/ui/button";
import { Banknote, ArrowRight, CreditCard, QrCode } from "lucide-react";
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

// Dữ liệu giả cho phương thức thanh toán
const DUMMY_PAYMENT_METHODS = [
    {
        id: 1,
        name: "Cash",
        description: "Pay with cash at counter",
        icon: Banknote,
    },
    {
        id: 2,
        name: "Credit Card",
        description: "Visa, Master, JCB",
        icon: CreditCard,
    },
    {
        id: 3,
        name: "VNPay QR",
        description: "Scan QR code to pay",
        icon: QrCode,
    },
];

// Dữ liệu giả cho thông tin đơn hàng
const DUMMY_ORDER_INFO = {
    itemCount: 3,
    subtotal: "1.500.000 ₫",
    shippingFee: "30.000 ₫",
    discount: "50.000 ₫",
    total: "1.480.000 ₫",
    selectedPaymentMethodId: 1, // Giả lập đang chọn Cash
};

export function OrderSummary() {
    return (
        <div className="bg-background border rounded-lg shadow-sm p-4 space-y-4">
            <h3 className="font-semibold text-lg">Order Summary</h3>

            {/* Price Calculations */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({DUMMY_ORDER_INFO.itemCount} items)</span>
                    <span>{DUMMY_ORDER_INFO.subtotal}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span>{DUMMY_ORDER_INFO.shippingFee}</span>
                </div>

                <div className="flex justify-between items-center text-primary">
                    <span className="font-medium">Discount</span>
                    <span>-{DUMMY_ORDER_INFO.discount}</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between items-center text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">{DUMMY_ORDER_INFO.total}</span>
                </div>
            </div>

            <Separator />

            {/* Payment Method Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <div className="grid grid-cols-1 gap-2">
                    {DUMMY_PAYMENT_METHODS.map((method) => {
                        const isSelected = DUMMY_ORDER_INFO.selectedPaymentMethodId === method.id;
                        const Icon = method.icon;

                        return (
                            <button
                                key={method.id}
                                className={cn(
                                    "flex items-center gap-2 p-3 rounded-md border-2 transition-all text-left",
                                    isSelected
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                )}
                            >
                                <Icon className={cn(
                                    "h-5 w-5",
                                    isSelected ? "text-primary" : "text-muted-foreground"
                                )} />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{method.name}</p>
                                    <p className="text-xs text-muted-foreground">{method.description}</p>
                                </div>
                                {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
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
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Yes, cancel draft
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="flex-1">
                            Complete
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Complete Order?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to complete this order for <strong>{DUMMY_ORDER_INFO.total}</strong>?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>
                                Yes, complete order
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}