import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { AlertCircle, Plus } from "lucide-react";
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
import { useCreateColor } from "../../hooks";
import { createColorSchema, type ColorStatus, type CreateColorInput } from "../../model/schemas";


export function ColorCreateForm() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,

    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateColorInput>({
    resolver: zodResolver(createColorSchema),
    defaultValues: {
      name: "",
      hexCode: "",
      description: "",
      status: "ACTIVE",
    },
  });

  const { mutate: doCreate, isPending } = useCreateColor({ setError: setError as any });

  const busy = isSubmitting || isPending;
  const currentStatus = watch("status");

  const onSubmit = (data: CreateColorInput) => {
    doCreate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
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
          <DialogTitle>Create New Color</DialogTitle>
          <DialogDescription>
            Add a new color to the system. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form
            id="create-color-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 pr-4"
          >
            {errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter color name"
                {...register("name")}
                autoFocus
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Hex Code */}
            <div className="space-y-2">
              <Label htmlFor="hexCode">Hex Code *</Label>
              <div className="flex gap-2">
                <div className="relative w-10 h-10 rounded border overflow-hidden shrink-0">
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: watch("hexCode") || "#ffffff" }}
                  />
                  <Input
                    type="color"
                    className="absolute inset-0 opacity-0 cursor-pointer p-0 border-none h-full w-full"
                    value={watch("hexCode") || "#ffffff"}
                    onChange={(e) => {
                      setValue("hexCode", e.target.value, { shouldValidate: true, shouldDirty: true });
                    }}
                  />
                </div>
                <Input
                  id="hexCode"
                  placeholder="#000000"
                  value={watch("hexCode") || ""}
                  className="flex-1 font-mono uppercase"
                  maxLength={7}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (value && !value.startsWith("#")) {
                      value = "#" + value;
                    }
                    setValue("hexCode", value, { shouldValidate: true, shouldDirty: true });
                  }}
                />
              </div>
              {errors.hexCode && (
                <p className="text-xs text-red-500">{errors.hexCode.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter color description"
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
                  setValue("status", value as ColorStatus, { shouldDirty: true })
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
          <Button type="submit" form="create-color-form" disabled={busy}>
            {busy ? "Creating..." : "Create Color"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
