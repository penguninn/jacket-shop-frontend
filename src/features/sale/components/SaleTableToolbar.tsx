import { type Table } from "@tanstack/react-table";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { X, Calendar, Percent } from "lucide-react";
import { DataTableViewOptions } from "@/shared/components/data-table/DataTableViewOptions";
import { DataTableFacetedFilter } from "@/shared/components/data-table/DataTableFacetedFilter";
import { type SaleResponse } from "../model/schemas";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover";
import { Label } from "@/shared/ui/label";
import { useState } from "react";
import { Badge } from "@/shared/ui/badge";

interface Props {
    table: Table<SaleResponse>;
    onFilterChange?: (filters: {
        minDiscount?: number;
        maxDiscount?: number;
        fromDate?: string;
        toDate?: string;
    }) => void;
}

export function SaleTableToolbar({ table, onFilterChange }: Props) {
    const isFiltered = table.getState().columnFilters.length > 0;

    // Local state for custom filters
    const [minDiscount, setMinDiscount] = useState<string>("");
    const [maxDiscount, setMaxDiscount] = useState<string>("");
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");

    const hasDiscountFilter = minDiscount !== "" || maxDiscount !== "";
    const hasDateFilter = fromDate !== "" || toDate !== "";

    const handleApplyDiscountFilter = () => {
        onFilterChange?.({
            minDiscount: minDiscount ? parseFloat(minDiscount) : undefined,
            maxDiscount: maxDiscount ? parseFloat(maxDiscount) : undefined,
        });
    };

    const handleClearDiscountFilter = () => {
        setMinDiscount("");
        setMaxDiscount("");
        onFilterChange?.({
            minDiscount: undefined,
            maxDiscount: undefined,
        });
    };

    const handleApplyDateFilter = () => {
        onFilterChange?.({
            fromDate: fromDate || undefined,
            toDate: toDate || undefined,
        });
    };

    const handleClearDateFilter = () => {
        setFromDate("");
        setToDate("");
        onFilterChange?.({
            fromDate: undefined,
            toDate: undefined,
        });
    };

    const handleResetAll = () => {
        table.resetColumnFilters();
        handleClearDiscountFilter();
        handleClearDateFilter();
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2 flex-wrap gap-y-2">
                <Input
                    placeholder="Search by sale name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(e) =>
                        table.getColumn("name")?.setFilterValue(e.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {/* Status Filter */}
                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={[
                            { label: "Active", value: "ACTIVE" },
                            { label: "Inactive", value: "INACTIVE" },
                        ]}
                    />
                )}

                {/* Discount Filter */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 border-dashed">
                            <Percent className="mr-2 h-4 w-4" />
                            Discount
                            {hasDiscountFilter && (
                                <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                                    {minDiscount || "0"}% - {maxDiscount || "100"}%
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Discount Range</h4>
                                <p className="text-sm text-muted-foreground">
                                    Filter sales by discount percentage
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label htmlFor="minDiscount">Min %</Label>
                                        <Input
                                            id="minDiscount"
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="0"
                                            value={minDiscount}
                                            onChange={(e) => setMinDiscount(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="maxDiscount">Max %</Label>
                                        <Input
                                            id="maxDiscount"
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="100"
                                            value={maxDiscount}
                                            onChange={(e) => setMaxDiscount(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={handleClearDiscountFilter}
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={handleApplyDiscountFilter}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Date Range Filter */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 border-dashed">
                            <Calendar className="mr-2 h-4 w-4" />
                            Date Range
                            {hasDateFilter && (
                                <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
                                    Filtered
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Date Range</h4>
                                <p className="text-sm text-muted-foreground">
                                    Filter sales that overlap with date range
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <div className="space-y-1">
                                    <Label htmlFor="fromDate">From Date</Label>
                                    <Input
                                        id="fromDate"
                                        type="datetime-local"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="toDate">To Date</Label>
                                    <Input
                                        id="toDate"
                                        type="datetime-local"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={handleClearDateFilter}
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={handleApplyDateFilter}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Reset Button */}
                {(isFiltered || hasDiscountFilter || hasDateFilter) && (
                    <Button
                        variant="ghost"
                        onClick={handleResetAll}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
