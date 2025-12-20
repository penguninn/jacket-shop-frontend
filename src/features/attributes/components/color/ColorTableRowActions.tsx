import { type Row } from "@tanstack/react-table";

import {
    MoreHorizontal,
    Edit,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useUpdateColor } from "../../hooks";
import { type Color } from "../../model/schemas";
import { ColorEditForm } from "./ColorEditForm";

interface Props {
    row: Row<Color>;
}

export function ColorTableRowActions({ row }: Props) {
    const color = row.original;
    const updateColorMutation = useUpdateColor();

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



    return (
        <>

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
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
