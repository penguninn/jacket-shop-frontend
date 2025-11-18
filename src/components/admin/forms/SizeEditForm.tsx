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
import { useUpdateSize } from "@/hooks/attribute";
import { updateSizeSchema, type Size, type UpdateSizeInput } from "@/schema/attribute";

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
  onSuccess?: () => void;
}

export function SizeEditForm({ size, onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: doUpdate, isPending } = useUpdateSize();

  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<UpdateSizeInput>({
    resolver: zodResolver(updateSizeSchema),
    defaultValues: {
      name: size.name,
      status: size.status,
    },
  });

  const busy = isSubmitting || isPending;

  const onSubmit = (data: UpdateSizeInput) => {
    doUpdate({ id: size.id, data }, {
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
          <DialogTitle>Edit Size</DialogTitle>
          <DialogDescription>Update size details</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} autoFocus />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
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
