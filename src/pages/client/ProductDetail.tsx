
import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { usePublicProductDetail, usePublicProducts } from "@/features/products/hooks";
import { usePublicProductVariantsByProduct } from "@/features/product-variants/hooks";
import { useAddToCart } from "@/features/cart/hooks";
import { Button } from "@/shared/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/shared/ui/breadcrumb";
import { Separator } from "@/shared/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Star, Minus, Plus, Check, Settings2 } from "lucide-react";
import { formatCurrency } from "@/shared/utils/format";
import { cn } from "@/shared/lib/utils";
import { ProductCard } from "@/features/products/components/ProductCard";
import { Badge } from "@/shared/ui/badge";

export default function ProductDetail() {
    const { id } = useParams();
    const productId = Number(id);

    // Fetching Data
    const { data: product, isLoading: isProductLoading } = usePublicProductDetail(productId);
    const { data: variants, isLoading: isVariantsLoading } = usePublicProductVariantsByProduct(productId);
    const addToCartMutation = useAddToCart();

    // Recommendations (Public Products)
    // We try to fetch products of same style or just random public products
    const { data: relatedData } = usePublicProducts({
        page: 0,
        size: 4,
        brandIds: product?.brand ? [product.brand.id] : undefined
    });

    // Local State
    const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
    const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Derived State: Use Product's attribute lists as primary source, fallback to variants
    const uniqueColors = useMemo(() => {
        if (product?.colors && product.colors.length > 0) return product.colors;
        if (!variants) return [];
        const seen = new Set();
        const colors = [];
        for (const v of variants) {
            if (!seen.has(v.color.id)) {
                seen.add(v.color.id);
                colors.push(v.color);
            }
        }
        return colors;
    }, [variants, product]);

    const uniqueSizes = useMemo(() => {
        if (product?.sizes && product.sizes.length > 0) return product.sizes;
        if (!variants) return [];
        const seen = new Set();
        const sizes = [];
        for (const v of variants) {
            if (!seen.has(v.size.id)) {
                seen.add(v.size.id);
                sizes.push(v.size);
            }
        }
        return sizes;
    }, [variants, product]);

    const uniqueMaterials = useMemo(() => {
        if (product?.materials && product.materials.length > 0) return product.materials;
        if (!variants) return [];
        const seen = new Set();
        const materials = [];
        for (const v of variants) {
            if (!seen.has(v.material.id)) {
                seen.add(v.material.id);
                materials.push(v.material);
            }
        }
        return materials;
    }, [variants, product]);

    // Derived Variants Filtering
    const selectedVariant = useMemo(() => {
        if (!variants || !selectedColorId || !selectedSizeId || !selectedMaterialId) return null;
        return variants.find(v =>
            v.color.id === selectedColorId &&
            v.size.id === selectedSizeId &&
            v.material.id === selectedMaterialId
        );
    }, [variants, selectedColorId, selectedSizeId, selectedMaterialId]);

    // Initial Selections
    useEffect(() => {
        if (product?.thumbnail && !selectedImage) {
            setSelectedImage(product.thumbnail);
        }
    }, [product, selectedImage]);

    // Update image when variant changes (if variant has specific image)
    useEffect(() => {
        if (selectedVariant?.image) {
            setSelectedImage(selectedVariant.image);
        } else if (product?.thumbnail && !selectedImage) {
            setSelectedImage(product.thumbnail); // Fallback to main
        }
    }, [selectedVariant, product, selectedImage]);

    // Matrix Validation Helpers (3-Way)
    const isColorDisabled = (colorId: number) => {
        if (!variants) return true;

        let valid = false;

        // Case 1: Size + Material selected
        if (selectedSizeId && selectedMaterialId) {
            valid = variants.some(v => v.color.id === colorId && v.size.id === selectedSizeId && v.material.id === selectedMaterialId);
        }
        // Case 2: Only Size selected
        else if (selectedSizeId) {
            valid = variants.some(v => v.color.id === colorId && v.size.id === selectedSizeId);
        }
        // Case 3: Only Material selected
        else if (selectedMaterialId) {
            valid = variants.some(v => v.color.id === colorId && v.material.id === selectedMaterialId);
        }
        // Case 4: No other selection - just check if color exists in ANY variant (should be true if uniqueColors is correct)
        else {
            valid = variants.some(v => v.color.id === colorId);
        }

        return !valid;
    };

    const isSizeDisabled = (sizeId: number) => {
        if (!variants) return true;

        let valid = false;

        // Case 1: Color + Material selected
        if (selectedColorId && selectedMaterialId) {
            valid = variants.some(v => v.size.id === sizeId && v.color.id === selectedColorId && v.material.id === selectedMaterialId);
        }
        // Case 2: Only Color selected
        else if (selectedColorId) {
            valid = variants.some(v => v.size.id === sizeId && v.color.id === selectedColorId);
        }
        // Case 3: Only Material selected
        else if (selectedMaterialId) {
            valid = variants.some(v => v.size.id === sizeId && v.material.id === selectedMaterialId);
        }
        // Case 4: None
        else {
            valid = variants.some(v => v.size.id === sizeId);
        }

        return !valid;
    };

    const isMaterialDisabled = (materialId: number) => {
        if (!variants) return true;

        let valid = false;

        // Case 1: Color + Size selected
        if (selectedColorId && selectedSizeId) {
            valid = variants.some(v => v.material.id === materialId && v.color.id === selectedColorId && v.size.id === selectedSizeId);
        }
        // Case 2: Only Color selected
        else if (selectedColorId) {
            valid = variants.some(v => v.material.id === materialId && v.color.id === selectedColorId);
        }
        // Case 3: Only Size selected
        else if (selectedSizeId) {
            valid = variants.some(v => v.material.id === materialId && v.size.id === selectedSizeId);
        }
        // Case 4: None
        else {
            valid = variants.some(v => v.material.id === materialId);
        }

        return !valid;
    };

    // Toggle Handlers with Auto-Deselect Logic
    const handleColorClick = (id: number) => {
        if (selectedColorId === id) {
            setSelectedColorId(null);
        } else {
            setSelectedColorId(id);

            // Validate Size compatibility
            if (selectedSizeId) {
                const isValid = selectedMaterialId
                    ? variants?.some(v => v.color.id === id && v.size.id === selectedSizeId && v.material.id === selectedMaterialId)
                    : variants?.some(v => v.color.id === id && v.size.id === selectedSizeId);

                if (!isValid) setSelectedSizeId(null);
            }

            // Validate Material compatibility
            if (selectedMaterialId) {
                // Note: We use the *potential* new state. 
                // If Size was kept (isValid above was true), we check 3-way.
                // If Size was reset, we check 2-way (Color + Material).
                // Simplifying assumption: Check if current Material is compatible with new Color (+ existing Size if valid).

                // However, since state updates are batched, `selectedSizeId` here is the OLD one.
                // So we need to re-evaluate logic slightly or just be conservative.

                // Strict Check: Is Material valid with new Color AND (old Size if compatible)?
                const isSizeCompatible = selectedSizeId && (selectedMaterialId
                    ? variants?.some(v => v.color.id === id && v.size.id === selectedSizeId && v.material.id === selectedMaterialId)
                    : variants?.some(v => v.color.id === id && v.size.id === selectedSizeId));

                const targetSizeId = isSizeCompatible ? selectedSizeId : null; // What it WILL be

                const isValidMat = targetSizeId
                    ? variants?.some(v => v.color.id === id && v.material.id === selectedMaterialId && v.size.id === targetSizeId)
                    : variants?.some(v => v.color.id === id && v.material.id === selectedMaterialId);

                if (!isValidMat) setSelectedMaterialId(null);
            }
        }
    };

    const handleSizeClick = (id: number) => {
        if (selectedSizeId === id) {
            setSelectedSizeId(null);
        } else {
            setSelectedSizeId(id);

            // Validate Color compatibility
            if (selectedColorId) {
                const isValid = selectedMaterialId
                    ? variants?.some(v => v.size.id === id && v.color.id === selectedColorId && v.material.id === selectedMaterialId)
                    : variants?.some(v => v.size.id === id && v.color.id === selectedColorId);

                if (!isValid) setSelectedColorId(null);
            }

            // Validate Material compatibility
            if (selectedMaterialId) {
                // Simple check for now
                const targetColorId = (selectedColorId && variants?.some(v => v.size.id === id && v.color.id === selectedColorId))
                    ? selectedColorId
                    : null;

                const isValidMat = targetColorId
                    ? variants?.some(v => v.size.id === id && v.material.id === selectedMaterialId && v.color.id === targetColorId)
                    : variants?.some(v => v.size.id === id && v.material.id === selectedMaterialId);

                if (!isValidMat) setSelectedMaterialId(null);
            }
        }
    };

    const handleMaterialClick = (id: number) => {
        if (selectedMaterialId === id) {
            setSelectedMaterialId(null);
        } else {
            setSelectedMaterialId(id);

            // Validate Color compatibility
            if (selectedColorId) {
                const isValid = selectedSizeId
                    ? variants?.some(v => v.material.id === id && v.color.id === selectedColorId && v.size.id === selectedSizeId)
                    : variants?.some(v => v.material.id === id && v.color.id === selectedColorId);

                if (!isValid) setSelectedColorId(null);
            }

            // Validate Size compatibility
            if (selectedSizeId) {
                // Check if Size is compatible with new Material (+ Color if Color is compatible).

                const targetColorId = (selectedColorId && variants?.some(v => v.material.id === id && v.color.id === selectedColorId))
                    ? selectedColorId
                    : null;

                const isValidSize = targetColorId
                    ? variants?.some(v => v.material.id === id && v.size.id === selectedSizeId && v.color.id === targetColorId)
                    : variants?.some(v => v.material.id === id && v.size.id === selectedSizeId);

                if (!isValidSize) setSelectedSizeId(null);
            }
        }
    };


    if (isProductLoading || isVariantsLoading) {
        return <div className="container mx-auto py-20 text-center">Loading product...</div>;
    }

    if (!product) {
        return <div className="container mx-auto py-20 text-center">Product not found.</div>;
    }

    // Price Logic
    // Dynamic Price Logic
    // If variant selected -> use its price. Else -> range.
    const displayPrice = selectedVariant
        ? (selectedVariant.salePrice ?? selectedVariant.price)
        : (product.minPrice === product.maxPrice ? product.minPrice : null);

    // used for discount calc
    const originalPrice = selectedVariant?.price || 0;
    const hasDiscount = selectedVariant ? (selectedVariant.salePrice != null && selectedVariant.salePrice < originalPrice) : false;
    const discountPercent = selectedVariant?.discountPercentage || 0;

    const maxStock = selectedVariant ? (selectedVariant.availableQuantity ?? 0) : 0;
    const isOutOfStock = selectedVariant && maxStock <= 0;

    // Helper for fallback colors if hexCode is missing
    const getColorStyle = (color: { name: string, hexCode?: string }) => {
        if (color.hexCode) return { backgroundColor: color.hexCode };

        // Fallback mock logic
        const lower = color.name.toLowerCase();
        let bg = '#333';
        if (lower.includes('green')) bg = '#047857';
        else if (lower.includes('blue')) bg = '#1e3a8a';
        else if (lower.includes('black')) bg = '#000';
        else if (lower.includes('white')) bg = '#fff';
        else if (lower.includes('red')) bg = '#dc2626';
        else if (lower.includes('yellow')) bg = '#facc15';
        else if (lower.includes('grey') || lower.includes('gray')) bg = '#6b7280';

        return { backgroundColor: bg };
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="container mx-auto px-4 py-6">
                <Breadcrumb className="mb-8 text-sm text-muted-foreground">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild><Link to="/search">Shop</Link></BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild><Link to={`/search?styleIds=${product.style.id}`}>{product.style.name}</Link></BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-foreground">{product.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Left: Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-[#F0EEED] rounded-[20px] overflow-hidden relative group">
                            {selectedImage ? (
                                <img src={selectedImage} alt={product.name} className="w-full h-full object-cover object-center" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {product.thumbnail && (
                                <button
                                    onClick={() => setSelectedImage(product.thumbnail!)}
                                    className={cn(
                                        "w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all",
                                        selectedImage === product.thumbnail ? "border-black shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <img src={product.thumbnail} alt="Main" className="w-full h-full object-cover" />
                                </button>
                            )}
                            {variants?.filter(v => v.image).map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => setSelectedImage(v.image!)}
                                    className={cn(
                                        "w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all",
                                        selectedImage === v.image ? "border-black shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <img src={v.image!} alt={v.color.name} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div>
                        <h1 className="text-4xl font-extrabold uppercase mb-2 tracking-tight">{product.name}</h1>

                        {/* Rating & Sold Stats */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex text-[#FFC633]">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn("w-5 h-5 fill-current", i < Math.round(product.ratingAverage || 0) ? "text-[#FFC633]" : "text-gray-200")}
                                        strokeWidth={0}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium">
                                {product.ratingAverage}/5
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-gray-500">
                                {product.ratingCount || 0} Reviews
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="text-sm text-gray-500">
                                {product.soldCount || 0} Sold
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl font-bold">
                                {displayPrice !== null
                                    ? formatCurrency(displayPrice)
                                    : `${formatCurrency(product.minPrice || 0)} - ${formatCurrency(product.maxPrice || 0)}`
                                }
                            </span>

                            {/* Discount Display */}
                            {hasDiscount && (
                                <>
                                    <span className="text-3xl font-bold text-gray-300 line-through decoration-2">
                                        {formatCurrency(originalPrice)}
                                    </span>
                                    {discountPercent > 0 && (
                                        <Badge variant="destructive" className="bg-[#FF3333]/10 text-[#FF3333] hover:bg-[#FF3333]/20 px-3 py-1 rounded-full text-sm">
                                            -{discountPercent}%
                                        </Badge>
                                    )}
                                </>
                            )}
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {product.description || "No description available for this product."}
                        </p>

                        <Separator className="mb-6" />

                        {/* Select Colors */}
                        <div className="mb-6">
                            <p className="text-gray-500 text-sm font-medium mb-3">Select Colors</p>
                            <div className="flex gap-3">
                                {uniqueColors.map((color) => {
                                    const isSelected = selectedColorId === color.id;
                                    return (
                                        <button
                                            key={color.id}
                                            onClick={() => handleColorClick(color.id)}
                                            className={cn(
                                                "w-9 h-9 rounded-full flex items-center justify-center transition-all border border-gray-200 shadow-sm",
                                                isSelected && "ring-2 ring-offset-2 ring-black",
                                                isColorDisabled(color.id) && "opacity-20 cursor-not-allowed hover:border-gray-200"
                                            )}
                                            style={getColorStyle(color)}
                                            title={color.name}
                                        >
                                            {isSelected && (
                                                <Check className={cn("w-4 h-4", color.name.toLowerCase() === 'white' ? "text-black" : "text-white")} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <Separator className="mb-6" />

                        {/* Select Size */}
                        <div className="mb-6">
                            <p className="text-gray-500 text-sm font-medium mb-3">Choose Size</p>
                            <div className="flex flex-wrap gap-3">
                                {uniqueSizes.map((size) => {
                                    const isSelected = selectedSizeId === size.id;
                                    const isDisabled = isSizeDisabled(size.id);

                                    return (
                                        <button
                                            key={size.id}
                                            onClick={() => handleSizeClick(size.id)}
                                            className={cn(
                                                "px-6 py-3 rounded-full text-sm font-medium transition-colors bg-[#F0F0F0] text-gray-500",
                                                isSelected && "bg-black text-white",
                                                isDisabled && "opacity-40 cursor-not-allowed decoration-slice bg-gray-100 text-gray-300",
                                                !isSelected && !isDisabled && "hover:bg-gray-200 text-gray-700"
                                            )}
                                        >
                                            {size.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Select Material */}
                        <div className="mb-8">
                            <p className="text-gray-500 text-sm font-medium mb-3">Choose Material</p>
                            <div className="flex flex-wrap gap-3">
                                {uniqueMaterials.map((material) => {
                                    const isSelected = selectedMaterialId === material.id;
                                    const isDisabled = isMaterialDisabled(material.id);

                                    return (
                                        <button
                                            key={material.id}
                                            onClick={() => handleMaterialClick(material.id)}
                                            className={cn(
                                                "px-6 py-3 rounded-full text-sm font-medium transition-colors bg-[#F0F0F0] text-gray-500",
                                                isSelected && "bg-black text-white",
                                                isDisabled && "opacity-40 cursor-not-allowed decoration-slice bg-gray-100 text-gray-300",
                                                !isSelected && !isDisabled && "hover:bg-gray-200 text-gray-700"
                                            )}
                                        >
                                            {material.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <Separator className="mb-8" />

                        {/* Actions */}
                        <div className="flex gap-4">
                            {/* Quantity Stepper */}
                            <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-3 h-[52px]">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-1 hover:text-black text-gray-500 transition-colors"
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    disabled={isOutOfStock || (selectedVariant ? quantity >= (maxStock) : false)}
                                    className="p-1 hover:text-black text-gray-500 transition-colors disabled:opacity-30"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Add to Cart */}
                            <Button
                                className="flex-1 h-[52px] rounded-full text-base font-medium"
                                size="lg"
                                disabled={isOutOfStock || !selectedVariant || addToCartMutation.isPending}
                                onClick={() => {
                                    if (selectedVariant) {
                                        addToCartMutation.mutate({
                                            productVariantId: selectedVariant.id,
                                            quantity
                                        });
                                    }
                                }}
                            >
                                {addToCartMutation.isPending ? "Adding..." : (selectedVariant
                                    ? (isOutOfStock ? "Out of Stock" : "Add to Cart")
                                    : "Select Variation")}
                            </Button>
                        </div>

                        {/* Stock Availability */}
                        <div className="mt-3 text-sm text-gray-500 font-medium h-5">
                            {selectedVariant ? (
                                <span>{maxStock} pieces available</span>
                            ) : (
                                <span>&nbsp;</span>
                            )}
                        </div>
                    </div>
                </div>


                {/* Tabs Section (Reviews, FAQs) */}
                <div className="mb-16">
                    <Tabs defaultValue="reviews">
                        <TabsList className="w-full justify-around border-b rounded-none h-auto p-0 bg-transparent">
                            <TabsTrigger
                                value="details"
                                className="flex-1 pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none text-gray-500 font-medium text-lg"
                            >
                                Product Details
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="flex-1 pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none text-gray-500 font-medium text-lg"
                            >
                                Rating & Reviews
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="pt-8 bg-white rounded-lg">
                            {/* Product Specifications */}
                            <div className="mb-10">
                                <h3 className="text-xl font-bold bg-gray-50 p-4 mb-6">Product Specifications</h3>
                                <div className="space-y-4 px-4">
                                    <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] items-baseline">
                                        <span className="text-gray-500 font-medium">Brand</span>
                                        <Link to={`/search?brandIds=${product.brand.id}`} className="text-blue-600 hover:underline">
                                            {product.brand.name}
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] items-baseline">
                                        <span className="text-gray-500 font-medium">Style</span>
                                        <Link to={`/search?styleIds=${product.style.id}`} className="text-blue-600 hover:underline">
                                            {product.style.name}
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] items-baseline">
                                        <span className="text-gray-500 font-medium">Stock</span>
                                        <span className="text-gray-900">{variants && variants.length > 0 ? "IN STOCK" : "OUT OF STOCK"}</span>
                                    </div>



                                    <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] items-baseline">
                                        <span className="text-gray-500 font-medium">Material</span>
                                        <span className="text-gray-900">
                                            {uniqueMaterials.length > 0
                                                ? uniqueMaterials.map(m => m.name).join(', ')
                                                : "N/A"
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Product Description */}
                            <div>
                                <h3 className="text-xl font-bold bg-gray-50 p-4 mb-6">Product Description</h3>
                                <div className="px-4 text-gray-700 leading-relaxed whitespace-pre-line">
                                    {product.description || "No description available for this product."}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews" className="pt-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    All Reviews
                                    <span className="text-base font-normal text-gray-400">({product.ratingCount || 0})</span>
                                </h3>
                                <div className="flex gap-2">
                                    <Button variant="secondary" className="rounded-full w-10 h-10 p-0 bg-[#F0F0F0]">
                                        <Settings2 className="w-5 h-5" />
                                    </Button>
                                    <Button className="rounded-full bg-black text-white hover:bg-black/90 px-6">
                                        Write a Review
                                    </Button>
                                </div>
                            </div>

                            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-lg font-medium text-gray-900 mb-1">No reviews yet</p>
                                <p>Be the first to share your thoughts!</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* You Might Also Like */}
                <div className="mb-16">
                    <h2 className="text-4xl font-extrabold text-center uppercase mb-12">You might also like</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {relatedData?.contents.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>

            </div>
        </div >
    );
}
