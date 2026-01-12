import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MoreHorizontal, Pencil, XCircle, CheckCircle } from "lucide-react";

import { type SaleResponse } from "../model/schemas";
import { bulkUpdateSalesStatus } from "../api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SaleFormDialog } from "./SaleFormDialog";

interface SaleActionsProps {
    sale: SaleResponse;
}

export function SaleActions({ sale }: SaleActionsProps) {
    const queryClient = useQueryClient();
    const [showEditDialog, setShowEditDialog] = useState(false);

    const updateStatusMutation = useMutation({
        mutationFn: (status: "ACTIVE" | "INACTIVE") => bulkUpdateSalesStatus([sale.id], status),
        onSuccess: (_, status) => {
            toast.success(`Sale ${status === "ACTIVE" ? "activated" : "deactivated"} successfully`);
            queryClient.invalidateQueries({ queryKey: ["sales"] });
        },
        onError: () => {
            toast.error("Failed to update sale status");
        },
    });

    const isInactive = sale.status === "INACTIVE";

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>

                    {isInactive ? (
                        <DropdownMenuItem
                            onClick={() => updateStatusMutation.mutate("ACTIVE")}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onClick={() => updateStatusMutation.mutate("INACTIVE")}
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Deactivate
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {showEditDialog && (
                <SaleFormDialog
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog}
                    sale={sale}
                />
            )}
        </>
    );
}
