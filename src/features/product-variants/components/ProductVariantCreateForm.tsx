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
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Dropzone, DropzoneEmptyState } from "@/shared/ui/dropzone";
import { useUpload } from "@/shared/hooks/use-upload";
import { createProductVariantSchema, type CreateProductVariantInput } from "../model/schemas";
import { useCreateProductVariant } from "../hooks";
import { useColors, useMaterials, useSizes } from "@/features/attributes/hooks";


const FORM_CONFIG = {
    LABELS: {

        COLOR: "Color *",
        SIZE: "Size *",
        MATERIAL: "Material *",
        PRICE: "Price *",
        COST_PRICE: "Cost Price *",
        QUANTITY: "Initial Quantity",
        STATUS: "Status",
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
        CREATE: "Create Variant",
        CREATING: "Creating...",
    },
} as const;


interface Props {
    productId: number;
}

export function ProductVariantCreateForm({ productId }: Props) {
    const [open, setOpen] = useState(false);

    // Fetch attributes for selection
    const { data: colorsResponse } = useColors({ page: 0, size: 100 });
    const { data: sizesResponse } = useSizes({ page: 0, size: 100 });
    const { data: materialsResponse } = useMaterials({ page: 0, size: 100 });

    const colors = colorsResponse?.contents ?? [];
    const sizes = sizesResponse?.contents ?? [];
    const materials = materialsResponse?.contents ?? [];

    const { upload, isUploading, progress } = useUpload();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateProductVariantInput>({
        resolver: zodResolver(createProductVariantSchema) as any,
        defaultValues: {
            productId,
            status: "ACTIVE",
            quantity: 0,
            price: 0,
            costPrice: 0,
            image: "",

            colorId: undefined as unknown as number,
            sizeId: undefined as unknown as number,
            materialId: undefined as unknown as number,
        },
    });

    const { mutate: doCreateVariant, isPending } = useCreateProductVariant({ setError: setError as any });
    const busy = isSubmitting || isPending;

    // Watch for controlled components
    const status = watch("status");
    const colorId = watch("colorId");
    const sizeId = watch("sizeId");
    const materialId = watch("materialId");
    const image = watch("image");

    const onSubmit = (data: CreateProductVariantInput) => {
        doCreateVariant(data, {
            onSuccess: () => {
                setOpen(false);
                reset({
                    productId,
                    status: "ACTIVE",
                    quantity: 0,
                    price: 0,
                    costPrice: 0,
                    image: "",

                    colorId: undefined as unknown as number,
                    sizeId: undefined as unknown as number,
                    materialId: undefined as unknown as number,
                });
            },
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            reset({
                productId,
                status: "ACTIVE",
                quantity: 0,
                price: 0,
                costPrice: 0,
                image: "",
            });
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variant
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Add New Variant</DialogTitle>
                    <DialogDescription>
                        Create a new variant for this product.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh]">
                    <form
                        id="create-variant-form"
                        onSubmit={handleSubmit(onSubmit as any)}
                        className="space-y-4 pr-4"
                    >
                        {errors.root && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.root.message}</AlertDescription>
                            </Alert>
                        )}
                        <input type="hidden" {...register("productId")} value={productId} />

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



                        {/* Attributes Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Color */}
                            <div className="space-y-2">
                                <Label htmlFor="colorId">{FORM_CONFIG.LABELS.COLOR}</Label>
                                <Select
                                    value={colorId ? String(colorId) : undefined}
                                    onValueChange={(val) => setValue("colorId", Number(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={FORM_CONFIG.PLACEHOLDERS.SELECT_COLOR} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colors.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.colorId && <p className="text-xs text-red-500">{errors.colorId.message}</p>}
                            </div>

                            {/* Size */}
                            <div className="space-y-2">
                                <Label htmlFor="sizeId">{FORM_CONFIG.LABELS.SIZE}</Label>
                                <Select
                                    value={sizeId ? String(sizeId) : undefined}
                                    onValueChange={(val) => setValue("sizeId", Number(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={FORM_CONFIG.PLACEHOLDERS.SELECT_SIZE} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sizes.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.sizeId && <p className="text-xs text-red-500">{errors.sizeId.message}</p>}
                            </div>

                            {/* Material */}
                            <div className="space-y-2">
                                <Label htmlFor="materialId">{FORM_CONFIG.LABELS.MATERIAL}</Label>
                                <Select
                                    value={materialId ? String(materialId) : undefined}
                                    onValueChange={(val) => setValue("materialId", Number(val))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={FORM_CONFIG.PLACEHOLDERS.SELECT_MATERIAL} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {materials.map((m) => (
                                            <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.materialId && <p className="text-xs text-red-500">{errors.materialId.message}</p>}
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
                                    onValueChange={(val) => setValue("status", val as "ACTIVE" | "INACTIVE")}
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

                        {/* Physical Properties (Optional) */}
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
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={busy} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" form="create-variant-form" disabled={busy}>
                        {busy ? FORM_CONFIG.MESSAGES.CREATING : FORM_CONFIG.MESSAGES.CREATE}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
