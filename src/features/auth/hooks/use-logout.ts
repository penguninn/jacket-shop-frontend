import { logout } from "../api/logout";
import { authStore, useAuthStore } from "@/app/store/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogoutMutation() {
    const qc = useQueryClient();
    const setUser = useAuthStore((s) => s.setUser);
    return useMutation({
        mutationFn: logout,
        onSettled: () => {
            authStore.clearAll();
            setUser(undefined);
            qc.clear();
            window.location.href = "/signin";
        },
    });
}
