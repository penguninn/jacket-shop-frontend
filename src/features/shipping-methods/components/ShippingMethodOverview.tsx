import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { AlertCircle, Edit2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";

import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useDeleteShippingMethod, useUpdateShippingMethod } from "../hooks";
import { updateShippingMethodSchema, type UpdateShippingMethodInput, type ShippingMethod } from "../model/schemas";

interface Props {
    shippingMethod: ShippingMethod;
}

export function ShippingMethodOverview({ shippingMethod }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const updateMutation = useUpdateShippingMethod();
    const deleteMutation = useDeleteShippingMethod();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm<UpdateShippingMethodInput>({
        resolver: zodResolver(updateShippingMethodSchema),
        defaultValues: {
            name: shippingMethod.name,
            description: shippingMethod.description || "",
            fee: shippingMethod.fee,
            estimatedDays: shippingMethod.estimatedDays,
            status: shippingMethod.status,
        },
    });

    const currentStatus = watch("status");

    const onSubmit = (data: UpdateShippingMethodInput) => {
        updateMutation.mutate(
            { id: shippingMethod.id, data },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete shipping method "${shippingMethod.name}"?`)) {
            deleteMutation.mutate(shippingMethod.id, {
                onSuccess: () => {
                    navigate("/admin/shipping-methods");
                },
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Basic Information</CardTitle>
                    {!isEditing ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                                disabled={updateMutation.isPending}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSubmit(onSubmit)}
                                disabled={updateMutation.isPending || !isDirty}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {updateMutation.isPending ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    {errors.root && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.root.message}</AlertDescription>
                        </Alert>
                    )}
                    {/* Name */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="name"
                                {...register("name")}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <div className="col-span-3">
                            <Textarea
                                id="description"
                                {...register("description")}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Fee */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fee" className="text-right">
                            Fee
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="fee"
                                type="number"
                                step="0.01"
                                {...register("fee", { valueAsNumber: true })}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                            />
                            {errors.fee && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.fee.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Estimated Days */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="estimatedDays" className="text-right">
                            Est. Days
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="estimatedDays"
                                type="number"
                                {...register("estimatedDays", { valueAsNumber: true })}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                            />
                            {errors.estimatedDays && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.estimatedDays.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Status</Label>
                        <div className="col-span-3">
                            {isEditing ? (
                                <Select
                                    value={currentStatus}
                                    onValueChange={(value) =>
                                        setValue("status", value as any, { shouldDirty: true })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="flex h-10 items-center">
                                    <span className="capitalize">{shippingMethod.status.toLowerCase()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* System Information */}
            <Card>
                <CardHeader>
                    <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            Created At
                        </p>
                        <p className="text-sm">
                            {shippingMethod.createdAt
                                ? formatDistanceToNow(new Date(shippingMethod.createdAt), {
                                    addSuffix: true,
                                })
                                : "N/A"}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            Updated At
                        </p>
                        <p className="text-sm">
                            {shippingMethod.updatedAt
                                ? formatDistanceToNow(new Date(shippingMethod.updatedAt), {
                                    addSuffix: true,
                                })
                                : "N/A"}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Delete Shipping Method</p>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete this shipping method
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
