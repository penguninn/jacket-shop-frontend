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
import { type SaleResponse, saleRequestSchema, type SaleRequest } from "../model/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale, updateSale } from "../api";
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
import { Badge } from "@/shared/ui/badge";


interface SaleFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sale?: SaleResponse;
}

export function SaleFormDialog({ open, onOpenChange, sale }: SaleFormDialogProps) {
    const queryClient = useQueryClient();
    const isEdit = !!sale;

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
        },
    });

    const [openCombobox, setOpenCombobox] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 300);

    const { data: variantsData, isLoading: isLoadingVariants } = useProductVariants({
        page: 0,
        size: 50, // Fetch more to facilitate selection
        search: debouncedSearch,
    });

    const variants = variantsData?.contents ?? [];
    const selectedVariantIds = form.watch("productVariantIds");

    // Handle variant selection toggling
    const toggleVariant = (variantId: number) => {
        const currentIds = form.getValues("productVariantIds");
        if (currentIds.includes(variantId)) {
            form.setValue("productVariantIds", currentIds.filter(id => id !== variantId), { shouldValidate: true });
        } else {
            form.setValue("productVariantIds", [...currentIds, variantId], { shouldValidate: true });
        }
    };

    // Remove variant tag
    const removeVariant = (variantId: number) => {
        const currentIds = form.getValues("productVariantIds");
        form.setValue("productVariantIds", currentIds.filter(id => id !== variantId), { shouldValidate: true });
    };

    useEffect(() => {
        if (open) {
            if (sale) {
                form.reset({
                    name: sale.name || "",
                    description: sale.description || "",
                    productVariantIds: sale.variants?.map(v => v.variantId) || [],
                    saleStartDate: sale.startDate ? new Date(sale.startDate).toISOString().slice(0, 16) : "",
                    saleEndDate: sale.endDate ? new Date(sale.endDate).toISOString().slice(0, 16) : "",
                    discountPercentage: sale.discountPercentage || 0,
                });
            } else {
                form.reset({
                    name: "",
                    description: "",
                    productVariantIds: [],
                    saleStartDate: "",
                    saleEndDate: "",
                    discountPercentage: 0,
                });
            }
        }
    }, [open, sale, form]);

    const createMutation = useMutation({
        mutationFn: createSale,
        onSuccess: () => {
            toast.success("Sale created successfully");
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Failed to create sale");
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateSale,
        onSuccess: () => {
            toast.success("Sale updated successfully");
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Failed to update sale");
        },
    });

    const onSubmit = (data: SaleRequest) => {
        const payload = {
            ...data,
            saleStartDate: new Date(data.saleStartDate).toISOString(),
            saleEndDate: new Date(data.saleEndDate).toISOString(),
        };

        if (isEdit && sale) {
            updateMutation.mutate({ id: sale.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Sale" : "Create New Sale"}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update sale details and attached variants."
                            : "Create a new sale campaign and assign variants."}
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
                            name="productVariantIds"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Variants</FormLabel>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {field.value.map((id) => (
                                            <Badge key={id} variant="secondary" className="pl-2 pr-1 py-1">
                                                ID: {id}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-4 w-4 ml-1 rounded-full p-0 hover:bg-muted-foreground/20"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        removeVariant(id);
                                                    }}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        ))}
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
                                                        !field.value.length && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value.length
                                                        ? `${field.value.length} variants selected`
                                                        : "Select variants..."}
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
                            <Button type="submit" disabled={isPending}>
                                {isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isEdit ? "Update Sale" : "Create Sale"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
