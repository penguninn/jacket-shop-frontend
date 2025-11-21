import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";

interface Props {
  role: string;
}

export function UserRoleBadge({ role }: Props) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-xs",
        role === "ADMIN" && "bg-purple-100 text-purple-800",
        role === "CUSTOMER" && "bg-blue-100 text-blue-800",
        role === "STAFF" && "bg-orange-100 text-orange-800",
      )}
    >
      {role}
    </Badge>
  );
}
