import { z } from "zod";
import { httpPublicTyped, httpPrivateTyped } from "@/shared/api/http-typed";
import {
    provinceSchema,
    districtSchema,
    wardSchema,
    addressResponseSchema,
    type AddressRequest,
    type AddressResponse,
    type Province,
    type District,
    type Ward
} from "../model";

const URL_PREFIX = "/address";
const CRUD_PREFIX = "/user-addresses";

export const addressApi = {
    // Location Data
    getProvinces: async () => {
        return httpPublicTyped.get<Province[]>(
            `${URL_PREFIX}/provinces`,
            z.array(provinceSchema)
        );
    },

    getDistricts: async (provinceId: number) => {
        return httpPublicTyped.get<District[]>(
            `${URL_PREFIX}/districts`,
            z.array(districtSchema),
            { params: { provinceId } }
        );
    },

    getWards: async (districtId: number) => {
        return httpPublicTyped.get<Ward[]>(
            `${URL_PREFIX}/wards`,
            z.array(wardSchema),
            { params: { districtsId: districtId } }
        );
    },

    // User Addresses CRUD
    getAll: async () => {
        return httpPrivateTyped.get<AddressResponse[]>(
            `${CRUD_PREFIX}`,
            z.array(addressResponseSchema)
        );
    },

    create: async (data: AddressRequest) => {
        return httpPrivateTyped.post<AddressResponse>(
            `${CRUD_PREFIX}`,
            data,
            addressResponseSchema
        );
    },

    update: async (id: number, data: AddressRequest) => {
        return httpPrivateTyped.put<AddressResponse>(
            `${CRUD_PREFIX}/${id}`,
            data,
            addressResponseSchema
        );
    },

    delete: async (id: number) => {
        return httpPrivateTyped.del<void>(
            `${CRUD_PREFIX}/${id}`,
            z.void().or(z.unknown()) as any
        );
    },

    setDefault: async (id: number) => {
        return httpPrivateTyped.put<void>(
            `${CRUD_PREFIX}/${id}/default`,
            {},
            z.void().or(z.unknown()) as any
        );
    }
};
