import { type Table } from "@tanstack/react-table";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "@/shared/components/data-table/DataTableFacetedFilter";
import { DataTableViewOptions } from "@/shared/components/data-table/DataTableViewOptions";
import { useCategories, useBrands, useMaterials, useStyles } from "../hooks";
import { useMemo } from "react";

const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];

interface Props<TData> {
    table: Table<TData>;
}

export function ProductTableToolbar<TData>({ table }: Props<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    // Fetch filter options data
    const { data: categoriesData } = useCategories();
    const { data: brandsData } = useBrands();
    const { data: materialsData } = useMaterials();
    const { data: stylesData } = useStyles();

    // Convert to filter options format
    const categoryOptions = useMemo(
        () =>
            categoriesData?.contents.map((cat) => ({
                label: cat.name,
                value: cat.id.toString(),
            })) ?? [],
        [categoriesData]
    );

    const brandOptions = useMemo(
        () =>
            brandsData?.contents.map((brand) => ({
                label: brand.name,
                value: brand.id.toString(),
            })) ?? [],
        [brandsData]
    );

    const materialOptions = useMemo(
        () =>
            materialsData?.contents.map((material) => ({
                label: material.name,
                value: material.id.toString(),
            })) ?? [],
        [materialsData]
    );

    const styleOptions = useMemo(
        () =>
            stylesData?.contents.map((style) => ({
                label: style.name,
                value: style.id.toString(),
            })) ?? [],
        [stylesData]
    );

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2 flex-wrap">
                <Input
                    placeholder="Search product name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(e) =>
                        table.getColumn("name")?.setFilterValue(e.target.value)
                    }
                    className="h-8 w-[200px] lg:w-[250px]"
                />
                {table.getColumn("category") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("category")}
                        title="Category"
                        options={categoryOptions}
                    />
                )}
                {table.getColumn("brand") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("brand")}
                        title="Brand"
                        options={brandOptions}
                    />
                )}
                {table.getColumn("material") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("material")}
                        title="Material"
                        options={materialOptions}
                    />
                )}
                {table.getColumn("style") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("style")}
                        title="Style"
                        options={styleOptions}
                    />
                )}
                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statusOptions}
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
            <DataTableViewOptions table={table} />
        </div>
    );
}
