import { useQuery } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import {
    getOrders,
    getOrderById,
    confirmOrder,
    shipOrder,
    completeOrder,
    cancelOrder,
    updatePaymentStatus,
    updateShippingInfo,
    createOrder,
    getMyOrders,
    getUserOrderById,
    cancelUserOrder,
    receiveOrder,
    requestReturn,
    reorder,
    getOrderHistory,
    approveReturn,
    updateOrderShipping,
    updateOrderPayment,
} from "../api";
import type {
    OrderFilterParams,
    UpdatePaymentRequest,
    ShippingInfoRequest,
    CreateOrderRequest,
    Order,
} from "../model/schemas";
import type { BaseMutationOptions } from "@/shared/api/types";

// --- Query Keys ---

export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    list: (params: OrderFilterParams) => [...orderKeys.lists(), params] as const,
    details: () => [...orderKeys.all, 'detail'] as const,
    detail: (id: number) => [...orderKeys.details(), id] as const,
    myOrders: (status?: string) => [...orderKeys.all, 'my', { status }] as const,
    myOrder: (id: number) => [...orderKeys.all, 'my', id] as const,
    history: (id: number) => [...orderKeys.all, 'history', id] as const,
} as const;

// --- Query Hooks ---

export function useOrders(params: OrderFilterParams) {
    return useQuery({
        queryKey: orderKeys.list(params),
        queryFn: () => getOrders(params),
    });
}

export function useOrder(id: number) {
    return useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => getOrderById(id),
        enabled: !!id,
    });
}

export function useMyOrders(status?: string) {
    return useQuery({
        queryKey: orderKeys.myOrders(status),
        queryFn: () => getMyOrders(status),
    });
}

export function useUserOrder(id: number) {
    return useQuery({
        queryKey: orderKeys.myOrder(id),
        queryFn: () => getUserOrderById(id),
        enabled: !!id,
    });
}

export function useOrderHistory(id: number) {
    return useQuery({
        queryKey: orderKeys.history(id),
        queryFn: () => getOrderHistory(id),
        enabled: !!id,
    });
}

// --- Mutation Hooks (Admin) ---

export function useConfirmOrder(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, number>({
        mutationFn: confirmOrder,
        invalidateQueries: [
            [...orderKeys.lists()] as string[],
            [...orderKeys.details()] as string[],
        ],
        successMessage: "Order confirmed successfully",
        errorContext: "Confirm Order",
        setError: options?.setError,
    });
}

export function useShipOrder(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, number>({
        mutationFn: shipOrder,
        invalidateQueries: [
            [...orderKeys.lists()] as string[],
            [...orderKeys.details()] as string[],
        ],
        successMessage: "Order shipped successfully",
        errorContext: "Ship Order",
        setError: options?.setError,
    });
}

export function useCompleteOrder(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, number>({
        mutationFn: completeOrder,
        invalidateQueries: [
            [...orderKeys.lists()] as string[],
            [...orderKeys.details()] as string[],
        ],
        successMessage: "Order completed successfully",
        errorContext: "Complete Order",
        setError: options?.setError,
    });
}

export function useCancelOrder(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, number>({
        mutationFn: cancelOrder,
        invalidateQueries: [
            [...orderKeys.lists()] as string[],
            [...orderKeys.details()] as string[],
        ],
        successMessage: "Order cancelled successfully",
        errorContext: "Cancel Order",
        setError: options?.setError,
    });
}

export function useUpdatePaymentStatus(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { id: number; status: string }>({
        mutationFn: ({ id, status }) => updatePaymentStatus(id, status),
        invalidateQueries: [
            [...orderKeys.lists()] as string[],
            [...orderKeys.details()] as string[],
        ],
        successMessage: (_, { status }) => `Payment status updated to ${status}`,
        errorContext: "Update Payment Status",
        setError: options?.setError,
    });
}

export function useUpdateShippingInfo(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { id: number; carrierName: string; carrierCode: string }>({
        mutationFn: ({ id, carrierName, carrierCode }) => updateShippingInfo(id, carrierName, carrierCode),
        invalidateQueries: [
            [...orderKeys.lists()] as string[],
            [...orderKeys.details()] as string[],
        ],
        successMessage: "Shipping info updated successfully",
        errorContext: "Update Shipping Info",
        setError: options?.setError,
    });
}

export function useApproveReturn(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, number>({
        mutationFn: approveReturn,
        invalidateQueries: [
            [...orderKeys.lists()] as string[],
            [...orderKeys.details()] as string[],
        ],
        successMessage: "Return approved successfully",
        errorContext: "Approve Return",
        setError: options?.setError,
    });
}

export function useUpdateOrderShipping(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { id: number; data: ShippingInfoRequest }>({
        mutationFn: ({ id, data }) => updateOrderShipping(id, data),
        invalidateQueries: [
            [...orderKeys.lists()] as string[],
            [...orderKeys.details()] as string[],
        ],
        successMessage: "Order shipping updated successfully",
        errorContext: "Update Order Shipping",
        setError: options?.setError,
    });
}

export function useUpdateOrderPayment(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { id: number; data: UpdatePaymentRequest }>({
        mutationFn: ({ id, data }) => updateOrderPayment(id, data),
        invalidateQueries: [
            [...orderKeys.lists()] as string[],
            [...orderKeys.details()] as string[],
        ],
        successMessage: "Order payment updated successfully",
        errorContext: "Update Order Payment",
        setError: options?.setError,
    });
}

// --- Mutation Hooks (User) ---

export function useCreateOrder(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, CreateOrderRequest>({
        mutationFn: createOrder,
        invalidateQueries: [
            ['cart'] as string[],
            [...orderKeys.lists()] as string[],
            [...orderKeys.all] as string[],
        ],
        successMessage: "Order placed successfully",
        errorContext: "Create Order",
        setError: options?.setError,
    });
}

export function useCancelUserOrder(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, number>({
        mutationFn: cancelUserOrder,
        invalidateQueries: [
            [...orderKeys.myOrders()] as string[],
            [...orderKeys.all] as string[],
        ],
        successMessage: "Order cancelled successfully",
        errorContext: "Cancel Order",
        setError: options?.setError,
    });
}

export function useReceiveOrder(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, number>({
        mutationFn: receiveOrder,
        invalidateQueries: [
            [...orderKeys.myOrders()] as string[],
            [...orderKeys.all] as string[],
        ],
        successMessage: "Order marked as received",
        errorContext: "Receive Order",
        setError: options?.setError,
    });
}

export function useRequestReturn(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { id: number; reason: string }>({
        mutationFn: ({ id, reason }) => requestReturn(id, reason),
        invalidateQueries: [
            [...orderKeys.myOrders()] as string[],
            [...orderKeys.all] as string[],
        ],
        successMessage: "Return request submitted successfully",
        errorContext: "Request Return",
        setError: options?.setError,
    });
}

export function useReorder(options?: BaseMutationOptions) {
    return useGlobalMutation<void, number>({
        mutationFn: reorder,
        invalidateQueries: [
            ['cart'] as string[],
        ],
        successMessage: "Items added to cart",
        errorContext: "Reorder",
        setError: options?.setError,
    });
}
