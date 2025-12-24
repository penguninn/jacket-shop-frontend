import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "@/features/cart/hooks";
import { useCreateOrder } from "@/features/orders/hooks";
import { useCreatePaymentLink } from "@/features/payos/hooks";
import { toast } from "sonner";
import { AddressSection } from "@/features/orders/components/checkout/AddressSection";
import { CheckoutProducts } from "@/features/orders/components/checkout/CheckoutProducts";
import { CheckoutShipping } from "@/features/orders/components/checkout/CheckoutShipping";
import { CheckoutPayment } from "@/features/orders/components/checkout/CheckoutPayment";
import type { AddressResponse } from "@/features/address/model";
import { Button } from "@/shared/ui/button";
import { formatCurrency } from "@/shared/utils/format";
import { useShippingRates } from "@/features/shipping/hooks";
import { useLocation } from "react-router-dom";
import { type Coupon } from "@/features/coupons/model";
import { useValidateCoupon } from "@/features/coupons/hooks";
import { X, Loader2 } from "lucide-react";
import { Input } from "@/shared/ui/input";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";
import { usePaymentMethods } from "@/features/payment-methods/hooks";


export default function CheckoutPage() {
    const navigate = useNavigate();
    const { data: cart } = useCart();
    const { mutateAsync: createOrder } = useCreateOrder();
    const { mutateAsync: createPaymentLink } = useCreatePaymentLink();
    const { mutate: getRates, isPending: isLoadingRates } = useShippingRates();

    // Processing state
    const [isProcessing, setIsProcessing] = useState(false);
    const [loadingText, setLoadingText] = useState("");

    const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);
    const [shippingRates, setShippingRates] = useState<any[]>([]);
    const [selectedRate, setSelectedRate] = useState<any | null>(null);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);
    const [note, setNote] = useState("");

    // Fetch payment methods to check type
    const { data: paymentMethodsData } = usePaymentMethods({
        page: 0,
        size: 100,
        status: ["ACTIVE"],
        type: ["ONLINE"],
    });
    const paymentMethods = paymentMethodsData?.contents || [];
    const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedPaymentMethodId);

    // Coupon State
    const location = useLocation();
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const { mutateAsync: validateCoupon, isPending: isCheckingCoupon } = useValidateCoupon();

    useEffect(() => {
        if (location.state?.appliedCoupon) {
            setAppliedCoupon(location.state.appliedCoupon);
            setCouponCode(location.state.appliedCoupon.code);
        }
    }, [location.state]);

    // Fetch rates when address changes
    useEffect(() => {
        if (selectedAddress && selectedAddress.district && selectedAddress.province) {
            const payload = {
                shipment: {
                    address_from: {
                        district: "103000",
                        city: "100000"
                    },
                    address_to: {
                        district: selectedAddress.district.goShipId,
                        city: selectedAddress.province.goShipId
                    },
                    parcel: {
                        cod: 0,
                        amount: cart?.items.reduce((sum, item) => sum + ((item.productVariant.salePrice ?? item.productVariant.price) * item.quantity), 0) || 0,
                        width: 10,
                        height: 10,
                        length: 10,
                        weight: 1000
                    }
                }
            };

            getRates(payload, {
                onSuccess: (data) => {
                    setShippingRates(data);
                    if (data.length > 0) {
                        setSelectedRate(data[0]);
                    } else {
                        setSelectedRate(null);
                    }
                },
                onError: (err) => {
                    console.error("Failed to fetch rates", err);
                    toast.error("Shipping Error", { description: "Could not fetch shipping rates" });
                    setShippingRates([]);
                    setSelectedRate(null);
                }
            });
        }
    }, [selectedAddress, cart, getRates]);

    const merchSubtotal = cart?.items.reduce((sum, item) => {
        const price = item.productVariant.salePrice ?? item.productVariant.price;
        return sum + (price * item.quantity);
    }, 0) || 0;

    // Calculate discount
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === "PERCENT") {
            discount = (merchSubtotal * appliedCoupon.value) / 100;
            if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
                discount = appliedCoupon.maxDiscount;
            }
        } else {
            discount = appliedCoupon.value;
        }
    }
    if (discount > merchSubtotal) {
        discount = merchSubtotal;
    }

    const shippingFee = selectedRate ? selectedRate.total_fee : 0;
    const totalPayment = merchSubtotal + shippingFee - discount;

    const handlePlaceOrder = async () => {
        // Validation
        if (!selectedAddress) {
            toast.error("Address Required", {
                description: "Please select a delivery address.",
            });
            return;
        }

        if (!selectedRate) {
            toast.error("Shipping Rate Required", {
                description: "Please select a shipping option.",
            });
            return;
        }

        if (!selectedPaymentMethodId) {
            toast.error("Payment Method Required", {
                description: "Please select a payment method.",
            });
            return;
        }

        if (!cart || cart.items.length === 0) {
            toast.error("Empty Cart", {
                description: "Your cart is empty.",
            });
            return;
        }

        setIsProcessing(true);

        try {
            // STEP 1: Create Order
            setLoadingText("Creating order...");
            const order = await createOrder({
                orderType: "ONLINE",
                paymentMethodId: selectedPaymentMethodId,
                note: note.trim() || undefined,
                items: cart.items.map(item => ({
                    productVariantId: item.productVariant.id,
                    quantity: item.quantity
                })),
                addressId: selectedAddress.id,
                couponCode: appliedCoupon?.code,
                carrierName: selectedRate.carrier_name,
                carrierServiceName: selectedRate.service,
                shippingFee: selectedRate.total_fee,
                deliveryTimeEstimate: selectedRate.expected,
                carrierRateId: selectedRate.id,
            });

            const orderId = order.id;

            // Check if payment method is QR (requires PayOS)
            const isQRPayment = selectedPaymentMethod?.code === 'QR';

            if (!isQRPayment) {
                // COD or other methods: Go directly to order success/history
                toast.success("Order placed successfully!");
                navigate("/user/purchase");
                return;
            }

            // STEP 2: Create PayOS Payment Link (only for QR payments)
            setLoadingText("Connecting to payment gateway...");
            try {
                const paymentRes = await createPaymentLink(orderId);

                if (paymentRes.checkoutUrl) {
                    // Redirect to PayOS checkout
                    window.location.href = paymentRes.checkoutUrl;
                } else {
                    throw new Error("No checkout URL received");
                }
            } catch (paymentError) {
                // CRITICAL: Order was created but payment link failed
                // Must redirect to order details so user can retry payment
                console.error("Payment link creation failed:", paymentError);
                toast.error("Payment link failed", {
                    description: "Order created but payment link failed. Please pay from your order details.",
                    duration: 5000,
                });
                navigate(`/user/purchase`);
            }

        } catch (error) {
            // STEP 1 failed - Order not created, user can retry
            console.error("Order creation failed:", error);
            // Error toast is already handled by useCreateOrder hook
        } finally {
            setIsProcessing(false);
            setLoadingText("");
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        try {
            const coupon = await validateCoupon({ code: couponCode, orderAmount: merchSubtotal });
            setAppliedCoupon(coupon);

            const savedAmount = coupon.type === 'PERCENT'
                ? (merchSubtotal * (coupon.value / 100))
                : coupon.value;
            toast.success("Coupon Applied", {
                description: `You saved ${formatCurrency(savedAmount)}`,
            });
        } catch {
            // Error is already handled by useGlobalMutation
        }
    }

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
    };

    return (
        <div className="container mx-auto px-4 py-8">
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
                            <BreadcrumbLink asChild>
                                <Link to="/cart">Cart</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Checkout</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <h1 className="text-4xl font-black uppercase tracking-tight text-black">Checkout</h1>


                <div className="space-y-4">

                    <AddressSection
                        selectedAddress={selectedAddress}
                        onSelectAddress={setSelectedAddress}
                    />

                    <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm">
                        <CheckoutProducts />

                        {/* Divider */}
                        <div className="my-6 border-b border-dashed"></div>

                        {/* Order Group Footer (Voucher, Message, Shipping) */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 justify-between border-b pb-6 border-dotted">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-500 font-bold">🎫</span>
                                    <span className="text-sm font-medium">Coupon</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {appliedCoupon ? (
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                                                <span className="text-xs font-bold text-green-700">{appliedCoupon.code}</span>
                                                <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-green-800">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <span className="text-xs text-green-600">
                                                {appliedCoupon.type === 'PERCENT' ? (
                                                    <>
                                                        Discount {appliedCoupon.value}%
                                                        {appliedCoupon.maxDiscount && ` (Max ${formatCurrency(appliedCoupon.maxDiscount)})`}
                                                    </>
                                                ) : (
                                                    <>Discount {formatCurrency(appliedCoupon.value)}</>
                                                )}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Input
                                                className="h-8 text-sm w-32"
                                                placeholder="Code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                            />
                                            <Button
                                                size="sm"
                                                className="h-8 bg-black hover:bg-black/90"
                                                onClick={handleApplyCoupon}
                                                disabled={isCheckingCoupon || !couponCode.trim()}
                                            >
                                                Apply
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <div className="flex items-center gap-2 w-1/3">
                                    <span className="text-sm">Message:</span>
                                    <input
                                        type="text"
                                        className="border border-gray-300 rounded-sm px-2 py-1 flex-1 text-sm focus:outline-none focus:border-gray-500"
                                        placeholder="Please leave a message..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                </div>

                                <CheckoutShipping
                                    rates={shippingRates}
                                    selectedRate={selectedRate}
                                    onSelect={setSelectedRate}
                                    isLoading={isLoadingRates}
                                />
                            </div>

                            <div className="flex justify-end items-center gap-4 border-t border-dotted pt-4">
                                <span className="text-sm text-gray-500">Order Total ({cart?.items.length || 0} Item):</span>
                                <span className="text-xl font-medium text-red-500">{formatCurrency(totalPayment)}</span>
                            </div>
                        </div>
                    </div>

                    <CheckoutPayment
                        selectedMethodId={selectedPaymentMethodId}
                        onChange={setSelectedPaymentMethodId}
                        type="ONLINE"
                    />

                    <div className="bg-white w-full gap-4 flex justify-center items-center p-6 shadow-sm border border-gray-200 rounded-sm sticky bottom-0 z-10 border-t">
                        <div className="flex w-full flex-col gap-2 items-start">
                            <div className="flex justify-between w-full max-w-sm text-sm">
                                <div className="text-gray-600">Merchandise Subtotal:</div>
                                <div>{formatCurrency(merchSubtotal)}</div>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between w-full max-w-sm text-sm">
                                    <div className="text-gray-600">Coupon Discount:</div>
                                    <div className="text-red-500">-{formatCurrency(discount)}</div>
                                </div>
                            )}
                            <div className="flex justify-between w-full max-w-sm text-sm">
                                <div className="text-gray-600">Shipping Total:</div>
                                <div>{formatCurrency(shippingFee)}</div>
                            </div>
                            <div className="flex justify-between w-full max-w-sm text-sm">
                                <div className="text-gray-600">Total Payment:</div>
                                <div className="text-2xl font-medium text-red-500">{formatCurrency(totalPayment)}</div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <Button
                                className="bg-[#FF6900] text-white px-10 py-3 h-auto hover:bg-[#F54900] text-lg rounded-[2px] min-w-[200px]"
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        {loadingText || "Processing..."}
                                    </span>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
