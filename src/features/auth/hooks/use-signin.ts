import { signin } from "../api/login";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSignInMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: signin,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["me"] });
        },
    });
}
