import { type Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { X, Trash, UserCheck, UserX } from "lucide-react";
import type { User } from "@/schema/user";
import { useBulkDelete, useBulkUpdateStatus } from "@/hooks/user";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Props {
  selectedCount: number;
  selectedRows: Row<User>[];
  onClearSelection: () => void;
}

export function BulkActionsBar({
  selectedCount,
  selectedRows,
  onClearSelection,
}: Props) {
  const bulkUpdateStatus = useBulkUpdateStatus();
  const bulkDelete = useBulkDelete();

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
    if (confirm(`Delete ${selectedCount} user(s)?`)) {
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
            <UserCheck className="mr-2 h-4 w-4" />
            Activate
          </Button>
          <Button variant="outline" size="sm" onClick={handleBulkDeactivate}>
            <UserX className="mr-2 h-4 w-4" />
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
