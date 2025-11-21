import { httpPublicTyped } from "@/shared/api/http-typed";
import { authStore, useAuthStore } from "@/app/store/auth";
import { signInResSchema } from "../model/schemas";
import type { SignInInput } from "../model/types";

export async function signin(payload: SignInInput) {
    const res = await httpPublicTyped.post(
        "/auth/login",
        payload,
        signInResSchema,
    );
    authStore.setAccess(res.accessToken);
    authStore.setRefresh(res.refreshToken);
    useAuthStore.getState().setUser(res.user);
    return res;
}
