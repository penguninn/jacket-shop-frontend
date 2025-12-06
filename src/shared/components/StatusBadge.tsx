import { Badge } from "@/shared/ui/badge";

interface StatusConfig {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
}

const DEFAULT_CONFIG: Record<string, StatusConfig> = {
    ACTIVE: { label: "Active", variant: "default" },
    INACTIVE: { label: "Inactive", variant: "secondary" },
};

interface Props {
    status: string;
    config?: Record<string, StatusConfig>;
}

export function StatusBadge({ status, config = DEFAULT_CONFIG }: Props) {
    const statusConfig = config[status] || {
        label: status,
        variant: "outline",
    };

    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
}
