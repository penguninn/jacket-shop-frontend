import { useQuery } from "@tanstack/react-query";
import { createReview, deleteReview, getAllReviews, getReviewsByProductId } from "../api";
import type { ReviewFilterParams, CreateReviewInput, Review } from "../model/schemas";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import type { BaseMutationOptions } from "@/shared/api/types";

export const reviewKeys = {
    all: ['reviews'] as const,
    lists: () => [...reviewKeys.all, 'list'] as const,
    list: (params: ReviewFilterParams) => [...reviewKeys.lists(), params] as const,
    byProduct: (productId: number, params: ReviewFilterParams) => [...reviewKeys.all, 'product', productId, params] as const,
};

export function useReviewsByProduct(productId: number, params: ReviewFilterParams) {
    return useQuery({
        queryKey: reviewKeys.byProduct(productId, params),
        queryFn: () => getReviewsByProductId(productId, params),
        enabled: !!productId
    });
}

export function useAllReviews(params: ReviewFilterParams) {
    return useQuery({
        queryKey: reviewKeys.list(params),
        queryFn: () => getAllReviews(params),
        // If the backend doesn't support this, it will error. 
        // We can add retry: false if we suspect it might fail.
        retry: 1,
    });
}

export function useCreateReview(options?: BaseMutationOptions) {
    return useGlobalMutation<Review, CreateReviewInput>({
        mutationFn: createReview,
        invalidateQueries: [
            ['reviews'],
            ['products'], // To update rating counts/averages
        ],
        successMessage: "Review submitted successfully!",
        errorContext: "Submit Review",
        setError: options?.setError,
    });
}

export function useDeleteReview(options?: BaseMutationOptions) {
    return useGlobalMutation<any, number>({
        mutationFn: deleteReview,
        invalidateQueries: [
            ['reviews'],
            ['products']
        ],
        successMessage: "Review deleted successfully.",
        errorContext: "Delete Review",
        setError: options?.setError,
    });
}
