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
import { useCreateShippingMethod } from "../hooks";
import { createShippingMethodSchema, type CreateShippingMethodInput } from "../model/schemas";


export function ShippingMethodCreateForm() {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        setError,
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

    const { mutate: doCreate, isPending } = useCreateShippingMethod({ setError: setError as any });

    const currentStatus = watch("status");
    const busy = isSubmitting || isPending;

    const onSubmit = (data: CreateShippingMethodInput) => {
        doCreate(data, {
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

                <ScrollArea className="max-h-[60vh]">
                    <form
                        id="create-shipping-method-form"
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
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                placeholder="Standard Shipping"
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
                        form="create-shipping-method-form"
                        disabled={busy}
                    >
                        {busy ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
