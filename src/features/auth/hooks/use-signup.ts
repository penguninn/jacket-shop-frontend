import { signup } from "../api/register";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSignUpMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: signup,
        onSuccess: () => {
            qc.clear();
        },
    });
}
