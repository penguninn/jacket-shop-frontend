import { Button } from "@/shared/ui/button";
import { X, CheckCircle, XCircle, Ban } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/ui/alert";

interface DataTableBulkActionsProps {
    selectedCount: number;
    onClearSelection: () => void;
    onActivate: () => void;
    onDeactivate: () => void;
    isLoading?: boolean;
    activateLabel?: string;
    deactivateLabel?: string;
}

export function DataTableBulkActions({
    selectedCount,
    onClearSelection,
    onActivate,
    onDeactivate,
    isLoading = false,
    activateLabel = "Activate",
    deactivateLabel = "Deactivate",
}: DataTableBulkActionsProps) {
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onActivate}
                        disabled={isLoading}
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {activateLabel}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onDeactivate}
                        disabled={isLoading}
                    >
                        {deactivateLabel === "Deactivate" ? (
                            <Ban className="mr-2 h-4 w-4" />
                        ) : (
                            <XCircle className="mr-2 h-4 w-4" />
                        )}
                        {deactivateLabel}
                    </Button>
                </div>
            </AlertDescription>
        </Alert>
    );
}
