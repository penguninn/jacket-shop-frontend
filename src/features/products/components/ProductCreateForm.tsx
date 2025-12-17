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
import { Dropzone, DropzoneEmptyState } from "@/shared/ui/dropzone";
import { Checkbox } from "@/shared/ui/checkbox";
import { useUpload } from "@/shared/hooks/use-upload";

import { useCreateProduct, useBrands, useStyles } from "../hooks";
import { createProductSchema, type CreateProductInput } from "../model/schemas";


// ============================================
// CONSTANTS
// ============================================
const FORM_CONFIG = {
    LABELS: {
        NAME: "Product Name *",
        DESCRIPTION: "Description",
        BRAND: "Brand",
        STYLE: "Style",
        STATUS: "Status *",
    },
    PLACEHOLDERS: {
        NAME: "Classic Leather Jacket",
        DESCRIPTION: "Product description...",
        SELECT_BRAND: "Select brand",
        SELECT_STYLE: "Select style",
        SELECT_STATUS: "Select status",
    },
    MESSAGES: {
        CREATE: "Create Product",
        CREATING: "Creating...",
        UPLOAD_SUCCESS: "Thumbnail uploaded successfully",
    },
} as const;

export function ProductCreateForm() {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreateProductInput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "ACTIVE",
            thumbnail: "",
            isFeatured: false,
            // Initialize required number fields as undefined to force user selection
            // Explicit cast needed because TS expects number
            brandId: undefined as unknown as number,
            styleId: undefined as unknown as number,
        },
    });

    const { upload, isUploading, progress } = useUpload();
    const thumbnail = watch("thumbnail");

    const { mutate: doCreateProduct, isPending } = useCreateProduct({ setError: setError as any });

    // Fetch helper entities for dropdowns
    const { data: brandsResponse } = useBrands();
    const { data: stylesResponse } = useStyles();

    // Extract contents from paginated responses
    const brands = brandsResponse?.contents ?? [];
    const styles = stylesResponse?.contents ?? [];

    const brandId = watch("brandId");
    const styleId = watch("styleId");
    const currentStatus = watch("status");
    const busy = isSubmitting || isPending;

    const onSubmit = (data: CreateProductInput) => {
        doCreateProduct(data, {
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
                    New Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Product</DialogTitle>
                    <DialogDescription>
                        Add a new product to the catalog. Fill in all required fields.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh]">
                    <form
                        id="create-product-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 pr-4"
                    >
                        {errors.root && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.root.message}</AlertDescription>
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
                                <p className="text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
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

                        {/* Thumbnail Upload */}
                        <div className="space-y-2">
                            <Label>Product Thumbnail</Label>
                            <Dropzone
                                onDrop={(files) => {
                                    if (files.length > 0) {
                                        upload(files[0], {
                                            onSuccess: (data) => {
                                                setValue("thumbnail", data.url, { shouldDirty: true });
                                            }
                                        });
                                    }
                                }}
                                accept={{ "image/*": [] }}
                                maxSize={5 * 1024 * 1024}
                                className={isUploading ? "pointer-events-none opacity-50" : ""}
                            >
                                {isUploading ? (
                                    <div className="flex flex-col items-center justify-center p-8 text-sm text-muted-foreground">
                                        <p>Uploading... {progress}%</p>
                                    </div>
                                ) : thumbnail ? (
                                    <div className="flex flex-col items-center justify-center p-4">
                                        <div className="relative aspect-square w-32 overflow-hidden rounded-md border">
                                            <img src={thumbnail} alt="Thumbnail" className="h-full w-full object-cover" />
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">Click or drag to replace</p>
                                    </div>
                                ) : (
                                    <DropzoneEmptyState />
                                )}
                            </Dropzone>
                            <input type="hidden" {...register("thumbnail")} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            {/* Brand */}
                            <div className="space-y-2">
                                <Label htmlFor="brandId">Brand</Label>
                                <Select
                                    value={brandId ? String(brandId) : undefined}
                                    onValueChange={(value) =>
                                        setValue("brandId", Number(value))
                                    }
                                >
                                    <SelectTrigger id="brandId">
                                        <SelectValue placeholder="Select brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands?.map((b) => (
                                            <SelectItem
                                                key={b.id}
                                                value={String(b.id)}
                                            >
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Style */}
                            <div className="space-y-2">
                                <Label htmlFor="styleId">Style</Label>
                                <Select
                                    value={styleId ? String(styleId) : undefined}
                                    onValueChange={(value) =>
                                        setValue("styleId", Number(value))
                                    }
                                >
                                    <SelectTrigger id="styleId">
                                        <SelectValue placeholder="Select style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {styles?.map((s) => (
                                            <SelectItem
                                                key={s.id}
                                                value={String(s.id)}
                                            >
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">{FORM_CONFIG.LABELS.STATUS}</Label>
                            <Select
                                value={currentStatus}
                                onValueChange={(value) =>
                                    setValue("status", value as any)
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
                                <p className="text-xs text-red-500">
                                    {errors.status.message}
                                </p>
                            )}
                        </div>

                        {/* Featured */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isFeatured"
                                onCheckedChange={(checked) =>
                                    setValue("isFeatured", checked as boolean)
                                }
                            />
                            <Label
                                htmlFor="isFeatured"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Featured Product
                            </Label>
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
                        type="submit"
                        form="create-product-form"
                        disabled={busy}
                    >
                        {busy ? FORM_CONFIG.MESSAGES.CREATING : FORM_CONFIG.MESSAGES.CREATE}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
