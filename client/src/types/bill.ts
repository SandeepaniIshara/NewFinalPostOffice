/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Bill {
  client: any;

  id: string;
  amount: number;
  billType: string;
  accountNumber: string;
  amountPaid: number;
  paymentMethod: string;
  clientId: number;
  createdAt: Date;
}

export interface CreateBillInput {
  billType: string;
  accountNumber: string;
  amount: number;
  amountPaid: number;
  paymentMethod: string;
  clientId: number;
}
