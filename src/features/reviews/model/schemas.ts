import { z } from "zod";
import { pageResponseSchema, type BaseFilterParams } from "@/shared/api/schemas";

// Review Response Schema (matches Java ReviewResponse)
export const reviewSchema = z.object({
    id: z.number(),
    productId: z.number().nullable(),
    productName: z.string().nullable(),
    userId: z.number().nullable(),
    userName: z.string().nullable(),
    orderId: z.number().nullable(),
    rating: z.number().min(1).max(5),
    comment: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(), // LocalDateTime as string
    updatedAt: z.string().nullable().optional(),
});

export const reviewsResponseSchema = pageResponseSchema(reviewSchema);

// Review Create Schema
export const createReviewSchema = z.object({
    productId: z.number(),
    orderId: z.number(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

// Review Update Schema (matches Java ReviewUpdateRequest)
export const updateReviewSchema = z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

// Review Filter Schema (matches Java ReviewFilterRequest)
export interface ReviewFilterParams extends BaseFilterParams {
    productId?: number;
    userId?: number;
    orderId?: number;
    rating?: number;
    minRating?: number;
    maxRating?: number;
}

export type Review = z.infer<typeof reviewSchema>;
export type ReviewResponse = z.infer<typeof reviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewsResponse = z.infer<typeof reviewsResponseSchema>;
