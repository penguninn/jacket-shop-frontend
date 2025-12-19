import { z } from "zod";
import { httpPrivateTyped } from "@/shared/api/http-typed";
import {
    cartResponseSchema,
    type CartItemRequest,
    type CartResponse
} from "../model";

const BASE_URI = "/cart";

export const cartApi = {
    getCart: async () => {
        return httpPrivateTyped.get<CartResponse>(
            `${BASE_URI}`,
            cartResponseSchema
        );
    },

    addToCart: async (data: CartItemRequest) => {
        return httpPrivateTyped.post<CartResponse>(
            `${BASE_URI}`,
            data,
            cartResponseSchema
        );
    },

    updateCartItem: async (itemId: number, quantity: number) => {
        return httpPrivateTyped.put<CartResponse>(
            `${BASE_URI}/items/${itemId}`,
            {}, // The controller uses @RequestParam for quantity, not RequestBody?
            // Wait, let me check the Controller again.
            // @PutMapping("/items/{itemId}") updateCartItem(..., @RequestParam Integer quantity)
            // So the body is likely empty, and quantity is a query param.
            cartResponseSchema,
            { params: { quantity } }
        );
    },

    removeCartItem: async (itemId: number) => {
        return httpPrivateTyped.del<CartResponse>(
            `${BASE_URI}/items/${itemId}`,
            cartResponseSchema
        );
    },

    clearCart: async () => {
        return httpPrivateTyped.del<void>(
            `${BASE_URI}`,
            z.void().or(z.unknown()) as any // Assuming ApiResponse with null/void data
        );
    }
};
