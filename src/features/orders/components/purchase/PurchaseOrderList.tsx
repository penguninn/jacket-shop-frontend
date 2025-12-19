
import { PurchaseOrderItem } from "./PurchaseOrderItem";
import type { PurchaseOrder } from "./types";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";

interface PurchaseOrderListProps {
    orders: PurchaseOrder[];
    isLoading?: boolean;
}

export function PurchaseOrderList({ orders }: PurchaseOrderListProps) {
    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="bg-[#eaeaea] p-4 flex gap-2 rounded-sm mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="You can search by Seller Name, Order ID or Product name"
                        className="pl-10 bg-white border-0 shadow-none rounded-sm h-10 w-full"
                    />
                </div>
            </div>

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
