import { Link, useNavigate } from "react-router-dom";
import { AddressSection } from "@/features/orders/components/checkout/AddressSection";
import { CheckoutProducts } from "@/features/orders/components/checkout/CheckoutProducts";
import { CheckoutShipping } from "@/features/orders/components/checkout/CheckoutShipping";
import { CheckoutPayment } from "@/features/orders/components/checkout/CheckoutPayment";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";

import { useEffect, useState, useMemo } from "react";
import type { AddressResponse } from "@/features/address/model";
import { useCart } from "@/features/cart/hooks";
import { useValidateCoupon, validateCouponInputSchema, type ValidateCouponInput } from "@/features/coupons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "@/shared/utils/format";
import { toast } from "sonner";
import { useShippingRates } from "@/features/shipping/hooks";
import type { GoshipRateData, GoshipRateRequest } from "@/features/shipping/model/schemas";
import { useCreateOrder } from "@/features/orders/hooks";
import type { PaymentMethod } from "@/features/payment-methods/model";
import { useCreatePaymentLink } from "@/features/payos/hooks";

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { data: cart } = useCart();
    const [note, setNote] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);
    const [selectedShippingRate, setSelectedShippingRate] = useState<GoshipRateData | null>(null);
    const [shippingRates, setShippingRates] = useState<GoshipRateData[] | null>(null);
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string;
        discount: number;
        type?: 'PERCENT' | 'AMOUNT';
    } | null>(null);

    // Coupon form
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ValidateCouponInput>({
        resolver: zodResolver(validateCouponInputSchema),
        defaultValues: {
            code: "",
            orderAmount: 0,
        },
    });

    useEffect(() => {
        if (cart?.totalPrice !== undefined) {
            setValue("orderAmount", cart.totalPrice);
        }
    }, [cart?.totalPrice, setValue]);

    const { mutate: validateCoupon, isPending: isValidatingCoupon } = useValidateCoupon();
    const onSubmitCoupon = (data: ValidateCouponInput) => {
        validateCoupon(data, {
            onSuccess: (response) => {
                setAppliedCoupon({
                    code: data.code,
                    discount: response.value,
                    type: response.type
                });
                toast.success(`Coupon "${data.code}" applied successfully!`);
            }
        });
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setValue('code', '');
        toast.success('Coupon removed');
    };

    // Shipping rates
    const { mutate: calculateShippingRates, isPending } = useShippingRates();
    const goshipRateRequest: GoshipRateRequest | null = useMemo(() => {
        if (!selectedAddress) return null;

        return {
            shipment: {
                address_from: { district: "103000", city: "100000" },
                address_to: {
                    district: selectedAddress.district.goshipId.toString(),
                    city: selectedAddress.province.goshipId.toString(),
                },
                parcel: { cod: 0, amount: 0, width: 0, height: 0, length: 0, weight: 0 },
            },
        };
    }, [selectedAddress]);

    useEffect(() => {
        setShippingRates(null);
        setSelectedShippingRate(null);

        if (!goshipRateRequest) return;

        calculateShippingRates(goshipRateRequest, {
            onSuccess: (response) => {
                setShippingRates(response.contents);
                if (response.contents?.length > 0) {
                    setSelectedShippingRate(response.contents[0]);
                }
            }
        });
    }, [goshipRateRequest, calculateShippingRates]);

    // Summary
    const summary = useMemo(() => {
        const subtotal = cart?.totalPrice || 0;
        const discount = appliedCoupon?.discount || 0;
        const shippingFee = selectedShippingRate?.total_fee || 0;
        const total = subtotal - discount + shippingFee;

        return {
            subtotal,
            discount,
            shippingFee,
            total: Math.max(0, total)
        };
    }, [cart?.totalPrice, appliedCoupon?.discount, selectedShippingRate?.total_fee]);

    // Create order
    const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
    const { mutate: createPaymentLink, isPending: isCreatingPaymentLink } = useCreatePaymentLink();

    const handlePlaceOrder = () => {
        if (!cart || !cart.items.length) {
            toast.error("Cart is empty");
            return;
        }

        if (!selectedAddress) {
            toast.error("Please select a shipping address");
            return;
        }

        if (!selectedShippingRate) {
            toast.error("Please select a shipping method");
            return;
        }

        if (!selectedPaymentMethod) {
            toast.error("Please select a payment method");
            return;
        }

        createOrder({
            paymentMethodId: selectedPaymentMethod.id,
            note: note,
            couponCode: appliedCoupon?.code,
            items: cart.items.map((item) => ({
                productVariantId: item.productVariant.id,
                quantity: item.quantity,
            })),
            addressId: selectedAddress.id,
            shippingFee: selectedShippingRate?.total_fee,
            carrierName: selectedShippingRate?.carrier_name,
            carrierServiceName: selectedShippingRate?.service,
            carrierRateId: selectedShippingRate?.id,
            deliveryTimeEstimate: selectedShippingRate?.expected,
        }, {
            onSuccess: (order) => {
                if (selectedPaymentMethod.code === "QR" && order.total > 0) {
                    createPaymentLink(order.id, {
                        onSuccess: (paymentLink) => {
                            window.location.href = paymentLink.checkoutUrl;
                        }
                    });
                } else {
                    navigate("/user/purchase");
                }
            }
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
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
                        disabled={isCreatingOrder}
                    />

                    <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm">
                        <CheckoutProducts cart={cart} />

                        <div className="my-6 border-b border-dashed"></div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 justify-between border-b pb-6 border-dotted">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-500 font-bold">🎫</span>
                                    <span className="text-sm font-medium">Coupon</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {appliedCoupon ? (
                                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-1">
                                            <span className="text-sm font-medium text-green-700">
                                                {appliedCoupon.code}
                                            </span>
                                            <span className="text-xs text-green-600">
                                                -{formatCurrency(appliedCoupon.discount)}
                                            </span>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="text-red-500 hover:text-red-700 text-xs ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isCreatingOrder}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmitCoupon)} className="flex gap-2">
                                            <div className="flex flex-col">
                                                <Input
                                                    className="h-8 text-sm w-full"
                                                    placeholder="Enter coupon code"
                                                    disabled={isValidatingCoupon || isCreatingOrder}
                                                    {...register("code")}
                                                />
                                                {errors.code && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        {errors.code.message}
                                                    </p>
                                                )}
                                            </div>

                                            <input type="hidden" {...register("orderAmount")} />

                                            <Button
                                                type="submit"
                                                size="sm"
                                                className="h-8 bg-black hover:bg-black/90"
                                                disabled={isValidatingCoupon || isCreatingOrder}
                                            >
                                                {isValidatingCoupon ? "Applying..." : "Apply"}
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-2">
                                <div className="flex items-center gap-2 w-1/3">
                                    <span className="text-sm">Message:</span>
                                    <input
                                        type="text"
                                        className="border border-gray-300 rounded-sm px-2 py-1 flex-1 text-sm focus:outline-none focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Please leave a message..."
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        disabled={isCreatingOrder}
                                    />
                                </div>

                                <CheckoutShipping
                                    rates={shippingRates || []}
                                    selectedRate={selectedShippingRate}
                                    onSelect={setSelectedShippingRate}
                                    isLoading={isPending}
                                    disabled={isCreatingOrder}
                                />
                            </div>

                            <div className="flex justify-end items-center gap-4 border-t border-dotted pt-4">
                                <span className="text-sm text-gray-500">Order Total:</span>
                                <span className="text-xl font-medium text-red-500">
                                    {formatCurrency(summary.subtotal)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <CheckoutPayment
                        selectedMethod={selectedPaymentMethod}
                        onChange={setSelectedPaymentMethod}
                        type="ONLINE"
                        disabled={isCreatingOrder}
                    />

                    <div className="bg-white w-full gap-4 flex justify-center items-center p-6 shadow-sm border border-gray-200 rounded-sm sticky bottom-0 z-10 border-t">
                        <div className="flex w-full flex-col gap-2 items-start">
                            <div className="flex justify-between w-full max-w-sm text-sm">
                                <div className="text-gray-600">Subtotal:</div>
                                <div>{formatCurrency(summary.subtotal)}</div>
                            </div>

                            {appliedCoupon && (
                                <div className="flex justify-between w-full max-w-sm text-sm">
                                    <div className="text-gray-600">Coupon Discount:</div>
                                    <div className="text-red-500">
                                        -{formatCurrency(summary.discount)}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between w-full max-w-sm text-sm">
                                <div className="text-gray-600">Shipping Total:</div>
                                <div>{formatCurrency(summary.shippingFee)}</div>
                            </div>

                            <div className="flex justify-between w-full max-w-sm text-sm">
                                <div className="text-gray-600">Total Payment:</div>
                                <div className="text-2xl font-medium text-red-500">
                                    {formatCurrency(summary.total)}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center items-center">
                            <Button
                                className="bg-[#FF6900] text-white px-10 py-3 h-auto hover:bg-[#F54900] text-lg rounded-sm min-w-[200px]"
                                disabled={!cart?.items?.length || isCreatingOrder || isCreatingPaymentLink}
                                onClick={handlePlaceOrder}
                            >
                                {isCreatingOrder || isCreatingPaymentLink ? "Processing..." : "Place Order"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}