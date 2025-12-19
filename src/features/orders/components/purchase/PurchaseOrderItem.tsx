
import { Button } from "@/shared/ui/button";
import type { PurchaseOrder } from "./types";
import { MessageSquare, Store, Truck } from "lucide-react";
import { formatCurrency } from "@/shared/utils/format";

interface PurchaseOrderItemProps {
    order: PurchaseOrder;
}

export function PurchaseOrderItem({ order }: PurchaseOrderItemProps) {
    return (
        <div className="bg-white rounded-sm shadow-sm mb-4">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                </div>
                <div className="flex items-center gap-2 text-sm">
                    {order.status === "To Receive" && (
                        <div className="flex items-center gap-1 text-green-500">
                            <Truck className="w-4 h-4" />                        </div>
                    )}
                    <div className="border-l pl-2 ml-2 text-[#FF6900] uppercase font-medium">
                        {order.status}
                    </div>
                </div>
            </div>

            {/* Products */}
            <div>
                {order.products.map((product) => (
                    <div key={product.id} className="flex p-4 border-b last:border-b-0 gap-4">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover border rounded-sm"
                        />
                        <div className="flex-1">
                            <h3 className="text-base mb-1 line-clamp-2">{product.name}</h3>
                            <div className="text-gray-500 text-sm">Variation: {product.variation}</div>
                            <div className="text-sm mt-1">x{product.quantity}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through text-sm">
                                {formatCurrency(product.originalPrice)}
                            </span>
                            <span className="text-[#FF6900] font-medium">
                                {formatCurrency(product.salePrice)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total and Actions */}
            <div className="p-6 bg-[#fffefb]">
                <div className="flex justify-end items-center gap-2 mb-6">
                    <span className="text-sm text-gray-800">Order Total:</span>
                    <span className="text-xl font-medium text-[#FF6900]">
                        {formatCurrency(order.total)}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <div className="text-gray-500 text-xs w-1/2">
                        {order.status === "To Receive" && "Confirm receipt after you've checked the received items"}
                    </div>
                    <div className="flex gap-2 justify-end flex-1">
                        {/* Dynamic Buttons based on status - Simplified for now based on design */}
                        {order.status === "To Receive" && (
                            <Button disabled className="bg-[#e0e0e0] text-gray-400 hover:bg-[#e0e0e0] border-none font-normal">
                                Order Received
                            </Button>
                        )}
                        {order.status === "Completed" && (
                            <Button className="bg-[#FF6900] hover:bg-[#F54900] text-white min-w-[150px]">
                                Rate
                            </Button>
                        )}
                        <Button variant="outline" className="min-w-[150px] font-normal text-gray-600">
                            {order.status === "To Receive" ? "Contact Seller" : order.status === "Completed" ? "Buy Again" : "Contact Seller"}
                        </Button>
                        {order.status === "To Receive" && (
                            <Button disabled variant="outline" className="text-gray-300 border-gray-200">
                                Request For Return/Refund
                            </Button>
                        )}
                        {order.status === "Completed" && (
                            <Button variant="outline" className="min-w-[150px] font-normal text-gray-600">
                                Contact Seller
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
