import { useCart } from "@/features/cart/hooks";
import { formatCurrency } from "@/shared/utils/format";

export function CheckoutProducts() {
    const { data: cart } = useCart();

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

                const price = variant.salePrice ?? variant.price;
                const subtotal = price * item.quantity;

                return (
                    <div key={item.id} className="border-b pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">

                        <div className="flex items-center text-sm">
                            <div className="w-[50%] flex gap-4">
                                <img
                                    src={variant.image || "/placeholder.png"}
                                    alt={variant.sku || "Product"}
                                    className="w-16 h-16 object-cover border rounded-sm"
                                />
                                <div className="pr-4">
                                    <p className="line-clamp-2 mb-1">{variant.sku}</p>
                                    <p className="text-gray-500 text-xs">
                                        Variation: {variant.color.name}, {variant.size.name}, {variant.material.name}
                                    </p>
                                </div>
                            </div>
                            <div className="w-[15%] text-center">
                                {formatCurrency(price)}
                            </div>
                            <div className="w-[15%] text-center">
                                {item.quantity}
                            </div>
                            <div className="w-[20%] text-right font-medium text-red-500">
                                {formatCurrency(subtotal)}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
