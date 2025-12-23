import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { updatePasswordSchema, type UpdatePasswordInput } from "../model";
import { updatePassword } from "../api";

export default function ChangePasswordPage() {
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdatePasswordInput>({
        resolver: zodResolver(updatePasswordSchema),
    });

    const onSubmit = async (data: UpdatePasswordInput) => {
        setIsLoading(true);
        try {
            await updatePassword(data);
            toast.success("Password updated successfully");
            reset();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
            <div className="border-b px-6 py-4">
                <h2 className="text-lg font-medium">Change Password</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Update your password to keep your account secure
                </p>
            </div>
            <div className="flex-1 p-6">
                <form className="max-w-md space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                            id="current-password"
                            type="password"
                            {...register("oldPassword")}
                        />
                        {errors.oldPassword && (
                            <p className="text-sm text-destructive">
                                {errors.oldPassword.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                            id="new-password"
                            type="password"
                            {...register("newPassword")}
                        />
                        {errors.newPassword && (
                            <p className="text-sm text-destructive">
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                            id="confirm-password"
                            type="password"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
