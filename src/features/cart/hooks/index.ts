import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "../api";
import type { CartItemRequest } from "../model";

const CART_KEYS = {
    all: ["cart"] as const,
};

export const useCart = () => {
    return useQuery({
        queryKey: CART_KEYS.all,
        queryFn: cartApi.getCart,
        retry: false,
        staleTime: 1000 * 60,
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CartItemRequest) => cartApi.addToCart(data),
        onSuccess: () => {
            toast.success("Added to cart");
            queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
        },
        onError: (error: any) => {
            toast.error(error?.detail || "Failed to add to cart");
        },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
            cartApi.updateCartItem(itemId, quantity),
        onSuccess: () => {
            // Optional: toast.success("Cart updated"); -- usually too noisy for quantity change
            queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
        },
        onError: (error: any) => {
            toast.error(error?.detail || "Failed to update cart");
        },
    });
};

export const useRemoveCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: number) => cartApi.removeCartItem(itemId),
        onSuccess: () => {
            toast.success("Item removed from cart");
            queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
        },
        onError: (error: any) => {
            toast.error(error?.detail || "Failed to remove item");
        },
    });
};

export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.clearCart,
        onSuccess: () => {
            toast.success("Cart cleared");
            queryClient.invalidateQueries({ queryKey: CART_KEYS.all });
        },
        onError: (error: any) => {
            toast.error(error?.detail || "Failed to clear cart");
        },
    });
};

export const useCartCount = () => {
    return useQuery({
        queryKey: [...CART_KEYS.all, "count"],
        queryFn: cartApi.countMyCartItems,
        retry: false,
    });
};

export const useValidateCart = () => {
    return useMutation({
        mutationFn: cartApi.validateCart,
    });
};
