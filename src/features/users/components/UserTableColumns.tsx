import { type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/shared/ui/checkbox";
import { Button } from "@/shared/ui/button";
import { ArrowUpDown } from "lucide-react";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserTableRowActions } from "./UserTableRowActions";
import { formatDistanceToNow } from "date-fns";
import type { User, Role } from "@/features/users/model/schemas";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
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
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("username")}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string | null;
      return <div>{phone || "—"}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <UserStatusBadge status={row.getValue("status")} />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.getValue("roles") as Role[];
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <UserRoleBadge key={role.id} role={role.name} />
          ))}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const roles = row.getValue(id) as Role[];
      // Check if any of the user's roles (by name) are in the selected filter values
      return value.some((v: string) => roles.some(r => r.name === v));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm text-muted-foreground">
          {formatDistanceToNow(date, { addSuffix: true })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserTableRowActions row={row} />,
  },
];
