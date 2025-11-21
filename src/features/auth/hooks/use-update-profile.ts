import { updateMe } from "../api/me";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProfile() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: updateMe,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["me"] });
        },
    });
}
