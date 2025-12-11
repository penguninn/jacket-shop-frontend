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
import { useCreateCoupon } from "../hooks";
import { createCouponSchema, type CreateCouponInput } from "../model/schemas";


export function CouponCreateForm() {
    const [open, setOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreateCouponInput>({
        resolver: zodResolver(createCouponSchema),
        defaultValues: {
            code: "",
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

    const { mutate: doCreateCoupon, isPending } = useCreateCoupon({ setError: setError as any });

    const couponType = watch("type");
    const currentStatus = watch("status");
    const busy = isSubmitting || isPending;

    const onSubmit = (data: CreateCouponInput) => {
        // Convert empty strings and 0 values to undefined for optional fields
        const payload = {
            ...data,
            description: data.description || undefined,
            minOrderValue:
                data.minOrderValue && data.minOrderValue > 0
                    ? data.minOrderValue
                    : undefined,
            maxDiscount:
                data.maxDiscount && data.maxDiscount > 0
                    ? data.maxDiscount
                    : undefined,
            usageLimit:
                data.usageLimit && data.usageLimit > 0
                    ? data.usageLimit
                    : undefined,
            validFrom: new Date(data.validFrom).toISOString(),
            validTo: new Date(data.validTo).toISOString(),
        };

        doCreateCoupon(payload as CreateCouponInput, {
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
                    New Coupon
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Create New Coupon</DialogTitle>
                    <DialogDescription>
                        Add a new coupon to the system. Fill in all required fields.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <form
                        id="create-coupon-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4 pr-4"
                    >

                        {/* Code */}
                        <div className="space-y-2">
                            <Label htmlFor="code">Code *</Label>
                            <Input
                                id="code"
                                placeholder="SUMMER2024"
                                {...register("code")}
                                autoFocus
                                className="font-mono uppercase"
                                onChange={(e) => {
                                    e.target.value = e.target.value.toUpperCase();
                                    register("code").onChange(e);
                                }}
                            />
                            {errors.code && (
                                <p className="text-xs text-red-500">
                                    {errors.code.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                placeholder="Summer sale discount"
                                {...register("description")}
                                rows={2}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Type and Value */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type *</Label>
                                <Select
                                    value={couponType}
                                    onValueChange={(value) =>
                                        setValue("type", value as any)
                                    }
                                >
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PERCENT">Percentage</SelectItem>
                                        <SelectItem value="AMOUNT">Fixed Amount</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-xs text-red-500">
                                        {errors.type.message}
                                    </p>
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
                                    placeholder={
                                        couponType === "PERCENT" ? "10" : "50.00"
                                    }
                                    {...register("value", { valueAsNumber: true })}
                                />
                                {errors.value && (
                                    <p className="text-xs text-red-500">
                                        {errors.value.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Min Order Value and Max Discount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minOrderValue">
                                    Min Order Value ($)
                                </Label>
                                <Input
                                    id="minOrderValue"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="100.00"
                                    {...register("minOrderValue", {
                                        valueAsNumber: true,
                                    })}
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
                                    {...register("maxDiscount", {
                                        valueAsNumber: true,
                                    })}
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
                            <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
                            <Input
                                id="usageLimit"
                                type="number"
                                min="0"
                                placeholder="100"
                                {...register("usageLimit", { valueAsNumber: true })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Leave empty or 0 for unlimited usage
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
                        form="create-coupon-form"
                        disabled={busy}
                    >
                        {busy ? "Creating..." : "Create Coupon"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
