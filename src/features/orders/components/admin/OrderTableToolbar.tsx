import { type Table } from "@tanstack/react-table";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Search, X, CalendarIcon } from "lucide-react";
import { DataTableFacetedFilter } from "@/shared/components/data-table/DataTableFacetedFilter";
import { DataTableViewOptions } from "@/shared/components/data-table/DataTableViewOptions";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Calendar } from "@/shared/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import { ORDER_TYPE } from "../../model";

interface Props<TData> {
    table: Table<TData>;
}

const typeOptions = [
    { label: "Online", value: ORDER_TYPE.ONLINE },
    { label: "POS In-Store", value: ORDER_TYPE.POS_INSTORE },
];

export function OrderTableToolbar<TData>({ table }: Props<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    const [date, setDate] = useState<Date>();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search orders"
                            value={(table.getColumn("orderCode")?.getFilterValue() as string) ?? ""}
                            onChange={(e) =>
                                table.getColumn("orderCode")?.setFilterValue(e.target.value)
                            }
                            className="h-8 w-[200px] lg:w-[250px] pl-9"
                        />
                    </div>

                    {table.getColumn("orderType") && (
                        <DataTableFacetedFilter
                            column={table.getColumn("orderType")}
                            title="Type"
                            options={typeOptions}
                        />
                    )}

                    <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("h-8 w-[130px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "dd/MM/yyyy") : <span>From Date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("h-8 w-[130px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    <span>To Date</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => table.resetColumnFilters()}
                            className="h-8 px-2 lg:px-3"
                        >
                            Reset
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="flex gap-2">
                    <DataTableViewOptions table={table} />
                </div>
            </div>
        </div>
    );
}
