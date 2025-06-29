import { Request, Response } from "express";
import { prisma } from "..";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";
import { BillSchema } from "../schema/bill";
import { BillType, CustomerStatus } from "@prisma/client";

export const GetBills = async (req: Request, res: Response) => {
  const bills = await prisma.bill.findMany({include: { client: true } });
  if (bills.length === 0) {
    return res.json({ bills: [] });
  }
  console.log(
    `LOG_BOOK bill= ${bills.length} get by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );
  res.json({ bills: bills });
};

export const CreateBill = async (req: Request, res: Response) => {
  BillSchema.parse(req.body);
  const {
    amount,
    billType,
    accountNumber,
    amountPaid,
    paymentMethod,
    clientId,
  } = req.body;

  const customer = await prisma.customer.findFirst({
    where: { id: Number(clientId) , status: CustomerStatus.ACTIVE},
  });

  if (!customer) {
    throw new NotFoundException(
      "Customer not found!",
      ErrorCode.CUSTOMER_NOT_FOUND
    );
  }

  const bill = await prisma.bill.create({
    data: {
      amount,
      billType,
      accountNumber,
      amountPaid,
      paymentMethod,
      clientId: Number(clientId),
    },
  });

  console.log(
    `LOG_BOOK bill= ${bill.id}  created by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );
  res.json({
    bill: bill,
  });
};
