
export interface PurchaseProduct {
    id: number;
    name: string;
    image: string;
    variation: string;
    quantity: number;
    originalPrice: number;
    salePrice: number;
}

export interface PurchaseOrder {
    id: string;
    shopName: string;
    status: "To Pay" | "To Ship" | "To Receive" | "Completed" | "Cancelled" | "Return Refund";
    products: PurchaseProduct[];
    total: number;
    isFavorite?: boolean;
    cancellationStatus?: string;
}
