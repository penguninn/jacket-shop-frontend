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
import { useCreateBrand } from "../hooks";
import { createBrandSchema, type BrandStatus, type CreateBrandInput } from "../model/schemas";

import { Textarea } from "@/shared/ui/textarea";
import { ScrollArea } from "@/shared/ui/scroll-area";

const FORM_CONFIG = {
  LABELS: {
    NAME: "Brand Name *",
    LOGO: "Logo URL",
    DESCRIPTION: "Description",
    STATUS: "Status *",
  },
  PLACEHOLDERS: {
    NAME: "Nike, Adidas, etc.",
    LOGO: "https://example.com/logo.png",
    DESCRIPTION: "Description",
    SELECT_STATUS: "Select status",
  },
  MESSAGES: {
    CREATE: "Create Brand",
    CREATING: "Creating...",
  },
} as const;


export function BrandCreateForm() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateBrandInput>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      name: "",
      logoUrl: "",
      description: "",
      status: "ACTIVE",
    },
  });

  const { mutate: doCreateBrand, isPending } = useCreateBrand({ setError: setError as any });

  const busy = isSubmitting || isPending;
  const currentStatus = watch("status");

  const onSubmit = (data: CreateBrandInput) => {
    doCreateBrand(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Brand
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Brand</DialogTitle>
          <DialogDescription>
            Add a new brand to the catalog. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <form
            id="create-brand-form"
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
                autoFocus
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <Label htmlFor="logoUrl">{FORM_CONFIG.LABELS.LOGO}</Label>
              <Input
                id="logoUrl"
                placeholder={FORM_CONFIG.PLACEHOLDERS.LOGO}
                {...register("logoUrl")}
              />
              {errors.logoUrl && (
                <p className="text-xs text-red-500">{errors.logoUrl.message}</p>
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
            onClick={() => setOpen(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-brand-form" disabled={busy}>
            {busy ? FORM_CONFIG.MESSAGES.CREATING : FORM_CONFIG.MESSAGES.CREATE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
