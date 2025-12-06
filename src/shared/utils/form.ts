import type { Problem } from "@/shared/api/error";

export function mapProblemToForm(
    err: Problem,
    setError: (name: any, e: any) => void,
    defaultField: string = "root"
) {
    if (err.errors && Object.keys(err.errors).length > 0) {
        for (const [field, msg] of Object.entries(err.errors)) {
            setError(field as any, { message: String(msg) });
        }
        return;
    }

    const msg = err.detail || err.message || "An error occurred";
    setError(defaultField as any, { message: msg });
}
