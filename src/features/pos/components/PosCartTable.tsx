import { usePosStore } from "../hooks/usePosState";
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
import { useUpdateDraftItemQuantity, useRemoveItemFromPosDraft } from "../hooks/usePosApi";
import { toast } from "sonner";

export function PosCartTable() {
    const { currentDraft, setCurrentDraft } = usePosStore();

    const { mutate: updateQuantity } = useUpdateDraftItemQuantity();
    const { mutate: removeItem } = useRemoveItemFromPosDraft();

    if (!currentDraft) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                    <p className="text-lg font-medium">No active draft</p>
                    <p className="text-sm mt-1">Click "New Draft" to start</p>
                </div>
            </div>
        );
    }

    const items = currentDraft.details || [];

    const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
        if (!currentDraft) return;

        updateQuantity({
            draftId: currentDraft.id,
            itemId,
            quantity: newQuantity
        }, {
            onSuccess: (updatedDraft) => {
                setCurrentDraft(updatedDraft);
            },
            onError: (error: any) => {
                toast.error("Failed to update quantity", {
                    description: error.response?.data?.message
                });
            }
        });
    };

    const handleRemoveItem = (itemId: number) => {
        if (!currentDraft) return;

        removeItem({
            draftId: currentDraft.id,
            itemId
        }, {
            onSuccess: (updatedDraft) => {
                setCurrentDraft(updatedDraft);
                toast.success("Item removed");
            }
        });
    };

    if (items.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                    <p className="text-lg font-medium">Cart is empty</p>
                    <p className="text-sm mt-1">Add products to start</p>
                </div>
            </div>
        );
    }

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
                        // Use backend-provided originalPrice and discountPercentage
                        const originalPrice = (item as any).originalPrice;
                        const discountPercentage = (item as any).discountPercentage;
                        const isOnSale = originalPrice !== undefined && originalPrice !== null && originalPrice > item.price;
                        const originalSubtotal = isOnSale ? originalPrice * item.quantity : null;
                        const discountPercent = discountPercentage ? Math.round(discountPercentage) : (isOnSale ? Math.round(((originalPrice - item.price) / originalPrice) * 100) : 0);

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
                                                -{discountPercent}%
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
                                                {formatCurrency(originalPrice)}
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
                                            onClick={() => handleUpdateQuantity(item.id!, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleUpdateQuantity(item.id!, item.quantity + 1)}
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
                                        {isOnSale && originalSubtotal && (
                                            <span className="text-xs text-muted-foreground line-through">
                                                {formatCurrency(originalSubtotal)}
                                            </span>
                                        )}
                                        {isOnSale && (
                                            <span className="text-[10px] text-green-600 font-medium">
                                                Save {formatCurrency(originalSubtotal! - item.subtotal)}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => handleRemoveItem(item.id!)}
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
