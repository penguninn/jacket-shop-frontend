import { httpPrivateTyped } from "@/shared/api/http-typed";
import z from "zod";
import {
    orderHistoryResponseSchema,
    orderSchema,
    ordersResponseSchema,
    type CreateOrderRequest,
    type OrderFilterParams,
    type OrderStatus,
    type ShippingInfoRequest,
} from "../model/schemas";

// ==================== READ OPERATIONS ====================

export async function getOrderById(id: number) {
    const res = await httpPrivateTyped.get(`/orders/${id}`, orderSchema);
    return res;
}

export async function getAllOrders(params: OrderFilterParams) {
    const queryParams = new URLSearchParams();

    if (params.orderCode) queryParams.append("orderCode", params.orderCode);
    if (params.userId) queryParams.append("userId", params.userId.toString());
    if (params.staffId) queryParams.append("staffId", params.staffId.toString());
    if (params.status) queryParams.append("status", params.status);
    if (params.orderType) queryParams.append("orderType", params.orderType);
    if (params.paymentStatus) queryParams.append("paymentStatus", params.paymentStatus);

    queryParams.append("page", params.page.toString());
    queryParams.append("size", params.size.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortDir) queryParams.append("sortDir", params.sortDir);

    const res = await httpPrivateTyped.get(
        `/orders?${queryParams.toString()}`,
        ordersResponseSchema
    );
    return res;
}

export async function getMyOrders(status?: OrderStatus) {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);

    const res = await httpPrivateTyped.get(
        `/orders/my-orders?${queryParams.toString()}`,
        z.array(orderSchema)
    );
    return res;
}

export async function getOrderHistory(id: number) {
    const res = await httpPrivateTyped.get(
        `/orders/${id}/history`,
        z.array(orderHistoryResponseSchema)
    );
    return res;
}

// ==================== CREATE OPERATIONS ====================

export async function createOrder(payload: CreateOrderRequest) {
    const res = await httpPrivateTyped.post("/orders", payload, orderSchema);
    return res;
}

export async function reorder(id: number) {
    await httpPrivateTyped.post(`/orders/${id}/reorder`, null, z.null());
}

// ==================== STATE TRANSITIONS ====================

export async function confirmOrder(id: number) {
    const res = await httpPrivateTyped.put(`/orders/${id}/confirm`, null, orderSchema);
    return res;
}

export async function shipOrder(id: number) {
    const res = await httpPrivateTyped.put(`/orders/${id}/ship`, null, orderSchema);
    return res;
}

export async function completeOrder(id: number) {
    const res = await httpPrivateTyped.put(`/orders/${id}/complete`, null, orderSchema);
    return res;
}

export async function receiveOrder(id: number) {
    const res = await httpPrivateTyped.put(`/orders/${id}/receive`, null, orderSchema);
    return res;
}

export async function cancelOrder(id: number) {
    const res = await httpPrivateTyped.put(`/orders/${id}/cancel`, null, orderSchema);
    return res;
}

// ==================== RETURN OPERATIONS ====================

export async function requestReturn(id: number, reason: string) {
    const queryParams = new URLSearchParams({ reason });
    const res = await httpPrivateTyped.post(
        `/orders/${id}/return?${queryParams.toString()}`,
        null,
        orderSchema
    );
    return res;
}

export async function approveReturn(id: number) {
    const res = await httpPrivateTyped.put(`/orders/${id}/return/approve`, null, orderSchema);
    return res;
}

// ==================== UPDATE OPERATIONS ====================

export async function updateShippingInfo(id: number, payload: ShippingInfoRequest) {
    const res = await httpPrivateTyped.put(`/orders/${id}/shipping`, payload, orderSchema);
    return res;
}