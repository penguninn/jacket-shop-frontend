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
import { updateShippingMethodSchema, type UpdateShippingMethodInput, type ShippingMethod } from "../model/schemas";
import { useUpdateShippingMethod } from "../hooks";
import { mapProblemToForm } from "@/shared/utils/form";
import { FormError } from "@/shared/ui/form-error";

interface Props {
    shippingMethod: ShippingMethod;
    children: React.ReactNode;
}

export function ShippingMethodEditForm({ shippingMethod, children }: Props) {
    const [open, setOpen] = useState(false);
    const { mutate: doUpdate, isPending } = useUpdateShippingMethod();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UpdateShippingMethodInput>({
        resolver: zodResolver(updateShippingMethodSchema),
        defaultValues: {
            name: "",
            description: "",
            fee: 0,
            estimatedDays: 1,
            status: "ACTIVE",
        },
    });

    const currentStatus = watch("status");
    const busy = isSubmitting || isPending;

    useEffect(() => {
        if (open && shippingMethod) {
            reset({
                name: shippingMethod.name,
                description: shippingMethod.description || "",
                fee: shippingMethod.fee,
                estimatedDays: shippingMethod.estimatedDays,
                status: shippingMethod.status,
            });
        }
    }, [open, shippingMethod, reset]);

    const onSubmit = (data: UpdateShippingMethodInput) => {
        doUpdate(
            { id: shippingMethod.id, data },
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Shipping Method</DialogTitle>
                    <DialogDescription>
                        Update shipping method details.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="edit-shipping-method-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormError errors={errors} />
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            placeholder="Standard Shipping"
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
                            placeholder="Standard delivery within 3-5 business days"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Fee */}
                        <div className="space-y-2">
                            <Label htmlFor="fee">Fee *</Label>
                            <Input
                                id="fee"
                                type="number"
                                step="0.01"
                                min="0"
                                {...register("fee", { valueAsNumber: true })}
                            />
                            {errors.fee && (
                                <p className="text-xs text-red-500">
                                    {errors.fee.message}
                                </p>
                            )}
                        </div>

                        {/* Estimated Days */}
                        <div className="space-y-2">
                            <Label htmlFor="estimatedDays">Est. Days *</Label>
                            <Input
                                id="estimatedDays"
                                type="number"
                                min="1"
                                max="60"
                                {...register("estimatedDays", {
                                    valueAsNumber: true,
                                })}
                            />
                            {errors.estimatedDays && (
                                <p className="text-xs text-red-500">
                                    {errors.estimatedDays.message}
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
                                setValue("status", value as any, {
                                    shouldDirty: true,
                                })
                            }
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
                            <p className="text-xs text-red-500">
                                {errors.status.message}
                            </p>
                        )}
                    </div>
                </form>

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
                        form="edit-shipping-method-form"
                        disabled={busy || !isDirty}
                    >
                        {busy ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
