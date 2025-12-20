import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  updateBrandSchema,
  type UpdateBrandInput,
  type Brand,
  type BrandStatus,
} from "../model/schemas";
import { useUpdateBrand } from "../hooks";

import { Textarea } from "@/shared/ui/textarea";
import { ScrollArea } from "@/shared/ui/scroll-area";

const FORM_CONFIG = {
  LABELS: {
    NAME: "Brand Name *",
    DESCRIPTION: "Description",
    STATUS: "Status *",
  },
  PLACEHOLDERS: {
    NAME: "Nike, Adidas, etc.",
    DESCRIPTION: "Description",
    SELECT_STATUS: "Select status",
  },
  MESSAGES: {
    SAVE: "Save Changes",
    SAVING: "Saving...",
  },
} as const;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand;
}

export function BrandEditForm({ open, onOpenChange, brand }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateBrandInput>({
    resolver: zodResolver(updateBrandSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "ACTIVE",
    },
  });

  const { mutate: doUpdateBrand, isPending } = useUpdateBrand({ setError: setError as any });

  const currentStatus = watch("status");
  const busy = isSubmitting || isPending;

  useEffect(() => {
    if (open && brand) {
      reset({
        name: brand.name,
        description: brand.description || "",
        status: brand.status,
      });
    }
  }, [open, brand, reset]);

  const onSubmit = (data: UpdateBrandInput) => {
    doUpdateBrand(
      { id: brand.id, data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Brand: {brand.name}</DialogTitle>
          <DialogDescription>Update brand information.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form
            id="edit-brand-form"
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
              <Label htmlFor="name">{FORM_CONFIG.LABELS.NAME}</Label>
              <Input
                id="name"
                placeholder={FORM_CONFIG.PLACEHOLDERS.NAME}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{FORM_CONFIG.LABELS.DESCRIPTION}</Label>
              <Textarea
                id="description"
                placeholder={FORM_CONFIG.PLACEHOLDERS.DESCRIPTION}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">{FORM_CONFIG.LABELS.STATUS}</Label>
              <Select
                value={currentStatus}
                onValueChange={(value) =>
                  setValue("status", value as BrandStatus, { shouldDirty: true })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder={FORM_CONFIG.PLACEHOLDERS.SELECT_STATUS} />
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
            onClick={() => onOpenChange(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-brand-form"
            disabled={busy || !isDirty}
          >
            {busy ? FORM_CONFIG.MESSAGES.SAVING : FORM_CONFIG.MESSAGES.SAVE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
