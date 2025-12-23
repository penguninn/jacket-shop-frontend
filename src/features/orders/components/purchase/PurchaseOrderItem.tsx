
import { Button } from "@/shared/ui/button";
import type { Order } from "@/features/orders/model/schemas";
import { Truck } from "lucide-react";
import { formatCurrency } from "@/shared/utils/format";
import { useCancelUserOrder, useReceiveOrder, useReorder } from "@/features/orders/hooks";
import { toast } from "sonner";
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

export function PurchaseOrderItem({ order }: PurchaseOrderItemProps) {
    const cancelOrder = useCancelUserOrder();
    const receiveOrder = useReceiveOrder();
    const reorder = useReorder();

    const handleCancel = () => {
        cancelOrder.mutate(order.id, {
            onSuccess: () => toast.success("Order cancelled successfully"),
            onError: (error) => toast.error("Failed to cancel order: " + error.message),
        });
    };

    const handleReceive = () => {
        receiveOrder.mutate(order.id, {
            onSuccess: () => toast.success("Order received successfully"),
            onError: (error) => toast.error("Failed to confirm receipt: " + error.message),
        });
    };

    const handleReorder = () => {
        reorder.mutate(order.id, {
            onSuccess: () => toast.success("Reorder items added to cart"),
            onError: (error) => toast.error("Failed to reorder: " + error.message),
        });
    };

    return (
        <div className="bg-white rounded-sm shadow-sm mb-4">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
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
                        <img
                            src={detail.thumbnail || detail.image || "https://placehold.co/100"}
                            alt={detail.productName}
                            className="w-20 h-20 object-cover border rounded-sm"
                        />
                        <div className="flex-1">
                            <h3 className="text-base mb-1 line-clamp-2">{detail.productName}</h3>
                            <div className="text-gray-500 text-sm">
                                Variation: {detail.color}, {detail.size}
                            </div>
                            <div className="text-sm mt-1">x{detail.quantity}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Original price logic can be added if available in schema */}
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
                        {formatCurrency(order.totalAmount)}
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

                        <Button variant="outline" className="min-w-[150px] font-normal text-gray-600">
                            Contact Seller
                        </Button>

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
                    </div>
                </div>
            </div>
        </div>
    );
}
