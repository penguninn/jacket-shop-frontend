
import { X, ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { PosOrderDraft } from "../types";

interface PosOrderTabsProps {
    orders: PosOrderDraft[];
    activeOrderId: string;
    onSelectOrder: (id: string) => void;
    onCloseOrder: (id: string) => void;
    onCreateOrder: () => void;
}

export function PosOrderTabs({
    orders,
    activeOrderId,
    onSelectOrder,
    onCloseOrder,
    onCreateOrder
}: PosOrderTabsProps) {
    return (
        <div className="flex items-center gap-2 border-b px-4 pt-2">
            {orders.map((order) => (
                <div
                    key={order.id}
                    className={cn(
                        "group flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer border-t-2 border-x border-b-0 rounded-t-md transition-colors min-w-[160px] relative",
                        activeOrderId === order.id
                            ? "bg-white border-t-blue-600 text-blue-600"
                            : "bg-gray-50 border-transparent hover:bg-gray-100 text-gray-600"
                    )}
                    onClick={() => onSelectOrder(order.id)}
                >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="flex-1 truncate">{order.name}</span>
                    <div className="flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full font-bold">
                        {order.items.length}
                    </div>
                    {/* Only show close button if there's more than one order or to allow closing the last one (depends on logic, usually allow closing any) */}
                    <button
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-500 rounded-full transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCloseOrder(order.id);
                        }}
                    >
                        <X className="w-3 h-3" />
                    </button>

                    {/* Active Indicator Line (redundant with border-t but good for clarity) */}
                    {activeOrderId === order.id && (
                        <div className="absolute bottom-[-1px] left-0 right-0 h-[1px] bg-white" />
                    )}
                </div>
            ))}

            <Button
                variant="ghost"
                size="sm"
                className="gap-1 ml-2 text-primary hover:bg-primary/10"
                onClick={onCreateOrder}
            >
                <Plus className="w-4 h-4" />
                New Order
            </Button>
        </div>
    );
}
