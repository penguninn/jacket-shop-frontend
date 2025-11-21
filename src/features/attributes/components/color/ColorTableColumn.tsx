import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import type { Color } from "../../model/schemas";
import type { ColumnDef } from "@tanstack/react-table";
import { ColorTableRowActions } from "./ColorTableRowActions";

export const columns: ColumnDef<Color>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => <span>{info.getValue<string>()}</span>,
  },
  {
    accessorKey: "hexCode",
    header: "Hex Code",
    cell: (info) => (
      <div className="flex items-center gap-2">
        <div
          className="h-4 w-4 rounded-full border"
          style={{ backgroundColor: info.getValue<string>() }}
        />
        <span className="font-mono">{info.getValue<string>()}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
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
    cell: ({ row }) => <ColorTableRowActions row={row} />,
  },
];
