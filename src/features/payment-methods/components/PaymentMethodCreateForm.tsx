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
import type { Problem } from "@/shared/api/error";
import { useCreatePaymentMethod } from "../hooks";
import { createPaymentMethodSchema, type CreatePaymentMethodInput } from "../model/schemas";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
    if (err.errors) {
        for (const [field, msg] of Object.entries(err.errors)) {
            setError(field as any, { message: String(msg) });
        }
        return;
    }
    const msg = err.message || err.detail || "Failed to create payment method";
    setError("name", { message: msg });
}

export function PaymentMethodCreateForm() {
    const [open, setOpen] = useState(false);

    const { mutate: doCreate, isPending } = useCreatePaymentMethod();

    const {
        register,
        handleSubmit,
        setError,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreatePaymentMethodInput>({
        resolver: zodResolver(createPaymentMethodSchema),
        defaultValues: {
            name: "",
            description: "",
            configJson: "",
            status: "ACTIVE",
        },
    });

    const busy = isSubmitting || isPending;

    const onSubmit = (data: CreatePaymentMethodInput) => {
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
                    New Payment Method
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Payment Method</DialogTitle>
                    <DialogDescription>
                        Add a new payment method to the system.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g. COD"
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
                                placeholder="Description of the payment method"
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Config JSON */}
                        <div className="space-y-2">
                            <Label htmlFor="configJson">Config JSON</Label>
                            <Textarea
                                id="configJson"
                                placeholder="{}"
                                className="font-mono text-sm"
                                {...register("configJson")}
                            />
                            {errors.configJson && (
                                <p className="text-xs text-red-500">{errors.configJson.message}</p>
                            )}
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
                    <Button onClick={handleSubmit(onSubmit)} disabled={busy}>
                        {busy ? "Creating..." : "Create Payment Method"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
