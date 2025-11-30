import { Badge } from "@/shared/ui/badge";
import type { ProductStatus } from "@/features/products/model/schemas";

interface Props {
    status: ProductStatus;
}

export function ProductStatusBadge({ status }: Props) {
    const variants: Record<ProductStatus, "default" | "secondary" | "destructive" | "outline"> = {
        ACTIVE: "default",
        INACTIVE: "secondary",
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
}
