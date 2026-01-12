
import { cn } from "@/shared/lib/utils";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";

import { ORDER_STATUS, type OrderStatus } from "../../model";

const STATUS_TABS = [
    { id: ORDER_STATUS.ALL, label: "ALL" },
    { id: ORDER_STATUS.PENDING, label: "PENDING" },
    { id: ORDER_STATUS.CONFIRMED, label: "CONFIRMED" },
    { id: ORDER_STATUS.SHIPPING, label: "DELIVERING" },
    { id: ORDER_STATUS.COMPLETED, label: "COMPLETED" },
    { id: ORDER_STATUS.CANCELLED, label: "CANCELLED" },
    { id: ORDER_STATUS.RETURNED, label: "RETURNED" },
];

interface OrderStatsTabsProps {
    activeTab: OrderStatus;
    onTabChange: (tabId: OrderStatus) => void;
}

export function OrderStatsTabs({ activeTab, onTabChange }: OrderStatsTabsProps) {
    return (
        <ScrollArea className="w-full whitespace-nowrap bg-white border-b">
            <div className="flex w-max space-x-4 p-4">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-orange-600 pb-2 border-b-2",
                            activeTab === tab.id
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
