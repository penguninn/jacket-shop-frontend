import { useState, useEffect } from "react";
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
    const { product, color, size, material, price, salePrice, image, discountPercentage } = productVariant;
    const productName = product?.name || "Unknown Product";
    const displayPrice = salePrice ?? price;
    const imageUrl = image || product?.thumbnail;
    const isOnSale = (salePrice !== null && salePrice !== undefined && salePrice < price);

    // Local state for quantity input to allow typing
    const [localQuantity, setLocalQuantity] = useState<string>(quantity.toString());

    useEffect(() => {
        setLocalQuantity(quantity.toString());
    }, [quantity]);

    const handleQuantityChange = (newQty: number) => {
        if (newQty < 1) return;
        updateMutation.mutate({ itemId: item.id, quantity: newQty });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow valid positive numbers or empty string (while typing)
        const val = e.target.value;
        if (val === "" || /^[0-9]+$/.test(val)) {
            setLocalQuantity(val);
        }
    };

    const handleInputBlur = () => {
        const parsed = parseInt(localQuantity);
        if (isNaN(parsed) || parsed < 1) {
            // Revert to current prop value if invalid
            setLocalQuantity(quantity.toString());
        } else if (parsed !== quantity) {
            // Commit change
            handleQuantityChange(parsed);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.currentTarget.blur();
        }
    };

    const handleRemove = () => {
        removeMutation.mutate(item.id);
    };

    if (issheet) {
        return (
            <div className={cn("flex gap-4 py-4 relative group", className)}>
                {/* Badge for Sale in Sheet */}
                {isOnSale && (
                    <div className="absolute top-4 left-0 z-10 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-r-sm shadow-sm">
                        -{discountPercentage ?? Math.round(((price - salePrice) / price) * 100)}%
                    </div>
                )}
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                    {imageUrl ? (
                        <img src={imageUrl} alt={productName} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Img</div>
                    )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium line-clamp-1 text-sm pr-2">{productName}</h4>
                            <div className="flex flex-col items-end">
                                <span className={cn("text-sm font-semibold", isOnSale && "text-red-600")}>
                                    {formatCurrency(displayPrice * quantity)}
                                </span>
                                {isOnSale && (
                                    <span className="text-[10px] text-gray-400 line-through">
                                        {formatCurrency(price * quantity)}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                            <p>{size.name} / {color.name}</p>
                            <p>{material.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 h-8">
                            <button
                                disabled={updateMutation.isPending || quantity <= 1}
                                onClick={() => handleQuantityChange(quantity - 1)}
                                className="p-1 text-gray-600 hover:text-black disabled:opacity-30"
                            >
                                <Minus className="h-3 w-3" />
                            </button>
                            <input
                                type="text"
                                value={localQuantity}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                onKeyDown={handleKeyDown}
                                className="w-8 text-center bg-transparent text-xs font-medium focus:outline-none"
                            />
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
            {/* Sale Badge */}
            {isOnSale && (
                <div className="absolute -top-2 -left-2 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    sale -{discountPercentage ?? Math.round(((price - salePrice) / price) * 100)}%
                </div>
            )}

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
                        <p><span className="text-gray-400">Material:</span> <span className="text-gray-900 font-medium">{material.name}</span></p>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <span className={cn("text-xl font-bold", isOnSale ? "text-red-600" : "text-gray-900")}>
                            {formatCurrency(displayPrice)}
                        </span>
                        {isOnSale && (
                            <span className="text-sm text-gray-400 line-through">
                                {formatCurrency(price)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Quantity Control - Bottom Right in layout relative to content or flex row */}
                <div className="sm:absolute sm:bottom-4 sm:right-4 mt-4 sm:mt-0 flex justify-end">
                    <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                        <button
                            disabled={updateMutation.isPending || quantity <= 1}
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className="text-gray-600 hover:text-black disabled:opacity-30 transition-colors"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <input
                            type="text"
                            value={localQuantity}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            onKeyDown={handleKeyDown}
                            className="w-10 text-center bg-transparent font-semibold text-gray-900 focus:outline-none"
                        />
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
