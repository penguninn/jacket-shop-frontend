
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Separator } from "@/shared/ui/separator";
import { formatCurrency } from "@/shared/utils/format";
import { PosCustomer } from "./PosCustomer";
import { useState } from "react";

interface PosCartProps {
    items: any[];
    customer: any;
    onRemoveItem: (id: number) => void;
    onUpdateQuantity: (id: number, delta: number) => void;
    onSelectCustomer: (c: any) => void;
    onClearCart: () => void;
}

export function PosCart({
    items,
    customer,
    onRemoveItem,
    onUpdateQuantity,
    onSelectCustomer,
    onClearCart
}: PosCartProps) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // Mock 10% tax
    const total = subtotal + tax;

    const [paymentMethod, setPaymentMethod] = useState("cash");

    return (
        <div className="flex flex-col h-full w-1/3 bg-gray-50 border-l">
            {/* Customer Section */}
            <PosCustomer customer={customer} onSelectCustomer={onSelectCustomer} />

            {/* Cart Items */}
            <ScrollArea className="flex-1 p-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <span className="text-4xl mb-2">🛒</span>
                        <span>Cart is empty</span>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map(item => (
                            <div key={item.id} className="bg-white p-3 rounded-sm shadow-sm flex gap-3">
                                <div className="flex-1">
                                    <div className="text-sm font-medium line-clamp-1">{item.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">{formatCurrency(item.price)}</div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="font-medium text-sm">
                                        {formatCurrency(item.price * item.quantity)}
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-100 rounded-sm px-1">
                                        <button
                                            className="w-6 h-6 flex items-center justify-center text-sm hover:bg-white rounded-sm"
                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                        >
                                            -
                                        </button>
                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                        <button
                                            className="w-6 h-6 flex items-center justify-center text-sm hover:bg-white rounded-sm"
                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    className="text-gray-400 hover:text-red-500 self-center pl-2"
                                    onClick={() => onRemoveItem(item.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Payment Section */}
            <div className="bg-white p-4 shadow-lg border-t">
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (10%)</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span className="text-red-500 text-lg">{formatCurrency(total)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    {["Cash", "Card", "Transfer"].map(method => (
                        <button
                            key={method}
                            className={`py-2 text-sm border rounded-sm ${paymentMethod === method.toLowerCase()
                                ? "bg-primary text-primary-foreground border-primary"
                                : "hover:bg-gray-50"
                                }`}
                            onClick={() => setPaymentMethod(method.toLowerCase())}
                        >
                            {method}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex-1 border-red-200 text-red-500 hover:bg-red-50"
                        onClick={onClearCart}
                        disabled={items.length === 0}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-[2] bg-green-600 hover:bg-green-700"
                        disabled={items.length === 0}
                    >
                        Complete Payment
                    </Button>
                </div>
            </div>
        </div>
    );
}
