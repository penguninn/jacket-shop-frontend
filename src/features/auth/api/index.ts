import { httpPublicTyped } from "@/shared/api/http-typed";
import { httpPrivateTyped } from "@/shared/api/http-typed";
import { authStore, useAuthStore } from "@/app/store/auth";
import { userSchema } from "@/features/users/model";
import { z } from "zod";
import {
    signInResponseSchema,
    signUpResponseSchema,
    logoutResponseSchema,
    type SignInInput,
    type SignUpInput,
    type UpdateProfileInput,
    type ForgotPasswordInput,
    type UpdatePasswordInput,
    type ResetPasswordInput,
} from "../model";

const ENDPOINTS = Object.freeze({
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_RESET_TOKEN: '/auth/verify-reset-token',
    RESET_PASSWORD: '/auth/reset-password',
    UPDATE_PASSWORD: '/auth/update-password',
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

export async function forgotPassword(payload: ForgotPasswordInput) {
    const response = await httpPublicTyped.post(
        ENDPOINTS.FORGOT_PASSWORD,
        payload,
        z.any()
    );
    return response;
}

export async function verifyResetToken(token: string) {
    const response = await httpPublicTyped.get(
        `${ENDPOINTS.VERIFY_RESET_TOKEN}?token=${token}`,
        z.boolean()
    );
    return response;
}

export async function resetPassword(payload: ResetPasswordInput) {
    const { confirmPassword, ...apiPayload } = payload;
    const response = await httpPublicTyped.post(
        ENDPOINTS.RESET_PASSWORD,
        apiPayload,
        z.any()
    );
    return response;
}

export async function updatePassword(payload: UpdatePasswordInput) {
    const { confirmPassword, ...apiPayload } = payload;
    const response = await httpPrivateTyped.post(
        ENDPOINTS.UPDATE_PASSWORD,
        apiPayload,
        z.null()
    );
    return response;
}
