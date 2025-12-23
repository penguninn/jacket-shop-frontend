import { type Table } from "@tanstack/react-table";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { X, Star } from "lucide-react";
import { DataTableFacetedFilter } from "@/shared/components/data-table/DataTableFacetedFilter";
import { DataTableViewOptions } from "@/shared/components/data-table/DataTableViewOptions";

const ratingOptions = [
    { label: "5 Stars", value: "5", icon: Star },
    { label: "4 Stars", value: "4", icon: Star },
    { label: "3 Stars", value: "3", icon: Star },
    { label: "2 Stars", value: "2", icon: Star },
    { label: "1 Star", value: "1", icon: Star },
];

interface Props<TData> {
    table: Table<TData>;
}

export function ReviewTableToolbar<TData>({ table }: Props<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search reviews or products..."
                    value={(table.getState().globalFilter as string) ?? ""}
                    onChange={(e) => table.setGlobalFilter(e.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {table.getColumn("rating") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("rating")}
                        title="Rating"
                        options={ratingOptions}
                    />
                )}

                {/* Placeholder for Product Filter if needed later */}

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
