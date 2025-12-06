import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

interface Props {
  role: string;
  className?: string;
}

const ROLE_CONFIG: Record<string, { label: string; variant: "active" | "secondary" | "default" | "outline" | "destructive" }> = {
  ADMIN: { label: "Admin", variant: "secondary" },
  STAFF: { label: "Staff", variant: "secondary" }, // Previously MANAGER
  CUSTOMER: { label: "Customer", variant: "secondary" }, // Previously USER
};

export function UserRoleBadge({ role, className }: Props) {
  const config = ROLE_CONFIG[role] || {
    label: role,
    variant: "outline",
  };

  return (
    <Badge
      variant={config.variant}
      className={cn("font-normal rounded-sm px-2 py-0.5", className)}
    >
      {config.label}
    </Badge>
  );
}
