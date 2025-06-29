import { z } from "zod";

export const BillSchema = z.object({
  amount: z.number().positive(),
  billType: z.enum([
    "ELECTRICITY",
    "WATER",
    "GAS",
    "INTERNET",
    "PHONE",
    "RENT",
    "INSURANCE",
    "OTHER",
  ]),
  accountNumber: z.string().optional(),
  amountPaid: z.number().nonnegative().optional(),
  paymentMethod: z.enum(["CASH", "CREDIT_CARD", "BANK_TRANSFER", "OTHER"]).optional(),
  clientId: z.number(),
});