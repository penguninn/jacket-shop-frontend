
import { useRef } from "react";
import type { Table } from "@tanstack/react-table";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { X, Upload, Loader2 } from "lucide-react";
import { DataTableFacetedFilter } from "@/shared/components/data-table/DataTableFacetedFilter";
import { DataTableViewOptions } from "@/shared/components/data-table/DataTableViewOptions";
import { useColors, useSizes, useMaterials } from "@/features/attributes/hooks";
import { useMemo } from "react";
import { useImportProductVariants } from "../hooks";
import { toast } from "sonner";

const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];

interface Props<TData> {
    table: Table<TData>;
}

export function ProductVariantTableToolbar<TData>({ table }: Props<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: importVariants, isPending: isImporting } = useImportProductVariants();

    // Fetch filter options data
    const { data: colorsData } = useColors({ page: 0, size: 100 });
    const { data: sizesData } = useSizes({ page: 0, size: 100 });
    const { data: materialsData } = useMaterials({ page: 0, size: 100 });

    // Convert to filter options format
    const colorOptions = useMemo(
        () =>
            colorsData?.contents.map((color) => ({
                label: color.name,
                value: color.id.toString(),
            })) ?? [],
        [colorsData]
    );

    const sizeOptions = useMemo(
        () =>
            sizesData?.contents.map((size) => ({
                label: size.name,
                value: size.id.toString(),
            })) ?? [],
        [sizesData]
    );

    const materialOptions = useMemo(
        () =>
            materialsData?.contents.map((material) => ({
                label: material.name,
                value: material.id.toString(),
            })) ?? [],
        [materialsData]
    );

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        importVariants(file, {
            onSuccess: (result) => {
                toast.success("Import Completed", {
                    description: `Success: ${result.successCount}, Errors: ${result.errorCount}`,
                });
                if (result.errorDetails.length > 0) {
                    console.warn("Import errors:", result.errorDetails);
                }
            },
        });

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2 flex-wrap">
                <Input
                    placeholder="Search SKU..."
                    value={(table.getColumn("sku")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("sku")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statusOptions}
                    />
                )}

                {table.getColumn("color") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("color")}
                        title="Color"
                        options={colorOptions}
                    />
                )}

                {table.getColumn("size") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("size")}
                        title="Size"
                        options={sizeOptions}
                    />
                )}

                {table.getColumn("material") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("material")}
                        title="Material"
                        options={materialOptions}
                    />
                )}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={handleImportClick}
                    disabled={isImporting}
                >
                    {isImporting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="mr-2 h-4 w-4" />
                    )}
                    Import Excel
                </Button>
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
