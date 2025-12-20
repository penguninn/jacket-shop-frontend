import { type Row } from "@tanstack/react-table";

import {
    MoreHorizontal,
    Edit,
    XCircle,
    CheckCircle,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useBulkUpdateStatusMaterials } from "../../hooks";
import { type Material } from "../../model/schemas";
import { MaterialEditForm } from "./MaterialEditForm";

interface Props {
    row: Row<Material>;
}

export function MaterialTableRowActions({ row }: Props) {
    const material = row.original;
    const bulkUpdateStatusMutation = useBulkUpdateStatusMaterials();

    const handleToggleStatus = () => {
        const newStatus = material.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        bulkUpdateStatusMutation.mutate({
            ids: [material.id],
            status: newStatus,
        });
    };



    return (
        <>

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
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
