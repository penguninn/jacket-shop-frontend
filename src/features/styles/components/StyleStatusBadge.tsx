import { Badge } from "@/shared/ui/badge";
import type { StyleStatus } from "../model/schemas";

interface Props {
    status: StyleStatus;
}

export function StyleStatusBadge({ status }: Props) {
    const variants: Record<StyleStatus, "default" | "secondary"> = {
        ACTIVE: "default",
        INACTIVE: "secondary",
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
}
