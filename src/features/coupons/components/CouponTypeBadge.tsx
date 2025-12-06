import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

interface Props {
    type: string;
    className?: string;
}

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
    PERCENTAGE: {
        label: "Percentage",
        className: "border-blue-500 text-blue-500",
    },
    FIXED_AMOUNT: {
        label: "Fixed Amount",
        className: "border-green-500 text-green-500",
    },
};

export function CouponTypeBadge({ type, className }: Props) {
    const config = TYPE_CONFIG[type] || {
        label: type,
        className: "border-gray-500 text-gray-500",
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                "font-normal rounded-sm px-2 py-0.5",
                config.className,
                className
            )}
        >
            {config.label}
        </Badge>
    );
}
