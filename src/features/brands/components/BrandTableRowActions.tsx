import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pen, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useUpdateBrandStatus } from "../hooks";
import { BrandEditForm } from "./BrandEditForm";
import type { Brand, UpdateBrandStatusInput } from "../model/schemas";


interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function BrandTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const brand = row.original as Brand;
    const updateStatus = useUpdateBrandStatus();

    const [showEditDialog, setShowEditDialog] = useState(false);

    const handleToggleStatus = () => {
        const newStatus = brand.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const payload: UpdateBrandStatusInput = {
            status: newStatus,
        };
        updateStatus.mutate({
            id: brand.id,
            data: payload,
        });
    };

    return (
        <>
            <BrandEditForm
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                brand={brand}
            />



            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleStatus}>
                        {brand.status === "ACTIVE" ? (
                            <>
                                <XCircle className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                Deactivate
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                Activate
                            </>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
