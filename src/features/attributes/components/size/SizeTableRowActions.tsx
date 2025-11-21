import { type Row } from "@tanstack/react-table";
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
import { useDeleteSize, useUpdateSize } from "../../hooks";
import { type Size } from "../../model/schemas";
import { SizeEditForm } from "./SizeEditForm";

interface Props {
    row: Row<Size>;
}

export function SizeTableRowActions({ row }: Props) {
    const size = row.original;
    const updateSizeMutation = useUpdateSize();
    const deleteSizeMutation = useDeleteSize();

    const handleToggleStatus = () => {
        const newStatus = size.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        updateSizeMutation.mutate({
            id: size.id,
            data: {
                name: size.name,
                status: newStatus,
            },
        });
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete size "${size.name}"?`)) {
            deleteSizeMutation.mutate(size.id);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <SizeEditForm size={size}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                </SizeEditForm>
                <DropdownMenuItem onClick={handleToggleStatus}>
                    {size.status === "ACTIVE" ? (
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
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
