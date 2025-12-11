export interface Problem {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;

  errorCode?: string;
  errors?: Record<string, string>;
  requestId?: string;
  service?: string;

  message?: string;
}

export function toProblem(error: any): Problem {
  if (error.code === 'ECONNABORTED') {
    return {
      type: "about:blank",
      title: "Request Timeout",
      status: 408,
      detail: "Request took too long to complete",
      errorCode: "REQUEST_TIMEOUT",
    };
  }

  if (error.response?.data) {
    const data = error.response.data;

    if (data.type && data.title && data.status) {
      return {
        type: data.type,
        title: data.title,
        status: data.status,
        detail: data.detail || data.title,
        instance: data.instance,
        errorCode: data.errorCode,
        errors: data.errors,
        requestId: data.requestId,
        service: data.service,
      };
    }
  }

  if (error.request && !error.response) {
    return {
      type: "about:blank",
      title: "Network Error",
      status: 0,
      detail: "Unable to connect to server",
      errorCode: "NETWORK_ERROR",
    };
  }

  return {
    type: "about:blank",
    title: "Unknown Error",
    status: 500,
    detail: error.message || "An unexpected error occurred",
    errorCode: "INTERNAL_ERROR",
  };
}

export function hasValidationErrors(error: unknown): error is Problem & { errors: Record<string, string> } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    typeof (error as any).errors === 'object' &&
    Object.keys((error as any).errors).length > 0
  );
}

export function isProblem(error: unknown): error is Problem {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'title' in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isProblem(error)) {
    return error.detail || error.message || "An error occurred";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error occurred";
}


export const ERROR_CODES = {
  // Auth
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",

  // System
  VALIDATION_FAILED: "VALIDATION_FAILED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  MALFORMED_REQUEST: "MALFORMED_REQUEST",
  ACCESS_DENIED: "ACCESS_DENIED",
  NETWORK_ERROR: "NETWORK_ERROR",
  SCHEMA_VALIDATION_ERROR: "SCHEMA_VALIDATION_ERROR",
  AUTH_SESSION_EXPIRED: "AUTH_SESSION_EXPIRED",
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
