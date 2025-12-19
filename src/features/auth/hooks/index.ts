import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import { authStore, useAuthStore } from "@/app/store/auth";
import {
    signIn,
    signUp,
    logout,
    getMe,
    updateProfile,
} from "../api";
import type {
    SignInInput,
    SignUpInput,
    UpdateProfileInput,
    SignInResponse,
    SignUpResponse,
    LogoutResponse,
} from "../model";
import type { User } from "@/features/users/model";
import type { BaseMutationOptions } from "@/shared/api/types";

export const authKeys = {
    all: ['auth'] as const,
    me: () => [...authKeys.all, 'me'] as const,
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

export const useSignInMutation = useSignIn;
export const useSignUpMutation = useSignUp;
export const useLogoutMutation = useLogout;
