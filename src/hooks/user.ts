import { getProfile, updateProfile } from "@/api/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProfile() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
