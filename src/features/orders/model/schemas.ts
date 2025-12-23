import { z } from "zod";

export const ORDER_STATUS = {
    PENDING_PAYMENT: 'pending_payment',
    PAID: 'paid', // kept for compatibility if needed, but backend seems to use PaymentStatus separate from OrderStatus for payment
    PENDING_CONFIRMATION: 'pending_confirmation', // Note: Check consistency with backend enums
    PENDING: 'PENDING', // Backend uses PENDING
    CONFIRMED: 'CONFIRMED', // Backend uses CONFIRMED
    SHIPPING: 'SHIPPING', // Backend uses SHIPPING
    COMPLETED: 'COMPLETED', // Backend uses COMPLETED
    CANCELLED: 'CANCELLED', // Backend uses CANCELLED
    RETURNED: 'RETURNED', // Backend uses RETURNED
} as const;

// Backend OrderStatus map
// PENDING, CONFIRMED, SHIPPING, COMPLETED, CANCELLED, RETURNED

export const ORDER_TYPE = {
    ONLINE: 'ONLINE',
    POS_INSTORE: 'POS_INSTORE',
    POS_DELIVERY: 'POS_DELIVERY',
} as const;

export const PAYMENT_STATUS = {
    UNPAID: 'UNPAID',
    PAID: 'PAID',
    REFUNDED: 'REFUNDED',
} as const;

export const orderStatusSchema = z.enum([
    'PENDING',
    'CONFIRMED',
    'SHIPPING',
    'COMPLETED',
    'CANCELLED',
    'RETURNED',
]);

export const orderTypeSchema = z.enum([
    'ONLINE',
    'POS_INSTORE',
    'POS_DELIVERY',
]);

export const paymentStatusSchema = z.enum(['UNPAID', 'PAID', 'REFUNDED']);

export const orderDetailSchema = z.object({
    id: z.number().optional(),
    productName: z.string(),
    sku: z.string(),
    size: z.string(),
    color: z.string(),
    material: z.string(),
    image: z.string().nullable().optional(),
    thumbnail: z.string().nullable().optional(),
    price: z.number(),
    quantity: z.number(),
    subtotal: z.number(),
});

export const orderSchema = z.object({
    id: z.number(),
    orderCode: z.string(),
    orderType: orderTypeSchema,
    customerName: z.string(),
    customerPhone: z.string().optional(),
    totalProducts: z.number().optional(),
    totalAmount: z.number().optional(),
    total: z.number(),
    subtotal: z.number(),
    shippingFee: z.number(),
    discount: z.number().nullable().optional(),
    couponCode: z.string().nullable().optional(),

    status: orderStatusSchema,
    paymentStatus: paymentStatusSchema,
    paymentMethodName: z.string().optional(),

    shippingAddressLine: z.string().optional(),
    shippingProvinceName: z.string().optional(),
    shippingDistrictName: z.string().optional(),

    shippingWardName: z.string().optional(),

    carrierName: z.string().nullable().optional(),
    carrierCode: z.string().nullable().optional(),

    note: z.string().nullable().optional(),
    createdAt: z.string(), // Backend sends Instant, likely serialized as string

    details: z.array(orderDetailSchema).optional(),
});

export const orderArraySchema = z.array(orderSchema);

export const orderFilterParamsSchema = z.object({
    page: z.number().default(1),
    size: z.number().default(10),
    orderCode: z.string().optional(),
    status: z.string().optional(),
    type: z.string().optional(),
    paymentStatus: z.string().optional(),
    userId: z.number().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    sortBy: z.string().optional(),
    sortDir: z.string().optional(),
});

export const ordersResponseSchema = z.object({
    contents: z.array(orderSchema), // Backend uses contents for page
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
});


export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderType = z.infer<typeof orderTypeSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type OrderDetail = z.infer<typeof orderDetailSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderFilterParams = z.infer<typeof orderFilterParamsSchema>;
export type OrdersResponse = z.infer<typeof ordersResponseSchema>;

export const orderItemRequestSchema = z.object({
    productVariantId: z.number(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const createOrderRequestSchema = z.object({
    orderType: orderTypeSchema,
    paymentMethodId: z.number(),
    note: z.string().optional(),
    couponCode: z.string().optional(),
    items: z.array(orderItemRequestSchema).min(1, "Order items cannot be empty"),
    userId: z.number().optional(),
    customerName: z.string().optional(),
    customerPhone: z.string().optional(),
    addressId: z.number().optional(), // Made optional to match DTO (though logically required usually, backend DTO has it nullable?) DTO says Long addressId, not @NotNull, but likely needed. Validation said @NotNull on type etc. Let's keep optional in schema but enforce in UI? No, DTO field list: private Long addressId; (not @NotNull). Wait, logic implies it.
    // Actually, looking at DTO: addressId is just `private Long addressId;`. It might be required for shipping.
    // Let's make it required in our schema if we want to validte.
    // Frontend schema:
    // addressId: z.number(),
    // But let's follow the DTO fields. Ideally addressId is required for delivery.

    // Shipping fields
    carrierName: z.string().optional(),
    carrierServiceName: z.string().optional(),
    carrierRateId: z.string().optional(),
    deliveryTimeEstimate: z.string().optional(),
    shippingFee: z.number().optional(),

    transactionId: z.string().optional(),
});

export type OrderItemRequest = z.infer<typeof orderItemRequestSchema>;
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;

export const orderHistoryResponseSchema = z.object({
    id: z.number(),
    orderId: z.number(),
    oldStatus: orderStatusSchema.nullable(),
    newStatus: orderStatusSchema,
    oldPaymentStatus: paymentStatusSchema.nullable(),
    newPaymentStatus: paymentStatusSchema,
    changedByUserId: z.number().nullable(),
    note: z.string().nullable(),
    createdAt: z.string(),
});

export type OrderHistoryResponse = z.infer<typeof orderHistoryResponseSchema>;
