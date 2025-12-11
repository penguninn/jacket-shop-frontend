import { toast } from "sonner";
import { isProblem, hasValidationErrors, ERROR_CODES } from "@/shared/api/error";

interface HandleErrorOptions {
    context?: string;
    setError?: (name: string, error: { message: string }) => void;
    showToast?: boolean;
    customMessage?: string;
}

export function handleApiError(error: unknown, options: HandleErrorOptions = {}) {
    const {
        context,
        setError,
        showToast = !setError,
        customMessage,
    } = options;

    if (!isProblem(error)) {
        if (showToast) {
            toast.error(customMessage || "An unexpected error occurred");
        }
        console.error("Non-Problem error:", error);
        return;
    }

    if (error.errorCode === ERROR_CODES.SCHEMA_VALIDATION_ERROR) {
        if (showToast) {
            toast.error(
                import.meta.env.DEV
                    ? "Schema validation failed. Check console for details."
                    : "Server data error. Please contact support.",
                {
                    duration: 6000,
                    action: {
                        label: "Refresh",
                        onClick: () => window.location.reload(),
                    },
                }
            );
        }
        return;
    }

    if (hasValidationErrors(error) && setError) {
        for (const [field, messages] of Object.entries(error.errors)) {
            const message = Array.isArray(messages) ? messages[0] : messages;
            if (message) {
                setError(field as any, { message: String(message) });
            }
        }
        return;
    }

    if (setError && (error.status === 409 || error.errorCode === ERROR_CODES.AUTH_INVALID_CREDENTIALS)) {
        const message = error.detail || "An error occurred";
        setError("root", { message });
        return;
    }

    if (showToast) {
        const prefix = context ? `[${context}] ` : "";
        const message = customMessage || error.detail || "An error occurred";

        switch (error.status) {
            case 400:
                toast.error(`${prefix}${message}`);
                break;

            case 401:
                break;

            case 403:
                toast.warning("You don't have permission to perform this action");
                break;

            case 404:
                toast.info(`${prefix}${message}`);
                break;

            case 409:
                toast.error(`${prefix}${message}`);
                break;

            case 422:
                toast.error("Validation failed. Please check your input.");
                break;

            case 429:
                toast.warning("Too many requests. Please try again later.");
                break;

            case 502:
            case 500:
            case 503:
                toast.error("Server error. Please try again later.", {
                    description: error.requestId ? `Request ID: ${error.requestId}` : undefined,
                });
                break;

            default:
                toast.error(`${prefix}${message}`);
        }
    }

    console.error("API Error:", {
        context,
        status: error.status,
        errorCode: error.errorCode,
        detail: error.detail,
        errors: error.errors,
        requestId: error.requestId,
    });
}