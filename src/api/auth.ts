import { z } from "zod";
import { httpPublicTyped } from "@/lib/api/http-typed";
import { authStore, useAuthStore } from "@/store/auth";

export const SignInResSchema = z.object({
  accessToken: z.string().min(10),
  refreshToken: z.string().min(10),
  user: z.object({
    id: z.number(),
    fullName: z.string(),
    roles: z.array(z.string()),
  }),
});
export async function signin(payload: { username: string; password: string }) {
  const res = await httpPublicTyped.post(
    "/auth/login",
    payload,
    SignInResSchema,
  );
  authStore.setAccess(res.accessToken);
  authStore.setRefresh(res.refreshToken);
  useAuthStore.getState().setUser({
    id: res.user.id,
    fullName: res.user.fullName,
    role: res.user.roles[0],
  });
  return res;
}

export const SignUpResSchema = z.null().optional();
export async function signup(payload: {
  username: string;
  fullName: string;
  phoneNumber: string;
  password: string;
}) {
  const res = await httpPublicTyped.post(
    "/auth/register",
    payload,
    SignUpResSchema,
  );
  return res;
}

export const LogoutResSchema = z.null().optional();
export async function logout(payload: { token: string }) {
  const res = await httpPublicTyped.post(
    "/auth/logout",
    payload,
    LogoutResSchema,
  );
  return res;
}
