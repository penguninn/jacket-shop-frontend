import { StatusBadge } from "@/shared/components/StatusBadge";

interface Props {
    status: string;
}

export function UserStatusBadge({ status }: Props) {
    return <StatusBadge status={status} />;
}
