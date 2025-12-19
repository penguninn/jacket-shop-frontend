import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { usePublicProducts } from "@/features/products/hooks";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductFilters } from "@/features/products/components/ProductFilters";
import { Button } from "@/shared/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/ui/select";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/shared/ui/breadcrumb";
import { ChevronLeft, ChevronRight as ChevronRightIcon, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { ScrollArea } from "@/shared/ui/scroll-area";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();

    // URL Params
    const keyword = searchParams.get("keyword") || "";
    const page = parseInt(searchParams.get("page") || "0");
    const size = parseInt(searchParams.get("size") || "16"); // 16 for 4x4 grid

    // Raw params for effect dependencies
    const brandIdsParam = searchParams.get("brandIds");
    const styleIdsParam = searchParams.get("styleIds");
    const colorIdsParam = searchParams.get("colorIds");
    const sizeIdsParam = searchParams.get("sizeIds");
    const materialIdsParam = searchParams.get("materialIds");

    // Parse IDs from URL for initial state and usage
    const urlBrandIds = brandIdsParam?.split(",").map(Number).filter(Boolean) ?? [];
    const urlStyleIds = styleIdsParam?.split(",").map(Number).filter(Boolean) ?? [];
    const urlColorIds = colorIdsParam?.split(",").map(Number).filter(Boolean) ?? [];
    const urlSizeIds = sizeIdsParam?.split(",").map(Number).filter(Boolean) ?? [];
    const urlMaterialIds = materialIdsParam?.split(",").map(Number).filter(Boolean) ?? [];
    const urlMinPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 50;
    const urlMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 200;

    // Local Filter States (UI State)
    const [priceRange, setPriceRange] = useState([urlMinPrice, urlMaxPrice]);
    const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>(urlBrandIds);
    const [selectedStyleIds, setSelectedStyleIds] = useState<number[]>(urlStyleIds);
    // UI supports multi-select
    const [selectedColorIds, setSelectedColorIds] = useState<number[]>(urlColorIds);
    const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>(urlSizeIds);
    const [selectedMaterialIds, setSelectedMaterialIds] = useState<number[]>(urlMaterialIds);

    // Sync local state with URL
    useEffect(() => {
        const brands = brandIdsParam?.split(",").map(Number).filter(Boolean) ?? [];
        const styles = styleIdsParam?.split(",").map(Number).filter(Boolean) ?? [];
        const colors = colorIdsParam?.split(",").map(Number).filter(Boolean) ?? [];
        const sizes = sizeIdsParam?.split(",").map(Number).filter(Boolean) ?? [];
        const materials = materialIdsParam?.split(",").map(Number).filter(Boolean) ?? [];
        const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 50;
        const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 200;

        setSelectedBrandIds(brands);
        setSelectedStyleIds(styles);
        setSelectedColorIds(colors);
        setSelectedSizeIds(sizes);
        setSelectedMaterialIds(materials);
        setPriceRange([minPrice, maxPrice]);
    }, [brandIdsParam, styleIdsParam, colorIdsParam, sizeIdsParam, materialIdsParam, searchParams]);

    // API Query (Uses URL params for truth)
    const { data: productsData, isLoading } = usePublicProducts({
        page,
        size,
        search: keyword,
        brandIds: urlBrandIds.length > 0 ? urlBrandIds : undefined,
        styleIds: urlStyleIds.length > 0 ? urlStyleIds : undefined,
        colorIds: urlColorIds.length > 0 ? urlColorIds : undefined,
        sizeIds: urlSizeIds.length > 0 ? urlSizeIds : undefined,
        materialIds: urlMaterialIds.length > 0 ? urlMaterialIds : undefined,
        minPrice: urlMinPrice !== 50 ? urlMinPrice : undefined,
        maxPrice: urlMaxPrice !== 200 ? urlMaxPrice : undefined,
    });

    const products = productsData?.contents || [];
    const totalPages = productsData?.totalPages || 0;
    const totalElements = productsData?.totalElements || 0;

    const handlePageChange = (newPage: number) => {
        setSearchParams((prev: URLSearchParams) => {
            prev.set("page", newPage.toString());
            return prev;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleApplyFilters = () => {
        setSearchParams((prev) => {
            // Price
            // We only set if different from default to keep URL clean, or always set if preferred
            if (priceRange[0] !== 50) prev.set("minPrice", priceRange[0].toString());
            else prev.delete("minPrice");

            if (priceRange[1] !== 200) prev.set("maxPrice", priceRange[1].toString());
            else prev.delete("maxPrice");

            // Brands
            if (selectedBrandIds.length > 0) {
                prev.set("brandIds", selectedBrandIds.join(","));
            } else {
                prev.delete("brandIds");
            }

            // Styles
            if (selectedStyleIds.length > 0) {
                prev.set("styleIds", selectedStyleIds.join(","));
            } else {
                prev.delete("styleIds");
            }

            // Colors
            if (selectedColorIds.length > 0) {
                prev.set("colorIds", selectedColorIds.join(","));
            } else {
                prev.delete("colorIds");
            }

            // Sizes
            if (selectedSizeIds.length > 0) {
                prev.set("sizeIds", selectedSizeIds.join(","));
            } else {
                prev.delete("sizeIds");
            }

            // Materials
            if (selectedMaterialIds.length > 0) {
                prev.set("materialIds", selectedMaterialIds.join(","));
            } else {
                prev.delete("materialIds");
            }

            // Reset page to 0
            prev.set("page", "0");

            return prev;
        });
    };

    const filterProps = {
        priceRange,
        setPriceRange,
        selectedBrandIds,
        setSelectedBrandIds,
        selectedStyleIds,
        setSelectedStyleIds,
        selectedColorIds,
        setSelectedColorIds,
        selectedSizeIds,
        setSelectedSizeIds,
        selectedMaterialIds,
        setSelectedMaterialIds,
        onApply: handleApplyFilters
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{keyword || "Search"}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:block w-[295px] flex-shrink-0 border rounded-[20px] p-6 h-fit bg-white">
                    <ProductFilters {...filterProps} />
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                        <h1 className="text-3xl font-extrabold capitalize">
                            {keyword || "Search"}
                        </h1>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <span className="text-muted-foreground whitespace-nowrap">
                                Showing {(page * size) + 1}-{Math.min((page + 1) * size, totalElements)} of {totalElements} Products
                            </span>

                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground hidden sm:inline">Sort by:</span>
                                <Select defaultValue="popular">
                                    <SelectTrigger className="w-[140px] border-none shadow-none font-medium p-0 h-auto focus:ring-0">
                                        <SelectValue placeholder="Sort" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Mobile Filter Trigger */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="lg:hidden rounded-full">
                                        <SlidersHorizontal className="w-4 h-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="bottom" className="h-[90vh] rounded-t-[20px] p-5">
                                    <ScrollArea className="h-full pb-20 p-5">
                                        <ProductFilters {...filterProps} className="p-2" />
                                    </ScrollArea>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-[400px] bg-gray-100 rounded-[20px] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {products.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-xl text-gray-500">No products found.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 0 && (
                                <div className="flex justify-between items-center mt-10 pt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => handlePageChange(Math.max(0, page - 1))}
                                        disabled={page === 0}
                                        className="gap-2 px-4 py-2 h-auto text-sm font-medium"
                                    >
                                        <ChevronLeft className="w-4 h-4" /> Previous
                                    </Button>

                                    <div className="flex items-center gap-1">
                                        {/* Simple numeric pages for now */}
                                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                            let p = i;
                                            if (totalPages > 5 && page > 2) {
                                                p = page - 2 + i;
                                            }
                                            if (p >= totalPages) return null;

                                            // Ensure we always show valid pages
                                            if (p < 0) p = i; // simple fallback

                                            return (
                                                <Button
                                                    key={p}
                                                    variant={p === page ? "default" : "ghost"}
                                                    onClick={() => handlePageChange(p)}
                                                    className="w-10 h-10 p-0 font-medium"
                                                >
                                                    {p + 1}
                                                </Button>
                                            );
                                        })}
                                        {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}
                                        {totalPages > 5 && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => handlePageChange(totalPages - 1)}
                                                className="w-10 h-10 p-0 font-medium"
                                            >
                                                {totalPages}
                                            </Button>
                                        )}
                                    </div>

                                    <Button
                                        variant="outline"
                                        onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
                                        disabled={page >= totalPages - 1}
                                        className="gap-2 px-4 py-2 h-auto text-sm font-medium"
                                    >
                                        Next <ChevronRightIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
