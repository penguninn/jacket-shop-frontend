import { z } from "zod";
import { httpPrivateTyped } from "@/shared/api/http-typed";
import { orderSchema, orderArraySchema, type Order } from "@/features/orders/model/schemas";
import type {
    CreatePosDraftRequest,
    UpdatePosDraftRequest,
} from "../model/pos-schemas";

// POS Draft Order APIs

/**
 * Create a new POS draft order
 * POST /api/admin/orders/pos/draft
 */
export async function createPosDraft(data: CreatePosDraftRequest): Promise<Order> {
    return httpPrivateTyped.post<Order>("/admin/orders/pos/draft", data, orderSchema);
}

/**
 * Get all POS draft orders for the current staff
 * GET /api/admin/orders/pos/drafts
 */
export async function getPosDrafts(): Promise<Order[]> {
    return httpPrivateTyped.get<Order[]>("/admin/orders/pos/drafts", orderArraySchema);
}

/**
 * Update an existing POS draft order
 * PUT /api/admin/orders/pos/{id}
 */
export async function updatePosDraft(
    id: number,
    data: UpdatePosDraftRequest
): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/admin/orders/pos/${id}`, data, orderSchema);
}

/**
 * Complete a POS draft order (finalize and checkout)
 * PUT /api/admin/orders/pos/{id}/complete
 * Note: Payment info should be set via updatePosDraft before calling this
 */
export async function completePosDraft(id: number): Promise<Order> {
    return httpPrivateTyped.put<Order>(
        `/admin/orders/pos/${id}/complete`,
        {},
        orderSchema
    );
}

/**
 * Delete a POS draft order
 * DELETE /api/admin/orders/pos/{id}
 */
export async function deletePosDraft(id: number): Promise<void> {
    return httpPrivateTyped.del<void>(`/admin/orders/pos/${id}`, z.any());
}

// POS Draft Item Management

/**
 * Add item to POS draft
 * POST /api/admin/orders/pos/{draftId}/items
 */
export async function addItemToPosDraft(
    draftId: number,
    item: { productVariantId: number; quantity: number }
): Promise<Order> {
    return httpPrivateTyped.post<Order>(
        `/admin/orders/pos/${draftId}/items`,
        item,
        orderSchema
    );
}

/**
 * Update draft item quantity
 * PUT /api/admin/orders/pos/{draftId}/items/{itemId}?quantity=X
 */
export async function updateDraftItemQuantity(
    draftId: number,
    itemId: number,
    quantity: number
): Promise<Order> {
    return httpPrivateTyped.put<Order>(
        `/admin/orders/pos/${draftId}/items/${itemId}`,
        {},
        orderSchema,
        { params: { quantity } }
    );
}

/**
 * Remove item from POS draft
 * DELETE /api/admin/orders/pos/{draftId}/items/{itemId}
 */
export async function removeItemFromPosDraft(
    draftId: number,
    itemId: number
): Promise<Order> {
    return httpPrivateTyped.del<Order>(
        `/admin/orders/pos/${draftId}/items/${itemId}`,
        orderSchema
    );
}

// ==================== SPECIFIC POS UPDATE ENDPOINTS ====================

/**
 * Update POS draft general info (payment method, etc.)
 * PUT /api/admin/orders/pos/{id}/info
 */
export async function updatePosDraftInfo(
    id: number,
    data: UpdatePosDraftRequest
): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/admin/orders/pos/${id}/info`, data, orderSchema);
}

/**
 * Update POS draft customer info
 * PUT /api/admin/orders/pos/{id}/customer
 */
export async function updatePosDraftCustomer(
    id: number,
    data: UpdatePosDraftRequest
): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/admin/orders/pos/${id}/customer`, data, orderSchema);
}

/**
 * Update POS draft shipping info
 * PUT /api/admin/orders/pos/{id}/shipping
 */
export async function updatePosDraftShipping(
    id: number,
    data: UpdatePosDraftRequest
): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/admin/orders/pos/${id}/shipping`, data, orderSchema);
}

/**
 * Update POS draft coupon
 * PUT /api/admin/orders/pos/{id}/coupon?couponCode=XXX
 */
export async function updatePosDraftCoupon(
    id: number,
    couponCode: string | null
): Promise<Order> {
    return httpPrivateTyped.put<Order>(
        `/admin/orders/pos/${id}/coupon`,
        {},
        orderSchema,
        { params: { couponCode: couponCode || undefined } }
    );
}
