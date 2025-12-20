
import { CreditCard, Banknote, Landmark } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { formatCurrency } from "@/shared/utils/format";
import { useState } from "react";

interface PosPaymentSectionProps {
    subtotal: number;
    discount: number;
    shippingFee: number; // For delivery logic
    onCheckout: () => void;
}

export function PosPaymentSection({
    subtotal,
    discount,
    shippingFee,
    onCheckout
}: PosPaymentSectionProps) {
    const [customerPaid, setCustomerPaid] = useState<string>(""); // Keep as string for input
    const [description, setDescription] = useState("");
    const [selectedMethod, setSelectedMethod] = useState<"cash" | "card" | "transfer">("cash");

    const total = subtotal + shippingFee - discount;
    const paidAmount = parseInt(customerPaid.replace(/\D/g, "") || "0", 10);
    const change = Math.max(0, paidAmount - total);
    const remaining = Math.max(0, total - paidAmount);

    return (
        <div className="bg-white rounded-sm shadow-sm border">
            <div className="p-4 border-b">
                <h3 className="font-bold text-gray-800">Payment</h3>
            </div>

            <div className="p-6 grid grid-cols-2 gap-8">
                {/* Left Col: Discount & Note */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Coupon / Voucher</label>
                        <div className="flex gap-2">
                            <Input placeholder="Enter code" />
                            <Button variant="outline">Apply</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Discount Amount</label>
                            <Input
                                className="text-right"
                                value={formatCurrency(discount)}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Shipping Fee</label>
                            <Input
                                className="text-right"
                                value={formatCurrency(shippingFee)}
                                readOnly
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Order Note</label>
                        <textarea
                            className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                            placeholder="Add notes..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                {/* Right Col: Totals & Action */}
                <div className="space-y-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping Fee</span>
                            <span className="font-medium">{formatCurrency(shippingFee)}</span>
                        </div>
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>- {formatCurrency(discount)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                            <span className="font-bold text-lg text-gray-800">Total Amount</span>
                            <span className="font-bold text-2xl text-red-500">{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="pt-2">
                        <label className="text-sm font-medium text-gray-700 block mb-2">Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: "cash", label: "Cash", icon: Banknote },
                                { id: "transfer", label: "Transfer", icon: Landmark },
                                { id: "card", label: "Card", icon: CreditCard },
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setSelectedMethod(m.id as any)}
                                    className={`flex flex-col items-center justify-center p-3 border rounded-md transition-all ${selectedMethod === m.id
                                            ? "bg-blue-50 border-blue-500 text-blue-600"
                                            : "hover:bg-gray-50 text-gray-600"
                                        }`}
                                >
                                    <m.icon className="w-5 h-5 mb-1" />
                                    <span className="text-xs font-medium">{m.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Customer Payment Input */}
                    <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                            <label className="font-medium">Customer Pays</label>
                            <Input
                                className="w-40 text-right font-medium"
                                value={customerPaid}
                                onChange={e => setCustomerPaid(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Change / Due</span>
                            <span className={`font-bold ${remaining > 0 ? "text-red-500" : "text-green-600"}`}>
                                {remaining > 0 ? `Due: ${formatCurrency(remaining)}` : `Change: ${formatCurrency(change)}`}
                            </span>
                        </div>
                    </div>

                    <Button
                        className="w-full h-12 text-lg font-bold bg-orange-500 hover:bg-orange-600"
                        onClick={onCheckout}
                    >
                        Complete Order
                    </Button>
                </div>
            </div>
        </div>
    );
}
