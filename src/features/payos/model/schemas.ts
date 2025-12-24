import { z } from "zod";

// PayOS Payment Link Status
export const paymentLinkStatusSchema = z.enum([
    'PENDING',
    'PAID',
    'CANCELLED',
    'EXPIRED',
]);

// CreatePaymentLinkResponse - returned when creating a new payment link
export const createPaymentLinkResponseSchema = z.object({
    bin: z.string(),
    accountNumber: z.string(),
    accountName: z.string(),
    amount: z.number(),
    description: z.string(),
    orderCode: z.number(),
    currency: z.string(),
    paymentLinkId: z.string(),
    status: paymentLinkStatusSchema,
    expiredAt: z.number().nullable().optional(),
    checkoutUrl: z.string(),
    qrCode: z.string(),
});

// Transaction schema for payment link details
export const transactionSchema = z.object({
    reference: z.string().optional(),
    amount: z.number().optional(),
    accountNumber: z.string().optional(),
    description: z.string().optional(),
    transactionDateTime: z.string().optional(),
    virtualAccountNumber: z.string().optional(),
    virtualAccountName: z.string().optional(),
    counterAccountBankId: z.string().optional(),
    counterAccountBankName: z.string().optional(),
    counterAccountName: z.string().optional(),
    counterAccountNumber: z.string().optional(),
});

// PaymentLink - returned when getting payment link details
export const paymentLinkSchema = z.object({
    id: z.string(),
    orderCode: z.number(),
    amount: z.number(),
    amountPaid: z.number(),
    amountRemaining: z.number(),
    status: paymentLinkStatusSchema,
    createdAt: z.string(),
    transactions: z.array(transactionSchema),
    cancellationReason: z.string().optional(),
    canceledAt: z.string().optional(),
});

// Type exports
export type PaymentLinkStatus = z.infer<typeof paymentLinkStatusSchema>;
export type CreatePaymentLinkResponse = z.infer<typeof createPaymentLinkResponseSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type PaymentLink = z.infer<typeof paymentLinkSchema>;
