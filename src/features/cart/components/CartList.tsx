import { useState, useEffect, useRef } from "react";
import { ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Input } from "@/shared/ui/input";
import { CartItem } from "./CartItem";
import { CartValidationIssuesDialog } from "./CartValidationIssuesDialog";
import { useCart, useValidateCart } from "../hooks";
import { type CartValidationResponse } from "../model";
import { formatCurrency } from "@/shared/utils/format";
import { type Coupon } from "@/features/coupons/model";
import { useValidateCoupon } from "@/features/coupons/hooks";
import { toast } from "sonner";
import { X } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";

export function CartList() {
    const navigate = useNavigate();
    const { data: cart, isLoading, dataUpdatedAt } = useCart();
    const validateCart = useValidateCart();

    const [validationIssues, setValidationIssues] = useState<CartValidationResponse["issues"]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Coupon state
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const { mutateAsync: validateCoupon, isPending: isCheckingCoupon } = useValidateCoupon();

    // Track if we've done the initial load
    const isInitialMount = useRef(true);
    const previousDataUpdatedAt = useRef(dataUpdatedAt);

    const items = cart?.items || [];

    const totalPrice = cart?.totalPrice ?? 0;

    // Re-validate coupon when cart data changes (after initial load)
    useEffect(() => {
        // Skip on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            previousDataUpdatedAt.current = dataUpdatedAt;
            return;
        }

        // Only trigger when dataUpdatedAt actually changes (cart was modified)
        if (appliedCoupon && dataUpdatedAt !== previousDataUpdatedAt.current && totalPrice > 0) {
            previousDataUpdatedAt.current = dataUpdatedAt;

            // Re-validate the coupon with the new total
            validateCoupon({ code: appliedCoupon.code, orderAmount: totalPrice })
                .then((coupon) => {
                    setAppliedCoupon(coupon);
                })
                .catch(() => {
                    // Coupon is no longer valid (e.g., total dropped below minimum)
                    setAppliedCoupon(null);
                    setCouponCode("");
                    toast.warning("Coupon removed", {
                        description: "The coupon is no longer valid for your updated cart.",
                    });
                });
        } else if (appliedCoupon && totalPrice === 0) {
            // Cart is empty, remove coupon
            setAppliedCoupon(null);
            setCouponCode("");
        }

        previousDataUpdatedAt.current = dataUpdatedAt;
    }, [dataUpdatedAt, appliedCoupon, totalPrice, validateCoupon]);

    // Calculate discount
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === "PERCENT") {
            discount = (totalPrice * appliedCoupon.value) / 100;
            if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
                discount = appliedCoupon.maxDiscount;
            }
        } else {
            discount = appliedCoupon.value;
        }
    }
    // Ensure discount doesn't exceed total price
    if (discount > totalPrice) {
        discount = totalPrice;
    }

    const finalTotal = totalPrice - discount;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        try {
            const coupon = await validateCoupon({ code: couponCode, orderAmount: totalPrice });
            setAppliedCoupon(coupon);

            const savedAmount = coupon.type === 'PERCENT'
                ? (totalPrice * (coupon.value / 100))
                : coupon.value;
            toast.success("Coupon Applied", {
                description: `You saved ${formatCurrency(savedAmount)}`,
            });
        } catch {
            // Error is already handled by useGlobalMutation
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
    };

    const handleCheckout = async () => {
        try {
            const result = await validateCart.mutateAsync();
            if (result.valid) {
                navigate("/checkout", { state: { appliedCoupon } });
            } else {
                setValidationIssues(result.issues);
                setIsDialogOpen(true);
            }
        } catch (error) {
            console.error("Cart validation failed", error);
            // Optionally show a toast here
        }
    };

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
                                <span>Discount</span>
                                <span className="font-bold text-red-500">-{formatCurrency(discount)}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>{formatCurrency(finalTotal)}</span>
                            </div>
                        </div>

                        {/* Promo Code */}
                        <div className="mb-6">
                            {appliedCoupon ? (
                                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-green-600" />
                                            <span className="font-bold text-green-700">
                                                {appliedCoupon.code}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-green-600 hover:text-green-700 hover:bg-green-100 -mr-1 -mt-1"
                                            onClick={handleRemoveCoupon}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="text-sm text-green-600 pl-6">
                                        {appliedCoupon.type === 'PERCENT' ? (
                                            <>
                                                Discount {appliedCoupon.value}%
                                                {appliedCoupon.maxDiscount && ` (Max ${formatCurrency(appliedCoupon.maxDiscount)})`}
                                            </>
                                        ) : (
                                            <>Discount {formatCurrency(appliedCoupon.value)}</>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Add promo code"
                                            className="rounded-full bg-gray-100 border-none pl-10 h-10 lg:text-sm"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleApplyCoupon();
                                            }}
                                        />
                                    </div>
                                    <Button
                                        className="rounded-full bg-black hover:bg-black/90 h-10 px-6"
                                        onClick={handleApplyCoupon}
                                        disabled={isCheckingCoupon || !couponCode.trim()}
                                    >
                                        {isCheckingCoupon ? "..." : "Apply"}
                                    </Button>
                                </div>
                            )}
                        </div>


                        <Button
                            className="w-full h-12 rounded-full text-base font-bold bg-black hover:bg-black/90 flex justify-center items-center gap-2 group"
                            onClick={handleCheckout}
                            disabled={validateCart.isPending}
                        >
                            {validateCart.isPending ? "Validating..." : "Go to Checkout"}
                            {!validateCart.isPending && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                        </Button>
                    </div>
                </div>
            </div>

            <CartValidationIssuesDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                issues={validationIssues}
            />
        </div>
    );
}
