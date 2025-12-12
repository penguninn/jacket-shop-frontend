import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isProblem, ERROR_CODES } from "./error";

const QUERY_CONFIG = {
  STALE_TIME: 30 * 1000,
  REFETCH_ON_WINDOW_FOCUS: false,
  REFETCH_ON_RECONNECT: true,
  RETRY_MAX: 3,
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.STALE_TIME,
      refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
      refetchOnReconnect: QUERY_CONFIG.REFETCH_ON_RECONNECT,
      retry: (failureCount, error) => {
        if (isProblem(error) && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < QUERY_CONFIG.RETRY_MAX;
      },
    },
    mutations: {
      onError: (error) => {
        console.error("Mutation Error:", error);
        if (isProblem(error)) {
          if (error.errorCode === ERROR_CODES.SCHEMA_VALIDATION_ERROR) {
            toast.error("Data validation error. Please try again.");
          }
          else if (error.status === 0) {
            toast.error("Network error. Check your connection.");
          }
          else if (error.status >= 500) {
            toast.error("Server error. Please try again later.");
          }
        }
      },
    },
  },
});