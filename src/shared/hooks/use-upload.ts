
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadImage, type ImageUploadResponse } from "@/shared/api/upload";
import { toast } from "sonner";
import { handleApiError } from "@/shared/utils/error-handler";
import type { Problem } from "@/shared/api/error";

interface UseUploadOptions {
    onSuccess?: (data: ImageUploadResponse) => void;
    onError?: (error: Problem) => void;
}

export function useUpload(options?: UseUploadOptions) {
    const [progress, setProgress] = useState(0);

    const mutation = useMutation({
        mutationFn: async (file: File) => {
            setProgress(0);
            return uploadImage(file, (p) => setProgress(p));
        },
        onSuccess: (data) => {
            setProgress(100);
            toast.success("Image uploaded successfully");
            options?.onSuccess?.(data);
        },
        onError: (error: Problem) => {
            setProgress(0);
            handleApiError(error, {
                context: "Image upload",
                showToast: true,
            });
            options?.onError?.(error);
        },
    });

    return {
        upload: mutation.mutate,
        uploadAsync: mutation.mutateAsync,
        isUploading: mutation.isPending,
        progress,
        error: mutation.error,
        data: mutation.data,
        reset: mutation.reset,
    };
}
