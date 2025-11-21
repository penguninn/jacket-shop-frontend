import { httpPublicTyped } from "@/shared/api/http-typed";
import { logoutResSchema } from "../model/schemas";

export async function logout(payload: { token: string }) {
    const res = await httpPublicTyped.post(
        "/auth/logout",
        payload,
        logoutResSchema,
    );
    return res;
}
