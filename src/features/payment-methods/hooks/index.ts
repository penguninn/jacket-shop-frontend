import {
    createPaymentMethod,
    deletePaymentMethod,
    getPaymentMethodById,
    getPaymentMethods,
    updatePaymentMethod,
    updatePaymentMethodStatus,
    bulkDeletePaymentMethods,
    bulkUpdatePaymentMethodStatus,
    type GetPaymentMethodsParams,
} from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import type { BaseMutationOptions } from "@/shared/api/types";
import type { CreatePaymentMethodInput, UpdatePaymentMethodInput, UpdatePaymentMethodStatusInput } from "../model/schemas";

export function usePaymentMethods(params: GetPaymentMethodsParams) {
    return useQuery({
        queryKey: ["payment-methods", params],
        queryFn: () => getPaymentMethods(params),
    });
}

export function usePaymentMethodDetail(id: number) {
    return useQuery({
        queryKey: ["payment-methods", id],
        queryFn: () => getPaymentMethodById(id),
        enabled: !!id,
    });
}

export function useCreatePaymentMethod(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: (data: CreatePaymentMethodInput) => createPaymentMethod(data),
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
        },
    });
}

export function useUpdatePaymentMethod(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePaymentMethodInput }) =>
            updatePaymentMethod(id, data),
        setError: options?.setError,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
            queryClient.invalidateQueries({ queryKey: ["payment-methods", variables.id] });
        },
    });
}

export function useDeletePaymentMethod(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: deletePaymentMethod,
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
        },
    });
}

export function useUpdatePaymentMethodStatus(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePaymentMethodStatusInput }) =>
            updatePaymentMethodStatus(id, data),
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payment-methods"] });
        },
    });
}

export function useBulkDeletePaymentMethods(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: bulkDeletePaymentMethods,
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payment-methods"] });
        },
    });
}

export function useBulkUpdatePaymentMethodStatus(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdatePaymentMethodStatus(ids, status),
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["payment-methods"] });
        },
    });
}
