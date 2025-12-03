import { Badge } from "@/shared/ui/badge";
import type { BrandStatus } from "../model/schemas";

interface Props {
    status: BrandStatus;
}

export function BrandStatusBadge({ status }: Props) {
    const variants: Record<BrandStatus, "default" | "secondary"> = {
        ACTIVE: "default",
        INACTIVE: "secondary",
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
}
