import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ERROR_CODES } from "@/shared/api/error";
import { toast } from "sonner";

export function SessionExpiredListener() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = () => {
            if (window.location.pathname.startsWith("/signin")) return;

            toast.error(
                import.meta.env.DEV
                    ? "Session expired"
                    : "Session expired. Please login again."
            );
            navigate("/signin", { replace: true });
        };

        window.addEventListener(ERROR_CODES.AUTH_SESSION_EXPIRED, handleLogout);

        return () => {
            window.removeEventListener(ERROR_CODES.AUTH_SESSION_EXPIRED, handleLogout);
        };
    }, [navigate]);

    return null;
}
