import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressApi } from "../api";
import type { AddressRequest } from "../model";
import { toast } from "sonner";

const KEYS = {
    PROVINCES: ["provinces"],
    DISTRICTS: (provinceId: number) => ["districts", provinceId],
    WARDS: (districtId: number) => ["wards", districtId],
    ADDRESSES: ["addresses"],
};

export const useProvinces = () => {
    return useQuery({
        queryKey: KEYS.PROVINCES,
        queryFn: addressApi.getProvinces,
        staleTime: Infinity, // Location data rarely changes
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
