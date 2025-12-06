import { StatusBadge } from "@/shared/components/StatusBadge";
import { Checkbox } from "@/shared/ui/checkbox";
import type { Size } from "../../model/schemas";
import type { ColumnDef } from "@tanstack/react-table";
import { SizeTableRowActions } from "./SizeTableRowActions";

export const columns: ColumnDef<Size>[] = [
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
    id: "actions",
    cell: ({ row }) => <SizeTableRowActions row={row} />,
  },
];
