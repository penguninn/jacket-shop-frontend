import { useState } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Slider } from "@/shared/ui/slider";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";

import { useProductVariants } from "@/features/product-variants/hooks";
import { usePosStore } from "../hooks/usePosState";
import { useAddItemToPosDraft, useCreatePosDraft } from "../hooks/usePosApi";
import { useBrands, useStyles } from "@/features/products/hooks";
import { useColors, useMaterials, useSizes } from "@/features/attributes/hooks";
import { cn } from "@/shared/lib/utils";
import { formatCurrency } from "@/shared/utils/format";
import { toast } from "sonner";

export function ProductSearch() {
    const { currentDraft, setCurrentDraft } = usePosStore();
    const { mutate: addItem, isPending: isAdding } = useAddItemToPosDraft();
    const { mutate: createDraft, isPending: isCreatingDraft } = useCreatePosDraft();

    // Filters State
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrand, setSelectedBrand] = useState<string>("all");
    const [selectedStyle, setSelectedStyle] = useState<string>("all");
    const [selectedColor, setSelectedColor] = useState<string>("all");
    const [selectedSize, setSelectedSize] = useState<string>("all");
    const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
    const [page, setPage] = useState(0);

    const debouncedSearch = useDebounce(searchTerm, 300);
    const debouncedPrice = useDebounce(priceRange, 500);

    // Filter Options Query
    const { data: brandsData } = useBrands({ size: 1000, status: ["ACTIVE"] });
    const { data: stylesData } = useStyles({ size: 1000, status: ["ACTIVE"] });
    const { data: colorsData } = useColors({ page: 0, size: 1000, status: ["ACTIVE"] });
    const { data: sizesData } = useSizes({ page: 0, size: 1000, status: ["ACTIVE"] });
    const { data: materialsData } = useMaterials({ page: 0, size: 1000, status: ["ACTIVE"] });

    const queryParams: any = {
        page,
        size: 20,
        search: debouncedSearch,
        fromPrice: debouncedPrice[0],
        toPrice: debouncedPrice[1],
        colorIds: selectedColor !== "all" ? [parseInt(selectedColor)] : undefined,
        sizeIds: selectedSize !== "all" ? [parseInt(selectedSize)] : undefined,
        materialIds: selectedMaterial !== "all" ? [parseInt(selectedMaterial)] : undefined,
    };

    const { data: variantsData, isLoading } = useProductVariants(queryParams);

    const filteredContents = variantsData?.contents.filter(variant => {
        if (selectedBrand !== "all" && variant.product?.brand?.id !== parseInt(selectedBrand)) return false;
        if (selectedStyle !== "all" && variant.product?.style?.id !== parseInt(selectedStyle)) return false;
        return true;
    }) || [];

    const handleAddToCart = (variant: any) => {
        if (!currentDraft) {
            // No draft exists - create one with this first item
            createDraft({
                orderType: "POS_INSTORE",
                items: [{
                    productVariantId: variant.id,
                    quantity: 1
                }]
            }, {
                onSuccess: (newDraft) => {
                    setCurrentDraft(newDraft);
                    toast.success("Item added to new draft");
                },
                onError: (error: any) => {
                    toast.error("Failed to add item", {
                        description: error.response?.data?.message
                    });
                }
            });
        } else {
            // Draft exists - add item to it
            addItem({
                draftId: currentDraft.id,
                item: {
                    productVariantId: variant.id,
                    quantity: 1
                }
            }, {
                onSuccess: (updatedDraft) => {
                    setCurrentDraft(updatedDraft);
                    toast.success("Item added");
                },
                onError: (error: any) => {
                    toast.error("Failed to add item", {
                        description: error.response?.data?.message
                    });
                }
            });
        }
    };

    return (
        <div className="w-full flex flex-col h-full bg-background rounded-b-lg">
            {/* Filter Bar */}
            <div className="p-4 space-y-4 border-b bg-muted/10">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, code, sku..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(0); // Reset page on search
                            }}
                            className="pl-9 h-10 w-full bg-background border-muted-foreground/20"
                        />
                    </div>

                    <div className="flex items-center gap-4 bg-background p-2 px-4 rounded-md border border-muted-foreground/20 w-full md:w-auto">
                        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Price Range</span>
                        <Slider
                            defaultValue={[0, 10000000]}
                            value={priceRange}
                            min={0}
                            max={10000000}
                            step={100000}
                            onValueChange={(val) => {
                                setPriceRange(val as [number, number]);
                                setPage(0);
                            }}
                            className="w-[180px]"
                        />
                        <span className="text-xs font-mono whitespace-nowrap">
                            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <FilterSelect
                        placeholder="Category"
                        value={selectedStyle}
                        onChange={(val) => {
                            setSelectedStyle(val);
                            setPage(0);
                        }}
                        options={stylesData?.contents || []}
                    />
                    <FilterSelect
                        placeholder="Brand"
                        value={selectedBrand}
                        onChange={(val) => {
                            setSelectedBrand(val);
                            setPage(0);
                        }}
                        options={brandsData?.contents || []}
                    />
                    <FilterSelect
                        placeholder="Color"
                        value={selectedColor}
                        onChange={(val) => {
                            setSelectedColor(val);
                            setPage(0);
                        }}
                        options={colorsData?.contents || []}
                        showColor
                    />
                    <FilterSelect
                        placeholder="Size"
                        value={selectedSize}
                        onChange={(val) => {
                            setSelectedSize(val);
                            setPage(0);
                        }}
                        options={sizesData?.contents || []}
                    />
                    <FilterSelect
                        placeholder="Material"
                        value={selectedMaterial}
                        onChange={(val) => {
                            setSelectedMaterial(val);
                            setPage(0);
                        }}
                        options={materialsData?.contents || []}
                    />
                    {(selectedBrand !== "all" || selectedStyle !== "all" || selectedColor !== "all" || selectedSize !== "all" || selectedMaterial !== "all") && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedBrand("all");
                                setSelectedStyle("all");
                                setSelectedColor("all");
                                setSelectedSize("all");
                                setSelectedMaterial("all");
                                setPage(0);
                            }}
                            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Results Table */}
            <div className="flex-1 overflow-hidden bg-background flex flex-col">
                <ScrollArea className="flex-1">
                    <Table>
                        <TableHeader className="bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[70px] pl-4">Image</TableHead>
                                <TableHead className="min-w-[200px]">Product</TableHead>
                                <TableHead className="w-[150px]">Code</TableHead>
                                <TableHead className="w-[100px]">Color</TableHead>
                                <TableHead className="w-[80px]">Size</TableHead>
                                <TableHead className="w-[100px]">Material</TableHead>
                                <TableHead className="text-right w-[120px]">Price</TableHead>
                                <TableHead className="w-[100px] text-center pr-4">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-48 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                                            <span className="text-sm">Loading products...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredContents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Search className="h-8 w-8 opacity-20" />
                                            <span className="text-sm">No products found matching filters.</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredContents.map((variant) => (
                                    <TableRow key={variant.id} className="group hover:bg-muted/30 transition-colors">
                                        <TableCell className="pl-4 py-3">
                                            <div className="h-10 w-10 bg-muted/50 rounded-md overflow-hidden border">
                                                {variant.product?.thumbnail || variant.image ? (
                                                    <img
                                                        src={variant.image || variant.product?.thumbnail || ""}
                                                        alt={variant.product?.name || "Product"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-[8px] text-muted-foreground uppercase font-bold tracking-tighter">No Img</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-sm text-foreground">
                                                {variant.product?.name || "Unknown Product"}
                                            </div>
                                            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <span className="truncate max-w-[150px] inline-block">
                                                    {variant.product?.brand?.name || "Brand N/A"}
                                                </span>
                                                <span>•</span>
                                                <span className="truncate max-w-[150px] inline-block">
                                                    {variant.product?.style?.name || "Style N/A"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono truncate max-w-[140px] block" title={variant.sku || ""}>
                                                {variant.sku || "-"}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2" title={variant.color?.name}>
                                                {variant.color?.hexCode && (
                                                    <div
                                                        className="w-3 h-3 rounded-full border shadow-sm shrink-0"
                                                        style={{ backgroundColor: variant.color.hexCode }}
                                                    />
                                                )}
                                                <span className="text-sm truncate w-[80px]">{variant.color?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal text-xs bg-muted/50 text-foreground hover:bg-muted">
                                                {variant.size?.name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground truncate max-w-[100px]" title={variant.material?.name}>
                                            {variant.material?.name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="font-bold text-sm">
                                                {formatCurrency(variant.price)}
                                            </div>
                                            {variant.quantity <= 0 && (
                                                <span className="text-[10px] text-red-500 font-medium block">Out of Stock</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center pr-4">
                                            <Button
                                                size="sm"
                                                variant={variant.quantity > 0 ? "default" : "secondary"}
                                                className={cn(
                                                    "h-8 w-full text-xs transition-all",
                                                    variant.quantity > 0
                                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                                        : "opacity-50 cursor-not-allowed"
                                                )}
                                                onClick={() => handleAddToCart(variant)}
                                                disabled={variant.quantity <= 0}
                                            >
                                                {variant.quantity > 0 ? "Select" : "Sold Out"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>

                {/* Pagination Controls */}
                <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                        Page {variantsData?.page !== undefined ? variantsData.page + 1 : 1} of {variantsData?.totalPages || 1}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0 || isLoading}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={!variantsData || page + 1 >= variantsData.totalPages || isLoading}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FilterSelect({
    placeholder,
    value,
    onChange,
    options,
    showColor = false
}: {
    placeholder: string,
    value: string,
    onChange: (val: string) => void,
    options: any[],
    showColor?: boolean
}) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All {placeholder}s</SelectItem>
                {options.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id.toString()}>
                        <div className="flex items-center gap-2">
                            {showColor && opt.hexCode && (
                                <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: opt.hexCode }} />
                            )}
                            {opt.name}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
