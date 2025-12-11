import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Problem } from "@/shared/api/error";
import { handleApiError } from "@/shared/utils/error-handler";

interface GlobalMutationConfig<TData, TVariables> {
    mutationFn: (variables: TVariables) => Promise<TData>;
    invalidateQueries?: string[][];
    removeQueries?: (variables: TVariables, data: TData) => string[][];
    successMessage?: string | ((data: TData, variables: TVariables) => string);

    onSuccess?: (data: TData, variables: TVariables) => void;

    // Error handling options
    errorContext?: string;
    showErrorToast?: boolean;
    setError?: (name: string, error: { message: string }) => void; // Added setError support
    onError?: (error: Problem, variables: TVariables) => void;

    options?: Omit<UseMutationOptions<TData, Problem, TVariables>, 'mutationFn' | 'onSuccess' | 'onError'>;
}

export function useGlobalMutation<TData = unknown, TVariables = unknown>({
    mutationFn,
    invalidateQueries = [],
    removeQueries,
    successMessage,
    onSuccess,
    errorContext,
    showErrorToast = true,
    setError,
    onError,
    options,
}: GlobalMutationConfig<TData, TVariables>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,

        onSuccess: (data, variables) => {
            invalidateQueries.forEach((queryKey) => {
                queryClient.invalidateQueries({
                    queryKey,
                    exact: false,
                });
            });

            if (removeQueries) {
                const keysToRemove = removeQueries(variables, data);
                keysToRemove.forEach((queryKey) => {
                    queryClient.removeQueries({ queryKey });
                });
            }

            if (successMessage) {
                const message =
                    typeof successMessage === "function"
                        ? successMessage(data, variables)
                        : successMessage;
                toast.success(message);
            }
            onSuccess?.(data, variables);
        },

        onError: (error: Problem, variables) => {
            handleApiError(error, {
                context: errorContext,
                showToast: showErrorToast,
                setError,
            });
            onError?.(error, variables);
        },

        ...options,
    });
}