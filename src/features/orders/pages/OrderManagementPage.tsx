
import { useState } from "react";
import { OrderFilter } from "../components/admin/OrderFilter";
import { OrderStatsTabs } from "../components/admin/OrderStatsTabs";
import { OrderTable } from "../components/admin/OrderTable";

export default function OrderManagementPage() {
    const [activeTab, setActiveTab] = useState("all");

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
            </div>

            <OrderFilter />

            <div className="bg-white rounded-sm shadow-sm border overflow-hidden">
                <OrderStatsTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <div className="p-0">
                    <OrderTable />
                </div>
            </div>

            {/* Pagination (Placeholder) */}
            <div className="flex justify-between items-center bg-white p-4 border rounded-sm">
                <div className="text-sm text-gray-500">
                    Showing 1-5 of 100 results
                </div>
                <div className="flex gap-2">
                    {/* Pagination buttons */}
                </div>
            </div>
        </div>
    );
}
