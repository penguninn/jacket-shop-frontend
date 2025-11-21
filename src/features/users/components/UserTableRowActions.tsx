import { useState } from "react";
import { type Row } from "@tanstack/react-table";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import {
  MoreHorizontal,
  Edit,
  Trash,
  UserX,
  UserCheck,
  Eye,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useDeleteUser, useUpdateUserStatus } from "@/features/users/hooks";
import { type UpdateUserStatusInput, type User } from "@/features/users/model/schemas";
import { UserEditForm } from "./UserEditForm";
import { useNavigate } from "react-router-dom";

interface Props {
  row: Row<User>;
}

export function UserTableRowActions({ row }: Props) {
  const user = row.original;
  const updateUserStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();
  const navigate = useNavigate();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleToggleStatus = () => {
    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const payload: UpdateUserStatusInput = {
      status: newStatus,
    };
    updateUserStatusMutation.mutate({
      id: user.id,
      data: payload,
    });
  };

  const handleDelete = () => {
    deleteUserMutation.mutate(user.id, {
      onSuccess: () => setShowDeleteDialog(false),
    });
  };

  return (
    <>
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete User"
        description={
          <span>
            Are you sure you want to delete user <strong>{user.username}</strong>? This action cannot be undone.
          </span>
        }
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteUserMutation.isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <UserEditForm user={user}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </UserEditForm>
          <DropdownMenuItem onClick={handleToggleStatus}>
            {user.status === "ACTIVE" ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
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
