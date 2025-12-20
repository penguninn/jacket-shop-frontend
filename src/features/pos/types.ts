
export interface PosProduct {
    id: number;
    name: string;
    price: number;
    image: string;
    sku?: string;
    stock: number;
    // Add variant details if needed
    size?: string;
    color?: string;
}

export interface PosCartItem extends PosProduct {
    quantity: number;
}

export interface PosCustomer {
    id: number;
    name: string;
    phone?: string;
    address?: string;
}

export interface PosOrderDraft {
    id: string; // Unique ID for the draft (e.g., "order-1")
    name: string; // Display name (e.g., "Order 1")
    items: PosCartItem[];
    customer: PosCustomer | null;
    isDelivery: boolean;
    discount: number; // Raw amount or percentage could be handled
    paymentMethod: "cash" | "card" | "transfer";
    amountPaid: number; // Amount customer pays
}
