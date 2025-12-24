import { useParams, useSearchParams, Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight, Home } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function PaymentSuccessPage() {
    const { orderCode } = useParams<{ orderCode: string }>();
    const [searchParams] = useSearchParams();

    const status = searchParams.get("status");
    const transactionId = searchParams.get("id");

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    Payment Successful!
                </h1>

                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your payment has been processed successfully.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Order Code</span>
                        <span className="font-semibold text-gray-900">{orderCode}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className="font-semibold text-green-600">{status || "PAID"}</span>
                    </div>
                    {transactionId && (
                        <div className="flex justify-between">
                            <span className="text-gray-500">Transaction ID</span>
                            <span className="font-mono text-sm text-gray-700">{transactionId.slice(0, 16)}...</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <Link to="/user/purchase">
                        <Button className="w-full bg-black hover:bg-black/90 h-12 text-base">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            View My Orders
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link to="/">
                        <Button variant="outline" className="w-full h-12 text-base">
                            <Home className="mr-2 h-5 w-5" />
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
