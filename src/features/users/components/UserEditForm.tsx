// features/users/components/UserEditForm.tsx
import { useEffect, useState, useCallback, useMemo } from "react";
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
import { Checkbox } from "@/shared/ui/checkbox";
import { Badge } from "@/shared/ui/badge";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { updateUserSchema, type UpdateUserInput, type User, type Role } from "../model/schemas";
import { useUpdateUser } from "../hooks";
import { useRoles } from "@/features/roles/hooks";
import type { Status } from "@/shared/api/schemas";

// ============================================
// CONSTANTS
// ============================================
const FORM_CONFIG = {
  PLACEHOLDERS: {
    FULL_NAME: 'John Doe',
    PHONE: '0987654321',
  },
  LABELS: {
    USERNAME: 'Username',
    FULL_NAME: 'Full Name *',
    PHONE: 'Phone',
    STATUS: 'Status *',
    ROLES: 'Roles *',
  },
  MESSAGES: {
    LOADING_ROLES: 'Loading roles...',
    SAVING: 'Saving...',
    SAVE: 'Save Changes',
    SELECTED_ROLES: 'Selected:',
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================
function toggleArrayItem<T>(array: T[], item: T): T[] {
  return array.includes(item)
    ? array.filter((i) => i !== item)
    : [...array, item];
}

/**
 * Map role objects to role IDs
 */
function mapRoleNamesToIds(
  roleObjects: Array<{ id: number; name: string }>,
  allRoles?: Role[]
): number[] {
  if (!allRoles) return [];

  return roleObjects
    .map((roleObj) => {
      const foundRole = allRoles.find((r) => r.name === roleObj.name);
      return foundRole?.id;
    })
    .filter((id): id is number => id !== undefined);
}

/**
 * Create form defaults from user data
 */
function createFormDefaults(user: User, roles?: Role[]): UpdateUserInput {
  return {
    fullName: user.fullName,
    phone: user.phone || "",
    status: user.status,
    roleIds: mapRoleNamesToIds(user.roles, roles),
  };
}

// ============================================
// SUB-COMPONENTS
// ============================================
interface RolesSelectorProps {
  roles?: Role[];
  selectedRoleIds: number[];
  onToggleRole: (roleId: number) => void;
  error?: string;
  isLoading: boolean;
}

function RolesSelector({
  roles,
  selectedRoleIds,
  onToggleRole,
  error,
  isLoading,
}: RolesSelectorProps) {
  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        {FORM_CONFIG.MESSAGES.LOADING_ROLES}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {roles?.map((role) => (
          <div key={role.id} className="flex items-center space-x-2">
            <Checkbox
              id={`role-${role.id}`}
              checked={selectedRoleIds.includes(role.id)}
              onCheckedChange={() => onToggleRole(role.id)}
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

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Selected Roles Preview */}
      {selectedRoleIds.length > 0 && (
        <div className="mt-3">
          <div className="text-sm text-muted-foreground mb-2">
            {FORM_CONFIG.MESSAGES.SELECTED_ROLES}
          </div>
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
    </>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
interface UserEditFormProps {
  user: User;
  children: React.ReactNode;
}

export function UserEditForm({ user, children }: UserEditFormProps) {
  const [open, setOpen] = useState(false);



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

  const { mutate: updateUser, isPending } = useUpdateUser({ setError: setError as any });
  const { data: roles, isLoading: rolesLoading } = useRoles();

  const selectedRoleIds = watch("roleIds");
  const currentStatus = watch("status");
  const busy = isSubmitting || isPending;

  const formDefaults = useMemo(() => {
    return createFormDefaults(user, roles);
  }, [user, roles]);

  useEffect(() => {
    if (open && roles) {
      reset(formDefaults);
    }
  }, [open, roles, formDefaults, reset]);

  const toggleRole = useCallback(
    (roleId: number) => {
      const updated = toggleArrayItem(selectedRoleIds || [], roleId);
      setValue("roleIds", updated, { shouldDirty: true, shouldValidate: true });
    },
    [selectedRoleIds, setValue]
  );

  const onSubmit = useCallback(
    (data: UpdateUserInput) => {
      updateUser(
        { id: user.id, data },
        {
          onSuccess: () => {
            setOpen(false);
          },
        }
      );
    },
    [updateUser, user.id]
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen);
      if (!newOpen) {
        reset(formDefaults);
      }
    },
    [reset, formDefaults]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User: {user.username}</DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form
            id="edit-user-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 pr-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username-readonly">
                {FORM_CONFIG.LABELS.USERNAME}
              </Label>
              <Input
                id="username-readonly"
                value={user.username}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">{FORM_CONFIG.LABELS.FULL_NAME}</Label>
              <Input
                id="fullName"
                placeholder={FORM_CONFIG.PLACEHOLDERS.FULL_NAME}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{FORM_CONFIG.LABELS.PHONE}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={FORM_CONFIG.PLACEHOLDERS.PHONE}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{FORM_CONFIG.LABELS.STATUS}</Label>
              <Select
                value={currentStatus}
                onValueChange={(value) =>
                  setValue("status", value as Status, {
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
                <p className="text-xs text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space--2">
              <Label>{FORM_CONFIG.LABELS.ROLES}</Label>
              <RolesSelector
                roles={roles}
                selectedRoleIds={selectedRoleIds || []}
                onToggleRole={toggleRole}
                error={errors.roleIds?.message}
                isLoading={rolesLoading}
              />
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
            form="edit-user-form"
            disabled={busy || !isDirty}
          >
            {busy ? FORM_CONFIG.MESSAGES.SAVING : FORM_CONFIG.MESSAGES.SAVE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
