import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    getOrderHistory
} from "../api";
import type { OrderFilterParams } from "../model/schemas";

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

export function useConfirmOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: confirmOrder,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.details() });
            queryClient.invalidateQueries({ queryKey: orderKeys.history(id) });
        },
    });
}

export function useShipOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: shipOrder,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.details() });
            queryClient.invalidateQueries({ queryKey: orderKeys.history(id) });
        },
    });
}

export function useCompleteOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completeOrder,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.details() });
            queryClient.invalidateQueries({ queryKey: orderKeys.history(id) });
        },
    });
}

export function useCancelOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelOrder,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.details() });
            queryClient.invalidateQueries({ queryKey: orderKeys.history(id) });
        },
    });
}

export function useUpdatePaymentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => updatePaymentStatus(id, status),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.details() });
            queryClient.invalidateQueries({ queryKey: orderKeys.history(id) });
        },
    });
}

export function useUpdateShippingInfo() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, carrierName, carrierCode }: { id: number; carrierName: string; carrierCode: string }) =>
            updateShippingInfo(id, carrierName, carrierCode),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.details() });
            queryClient.invalidateQueries({ queryKey: orderKeys.history(id) });
        },
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
            queryClient.invalidateQueries({ queryKey: orderKeys.all }); // Invalidate all orders
        },
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

export function useCancelUserOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cancelUserOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() }); // Invalidate my orders
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}

export function useReceiveOrder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: receiveOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() });
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}

export function useRequestReturn() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) => requestReturn(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() });
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
}

export function useReorder() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: reorder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
}
