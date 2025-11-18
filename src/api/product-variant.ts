import { httpPrivateTyped } from "@/lib/api/http-typed";
import {
  productVariantSchema,
  productVariantsResponseSchema,
  type CreateProductVariantInput,
  type UpdateProductVariantInput,
} from "@/schema/product-variant";
import z from "zod";

type SortDirection = "asc" | "desc";
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIR: SortDirection = "desc";

export interface GetProductVariantsParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: SortDirection;
  search?: string;
  status?: string[];
  product?: number;
  sizeId?: number;
  colorId?: number;
}

export async function getProductVariants(params: GetProductVariantsParams) {
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
  if (params.product) {
    queryParams.append("product", params.product.toString());
  }
  if (params.sizeId) {
    queryParams.append("size", params.sizeId.toString());
  }
  if (params.colorId) {
    queryParams.append("color", params.colorId.toString());
  }

  const res = await httpPrivateTyped.get(
    `/product-variants?${queryParams.toString()}`,
    productVariantsResponseSchema
  );
  return res;
}

export async function getProductVariantById(id: number) {
  const res = await httpPrivateTyped.get(
    `/product-variants/${id}`,
    productVariantSchema
  );
  return res;
}

export async function createProductVariant(payload: CreateProductVariantInput) {
  const res = await httpPrivateTyped.post(
    "/product-variants",
    payload,
    productVariantSchema
  );
  return res;
}

export async function updateProductVariant(
  id: number,
  payload: UpdateProductVariantInput
) {
  const res = await httpPrivateTyped.put(
    `/product-variants/${id}`,
    payload,
    productVariantSchema
  );
  return res;
}

export async function deleteProductVariant(id: number) {
  await httpPrivateTyped.del(`/product-variants/${id}`, z.null());
}

export async function updateProductVariantStatus(id: number, status: string) {
  await httpPrivateTyped.put(
    `/product-variants/${id}/status`,
    { status },
    productVariantSchema
  );
}

export async function bulkUpdateProductVariantStatus(
  ids: number[],
  status: string
) {
  await httpPrivateTyped.post(
    "/product-variants/bulk/status",
    { ids, status },
    z.null()
  );
}

export async function bulkDeleteProductVariants(ids: number[]) {
  await httpPrivateTyped.post(
    "/product-variants/bulk/delete",
    { ids },
    z.null()
  );
}
