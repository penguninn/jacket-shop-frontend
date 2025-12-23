import { httpPrivateTyped, httpPublicTyped } from "@/shared/api/http-typed";
import {
    reviewSchema,
    reviewsResponseSchema,
    type ReviewFilterParams,
    type CreateReviewInput
} from "../model/schemas";
import { z } from "zod";

const ENDPOINTS = Object.freeze({
    REVIEWS: '/reviews',
    REVIEWS_BY_PRODUCT: (id: number) => `/reviews/product/${id}`,
    REVIEW_BY_ID: (id: number) => `/reviews/${id}`,
} as const);

export async function createReview(payload: CreateReviewInput) {
    return await httpPrivateTyped.post(
        ENDPOINTS.REVIEWS,
        payload,
        reviewSchema
    );
}

export async function getReviewsByProductId(productId: number, params: ReviewFilterParams) {
    const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
    });

    if (params.sortBy) {
        queryParams.append('sort', params.sortBy);
    }

    return await httpPublicTyped.get(
        `${ENDPOINTS.REVIEWS_BY_PRODUCT(productId)}?${queryParams.toString()}`,
        reviewsResponseSchema
    );
}

export async function deleteReview(id: number) {
    return await httpPrivateTyped.del(
        ENDPOINTS.REVIEW_BY_ID(id),
        z.null().or(z.any())
    );
}

export async function getAllReviews(params: ReviewFilterParams) {
    const queryParams = new URLSearchParams({
        page: params.page.toString(),
        size: params.size.toString(),
    });

    if (params.search) {
        queryParams.append('keyword', params.search);
    }

    if (params.rating !== undefined && params.rating !== null) {
        queryParams.append('rating', params.rating.toString());
    }

    // Backend expects 'latest' or 'oldest' specifically for the logic provided by user
    if (params.sortBy) {
        queryParams.append('sort', params.sortBy);
    }

    // Attempting GET /api/reviews or /api/reviews/search depending on if filters exist
    // IMPORTANT: The base GET /api/reviews endpoint provided by user DOES NOT support sorting params.
    // The GET /api/reviews/search endpoint DOES support sorting.
    // So if sortBy is present, we must switch to /search endpoint.
    const hasFilters = params.search || (params.rating !== undefined && params.rating !== null) || !!params.sortBy;
    const endpoint = hasFilters ? `${ENDPOINTS.REVIEWS}/search` : ENDPOINTS.REVIEWS;

    return await httpPrivateTyped.get(
        `${endpoint}?${queryParams.toString()}`,
        reviewsResponseSchema
    );
}
