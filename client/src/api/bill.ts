import type { Bill, CreateBillInput } from "@/types/bill";
import apiClient from ".";

export const getBills = async (): Promise<{ bills: Bill[] }> => {
  const response = await apiClient.get("/bill");
  return response.data as { bills: Bill[] };
};

export const createBill = async ({
  billType,
  accountNumber,
  amount,
  amountPaid,
  paymentMethod,
  clientId,
}: CreateBillInput) => {
  const response = await apiClient.post("/bill", {
    billType,
    accountNumber,
    amount,
    amountPaid,
    paymentMethod,
    clientId,
  });
  return response.data as Bill;
};
