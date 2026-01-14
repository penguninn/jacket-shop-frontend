import { useQuery } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import {
    getPosDrafts,
    createPosDraft,
    completePosOrder,
    cancelPosDraft,
    addItemToPosDraft,
    updateDraftItemQuantity,
    removeItemFromDraft,
    updatePosDraftInfo,
    updatePosDraftCustomer,
    updatePosDraftCoupon,
    updatePosPayment,
} from "../api";
import type {
    CreateOrderRequest,
    Order,
    OrderItemRequest,
    UpdatePaymentRequest,
} from "../model/schemas";
import type { BaseMutationOptions } from "@/shared/api/types";
import { productVariantKeys } from "@/features/product-variants/hooks";

// --- Query Keys ---

export const posKeys = {
    all: ['pos-drafts'] as const,
    lists: () => [...posKeys.all, 'list'] as const,
} as const;

// --- Query Hooks ---

export function usePosDrafts() {
    return useQuery({
        queryKey: posKeys.lists(),
        queryFn: getPosDrafts,
    });
}

// --- Mutation Hooks ---

export function useCreatePosDraft(options?: BaseMutationOptions) {
    return useGlobalMutation<Order>({
        mutationFn: createPosDraft,
        invalidateQueries: [
            [...posKeys.lists()] as string[],
        ],
        successMessage: "Draft created successfully",
        errorContext: "Create Draft",
        setError: options?.setError,
    });
}

export function useCompletePosOrder(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, number>({
        mutationFn: completePosOrder,
        invalidateQueries: [
            [...posKeys.lists()] as string[],
        ],
        successMessage: "Order completed successfully",
        errorContext: "Complete Order",
        setError: options?.setError,
    });
}

export function useCancelPosDraft(options?: BaseMutationOptions) {
    return useGlobalMutation<void, number>({
        mutationFn: cancelPosDraft,
        invalidateQueries: [
            [...posKeys.lists()] as string[],
        ],
        successMessage: "Draft cancelled successfully",
        errorContext: "Cancel Draft",
        setError: options?.setError,
    });
}

// Item Management

export function useAddItemToPosDraft(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { draftId: number; item: OrderItemRequest }>({
        mutationFn: ({ draftId, item }) => addItemToPosDraft(draftId, item),
        invalidateQueries: [
            [...posKeys.lists()] as string[],
            [...productVariantKeys.all] as string[],
        ],
        successMessage: "Item added successfully",
        errorContext: "Add Item",
        setError: options?.setError,
    });
}

export function useUpdateDraftItemQuantity(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { draftId: number; itemId: number; quantity: number }>({
        mutationFn: ({ draftId, itemId, quantity }) => updateDraftItemQuantity(draftId, itemId, quantity),
        invalidateQueries: [
            [...posKeys.lists()] as string[],
            [...productVariantKeys.all] as string[],
        ],
        successMessage: "Quantity updated successfully",
        errorContext: "Update Quantity",
        setError: options?.setError,
    });
}

export function useRemoveItemFromDraft(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { draftId: number; itemId: number }>({
        mutationFn: ({ draftId, itemId }) => removeItemFromDraft(draftId, itemId),
        invalidateQueries: [
            [...posKeys.lists()] as string[],
            [...productVariantKeys.all] as string[],
        ],
        successMessage: "Item removed successfully",
        errorContext: "Remove Item",
        setError: options?.setError,
    });
}

// Draft Interface Updates

export function useUpdatePosDraftInfo(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { id: number; data: CreateOrderRequest }>({
        mutationFn: ({ id, data }) => updatePosDraftInfo(id, data),
        invalidateQueries: [
            [...posKeys.lists()] as string[],
        ],
        successMessage: "Draft info updated successfully",
        errorContext: "Update Draft Info",
        setError: options?.setError,
    });
}

export function useUpdatePosDraftCustomer(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { draftId: number; customerId: number }>({
        mutationFn: ({ draftId, customerId }) => updatePosDraftCustomer(draftId, customerId),
        invalidateQueries: [
            [...posKeys.lists()] as string[],
        ],
        successMessage: "Customer info updated successfully",
        errorContext: "Update Customer",
        setError: options?.setError,
    });
}

export function useUpdatePosDraftCoupon(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { id: number; couponCode?: string }>({
        mutationFn: ({ id, couponCode }) => updatePosDraftCoupon(id, couponCode),
        invalidateQueries: [
            [...posKeys.lists()] as string[],
        ],
        successMessage: "Coupon updated successfully",
        errorContext: "Update Coupon",
        setError: options?.setError,
    });
}

export function useUpdatePosPayment(options?: BaseMutationOptions) {
    return useGlobalMutation<Order, { id: number; data: UpdatePaymentRequest }>({
        mutationFn: ({ id, data }) => updatePosPayment(id, data),
        invalidateQueries: [
            [...posKeys.lists()] as string[],
        ],
        successMessage: "Payment info updated successfully",
        errorContext: "Update Payment",
        setError: options?.setError,
    });
}
