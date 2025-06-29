import { Request, Response } from "express";
import { prisma } from "..";
import { UserRole, UserStatus } from "@prisma/client";
import { EmployeeSchema } from "../schema/employee";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";

export const getEmployees = async (req: Request, res: Response) => {
  const { q, status, role } = req.query;
  const searchQuery = typeof q === "string" ? q : "";

  const employees = await prisma.employee.findMany({
    where: {
      OR: [
        {
          id: {
            equals: isNaN(Number(searchQuery))
              ? undefined
              : Number(searchQuery),
          },
        },
        { fName: { contains: searchQuery,  } },
        { lName: { contains: searchQuery,  } },
        { username: { contains: searchQuery,  } },
        { email: { contains: searchQuery,  } },
        { phoneNum: { contains: searchQuery,  } },
      ],
      AND: [
        { status: status ? (status as UserStatus) : undefined },
        { role: role ? (role as UserRole) : undefined },
      ]
    },
    select: {
      id: true,
      username: true,
      fName: true,
      lName: true,
      email: true,
      phoneNum: true,
      address: true,
      role: true,
      status: true,
    },
  });
  if (employees.length === 0) {
    return res.json({ employees: [] });
  }
  console.log(
    `LOG_BOOK employee= ${employees.length} searched by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );
  res.json({ employees: employees });
};

export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  EmployeeSchema.parse(req.body);
  const {
    firstName,
    lastName,
    email,
    phoneNum,
    address,
    username,
    role,
    status,
  } = req.body;

  let employee = await prisma.employee.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
  if (!employee) {
    throw new BadRequestException(
      "Employee not found",
      ErrorCode.EMPLOYEE_NOT_FOUND
    );
  }

  if (username && username !== employee.username) {
    const existingUser = await prisma.employee.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUser) {
      throw new BadRequestException(
        "Username already exists",
        ErrorCode.USERNAME_ALREADY_EXISTS
      );
    }
  }

  if (email && email !== employee.email) {
    const existingEmail = await prisma.employee.findUnique({
      where: {
        email: email,
      },
    });
    if (existingEmail) {
      throw new BadRequestException(
        "Email already exists",
        ErrorCode.EMAIL_ALREADY_EXISTS
      );
    }
  }

  employee = await prisma.employee.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      fName: firstName,
      lName: lastName,
      email,
      phoneNum,
      address,
      username,
      role,
      status,
    },
  });

  console.log(
    `LOG_BOOK employee= ${employee.username} updated by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );
  const { password: userPassword, ...rest } = employee;
  res.json({ employee: employee });
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const employee = await prisma.employee.update({
    where: {
      id: parseInt(id, 10),
    },
    data: {
      status: UserStatus.INACTIVE,
    },
  });
  if (!employee) {
    throw new BadRequestException(
      "Employee not found",
      ErrorCode.EMPLOYEE_NOT_FOUND
    );
  }
  console.log(
    `LOG_BOOK employee= ${employee.username} deleted by ${
      req.user?.username
    } at ${new Date().toLocaleString()}`
  );
  res.json({ message: "Employee deleted successfully" });
};
