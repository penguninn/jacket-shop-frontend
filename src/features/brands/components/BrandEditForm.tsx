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
import { updateBrandSchema, type UpdateBrandInput, type Brand } from "../model/schemas";
import type { Problem } from "@/shared/api/error";
import { useUpdateBrand } from "../hooks";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
    if (err.errors) {
        for (const [field, msg] of Object.entries(err.errors)) {
            setError(field as any, { message: String(msg) });
        }
        return;
    }
    const msg = err.message || err.detail || "Failed to update brand";
    setError("name", { message: msg });
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    brand: Brand;
}

export function BrandEditForm({ open, onOpenChange, brand }: Props) {
    const { mutate: doUpdateBrand, isPending } = useUpdateBrand();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UpdateBrandInput>({
        resolver: zodResolver(updateBrandSchema),
        defaultValues: {
            name: "",
            logoUrl: "",
            status: "ACTIVE",
        },
    });

    const currentStatus = watch("status");
    const busy = isSubmitting || isPending;

    useEffect(() => {
        if (open && brand) {
            reset({
                name: brand.name,
                logoUrl: brand.logoUrl || "",
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
                onError: (e: any) => mapProblemToForm(e, setError),
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Brand: {brand.name}</DialogTitle>
                    <DialogDescription>
                        Update brand information.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Brand Name *</Label>
                        <Input
                            id="name"
                            placeholder="Nike, Adidas, etc."
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Logo URL */}
                    <div className="space-y-2">
                        <Label htmlFor="logoUrl">Logo URL</Label>
                        <Input
                            id="logoUrl"
                            placeholder="https://example.com/logo.png"
                            {...register("logoUrl")}
                        />
                        {errors.logoUrl && (
                            <p className="text-xs text-red-500">
                                {errors.logoUrl.message}
                            </p>
                        )}
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
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="text-xs text-red-500">{errors.status.message}</p>
                        )}
                    </div>
                </form>

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
