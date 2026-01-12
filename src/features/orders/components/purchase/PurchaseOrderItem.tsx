import { Button } from "@/shared/ui/button";
import type { Order } from "@/features/orders/model/schemas";
import { Truck, CreditCard, Banknote } from "lucide-react";
import { formatCurrency } from "@/shared/utils/format";
import { useCancelOrder, useReceiveOrder, useReorder } from "@/features/orders/hooks";
import { useCreatePaymentLink } from "@/features/payos/hooks";
import { toast } from "sonner";
import { Badge } from "@/shared/ui/badge";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog";

interface PurchaseOrderItemProps {
    order: Order;
}

// Payment status badge config
const paymentStatusConfig = {
    PAID: { label: "Paid", variant: "default" as const, className: "bg-green-500 hover:bg-green-500" },
    UNPAID: { label: "Unpaid", variant: "destructive" as const, className: "bg-red-500 hover:bg-red-500" },
    REFUNDED: { label: "Refunded", variant: "secondary" as const, className: "bg-gray-500 hover:bg-gray-500" },
};

export function PurchaseOrderItem({ order }: PurchaseOrderItemProps) {
    const cancelOrder = useCancelOrder();
    const receiveOrder = useReceiveOrder();
    const reorder = useReorder();
    const { mutate: createPaymentLink, isPending: isCreatingPaymentLink } = useCreatePaymentLink();

    const handleCancel = () => {
        cancelOrder.mutate(order.id, {
            onError: (error) => toast.error("Failed to cancel order: " + error.message),
        });
    };

    const handleReceive = () => {
        receiveOrder.mutate(order.id, {
            onError: (error) => toast.error("Failed to confirm receipt: " + error.message),
        });
    };

    const handleReorder = () => {
        reorder.mutate(order.id, {
            onError: (error) => toast.error("Failed to reorder: " + error.message),
        });
    };

    const paymentStatusInfo = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.UNPAID;

    return (
        <div className="bg-white rounded-sm shadow-sm mb-4">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    {/* Payment Method */}
                    <div className="flex items-center gap-1 text-gray-600 border-r pr-2 mr-2">
                        <Banknote className="w-4 h-4" />
                        <span>{order.paymentMethodName || "Payment"}</span>
                    </div>

                    {/* Payment Status Badge */}
                    <Badge className={paymentStatusInfo.className}>
                        <CreditCard className="w-3 h-3 mr-1" />
                        {paymentStatusInfo.label}
                    </Badge>

                    {order.status === "SHIPPING" && (
                        <div className="flex items-center gap-1 text-green-500">
                            <Truck className="w-4 h-4" /> <span>Shipping</span>
                        </div>
                    )}
                    <div className="border-l pl-2 ml-2 text-[#FF6900] uppercase font-medium">
                        {order.status}
                    </div>
                </div>
            </div>

            {/* Products */}
            <div>
                {order.details?.map((detail) => (
                    <div key={detail.id} className="flex p-4 border-b last:border-b-0 gap-4">
                        <div className="flex-1">
                            <h3 className="text-base mb-1 line-clamp-2">{detail.productName}</h3>
                            <div className="text-gray-500 text-sm">
                                Variation: {detail.color}, {detail.size}
                            </div>
                            <div className="text-sm mt-1">x{detail.quantity}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#FF6900] font-medium">
                                {formatCurrency(detail.price)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total and Actions */}
            <div className="p-6 bg-[#fffefb]">
                <div className="flex justify-end items-center gap-2 mb-6">
                    <span className="text-sm text-gray-800">Order Total:</span>
                    <span className="text-xl font-medium text-[#FF6900]">
                        {formatCurrency(order.total)}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-gray-500 text-xs w-1/2">
                        {order.status === "SHIPPING" && "Confirm receipt after you've checked the received items"}
                    </div>
                    <div className="flex gap-2 justify-end flex-1">
                        {order.status === "SHIPPING" && (
                            <Button
                                onClick={handleReceive}
                                disabled={receiveOrder.isPending}
                                className="bg-[#FF6900] hover:bg-[#F54900] text-white min-w-[150px]"
                            >
                                Order Received
                            </Button>
                        )}

                        {(order.status === "COMPLETED" || order.status === "CANCELLED") && (
                            <Button
                                onClick={handleReorder}
                                disabled={reorder.isPending}
                                className="bg-[#FF6900] hover:bg-[#F54900] text-white min-w-[150px]"
                            >
                                Buy Again
                            </Button>
                        )}

                        {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                                        Cancel Order
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Cancel Order</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to cancel this order? This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">No, Keep it</Button>
                                        </DialogClose>
                                        <Button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white">
                                            Yes, Cancel it
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                        {(order.paymentStatus === "UNPAID" && order.paymentMethodCode === "QR" && order.status !== "CANCELLED" && order.status !== "COMPLETED") && (
                            <Button
                                onClick={() => {
                                    createPaymentLink(order.id, {
                                        onSuccess: (paymentLink) => {
                                            window.location.href = paymentLink.checkoutUrl;
                                        }
                                    });
                                }}
                                disabled={isCreatingPaymentLink}
                                className="bg-blue-600 hover:bg-blue-700 text-white min-w-[150px]"
                            >
                                {isCreatingPaymentLink ? "Processing..." : "Pay Now"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

