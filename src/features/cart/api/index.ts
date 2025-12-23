import { z } from "zod";
import { httpPrivateTyped } from "@/shared/api/http-typed";
import {
    cartResponseSchema,
    cartValidationResponseSchema,
    type CartValidationResponse,
    type CartItemRequest,
    type CartResponse
} from "../model";

const BASE_URI = "/me/cart";

export const cartApi = {
    getCart: async () => {
        return httpPrivateTyped.get<CartResponse>(
            `${BASE_URI}`,
            cartResponseSchema
        );
    },

    countMyCartItems: async () => {
        return httpPrivateTyped.get<number>(
            `${BASE_URI}/count`,
            z.number()
        );
    },

    addToCart: async (data: CartItemRequest) => {
        return httpPrivateTyped.post<CartResponse>(
            `${BASE_URI}/items`,
            data,
            cartResponseSchema
        );
    },

    updateCartItem: async (itemId: number, quantity: number) => {
        return httpPrivateTyped.put<CartResponse>(
            `${BASE_URI}/items/${itemId}`,
            {},
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
            z.void().or(z.unknown()) as any
        );
    },

    validateCart: async () => {
        return httpPrivateTyped.post<CartValidationResponse>(
            `${BASE_URI}/validate`,
            {},
            cartValidationResponseSchema
        );
    }
};
