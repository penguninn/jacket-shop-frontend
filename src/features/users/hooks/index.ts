import { useQuery } from "@tanstack/react-query";
import { useGlobalMutation } from "@/shared/hooks/use-global-mutation";
import {
  getUsers,
  getUserById,
  getUserLoginHistory,
  getUserAuditLogs,
  getUserStatistics,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  bulkUpdateStatus,
  bulkDelete,
  forceLogout,
} from "../api";
import type {
  User,
  UserFilterParams,
  CreateUserInput,
  UpdateUserInput,
  UpdateUserStatusInput,
  BulkUpdateStatusInput,
  BulkDeleteInput,
} from "../model/schemas";
import type { BaseMutationOptions } from "@/shared/api/types";

// ============================================
// QUERY KEY FACTORY
// ============================================

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserFilterParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  loginHistory: (id: number) => [...userKeys.detail(id), 'login-history'] as const,
  auditLogs: (id: number) => [...userKeys.detail(id), 'audit-logs'] as const,
  statistics: (id: number) => [...userKeys.detail(id), 'statistics'] as const,
} as const;

// ============================================
// QUERIES
// ============================================

export function useUsers(params: UserFilterParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
  });
}

export function useUserDetail(id: number, enabled = true) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: enabled && !!id,
  });
}

export function useUserLoginHistory(id: number, enabled = true) {
  return useQuery({
    queryKey: userKeys.loginHistory(id),
    queryFn: () => getUserLoginHistory(id),
    enabled: enabled && !!id,
  });
}

export function useUserAuditLogs(id: number, enabled = true) {
  return useQuery({
    queryKey: userKeys.auditLogs(id),
    queryFn: () => getUserAuditLogs(id),
    enabled: enabled && !!id,
  });
}

export function useUserStatistics(id: number, enabled = true) {
  return useQuery({
    queryKey: userKeys.statistics(id),
    queryFn: () => getUserStatistics(id),
    enabled: enabled && !!id,
  });
}

// ============================================
// MUTATIONS
// ============================================

export function useCreateUser(options?: BaseMutationOptions) {
  return useGlobalMutation<User, CreateUserInput>({
    mutationFn: createUser,
    invalidateQueries: [
      [...userKeys.lists()] as string[],
    ],
    successMessage: "User created successfully",
    errorContext: "Create User",
    setError: options?.setError,
  });
}

export function useUpdateUser(options?: BaseMutationOptions) {
  return useGlobalMutation<User, { id: number; data: UpdateUserInput }>({
    mutationFn: ({ id, data }) => updateUser(id, data),
    invalidateQueries: [
      [...userKeys.lists()] as string[],
      [...userKeys.details()] as string[],
    ],
    removeQueries: ({ id }) => [
      [...userKeys.detail(id)] as string[],
    ],
    successMessage: "User updated successfully",
    errorContext: "Update User",
    setError: options?.setError,
  });
}

export function useUpdateUserStatus(options?: BaseMutationOptions) {
  return useGlobalMutation<User, { id: number; data: UpdateUserStatusInput }>({
    mutationFn: ({ id, data }) => updateUserStatus(id, data),
    invalidateQueries: [
      [...userKeys.lists()] as string[],
      [...userKeys.details()] as string[],
    ],
    successMessage: (_, { data }) => `User status changed to ${data.status}`,
    errorContext: "Update User Status",
    setError: options?.setError,
  });
}

export function useDeleteUser(options?: BaseMutationOptions) {
  return useGlobalMutation<null, number>({
    mutationFn: deleteUser,
    invalidateQueries: [
      [...userKeys.lists()] as string[],
    ],
    removeQueries: (id) => [
      [...userKeys.detail(id)] as string[],
    ],
    successMessage: "User deleted successfully",
    errorContext: "Delete User",
    setError: options?.setError,
  });
}

export function useBulkUpdateStatus(options?: BaseMutationOptions) {
  return useGlobalMutation<User[], BulkUpdateStatusInput>({
    mutationFn: bulkUpdateStatus,
    invalidateQueries: [
      [...userKeys.lists()] as string[],
      [...userKeys.details()] as string[],
    ],
    successMessage: (_, { ids }) => `${ids.length} user(s) updated successfully`,
    errorContext: "Bulk Update Status",
    setError: options?.setError,
  });
}

export function useBulkDelete(options?: BaseMutationOptions) {
  return useGlobalMutation<null, BulkDeleteInput>({
    mutationFn: bulkDelete,
    invalidateQueries: [
      [...userKeys.lists()] as string[],
    ],
    successMessage: (_, { ids }) => `${ids.length} user(s) deleted successfully`,
    errorContext: "Bulk Delete",
    setError: options?.setError,
  });
}

export function useForceLogout(options?: BaseMutationOptions) {
  return useGlobalMutation<null, number>({
    mutationFn: forceLogout,
    successMessage: "User logged out successfully",
    errorContext: "Force Logout",
    setError: options?.setError,
  });
}
