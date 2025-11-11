import { httpPrivateTyped } from "@/lib/api/http-typed";
import { profileResSchema } from "@/schema/user";

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
  return res;
}
