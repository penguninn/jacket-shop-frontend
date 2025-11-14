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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateUserSchema, type UpdateUserInput, type User } from "@/schema/user";
import type { Problem } from "@/lib/api/error";
import { useUpdateUser } from "@/hooks/user";
import { useRoles } from "@/hooks/role";

function mapProblemToForm(err: Problem, setError: (name: any, e: any) => void) {
  if (err.errors) {
    for (const [field, msg] of Object.entries(err.errors)) {
      setError(field as any, { message: String(msg) });
    }
    return;
  }
  const msg = err.message || err.detail || "Failed to update user";
  setError("fullName", { message: msg });
}

interface Props {
  user: User;
  children: React.ReactNode;
}

export function UserEditForm({ user, children }: Props) {
  const [open, setOpen] = useState(false);
  const { mutate: doUpdateUser, isPending } = useUpdateUser();
  const { data: roles, isLoading: rolesLoading } = useRoles();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      status: "ACTIVE",
      roleIds: [],
    },
  });

  const selectedRoleIds = watch("roleIds");
  const currentStatus = watch("status");
  const busy = isSubmitting || isPending;

  useEffect(() => {
    if (open && user && roles) {
      const roleIds = user.roles
        .map((roleName) => {
          const foundRole = roles.find((r) => r.name === roleName);
          return foundRole?.id;
        })
        .filter((id): id is number => id !== undefined);

      reset({
        fullName: user.fullName,
        phone: user.phone || "",
        status: user.status,
        roleIds,
      });
    }
  }, [open, user, roles, reset]);

  const toggleRole = (roleId: number) => {
    const current = selectedRoleIds || [];
    const updated = current.includes(roleId)
      ? current.filter((id) => id !== roleId)
      : [...current, roleId];
    setValue("roleIds", updated, { shouldDirty: true });
  };

  const onSubmit = (data: UpdateUserInput) => {
    doUpdateUser(
      { id: user.id, data },
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
          <DialogTitle>Edit User: {user.username}</DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
            {/* Username (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="username-readonly">Username</Label>
              <Input
                id="username-readonly"
                value={user.username}
                disabled
                className="bg-muted"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0987654321"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
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

            {/* Roles */}
            <div className="space-y-2">
              <Label>Roles *</Label>
              {rolesLoading ? (
                <div className="text-sm text-muted-foreground">Loading roles...</div>
              ) : (
                <div className="space-y-2">
                  {roles?.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={selectedRoleIds?.includes(role.id)}
                        onCheckedChange={() => toggleRole(role.id)}
                      />
                      <Label
                        htmlFor={`role-${role.id}`}
                        className="cursor-pointer font-normal"
                      >
                        {role.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
              {errors.roleIds && (
                <p className="text-xs text-red-500">{errors.roleIds.message}</p>
              )}

              {/* Selected Roles Preview */}
              {selectedRoleIds && selectedRoleIds.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm text-muted-foreground mb-2">Selected:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedRoleIds.map((id) => {
                      const role = roles?.find((r) => r.id === id);
                      return role ? (
                        <Badge key={id} variant="secondary">
                          {role.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
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

