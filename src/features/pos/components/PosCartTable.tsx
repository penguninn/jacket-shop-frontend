import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { usePosStore } from "../hooks/usePosState";
import { Button } from "@/shared/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { Input } from "@/shared/ui/input";

export function PosCartTable() {
    const { tabs, activeTabId, updateItemQuantity, removeItem } = usePosStore();
    const activeTab = tabs.find((t) => t.id === activeTabId);
    const items = activeTab?.items || [];

    const handleQuantityChange = (itemId: string, newQty: number, max: number) => {
        if (newQty < 1) return;
        if (newQty > max) {
            // Optional: Show toast or feedback
            updateItemQuantity(itemId, max);
            return;
        }
        updateItemQuantity(itemId, newQty);
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-background border rounded-lg shadow-sm text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
                <p>Cart is empty</p>
                <p className="text-xs">Search and add products to start</p>
            </div>
        );
    }

    return (
        <div className="bg-background border rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Cart Items ({items.length})
                </h3>
            </div>

            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Product</TableHead>
                            <TableHead className="w-[20%] text-center">Price</TableHead>
                            <TableHead className="w-[30%] text-center">Quantity</TableHead>
                            <TableHead className="w-[10%]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 bg-muted rounded overflow-hidden flex-shrink-0">
                                            {item.productThumbnail ? (
                                                <img
                                                    src={item.productThumbnail}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground">
                                                    Img
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm line-clamp-1" title={item.productName}>
                                                {item.productName}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.variantName}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-0.5">
                                                Max: {item.maxStock}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                    ${new Intl.NumberFormat().format(item.price)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.maxStock)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <Input
                                            type="number"
                                            className="h-7 w-12 text-center px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            value={item.quantity}
                                            min={1}
                                            max={item.maxStock}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (!isNaN(val)) handleQuantityChange(item.id, val, item.maxStock);
                                            }}
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.maxStock)}
                                            disabled={item.quantity >= item.maxStock}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Minimal Summary Footer within Cart Table (Optional, maybe specific totals?) */}
            {items.length > 0 && (
                <div className="p-3 border-t bg-muted/10 flex justify-between items-center text-sm font-medium">
                    <span>Items Total:</span>
                    <span>
                        ${new Intl.NumberFormat().format(items.reduce((acc, item) => acc + item.price * item.quantity, 0))}
                    </span>
                </div>
            )}
        </div>
    );
}
