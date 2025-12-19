
import { useState } from "react";
import { PurchaseTabs } from "@/features/orders/components/purchase/PurchaseTabs";
import { PurchaseOrderList } from "@/features/orders/components/purchase/PurchaseOrderList";
import type { PurchaseOrder } from "@/features/orders/components/purchase/types";

// Mock Data
const MOCK_ORDERS: PurchaseOrder[] = [
    {
        id: "1",
        shopName: "Quần Lót Boxi Boxer",
        status: "To Receive",
        isFavorite: true,
        total: 96000,
        products: [
            {
                id: 101,
                name: "[ COMBO 5C] Quần Lót Nam Boxer Thun Lạnh Kháng Khuẩn Thoáng Khí Co Giãn 4 Chiều Set 5 Màu BO01",
                image: "https://down-vi.img.susercontent.com/file/vn-11134207-7r98o-lzsl3g4658u0a8", // Placeholder or real URL if available
                variation: "2XL: 56 - 67 KG,5 Tam giác (Tối màu)",
                quantity: 1,
                originalPrice: 175000,
                salePrice: 135000,
            }
        ]
    },
    {
        id: "2",
        shopName: "Cherry - Xưởng Sản Xuất Tất Vớ",
        status: "Completed",
        isFavorite: true,
        total: 44000,
        products: [
            {
                id: 201,
                name: "Tất cổ cao nữ chất liệu cotton, họa tiết hình thêu dễ thương - Cherry Shop",
                image: "https://down-vi.img.susercontent.com/file/vn-11134207-7r98o-lx2q6y3y5y3y6y",
                variation: "XL8119-E,SET 3 Đôi",
                quantity: 2,
                originalPrice: 45000,
                salePrice: 25000,
            }
        ]
    }
];

export default function PurchasePage() {
    const [activeTab, setActiveTab] = useState("all");

    // Filter logic (mock)
    const filteredOrders = activeTab === "all"
        ? MOCK_ORDERS
        : MOCK_ORDERS.filter(order => {
            if (activeTab === "to_receive") return order.status === "To Receive";
            if (activeTab === "completed") return order.status === "Completed";
            // ... add other mappings as needed
            return false;
        });

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
                        <PurchaseOrderList orders={filteredOrders} />
                    </div>
                </div>
            </div>
        </div>
    );
}
