import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

interface Props {
    type: string;
}

export function CouponTypeBadge({ type }: Props) {
    return (
        <Badge
            variant="secondary"
            className={cn(
                "text-xs",
                type === "PERCENT" && "bg-blue-100 text-blue-800",
                type === "AMOUNT" && "bg-purple-100 text-purple-800",
            )}
        >
            {type}
        </Badge>
    );
}
