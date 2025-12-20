import { useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { checkStock } from "../api";
import type { ProductVariant } from "../model/schemas";

interface ProductVariantCheckStockDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    variant: ProductVariant;
}

export function ProductVariantCheckStockDialog({
    open,
    onOpenChange,
    variant,
}: ProductVariantCheckStockDialogProps) {
    const [quantity, setQuantity] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<boolean | null>(null);

    const handleCheck = async () => {
        setIsLoading(true);
        setResult(null);
        try {
            const isAvailable = await checkStock(variant.id, quantity);
            setResult(isAvailable);
        } catch (error) {
            console.error("Failed to check stock", error);
            // Optionally handle error state
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setQuantity(1);
            setResult(null);
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Check Stock Availability</DialogTitle>
                    <DialogDescription>
                        Check if a specific quantity is available for SKU <span className="font-semibold">{variant.sku || variant.id}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="quantity" className="text-right">
                            Quantity
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                    {result !== null && (
                        <div className={`flex items-center justify-center p-4 rounded-md ${result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {result ? (
                                <>
                                    <CheckCircle2 className="mr-2 h-5 w-5" />
                                    <span className="font-medium">Available</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="mr-2 h-5 w-5" />
                                    <span className="font-medium">Not Available</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>
                        Close
                    </Button>
                    <Button onClick={handleCheck} disabled={isLoading || quantity < 1}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Check
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
