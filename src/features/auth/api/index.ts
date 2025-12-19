import { httpPublicTyped } from "@/shared/api/http-typed";
import { httpPrivateTyped } from "@/shared/api/http-typed";
import { authStore, useAuthStore } from "@/app/store/auth";
import { userSchema } from "@/features/users/model";
import {
    signInResponseSchema,
    signUpResponseSchema,
    logoutResponseSchema,
    type SignInInput,
    type SignUpInput,
    type UpdateProfileInput,
} from "../model";

const ENDPOINTS = Object.freeze({
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/users/me',
} as const);

export async function signIn(payload: SignInInput) {
    const response = await httpPublicTyped.post(
        ENDPOINTS.LOGIN,
        payload,
        signInResponseSchema
    );

    authStore.setAccess(response.accessToken);
    authStore.setRefresh(response.refreshToken);
    useAuthStore.getState().setUser(response.user);

    return response;
}

export async function signUp(payload: SignUpInput) {
    const response = await httpPublicTyped.post(
        ENDPOINTS.REGISTER,
        payload,
        signUpResponseSchema
    );

    return response;
}

export async function logout(payload: { token: string }) {
    const response = await httpPublicTyped.post(
        ENDPOINTS.LOGOUT,
        payload,
        logoutResponseSchema
    );

    return response;
}

export async function getMe() {
    const response = await httpPrivateTyped.get(ENDPOINTS.ME, userSchema);
    return response;
}

export async function updateProfile(payload: UpdateProfileInput) {
    const response = await httpPrivateTyped.put(
        ENDPOINTS.ME,
        payload,
        userSchema
    );

    useAuthStore.getState().setUser(response);
    return response;
}
