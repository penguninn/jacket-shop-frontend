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
import { Separator } from "@/shared/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useDeleteUser, useUpdateUser } from "@/features/users/hooks";
import { updateUserSchema, type UpdateUserInput, type User } from "@/features/users/model/schemas";
import { UserRoleBadge } from "./UserRoleBadge";

interface Props {
  user: User;
}

export function OverviewTab({ user }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: user.fullName,
      phone: user.phone || "",
      status: user.status,
      roleIds: [],
    },
  });

  const currentStatus = watch("status");

  const onSubmit = (data: UpdateUserInput) => {
    updateMutation.mutate(
      { id: user.id, data },
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
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      deleteMutation.mutate(user.id, {
        onSuccess: () => {
          navigate("/admin/users");
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
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
          {/* Username (read-only) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Username</Label>
            <div className="col-span-3">
              <Input value={user.username} disabled className="bg-muted" />
            </div>
          </div>

          {/* Full Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              Full Name
            </Label>
            <div className="col-span-3">
              <Input
                id="fullName"
                {...register("fullName")}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <div className="col-span-3">
              <Input
                id="phone"
                {...register("phone")}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.phone.message}
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
                    <SelectItem value="BANNED">Banned</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex h-10 items-center">
                  <span className="capitalize">{user.status.toLowerCase()}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <UserRoleBadge key={role} role={role} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Created At
            </p>
            <p className="text-sm">
              {user.createdAt
                ? formatDistanceToNow(new Date(user.createdAt), {
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
              {user.updatedAt
                ? formatDistanceToNow(new Date(user.updatedAt), {
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
              <p className="font-medium">Reset Password</p>
              <p className="text-sm text-muted-foreground">
                Send password reset link to user's email
              </p>
            </div>
            <Button variant="outline">Reset Password</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete this user account
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
