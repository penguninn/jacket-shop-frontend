import { useState } from "react";
import type { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pen, Trash, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useDeleteStyle, useUpdateStyleStatus } from "../hooks";
import { StyleEditForm } from "./StyleEditForm";
import type { Style, UpdateStyleStatusInput } from "../model/schemas";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function StyleTableRowActions<TData>({
    row,
}: DataTableRowActionsProps<TData>) {
    const style = row.original as Style;
    const deleteStyle = useDeleteStyle();
    const updateStatus = useUpdateStyleStatus();

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        deleteStyle.mutate(style.id, {
            onSuccess: () => setShowDeleteDialog(false),
        });
    };

    const handleToggleStatus = () => {
        const newStatus = style.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const payload: UpdateStyleStatusInput = {
            status: newStatus,
        };
        updateStatus.mutate({
            id: style.id,
            data: payload,
        });
    };

    return (
        <>
            <StyleEditForm
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                style={style}
            />

            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Style"
                description={
                    <span>
                        Are you sure you want to delete style <strong>{style.name}</strong>? This action cannot be undone.
                    </span>
                }
                onConfirm={handleDelete}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteStyle.isPending}
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
                        {style.status === "ACTIVE" ? (
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
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash className="mr-2 h-3.5 w-3.5" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
