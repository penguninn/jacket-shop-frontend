// src/api/attribute.ts
import { z } from "zod";
import { httpPrivateTyped, httpPublicTyped } from "@/shared/api/http-typed";
import { colorSchema, sizeSchema, materialSchema } from "@/features/attributes/model";
import {
  colorsResponseSchema,
  sizesResponseSchema,
  materialsResponseSchema,
  importResultSchema,
  type CreateColorInput,
  type UpdateColorInput,
  type CreateSizeInput,
  type UpdateSizeInput,
  type CreateMaterialInput,
  type UpdateMaterialInput,
} from "../model/schemas";
import { axiosPrivate } from "@/shared/api/axios.private";

// -----------------
// Common
// -----------------
type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

// -----------------
// Color API
// -----------------
export interface GetColorsParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: SortDirection;
  search?: string;
  status?: string[];
}

export async function getColors(params: GetColorsParams) {
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

  return httpPrivateTyped.get(`/colors?${queryParams.toString()}`, colorsResponseSchema);
}


export async function getPublicColors(params: GetColorsParams) {
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

  return httpPublicTyped.get(`/colors?${queryParams.toString()}`, colorsResponseSchema);
}

export async function createColor(payload: CreateColorInput) {
  return httpPrivateTyped.post("/colors", payload, colorSchema);
}

export async function updateColor(id: number, payload: UpdateColorInput) {
  return httpPrivateTyped.put(`/colors/${id}`, payload, colorSchema);
}

export async function deleteColor(id: number) {
  return httpPrivateTyped.del(`/colors/${id}`, z.null());
}

export async function bulkDeleteColors(ids: number[]) {
  await httpPrivateTyped.post("/colors/bulk/delete", { ids }, z.null());
}

export async function bulkUpdateStatusColors(ids: number[], status: string) {
  await httpPrivateTyped.post("/colors/bulk/status", { ids, status }, z.array(colorSchema));
}

// Import colors from Excel file
export async function importColors(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosPrivate.post("/colors/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return importResultSchema.parse(response.data.data);
}

// -----------------
// Size API
// -----------------
export interface GetSizesParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: SortDirection;
  search?: string;
  status?: string[];
}

export async function getSizes(params: GetSizesParams) {
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

  return httpPrivateTyped.get(`/sizes?${queryParams.toString()}`, sizesResponseSchema);
}


export async function getPublicSizes(params: GetSizesParams) {
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

  return httpPublicTyped.get(`/sizes?${queryParams.toString()}`, sizesResponseSchema);
}

export async function createSize(payload: CreateSizeInput) {
  return httpPrivateTyped.post("/sizes", payload, sizeSchema);
}

export async function updateSize(id: number, payload: UpdateSizeInput) {
  return httpPrivateTyped.put(`/sizes/${id}`, payload, sizeSchema);
}

export async function deleteSize(id: number) {
  return httpPrivateTyped.del(`/sizes/${id}`, z.null());
}

export async function bulkDeleteSizes(ids: number[]) {
  await httpPrivateTyped.post("/sizes/bulk/delete", { ids }, z.null());
}

export async function bulkUpdateStatusSizes(ids: number[], status: string) {
  await httpPrivateTyped.post("/sizes/bulk/status", { ids, status }, z.array(sizeSchema));
}

// Import sizes from Excel file
export async function importSizes(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosPrivate.post("/sizes/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return importResultSchema.parse(response.data.data);
}

// -----------------
// Material API
// -----------------
export interface GetMaterialsParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: SortDirection;
  search?: string;
  status?: string[];
}

export async function getMaterials(params: GetMaterialsParams) {
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

  return httpPrivateTyped.get(`/materials?${queryParams.toString()}`, materialsResponseSchema);
}

export async function getPublicMaterials(params: GetMaterialsParams) {
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

  return httpPublicTyped.get(`/materials?${queryParams.toString()}`, materialsResponseSchema);
}

export async function createMaterial(payload: CreateMaterialInput) {
  return httpPrivateTyped.post("/materials", payload, materialSchema);
}

export async function updateMaterial(id: number, payload: UpdateMaterialInput) {
  return httpPrivateTyped.put(`/materials/${id}`, payload, materialSchema);
}

export async function deleteMaterial(id: number) {
  return httpPrivateTyped.del(`/materials/${id}`, z.null());
}

export async function bulkDeleteMaterials(ids: number[]) {
  await httpPrivateTyped.post("/materials/bulk/delete", { ids }, z.null());
}

export async function bulkUpdateStatusMaterials(ids: number[], status: string) {
  await httpPrivateTyped.post("/materials/bulk/status", { ids, status }, z.array(materialSchema));
}

// Import materials from Excel file
export async function importMaterials(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosPrivate.post("/materials/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return importResultSchema.parse(response.data.data);
}
