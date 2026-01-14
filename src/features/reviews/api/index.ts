import { httpPrivateTyped, httpPublicTyped } from "@/shared/api/http-typed";
import {
    reviewSchema,
    reviewsResponseSchema,
    type ReviewFilterParams,
    type UpdateReviewInput,
    type CreateReviewInput
} from "../model/schemas";
import { z } from "zod";

const ENDPOINTS = {
    REVIEWS: '/reviews',
    REVIEWS_BY_PRODUCT: (productId: number) => `/reviews/product/${productId}`,
    REVIEW_BY_ID: (id: number) => `/reviews/${id}`,
};

// Public API to get reviews for a product
export async function getReviewsByProduct(productId: number, params: Omit<ReviewFilterParams, 'productId'>) {
    const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
    });

    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);

    return await httpPublicTyped.get(
        `${ENDPOINTS.REVIEWS_BY_PRODUCT(productId)}?${queryParams.toString()}`,
        reviewsResponseSchema
    );
}

// Private API for authenticated users (Admin/Staff management or generic search if supported)
export async function getReviews(params: ReviewFilterParams) {
    const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
    });

    // Add other filters as needed
    if (params.productId) queryParams.append('productId', params.productId.toString());
    if (params.userId) queryParams.append('userId', params.userId.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);

    return await httpPrivateTyped.get(
        `${ENDPOINTS.REVIEWS}?${queryParams.toString()}`,
        reviewsResponseSchema
    );
}

export async function createReview(payload: CreateReviewInput) {
    return await httpPrivateTyped.post(
        ENDPOINTS.REVIEWS,
        payload,
        reviewSchema
    );
}

export async function updateReview(id: number, payload: UpdateReviewInput) {
    return await httpPrivateTyped.put(
        ENDPOINTS.REVIEW_BY_ID(id),
        payload,
        reviewSchema
    );
}

export async function deleteReview(id: number) {
    return await httpPrivateTyped.del(
        ENDPOINTS.REVIEW_BY_ID(id),
        z.any()
    );
}
