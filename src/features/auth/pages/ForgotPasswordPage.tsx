import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../model";
import { useForgotPassword } from "../hooks";
import { useState } from "react";

export default function ForgotPasswordPage() {
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const { mutate: forgotPassword, isPending: isLoading } = useForgotPassword({
        setError: setError as any,
    });

    const onSubmit = (data: ForgotPasswordInput) => {
        forgotPassword(data, {
            onSuccess: () => {
                setIsSuccess(true);
            },
        });
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Check your email
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        We have sent password reset instructions to your email address.
                    </p>
                    <div className="mt-4">
                        <Link
                            to="/signin"
                            className="font-medium text-primary hover:text-primary/90"
                        >
                            Return to Sign in
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your username and we'll send you a link to reset your password.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                autoComplete="username"
                                placeholder="Enter your username"
                                {...register("username")}
                            />
                            {errors.username && (
                                <p className="text-sm text-destructive">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link
                                to="/signin"
                                className="font-medium text-primary hover:text-primary/90"
                            >
                                Back to Sign in
                            </Link>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Link
                    </Button>
                </form>
            </div>
        </div>
    );
}
