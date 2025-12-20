import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { useAdjustStock } from "../hooks";
import { stockAdjustmentSchema, type StockAdjustmentInput } from "../model/schemas";
import type { ProductVariant } from "../model/schemas";

interface ProductVariantStockAdjustmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    variant: ProductVariant;
}

export function ProductVariantStockAdjustmentDialog({
    open,
    onOpenChange,
    variant,
}: ProductVariantStockAdjustmentDialogProps) {
    const adjustStock = useAdjustStock();

    const form = useForm<StockAdjustmentInput>({
        resolver: zodResolver(stockAdjustmentSchema),
        defaultValues: {
            quantityChange: 0,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                quantityChange: 0,
            });
        }
    }, [open, form]);

    const onSubmit = (data: StockAdjustmentInput) => {
        adjustStock.mutate(
            { id: variant.id, data },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adjust Stock</DialogTitle>
                    <DialogDescription>
                        Adjust the stock quantity for SKU <span className="font-semibold">{variant.sku || variant.id}</span>.
                        Positive values increase stock, negative values decrease it.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="quantityChange"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity Change</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={adjustStock.isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={adjustStock.isPending}>
                                {adjustStock.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Determine
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
