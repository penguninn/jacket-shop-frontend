import { ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Input } from "@/shared/ui/input";
import { CartItem } from "./CartItem";
import { useCart } from "../hooks";
import { formatCurrency } from "@/shared/utils/format";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";

export function CartList() {
    const { data: cart, isLoading } = useCart();
    const items = cart?.items || [];

    const totalPrice = items.reduce((sum, item) => {
        const price = item.productVariant.salePrice ?? item.productVariant.price;
        return sum + price * item.quantity;
    }, 0);

    const discount = 0; // Placeholder for logic
    const deliveryFee = 15; // Placeholder
    const finalTotal = totalPrice - discount + deliveryFee;

    if (isLoading) {
        return <div className="py-20 text-center">Loading cart...</div>;
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-dashed text-center min-h-[60vh]">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Looks like you haven't added any items to the cart yet. Start shopping to fill it up!
                </p>
                <Link to="/">
                    <Button size="lg" className="rounded-full px-8 bg-black hover:bg-black/90">
                        Start Shopping
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Cart</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-4xl font-black uppercase tracking-tight text-black">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 sticky top-24">
                        <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-bold text-gray-900">{formatCurrency(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-600">
                                <span>Discount (-0%)</span>
                                <span className="font-bold text-red-500">-{formatCurrency(discount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-600">
                                <span>Delivery Fee</span>
                                <span className="font-bold text-gray-900">{formatCurrency(deliveryFee)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>{formatCurrency(finalTotal)}</span>
                            </div>
                        </div>

                        {/* Promo Code */}
                        <div className="mb-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Add promo code"
                                        className="rounded-full bg-gray-100 border-none pl-10 h-10 lg:text-sm"
                                    />
                                </div>
                                <Button className="rounded-full bg-black hover:bg-black/90 h-10 px-6">
                                    Apply
                                </Button>
                            </div>
                        </div>


                        <Button className="w-full h-12 rounded-full text-base font-bold bg-black hover:bg-black/90 flex justify-center items-center gap-2 group">
                            Go to Checkout
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
