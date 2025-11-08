export type Problem = {
  status?: number;
  code?: string;
  type?: string;
  title?: string;
  detail?: string;
  message?: string;
  errors?: Record<string, string>;
  raw?: any;
};

export function toProblem(e: any): Problem {
  const data = e?.response?.data ?? e;
  const status = e?.response?.status ?? data?.status;
  const errors = data?.errors;

  const msg =
    data?.detail ||
    data?.message ||
    data?.error ||
    data?.title ||
    "Unexpected error";

  return {
    status,
    code: data?.code,
    type: data?.type,
    title: data?.title,
    detail: data?.detail,
    message: msg,
    errors: errors && typeof errors === "object" ? errors : undefined,
    raw: data,
  };
}
