import { z } from "zod";
import { orderStatusSchema } from "@/features/orders/model/schemas";

// --- Response Schemas ---

export const revenueStatisticsSchema = z.object({
    totalRevenue: z.number(),
    totalProfit: z.number(),
    totalCost: z.number(),
    totalCompletedOrders: z.number(),
});

export const orderStatusStatisticsSchema = z.object({
    status: orderStatusSchema,
    count: z.number(),
});

export const orderTypeStatisticsSchema = z.object({
    onlineCompletedOrders: z.number(),
    posCompletedOrders: z.number(),
    totalCompletedOrders: z.number(),
});

export const topSellingProductSchema = z.object({
    productId: z.number(),
    productName: z.string(),
    thumbnail: z.string().nullable().optional(),
    brandName: z.string(),
    soldCount: z.number(),
    revenue: z.number(),
});

export const outOfStockProductSchema = z.object({
    variantId: z.number(),
    productId: z.number(),
    productName: z.string(),
    sku: z.string(),
    colorName: z.string(),
    sizeName: z.string(),
    materialName: z.string(),
    image: z.string().nullable().optional(),
    availableQuantity: z.number(),
});

export const topRatedProductSchema = z.object({
    productId: z.number(),
    productName: z.string(),
    thumbnail: z.string().nullable().optional(),
    brandName: z.string(),
    ratingAverage: z.number(),
    ratingCount: z.number(),
});

export const inventoryValueSchema = z.object({
    totalInventoryValue: z.number(),
    totalQuantity: z.number(),
    totalVariants: z.number(),
});

export const customerStatisticsSchema = z.object({
    totalCustomers: z.number(),
    newCustomersThisMonth: z.number(),
    activeCustomers: z.number(),
});

export const topCustomerSchema = z.object({
    userId: z.number(),
    fullName: z.string(),
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    avatar: z.string().nullable().optional(),
    totalSpent: z.number(),
    orderCount: z.number(),
});

export const dashboardStatisticsSchema = z.object({
    revenue: revenueStatisticsSchema,
    ordersByStatus: z.array(orderStatusStatisticsSchema),
    completedOrdersByType: orderTypeStatisticsSchema,
    topSellingProducts: z.array(topSellingProductSchema),
    outOfStockProducts: z.array(outOfStockProductSchema),
    topRatedProducts: z.array(topRatedProductSchema),
    inventoryValue: inventoryValueSchema,
    customerStatistics: customerStatisticsSchema,
    topCustomers: z.array(topCustomerSchema),
});

// --- Filter Schemas ---

export const statisticsFilterSchema = z.object({
    startDate: z.string().optional(), // ISO Date string YYYY-MM-DD
    endDate: z.string().optional(),   // ISO Date string YYYY-MM-DD
});

export const dashboardFilterSchema = statisticsFilterSchema.extend({
    topProductsLimit: z.number().optional().default(10),
    outOfStockLimit: z.number().optional().default(10),
    outOfStockThreshold: z.number().optional().default(5),
    topCustomersLimit: z.number().optional().default(10),
});


// --- Types ---

export type RevenueStatistics = z.infer<typeof revenueStatisticsSchema>;
export type OrderStatusStatistics = z.infer<typeof orderStatusStatisticsSchema>;
export type OrderTypeStatistics = z.infer<typeof orderTypeStatisticsSchema>;
export type TopSellingProduct = z.infer<typeof topSellingProductSchema>;
export type OutOfStockProduct = z.infer<typeof outOfStockProductSchema>;
export type TopRatedProduct = z.infer<typeof topRatedProductSchema>;
export type InventoryValue = z.infer<typeof inventoryValueSchema>;
export type CustomerStatistics = z.infer<typeof customerStatisticsSchema>;
export type TopCustomer = z.infer<typeof topCustomerSchema>;
export type DashboardStatistics = z.infer<typeof dashboardStatisticsSchema>;

export type StatisticsFilterParams = z.infer<typeof statisticsFilterSchema>;
export type DashboardFilterParams = z.infer<typeof dashboardFilterSchema>;
