import { useState } from "react";
import { type Row } from "@tanstack/react-table";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import {
    MoreHorizontal,
    Edit,
    Trash,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useDeleteColor, useUpdateColor } from "../../hooks";
import { type Color } from "../../model/schemas";
import { ColorEditForm } from "./ColorEditForm";

interface Props {
    row: Row<Color>;
}

export function ColorTableRowActions({ row }: Props) {
    const color = row.original;
    const updateColorMutation = useUpdateColor();
    const deleteColorMutation = useDeleteColor();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleToggleStatus = () => {
        const newStatus = color.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        updateColorMutation.mutate({
            id: color.id,
            data: {
                name: color.name,
                hexCode: color.hexCode || "#000000",
                status: newStatus,
            },
        });
    };

    const handleDelete = () => {
        deleteColorMutation.mutate(color.id, {
            onSuccess: () => setShowDeleteDialog(false),
        });
    };

    return (
        <>
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Color"
                description={
                    <span>
                        Are you sure you want to delete color <strong>{color.name}</strong>? This action cannot be undone.
                    </span>
                }
                onConfirm={handleDelete}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteColorMutation.isPending}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <ColorEditForm color={color}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </ColorEditForm>
                    <DropdownMenuItem onClick={handleToggleStatus}>
                        {color.status === "ACTIVE" ? (
                            <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
