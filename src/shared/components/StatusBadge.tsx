import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

interface StatusConfig {
    label: string;
    className: string;
    variant?: "active" | "secondary" | "default" | "outline" | "destructive";
}

const DEFAULT_CONFIG: Record<string, StatusConfig> = {
    ACTIVE: {
        label: "Active",
        className: "", // variant handled in component
        variant: "active",
    },
    INACTIVE: {
        label: "Inactive",
        className: "",
        variant: "secondary",
    },
};

interface Props {
    status: string;
    config?: Record<string, StatusConfig & { variant?: "active" | "secondary" | "default" | "outline" | "destructive" }>;
    className?: string;
}

export function StatusBadge({
    status,
    config = DEFAULT_CONFIG,
    className,
}: Props) {
    const statusPart = status ? status.toUpperCase() : "UNKNOWN";
    const statusConfig = config[statusPart] || {
        label: status,
        className: "",
        variant: "outline",
    };

    return (
        <Badge
            variant={statusConfig.variant || "outline"}
            className={cn(
                "font-normal rounded-sm px-2 py-0.5",
                statusConfig.className,
                className
            )}
        >
            {statusConfig.label}
        </Badge>
    );
}
