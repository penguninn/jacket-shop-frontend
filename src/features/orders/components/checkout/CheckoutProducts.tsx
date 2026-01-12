import { formatCurrency } from "@/shared/utils/format";
import { Badge } from "@/shared/ui/badge";
import type { CartResponse } from "@/features/cart/model";

export interface CheckoutProductsProps {
    cart: CartResponse | null | undefined;
}

export function CheckoutProducts({ cart }: CheckoutProductsProps) {

    if (!cart?.items.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                No items to checkout.
            </div>
        );
    }
    return (
        <div>
            <div className="flex justify-between items-center mb-4 text-gray-500 text-sm">
                <div className="w-[50%] text-left">Products Ordered</div>
                <div className="w-[15%] text-center">Unit Price</div>
                <div className="w-[15%] text-center">Amount</div>
                <div className="w-[20%] text-right">Item Subtotal</div>
            </div>

            {cart.items.map((item) => {
                const variant = item.productVariant;

                const originalPrice = variant.price;
                const salePrice = variant.salePrice;
                const isOnSale = salePrice !== null && salePrice !== undefined && salePrice < originalPrice;
                const displayPrice = isOnSale ? salePrice : originalPrice;
                const subtotal = displayPrice * item.quantity;

                return (
                    <div key={item.id} className="border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">

                        <div className="flex items-center text-sm">
                            <div className="w-[50%] flex gap-4">
                                <div className="relative">
                                    <img
                                        src={variant.image || "/placeholder.png"}
                                        alt={variant.sku || "Product"}
                                        className="w-16 h-16 object-cover border rounded-sm"
                                    />
                                    {isOnSale && (
                                        <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5">
                                            Sale
                                        </Badge>
                                    )}
                                </div>
                                <div className="pr-4">
                                    <p className="font-medium">{variant.productName}</p>
                                    <p className="line-clamp-2 mb-1">{variant.sku}</p>
                                    <p className="text-gray-500 text-xs">
                                        Variation: {variant.color.name}, {variant.size.name}, {variant.material.name}
                                    </p>
                                </div>
                            </div>
                            <div className="w-[15%] text-center">
                                <div className="flex flex-col items-center">
                                    <span className={isOnSale ? "text-red-600 font-medium" : ""}>
                                        {formatCurrency(displayPrice)}
                                    </span>
                                    {isOnSale && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {formatCurrency(originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="w-[15%] text-center">
                                {item.quantity}
                            </div>
                            <div className="w-[20%] text-right">
                                <div className="flex flex-col items-end">
                                    <span className={`font-medium ${isOnSale ? "text-red-600" : "text-red-500"}`}>
                                        {formatCurrency(subtotal)}
                                    </span>
                                    {isOnSale && (
                                        <span className="text-xs text-gray-400 line-through">
                                            {formatCurrency(originalPrice * item.quantity)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

