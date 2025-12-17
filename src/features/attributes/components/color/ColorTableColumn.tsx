import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";
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
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="w-[60px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => <span>{info.getValue<string>()}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: (info) => {
      const description = info.getValue<string | null>();
      return <span className="text-muted-foreground">{description || "—"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const dateStr = row.getValue("createdAt") as string | null;
      if (!dateStr) return <span className="text-muted-foreground">—</span>;
      const date = new Date(dateStr);
      return (
        <span className="text-muted-foreground">
          {formatDistanceToNow(date, { addSuffix: true })}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ColorTableRowActions row={row} />,
  },
];
