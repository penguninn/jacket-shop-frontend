
import { PurchaseOrderItem } from "./PurchaseOrderItem";
import type { Order } from "@/features/orders/model/schemas";

interface PurchaseOrderListProps {
    orders: Order[];
    isLoading?: boolean;
}

export function PurchaseOrderList({ orders }: PurchaseOrderListProps) {
    return (
        <div className="space-y-4">
            {orders.length === 0 ? (
                <div className="bg-white rounded-sm h-[400px] flex flex-col items-center justify-center gap-4 shadow-sm">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-4xl">
                        📄
                    </div>
                    <div className="text-gray-500">No orders yet</div>
                </div>
            ) : (
                orders.map(order => (
                    <PurchaseOrderItem key={order.id} order={order} />
                ))
            )}
        </div>
    );
}
