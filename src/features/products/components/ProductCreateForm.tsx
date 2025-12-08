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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { ScrollArea } from "@/shared/ui/scroll-area";

import { useCreateProduct, useCategories, useBrands, useMaterials, useStyles } from "../hooks";
import { createProductSchema, type CreateProductInput } from "../model/schemas";

import { mapProblemToForm } from "@/shared/utils/form";
import { FormError } from "@/shared/ui/form-error";

export function ProductCreateForm() {
    const [open, setOpen] = useState(false);

    const { mutate: doCreateProduct, isPending } = useCreateProduct();

    // Fetch helper entities for dropdowns
    const { data: categoriesResponse } = useCategories();
    const { data: brandsResponse } = useBrands();
    const { data: materialsResponse } = useMaterials();
    const { data: stylesResponse } = useStyles();

    // Extract contents from paginated responses
    const categories = categoriesResponse?.contents ?? [];
    const brands = brandsResponse?.contents ?? [];
    const materials = materialsResponse?.contents ?? [];
    const styles = stylesResponse?.contents ?? [];

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateProductInput>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "ACTIVE",
        },
    });

    const categoryId = watch("categoryId");
    const brandId = watch("brandId");
    const materialId = watch("materialId");
    const styleId = watch("styleId");
    const currentStatus = watch("status");
    const busy = isSubmitting || isPending;

    const onSubmit = (data: CreateProductInput) => {
        doCreateProduct(data, {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
            onError: (e: any) => mapProblemToForm(e, setError),
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
                        <FormError errors={errors} />
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                placeholder="Classic Leather Jacket"
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
                                    value={categoryId ? String(categoryId) : undefined}
                                    onValueChange={(value) =>
                                        setValue("categoryId", Number(value))
                                    }
                                >
                                    <SelectTrigger id="categoryId">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={String(c.id)}
                                            >
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

                            {/* Material */}
                            <div className="space-y-2">
                                <Label htmlFor="materialId">Material</Label>
                                <Select
                                    value={
                                        materialId ? String(materialId) : undefined
                                    }
                                    onValueChange={(value) =>
                                        setValue("materialId", Number(value))
                                    }
                                >
                                    <SelectTrigger id="materialId">
                                        <SelectValue placeholder="Select material" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {materials?.map((m) => (
                                            <SelectItem
                                                key={m.id}
                                                value={String(m.id)}
                                            >
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
                            <Label htmlFor="status">Status *</Label>
                            <Select
                                value={currentStatus}
                                onValueChange={(value) =>
                                    setValue("status", value as any)
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
                                <p className="text-xs text-red-500">
                                    {errors.status.message}
                                </p>
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
                    <Button
                        type="submit"
                        form="create-product-form"
                        disabled={busy}
                    >
                        {busy ? "Creating..." : "Create Product"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
