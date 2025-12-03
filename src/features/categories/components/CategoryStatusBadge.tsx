import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { type CategoryStatus } from "../model/schemas";

interface Props {
  status: CategoryStatus;
}

export function CategoryStatusBadge({ status }: Props) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-xs",
        status === "ACTIVE" && "bg-green-100 text-green-800",
        status === "INACTIVE" && "bg-slate-100 text-slate-800",
      )}
    >
      {status}
    </Badge>
  );
}
