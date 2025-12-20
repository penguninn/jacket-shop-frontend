
import { useState } from "react";
import type { PosOrderDraft, PosCartItem, PosProduct, PosCustomer } from "../types";
import { PosOrderTabs } from "../components/PosOrderTabs";
import { PosProductSection } from "../components/PosProductSection";
import { PosCustomerSection } from "../components/PosCustomerSection";
import { PosPaymentSection } from "../components/PosPaymentSection";
import { Button } from "@/shared/ui/button"; // Fallback import
import { LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

// Helper to create a new draft
const createDraft = (idNum: number): PosOrderDraft => ({
    id: `order-${idNum}`,
    name: `Order ${idNum}`,
    items: [],
    customer: null,
    isDelivery: false,
    discount: 0,
    paymentMethod: "cash",
    amountPaid: 0
});

export default function PosPage() {
    const [orders, setOrders] = useState<PosOrderDraft[]>([createDraft(1)]);
    const [activeOrderId, setActiveOrderId] = useState<string>("order-1");
    const [nextId, setNextId] = useState(2);

    const activeOrder = orders.find(o => o.id === activeOrderId) || orders[0];

    // Actions
    const handleCreateOrder = () => {
        const newOrder = createDraft(nextId);
        setOrders(prev => [...prev, newOrder]);
        setActiveOrderId(newOrder.id);
        setNextId(prev => prev + 1);
    };

    const handleCloseOrder = (id: string) => {
        if (orders.length === 1) return; // Prevent closing last order
        setOrders(prev => prev.filter(o => o.id !== id));
        if (activeOrderId === id) {
            setActiveOrderId(orders[0].id); // Fallback to first
        }
    };

    // Generic updater for active order
    const updateActiveOrder = (updater: (order: PosOrderDraft) => PosOrderDraft) => {
        setOrders(prev => prev.map(o => o.id === activeOrderId ? updater(o) : o));
    };

    const handleAddItem = (product: PosProduct) => {
        updateActiveOrder(order => {
            const existing = order.items.find(i => i.id === product.id);
            let newItems;
            if (existing) {
                newItems = order.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            } else {
                newItems = [...order.items, { ...product, quantity: 1 }];
            }
            return { ...order, items: newItems };
        });
    };

    const handleUpdateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) return;
        updateActiveOrder(order => ({
            ...order,
            items: order.items.map(i => i.id === id ? { ...i, quantity } : i)
        }));
    };

    const handleRemoveItem = (id: number) => {
        updateActiveOrder(order => ({
            ...order,
            items: order.items.filter(i => i.id !== id)
        }));
    };

    // Calculated Totals
    const subtotal = activeOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = activeOrder.isDelivery ? 30000 : 0; // Mock fee

    return (
        <div className="flex flex-col w-full h-screen">
            {/* Order Tabs */}
            <PosOrderTabs
                orders={orders}
                activeOrderId={activeOrderId}
                onSelectOrder={setActiveOrderId}
                onCloseOrder={handleCloseOrder}
                onCreateOrder={handleCreateOrder}
            />

            {/* Main Content Area */}
            <div className="">
                {/* 1. Products Section */}
                <PosProductSection
                    items={activeOrder.items}
                    onAddItem={handleAddItem}
                    onRemoveItem={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                />

                {/* 2. Customer Section */}
                <PosCustomerSection
                    customer={activeOrder.customer}
                    isDelivery={activeOrder.isDelivery}
                    onSelectCustomer={() => alert("Open Customer Modal")}
                    onToggleDelivery={(val) => updateActiveOrder(o => ({ ...o, isDelivery: val }))}
                />

                {/* 3. Payment Section */}
                <PosPaymentSection
                    subtotal={subtotal}
                    discount={activeOrder.discount}
                    shippingFee={shippingFee}
                    onCheckout={() => alert(`Checkout Order ${activeOrder.name}!`)}
                />
            </div>
        </div>
    );
}
