import {
    createCoupon,
    deleteCoupon,
    getCouponById,
    getCoupons,
    updateCoupon,
    updateStatus,
    bulkDelete,
    bulkUpdateStatus,
    type GetCouponsParams,
} from "../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import type { BaseMutationOptions } from "@/shared/api/types";
import type { CreateCouponInput, UpdateCouponInput, UpdateCouponStatusInput } from "../model/schemas";

export function useCoupons(params: GetCouponsParams) {
    return useQuery({
        queryKey: ["coupons", params],
        queryFn: () => getCoupons(params),
    });
}

export function useCouponDetail(id: number) {
    return useQuery({
        queryKey: ["coupons", id],
        queryFn: () => getCouponById(id),
        enabled: !!id,
    });
}

export function useCreateCoupon(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: (data: CreateCouponInput) => createCoupon(data),
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
        },
    });
}

export function useUpdateCoupon(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCouponInput }) =>
            updateCoupon(id, data),
        setError: options?.setError,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
            queryClient.invalidateQueries({ queryKey: ["coupons", variables.id] });
        },
    });
}

export function useUpdateCouponStatus(options?: BaseMutationOptions) {
    const qc = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCouponStatusInput }) =>
            updateStatus(id, data),
        setError: options?.setError,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["coupons"] });
        },
    });
}

export function useDeleteCoupon(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: deleteCoupon,
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
        },
    });
}

export function useBulkDeleteCoupons(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: bulkDelete,
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
        },
    });
}

export function useBulkUpdateCouponStatus(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();
    return useGlobalMutation({
        mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
            bulkUpdateStatus(ids, status),
        setError: options?.setError,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
        },
    });
}
