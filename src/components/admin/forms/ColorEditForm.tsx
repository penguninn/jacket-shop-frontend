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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateColorSchema, type UpdateColorInput, type Color } from "@/schema/attribute";
import type { Problem } from "@/lib/api/error";
import { useUpdateColor } from "@/hooks/attribute";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
  if (err.errors) {
    for (const [field, msg] of Object.entries(err.errors)) {
      setError(field as any, { message: String(msg) });
    }
    return;
  }
  const msg = err.message || err.detail || "Failed to update color";
  setError("name", { message: msg });
}

interface Props {
  color: Color;
  children: React.ReactNode;
}

export function ColorEditForm({ color, children }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: doUpdate, isPending } = useUpdateColor();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateColorInput>({
    resolver: zodResolver(updateColorSchema),
    defaultValues: {
      name: "",
      hexCode: "#000000",
      status: "ACTIVE",
    },
  });

  const currentStatus = watch("status");
  const busy = isSubmitting || isPending;

  useEffect(() => {
    if (open && color) {
      reset({
        name: color.name,
        hexCode: color.hexCode,
        status: color.status,
      });
    }
  }, [open, color, reset]);

  const onSubmit = (data: UpdateColorInput) => {
    doUpdate(
      { id: color.id, data },
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
          <DialogTitle>Edit Color: {color.name}</DialogTitle>
          <DialogDescription>Update color details.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hexCode">Hex Code *</Label>
              <Input id="hexCode" type="color" {...register("hexCode")} />
              {errors.hexCode && <p className="text-xs text-red-500">{errors.hexCode.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={currentStatus}
                onValueChange={(value) => setValue("status", value as any, { shouldDirty: true })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={busy || !isDirty}>
            {busy ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
