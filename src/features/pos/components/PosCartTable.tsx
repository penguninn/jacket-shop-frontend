
import { useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table";
import { useRemoveItemFromDraft, useUpdateDraftItemQuantity } from "../hooks";
import type { Order } from "../model/schemas";
import { columns, type PosCartTableMeta } from "./PosCartColumns";

interface PosCartTableProps {
    activeDraft: Order | undefined;
}

export function PosCartTable({ activeDraft }: PosCartTableProps) {
    const { mutate: updateQuantity } = useUpdateDraftItemQuantity();
    const { mutate: removeItem } = useRemoveItemFromDraft();

    const data = useMemo(() => activeDraft?.details || [], [activeDraft?.details]);

    const handleUpdateQuantity = (itemId: number, quantity: number) => {
        if (!activeDraft) return;
        if (quantity <= 0) return;
        updateQuantity({ draftId: activeDraft.id, itemId, quantity });
    };

    const handleRemoveItem = (itemId: number) => {
        if (!activeDraft) return;
        removeItem({ draftId: activeDraft.id, itemId });
    };

    const meta: PosCartTableMeta = useMemo(() => ({
        updateQuantity: handleUpdateQuantity,
        removeItem: handleRemoveItem,
    }), [activeDraft, updateQuantity, removeItem]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta,
    });

    if (!activeDraft) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>Select or create a draft to start</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>Cart is empty</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto">
            <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                let className = "";
                                if (header.column.columnDef.size === 40) className = "w-[40%]";
                                else if (header.column.columnDef.size === 15) className = "w-[15%]";
                                else if (header.column.columnDef.size === 25) className = "w-[25%]";
                                else if (header.column.columnDef.size === 5) className = "w-[5%]";

                                return (
                                    <TableHead key={header.id} className={className}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}