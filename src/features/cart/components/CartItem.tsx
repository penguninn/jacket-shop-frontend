import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/shared/utils/format";
import type { CartItemResponse } from "../model";
import { useUpdateCartItem, useRemoveCartItem } from "../hooks";
import { cn } from "@/shared/lib/utils";

interface CartItemProps {
    item: CartItemResponse;
    className?: string;
    issheet?: boolean;
}

export function CartItem({ item, className, issheet = false }: CartItemProps) {
    const updateMutation = useUpdateCartItem();
    const removeMutation = useRemoveCartItem();

    const { productVariant, quantity } = item;
    const { product, color, size, price, salePrice, image } = productVariant;
    const productName = product?.name || "Unknown Product";
    const displayPrice = salePrice ?? price;
    const imageUrl = image || product?.thumbnail;

    const handleQuantityChange = (newQty: number) => {
        if (newQty < 1) return;
        updateMutation.mutate({ itemId: item.id, quantity: newQty });
    };

    const handleRemove = () => {
        removeMutation.mutate(item.id);
    };

    if (issheet) {
        // Keep the compact design for the sheet, or adjust slightly if needed.
        // For now, preserving the "sheet" look but using the logic from original component might be safer if the user liked it.
        // But the prompts asked to "look like img" which usually implies the main page.
        // I will keep the sheet design relatively simple but consistent.
        return (
            <div className={cn("flex gap-4 py-4", className)}>
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                    {imageUrl ? (
                        <img src={imageUrl} alt={productName} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                    <div>
                        <div className="flex justify-between">
                            <h4 className="font-medium line-clamp-1 text-sm">{productName}</h4>
                            <span className="text-sm font-semibold">{formatCurrency(displayPrice * quantity)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{size.name} / {color.name}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-2 py-1 h-8">
                            <button
                                disabled={updateMutation.isPending || quantity <= 1}
                                onClick={() => handleQuantityChange(quantity - 1)}
                                className="p-1 text-gray-600 hover:text-black disabled:opacity-30"
                            >
                                <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-medium w-4 text-center">{quantity}</span>
                            <button
                                disabled={updateMutation.isPending}
                                onClick={() => handleQuantityChange(quantity + 1)}
                                className="p-1 text-gray-600 hover:text-black disabled:opacity-30"
                            >
                                <Plus className="h-3 w-3" />
                            </button>
                        </div>
                        <button
                            onClick={handleRemove}
                            disabled={removeMutation.isPending}
                            className="text-red-500 hover:text-red-700 p-1"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Main Cart Page Design (Card Style)
    return (
        <div className={cn("flex flex-col sm:flex-row gap-6 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm relative", className)}>
            {/* Delete Button (Absolute Top Right for desktop, or separate for mobile) */}
            <button
                onClick={handleRemove}
                disabled={removeMutation.isPending}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors p-1"
                aria-label="Remove item"
            >
                <Trash2 className="h-5 w-5" />
            </button>

            {/* Image */}
            <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                {imageUrl ? (
                    <img src={imageUrl} alt={productName} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Img</div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between pt-1 pb-1 pr-8">
                <div>
                    <div className="flex justify-between items-start">
                        <Link to={`/products/${product?.id}`} className="text-lg font-bold text-gray-900 hover:underline">
                            {productName}
                        </Link>
                    </div>
                    <div className="mt-1 space-y-1 text-sm text-gray-500">
                        <p><span className="text-gray-400">Size:</span> <span className="text-gray-900 font-medium">{size.name}</span></p>
                        <p><span className="text-gray-400">Color:</span> <span className="text-gray-900 font-medium">{color.name}</span></p>
                    </div>
                    <div className="mt-3 text-xl font-bold text-gray-900">
                        {formatCurrency(displayPrice)}
                    </div>
                </div>

                {/* Quantity Control - Bottom Right in layout relative to content or flex row */}
                {/* In the design, it seems aligned to the right or bottom. Let's put it on the right bottom of the content area */}
                <div className="sm:absolute sm:bottom-4 sm:right-4 mt-4 sm:mt-0 flex justify-end">
                    <div className="flex items-center gap-4 rounded-full bg-gray-100 px-4 py-2">
                        <button
                            disabled={updateMutation.isPending || quantity <= 1}
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="text-gray-600 hover:text-black disabled:opacity-30 transition-colors"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-gray-900 w-4 text-center">{quantity}</span>
                        <button
                            disabled={updateMutation.isPending}
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="text-gray-600 hover:text-black disabled:opacity-30 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
