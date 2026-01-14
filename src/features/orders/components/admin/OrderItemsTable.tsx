import {
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "@/shared/components/data-table/DataTable";
import { columns } from "./OrderItemsTableColumns";
import type { OrderDetail } from "../../model/schemas";

interface OrderItemsTableProps {
    data: OrderDetail[];
    isLoading?: boolean;
}

export function OrderItemsTable({ data, isLoading }: OrderItemsTableProps) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="">
            <DataTable
                table={table}
                columns={columns}
                isLoading={isLoading}
            />
        </div>
    );
}
