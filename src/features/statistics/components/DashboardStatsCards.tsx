import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatCurrency } from "@/shared/utils/format";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import type { DashboardStatistics } from "../model/schemas";

interface DashboardStatsCardsProps {
    data: DashboardStatistics;
}

export function DashboardStatsCards({ data }: DashboardStatsCardsProps) {
    const { revenue, customerStatistics, inventoryValue } = data;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(revenue.totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">
                        {formatCurrency(revenue.totalProfit)} profit
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{revenue.totalCompletedOrders}</div>
                    <p className="text-xs text-muted-foreground">
                        Completed orders
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{customerStatistics.activeCustomers}</div>
                    <p className="text-xs text-muted-foreground">
                        +{customerStatistics.newCustomersThisMonth} new this month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(inventoryValue.totalInventoryValue)}</div>
                    <p className="text-xs text-muted-foreground">
                        {inventoryValue.totalQuantity} items in stock
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
