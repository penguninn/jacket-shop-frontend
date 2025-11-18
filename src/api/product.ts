import { httpPrivateTyped } from "@/lib/api/http-typed";
import {
  productSchema,
  productsResponseSchema,
  type CreateProductInput,
  type UpdateProductInput,
  type UpdateProductStatusInput,
} from "@/schema/product";
import z from "zod";

type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

export interface GetProductsParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: SortDirection;
  search?: string;
  status?: string[];
  brandIds?: number[];
  categoryIds?: number[];
}

export async function getProducts(params: GetProductsParams) {
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
  if (params.brandIds?.length) {
    params.brandIds.forEach((id) =>
      queryParams.append("brandIds", id.toString())
    );
  }
  if (params.categoryIds?.length) {
    params.categoryIds.forEach((id) =>
      queryParams.append("categoryIds", id.toString())
    );
  }

  const res = await httpPrivateTyped.get(
    `/products?${queryParams.toString()}`,
    productsResponseSchema
  );
  return res;
}

export async function getProductById(id: number) {
  const res = await httpPrivateTyped.get(`/products/${id}`, productSchema);
  return res;
}

export async function createProduct(payload: CreateProductInput) {
  const res = await httpPrivateTyped.post("/products", payload, productSchema);
  return res;
}

export async function updateProduct(id: number, payload: UpdateProductInput) {
  const res = await httpPrivateTyped.put(
    `/products/${id}`,
    payload,
    productSchema
  );
  return res;
}

export async function deleteProduct(id: number) {
  await httpPrivateTyped.del(`/products/${id}`, z.null());
}

export async function updateProductStatus(
  id: number,
  payload: UpdateProductStatusInput
) {
  await httpPrivateTyped.put(`/products/${id}/status`, payload, productSchema);
}

export async function bulkUpdateProductStatus(ids: number[], status: string) {
  await httpPrivateTyped.post(
    "/products/bulk/status",
    { ids, status },
    z.null()
  );
}

export async function bulkDeleteProducts(ids: number[]) {
  await httpPrivateTyped.post("/products/bulk/delete", { ids }, z.null());
}
