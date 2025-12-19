import { z } from "zod";
import {
    cartItemRequestSchema,
    cartResponseSchema,
    cartItemResponseSchema
} from "./schemas";

export type CartItemRequest = z.infer<typeof cartItemRequestSchema>;
export type CartResponse = z.infer<typeof cartResponseSchema>;
export type CartItemResponse = z.infer<typeof cartItemResponseSchema>;

export * from "./schemas";
