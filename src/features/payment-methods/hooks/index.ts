import {
    bulkDeletePaymentMethods,
    bulkUpdatePaymentMethodStatus,
    createPaymentMethod,
    deletePaymentMethod,
    getPaymentMethodById,
    getPaymentMethods,
    updatePaymentMethod,
    updatePaymentMethodStatus,
    type GetPaymentMethodsParams,
} from "../api";
import type { UpdatePaymentMethodInput, UpdatePaymentMethodStatusInput } from "../model/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePaymentMethods(params: GetPaymentMethodsParams) {
    return useQuery({
        queryKey: ["payment-methods", params],
        queryFn: () => getPaymentMethods(params),
        staleTime: 30 * 1000,
    });
}

export function useCreatePaymentMethod() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createPaymentMethod,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payment-methods"] });
        },
        onError: () => { },
    });
}

export function useUpdatePaymentMethod() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePaymentMethodInput }) =>
            updatePaymentMethod(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payment-methods"] });
        },
        onError: () => { },
    });
}

export function useUpdatePaymentMethodStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePaymentMethodStatusInput }) =>
            updatePaymentMethodStatus(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payment-methods"] });
        },
        onError: () => { },
    });
}

export function useDeletePaymentMethod() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deletePaymentMethod,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payment-methods"] });
        },
        onError: () => { },
    });
}

export function useBulkUpdatePaymentMethodStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdatePaymentMethodStatus(ids, status),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payment-methods"] });
        },
    });
}

export function useBulkDeletePaymentMethods() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: bulkDeletePaymentMethods,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payment-methods"] });
        },
    });
}

export function usePaymentMethodDetail(id: number) {
    return useQuery({
        queryKey: ["payment-method", id],
        queryFn: () => getPaymentMethodById(id),
        enabled: !!id,
    });
}
