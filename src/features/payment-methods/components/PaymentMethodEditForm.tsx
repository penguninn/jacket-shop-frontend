import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { AlertCircle } from "lucide-react";
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
import { updatePaymentMethodSchema, type UpdatePaymentMethodInput } from "../model/schemas";
import type { PaymentMethod } from "../model/schemas";
import { useUpdatePaymentMethod } from "../hooks";


interface Props {
    paymentMethod: PaymentMethod;
    children: React.ReactNode;
}

export function PaymentMethodEditForm({ paymentMethod, children }: Props) {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        setError,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<UpdatePaymentMethodInput>({
        resolver: zodResolver(updatePaymentMethodSchema),
        defaultValues: {
            name: "",
            code: "",
            type: "COD",
            description: "",
            config: "",
            status: "ACTIVE",
        },
    });

    const { mutate: doUpdate, isPending } = useUpdatePaymentMethod({ setError: setError as any });

    const currentStatus = watch("status");
    const busy = isSubmitting || isPending;

    useEffect(() => {
        if (open && paymentMethod) {
            reset({
                name: paymentMethod.name,
                code: paymentMethod.code,
                type: paymentMethod.type,
                description: paymentMethod.description || "",
                config: paymentMethod.config || "",
                status: paymentMethod.status,
            });
        }
    }, [open, paymentMethod, reset]);

    const onSubmit = (data: UpdatePaymentMethodInput) => {
        doUpdate(
            { id: paymentMethod.id, data },
            {
                onSuccess: () => {
                    setOpen(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        Edit Payment Method: {paymentMethod.name}
                    </DialogTitle>
                    <DialogDescription>
                        Update payment method information.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <form
                        id="edit-payment-method-form"
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
                                placeholder="e.g. COD"
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Code */}
                        <div className="space-y-2">
                            <Label htmlFor="code">Code *</Label>
                            <Input
                                id="code"
                                placeholder="e.g. PAYMENT_COD"
                                {...register("code")}
                            />
                            {errors.code && (
                                <p className="text-xs text-red-500">
                                    {errors.code.message}
                                </p>
                            )}
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type">Type *</Label>
                            <Input
                                id="type"
                                placeholder="e.g. COD"
                                {...register("type")}
                            />
                            {errors.type && (
                                <p className="text-xs text-red-500">
                                    {errors.type.message}
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
                            <Label htmlFor="config">Config JSON</Label>
                            <Textarea
                                id="config"
                                placeholder="{}"
                                className="font-mono text-sm"
                                {...register("config")}
                            />
                            {errors.config && (
                                <p className="text-xs text-red-500">
                                    {errors.config.message}
                                </p>
                            )}
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
                        form="edit-payment-method-form"
                        disabled={busy || !isDirty}
                    >
                        {busy ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
