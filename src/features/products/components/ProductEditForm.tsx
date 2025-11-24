import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/shared/ui/textarea";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { updateProductSchema, type UpdateProductInput, type Product } from "../model/schemas";
import type { Problem } from "@/shared/api/error";
import { useUpdateProduct } from "../hooks";

// TODO: Replace with actual hooks
const useCategories = () => ({ data: [{ id: 1, name: "Jackets" }], isLoading: false });
const useBrands = () => ({ data: [{ id: 1, name: "Nike" }], isLoading: false });
const useMaterials = () => ({ data: [{ id: 1, name: "Leather" }], isLoading: false });
const useStyles = () => ({ data: [{ id: 1, name: "Bomber" }], isLoading: false });

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
    if (err.errors) {
        for (const [field, msg] of Object.entries(err.errors)) {
            setError(field as any, { message: String(msg) });
        }
        return;
    }
    const msg = err.message || err.detail || "Failed to update product";
    setError("name", { message: msg });
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product;
}

export function ProductEditForm({ open, onOpenChange, product }: Props) {
    const { mutate: doUpdateProduct, isPending } = useUpdateProduct();

    const { data: categories } = useCategories();
    const { data: brands } = useBrands();
    const { data: materials } = useMaterials();
    const { data: styles } = useStyles();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UpdateProductInput>({
        resolver: zodResolver(updateProductSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "DRAFT",
        },
    });

    const currentStatus = watch("status");
    const busy = isSubmitting || isPending;

    useEffect(() => {
        if (open && product) {
            reset({
                name: product.name,
                description: product.description || "",
                categoryId: product.category?.id,
                brandId: product.brand?.id,
                materialId: product.material?.id,
                styleId: product.style?.id,
                status: product.status,
            });
        }
    }, [open, product, reset]);

    const onSubmit = (data: UpdateProductInput) => {
        doUpdateProduct(
            { id: product.id, data },
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
                onError: (e: any) => mapProblemToForm(e, setError),
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Product: {product.name}</DialogTitle>
                    <DialogDescription>
                        Update product information.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                placeholder="Classic Leather Jacket"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Product description..."
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="categoryId">Category</Label>
                                <Select
                                    value={watch("categoryId")?.toString()}
                                    onValueChange={(value) => setValue("categoryId", Number(value), { shouldDirty: true })}
                                >
                                    <SelectTrigger id="categoryId">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Brand */}
                            <div className="space-y-2">
                                <Label htmlFor="brandId">Brand</Label>
                                <Select
                                    value={watch("brandId")?.toString()}
                                    onValueChange={(value) => setValue("brandId", Number(value), { shouldDirty: true })}
                                >
                                    <SelectTrigger id="brandId">
                                        <SelectValue placeholder="Select brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands?.map((b) => (
                                            <SelectItem key={b.id} value={String(b.id)}>
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Material */}
                            <div className="space-y-2">
                                <Label htmlFor="materialId">Material</Label>
                                <Select
                                    value={watch("materialId")?.toString()}
                                    onValueChange={(value) => setValue("materialId", Number(value), { shouldDirty: true })}
                                >
                                    <SelectTrigger id="materialId">
                                        <SelectValue placeholder="Select material" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {materials?.map((m) => (
                                            <SelectItem key={m.id} value={String(m.id)}>
                                                {m.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Style */}
                            <div className="space-y-2">
                                <Label htmlFor="styleId">Style</Label>
                                <Select
                                    value={watch("styleId")?.toString()}
                                    onValueChange={(value) => setValue("styleId", Number(value), { shouldDirty: true })}
                                >
                                    <SelectTrigger id="styleId">
                                        <SelectValue placeholder="Select style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {styles?.map((s) => (
                                            <SelectItem key={s.id} value={String(s.id)}>
                                                {s.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Status *</Label>
                            <Select
                                value={currentStatus}
                                onValueChange={(value) => setValue("status", value as any, { shouldDirty: true })}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
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
                        onClick={handleSubmit(onSubmit)}
                        disabled={busy || !isDirty}
                    >
                        {busy ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
