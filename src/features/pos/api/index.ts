import { httpPrivateTyped } from "@/shared/api/http-typed";
import z from "zod";
import {
    orderSchema,
    type CreateOrderRequest,
    type OrderItemRequest,
    type UpdatePaymentRequest,
} from "../model/schemas";


export async function getPosDrafts() {
    const res = await httpPrivateTyped.get(
        "/orders/pos/drafts",
        z.array(orderSchema)
    );
    return res;
}

export async function createPosDraft() {
    const res = await httpPrivateTyped.post(
        "/orders/pos/draft",
        null,
        orderSchema
    );
    return res;
}

export async function completePosOrder(id: number) {
    const res = await httpPrivateTyped.put(
        `/orders/pos/${id}/complete`,
        null,
        orderSchema
    );
    return res;
}

export async function cancelPosDraft(id: number) {
    await httpPrivateTyped.del(`/orders/pos/${id}`, z.null());
}

// ==================== POS ITEM MANAGEMENT ====================

export async function addItemToPosDraft(draftId: number, item: OrderItemRequest) {
    const res = await httpPrivateTyped.post(
        `/orders/pos/${draftId}/items`,
        item,
        orderSchema
    );
    return res;
}

export async function updateDraftItemQuantity(draftId: number, itemId: number, quantity: number) {
    const queryParams = new URLSearchParams({ quantity: quantity.toString() });
    const res = await httpPrivateTyped.put(
        `/orders/pos/${draftId}/items/${itemId}?${queryParams.toString()}`,
        null,
        orderSchema
    );
    return res;
}

export async function removeItemFromDraft(draftId: number, itemId: number) {
    const res = await httpPrivateTyped.del(
        `/orders/pos/${draftId}/items/${itemId}`,
        orderSchema
    );
    return res;
}

// ==================== POS DRAFT UPDATES ====================

export async function updatePosDraftInfo(id: number, payload: CreateOrderRequest) {
    const res = await httpPrivateTyped.put(
        `/orders/pos/${id}/info`,
        payload,
        orderSchema
    );
    return res;
}

export async function updatePosDraftCustomer(draftId: number, customerId: number) {
    const res = await httpPrivateTyped.put(
        `/orders/pos/${draftId}/customer/${customerId}`,
        null,
        orderSchema
    );
    return res;
}

export async function updatePosDraftCoupon(id: number, couponCode?: string) {
    const queryParams = new URLSearchParams();
    if (couponCode) {
        queryParams.append("couponCode", couponCode);
    }

    const res = await httpPrivateTyped.put(
        `/orders/pos/${id}/coupon?${queryParams.toString()}`,
        null,
        orderSchema
    );
    return res;
}

export async function updatePosPayment(id: number, payload: UpdatePaymentRequest) {
    const res = await httpPrivateTyped.put(
        `/orders/pos/${id}/payment`,
        payload,
        orderSchema
    );
    return res;
}
