import { Badge } from "@/components/ui/badge";
import type { Size } from "@/schema/attribute";
import type { ColumnDef } from "@tanstack/react-table";
import { SizeEditForm } from "../../forms/SizeEditForm";

export const columns: ColumnDef<Size>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: info => <span>{info.getValue<string>()}</span>, // cast to string
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: info => {
      const status = info.getValue<Size["status"]>();
      return (
        <Badge variant={status === "ACTIVE" ? "default" : "outline"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SizeEditForm size={row.original} />,
  },
];
