import { type Table } from "@tanstack/react-table";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { X, Plus } from "lucide-react";
import { DataTableViewOptions } from "@/shared/components/data-table/DataTableViewOptions";
import { useState } from "react";
import { SaleFormDialog } from "./SaleFormDialog";
import { type SaleResponse } from "../model/schemas";

interface Props {
    table: Table<SaleResponse>;
}

export function SaleTableToolbar({ table }: Props) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search by product name..."
                    value={(table.getColumn("productName")?.getFilterValue() as string) ?? ""}
                    onChange={(e) =>
                        table.getColumn("productName")?.setFilterValue(e.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
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
                <Button
                    className="h-8 ml-2"
                    onClick={() => setShowCreateDialog(true)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Apply Sale
                </Button>
                <DataTableViewOptions table={table} />
            </div>

            <SaleFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
        </div>
    );
}
