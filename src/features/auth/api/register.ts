import { httpPublicTyped } from "@/shared/api/http-typed";
import { signUpResSchema } from "../model/schemas";
import type { SignUpInput } from "../model/types";

export async function signup(payload: SignUpInput) {
    const res = await httpPublicTyped.post(
        "/auth/register",
        payload,
        signUpResSchema,
    );
    return res;
}
