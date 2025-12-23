
import { useState } from "react";
import { PurchaseTabs } from "@/features/orders/components/purchase/PurchaseTabs";
import { PurchaseOrderList } from "@/features/orders/components/purchase/PurchaseOrderList";
import { useMyOrders } from "@/features/orders/hooks";
import { Loader2 } from "lucide-react";

export default function PurchasePage() {
    const [activeTab, setActiveTab] = useState("all");

    const getStatusFromTab = (tab: string) => {
        switch (tab) {
            case "to_pay":
                return "PENDING"; // Assuming PENDING implies waiting for payment/procesing
            case "to_ship":
                return "CONFIRMED";
            case "to_receive":
                return "SHIPPING";
            case "completed":
                return "COMPLETED";
            case "cancelled":
                return "CANCELLED";
            case "return_refund":
                return "RETURNED";
            default:
                return undefined;
        }
    };

    const status = getStatusFromTab(activeTab);
    const { data: orders, isLoading } = useMyOrders(status);

    return (
        <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
            <div className="border-b px-6 py-4">
                <h2 className="text-lg font-medium">My Purchases</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    View and track your order history
                </p>
            </div>
            <div className="flex-1 p-6">
                <div className="flex flex-col h-full bg-gray-50">
                    <PurchaseTabs currentTab={activeTab} onTabChange={setActiveTab} />

                    <div className="flex-1 p-0 mt-4 overflow-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <PurchaseOrderList orders={orders || []} isLoading={isLoading} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
