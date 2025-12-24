import type { Product } from "../model/schemas";
import { formatCurrency } from "@/shared/utils/format";

import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/lib/utils";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {

    const minPrice = product.minPrice || 0;
    const maxPrice = product.maxPrice || 0;
    const rating = product.ratingAverage || 4.5;
    const soldCount = product.soldCount || 0;
    const description =
        product.description ||
        "Soft fleece pullover with iconic Nike Air branding and comfort fit.";
    return (
        <div className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden border border-black/5 shadow-lg transition-all duration-300">
            <Link to={`/products/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-[#F2F0F1]">
                    <img
                        src={product.thumbnail || "/placeholder.png"}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>

            <div className="flex flex-col flex-1 px-4 py-4">
                <Link to={`/products/${product.id}`}>
                    <h3 className="font-bold text-base leading-tight mb-1 text-black truncate">
                        {product.name}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-sm text-black/60 line-clamp-2 mb-3 h-[40px]">
                    {description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">

                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-[#FF6900]">
                            {minPrice === maxPrice ? formatCurrency(minPrice) : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
                        </span>
                    </div>
                </div>

                <div className="flex items-end justify-between gap-2 mt-2 pt-2 border-t border-black/5">
                    <div className="flex text-[#FFC633]">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "w-4 h-4",
                                    i < Math.floor(rating)
                                        ? "fill-current"
                                        : "fill-muted text-gray-300"
                                )}
                                strokeWidth={0}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-black/60">
                        {soldCount} sold
                    </span>
                </div>
            </div>
        </div>
    );
}
