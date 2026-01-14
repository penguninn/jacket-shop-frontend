import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { formatCurrency } from "@/shared/utils/format";
import type { ProductVariant } from "@/features/product-variants/model/schemas";
import { ArrowUpDown } from "lucide-react";

export interface POSProductVariant extends ProductVariant {
    product?: {
        id: number;
        name: string;
        brand?: { id: number; name: string; status?: string };
        style?: { id: number; name: string; status?: string };
        status?: string;
    };
}

export interface ProductSearchTableMeta {
    addToCart: (variant: POSProductVariant) => void;
}

export const columns: ColumnDef<POSProductVariant>[] = [
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
        header: ({ column }) => {
            return (
                <div className="text-left">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Product
                        <ArrowUpDown className="ml-2 h-2 w-2" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const productName = row.original.productName || "Unknown Product";
            const brandName = row.original.product?.brand?.name;
            const styleName = row.original.product?.style?.name;

            return (
                <div className="text-left flex flex-col">
                    <span className="font-medium text-sm line-clamp-1" title={productName}>
                        {productName}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {brandName && <span className="truncate max-w-[80px]">{brandName}</span>}
                        {brandName && styleName && <span>•</span>}
                        {styleName && <span className="truncate max-w-[80px]">{styleName}</span>}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "sku",
        header: ({ column }) => {
            return (
                <div className="">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Sku
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => (
            <Badge variant="outline" className=" font-mono text-[10px] px-1.5 py-0.5 bg-muted/50">
                {row.getValue("sku") || "—"}
            </Badge>
        ),
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => (
            <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                    <div
                        className="w-3 h-3 rounded-full border shadow-sm shrink-0"
                        style={{ backgroundColor: row.original.color?.hexCode || '#ccc' }}
                        title={row.original.color?.name}
                    />
                </div>
            </div>
        ),
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => (
            <div className="flex gap-3">
                <Badge variant="outline" className="w-fit text-[10px] font-normal px-1.5 py-0">
                    {row.original.size?.name}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "material",
        header: "Material",
        cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.material?.name || "—"}</span>,
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Price
                        <ArrowUpDown className="ml-2 h-2 w-2" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"));
            return (
                <div className="text-right font-semibold text-sm">
                    {formatCurrency(price)}
                </div>
            )
        },
    },
    {
        accessorKey: "availableQuantity",
        header: ({ column }) => {
            return (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Available
                        <ArrowUpDown className="ml-2 h-2 w-2" />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const stock = row.getValue("availableQuantity") as number;

            if (stock <= 0) {
                return <Badge variant="destructive" className="text-[10px] px-1.5">Out of Stock</Badge>
            }
            if (stock < 10) {
                return <Badge variant="outline" className="text-[10px] px-1.5 border-orange-500 text-orange-600 bg-orange-50">Low: {stock}</Badge>
            }
            return <div className="text-center text-xs font-medium text-green-600">{stock}</div>
        }
    },
    {
        id: "action",
        header: () => <div className="text-center">Action</div>,
        cell: ({ row, table }) => {
            const stock = row.original.availableQuantity;
            const isOutOfStock = stock <= 0;
            const meta = table.options.meta as ProductSearchTableMeta;

            return (
                <div className="flex justify-center">
                    <Button
                        size="sm"
                        variant={isOutOfStock ? "secondary" : "default"}
                        disabled={isOutOfStock}
                        className="h-7 text-xs px-3"
                        onClick={() => meta?.addToCart(row.original)}
                    >
                        {isOutOfStock ? "Sold Out" : "Select"}
                    </Button>
                </div>
            )
        }
    }
];
