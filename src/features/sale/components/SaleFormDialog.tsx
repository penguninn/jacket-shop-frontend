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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { type SaleResponse, createSaleSchema, type CreateSaleInput } from "../model/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applySale } from "../api";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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


interface SaleFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sale?: SaleResponse;
}

export function SaleFormDialog({ open, onOpenChange, sale }: SaleFormDialogProps) {
    const queryClient = useQueryClient();
    const isEdit = !!sale;



    const form = useForm<CreateSaleInput>({
        resolver: zodResolver(createSaleSchema) as unknown as Resolver<CreateSaleInput>,
        defaultValues: {
            variantId: 0,
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
        size: 20,
        search: debouncedSearch,
    });

    const variants = variantsData?.contents ?? [];

    useEffect(() => {
        if (open) {
            if (sale) {
                form.reset({
                    variantId: sale.variantId,
                    saleStartDate: sale.saleStartDate ? new Date(sale.saleStartDate).toISOString().split('T')[0] : "",
                    saleEndDate: sale.saleEndDate ? new Date(sale.saleEndDate).toISOString().split('T')[0] : "",
                    discountPercentage: sale.discountPercentage || 0,
                });
            } else {
                form.reset({
                    variantId: 0,
                    saleStartDate: "",
                    saleEndDate: "",
                    discountPercentage: 0,
                });
            }
        }
    }, [open, sale, form]);

    const mutation = useMutation({
        mutationFn: applySale,
        onSuccess: () => {
            toast.success(isEdit ? "Sale updated successfully" : "Sale applied successfully");
            queryClient.invalidateQueries({ queryKey: ["sales"] });
            onOpenChange(false);
        },
        onError: () => {
            toast.error("Failed to save sale");
        },
    });

    const onSubmit = (data: CreateSaleInput) => {
        // Ensure dates are ISO strings if needed, but the schema validator handles date string validation.
        // However, backend takes Instant, so we might need to append time or let backend handle simple date string?
        // Backend `SaleRequest` has `saleStartDate` as `Instant`. JSON mapping usually handles standard ISO format.
        // `input type="date"` gives "YYYY-MM-DD". We probably need to convert to ISO.
        // Let's modify schema or transform here.
        const payload = {
            ...data,
            saleStartDate: new Date(data.saleStartDate).toISOString(),
            saleEndDate: new Date(data.saleEndDate).toISOString(),
        }
        mutation.mutate(payload);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Sale" : "Apply New Sale"}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update sale details for this variant."
                            : "Enter variant ID and sale details."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="variantId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Variant</FormLabel>
                                    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openCombobox}
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={isEdit}
                                                >
                                                    {field.value
                                                        ? variants.find((variant) => variant.id === field.value)?.sku || `Variant #${field.value}`
                                                        : "Select variant..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0">
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
                                                                {variants.map((variant) => (
                                                                    <CommandItem
                                                                        key={variant.id}
                                                                        value={String(variant.id)}
                                                                        onSelect={() => {
                                                                            form.setValue("variantId", variant.id);
                                                                            setOpenCombobox(false);
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                variant.id === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                        <div className="flex flex-col">
                                                                            <span className="font-medium">
                                                                                {variant.product?.name}
                                                                            </span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                SKU: {variant.sku} | Color: {variant.color?.name} | Size: {variant.size?.name}
                                                                            </span>
                                                                        </div>
                                                                    </CommandItem>
                                                                ))}
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="saleStartDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
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
                                            <Input type="date" {...field} />
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

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
