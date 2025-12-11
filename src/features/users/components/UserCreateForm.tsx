// features/users/components/UserCreateForm.tsx
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Plus } from "lucide-react";
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
import { useCreateUser } from "../hooks";
import { useRoles } from "@/features/roles/hooks";
import { createUserSchema, type CreateUserInput } from "../model/schemas";
import type { Status } from "@/shared/api/schemas";

// ============================================
// CONSTANTS
// ============================================
const FORM_CONFIG = {
  PLACEHOLDERS: {
    USERNAME: 'johndoe',
    FULL_NAME: 'John Doe',
    PHONE: '0987654321',
    PASSWORD: '••••••••',
  },
  LABELS: {
    USERNAME: 'Username *',
    FULL_NAME: 'Full Name *',
    PHONE: 'Phone (Optional)',
    PASSWORD: 'Password *',
    CONFIRM_PASSWORD: 'Confirm Password *',
    STATUS: 'Status *',
    ROLES: 'Roles * (Select at least one)',
  },
  MESSAGES: {
    LOADING_ROLES: 'Loading roles...',
    CREATING: 'Creating...',
    CREATE: 'Create User',
    SELECTED_ROLES: 'Selected:',
  },
} as const;

const DEFAULT_VALUES: CreateUserInput = {
  username: "",
  fullName: "",
  phone: "",
  password: "",
  confirmPassword: "",
  status: "ACTIVE",
  roleIds: [],
};

function toggleArrayItem<T>(array: T[], item: T): T[] {
  return array.includes(item)
    ? array.filter((i) => i !== item)
    : [...array, item];
}

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  register: any;
  error?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
}

function PasswordInput({
  id,
  label,
  placeholder,
  register,
  error,
  showPassword,
  onToggleVisibility,
}: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={onToggleVisibility}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface RolesSelectorProps {
  roles?: Array<{ id: number; name: string }>;
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

export function UserCreateForm() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const { mutate: createUser, isPending } = useCreateUser({ setError: setError as any });
  const { data: roles, isLoading: rolesLoading } = useRoles();

  const selectedRoleIds = watch("roleIds");
  const currentStatus = watch("status");
  const busy = isSubmitting || isPending;

  const toggleRole = useCallback(
    (roleId: number) => {
      const updated = toggleArrayItem(selectedRoleIds || [], roleId);
      setValue("roleIds", updated, { shouldValidate: true });
    },
    [selectedRoleIds, setValue]
  );

  const onSubmit = useCallback(
    (data: CreateUserInput) => {
      createUser(data, {
        onSuccess: () => {
          setOpen(false);
          reset(DEFAULT_VALUES);
          setShowPassword(false);
          setShowConfirmPassword(false);
        }
      });
    },
    [createUser, reset]
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        reset(DEFAULT_VALUES);
        setShowPassword(false);
        setShowConfirmPassword(false);
      }
      setOpen(newOpen);
    },
    [reset]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <form
            id="create-user-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 pr-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username">{FORM_CONFIG.LABELS.USERNAME}</Label>
              <Input
                id="username"
                placeholder={FORM_CONFIG.PLACEHOLDERS.USERNAME}
                {...register("username")}
                autoFocus
              />
              {errors.username && (
                <p className="text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
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

            <PasswordInput
              id="password"
              label={FORM_CONFIG.LABELS.PASSWORD}
              placeholder={FORM_CONFIG.PLACEHOLDERS.PASSWORD}
              register={register("password")}
              error={errors.password?.message}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword(!showPassword)}
            />

            <PasswordInput
              id="confirmPassword"
              label={FORM_CONFIG.LABELS.CONFIRM_PASSWORD}
              placeholder={FORM_CONFIG.PLACEHOLDERS.PASSWORD}
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
              showPassword={showConfirmPassword}
              onToggleVisibility={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />

            <div className="space-y-2">
              <Label htmlFor="status">{FORM_CONFIG.LABELS.STATUS}</Label>
              <Select
                value={currentStatus}
                onValueChange={(value) => setValue("status", value as Status)}
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

            <div className="space-y-2">
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
          <Button type="submit" form="create-user-form" disabled={busy}>
            {busy ? FORM_CONFIG.MESSAGES.CREATING : FORM_CONFIG.MESSAGES.CREATE}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
