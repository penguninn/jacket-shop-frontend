import { useState } from "react";
import { type Row } from "@tanstack/react-table";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import {
    MoreHorizontal,
    Edit,
    Trash,
    XCircle,
    CheckCircle,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useDeleteMaterial, useBulkUpdateStatusMaterials } from "../../hooks";
import { type Material } from "../../model/schemas";
import { MaterialEditForm } from "./MaterialEditForm";

interface Props {
    row: Row<Material>;
}

export function MaterialTableRowActions({ row }: Props) {
    const material = row.original;
    const bulkUpdateStatusMutation = useBulkUpdateStatusMaterials();
    const deleteMaterialMutation = useDeleteMaterial();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleToggleStatus = () => {
        const newStatus = material.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        bulkUpdateStatusMutation.mutate({
            ids: [material.id],
            status: newStatus,
        });
    };

    const handleDelete = () => {
        deleteMaterialMutation.mutate(material.id, {
            onSuccess: () => setShowDeleteDialog(false),
        });
    };

    return (
        <>
            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Material"
                description={
                    <span>
                        Are you sure you want to delete material <strong>{material.name}</strong>? This action cannot be undone.
                    </span>
                }
                onConfirm={handleDelete}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteMaterialMutation.isPending}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <MaterialEditForm material={material}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </MaterialEditForm>
                    <DropdownMenuItem onClick={handleToggleStatus}>
                        {material.status === "ACTIVE" ? (
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
