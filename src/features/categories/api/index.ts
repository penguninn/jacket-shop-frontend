import { httpPrivateTyped } from "@/shared/api/http-typed";
import {
  categoriesResponseSchema,
  categorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type UpdateCategoryStatusInput,
} from "../model/schemas";
import z from "zod";

type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

export interface GetCategoriesParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: SortDirection;
  search?: string;
  status?: string[];
}

export async function getCategories(params: GetCategoriesParams) {
  const queryParams = new URLSearchParams({
    page: params.page.toString(),
    size: params.size.toString(),
  });

  const sortBy = params.sortBy ?? DEFAULT_SORT_BY;
  const sortDir = params.sortDir ?? DEFAULT_SORT_DIR;

  queryParams.append("sortBy", sortBy);
  queryParams.append("sortDir", sortDir.toUpperCase() as "ASC" | "DESC");

  if (params.search) queryParams.append("search", params.search);
  if (params.status?.length) params.status.forEach((s) => queryParams.append("status", s));

  const res = await httpPrivateTyped.get(`/categories?${queryParams.toString()}`, categoriesResponseSchema);
  return res;
}

export async function getCategoryById(id: number) {
  const res = await httpPrivateTyped.get(`/categories/${id}`, categorySchema);
  return res;
}

export async function createCategory(payload: CreateCategoryInput) {
  const res = await httpPrivateTyped.post("/categories", payload, categorySchema);
  return res;
}

export async function updateCategory(id: number, payload: UpdateCategoryInput) {
  const res = await httpPrivateTyped.put(`/categories/${id}`, payload, categorySchema);
  return res;
}

export async function deleteCategory(id: number) {
  await httpPrivateTyped.del(`/categories/${id}`, z.null());
}

export async function updateStatus(id: number, payload: UpdateCategoryStatusInput) {
  await httpPrivateTyped.put(`/categories/${id}/status`, payload, categorySchema);
}

export async function bulkUpdateStatus(ids: number[], status: string) {
  await httpPrivateTyped.post("/categories/bulk/status", { ids, status }, z.null());
}

export async function bulkDelete(ids: number[]) {
  await httpPrivateTyped.post("/categories/bulk/delete", { ids }, z.null());
}
