
import { Search, Trash2, QrCode, Plus } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { formatCurrency } from "@/shared/utils/format";
import type { PosCartItem, PosProduct } from "../types";
import { useState } from "react";

// Mock Data for Search
const MOCK_PRODUCTS: PosProduct[] = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 100,
    name: `Jacket Model ${String.fromCharCode(65 + i)} - Size M`,
    price: 250000 + (i * 20000),
    image: "https://placehold.co/100",
    stock: 50,
    sku: `SKU-${100 + i}`,
    size: "M",
    color: i % 2 === 0 ? "Black" : "Blue"
}));

interface PosProductSectionProps {
    items: PosCartItem[];
    onAddItem: (product: PosProduct) => void;
    onRemoveItem: (id: number) => void;
    onUpdateQuantity: (id: number, quantity: number) => void;
}

export function PosProductSection({
    items,
    onAddItem,
    onRemoveItem,
    onUpdateQuantity
}: PosProductSectionProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [matches, setMatches] = useState<PosProduct[]>([]);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length > 0) {
            const hits = MOCK_PRODUCTS.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.sku?.toLowerCase().includes(query.toLowerCase())
            );
            setMatches(hits);
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    };

    const handleSelectProduct = (product: PosProduct) => {
        onAddItem(product);
        setSearchQuery("");
        setShowResults(false);
    };

    return (
        <div className="bg-white rounded-sm shadow-sm border mb-4">
            {/* Header / Search */}
            <div className="p-4 border-b">
                <div className="flex items-center gap-4">
                    <h3 className="font-bold text-red-500 border-l-4 border-red-500 pl-2">Products</h3>

                    <div className="flex-1 relative max-w-2xl mx-auto">
                        <div className="relative flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Scan QR code or search by Name, SKU..."
                                    className="pl-10 h-10"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                                    autoFocus
                                />
                            </div>
                            <Button variant="outline" className="gap-2 text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100">
                                <QrCode className="w-4 h-4" />
                                Scan QR
                            </Button>
                            <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
                                <Plus className="w-4 h-4" />
                                Add Custom
                            </Button>
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                                {matches.length > 0 ? (
                                    matches.map(product => (
                                        <div
                                            key={product.id}
                                            className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b last:border-b-0"
                                            onClick={() => handleSelectProduct(product)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img src={product.image} alt="" className="w-8 h-8 rounded object-cover bg-gray-100" />
                                                <div>
                                                    <div className="text-sm font-medium">{product.name}</div>
                                                    <div className="text-xs text-gray-500">Stock: {product.stock}</div>
                                                </div>
                                            </div>
                                            <div className="font-bold text-orange-600">{formatCurrency(product.price)}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">No products found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Table */}
            <div className="min-h-[300px]">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                        <tr>
                            <th className="px-4 py-3 w-12 text-center">#</th>
                            <th className="px-4 py-3 w-16">Img</th>
                            <th className="px-4 py-3">Product Name</th>
                            <th className="px-4 py-3 w-32 text-center">Quantity</th>
                            <th className="px-4 py-3 w-32 text-right">Price</th>
                            <th className="px-4 py-3 w-32 text-right">Total</th>
                            <th className="px-4 py-3 w-12 text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="w-8 h-8 opacity-20" />
                                        <span>Search/Scan products to add to order</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <img src={item.image} alt="" className="w-10 h-10 rounded object-cover bg-gray-100 border" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-gray-900 line-clamp-1">{item.name}</div>
                                        <div className="text-xs text-gray-500">{item.sku}</div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                className="w-7 h-7 flex items-center justify-center border rounded-l hover:bg-gray-100"
                                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="text"
                                                value={item.quantity}
                                                className="w-12 h-7 text-center border-y focus:outline-none"
                                                readOnly // For now
                                            />
                                            <button
                                                className="w-7 h-7 flex items-center justify-center border rounded-r hover:bg-gray-100"
                                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-600">
                                        {formatCurrency(item.price)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium text-orange-600">
                                        {formatCurrency(item.price * item.quantity)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                                            onClick={() => onRemoveItem(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Total Row (Optional summary within table card) */}
            {items.length > 0 && (
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-12 font-bold text-gray-700">
                    <span>Total Quantity: {items.reduce((s, i) => s + i.quantity, 0)}</span>
                    <span>Total Amount: {formatCurrency(items.reduce((s, i) => s + (i.price * i.quantity), 0))}</span>
                </div>
            )}
        </div>
    );
}
