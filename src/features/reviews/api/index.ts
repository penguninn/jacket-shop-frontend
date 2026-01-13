import { httpPrivateTyped } from "@/shared/api/http-typed";
import {
    reviewSchema,
    reviewsResponseSchema,
    type ReviewFilterParams,
    type UpdateReviewInput
} from "../model/schemas";
import { z } from "zod";

const ENDPOINTS = {
    REVIEWS: '/reviews',
    REVIEW_BY_ID: (id: number) => `/reviews/${id}`,
};

export async function getReviews(params: ReviewFilterParams) {
    const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
    });

    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);

    if (params.productId) queryParams.append('productId', params.productId.toString());
    if (params.userId) queryParams.append('userId', params.userId.toString());
    if (params.orderId) queryParams.append('orderId', params.orderId.toString());
    if (params.rating) queryParams.append('rating', params.rating.toString());
    if (params.minRating) queryParams.append('minRating', params.minRating.toString());
    if (params.maxRating) queryParams.append('maxRating', params.maxRating.toString());

    return await httpPrivateTyped.get(
        `${ENDPOINTS.REVIEWS}?${queryParams.toString()}`,
        reviewsResponseSchema
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
