import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { saleRequestSchema, type SaleRequest } from "../model/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale } from "../api";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useDebounce } from "@/shared/hooks/use-debounce";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/shared/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover";
import { useProductVariants } from "@/features/product-variants/hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";


interface SaleCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SaleCreateDialog({ open, onOpenChange }: SaleCreateDialogProps) {
    const queryClient = useQueryClient();

    const form = useForm<SaleRequest>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(saleRequestSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            productVariantIds: [],
            saleStartDate: "",
            saleEndDate: "",
            discountPercentage: 0,
            status: "ACTIVE",
        },
    });

    const [openCombobox, setOpenCombobox] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);

    const { data: variantsData, isLoading: isLoadingVariants } = useProductVariants({
        page: 0,
        size: 50,
        search: debouncedSearch,
        enabled: open,
    });

    const variants = variantsData?.contents ?? [];
    const selectedVariantIds = form.watch("productVariantIds") || [];

    // Handle variant selection toggling
    const toggleVariant = (variantId: number) => {
        const currentIds = form.getValues("productVariantIds") || [];
        if (currentIds.includes(variantId)) {
            form.setValue("productVariantIds", currentIds.filter(id => id !== variantId), { shouldValidate: true });
        } else {
            form.setValue("productVariantIds", [...currentIds, variantId], { shouldValidate: true });
        }
    };

    // Remove variant tag
    const removeVariant = (variantId: number) => {
        const currentIds = form.getValues("productVariantIds") || [];
        form.setValue("productVariantIds", currentIds.filter(id => id !== variantId), { shouldValidate: true });
    };

    useEffect(() => {
        if (open) {
            form.reset({
                name: "",
                description: "",
                productVariantIds: [],
                saleStartDate: "",
                saleEndDate: "",
                discountPercentage: 0,
                status: "ACTIVE",
            });
        }
    }, [open, form]);

    const createMutation = useMutation({
        mutationFn: createSale,
        onSuccess: () => {
            toast.success("Sale created successfully");
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product-variants"] });
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            onOpenChange(false);
        },
        onError: (error) => {
            console.error("Failed to create sale:", error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errData = (error as any)?.response?.data;
            if (errData && errData.message) {
                toast.error(`Failed to create sale: ${errData.message}`);
            } else {
                toast.error("Failed to create sale");
            }
        },
    });

    const onSubmit = (data: SaleRequest) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = {
            name: data.name,
            description: data.description,
            discountPercentage: data.discountPercentage,
            startDate: new Date(data.saleStartDate).toISOString(),
            endDate: new Date(data.saleEndDate).toISOString(),
            status: data.status,
            productVariantIds: data.productVariantIds,
        };
        createMutation.mutate(payload);
    };

    const getVariantInfo = (id: number) => {
        const searchVariant = variants.find((v) => v.id === id);
        if (searchVariant) {
            // @ts-ignore
            const price = searchVariant.price ?? 0;
            const discount = form.watch("discountPercentage") || 0;
            const salePrice = price * (1 - discount / 100);

            return {
                // @ts-ignore
                name: searchVariant.product?.name || `Product ID: ${searchVariant.productId}`,
                sku: searchVariant.sku,
                // @ts-ignore
                image: searchVariant.product?.thumbnail || "",
                price: price,
                salePrice: salePrice,
                // @ts-ignore
                sub: `${searchVariant.color?.name || ''} - ${searchVariant.size?.name || ''}`,
            };
        }
        return null;
    };

    const formatCurrency = (val?: number | null) => {
        if (val === undefined || val === null) return "N/A";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Sale</DialogTitle>
                    <DialogDescription>
                        Create a new sale campaign and assign variants.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sale Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Summer Sale 2024" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Optional description..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="saleStartDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="saleEndDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="discountPercentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount Percentage (%)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                {...field}
                                                onChange={e => field.onChange(e.target.valueAsNumber)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">Active</SelectItem>
                                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="productVariantIds"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Variants ({field.value?.length || 0})</FormLabel>

                                    <div className="border rounded-md p-2 space-y-2 max-h-[300px] overflow-y-auto bg-muted/10">
                                        {field.value && field.value.length > 0 ? (
                                            field.value.map((id) => {
                                                const info = getVariantInfo(id);
                                                return (
                                                    <div key={id} className="flex items-center gap-3 p-2 bg-background rounded border shadow-sm">
                                                        {info?.image ? (
                                                            <img
                                                                src={info.image}
                                                                alt={info.name || "Product"}
                                                                className="h-12 w-12 rounded object-cover border"
                                                            />
                                                        ) : (
                                                            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                                                No Img
                                                            </div>
                                                        )}

                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm truncate" title={info?.name || ""}>
                                                                {info?.name || `Variant #${id}`}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground flex gap-2">
                                                                <span className="font-mono bg-muted px-1 rounded text-[10px]">{info?.sku || "NO-SKU"}</span>
                                                                <span>{info?.sub}</span>
                                                            </div>
                                                        </div>

                                                        <div className="text-right text-sm">
                                                            {info?.price !== undefined && (
                                                                <div className="text-muted-foreground line-through text-xs">
                                                                    {formatCurrency(info.price)}
                                                                </div>
                                                            )}
                                                            <div className="font-bold text-red-600">
                                                                {formatCurrency(info?.salePrice)}
                                                            </div>
                                                        </div>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                removeVariant(id);
                                                            }}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-8 text-muted-foreground text-sm">
                                                No variants selected.
                                            </div>
                                        )}
                                    </div>

                                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openCombobox}
                                                    className={cn(
                                                        "w-full justify-between",
                                                        (!field.value || !field.value.length) && "text-muted-foreground"
                                                    )}
                                                >
                                                    Add more variants...
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0" align="start">
                                            <Command shouldFilter={false}>
                                                <CommandInput
                                                    placeholder="Search variant by SKU or product name..."
                                                    value={searchQuery}
                                                    onValueChange={setSearchQuery}
                                                />
                                                <CommandList>
                                                    {isLoadingVariants ? (
                                                        <div className="py-6 text-center text-sm text-muted-foreground">
                                                            Loading variants...
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <CommandEmpty>No variant found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {variants.map((variant) => {
                                                                    const isSelected = selectedVariantIds.includes(variant.id);
                                                                    return (
                                                                        <CommandItem
                                                                            key={variant.id}
                                                                            value={String(variant.id)}
                                                                            onSelect={() => toggleVariant(variant.id)}
                                                                        >
                                                                            <Check
                                                                                className={cn(
                                                                                    "mr-2 h-4 w-4",
                                                                                    isSelected
                                                                                        ? "opacity-100"
                                                                                        : "opacity-0"
                                                                                )}
                                                                            />
                                                                            <div className="flex flex-col">
                                                                                <span className="font-medium">
                                                                                    {variant.sku || `Variant #${variant.id}`}
                                                                                </span>
                                                                                <span className="text-xs text-muted-foreground">
                                                                                    {/* @ts-ignore */}
                                                                                    {variant.product?.name ? `${variant.product.name} - ` : ""}
                                                                                    Color: {variant.color?.name} | Size: {variant.size?.name}
                                                                                </span>
                                                                            </div>
                                                                        </CommandItem>
                                                                    );
                                                                })}
                                                            </CommandGroup>
                                                        </>
                                                    )}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Create Sale
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
