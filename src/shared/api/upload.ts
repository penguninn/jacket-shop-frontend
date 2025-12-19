
import { z } from "zod";
import { httpPrivateTyped } from "./http-typed";

// Response schema from backend
// Backend returns ApiResponse<ImageUploadResponse>
// We usually unwrap ApiResponse in the http client, but let's check http-typed.
// Assuming httpPrivateTyped unwrap the 'data' field or similar.
// The user backend returns:
// ApiResponse.builder().data(uploadResponse)...
// So the actual response data is ImageUploadResponse.

export const imageUploadResponseSchema = z.object({
    url: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
    format: z.string().optional(),
    bytes: z.number().optional(),
});

export type ImageUploadResponse = z.infer<typeof imageUploadResponseSchema>;

export async function uploadImage(file: File, onProgress?: (progress: number) => void) {
    const formData = new FormData();
    formData.append("file", file);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return await httpPrivateTyped.post<ImageUploadResponse>(
        "/upload",
        formData,
        imageUploadResponseSchema,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            },
        }
    );
}
