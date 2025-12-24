import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createPosDraft,
    getPosDrafts,
    updatePosDraft,
    completePosDraft,
    deletePosDraft,
    addItemToPosDraft,
    updateDraftItemQuantity,
    removeItemFromPosDraft,
} from "../api/pos-api";
import type {
    CreatePosDraftRequest,
    UpdatePosDraftRequest,
} from "../model/pos-schemas";

// Query keys for POS drafts
export const posDraftKeys = {
    all: ['pos', 'drafts'] as const,
    lists: () => [...posDraftKeys.all, 'list'] as const,
    list: () => [...posDraftKeys.lists()] as const,
    detail: (id: number) => [...posDraftKeys.all, 'detail', id] as const,
} as const;

/**
 * Get all POS draft orders
 */
export function usePosDrafts() {
    return useQuery({
        queryKey: posDraftKeys.list(),
        queryFn: getPosDrafts,
    });
}

/**
 * Create a new POS draft order
 */
export function useCreatePosDraft() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreatePosDraftRequest) => createPosDraft(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: posDraftKeys.all });
        },
    });
}

/**
 * Update an existing POS draft order
 */
export function useUpdatePosDraft() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdatePosDraftRequest }) =>
            updatePosDraft(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: posDraftKeys.all });
            queryClient.invalidateQueries({ queryKey: posDraftKeys.detail(id) });
        },
    });
}

/**
 * Complete a POS draft order (finalize checkout)
 * Note: Payment info should be set via updatePosDraft before calling this
 */
export function useCompletePosDraft() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => completePosDraft(id),
        onSuccess: () => {
            // Invalidate drafts since this draft is now completed
            queryClient.invalidateQueries({ queryKey: posDraftKeys.all });
            // Invalidate orders list to show the new completed order
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
}

/**
 * Delete a POS draft order
 */
export function useDeletePosDraft() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deletePosDraft(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: posDraftKeys.all });
        },
    });
}

// ===== POS Draft Item Management =====

/**
 * Add item to POS draft
 */
export function useAddItemToPosDraft() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ draftId, item }: {
            draftId: number;
            item: { productVariantId: number; quantity: number }
        }) => addItemToPosDraft(draftId, item),
        onSuccess: (_, { draftId }) => {
            queryClient.invalidateQueries({ queryKey: posDraftKeys.all });
            queryClient.invalidateQueries({ queryKey: posDraftKeys.detail(draftId) });
        },
    });
}

/**
 * Update draft item quantity
 */
export function useUpdateDraftItemQuantity() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            draftId,
            itemId,
            quantity
        }: {
            draftId: number;
            itemId: number;
            quantity: number
        }) => updateDraftItemQuantity(draftId, itemId, quantity),
        onSuccess: (_, { draftId }) => {
            queryClient.invalidateQueries({ queryKey: posDraftKeys.all });
            queryClient.invalidateQueries({ queryKey: posDraftKeys.detail(draftId) });
        },
    });
}

/**
 * Remove item from POS draft
 */
export function useRemoveItemFromPosDraft() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ draftId, itemId }: { draftId: number; itemId: number }) =>
            removeItemFromPosDraft(draftId, itemId),
        onSuccess: (_, { draftId }) => {
            queryClient.invalidateQueries({ queryKey: posDraftKeys.all });
            queryClient.invalidateQueries({ queryKey: posDraftKeys.detail(draftId) });
        },
    });
}
