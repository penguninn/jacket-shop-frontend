import { httpPrivateTyped } from "@/lib/api/http-typed";
import {
  profileResSchema,
  userSchema,
  usersResponseSchema,
  type CreateUserInput,
  type UpdateUserInput,
  type UpdateUserStatusInput,
} from "@/schema/user";
import { useAuthStore } from "@/store/auth";
import z from "zod";

type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

export interface GetUsersParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: SortDirection;
  search?: string;
  status?: string[];
  roles?: string[];
}

export async function getProfile() {
  const res = await httpPrivateTyped.get("/users/me", profileResSchema);
  return res;
}

export async function updateProfile(payload: { fullName: string }) {
  const res = await httpPrivateTyped.put(
    "/users/me",
    payload,
    profileResSchema,
  );
  useAuthStore.getState().setUser(res);
  return res;
}

export async function getUsers(params: GetUsersParams) {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
  });

  const sortBy = params.sortBy ?? DEFAULT_SORT_BY;
  const sortDir = params.sortDir ?? DEFAULT_SORT_DIR;

  queryParams.append("sortBy", sortBy);
  queryParams.append("sortDir", sortDir.toUpperCase() as "ASC" | "DESC");

  if (params.search) {
    queryParams.append("search", params.search);
  }
  if (params.status?.length) {
    params.status.forEach((s) => queryParams.append("status", s));
  }
  if (params.roles?.length) {
    params.roles.forEach((r) => queryParams.append("roles", r));
  }

  const res = await httpPrivateTyped.get(
    `/users?${queryParams.toString()}`,
    usersResponseSchema,
  );
  return res;
}

export async function getUserById(id: number) {
  const res = await httpPrivateTyped.get(`/users/${id}`, userSchema);
  return res;
}

export async function createUser(payload: CreateUserInput) {
  const res = await httpPrivateTyped.post("/users", payload, userSchema);
  return res;
}

export async function updateUser(id: number, payload: UpdateUserInput) {
  const res = await httpPrivateTyped.put(`/users/${id}`, payload, userSchema);
  return res;
}

export async function deleteUser(id: number) {
  await httpPrivateTyped.del(`/users/${id}`, z.null());
}

export async function updateStatus(id: number, payload: UpdateUserStatusInput) {
  await httpPrivateTyped.put(`/users/${id}/status`, payload, userSchema);
}

export async function bulkUpdateStatus(ids: number[], status: string) {
  await httpPrivateTyped.post("/users/bulk/status", { ids, status }, z.null());
}

export async function bulkDelete(ids: number[]) {
  await httpPrivateTyped.post("/users/bulk/delete", { ids }, z.null());
}

export async function getUserLoginHistory(id: number) {
  const loginHistorySchema = z.array(
    z.object({
      id: z.number(),
      ipAddress: z.string(),
      device: z.string(),
      location: z.string().nullable(),
      loginAt: z.string(),
    }),
  );
  const res = await httpPrivateTyped.get(
    `/users/${id}/login-history`,
    loginHistorySchema,
  );
  return res;
}

export async function getUserAuditLogs(id: number) {
  const auditLogSchema = z.array(
    z.object({
      id: z.number(),
      action: z.string(),
      description: z.string(),
      createdAt: z.string(),
    }),
  );
  const res = await httpPrivateTyped.get(
    `/users/${id}/audit-logs`,
    auditLogSchema,
  );
  return res;
}

export async function getUserStatistics(id: number) {
  const statsSchema = z.object({
    ordersCount: z.number(),
    revenue: z.number(),
    avgHandlingTime: z.number(),
    customerRating: z.number().nullable(),
  });
  const res = await httpPrivateTyped.get(
    `/users/${id}/statistics`,
    statsSchema,
  );
  return res;
}

export async function forceLogout(userId: number) {
  await httpPrivateTyped.post(`/users/${userId}/force-logout`, {}, z.null());
}
