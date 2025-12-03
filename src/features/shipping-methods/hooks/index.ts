import {
    bulkDelete,
    bulkUpdateStatus,
    createShippingMethod,
    deleteShippingMethod,
    getShippingMethodById,
    getShippingMethods,
    updateShippingMethod,
    updateStatus,
    type GetShippingMethodsParams,
} from "../api";
import type { UpdateShippingMethodInput, UpdateShippingMethodStatusInput } from "../model/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useShippingMethods(params: GetShippingMethodsParams) {
    return useQuery({
        queryKey: ["shipping-methods", params],
        queryFn: () => getShippingMethods(params),
        staleTime: 30 * 1000,
    });
}

export function useCreateShippingMethod() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createShippingMethod,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["shipping-methods"] });
        },
        onError: () => { },
    });
}

export function useUpdateShippingMethod() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateShippingMethodInput }) =>
            updateShippingMethod(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["shipping-methods"] });
        },
        onError: () => { },
    });
}

export function useUpdateShippingMethodStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateShippingMethodStatusInput }) =>
            updateStatus(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["shipping-methods"] });
        },
        onError: () => { },
    });
}

export function useDeleteShippingMethod() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteShippingMethod,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["shipping-methods"] });
        },
        onError: () => { },
    });
}

export function useBulkUpdateStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdateStatus(ids, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["shipping-methods"] });
        },
    });
}

export function useBulkDelete() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: bulkDelete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["shipping-methods"] });
        },
    });
}

export function useShippingMethodDetail(id: number) {
    return useQuery({
        queryKey: ["shipping-method", id],
        queryFn: () => getShippingMethodById(id),
        enabled: !!id,
    });
}
