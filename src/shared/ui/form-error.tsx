import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import type { FieldErrors } from "react-hook-form";

interface Props {
    errors: FieldErrors<any>;
}

export function FormError({ errors }: Props) {
    if (!errors.root) return null;

    return (
        <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
    );
}
