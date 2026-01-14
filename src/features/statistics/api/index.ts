import { httpPrivateTyped } from "@/shared/api/http-typed";
import { z } from "zod";
import {
    revenueStatisticsSchema,
    orderStatusStatisticsSchema,
    orderTypeStatisticsSchema,
    topSellingProductSchema,
    outOfStockProductSchema,
    topRatedProductSchema,
    inventoryValueSchema,
    customerStatisticsSchema,
    topCustomerSchema,
    dashboardStatisticsSchema,
    type StatisticsFilterParams,
    type DashboardFilterParams,
} from "../model/schemas";

const ENDPOINTS = Object.freeze({
    REVENUE: '/statistics/revenue',
    ORDERS_BY_STATUS: '/statistics/orders/by-status',
    ORDERS_BY_TYPE: '/statistics/orders/by-type',
    TOP_SELLING_PRODUCTS: '/statistics/products/top-selling',
    OUT_OF_STOCK_PRODUCTS: '/statistics/products/out-of-stock',
    TOP_RATED_PRODUCTS: '/statistics/products/top-rated',
    INVENTORY_VALUE: '/statistics/inventory',
    CUSTOMER_STATISTICS: '/statistics/customers',
    TOP_CUSTOMERS: '/statistics/customers/top',
    DASHBOARD: '/statistics/dashboard',
} as const);

function buildQueryParams(params: Record<string, any>): URLSearchParams {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
        }
    });
    return queryParams;
}

export async function getRevenueStatistics(params?: StatisticsFilterParams) {
    const queryParams = params ? buildQueryParams(params) : "";
    return await httpPrivateTyped.get(
        `${ENDPOINTS.REVENUE}?${queryParams.toString()}`,
        revenueStatisticsSchema
    );
}

export async function getOrdersByStatus(params?: StatisticsFilterParams) {
    const queryParams = params ? buildQueryParams(params) : "";
    return await httpPrivateTyped.get(
        `${ENDPOINTS.ORDERS_BY_STATUS}?${queryParams.toString()}`,
        z.array(orderStatusStatisticsSchema)
    );
}

export async function getCompletedOrdersByType(params?: StatisticsFilterParams) {
    const queryParams = params ? buildQueryParams(params) : "";
    return await httpPrivateTyped.get(
        `${ENDPOINTS.ORDERS_BY_TYPE}?${queryParams.toString()}`,
        orderTypeStatisticsSchema
    );
}

export async function getTopSellingProducts(limit: number = 10, params?: StatisticsFilterParams) {
    const queryParams = buildQueryParams({ ...params, limit });
    return await httpPrivateTyped.get(
        `${ENDPOINTS.TOP_SELLING_PRODUCTS}?${queryParams.toString()}`,
        z.array(topSellingProductSchema)
    );
}

export async function getOutOfStockProducts(threshold: number = 0, limit: number = 20) {
    const queryParams = buildQueryParams({ threshold, limit });
    return await httpPrivateTyped.get(
        `${ENDPOINTS.OUT_OF_STOCK_PRODUCTS}?${queryParams.toString()}`,
        z.array(outOfStockProductSchema)
    );
}

export async function getTopRatedProducts(limit: number = 10) {
    const queryParams = buildQueryParams({ limit });
    return await httpPrivateTyped.get(
        `${ENDPOINTS.TOP_RATED_PRODUCTS}?${queryParams.toString()}`,
        z.array(topRatedProductSchema)
    );
}

export async function getInventoryValue() {
    return await httpPrivateTyped.get(
        ENDPOINTS.INVENTORY_VALUE,
        inventoryValueSchema
    );
}

export async function getCustomerStatistics() {
    return await httpPrivateTyped.get(
        ENDPOINTS.CUSTOMER_STATISTICS,
        customerStatisticsSchema
    );
}

export async function getTopCustomers(limit: number = 10, params?: StatisticsFilterParams) {
    const queryParams = buildQueryParams({ ...params, limit });
    return await httpPrivateTyped.get(
        `${ENDPOINTS.TOP_CUSTOMERS}?${queryParams.toString()}`,
        z.array(topCustomerSchema)
    );
}

export async function getDashboardStatistics(params?: DashboardFilterParams) {
    const queryParams = params ? buildQueryParams(params) : "";
    return await httpPrivateTyped.get(
        `${ENDPOINTS.DASHBOARD}?${queryParams.toString()}`,
        dashboardStatisticsSchema
    );
}
