import { useQuery } from "@tanstack/react-query";
import {
    getRevenueStatistics,
    getOrdersByStatus,
    getCompletedOrdersByType,
    getTopSellingProducts,
    getOutOfStockProducts,
    getTopRatedProducts,
    getInventoryValue,
    getCustomerStatistics,
    getTopCustomers,
    getDashboardStatistics,
} from "../api";
import {
    type StatisticsFilterParams,
    type DashboardFilterParams,
} from "../model/schemas";

export const statisticsKeys = {
    all: ["statistics"] as const,
    revenue: (params?: StatisticsFilterParams) => [...statisticsKeys.all, "revenue", params] as const,
    ordersByStatus: (params?: StatisticsFilterParams) => [...statisticsKeys.all, "orders-by-status", params] as const,
    ordersByType: (params?: StatisticsFilterParams) => [...statisticsKeys.all, "orders-by-type", params] as const,
    topSelling: (limit: number, params?: StatisticsFilterParams) => [...statisticsKeys.all, "top-selling", limit, params] as const,
    outOfStock: (threshold: number, limit: number) => [...statisticsKeys.all, "out-of-stock", threshold, limit] as const,
    topRated: (limit: number) => [...statisticsKeys.all, "top-rated", limit] as const,
    inventory: () => [...statisticsKeys.all, "inventory"] as const,
    customers: () => [...statisticsKeys.all, "customers"] as const,
    topCustomers: (limit: number, params?: StatisticsFilterParams) => [...statisticsKeys.all, "top-customers", limit, params] as const,
    dashboard: (params?: DashboardFilterParams) => [...statisticsKeys.all, "dashboard", params] as const,
} as const;

export function useRevenueStatistics(params?: StatisticsFilterParams) {
    return useQuery({
        queryKey: statisticsKeys.revenue(params),
        queryFn: () => getRevenueStatistics(params),
    });
}

export function useOrdersByStatus(params?: StatisticsFilterParams) {
    return useQuery({
        queryKey: statisticsKeys.ordersByStatus(params),
        queryFn: () => getOrdersByStatus(params),
    });
}

export function useCompletedOrdersByType(params?: StatisticsFilterParams) {
    return useQuery({
        queryKey: statisticsKeys.ordersByType(params),
        queryFn: () => getCompletedOrdersByType(params),
    });
}

export function useTopSellingProducts(limit: number = 10, params?: StatisticsFilterParams) {
    return useQuery({
        queryKey: statisticsKeys.topSelling(limit, params),
        queryFn: () => getTopSellingProducts(limit, params),
    });
}

export function useOutOfStockProducts(threshold: number = 0, limit: number = 20) {
    return useQuery({
        queryKey: statisticsKeys.outOfStock(threshold, limit),
        queryFn: () => getOutOfStockProducts(threshold, limit),
    });
}

export function useTopRatedProducts(limit: number = 10) {
    return useQuery({
        queryKey: statisticsKeys.topRated(limit),
        queryFn: () => getTopRatedProducts(limit),
    });
}

export function useInventoryValue() {
    return useQuery({
        queryKey: statisticsKeys.inventory(),
        queryFn: () => getInventoryValue(),
    });
}

export function useCustomerStatistics() {
    return useQuery({
        queryKey: statisticsKeys.customers(),
        queryFn: () => getCustomerStatistics(),
    });
}

export function useTopCustomers(limit: number = 10, params?: StatisticsFilterParams) {
    return useQuery({
        queryKey: statisticsKeys.topCustomers(limit, params),
        queryFn: () => getTopCustomers(limit, params),
    });
}

export function useDashboardStatistics(params?: DashboardFilterParams) {
    return useQuery({
        queryKey: statisticsKeys.dashboard(params),
        queryFn: () => getDashboardStatistics(params),
    });
}

