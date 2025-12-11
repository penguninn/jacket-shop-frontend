import {
    createShippingMethod,
    deleteShippingMethod,
    getShippingMethodById,
    getShippingMethods,
    updateShippingMethod,
    updateStatus,
    bulkDelete,
    bulkUpdateStatus,
    type GetShippingMethodsParams,
} from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import type { BaseMutationOptions } from "@/shared/api/types";
import type { CreateShippingMethodInput, UpdateShippingMethodInput, UpdateShippingMethodStatusInput } from "../model/schemas";

export function useShippingMethods(params: GetShippingMethodsParams) {
    return useQuery({
        queryKey: ["shipping-methods", params],
        queryFn: () => getShippingMethods(params),
    });
}

export function useShippingMethodDetail(id: number) {
    return useQuery({
        queryKey: ["shipping-methods", id],
        queryFn: () => getShippingMethodById(id),
        enabled: !!id,
    });
}

export function useCreateShippingMethod(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: (data: CreateShippingMethodInput) => createShippingMethod(data),
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shipping-methods"] });
        },
    });
}

export function useUpdateShippingMethod(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateShippingMethodInput }) =>
            updateShippingMethod(id, data),
        setError: options?.setError,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["shipping-methods"] });
            queryClient.invalidateQueries({ queryKey: ["shipping-methods", variables.id] });
        },
    });
}

export function useDeleteShippingMethod(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: deleteShippingMethod,
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shipping-methods"] });
        },
    });
}

export function useUpdateShippingMethodStatus(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateShippingMethodStatusInput }) =>
            updateStatus(id, data),
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["shipping-methods"] });
        },
    });
}

export function useBulkDeleteShippingMethods(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: bulkDelete,
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["shipping-methods"] });
        },
    });
}

export function useBulkUpdateShippingMethodStatus(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdateStatus(ids, status),
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["shipping-methods"] });
        },
    });
}
