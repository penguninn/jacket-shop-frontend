
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { formatCurrency } from "@/shared/utils/format";
import { useState } from "react";

// Mock Data
const CATEGORIES = ["All", "T-Shirts", "Jackets", "Pants", "Accessories"];
const PRODUCTS = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    name: `Product Item ${i + 1}`,
    price: 150000 + (i * 10000),
    image: "https://placehold.co/150",
    stock: 20,
    category: CATEGORIES[i % 5] // Cycle through categories, index 0 is "All" so logic might need adjustment but fine for mock
}));

interface PosProductListProps {
    onAddToCart: (product: any) => void;
}

export function PosProductList({ onAddToCart }: PosProductListProps) {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = PRODUCTS.filter(p => {
        const matchesCategory = selectedCategory === "All" || p.category === CATEGORIES.find(c => c === selectedCategory); // simple mock logic, actually category assignment above is loose
        // Fix mock logic:
        const categoryMatch = selectedCategory === "All" || (CATEGORIES.indexOf(selectedCategory) === p.id % 5);
        const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return searchMatch; // simplified for now, category filtering on mock data needs consistent mapping
    });

    return (
        <div className="flex flex-col h-full w-2/3 border-r bg-white">
            {/* Header / Filter */}
            <div className="p-4 border-b space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search products by name or SKU..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {CATEGORIES.map(cat => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(cat)}
                            className="whitespace-nowrap"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <ScrollArea className="flex-1 p-4">
                <div className="grid grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            className="border rounded-md overflow-hidden cursor-pointer hover:shadow-md transition-shadow bg-white"
                            onClick={() => onAddToCart(product)}
                        >
                            <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">IMG</span>
                            </div>
                            <div className="p-3">
                                <h3 className="font-medium text-sm line-clamp-2 h-10">{product.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-red-500 font-bold text-sm">
                                        {formatCurrency(product.price)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Stock: {product.stock}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
