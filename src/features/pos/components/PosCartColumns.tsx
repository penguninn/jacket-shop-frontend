import type { ColumnDef } from "@tanstack/react-table";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { formatCurrency } from "@/shared/utils/format";
import type { OrderDetail } from "../model/schemas";

export interface PosCartTableMeta {
    updateQuantity: (itemId: number, quantity: number) => void;
    removeItem: (itemId: number) => void;
}

export const columns: ColumnDef<OrderDetail>[] = [
    {
        accessorKey: "image",
        header: "Image",
        size: 60,
        cell: ({ row }) => {
            const image = row.getValue("image") as string | null;
            return (
                <div className="relative size-10 overflow-hidden rounded border bg-muted">
                    {image ? (
                        <img
                            src={image}
                            alt={row.original.sku || "Product"}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground font-medium uppercase">
                            No Img
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "productName",
        header: "Product",
        size: 40,
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex flex-col gap-1">
                    <span className="font-medium line-clamp-2">
                        {item.productName}
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="bg-muted px-1.5 py-0.5 rounded">
                            {item.color}
                        </span>
                        <span className="bg-muted px-1.5 py-0.5 rounded">
                            {item.size}
                        </span>
                        <span>SKU: {item.sku}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right">Price</div>,
        size: 15,
        cell: ({ row }) => {
            const item = row.original;
            const isOnSale = item.originalPrice && item.originalPrice > item.price;
            return (
                <div className="flex flex-col items-end">
                    <span className={`${isOnSale ? "text-red-600 font-medium" : ""}`}>
                        {formatCurrency(item.price)}
                    </span>
                    {isOnSale && (
                        <span className="text-xs text-muted-foreground line-through">
                            {formatCurrency(item.originalPrice)}
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "quantity",
        header: () => <div className="text-center">Quantity</div>,
        size: 25,
        cell: ({ row, table }) => {
            const item = row.original;
            const meta = table.options.meta as PosCartTableMeta;

            return (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                            if (item.id) {
                                meta?.updateQuantity(item.id, item.quantity - 1);
                            }
                        }}
                        disabled={item.quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                            if (item.id) {
                                meta?.updateQuantity(item.id, item.quantity + 1);
                            }
                        }}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
    {
        accessorKey: "subtotal",
        header: () => <div className="text-right">Total</div>,
        size: 15,
        cell: ({ row }) => {
            const item = row.original;
            const originalSubtotal = (item.originalPrice || item.price) * item.quantity;
            const isOnSale = item.originalPrice && item.originalPrice > item.price;

            return (
                <div className="flex flex-col items-end">
                    <span className={`font-semibold ${isOnSale ? "text-red-600" : ""}`}>
                        {formatCurrency(item.subtotal)}
                    </span>
                    {isOnSale && (
                        <>
                            <span className="text-xs text-muted-foreground line-through">
                                {formatCurrency(originalSubtotal)}
                            </span>
                            <span className="text-[10px] text-green-600 font-medium">
                                Save {formatCurrency(originalSubtotal - item.subtotal)}
                            </span>
                        </>
                    )}
                </div>
            );
        },
    },
    {
        id: "actions",
        size: 5,
        cell: ({ row, table }) => {
            const item = row.original;
            const meta = table.options.meta as PosCartTableMeta;

            return (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                        if (item.id) {
                            meta?.removeItem(item.id);
                        }
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            );
        },
    },
];
