import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { XCircle, ShoppingBag, Home, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useCancelPayOSOrder } from "@/features/payos/hooks";

export default function PaymentCancelPage() {
    const { orderCode } = useParams<{ orderCode: string }>();
    const [searchParams] = useSearchParams();

    const payosOrderCode = searchParams.get("orderCode"); // PayOS orderCode from query params
    const status = searchParams.get("status");

    const [isCancelling, setIsCancelling] = useState(true);
    const [cancelError, setCancelError] = useState<string | null>(null);
    const [cancelled, setCancelled] = useState(false);

    const { mutateAsync: cancelPayOSOrder } = useCancelPayOSOrder();

    useEffect(() => {
        // Use payosOrderCode from query params (this is the order ID that PayOS returns)
        const orderIdToCanel = payosOrderCode ? parseInt(payosOrderCode, 10) : null;

        if (!orderIdToCanel) {
            setIsCancelling(false);
            return;
        }

        const cancelOrder = async () => {
            try {
                // Call backend API to cancel the order in database
                await cancelPayOSOrder(orderIdToCanel);
                setCancelled(true);
            } catch (error) {
                console.error("Error cancelling order:", error);
                setCancelError("Could not cancel order. It may have already been cancelled.");
            } finally {
                setIsCancelling(false);
            }
        };

        cancelOrder();
    }, [payosOrderCode, cancelPayOSOrder]);

    // Loading state
    if (isCancelling) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="mb-6 flex justify-center">
                        <Loader2 className="w-16 h-16 text-gray-400 animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        Cancelling your order...
                    </h1>
                    <p className="text-gray-600">
                        Please wait while we process the cancellation.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                        {cancelError ? (
                            <AlertCircle className="w-12 h-12 text-orange-600" />
                        ) : (
                            <XCircle className="w-12 h-12 text-red-600" />
                        )}
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {cancelError ? "Cancellation Issue" : "Payment Cancelled"}
                </h1>

                <p className="text-gray-600 mb-6">
                    {cancelError
                        ? cancelError
                        : cancelled
                            ? `Your order #${orderCode} has been cancelled successfully.`
                            : "The payment transaction was cancelled."
                    }
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Order Code</span>
                        <span className="font-semibold text-gray-900">{orderCode}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className="font-semibold text-red-600">
                            {cancelled ? "CANCELLED" : (status || "CANCELLED")}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Link to="/search">
                        <Button className="w-full bg-[#FF6900] hover:bg-[#F54900] h-12 text-base">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Continue Shopping
                        </Button>
                    </Link>
                    <Link to="/user/purchase">
                        <Button variant="outline" className="w-full h-12 text-base">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            View My Orders
                        </Button>
                    </Link>
                    <Link to="/">
                        <Button variant="ghost" className="w-full h-12 text-base">
                            <Home className="mr-2 h-5 w-5" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
