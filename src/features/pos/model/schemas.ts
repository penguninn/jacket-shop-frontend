import { z } from "zod";
import { orderItemRequestSchema } from "@/features/orders/model/schemas";

export const posDraftRequestSchema = z.object({
    orderType: z.enum(['POS_INSTORE']),

    // Payment info (set before completing)
    paymentMethodId: z.number().nullable().optional(),
    transactionId: z.string().nullable().optional(),

    // Items
    items: z.array(orderItemRequestSchema).optional(),

    // Customer info (nullable for walk-in customers)
    userId: z.number().nullable().optional(),
    customerName: z.string().nullable().optional(),
    customerPhone: z.string().nullable().optional(),
    customerEmail: z.string().nullable().optional(),

    // Discount/Coupon
    couponCode: z.string().nullable().optional(), // Allow null to remove

    // Shipping info (Optional for POS)
    addressId: z.number().nullable().optional(),
    shippingRecipientName: z.string().nullable().optional(),
    shippingRecipientPhone: z.string().nullable().optional(),
    shippingAddressLine: z.string().nullable().optional(),

    // Address codes
    shippingProvinceCode: z.string().nullable().optional(),
    shippingDistrictCode: z.string().nullable().optional(),
    shippingWardCode: z.string().nullable().optional(),

    // Address names (usually not sent in request but useful for form state)
    shippingProvinceName: z.string().nullable().optional(),
    shippingDistrictName: z.string().nullable().optional(),
    shippingWardName: z.string().nullable().optional(),

    // Carrier
    shippingFee: z.number().nullable().optional(),
    carrierName: z.string().nullable().optional(),
    carrierServiceName: z.string().nullable().optional(),
    carrierRateId: z.string().nullable().optional(),
    deliveryTimeEstimate: z.string().nullable().optional(),

    // Notes
    note: z.string().nullable().optional(),
});

// Type exports
export type PosDraftRequest = z.infer<typeof posDraftRequestSchema>;

// Convenience aliases for clarity
export type CreatePosDraftRequest = PosDraftRequest;
export type UpdatePosDraftRequest = Partial<PosDraftRequest>;
export const updatePosDraftRequestSchema = posDraftRequestSchema.partial();
