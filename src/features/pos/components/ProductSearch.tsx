import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import { cn } from "@/shared/lib/utils";

// Dữ liệu giả để hiển thị UI
const DUMMY_PRODUCTS = [
    {
        id: 1,
        name: "Classic Denim Jacket",
        brand: "Levi's",
        style: "Casual",
        sku: "JKT-001-BL",
        color: { name: "Blue", hex: "#0000FF" },
        size: "L",
        material: "Denim",
        price: "1.200.000 ₫",
        stock: 15,
        image: null
    },
    {
        id: 2,
        name: "Slim Fit T-Shirt",
        brand: "Uniqlo",
        style: "Basic",
        sku: "TSH-002-WH",
        color: { name: "White", hex: "#FFFFFF" },
        size: "M",
        material: "Cotton",
        price: "350.000 ₫",
        stock: 5, // Low stock example
        image: null
    },
    {
        id: 3,
        name: "Leather Biker Jacket",
        brand: "Zara",
        style: "Biker",
        sku: "LJK-003-BK",
        color: { name: "Black", hex: "#000000" },
        size: "XL",
        material: "Leather",
        price: "2.500.000 ₫",
        stock: 0, // Out of stock example
        image: null
    }
];

export function ProductSearch() {
    return (
        <div className="w-full flex flex-col h-full bg-background rounded-b-lg">
            {/* Filter Bar */}
            <div className="p-4 space-y-4 border-b bg-muted/10">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, code, sku..."
                            className="pl-9 h-10 w-full bg-background border-muted-foreground/20"
                        />
                    </div>

                    <div className="flex items-center gap-4 bg-background p-2 px-4 rounded-md border border-muted-foreground/20 w-full md:w-auto">
                        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Price Range</span>
                        <Slider
                            defaultValue={[0, 10000000]}
                            min={0}
                            max={10000000}
                            step={100000}
                            className="w-[180px]"
                        />
                        <span className="text-xs font-mono whitespace-nowrap">
                            0 ₫ - 10.000.000 ₫
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <FilterSelect placeholder="Category" />
                    <FilterSelect placeholder="Brand" />
                    <FilterSelect placeholder="Color" showColor />
                    <FilterSelect placeholder="Size" />
                    <FilterSelect placeholder="Material" />

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                        Reset
                    </Button>
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
                            {/* Dummy Data Mapping */}
                            {DUMMY_PRODUCTS.map((variant) => (
                                <TableRow key={variant.id} className="group hover:bg-muted/30 transition-colors">
                                    <TableCell className="pl-4 py-3">
                                        <div className="h-10 w-10 bg-muted/50 rounded-md overflow-hidden border flex items-center justify-center">
                                            {variant.image ? (
                                                <img
                                                    src={variant.image}
                                                    alt="Product"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-tighter">No Img</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold text-sm text-foreground">
                                            {variant.name}
                                        </div>
                                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                            <span className="truncate max-w-[150px] inline-block">
                                                {variant.brand}
                                            </span>
                                            <span>•</span>
                                            <span className="truncate max-w-[150px] inline-block">
                                                {variant.style}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono truncate max-w-[140px] block">
                                            {variant.sku}
                                        </code>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full border shadow-sm shrink-0"
                                                style={{ backgroundColor: variant.color.hex }}
                                            />
                                            <span className="text-sm truncate w-[80px]">{variant.color.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal text-xs bg-muted/50 text-foreground hover:bg-muted">
                                            {variant.size}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground truncate max-w-[100px]">
                                        {variant.material}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="font-bold text-sm">
                                            {variant.price}
                                        </div>
                                        {variant.stock <= 0 && (
                                            <span className="text-[10px] text-red-500 font-medium block">Out of Stock</span>
                                        )}
                                        {variant.stock > 0 && variant.stock < 10 && (
                                            <span className="text-[10px] text-orange-500 font-medium block">Low Stock ({variant.stock})</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center pr-4">
                                        <Button
                                            size="sm"
                                            variant={variant.stock > 0 ? "default" : "secondary"}
                                            disabled={variant.stock <= 0}
                                            className={cn(
                                                "h-8 w-full text-xs transition-all",
                                                variant.stock > 0
                                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                                                    : "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {variant.stock > 0 ? "Select" : "Sold Out"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>

                {/* Pagination Controls */}
                <div className="p-4 border-t bg-muted/10 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                        Page 1 of 10
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
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

// UI Helper Component
function FilterSelect({
    placeholder,
    showColor = false
}: {
    placeholder: string,
    showColor?: boolean
}) {
    return (
        <Select>
            <SelectTrigger className="w-[140px] h-9 text-xs">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All {placeholder}s</SelectItem>
                <SelectItem value="1">
                    <div className="flex items-center gap-2">
                        {showColor && (
                            <div className="w-3 h-3 rounded-full border bg-black" />
                        )}
                        Option 1
                    </div>
                </SelectItem>
                <SelectItem value="2">
                    <div className="flex items-center gap-2">
                        {showColor && (
                            <div className="w-3 h-3 rounded-full border bg-white" />
                        )}
                        Option 2
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}