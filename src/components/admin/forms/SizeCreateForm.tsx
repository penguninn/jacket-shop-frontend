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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Problem } from "@/lib/api/error";
import { useCreateSize } from "@/hooks/attribute";
import { createSizeSchema, type CreateSizeInput } from "@/schema/attribute";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
  if (err.errors) {
    for (const [field, msg] of Object.entries(err.errors)) setError(field as any, { message: String(msg) });
    return;
  }
  const msg = err.message || err.detail || "Failed to create size";
  setError("name", { message: msg });
}

export function SizeCreateForm() {
  const [open, setOpen] = useState(false);
  const { mutate: doCreate, isPending } = useCreateSize();

  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm<CreateSizeInput>({
    resolver: zodResolver(createSizeSchema),
    defaultValues: { name: "", status: "ACTIVE" },
  });

  const busy = isSubmitting || isPending;

  const onSubmit = (data: CreateSizeInput) => {
    doCreate(data, {
      onSuccess: () => { setOpen(false); reset(); },
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
          <Plus className="mr-2 h-4 w-4" /> New Size
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Size</DialogTitle>
          <DialogDescription>Add a new size</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" placeholder="Size name" {...register("name")} autoFocus />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={busy}>{busy ? "Creating..." : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
