import { Badge } from "@/components/ui/badge";
import type { Color } from "@/schema/attribute";
import type { ColumnDef } from "@tanstack/react-table";
import { ColorEditForm } from "../../forms/ColorEditForm";

export const columns: ColumnDef<Color>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: info => <span>{info.getValue<string>()}</span>, // <-- cast to string
  },
  {
    accessorKey: "hexCode",
    header: "Hex Code",
    cell: info => (
      <span className="font-mono">{info.getValue<string>()}</span> // <-- cast to string
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: info => {
      const status = info.getValue<Color["status"]>();
      return (
        <Badge variant={status === "ACTIVE" ? "default" : "outline"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ColorEditForm color={row.original} />,
  },
];
