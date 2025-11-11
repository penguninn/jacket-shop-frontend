import { httpPublicTyped } from "@/lib/api/http-typed";
import { authStore, useAuthStore } from "@/store/auth";
import {
  logoutResSchema,
  signInResSchema,
  signUpResSchema,
} from "@/schema/auth";

export async function signin(payload: { username: string; password: string }) {
  const res = await httpPublicTyped.post(
    "/auth/login",
    payload,
    signInResSchema,
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

export async function signup(payload: {
  username: string;
  fullName: string;
  phoneNumber: string;
  password: string;
}) {
  const res = await httpPublicTyped.post(
    "/auth/register",
    payload,
    signUpResSchema,
  );
  return res;
}

export async function logout(payload: { token: string }) {
  const res = await httpPublicTyped.post(
    "/auth/logout",
    payload,
    logoutResSchema,
  );
  return res;
}
