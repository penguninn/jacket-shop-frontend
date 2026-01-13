import { useQuery } from "@tanstack/react-query";
import { getReviews, deleteReview, updateReview } from "../api";
import type { ReviewFilterParams, UpdateReviewInput, Review } from "../model/schemas";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import type { BaseMutationOptions } from "@/shared/api/types";

export const reviewKeys = {
    all: ['reviews'] as const,
    lists: () => [...reviewKeys.all, 'list'] as const,
    list: (params: ReviewFilterParams) => [...reviewKeys.lists(), params] as const,
};

export function useReviews(params: ReviewFilterParams) {
    return useQuery({
        queryKey: reviewKeys.list(params),
        queryFn: () => getReviews(params),
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
