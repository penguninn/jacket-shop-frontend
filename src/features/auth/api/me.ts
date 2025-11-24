import { httpPrivateTyped } from "@/shared/api/http-typed";
import { userSchema } from "@/features/users/model";
import { useAuthStore } from "@/app/store/auth";
import type { UpdateProfileInput } from "../model/types";

export async function getMe() {
    const res = await httpPrivateTyped.get("/users/me", userSchema);
    return res;
}

export async function updateMe(payload: UpdateProfileInput) {
    const res = await httpPrivateTyped.put(
        "/users/me",
        payload,
        userSchema,
    );
    useAuthStore.getState().setUser(res);
    return res;
}
