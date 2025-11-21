import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
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
import { ScrollArea } from "@/shared/ui/scroll-area";
import type { Problem } from "@/shared/api/error";
import { useCreateColor } from "../../hooks";
import { createColorSchema, type CreateColorInput } from "../../model/schemas";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
  if (err.errors) {
    for (const [field, msg] of Object.entries(err.errors)) {
      setError(field as any, { message: String(msg) });
    }
    return;
  }
  const msg = err.message || err.detail || "Failed to create color";
  setError("name", { message: msg });
}

export function ColorCreateForm() {
  const [open, setOpen] = useState(false);
  const { mutate: doCreate, isPending } = useCreateColor();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateColorInput>({
    resolver: zodResolver(createColorSchema),
    defaultValues: { name: "", hexCode: "#000000", status: "ACTIVE" },
  });

  const busy = isSubmitting || isPending;

  const onSubmit = (data: CreateColorInput) => {
    doCreate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Color
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Color</DialogTitle>
          <DialogDescription>Add a new color</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" placeholder="Color name" {...register("name")} autoFocus />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hexCode">Hex Code *</Label>
              <Input id="hexCode" type="color" {...register("hexCode")} />
              {errors.hexCode && <p className="text-xs text-red-500">{errors.hexCode.message}</p>}
            </div>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={busy}>
            {busy ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
