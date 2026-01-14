import { z } from "zod";
import {
    pageResponseSchema
} from "@/shared/api/schemas";

export const ORDER_CONSTANTS = {
    SORT_FIELDS: ['createdAt', 'updatedAt', 'confirmedAt', 'processingAt', 'shippedAt', 'completedAt', 'cancelledAt', 'returnedAt'],
} as const;

export const ORDER_STATUS = {
    ALL: 'ALL',
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    SHIPPING: 'SHIPPING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    RETURNED: 'RETURNED',
} as const;

export const ORDER_TYPE = {
    ONLINE: 'ONLINE',
    POS_INSTORE: 'POS_INSTORE',
} as const;

export const PAYMENT_STATUS = {
    UNPAID: 'UNPAID',
    PAID: 'PAID',
    REFUNDED: 'REFUNDED',
} as const;

export const orderStatusSchema = z.enum([
    ORDER_STATUS.ALL,
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.SHIPPING,
    ORDER_STATUS.COMPLETED,
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.RETURNED,
]);

export const orderTypeSchema = z.enum([
    ORDER_TYPE.ONLINE,
    ORDER_TYPE.POS_INSTORE,
]);

export const paymentStatusSchema = z.enum([
    PAYMENT_STATUS.UNPAID,
    PAYMENT_STATUS.PAID,
    PAYMENT_STATUS.REFUNDED,
]);

export const shippingInfoRequestSchema = z.object({
    carrierName: z.string().min(1, "Carrier name is required"),
    carrierServiceName: z.string().min(1, "Carrier service name is required"),
    carrierRateId: z.string().optional(),
    deliveryTimeEstimate: z.string().optional(),
    shippingFee: z.number().optional(),
});

export const orderDetailSchema = z.object({
    id: z.number().optional(),
    productId: z.number().optional(),
    productVariantId: z.number().optional(),
    productName: z.string(),
    sku: z.string(),
    size: z.string(),
    color: z.string(),
    material: z.string(),
    image: z.string().nullable().optional(),
    originalPrice: z.number().nullable().optional(),
    price: z.number(),
    discountPercentage: z.number().nullable().optional(),
    quantity: z.number(),
    subtotal: z.number(),
});

export const orderSchema = z.object({
    id: z.number(),
    orderCode: z.string(),
    orderType: orderTypeSchema,

    userId: z.number().nullable().optional(),
    customerName: z.string().nullable().optional(),
    customerPhone: z.string().nullable().optional(),
    customerEmail: z.string().nullable().optional(),

    staffId: z.number().nullable().optional(),
    staffName: z.string().nullable().optional(),

    shippingRecipientName: z.string().nullable().optional(),
    shippingRecipientPhone: z.string().nullable().optional(),

    shippingAddressLine: z.string().nullable().optional(),
    shippingProvinceCode: z.string().nullable().optional(),
    shippingDistrictCode: z.string().nullable().optional(),
    shippingWardCode: z.string().nullable().optional(),
    shippingProvinceName: z.string().nullable().optional(),
    shippingDistrictName: z.string().nullable().optional(),
    shippingWardName: z.string().nullable().optional(),

    paymentMethodId: z.number().nullable().optional(),
    paymentMethodName: z.string().nullable().optional(),
    paymentMethodCode: z.string().nullable().optional(),
    paymentStatus: paymentStatusSchema,
    transactionId: z.string().nullable().optional(),
    paymentDate: z.string().nullable().optional(),

    carrierName: z.string().nullable().optional(),
    carrierServiceName: z.string().nullable().optional(),
    carrierRateId: z.string().nullable().optional(),
    trackingNumber: z.string().nullable().optional(),
    deliveryTimeEstimate: z.string().nullable().optional(),
    shippingFee: z.number().optional(),

    couponId: z.number().nullable().optional(),
    couponCode: z.string().nullable().optional(),
    discount: z.number().nullable().optional(),
    subtotal: z.number(),
    total: z.number(),

    status: orderStatusSchema,
    note: z.string().nullable().optional(),

    createdAt: z.string(),
    updatedAt: z.string().optional(),
    confirmedAt: z.string().nullable().optional(),
    processingAt: z.string().nullable().optional(),
    shippedAt: z.string().nullable().optional(),
    completedAt: z.string().nullable().optional(),
    cancelledAt: z.string().nullable().optional(),
    returnedAt: z.string().nullable().optional(),

    details: z.array(orderDetailSchema).optional(),

    canCancel: z.boolean().optional(),
    canReceive: z.boolean().optional(),
    canReturn: z.boolean().optional(),
});

export const orderItemRequestSchema = z.object({
    productVariantId: z.number(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const createOrderRequestSchema = z.object({
    paymentMethodId: z.number(),
    note: z.string().optional(),
    couponCode: z.string().optional(),
    items: z.array(orderItemRequestSchema).min(1, "Items list cannot be empty"),
    userId: z.number().optional(),
    addressId: z.number(),
    shippingFee: z.number().optional(),
    carrierName: z.string().optional(),
    carrierServiceName: z.string().optional(),
    carrierRateId: z.string().optional(),
    deliveryTimeEstimate: z.string().optional(),
});

export const updatePaymentRequestSchema = z.object({
    paymentMethodId: z.number(),
    paymentStatus: paymentStatusSchema,
    transactionId: z.string().optional(),
    paymentDate: z.string().optional(),
    note: z.string().optional(),
});

export const posDraftRequestSchema = z.object({
    orderType: z.enum(['POS_INSTORE']),

    paymentMethodId: z.number().nullable().optional(),
    transactionId: z.string().nullable().optional(),

    items: z.array(orderItemRequestSchema).optional(),

    userId: z.number().nullable().optional(),
    customerName: z.string().nullable().optional(),
    customerPhone: z.string().nullable().optional(),
    customerEmail: z.string().nullable().optional(),

    couponCode: z.string().nullable().optional(),

    addressId: z.number().nullable().optional(),
    shippingRecipientName: z.string().nullable().optional(),
    shippingRecipientPhone: z.string().nullable().optional(),
    shippingAddressLine: z.string().nullable().optional(),

    shippingProvinceCode: z.string().nullable().optional(),
    shippingDistrictCode: z.string().nullable().optional(),
    shippingWardCode: z.string().nullable().optional(),
    shippingProvinceName: z.string().nullable().optional(),
    shippingDistrictName: z.string().nullable().optional(),
    shippingWardName: z.string().nullable().optional(),

    shippingFee: z.number().nullable().optional(),
    carrierName: z.string().nullable().optional(),
    carrierServiceName: z.string().nullable().optional(),
    carrierRateId: z.string().nullable().optional(),
    deliveryTimeEstimate: z.string().nullable().optional(),

    note: z.string().nullable().optional(),
});

export const ordersResponseSchema = pageResponseSchema(orderSchema);

export type Order = z.infer<typeof orderSchema>;
export type OrderDetail = z.infer<typeof orderDetailSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderType = z.infer<typeof orderTypeSchema>;

export type OrderItemRequest = z.infer<typeof orderItemRequestSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;
export type UpdatePaymentRequest = z.infer<typeof updatePaymentRequestSchema>;
export type ShippingInfoRequest = z.infer<typeof shippingInfoRequestSchema>;
export type PosDraftRequest = z.infer<typeof posDraftRequestSchema>;

export type CreatePosDraftRequest = CreateOrderRequest;
export type UpdatePosDraftRequest = Partial<PosDraftRequest>;
export const updatePosDraftRequestSchema = posDraftRequestSchema.partial();