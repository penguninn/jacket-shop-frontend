
import { useState } from "react";
import { OrderStatsTabs } from "../../components/admin/OrderStatsTabs";
import { OrderTable } from "../../components/admin/OrderTable";
import type { OrderStatus } from "@/features/orders/model/schemas";

export default function OrderManagementPage() {
    const [activeTab, setActiveTab] = useState<OrderStatus>("PENDING");

    return (
        <div className="container mx-auto py-8 flex flex-col gap-4">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Order Management</h1>
                    <p className="text-muted-foreground">
                        Manage your order catalog
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border">
                <OrderStatsTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <div className="p-4">
                    <OrderTable status={activeTab} />
                </div>
            </div>
        </div>

    );
}
