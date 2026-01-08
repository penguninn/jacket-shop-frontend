import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Separator } from "@/shared/ui/separator";
import { Slider } from "@/shared/ui/slider";
import { Check, ChevronRight, SlidersHorizontal } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import { usePublicBrands } from "@/features/brands/hooks";
import { usePublicStyles } from "@/features/styles/hooks";
import { usePublicColors, usePublicSizes, usePublicMaterials } from "@/features/attributes/hooks";
import { Checkbox } from "@/shared/ui/checkbox";

interface ProductFiltersProps {
    priceRange: number[];
    setPriceRange: (range: number[]) => void;

    selectedBrandIds: number[];
    setSelectedBrandIds: (ids: number[]) => void;

    selectedStyleIds: number[];
    setSelectedStyleIds: (ids: number[]) => void;

    selectedColorIds: number[];
    setSelectedColorIds: (ids: number[]) => void;

    selectedSizeIds: number[];
    setSelectedSizeIds: (ids: number[]) => void;

    selectedMaterialIds: number[];
    setSelectedMaterialIds: (ids: number[]) => void;

    onApply: () => void;

    className?: string;
}

export function ProductFilters({
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
    onApply,
    className
}: ProductFiltersProps) {
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        brands: true,
        styles: true,
        price: true,
        colors: true,
        size: true,
        materials: true,
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Fetching Data
    const { data: brandsData } = usePublicBrands({ page: 0, size: 100, status: ["ACTIVE"] });
    const { data: stylesData } = usePublicStyles({ page: 0, size: 100, status: ["ACTIVE"] });
    const { data: colorsData } = usePublicColors({ page: 0, size: 100, status: ["ACTIVE"] });
    const { data: sizesData } = usePublicSizes({ page: 0, size: 100, status: ["ACTIVE"] });
    const { data: materialsData } = usePublicMaterials({ page: 0, size: 100, status: ["ACTIVE"] });

    const brands = brandsData?.contents || [];
    const styles = stylesData?.contents || [];
    const colors = colorsData?.contents || [];
    const sizes = sizesData?.contents || [];
    const materials = materialsData?.contents || [];

    // Handlers
    const toggleBrand = (id: number) => {
        if (selectedBrandIds.includes(id)) {
            setSelectedBrandIds(selectedBrandIds.filter(bId => bId !== id));
        } else {
            setSelectedBrandIds([...selectedBrandIds, id]);
        }
    };

    const toggleStyle = (id: number) => {
        if (selectedStyleIds.includes(id)) {
            setSelectedStyleIds(selectedStyleIds.filter(sId => sId !== id));
        } else {
            setSelectedStyleIds([...selectedStyleIds, id]);
        }
    };

    const toggleMaterial = (id: number) => {
        if (selectedMaterialIds.includes(id)) {
            setSelectedMaterialIds(selectedMaterialIds.filter(mId => mId !== id));
        } else {
            setSelectedMaterialIds([...selectedMaterialIds, id]);
        }
    };

    const toggleColor = (id: number) => {
        if (selectedColorIds.includes(id)) {
            setSelectedColorIds(selectedColorIds.filter(cId => cId !== id));
        } else {
            setSelectedColorIds([...selectedColorIds, id]);
        }
    };

    const toggleSize = (id: number) => {
        if (selectedSizeIds.includes(id)) {
            setSelectedSizeIds(selectedSizeIds.filter(sId => sId !== id));
        } else {
            setSelectedSizeIds([...selectedSizeIds, id]);
        }
    };

    return (
        <div className={cn("space-y-1 select-none", className)}>
            <div className="flex items-center justify-between px-1 mb-4">
                <h3 className="text-xl font-bold">Filters</h3>
                <SlidersHorizontal className="w-5 h-5 text-gray-400" />
            </div>

            <Separator className="mb-4" />

            {/* Brands */}
            <FilterSection
                title="Brands"
                isOpen={openSections.brands}
                onToggle={() => toggleSection('brands')}
            >
                {brands.length === 0 && <p className="text-sm text-gray-400">No brands available</p>}
                <div className="space-y-3">
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={`brand-${brand.id}`}
                                checked={selectedBrandIds.includes(brand.id)}
                                onCheckedChange={() => toggleBrand(brand.id)}
                            />
                            <label
                                htmlFor={`brand-${brand.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {brand.name}
                            </label>
                        </div>
                    ))}
                </div>
            </FilterSection>

            <Separator className="my-4" />

            {/* Dress Style (Reordered below Brands) */}
            <FilterSection
                title="Dress Style"
                isOpen={openSections.styles}
                onToggle={() => toggleSection('styles')}
            >
                {styles.length === 0 && <p className="text-sm text-gray-400">No styles available</p>}
                <div className="space-y-3">
                    {styles.map((style) => (
                        <div
                            key={style.id}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={`style-${style.id}`}
                                checked={selectedStyleIds.includes(style.id)}
                                onCheckedChange={() => toggleStyle(style.id)}
                            />
                            <label
                                htmlFor={`style-${style.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {style.name}
                            </label>
                        </div>
                    ))}
                </div>
            </FilterSection>

            <Separator className="my-4" />

            {/* Materials (New Section) */}
            <FilterSection
                title="Materials"
                isOpen={openSections.materials}
                onToggle={() => toggleSection('materials')}
            >
                {materials.length === 0 && <p className="text-sm text-gray-400">No materials available</p>}
                <div className="space-y-3">
                    {materials.map((material) => (
                        <div
                            key={material.id}
                            className="flex items-center space-x-2"
                        >
                            <Checkbox
                                id={`material-${material.id}`}
                                checked={selectedMaterialIds.includes(material.id)}
                                onCheckedChange={() => toggleMaterial(material.id)}
                            />
                            <label
                                htmlFor={`material-${material.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {material.name}
                            </label>
                        </div>
                    ))}
                </div>
            </FilterSection>

            <Separator className="my-4" />

            {/* Price */}
            <FilterSection
                title="Price (VNĐ)"
                isOpen={openSections.price}
                onToggle={() => toggleSection('price')}
            >
                <div className="px-1 pt-2">
                    <Slider
                        defaultValue={[0, 5000000]}
                        value={priceRange}
                        max={5000000}
                        step={10000}
                        minStepsBetweenThumbs={1}
                        onValueChange={(value) => setPriceRange(value)}
                        className="my-6"
                    />
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Input
                                type="number"
                                className="pl-6 h-9 text-sm font-medium rounded-lg border-gray-200 focus-visible:ring-black"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            />
                        </div>
                        <div className="relative flex-1">
                            <Input
                                type="number"
                                className="pl-6 h-9 text-sm font-medium rounded-lg border-gray-200 focus-visible:ring-black"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            />
                        </div>
                    </div>
                </div>
            </FilterSection>

            <Separator className="my-4" />

            {/* Colors */}
            <FilterSection
                title="Colors"
                isOpen={openSections.colors}
                onToggle={() => toggleSection('colors')}
            >
                {colors.length === 0 && <p className="text-sm text-gray-400">No colors available</p>}
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => {
                        const isWhite = color.name.toLowerCase() === "white" || (color.hexCode || "").toLowerCase() === "#ffffff";
                        const isSelected = selectedColorIds.includes(color.id);

                        return (
                            <button
                                key={color.id}
                                onClick={() => toggleColor(color.id)}
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all border shadow-sm hover:scale-110",
                                    isSelected ? "ring-2 ring-primary ring-offset-2 border-transparent" : "border-gray-200 hover:border-primary",
                                    isWhite && !isSelected && "bg-white"
                                )}
                                style={{ backgroundColor: color.hexCode || "#FFFFFF" }}
                                title={color.name}
                            >
                                {isSelected && (
                                    <Check className={cn("w-3 h-3", isWhite ? "text-black" : "text-white")} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </FilterSection>

            <Separator className="my-4" />

            {/* Size */}
            <FilterSection
                title="Size"
                isOpen={openSections.size}
                onToggle={() => toggleSection('size')}
            >
                {sizes.length === 0 && <p className="text-sm text-gray-400">No sizes available</p>}
                <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => {
                        const isSelected = selectedSizeIds.includes(s.id);
                        return (
                            <button
                                key={s.id}
                                onClick={() => toggleSize(s.id)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-xs font-medium transition-all border",
                                    isSelected
                                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                                )}
                            >
                                {s.name}
                            </button>
                        );
                    })}
                </div>
            </FilterSection>

            <Button
                className="w-full mt-8"
                onClick={onApply}
            >
                Apply Filter
            </Button>
        </div>
    );
}

function FilterSection({
    title,
    isOpen,
    onToggle,
    children
}: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-3">
            <div
                className="flex items-center justify-between cursor-pointer group py-1"
                onClick={onToggle}
            >
                <h3 className="font-bold text-base">{title}</h3>
                <ChevronRight
                    className={cn(
                        "w-4 h-4 text-gray-400 group-hover:text-black transition-transform duration-200",
                        isOpen ? "-rotate-90" : "rotate-90"
                    )}
                />
            </div>
            {isOpen && (
                <div className="animate-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}
