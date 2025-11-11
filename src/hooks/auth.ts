import { logout, signin, signup } from "@/api/auth";
import { authStore, useAuthStore } from "@/store/auth";
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

export function useSignUpMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: signup,
    onSuccess: () => {
      qc.clear();
    },
  });
}

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
