import {
    bulkDelete,
    bulkUpdateStatus,
    createCoupon,
    deleteCoupon,
    getCouponById,
    getCoupons,
    updateStatus,
    updateCoupon,
    type GetCouponsParams,
} from "../api";
import type { UpdateCouponInput, UpdateCouponStatusInput } from "../model/schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCoupons(params: GetCouponsParams) {
    return useQuery({
        queryKey: ["coupons", params],
        queryFn: () => getCoupons(params),
        staleTime: 30 * 1000,
    });
}

export function useCreateCoupon() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createCoupon,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["coupons"] });
        },
        onError: () => { },
    });
}

export function useUpdateCoupon() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCouponInput }) =>
            updateCoupon(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["coupons"] });
        },
        onError: () => { },
    });
}

export function useUpdateCouponStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateCouponStatusInput }) =>
            updateStatus(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["coupons"] });
        },
        onError: () => { },
    });
}

export function useDeleteCoupon() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: deleteCoupon,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["coupons"] });
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
            qc.invalidateQueries({ queryKey: ["coupons"] });
        },
    });
}

export function useBulkDelete() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: bulkDelete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["coupons"] });
        },
    });
}

export function useCouponDetail(id: number) {
    return useQuery({
        queryKey: ["coupon", id],
        queryFn: () => getCouponById(id),
        enabled: !!id,
    });
}
