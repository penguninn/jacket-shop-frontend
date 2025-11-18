import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Problem } from "@/lib/api/error";
import { updateColorSchema, type Color, type UpdateColorInput } from "@/schema/attribute";
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
  onSuccess?: () => void;
}

export function ColorEditForm({ color, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: doUpdate, isPending } = useUpdateColor();

  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<UpdateColorInput>({
    resolver: zodResolver(updateColorSchema),
    defaultValues: {
      name: color.name,
      hexCode: color.hexCode,
      status: color.status,
    },
  });

  const busy = isSubmitting || isPending;

  const onSubmit = (data: UpdateColorInput) => {
    doUpdate({ id: color.id, data }, {
      onSuccess: () => {
        setOpen(false);
        reset(data);
        onSuccess?.();
      },
      onError: (e: any) => mapProblemToForm(e, setError),
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) reset();
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Color</DialogTitle>
          <DialogDescription>Update color details</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} autoFocus />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hexCode">Hex Code *</Label>
              <Input id="hexCode" {...register("hexCode")} placeholder="#FFFFFF" />
              {errors.hexCode && <p className="text-xs text-red-500">{errors.hexCode.message}</p>}
            </div>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={busy}>
            {busy ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
