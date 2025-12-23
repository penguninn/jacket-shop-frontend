import { z } from "zod";
import { pageResponseSchema, type BaseFilterParams } from "@/shared/api/schemas";

export const reviewSchema = z.object({
    id: z.number().nullish(), // Relaxed
    productId: z.number().nullish(),
    productName: z.string().nullish(),
    userId: z.number().nullish(),
    userName: z.string().nullish(),
    orderId: z.number().nullish(),
    rating: z.number().min(1).max(5).nullish(),
    comment: z.string().nullish(), // Removed max length check for receiving to be safe
    createdAt: z.any(), // Allow string, array, or number
    updatedAt: z.any(),
});

export const reviewsResponseSchema = pageResponseSchema(reviewSchema);

export const createReviewSchema = z.object({
    productId: z.number(),
    orderId: z.number().optional(),
    rating: z.number().min(1).max(5),
    comment: z.string().max(800).optional(),
});

export interface ReviewFilterParams extends BaseFilterParams {
    productId?: number;
    rating?: number;
}

export type Review = z.infer<typeof reviewSchema>;
export type ReviewResponse = z.infer<typeof reviewSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReviewRequest = CreateReviewInput;
export type ReviewsResponse = z.infer<typeof reviewsResponseSchema>;
