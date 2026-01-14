import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import {
    resetPasswordSchema,
    type ResetPasswordInput,
} from "../model";
import { useResetPassword, useVerifyResetToken } from "../hooks";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const {
        data: isValid,
        isLoading: isVerifying,
        isError: isRequestError,
    } = useVerifyResetToken(token);

    const isTokenInvalid = isRequestError || (isValid === false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: token || "",
        },
    });

    const { mutate: resetPassword, isPending: isSubmitting, isSuccess } = useResetPassword({
        setError: setError as any,
    });

    const onSubmit = (data: ResetPasswordInput) => {
        resetPassword(data, {
            onSuccess: () => {
                setTimeout(() => {
                    navigate("/signin");
                }, 3000);
            },
        });
    };

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Invalid Link</AlertTitle>
                    <AlertDescription>
                        This password reset link is invalid or missing a token. Please try requesting a new one.
                        <div className="mt-4">
                            <Link to="/forgot-password" className="font-medium underline underline-offset-4">
                                Go to Forgot Password
                            </Link>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isVerifying) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-gray-500">Verifying link...</p>
                </div>
            </div>
        );
    }

    if (isTokenInvalid) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Link Expired or Invalid</AlertTitle>
                    <AlertDescription>
                        This password reset link has expired or is invalid. Please request a new password reset.
                        <div className="mt-4">
                            <Link to="/forgot-password" className="font-medium underline underline-offset-4">
                                Request new link
                            </Link>
                        </div>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Password Reset Successful
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Your password has been successfully updated. You will be redirected to the sign-in page shortly.
                    </p>
                    <div className="mt-4">
                        <Link
                            to="/signin"
                            className="font-medium text-primary hover:text-primary/90"
                        >
                            Return to Sign in immediately
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
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter your new password below.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Hidden token field */}
                    <input type="hidden" {...register("token")} />

                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Enter new password"
                                {...register("newPassword")}
                            />
                            {errors.newPassword && (
                                <p className="text-sm text-destructive">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Confirm new password"
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
