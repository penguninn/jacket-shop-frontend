import { useState } from "react";
import { type Row } from "@tanstack/react-table";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { MoreHorizontal, Edit, Trash, Eye, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useDeleteCategory, useUpdateCategoryStatus } from "../hooks";
import { type UpdateCategoryStatusInput, type Category } from "../model/schemas";
import { CategoryEditForm } from "./CategoryEditForm";
import { useNavigate } from "react-router-dom";

interface Props {
  row: Row<Category>;
}

export function CategoryTableRowActions({ row }: Props) {
  const category = row.original;
  const updateCategoryStatusMutation = useUpdateCategoryStatus();
  const deleteCategoryMutation = useDeleteCategory();
  const navigate = useNavigate();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleToggleStatus = () => {
    const newStatus = category.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const payload: UpdateCategoryStatusInput = { status: newStatus };
    updateCategoryStatusMutation.mutate({ id: category.id, data: payload });
  };

  const handleDelete = () => {
    deleteCategoryMutation.mutate(category.id, {
      onSuccess: () => setShowDeleteDialog(false),
    });
  };

  return (
    <>
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Category"
        description={
          <span>
            Are you sure you want to delete category <strong>{category.name}</strong>? This action cannot be undone.
          </span>
        }
        onConfirm={handleDelete}
        confirmText="Delete"
        variant="destructive"
        isLoading={deleteCategoryMutation.isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(`/admin/categories/${category.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <CategoryEditForm category={category}>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </CategoryEditForm>
          <DropdownMenuItem onClick={handleToggleStatus}>
            {category.status === "ACTIVE" ? (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
