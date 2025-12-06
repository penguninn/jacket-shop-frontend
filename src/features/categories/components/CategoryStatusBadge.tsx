import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

interface Props {
  status: number | string;
  className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; variant: "active" | "secondary" | "default" | "outline" | "destructive" }> = {
  1: { label: "Active", variant: "active" },
  0: { label: "Inactive", variant: "secondary" },
  active: { label: "Active", variant: "active" },
  inactive: { label: "Inactive", variant: "secondary" },
};

export function CategoryStatusBadge({ status, className }: Props) {
  // Normalize key: if number, use it; if string, lowercase it
  const key = typeof status === 'number' ? status : status.toString().toLowerCase();

  // Direct match or fallback for string keys if needed
  const config = STATUS_CONFIG[key] || STATUS_CONFIG[status.toString().toLowerCase()] || {
    label: "Unknown",
    variant: "secondary",
  };

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "font-normal rounded-sm px-2 py-0.5",
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
