import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { updatePasswordSchema, type UpdatePasswordInput } from "../model";
import { useUpdatePassword } from "../hooks";

const FORM_CONFIG = {
    TITLE: 'Change Password',
    SUBTITLE: 'Update your password to keep your account secure',
    LABELS: {
        CURRENT_PASSWORD: 'Current Password',
        NEW_PASSWORD: 'New Password',
        CONFIRM_PASSWORD: 'Confirm New Password',
    },
    PLACEHOLDERS: {
        CURRENT_PASSWORD: 'Enter your current password',
        NEW_PASSWORD: 'Enter your new password',
        CONFIRM_PASSWORD: 'Confirm your new password',
    },
    BUTTONS: {
        SUBMIT: 'Update Password',
        SUBMITTING: 'Updating...',
    },
    ARIA_LABELS: {
        SHOW_PASSWORD: 'Show password',
        HIDE_PASSWORD: 'Hide password',
    },
} as const;

interface PasswordInputProps {
    id: string;
    label: string;
    register: any;
    error?: string;
    placeholder?: string;
    showPassword: boolean;
    onToggleVisibility: () => void;
}

function PasswordInput({
    id,
    label,
    register,
    error,
    placeholder,
    showPassword,
    onToggleVisibility,
}: PasswordInputProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    className="pl-9 pr-9"
                    placeholder={placeholder}
                    autoComplete="new-password"
                    {...register}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={onToggleVisibility}
                    aria-label={
                        showPassword
                            ? FORM_CONFIG.ARIA_LABELS.HIDE_PASSWORD
                            : FORM_CONFIG.ARIA_LABELS.SHOW_PASSWORD
                    }
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

export default function ChangePasswordPage() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordInput>({
        resolver: zodResolver(updatePasswordSchema),
    });

    const { mutate: updatePassword, isPending } = useUpdatePassword({ setError: setError as any });

    const busy = isSubmitting || isPending;

    const onSubmit = useCallback(
        (data: UpdatePasswordInput) => {
            updatePassword(data, {
                onSuccess: () => {
                    reset();
                }
            });
        },
        [updatePassword, reset]
    );

    return (
        <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
            <div className="border-b px-6 py-4">
                <h2 className="text-lg font-medium">{FORM_CONFIG.TITLE}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    {FORM_CONFIG.SUBTITLE}
                </p>
            </div>
            <div className="flex-1 p-6">
                <form className="max-w-md space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    {errors.root && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {errors.root.message}
                            </AlertDescription>
                        </Alert>
                    )}
                    <PasswordInput
                        id="current-password"
                        label={FORM_CONFIG.LABELS.CURRENT_PASSWORD}
                        register={register('oldPassword')}
                        error={errors.oldPassword?.message}
                        placeholder={FORM_CONFIG.PLACEHOLDERS.CURRENT_PASSWORD}
                        showPassword={showCurrentPassword}
                        onToggleVisibility={() => setShowCurrentPassword(!showCurrentPassword)}
                    />

                    <PasswordInput
                        id="new-password"
                        label={FORM_CONFIG.LABELS.NEW_PASSWORD}
                        register={register('newPassword')}
                        error={errors.newPassword?.message}
                        placeholder={FORM_CONFIG.PLACEHOLDERS.NEW_PASSWORD}
                        showPassword={showNewPassword}
                        onToggleVisibility={() => setShowNewPassword(!showNewPassword)}
                    />

                    <PasswordInput
                        id="confirm-password"
                        label={FORM_CONFIG.LABELS.CONFIRM_PASSWORD}
                        register={register('confirmPassword')}
                        error={errors.confirmPassword?.message}
                        placeholder={FORM_CONFIG.PLACEHOLDERS.CONFIRM_PASSWORD}
                        showPassword={showConfirmPassword}
                        onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                    />

                    <Button type="submit" disabled={busy}>
                        {busy ? FORM_CONFIG.BUTTONS.SUBMITTING : FORM_CONFIG.BUTTONS.SUBMIT}
                    </Button>
                </form>
            </div>
        </div>
    );
}
