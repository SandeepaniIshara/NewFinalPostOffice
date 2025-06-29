import { Request, Response } from "express";
import { CustomerSchema } from "../schema/customer";
import { prisma } from "..";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";
import { CustomerStatus } from "@prisma/client";

export const GetCustomers = async (req: Request, res: Response) => {
  const { q,status } = req.query;
  const searchQuery = typeof q === "string" ? q : "";

  const customers = await prisma.customer.findMany({
    where: {
      OR: [
        { fName: { contains: searchQuery } },
        { lName: { contains: searchQuery } },
        { email: { contains: searchQuery } },
        { contactNum: { contains: searchQuery } },
      ],
      AND: [
        {
          status: status
            ? (status as CustomerStatus)
            : undefined,
        },
      ],
    },
  });

  if (customers.length === 0) {
    return res.json({ customers: [] });
  }

  console.log(
    `LOG_BOOK customer= ${searchQuery} searched by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );

  res.json({ customers: customers });
};

export const GetCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    throw new BadRequestException(
      "Customer ID is required!",
      ErrorCode.BAD_REQUEST
    );
  }

  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });

  if (!customer) {
    throw new NotFoundException(
      "Customer not found!",
      ErrorCode.CUSTOMER_NOT_FOUND
    );
  }

  console.log(
    `LOG_BOOK customer= ${id}  Customer ID by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );

  res.json({ customer });
};

export const CreateCustomer = async (req: Request, res: Response) => {
  CustomerSchema.parse(req.body);

  const { firstName, lastName, email, contactNum, address } = req.body;

  let customer = await prisma.customer.findUnique({
    where: { email },
  });

  if (customer) {
    throw new BadRequestException(
      "Customer already exists!",
      ErrorCode.CUSTOMER_ALREADY_EXISTS
    );
  }

  customer = await prisma.customer.create({
    data: {
      // Map API schema names to database field names
      fName: firstName, // firstName (API) -> fName (DB)
      lName: lastName, // lastName (API) -> lName (DB)
      email,
      contactNum,
      address,
    },
  });

  console.log(
    `LOG_BOOK customer= ${firstName} added by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );

  res.json({ customer });
};

export const UpdateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    throw new BadRequestException(
      "Customer ID is required!",
      ErrorCode.BAD_REQUEST
    );
  }

  CustomerSchema.parse(req.body);

  const { firstName, lastName, email, contactNum, address,status } = req.body;

  let customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
  });

  if (!customer) {
    throw new BadRequestException(
      "Customer not found!",
      ErrorCode.CUSTOMER_NOT_FOUND
    );
  }

  if (customer.email !== email) {
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    });
    if (existingCustomer) {
      throw new BadRequestException(
        "Customer with this email already exists!",
        ErrorCode.CUSTOMER_ALREADY_EXISTS
      );
    }
  }

  customer = await prisma.customer.update({
    where: { id: Number(id) },
    data: {
      fName: firstName,
      lName: lastName,
      email,
      contactNum,
      address,
      status
    },
  });

  console.log(
    `LOG_BOOK customer= ${firstName} updated by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );

  res.json({ customer });
};


export const DeleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;

 

  const customer = await prisma.customer.update({
    where: { id: Number(id) },
    data: {
      status: CustomerStatus.INACTIVE,
    },
  });

  if (!customer) {
    throw new NotFoundException(
      "Customer not found!",
      ErrorCode.CUSTOMER_NOT_FOUND
    );
  }

  console.log(
    `LOG_BOOK customer= ${customer.fName} deleted by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );

  res.json({ message: "Customer deleted successfully!" });
}