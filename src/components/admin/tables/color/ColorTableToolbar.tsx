import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorCreateForm } from "../../forms/ColorCreateForm";
import type { Table } from "@tanstack/react-table";

interface Props {
  table: Table<any>; // Color table
}

export function ColorTableToolbar({ table }: Props) {
  const [search, setSearch] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    table.getColumn("name")?.setFilterValue(value);
  };

  const handleStatusChange = (value: string[]) => {
    table.getColumn("status")?.setFilterValue(value);
  };

  return (
    <div className="flex items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-xs"
        />
        <Select onValueChange={(v) => handleStatusChange(v ? [v] : [])}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ColorCreateForm />
    </div>
  );
}
