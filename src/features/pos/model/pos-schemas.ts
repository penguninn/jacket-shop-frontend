import { z } from "zod";
import { orderItemRequestSchema } from "@/features/orders/model/schemas";

// POS Draft Order Schema (matches backend OrderRequest)
export const posDraftRequestSchema = z.object({
    orderType: z.enum(['POS_INSTORE', 'POS_DELIVERY']),

    // Payment info (set before completing)
    paymentMethodId: z.number().nullable().optional(),
    transactionId: z.string().nullable().optional(),

    // Items
    items: z.array(orderItemRequestSchema).optional(),

    // Customer info (nullable for walk-in customers)
    userId: z.number().nullable().optional(),
    customerName: z.string().nullable().optional(),
    customerPhone: z.string().nullable().optional(),

    // Shipping info (for POS_DELIVERY)
    addressId: z.number().nullable().optional(),
    shippingRecipientName: z.string().nullable().optional(),
    shippingRecipientPhone: z.string().nullable().optional(),
    shippingAddressLine: z.string().nullable().optional(),
    shippingProvinceCode: z.string().nullable().optional(),
    shippingDistrictCode: z.string().nullable().optional(),
    shippingWardCode: z.string().nullable().optional(),

    carrierName: z.string().nullable().optional(),
    carrierServiceName: z.string().nullable().optional(),
    carrierRateId: z.string().nullable().optional(),
    deliveryTimeEstimate: z.string().nullable().optional(),
    shippingFee: z.number().nullable().optional(),

    // Discount/Coupon
    couponCode: z.string().nullable().optional(), // Allow null to remove

    // Notes
    note: z.string().nullable().optional(),
});

// Type exports
export type PosDraftRequest = z.infer<typeof posDraftRequestSchema>;

// Convenience aliases for clarity
export type CreatePosDraftRequest = PosDraftRequest;
export type UpdatePosDraftRequest = Partial<PosDraftRequest>;
export const updatePosDraftRequestSchema = posDraftRequestSchema.partial();
