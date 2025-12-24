import { z } from "zod";
import { httpPrivateTyped } from "@/shared/api/http-typed";
import {
    createPaymentLinkResponseSchema,
    paymentLinkSchema,
    type CreatePaymentLinkResponse,
    type PaymentLink,
} from "../model/schemas";

/**
 * Create a payment link for an order
 * POST /api/payos/payment-link/{orderId}
 */
export async function createPaymentLink(orderId: number): Promise<CreatePaymentLinkResponse> {
    return httpPrivateTyped.post<CreatePaymentLinkResponse>(
        `/payos/payment-link/${orderId}`,
        {},
        createPaymentLinkResponseSchema
    );
}

/**
 * Get payment link details by order ID
 * GET /api/payos/orders/{orderId}
 */
export async function getPayOSOrder(orderId: number): Promise<PaymentLink> {
    return httpPrivateTyped.get<PaymentLink>(
        `/payos/orders/${orderId}`,
        paymentLinkSchema
    );
}

/**
 * Cancel a PayOS payment (also cancels the order in database)
 * PUT /api/payos/orders/{orderId}/cancel
 */
export async function cancelPayOSOrder(orderId: number): Promise<void> {
    return httpPrivateTyped.put<void>(
        `/payos/orders/${orderId}/cancel`,
        {},
        z.any()
    );
}

