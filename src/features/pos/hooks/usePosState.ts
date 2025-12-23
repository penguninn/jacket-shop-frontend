import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PosCartItem, PosDraftOrder } from "../model/types";
import type { User } from "@/features/users/model/schemas";
import type { AddressResponse } from "@/features/address/model/schemas";

interface PosStore {
    tabs: PosDraftOrder[];
    activeTabId: string;

    // Actions
    addTab: () => void;
    removeTab: (id: string) => void;
    switchTab: (id: string) => void;
    updateTabName: (id: string, name: string) => void;

    // Current Order Actions (operates on active tab)
    setCustomer: (customer: User | null) => void;
    addItem: (item: PosCartItem) => void;
    updateItemQuantity: (itemId: string, quantity: number) => void;
    removeItem: (itemId: string) => void;
    toggleShipping: (enabled: boolean) => void;
    setShippingAddress: (address: AddressResponse | null) => void;
    setShippingFee: (fee: number) => void;
    setDiscount: (discount: number) => void;
    setPaymentMethod: (method: "CASH" | "CARD" | "POS_INSTORE") => void;
    clearCurrentOrder: () => void;
}

const createEmptyOrder = (id: string, name: string): PosDraftOrder => ({
    id,
    name,
    customer: null,
    items: [],
    shippingEnabled: false,
    shippingAddress: null,
    shippingFee: 0,
    discount: 0,
    subtotal: 0,
    total: 0,
    paymentMethod: "CASH",
});

export const usePosStore = create<PosStore>()(
    persist(
        (set, get) => ({
            tabs: [createEmptyOrder("1", "Order #1")],
            activeTabId: "1",

            addTab: () => {
                const { tabs } = get();
                if (tabs.length >= 5) return;
                const newId = crypto.randomUUID();
                const newOrder = createEmptyOrder(newId, `Order #${tabs.length + 1}`);
                set({ tabs: [...tabs, newOrder], activeTabId: newId });
            },

            removeTab: (id) => {
                const { tabs, activeTabId } = get();
                if (tabs.length === 1) {
                    // Reset the last remaining tab instead of removing it
                    const newOrder = createEmptyOrder(tabs[0].id, tabs[0].name);
                    set({ tabs: [newOrder] });
                    return;
                }
                const newTabs = tabs.filter((t) => t.id !== id);
                let newActiveId = activeTabId;
                if (id === activeTabId) {
                    newActiveId = newTabs[0].id;
                }
                set({ tabs: newTabs, activeTabId: newActiveId });
            },

            switchTab: (id) => set({ activeTabId: id }),

            updateTabName: (id, name) => {
                set((state) => ({
                    tabs: state.tabs.map((t) => (t.id === id ? { ...t, name } : t)),
                }));
            },

            setCustomer: (customer) => {
                set((state) => ({
                    tabs: state.tabs.map((t) =>
                        t.id === state.activeTabId ? { ...t, customer } : t
                    ),
                }));
            },

            addItem: (item) => {
                set((state) => {
                    const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
                    if (!activeTab) return state;

                    const existingItem = activeTab.items.find((i) => i.id === item.id);
                    let newItems;
                    if (existingItem) {
                        newItems = activeTab.items.map((i) =>
                            i.id === item.id
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        );
                    } else {
                        newItems = [...activeTab.items, item];
                    }

                    // Recalculate totals
                    const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
                    const total = subtotal + activeTab.shippingFee - activeTab.discount;

                    return {
                        tabs: state.tabs.map((t) =>
                            t.id === state.activeTabId
                                ? { ...t, items: newItems, subtotal, total }
                                : t
                        ),
                    };
                });
            },

            updateItemQuantity: (itemId, quantity) => {
                set((state) => {
                    const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
                    if (!activeTab) return state;

                    const newItems = activeTab.items.map((i) =>
                        i.id === itemId ? { ...i, quantity } : i
                    ).filter(i => i.quantity > 0);

                    const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
                    const total = subtotal + activeTab.shippingFee - activeTab.discount;

                    return {
                        tabs: state.tabs.map((t) =>
                            t.id === state.activeTabId
                                ? { ...t, items: newItems, subtotal, total }
                                : t
                        ),
                    };
                });
            },

            removeItem: (itemId) => {
                set((state) => {
                    const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
                    if (!activeTab) return state;

                    const newItems = activeTab.items.filter((i) => i.id !== itemId);
                    const subtotal = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
                    const total = subtotal + activeTab.shippingFee - activeTab.discount;

                    return {
                        tabs: state.tabs.map((t) =>
                            t.id === state.activeTabId
                                ? { ...t, items: newItems, subtotal, total }
                                : t
                        ),
                    };
                });
            },

            toggleShipping: (enabled) => {
                set((state) => {
                    const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
                    if (!activeTab) return state;

                    // Reset shipping fee if disabled
                    const shippingFee = enabled ? activeTab.shippingFee : 0;
                    const total = activeTab.subtotal + shippingFee - activeTab.discount;

                    return {
                        tabs: state.tabs.map(t =>
                            t.id === state.activeTabId
                                ? { ...t, shippingEnabled: enabled, shippingFee, total }
                                : t
                        )
                    }
                });
            },

            setShippingAddress: (address) => {
                set((state) => ({
                    tabs: state.tabs.map((t) =>
                        t.id === state.activeTabId ? { ...t, shippingAddress: address } : t
                    ),
                }));
            },

            setShippingFee: (fee) => {
                set((state) => {
                    const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
                    if (!activeTab) return state;

                    const total = activeTab.subtotal + fee - activeTab.discount;
                    return {
                        tabs: state.tabs.map((t) =>
                            t.id === state.activeTabId ? { ...t, shippingFee: fee, total } : t
                        ),
                    };
                });
            },

            setDiscount: (discount) => {
                set((state) => {
                    const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
                    if (!activeTab) return state;

                    const total = activeTab.subtotal + activeTab.shippingFee - discount;
                    return {
                        tabs: state.tabs.map((t) =>
                            t.id === state.activeTabId ? { ...t, discount, total } : t
                        ),
                    };
                });
            },

            setPaymentMethod: (method) => {
                set((state) => ({
                    tabs: state.tabs.map((t) =>
                        t.id === state.activeTabId ? { ...t, paymentMethod: method } : t
                    ),
                }));
            },

            clearCurrentOrder: () => {
                set((state) => {
                    const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
                    if (!activeTab) return state;

                    const clearedOrder = createEmptyOrder(activeTab.id, activeTab.name);
                    return {
                        tabs: state.tabs.map(t => t.id === state.activeTabId ? clearedOrder : t)
                    }
                });
            },
        }),
        {
            name: "pos-storage",
        }
    )
);
