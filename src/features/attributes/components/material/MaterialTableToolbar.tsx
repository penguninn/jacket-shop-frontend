import { useRef } from "react";
import { type Table } from "@tanstack/react-table";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { X, Upload, Loader2 } from "lucide-react";
import { DataTableFacetedFilter } from "@/shared/components/data-table/DataTableFacetedFilter";
import { DataTableViewOptions } from "@/shared/components/data-table/DataTableViewOptions";
import { useImportMaterials } from "../../hooks";
import { toast } from "sonner";

const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];

interface Props<TData> {
    table: Table<TData>;
}

export function MaterialTableToolbar<TData>({ table }: Props<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: importMaterials, isPending: isImporting } = useImportMaterials();

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        importMaterials(file, {
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
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(e) =>
                        table.getColumn("name")?.setFilterValue(e.target.value)
                    }
                    className="h-8 w-[200px] lg:w-[250px]"
                />
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
