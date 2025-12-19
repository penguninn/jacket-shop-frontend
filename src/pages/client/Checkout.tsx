import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/features/cart/hooks";
import { AddressSection } from "@/features/orders/components/checkout/AddressSection";
import { CheckoutProducts } from "@/features/orders/components/checkout/CheckoutProducts";
import { CheckoutShipping } from "@/features/orders/components/checkout/CheckoutShipping";
import { CheckoutPayment } from "@/features/orders/components/checkout/CheckoutPayment";
import type { AddressResponse } from "@/features/address/model";
import type { ShippingMethod } from "@/features/shipping-methods/model";
import { Button } from "@/shared/ui/button";

export default function Checkout() {
  const navigate = useNavigate();
  const { data: cart } = useCart();

  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const merchSubtotal = cart?.items.reduce((sum, item) => {
    const price = item.productVariant.salePrice ?? item.productVariant.price;
    return sum + (price * item.quantity);
  }, 0) || 0;

  const shippingFee = selectedShippingMethod?.fee || 0;
  const totalPayment = merchSubtotal + shippingFee;

  const handlePlaceOrder = () => {
    // Implement order creation
    console.log({
      addressId: selectedAddress?.id,
      shippingMethodId: selectedShippingMethod?.id,
      paymentMethodId: selectedPaymentMethodId,
      note
    });
    // Todo: Call API
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center gap-4 mb-6 bg-white p-4 shadow-sm rounded-sm">
          <h1 className="text-xl text-primary flex items-center gap-2">
            <span className="text-xl">Checkout</span>
          </h1>
        </div>

        <div className="space-y-4">

          <AddressSection
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
          />

          <div className="bg-white p-6 shadow-sm rounded-sm">
            <CheckoutProducts />

            {/* Divider */}
            <div className="my-6 border-b border-dashed"></div>

            {/* Order Group Footer (Voucher, Message, Shipping) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 justify-end border-b pb-6 border-dotted">
                <span className="text-red-500 font-bold">🎫</span>
                <span>Shop Coupon</span>
                <button className="text-blue-500 text-sm font-medium">Select Coupon</button>
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
                  selectedMethodId={selectedShippingMethod?.id || null}
                  onSelect={setSelectedShippingMethod}
                />
              </div>

              <div className="flex justify-end items-center gap-4 border-t border-dotted pt-4">
                <span className="text-sm text-gray-500">Order Total ({cart?.items.length || 0} Item):</span>
                <span className="text-xl font-medium text-red-500">{formatPrice(totalPayment)}</span>
              </div>
            </div>
          </div>

          <CheckoutPayment
            selectedMethodId={selectedPaymentMethodId}
            onChange={setSelectedPaymentMethodId}
          />

          <div className="bg-white w-full gap-4 flex justify-center items-center p-6 shadow-sm rounded-sm sticky bottom-0 z-10 border-t">
            <div className="flex w-full flex-col gap-2 items-start">
              <div className="flex justify-between w-full max-w-sm text-sm">
                <div className="text-gray-600">Merchandise Subtotal:</div>
                <div>{formatPrice(merchSubtotal)}</div>
              </div>
              <div className="flex justify-between w-full max-w-sm text-sm">
                <div className="text-gray-600">Shipping Total:</div>
                <div>{formatPrice(shippingFee)}</div>
              </div>
              <div className="flex justify-between w-full max-w-sm text-sm">
                <div className="text-gray-600">Total Payment:</div>
                <div className="text-2xl font-medium text-red-500">{formatPrice(totalPayment)}</div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Button
                className="bg-[#FF6900] text-white px-10 py-3 h-auto hover:bg-[#F54900] text-lg rounded-[2px]"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
