import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressApi } from "../api";
import type { AddressRequest } from "../model";
import { toast } from "sonner";

const KEYS = {
    PROVINCES: ["provinces"],
    DISTRICTS: (provinceId: number) => ["districts", provinceId],
    WARDS: (districtId: number) => ["wards", districtId],
    ADDRESSES: ["addresses"],
    USER_ADDRESSES: (userId: number) => ["addresses", "user", userId],
};

export const useProvinces = () => {
    return useQuery({
        queryKey: KEYS.PROVINCES,
        queryFn: addressApi.getProvinces,
        staleTime: Infinity,
    });
};

export const useDistricts = (provinceId: number | null) => {
    return useQuery({
        queryKey: KEYS.DISTRICTS(provinceId!),
        queryFn: () => addressApi.getDistricts(provinceId!),
        enabled: !!provinceId,
        staleTime: Infinity,
    });
};

export const useWards = (districtId: number | null) => {
    return useQuery({
        queryKey: KEYS.WARDS(districtId!),
        queryFn: () => addressApi.getWards(districtId!),
        enabled: !!districtId,
        staleTime: Infinity,
    });
};

export const useAddresses = () => {
    return useQuery({
        queryKey: KEYS.ADDRESSES,
        queryFn: addressApi.getAll,
    });
};

export const useUserAddresses = (userId: number | null) => {
    return useQuery({
        queryKey: KEYS.USER_ADDRESSES(userId!),
        queryFn: () => addressApi.getByUserId(userId!),
        enabled: !!userId,
    });
};

export const useCreateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addressApi.create,
        onSuccess: () => {
            toast.success("Address created successfully");
            queryClient.invalidateQueries({ queryKey: KEYS.ADDRESSES });
        },
        onError: () => {
            toast.error("Failed to create address");
        },
    });
};

export const useCreateUserAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, data }: { userId: number; data: AddressRequest }) =>
            addressApi.createForUser(userId, data),
        onSuccess: (_, { userId }) => {
            toast.success("Address created for customer successfully");
            queryClient.invalidateQueries({ queryKey: KEYS.USER_ADDRESSES(userId) });
        },
        onError: () => {
            toast.error("Failed to create customer address");
        },
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: AddressRequest }) =>
            addressApi.update(id, data),
        onSuccess: () => {
            toast.success("Address updated successfully");
            queryClient.invalidateQueries({ queryKey: KEYS.ADDRESSES });
        },
        onError: () => {
            toast.error("Failed to update address");
        },
    });
};

export const useUpdateUserAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, addressId, data }: { userId: number; addressId: number; data: AddressRequest }) =>
            addressApi.updateForUser(userId, addressId, data),
        onSuccess: (_, { userId }) => {
            toast.success("Customer address updated successfully");
            queryClient.invalidateQueries({ queryKey: KEYS.USER_ADDRESSES(userId) });
        },
        onError: () => {
            toast.error("Failed to update customer address");
        },
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addressApi.delete,
        onSuccess: () => {
            toast.success("Address deleted successfully");
            queryClient.invalidateQueries({ queryKey: KEYS.ADDRESSES });
        },
        onError: () => {
            toast.error("Failed to delete address");
        },
    });
};

export const useSetDefaultAddress = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addressApi.setDefault,
        onSuccess: () => {
            toast.success("Default address updated");
            queryClient.invalidateQueries({ queryKey: KEYS.ADDRESSES });
        },
        onError: () => {
            toast.error("Failed to set default address");
        },
    });
};
