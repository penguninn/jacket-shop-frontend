import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  updateSizeSchema,
  type UpdateSizeInput,
  type Size,
} from "../../model/schemas";
import type { Problem } from "@/shared/api/error";
import { useUpdateSize } from "../../hooks";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
  if (err.errors) {
    for (const [field, msg] of Object.entries(err.errors)) {
      setError(field as any, { message: String(msg) });
    }
    return;
  }
  const msg = err.message || err.detail || "Failed to update size";
  setError("name", { message: msg });
}

interface Props {
  size: Size;
  children: React.ReactNode;
}

export function SizeEditForm({ size, children }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: doUpdate, isPending } = useUpdateSize();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateSizeInput>({
    resolver: zodResolver(updateSizeSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
    },
  });

  const currentStatus = watch("status");
  const busy = isSubmitting || isPending;

  useEffect(() => {
    if (open && size) {
      reset({
        name: size.name,
        description: size.description || "",
        status: size.status,
      });
    }
  }, [open, size, reset]);

  const onSubmit = (data: UpdateSizeInput) => {
    doUpdate(
      { id: size.id, data },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (e: any) => mapProblemToForm(e, setError),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Size: {size.name}</DialogTitle>
          <DialogDescription>
            Update size information and status.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter size name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter size description"
                {...register("description")}
                rows={3}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={currentStatus}
                onValueChange={(value) =>
                  setValue("status", value as any, { shouldDirty: true })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
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
        </ScrollArea>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={busy || !isDirty}
          >
            {busy ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
