import { z } from "zod";
import { httpPrivateTyped } from "@/shared/api/http-typed";
import { format } from "date-fns";
import {
    type Order,
    type OrderFilterParams,
    type OrdersResponse,
    type CreateOrderRequest,
    ordersResponseSchema,
    orderSchema,
    orderArraySchema,
    orderHistoryResponseSchema,
    type OrderHistoryResponse
} from "../model/schemas";

// --- Admin Endpoints ---

export async function getOrders(params: OrderFilterParams): Promise<OrdersResponse> {
    const queryParams: any = {
        ...params,
        page: params.page - 1,
    };

    if (params.startDate) {
        queryParams.startDate = format(params.startDate, "yyyy-MM-dd");
    }
    if (params.endDate) {
        queryParams.endDate = format(params.endDate, "yyyy-MM-dd");
    }

    return httpPrivateTyped.get<OrdersResponse>("/admin/orders", ordersResponseSchema, {
        params: queryParams
    });
}

export async function getOrderById(id: number): Promise<Order> {
    return httpPrivateTyped.get<Order>(`/admin/orders/${id}`, orderSchema);
}

export async function confirmOrder(id: number): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/admin/orders/${id}/confirm`, {}, orderSchema);
}

export async function shipOrder(id: number): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/admin/orders/${id}/ship`, {}, orderSchema);
}

export async function completeOrder(id: number): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/admin/orders/${id}/complete`, {}, orderSchema);
}

export async function cancelOrder(id: number): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/admin/orders/${id}/cancel`, {}, orderSchema);
}

export async function updatePaymentStatus(id: number, status: string): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/admin/orders/${id}/payment-status`, {}, orderSchema, {
        params: { status }
    });
}

export async function updateShippingInfo(id: number, carrierName: string, carrierCode: string): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/admin/orders/${id}/shipping-info`, {}, orderSchema, {
        params: { carrierName, carrierCode }
    });
}

// --- User Endpoints ---

export async function createOrder(data: CreateOrderRequest): Promise<Order> {
    return httpPrivateTyped.post<Order>("/orders", data, orderSchema);
}

export async function getMyOrders(status?: string): Promise<Order[]> {
    return httpPrivateTyped.get<Order[]>("/orders/me", orderArraySchema, {
        params: { status }
    });
}

export async function getUserOrderById(id: number): Promise<Order> {
    return httpPrivateTyped.get<Order>(`/orders/${id}`, orderSchema);
}

export async function getOrderHistory(id: number): Promise<OrderHistoryResponse[]> {
    return httpPrivateTyped.get<OrderHistoryResponse[]>(`/orders/${id}/history`, z.array(orderHistoryResponseSchema));
}

export async function cancelUserOrder(id: number): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/orders/${id}/cancel`, {}, orderSchema);
}

export async function receiveOrder(id: number): Promise<Order> {
    return httpPrivateTyped.put<Order>(`/orders/${id}/receive`, {}, orderSchema);
}

export async function requestReturn(id: number, reason: string): Promise<Order> {
    return httpPrivateTyped.post<Order>(`/orders/${id}/return`, reason, orderSchema, {
        headers: { "Content-Type": "text/plain" }
    });
}

export async function reorder(id: number): Promise<void> {
    return httpPrivateTyped.post<void>(`/orders/${id}/reorder`, {}, z.any());
}
