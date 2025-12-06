import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { useUpdateCategory } from "../hooks";
import { updateCategorySchema, type UpdateCategoryInput, type Category, type CategoryStatus } from "../model/schemas";
import { Dialog, DialogContent, DialogTrigger } from "@/shared/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";


interface Props {
  category: Category;
  children: React.ReactNode;
}

import { mapProblemToForm } from "@/shared/utils/form";
import { FormError } from "@/shared/ui/form-error";

export function CategoryEditForm({ category, children }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: doUpdate, isPending } = useUpdateCategory();

  const { register, handleSubmit, setValue, setError, reset, formState: { errors, isSubmitting } } = useForm<UpdateCategoryInput>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: { name: category.name, status: category.status },
  });

  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name,
        status: category.status,
      });
    }
  }, [open, category, reset]);

  const onSubmit = (data: UpdateCategoryInput) => {
    doUpdate({ id: category.id, data }, {
      onSuccess: () => setOpen(false),
      onError: (e: any) => mapProblemToForm(e, setError),
    });
  };

  const busy = isSubmitting || isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormError errors={errors} />
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              defaultValue={category.status}
              onValueChange={(value) => setValue("status", value as CategoryStatus, { shouldDirty: true })}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={busy}>{busy ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
