import { useDashboardStatistics } from "../hooks";
import { DashboardStatsCards } from "../components/DashboardStatsCards";
import { TopSellingProductsTable } from "../components/TopSellingProductsTable";
import { OutOfStockProductsTable } from "../components/OutOfStockProductsTable";
import { TopCustomersTable } from "../components/TopCustomersTable";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { subDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarDateRangePicker } from "@/shared/ui/date-range-picker";

export function DashboardPage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    const startDate = date?.from ? format(date.from, "yyyy-MM-dd") : undefined;
    const endDate = date?.to ? format(date.to, "yyyy-MM-dd") : undefined;

    const { data: stats, isLoading, error } = useDashboardStatistics({
        startDate,
        endDate,
        topProductsLimit: 5,
        outOfStockLimit: 5,
        outOfStockThreshold: 5,
        topCustomersLimit: 5
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-2">
                <p className="text-destructive font-semibold">Failed to load dashboard data</p>
                <p className="text-sm text-muted-foreground">Please try again later</p>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <CalendarDateRangePicker
                        date={date}
                        setDate={setDate}
                    />
                </div>
            </div>

            <DashboardStatsCards data={stats} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <TopSellingProductsTable products={stats.topSellingProducts} />
                </div>
                <div className="col-span-3">
                    <TopCustomersTable customers={stats.topCustomers} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-3">
                    <OutOfStockProductsTable products={stats.outOfStockProducts} />
                </div>
            </div>
        </div>
    );
}
