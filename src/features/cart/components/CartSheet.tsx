import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { useCart, useCartCount } from "../hooks";
import { CartItem } from "./CartItem";
import { formatCurrency } from "@/shared/utils/format";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/shared/ui/sheet";

export function CartSheet() {
    const { data: cart } = useCart();
    const items = cart?.items || [];

    const totalPrice = items.reduce((sum, item) => {
        const price = item.productVariant.salePrice ?? item.productVariant.price;
        return sum + price * item.quantity;
    }, 0);

    const { data: cartItemsCount } = useCartCount();
    const itemCount = cartItemsCount ?? 0;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                            {itemCount > 9 ? "9+" : itemCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-md p-4">
                <SheetHeader className="px-1">
                    <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
                </SheetHeader>
                <Separator className="mt-4" />

                {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-2 pb-20">
                        <ShoppingCart className="h-12 w-12 text-gray-300" />
                        <p className="text-lg font-medium text-gray-900">Your cart is empty</p>
                        <p className="text-sm text-gray-500">Looks like you haven't added anything yet.</p>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="mt-4">
                                Continue Shopping
                            </Button>
                        </SheetTrigger>
                    </div>
                ) : (
                    <>
                        {/* Scrollable Items Area */}
                        <div className="flex-1 overflow-y-auto pr-6">
                            <ul className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <li key={item.id}>
                                        <CartItem item={item} issheet />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Footer / Checkout */}
                        <div className="space-y-4 pr-6 pt-6 pb-6">
                            <Separator />
                            <div className="space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-500">Subtotal</span>
                                    <span className="font-semibold text-gray-900">{formatCurrency(totalPrice)}</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Shipping and taxes calculated at checkout.
                                </p>
                            </div>
                            <div className="grid gap-3">
                                <SheetClose asChild>
                                    <Link to="/cart">
                                        <Button className="w-full" variant="outline">
                                            View Cart
                                        </Button>
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link to="/checkout">
                                        <Button className="w-full bg-black hover:bg-black/90">
                                            Checkout
                                        </Button>
                                    </Link>
                                </SheetClose>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
