import { useQuery } from "@tanstack/react-query";
import { getReviews, getReviewsByProduct, deleteReview, updateReview, createReview } from "../api";
import type { ReviewFilterParams, UpdateReviewInput, Review, CreateReviewInput } from "../model/schemas";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import type { BaseMutationOptions } from "@/shared/api/types";

export const reviewKeys = {
    all: ['reviews'] as const,
    lists: () => [...reviewKeys.all, 'list'] as const,
    list: (params: ReviewFilterParams) => [...reviewKeys.lists(), params] as const,
    product: (productId: number, params: any) => [...reviewKeys.all, 'product', productId, params] as const,
};

export function useReviews(params: ReviewFilterParams) {
    return useQuery({
        queryKey: reviewKeys.list(params),
        queryFn: () => getReviews(params),
    });
}

export function useReviewsByProduct(productId: number, params: Omit<ReviewFilterParams, 'productId'> = { page: 0, size: 10 }) {
    return useQuery({
        queryKey: reviewKeys.product(productId, params),
        queryFn: () => getReviewsByProduct(productId, params),
    });
}

export function useCreateReview(options?: BaseMutationOptions) {
    return useGlobalMutation<Review, CreateReviewInput>({
        mutationFn: createReview,
        invalidateQueries: [['reviews']],
        successMessage: "Review submitted successfully!",
        errorContext: "Create Review",
        setError: options?.setError,
    });
}

export function useUpdateReview(options?: BaseMutationOptions) {
    return useGlobalMutation<Review, { id: number; payload: UpdateReviewInput }>({
        mutationFn: ({ id, payload }) => updateReview(id, payload),
        invalidateQueries: [['reviews']],
        successMessage: "Review updated successfully!",
        errorContext: "Update Review",
        setError: options?.setError,
    });
}

export function useDeleteReview(options?: BaseMutationOptions) {
    return useGlobalMutation<any, number>({
        mutationFn: deleteReview,
        invalidateQueries: [['reviews']],
        successMessage: "Review deleted successfully.",
        errorContext: "Delete Review",
        setError: options?.setError,
    });
}
