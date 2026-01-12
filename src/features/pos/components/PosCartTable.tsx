import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/shared/utils/format";

// Dữ liệu giả để hiển thị UI
const DUMMY_ITEMS = [
    {
        id: 1,
        productName: "Classic Cotton T-Shirt",
        image: null,
        color: "White",
        size: "L",
        material: "Cotton",
        sku: "TSH-001-WH-L",
        price: 350000,
        originalPrice: null, // Không giảm giá
        quantity: 2,
        subtotal: 700000,
    },
    {
        id: 2,
        productName: "Slim Fit Jeans",
        image: null,
        color: "Blue",
        size: "32",
        material: "Denim",
        sku: "JNS-002-BL-32",
        price: 450000,
        originalPrice: 600000, // Có giảm giá
        discountPercentage: 25,
        quantity: 1,
        subtotal: 450000,
    }
];

export function PosCartTable() {
    const items = DUMMY_ITEMS;

    return (
        <div className="flex flex-col h-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="w-[120px]">Price</TableHead>
                        <TableHead className="w-[150px]">Quantity</TableHead>
                        <TableHead className="w-[120px] text-right">Subtotal</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => {
                        // Logic hiển thị giả lập
                        const isOnSale = item.originalPrice !== null && item.originalPrice > item.price;
                        const originalSubtotal = isOnSale ? item.originalPrice! * item.quantity : 0;

                        return (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="relative w-12 h-12 rounded border overflow-hidden bg-muted">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                                No img
                                            </div>
                                        )}
                                        {isOnSale && (
                                            <div className="absolute -top-0.5 -left-0.5 bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-br-sm shadow-sm">
                                                -{item.discountPercentage}%
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{item.productName}</p>
                                            {isOnSale && (
                                                <span className="bg-red-100 text-red-600 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                                                    SALE
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {item.color} • {item.size} • {item.material}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className={isOnSale ? "text-red-600 font-semibold" : "font-medium"}>
                                            {formatCurrency(item.price)}
                                        </span>
                                        {isOnSale && (
                                            <span className="text-xs text-muted-foreground line-through">
                                                {formatCurrency(item.originalPrice!)}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
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
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}