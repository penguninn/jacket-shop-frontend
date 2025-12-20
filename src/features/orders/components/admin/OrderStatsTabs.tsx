
import { cn } from "@/shared/lib/utils";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";

const STATUS_TABS = [
    { id: "all", label: "ALL" },
    { id: "cancelled", label: "CANCELLED" },
    { id: "pending_confirmation", label: "PENDING CONFIRMATION" },
    { id: "pending_delivery", label: "PENDING DELIVERY" },
    { id: "delivering", label: "DELIVERING" },
    { id: "delivered", label: "DELIVERED" },
    { id: "paid", label: "PAID" },
    { id: "pending_payment", label: "PENDING PAYMENT" },
    { id: "completed", label: "COMPLETED" },
];

interface OrderStatsTabsProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
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
