import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { Table } from "@tanstack/react-table";
import { SizeCreateForm } from "../../forms/SizeCreateForm";

interface Props {
  table: Table<any>; // Size table
}

export function SizeTableToolbar({ table }: Props) {
  const [search, setSearch] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    table.getColumn("name")?.setFilterValue(value);
  };

  return (
    <div className="flex items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
      <Input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="max-w-xs"
      />
      <SizeCreateForm />
    </div>
  );
}
