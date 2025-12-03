import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useDeleteCategory, useUpdateCategory } from "../hooks";
import { updateCategorySchema, type UpdateCategoryInput, type Category, type CategoryStatus } from "../model/schemas";
import { CategoryStatusBadge } from "./CategoryStatusBadge";

interface Props {
    category: Category;
}

export function CategoryOverviewTab({ category }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm<UpdateCategoryInput>({
        resolver: zodResolver(updateCategorySchema),
        defaultValues: {
            name: category.name,
            status: category.status,
        },
    });

    const currentStatus = watch("status");

    const onSubmit = (data: UpdateCategoryInput) => {
        updateMutation.mutate(
            { id: category.id, data },
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
        if (confirm(`Are you sure you want to delete category "${category.name}"?`)) {
            deleteMutation.mutate(category.id, {
                onSuccess: () => {
                    navigate("/admin/categories");
                },
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Category Information */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Category Information</CardTitle>
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

                    {/* Status */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Status</Label>
                        <div className="col-span-3">
                            {isEditing ? (
                                <Select
                                    value={currentStatus}
                                    onValueChange={(value) =>
                                        setValue("status", value as CategoryStatus, { shouldDirty: true })
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
                                    <CategoryStatusBadge status={category.status} />
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Meta Info */}
            <Card>
                <CardHeader>
                    <CardTitle>Meta Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            Created At
                        </p>
                        <p className="text-sm">
                            {category.createdAt
                                ? formatDistanceToNow(new Date(category.createdAt), {
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
                            {category.updatedAt
                                ? formatDistanceToNow(new Date(category.updatedAt), {
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
                            <p className="font-medium">Delete Category</p>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete this category
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
