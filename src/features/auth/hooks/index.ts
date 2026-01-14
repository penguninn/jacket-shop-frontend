import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import { authStore, useAuthStore } from "@/app/store/auth";
import {
    signIn,
    signUp,
    logout,
    getMe,
    updateProfile,
    updatePassword,
    forgotPassword,
    verifyResetToken,
    resetPassword,
} from "../api";
import type {
    SignInInput,
    SignUpInput,
    UpdateProfileInput,
    UpdatePasswordInput,
    ForgotPasswordInput,
    ResetPasswordInput,
    SignInResponse,
    SignUpResponse,
    LogoutResponse,
} from "../model";
import type { User } from "@/features/users/model";
import type { BaseMutationOptions } from "@/shared/api/types";

export const authKeys = {
    all: ['auth'] as const,
    me: () => [...authKeys.all, 'me'] as const,
    verifyToken: (token: string) => [...authKeys.all, 'verify-token', token] as const,
} as const;



export function useMe() {
    return useQuery({
        queryKey: authKeys.me(),
        queryFn: getMe,
    });
}


export function useSignIn(options?: BaseMutationOptions) {
    return useGlobalMutation<SignInResponse, SignInInput>({
        mutationFn: signIn,
        invalidateQueries: [
            [...authKeys.me()] as string[],
        ],
        successMessage: "Welcome back!",
        errorContext: "Sign In",
        setError: options?.setError,
    });
}

export function useSignUp(options?: BaseMutationOptions) {
    const queryClient = useQueryClient();

    return useGlobalMutation<SignUpResponse, SignUpInput>({
        mutationFn: signUp,
        successMessage: "Account created successfully! Please sign in.",
        errorContext: "Sign Up",
        onSuccess: () => {
            queryClient.clear();
        },
        setError: options?.setError,
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const setUser = useAuthStore((state) => state.setUser);

    return useGlobalMutation<LogoutResponse, { token: string }>({
        mutationFn: logout,
        errorContext: "Logout",
        showErrorToast: false,
        onSuccess: () => {
            authStore.clearAll();
            setUser(undefined);
            queryClient.clear();
            window.location.href = '/signin';
        },
        onError: () => {
            authStore.clearAll();
            setUser(undefined);
            queryClient.clear();
            window.location.href = '/signin';
        },
    });
}

export function useUpdateProfile(options?: BaseMutationOptions) {
    return useGlobalMutation<User, UpdateProfileInput>({
        mutationFn: updateProfile,
        invalidateQueries: [
            [...authKeys.me()] as string[],
        ],
        successMessage: "Profile updated successfully",
        errorContext: "Update Profile",
        setError: options?.setError,
    });
}

export function useForgotPassword(options?: BaseMutationOptions) {
    return useGlobalMutation<any, ForgotPasswordInput>({
        mutationFn: forgotPassword,
        successMessage: "If the account exists, a password reset email has been sent",
        errorContext: "Forgot Password",
        setError: options?.setError,
    });
}

export function useVerifyResetToken(token: string | null) {
    return useQuery({
        queryKey: authKeys.verifyToken(token || ''),
        queryFn: () => verifyResetToken(token!),
        enabled: !!token,
        retry: false,
    });
}

export function useResetPassword(options?: BaseMutationOptions) {
    return useGlobalMutation<any, ResetPasswordInput>({
        mutationFn: resetPassword,
        successMessage: "Password has been reset successfully",
        errorContext: "Reset Password",
        setError: options?.setError,
    });
}

export const useSignInMutation = useSignIn;
export const useSignUpMutation = useSignUp;
export const useLogoutMutation = useLogout;

export function useUpdatePassword(options?: BaseMutationOptions) {
    return useGlobalMutation<any, UpdatePasswordInput>({
        mutationFn: updatePassword,
        successMessage: "Password updated successfully",
        errorContext: "Update Password",
        setError: options?.setError,
    });
}
