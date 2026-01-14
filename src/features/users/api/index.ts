import { httpPrivateTyped } from "@/shared/api/http-typed";
import {
  userSchema,
  usersResponseSchema,
  loginHistorySchema,
  auditLogSchema,
  userStatisticsSchema,
  type UserFilterParams,
  type CreateUserInput,
  type UpdateUserInput,
  type UpdateUserStatusInput,
  type BulkUpdateStatusInput,
  type BulkDeleteInput,
} from "../model/schemas";
import { z } from "zod";


const ENDPOINTS = Object.freeze({
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`,
  USER_STATUS: (id: number) => `/users/${id}/status`,
  USER_LOGIN_HISTORY: (id: number) => `/users/${id}/login-history`,
  USER_AUDIT_LOGS: (id: number) => `/users/${id}/audit-logs`,
  USER_STATISTICS: (id: number) => `/users/${id}/statistics`,
  USER_FORCE_LOGOUT: (id: number) => `/users/${id}/force-logout`,
  BULK_UPDATE_STATUS: '/users/bulk/status',
  BULK_DELETE: '/users/bulk/delete',
} as const);


function buildQueryParams(params: UserFilterParams): URLSearchParams {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
  });

  if (params.sortBy) {
    queryParams.append("sortBy", params.sortBy);
  }

  if (params.sortDir) {
    queryParams.append("sortDir", params.sortDir);
  }

  if (params.search) {
    queryParams.append("search", params.search);
  }

  if (params.status?.length) {
    params.status.forEach((s) => queryParams.append("status", s));
  }

  if (params.roles?.length) {
    params.roles.forEach((r) => queryParams.append("roles", r));
  }

  return queryParams;
}


// Queries
export async function getUsers(params: UserFilterParams) {
  const queryParams = buildQueryParams(params);
  return await httpPrivateTyped.get(
    `${ENDPOINTS.USERS}?${queryParams.toString()}`,
    usersResponseSchema
  );
}

export async function getUserById(id: number) {
  return await httpPrivateTyped.get(
    ENDPOINTS.USER_BY_ID(id),
    userSchema
  );
}

export async function getUserLoginHistory(id: number) {
  return await httpPrivateTyped.get(
    ENDPOINTS.USER_LOGIN_HISTORY(id),
    z.array(loginHistorySchema)
  );
}

export async function getUserAuditLogs(id: number) {
  return await httpPrivateTyped.get(
    ENDPOINTS.USER_AUDIT_LOGS(id),
    z.array(auditLogSchema)
  );
}

export async function getUserStatistics(id: number) {
  return await httpPrivateTyped.get(
    ENDPOINTS.USER_STATISTICS(id),
    userStatisticsSchema
  );
}

// Mutations
export async function createUser(payload: CreateUserInput) {
  const { confirmPassword, ...apiPayload } = payload;
  return await httpPrivateTyped.post(
    ENDPOINTS.USERS,
    apiPayload,
    userSchema
  );
}

export async function updateUser(id: number, payload: UpdateUserInput) {
  return await httpPrivateTyped.put(
    ENDPOINTS.USER_BY_ID(id),
    payload,
    userSchema
  );
}

export async function updateUserStatus(id: number, payload: UpdateUserStatusInput) {
  return await httpPrivateTyped.put(
    ENDPOINTS.USER_STATUS(id),
    payload,
    userSchema
  );
}

export async function deleteUser(id: number) {
  return await httpPrivateTyped.del(
    ENDPOINTS.USER_BY_ID(id),
    z.null()
  );
}

export async function bulkUpdateStatus(payload: BulkUpdateStatusInput) {
  return await httpPrivateTyped.post(
    ENDPOINTS.BULK_UPDATE_STATUS,
    payload,
    z.array(userSchema)
  );
}

export async function bulkDelete(payload: BulkDeleteInput) {
  return await httpPrivateTyped.post(
    ENDPOINTS.BULK_DELETE,
    payload,
    z.null()
  );
}

export async function forceLogout(userId: number) {
  return await httpPrivateTyped.post(
    ENDPOINTS.USER_FORCE_LOGOUT(userId),
    {},
    z.null()
  );
}
