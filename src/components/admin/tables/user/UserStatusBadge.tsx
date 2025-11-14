import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserStatus } from "@/schema/user";

interface Props {
  status: UserStatus;
}

export function UserStatusBadge({ status }: Props) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        status === "ACTIVE" && "border-green-600 bg-green-50 text-green-700",
        status === "INACTIVE" && "border-gray-600 bg-gray-50 text-gray-700",
      )}
    >
      {status}
    </Badge>
  );
}
