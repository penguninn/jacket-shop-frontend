import { useMutation, useQuery } from "@tanstack/react-query";
import {
    createPaymentLink,
    getPayOSOrder,
    cancelPayOSOrder,
} from "../api";
import type { CreatePaymentLinkResponse, PaymentLink } from "../model";

export const payosKeys = {
    all: ['payos'] as const,
    order: (orderId: number) => [...payosKeys.all, 'order', orderId] as const,
} as const;

/**
 * Hook to create a PayOS payment link for an order
 */
export function useCreatePaymentLink() {
    return useMutation<CreatePaymentLinkResponse, Error, number>({
        mutationFn: createPaymentLink,
    });
}

/**
 * Hook to get PayOS order/payment status
 */
export function usePayOSOrder(orderId: number, enabled = true) {
    return useQuery<PaymentLink>({
        queryKey: payosKeys.order(orderId),
        queryFn: () => getPayOSOrder(orderId),
        enabled: enabled && !!orderId,
    });
}

/**
 * Hook to cancel a PayOS payment
 */
export function useCancelPayOSOrder() {
    return useMutation<void, Error, number>({
        mutationFn: cancelPayOSOrder,
    });
}
