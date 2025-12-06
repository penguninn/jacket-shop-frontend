import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { updateCouponSchema, type UpdateCouponInput } from "../model/schemas";
import type { Coupon } from "../model/schemas";
import { useUpdateCoupon } from "../hooks";
import { mapProblemToForm } from "@/shared/utils/form";
import { FormError } from "@/shared/ui/form-error";

interface Props {
    coupon: Coupon;
    children: React.ReactNode;
}

export function CouponEditForm({ coupon, children }: Props) {
    const [open, setOpen] = useState(false);
    const { mutate: doUpdateCoupon, isPending } = useUpdateCoupon();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UpdateCouponInput>({
        resolver: zodResolver(updateCouponSchema),
        defaultValues: {
            description: "",
            type: "PERCENT",
            value: 0,
            minOrderValue: 0,
            maxDiscount: 0,
            usageLimit: 0,
            validFrom: "",
            validTo: "",
            status: "ACTIVE",
        },
    });

    const couponType = watch("type");
    const currentStatus = watch("status");
    const busy = isSubmitting || isPending;

    useEffect(() => {
        if (open && coupon) {
            // Format dates for datetime-local input
            const formatDateForInput = (dateString: string) => {
                const date = new Date(dateString);
                return date.toISOString().slice(0, 16);
            };

            reset({
                description: coupon.description || "",
                type: coupon.type,
                value: coupon.value,
                minOrderValue: coupon.minOrderValue || 0,
                maxDiscount: coupon.maxDiscount || 0,
                usageLimit: coupon.usageLimit || 0,
                validFrom: formatDateForInput(coupon.validFrom),
                validTo: formatDateForInput(coupon.validTo),
                status: coupon.status,
            });
        }
    }, [open, coupon, reset]);

    const onSubmit = (data: UpdateCouponInput) => {
        // Convert empty strings and 0 values to undefined for optional fields
        const payload = {
            ...data,
            description: data.description || undefined,
            minOrderValue: data.minOrderValue && data.minOrderValue > 0 ? data.minOrderValue : undefined,
            maxDiscount: data.maxDiscount && data.maxDiscount > 0 ? data.maxDiscount : undefined,
            usageLimit: data.usageLimit && data.usageLimit > 0 ? data.usageLimit : undefined,
            validFrom: new Date(data.validFrom).toISOString(),
            validTo: new Date(data.validTo).toISOString(),
        };

        doUpdateCoupon(
            { id: coupon.id, data: payload as UpdateCouponInput },
            {
                onSuccess: () => {
                    setOpen(false);
                },
                onError: (e: any) => mapProblemToForm(e, setError),
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Edit Coupon: {coupon.code}</DialogTitle>
                    <DialogDescription>
                        Update coupon information and settings.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
                        <FormError errors={errors} />
                        {/* Code (Read-only) */}
                        <div className="space-y-2">
                            <Label htmlFor="code-readonly">Code</Label>
                            <Input
                                id="code-readonly"
                                value={coupon.code}
                                disabled
                                className="bg-muted font-mono"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Summer sale discount"
                                {...register("description")}
                                rows={2}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Type and Value */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type *</Label>
                                <Select
                                    value={couponType}
                                    onValueChange={(value) => setValue("type", value as any, { shouldDirty: true })}
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PERCENT">Percentage</SelectItem>
                                        <SelectItem value="AMOUNT">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-xs text-red-500">{errors.type.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="value">
                                    Value * {couponType === "PERCENT" ? "(%)" : "($)"}
                                </Label>
                                <Input
                                    id="value"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder={couponType === "PERCENT" ? "10" : "50.00"}
                                    {...register("value", { valueAsNumber: true })}
                                />
                                {errors.value && (
                                    <p className="text-xs text-red-500">{errors.value.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Min Order Value and Max Discount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minOrderValue">Min Order Value ($)</Label>
                                <Input
                                    id="minOrderValue"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="100.00"
                                    {...register("minOrderValue", { valueAsNumber: true })}
                                />
                                {errors.minOrderValue && (
                                    <p className="text-xs text-red-500">
                                        {errors.minOrderValue.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxDiscount">Max Discount ($)</Label>
                                <Input
                                    id="maxDiscount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="50.00"
                                    {...register("maxDiscount", { valueAsNumber: true })}
                                />
                                {errors.maxDiscount && (
                                    <p className="text-xs text-red-500">
                                        {errors.maxDiscount.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Usage Limit */}
                        <div className="space-y-2">
                            <Label htmlFor="usageLimit">Usage Limit</Label>
                            <Input
                                id="usageLimit"
                                type="number"
                                min="0"
                                placeholder="100"
                                {...register("usageLimit", { valueAsNumber: true })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Current usage: {coupon.usedCount} / {coupon.usageLimit || "∞"}
                            </p>
                            {errors.usageLimit && (
                                <p className="text-xs text-red-500">
                                    {errors.usageLimit.message}
                                </p>
                            )}
                        </div>

                        {/* Valid From and Valid To */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="validFrom">Valid From *</Label>
                                <Input
                                    id="validFrom"
                                    type="datetime-local"
                                    {...register("validFrom")}
                                />
                                {errors.validFrom && (
                                    <p className="text-xs text-red-500">
                                        {errors.validFrom.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="validTo">Valid To *</Label>
                                <Input
                                    id="validTo"
                                    type="datetime-local"
                                    {...register("validTo")}
                                />
                                {errors.validTo && (
                                    <p className="text-xs text-red-500">
                                        {errors.validTo.message}
                                    </p>
                                )}
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
                                    <SelectValue />
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
