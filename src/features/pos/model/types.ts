import type { ProductVariant } from "@/features/product-variants/model/schemas";
import type { User } from "@/features/users/model/schemas";
import type { AddressResponse } from "@/features/address/model/schemas";

export interface PosCartItem {
    id: string; // generated uuid for cart item
    product: ProductVariant;
    productName: string;
    productThumbnail?: string;
    quantity: number;
    price: number;
    variantName: string; // color + size
    maxStock: number;
}

export interface PosDraftOrder {
    id: string; // uuid
    name: string; // "Order #1", "Order #2"
    customer: User | null; // null means "Walk-in Customer"
    items: PosCartItem[];
    shippingEnabled: boolean;
    shippingAddress: AddressResponse | null;
    shippingFee: number;
    discount: number; // manual discount amount
    subtotal: number;
    total: number;
    paymentMethod: "CASH" | "CARD" | "POS_INSTORE"; // "POS_INSTORE" usually implies these
}

export interface PosState {
    tabs: PosDraftOrder[];
    activeTabId: string;
}

export type PosAction =
    | { type: "ADD_TAB" }
    | { type: "REMOVE_TAB"; payload: string }
    | { type: "SWITCH_TAB"; payload: string }
    | { type: "UPDATE_TAB_NAME"; payload: { id: string; name: string } }
    | { type: "SET_CUSTOMER"; payload: User | null }
    | { type: "ADD_ITEM"; payload: PosCartItem }
    | { type: "UPDATE_ITEM_QUANTITY"; payload: { itemId: string; quantity: number } }
    | { type: "REMOVE_ITEM"; payload: string }
    | { type: "TOGGLE_SHIPPING"; payload: boolean }
    | { type: "SET_SHIPPING_ADDRESS"; payload: AddressResponse | null }
    | { type: "SET_SHIPPING_FEE"; payload: number }
    | { type: "SET_DISCOUNT"; payload: number }
    | { type: "CLEAR_CURRENT_ORDER" };
