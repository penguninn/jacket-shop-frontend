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
import type { Problem } from "@/shared/api/error";
import { useCreateShippingMethod } from "../hooks";
import { createShippingMethodSchema, type CreateShippingMethodInput } from "../model/schemas";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
    if (err.errors) {
        for (const [field, msg] of Object.entries(err.errors)) {
            setError(field as any, { message: String(msg) });
        }
        return;
    }
    const msg = err.message || err.detail || "Failed to create shipping method";
    setError("name", { message: msg });
}

export function ShippingMethodCreateForm() {
    const [open, setOpen] = useState(false);
    const { mutate: doCreate, isPending } = useCreateShippingMethod();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateShippingMethodInput>({
        resolver: zodResolver(createShippingMethodSchema),
        defaultValues: {
            name: "",
            description: "",
            fee: 0,
            estimatedDays: 1,
            status: "ACTIVE",
        },
    });

    const busy = isSubmitting || isPending;

    const onSubmit = (data: CreateShippingMethodInput) => {
        doCreate(data, {
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
                    New Shipping Method
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Shipping Method</DialogTitle>
                    <DialogDescription>
                        Add a new shipping method to the system.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                            id="name"
                            placeholder="Standard Shipping"
                            {...register("name")}
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500">{errors.name.message}</p>
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
                            <p className="text-xs text-red-500">{errors.description.message}</p>
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
                                <p className="text-xs text-red-500">{errors.fee.message}</p>
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
                                {...register("estimatedDays", { valueAsNumber: true })}
                            />
                            {errors.estimatedDays && (
                                <p className="text-xs text-red-500">{errors.estimatedDays.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                            defaultValue="ACTIVE"
                            onValueChange={(value) => setValue("status", value as any)}
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
                        onClick={() => setOpen(false)}
                        disabled={busy}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} disabled={busy}>
                        {busy ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
