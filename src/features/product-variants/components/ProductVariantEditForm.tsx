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
import { ScrollArea } from "@/shared/ui/scroll-area";
import { updateProductVariantSchema, type UpdateProductVariantInput, type ProductVariant } from "../model/schemas";
import { useUpdateProductVariant } from "../hooks";
import { Dropzone, DropzoneEmptyState } from "@/shared/ui/dropzone";
import { useUpload } from "@/shared/hooks/use-upload";

const FORM_CONFIG = {
    LABELS: {
        COLOR: "Color *",
        SIZE: "Size *",
        MATERIAL: "Material *",
        PRICE: "Price *",
        COST_PRICE: "Cost Price *",
        QUANTITY: "Quantity",
        STATUS: "Status *",
        WEIGHT: "Weight (g)",
        LENGTH: "Length (cm)",
        WIDTH: "Width (cm)",
        HEIGHT: "Height (cm)",
        IMAGE: "Variant Image (Optional)",
    },
    PLACEHOLDERS: {

        SELECT_COLOR: "Select Color",
        SELECT_SIZE: "Select Size",
        SELECT_MATERIAL: "Select Material",
        SELECT_STATUS: "Select Status",
    },
    MESSAGES: {
        SAVE: "Save Changes",
        SAVING: "Saving...",
    },
} as const;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    variant: ProductVariant;
}

export function ProductVariantEditForm({ open, onOpenChange, variant }: Props) {
    const { upload, isUploading, progress } = useUpload();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UpdateProductVariantInput>({
        resolver: zodResolver(updateProductVariantSchema),
        defaultValues: {
            id: variant.id,
            status: variant.status,
            price: variant.price,
            costPrice: variant.costPrice,
            quantity: variant.quantity,
            image: variant.image ?? "",
        },
    });

    const { mutate: doUpdateVariant, isPending } = useUpdateProductVariant({ setError: setError as any });
    const busy = isSubmitting || isPending;

    // Watch for controlled components
    const status = watch("status");
    const image = watch("image");

    useEffect(() => {
        if (open && variant) {
            reset({
                id: variant.id,
                price: variant.price,
                costPrice: variant.costPrice,
                quantity: variant.quantity,
                status: variant.status,
                image: variant.image ?? "",
                weight: variant.weight ?? undefined,
                length: variant.length ?? undefined,
                width: variant.width ?? undefined,
                height: variant.height ?? undefined
            });
        }
    }, [open, variant, reset]);

    const onSubmit = (data: UpdateProductVariantInput) => {
        doUpdateVariant({ id: variant.id, data }, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Edit Variant</DialogTitle>
                    <DialogDescription>
                        Update variant details for {variant.sku || `ID: ${variant.id}`}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh]">
                    <form
                        id="edit-variant-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 pr-4"
                    >
                        {errors.root && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.root.message}</AlertDescription>
                            </Alert>
                        )}


                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>{FORM_CONFIG.LABELS.IMAGE}</Label>
                            <Dropzone
                                onDrop={(files) => {
                                    if (files.length > 0) {
                                        upload(files[0], {
                                            onSuccess: (data) => {
                                                setValue("image", data.url, { shouldDirty: true });
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
                                ) : image ? (
                                    <div className="flex flex-col items-center justify-center p-4">
                                        <div className="relative aspect-square w-32 overflow-hidden rounded-md border">
                                            <img src={image} alt="Thumbnail" className="h-full w-full object-cover" />
                                        </div>
                                        <p className="mt-2 text-xs text-muted-foreground">Click or drag to replace</p>
                                    </div>
                                ) : (
                                    <DropzoneEmptyState />
                                )}
                            </Dropzone>
                            <input type="hidden" {...register("image")} />
                        </div>




                        {/* Attributes Grid (Read-Only) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Color */}
                            <div className="space-y-2">
                                <Label>{FORM_CONFIG.LABELS.COLOR}</Label>
                                <div className="h-10 px-3 py-2 border rounded-md bg-muted text-sm flex items-center">
                                    {variant.color.name}
                                </div>
                            </div>

                            {/* Size */}
                            <div className="space-y-2">
                                <Label>{FORM_CONFIG.LABELS.SIZE}</Label>
                                <div className="h-10 px-3 py-2 border rounded-md bg-muted text-sm flex items-center">
                                    {variant.size.name}
                                </div>
                            </div>

                            {/* Material */}
                            <div className="space-y-2">
                                <Label>{FORM_CONFIG.LABELS.MATERIAL}</Label>
                                <div className="h-10 px-3 py-2 border rounded-md bg-muted text-sm flex items-center">
                                    {variant.material.name}
                                </div>
                            </div>
                        </div>

                        {/* Pricing Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">{FORM_CONFIG.LABELS.PRICE}</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    {...register("price", { valueAsNumber: true })}
                                />
                                {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="costPrice">{FORM_CONFIG.LABELS.COST_PRICE}</Label>
                                <Input
                                    id="costPrice"
                                    type="number"
                                    min="0"
                                    {...register("costPrice", { valueAsNumber: true })}
                                />
                                {errors.costPrice && <p className="text-xs text-red-500">{errors.costPrice.message}</p>}
                            </div>
                        </div>

                        {/* Inventory Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quantity">{FORM_CONFIG.LABELS.QUANTITY}</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="0"
                                    {...register("quantity", { valueAsNumber: true })}
                                />
                                {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">{FORM_CONFIG.LABELS.STATUS}</Label>
                                <Select
                                    value={status}
                                    onValueChange={(val) => setValue("status", val as "ACTIVE" | "INACTIVE", { shouldDirty: true })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={FORM_CONFIG.PLACEHOLDERS.SELECT_STATUS} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
                            </div>
                        </div>

                        {/* Physical Properties */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight">{FORM_CONFIG.LABELS.WEIGHT}</Label>
                                <Input id="weight" type="number" {...register("weight", { valueAsNumber: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="length">{FORM_CONFIG.LABELS.LENGTH}</Label>
                                <Input id="length" type="number" {...register("length", { valueAsNumber: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="width">{FORM_CONFIG.LABELS.WIDTH}</Label>
                                <Input id="width" type="number" {...register("width", { valueAsNumber: true })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="height">{FORM_CONFIG.LABELS.HEIGHT}</Label>
                                <Input id="height" type="number" {...register("height", { valueAsNumber: true })} />
                            </div>
                        </div>
                    </form>
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" form="edit-variant-form" disabled={busy || !isDirty}>
                        {busy ? FORM_CONFIG.MESSAGES.SAVING : FORM_CONFIG.MESSAGES.SAVE}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
