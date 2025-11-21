import { type Row } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import { X, Trash, CheckCircle, XCircle } from "lucide-react";
import type { Color } from "../../model/schemas";
import { useBulkDeleteColors, useBulkUpdateStatusColors } from "../../hooks";
import { Alert, AlertDescription } from "@/shared/ui/alert";

interface Props {
    selectedCount: number;
    selectedRows: Row<Color>[];
    onClearSelection: () => void;
}

export function BulkActionsBar({
    selectedCount,
    selectedRows,
    onClearSelection,
}: Props) {
    const bulkUpdateStatus = useBulkUpdateStatusColors();
    const bulkDelete = useBulkDeleteColors();

    const selectedIds = selectedRows.map((row) => row.original.id);

    const handleBulkActivate = () => {
        bulkUpdateStatus.mutate({ ids: selectedIds, status: "ACTIVE" });
        onClearSelection();
    };

    const handleBulkDeactivate = () => {
        bulkUpdateStatus.mutate({ ids: selectedIds, status: "INACTIVE" });
        onClearSelection();
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedCount} color(s)?`)) {
            bulkDelete.mutate(selectedIds);
            onClearSelection();
        }
    };

    return (
        <Alert>
            <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedCount} row(s) selected</span>
                    <Button variant="ghost" size="sm" onClick={onClearSelection}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleBulkActivate}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Activate
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleBulkDeactivate}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Deactivate
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );
}
