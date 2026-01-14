import type { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/shared/utils/format";
import { Badge } from "@/shared/ui/badge";
import type { OrderDetail } from "../../model/schemas";

export const columns: ColumnDef<OrderDetail>[] = [
    {
        accessorKey: "product",
        header: "Product",
        cell: ({ row }) => {
            const image = row.original.image;
            const name = row.original.productName;
            const sku = row.original.sku;

            return (
                <div className="flex items-center gap-3">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="h-12 w-12 rounded-md object-cover border"
                        />
                    ) : (
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground border">
                            No Img
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-medium line-clamp-2" title={name}>
                            {name}
                        </span>
                        <span className="text-xs text-muted-foreground">SKU: {sku}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "attributes",
        header: "Attributes",
        cell: ({ row }) => {
            const { size, color, material } = row.original;
            return (
                <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs font-normal">
                        Size: {size}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                        Color: {color}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                        Mat: {material}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const price = row.original.price;
            const originalPrice = row.original.originalPrice;
            const discountPercentage = row.original.discountPercentage || 0;

            return (
                <div className="flex flex-col">
                    <span className="font-medium">{formatCurrency(price)}</span>
                    {originalPrice && originalPrice > price && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="line-through">{formatCurrency(originalPrice)}</span>
                            {discountPercentage > 0 && (
                                <span className="text-red-500">-{discountPercentage}%</span>
                            )}
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "quantity",
        header: "Qty",
        cell: ({ row }) => (
            <div className="font-medium text-center">{row.getValue("quantity")}</div>
        ),
    },
    {
        accessorKey: "subtotal",
        header: () => <div className="text-right">Total</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium text-primary">
                {formatCurrency(row.getValue("subtotal"))}
            </div>
        ),
    },
];
