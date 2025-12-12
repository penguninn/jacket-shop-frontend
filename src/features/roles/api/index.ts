import { httpPrivateTyped } from "@/shared/api/http-typed";
import { rolesResponseSchema, type RolesResponse } from "../model/schemas";

export async function getRoles() {
  const res = await httpPrivateTyped.get<RolesResponse>("/roles", rolesResponseSchema);
  return res;
}
