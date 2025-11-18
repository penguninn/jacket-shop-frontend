import {
  bulkDelete,
  bulkUpdateStatus,
  createUser,
  deleteUser,
  getProfile,
  getUserAuditLogs,
  getUserById,
  getUserLoginHistory,
  getUsers,
  getUserStatistics,
  updateProfile,
  updateStatus,
  updateUser,
  type GetUsersParams,
} from "@/api/user";
import type { UpdateUserStatusInput } from "@/schema/user";
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

export function useUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {},
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserStatusInput }) =>
      updateUser(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {},
  });
}

export function useUpdateUserStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserStatusInput }) =>
      updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {},
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {},
  });
}

export function useBulkUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      bulkUpdateStatus(ids, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useBulkDelete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bulkDelete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUserDetail(id: number) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}

export function useUserLoginHistory(id: number) {
  return useQuery({
    queryKey: ["user", id, "login-history"],
    queryFn: () => getUserLoginHistory(id),
    enabled: !!id,
  });
}

export function useUserAuditLogs(id: number) {
  return useQuery({
    queryKey: ["user", id, "audit-logs"],
    queryFn: () => getUserAuditLogs(id),
    enabled: !!id,
  });
}

export function useUserStatistics(id: number, hasRole: boolean) {
  return useQuery({
    queryKey: ["user", id, "statistics"],
    queryFn: () => getUserStatistics(id),
    enabled: !!id && hasRole,
  });
}
