import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { useUpdateCategory } from "../hooks";
import { updateCategorySchema, type UpdateCategoryInput, type Category, type CategoryStatus } from "../model/schemas";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";


interface Props {
  category: Category;
  children: React.ReactNode;
}

import { mapProblemToForm } from "@/shared/utils/form";
import { FormError } from "@/shared/ui/form-error";

import { DialogFooter, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";

export function CategoryEditForm({ category, children }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: doUpdate, isPending } = useUpdateCategory();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: { name: category.name, status: category.status },
  });

  const currentStatus = watch("status");
  const busy = isSubmitting || isPending;

  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name,
        status: category.status,
      });
    }
  }, [open, category, reset]);

  const onSubmit = (data: UpdateCategoryInput) => {
    doUpdate(
      { id: category.id, data },
      {
        onSuccess: () => setOpen(false),
        onError: (e: any) => mapProblemToForm(e, setError),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Category: {category.name}</DialogTitle>
          <DialogDescription>Update category information.</DialogDescription>
        </DialogHeader>

        <form
          id="edit-category-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormError errors={errors} />
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={currentStatus}
              onValueChange={(value) =>
                setValue("status", value as CategoryStatus, {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status.message}</p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-category-form"
            disabled={busy || !isDirty}
          >
            {busy ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
