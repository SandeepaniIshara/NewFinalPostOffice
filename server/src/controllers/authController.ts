import { Request, Response } from "express";
import { SignInSchema, SignUpSchema } from "../schema/auth";
import { prisma } from "..";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/bad-request";
import { comparePassword, hashPassword } from "../src/utils/hashPassword";
import { NotFoundException } from "../exceptions/not-found";
import generateToken from "../src/utils/generateToken";
import { UserStatus } from "@prisma/client";
import { ForbiddenException } from "../exceptions/forbidden";

export const SignUp = async (req: Request, res: Response) => {
  SignUpSchema.parse(req.body);

  const {
    firstName,
    lastName,
    username,
    email,
    address,
    phoneNum,
    role,
    password,
    confirmPassword,
  } = req.body;

  let user = await prisma.employee.findFirst({
    where: {
      OR: [{ email, username }],
    },
  });

  if (user) {
    throw new BadRequestException(
      "User already exists!",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  if (password !== confirmPassword) {
    throw new BadRequestException(
      "Passwords do not match!",
      ErrorCode.PASSWORD_MISMATCH
    );
  }

  const hashedPassword = await hashPassword(password);

  user = await prisma.employee.create({
    data: {
      fName: firstName,
      lName: lastName,
      username,
      email,
      address,
      phoneNum,
      password: hashedPassword,
      role,
    },
  });

  const { password: userPassword, ...rest } = user;
  console.log(
    `LOG_BOOK ${user.username} SIGNED UP at ${new Date().toLocaleString()}`
  );
  res.json({ user: rest });
};

export const SignIn = async (req: Request, res: Response) => {
  SignInSchema.parse(req.body);
  const { username, password } = req.body;

  let user = await prisma.employee.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new NotFoundException(
      "Invalid credentials!",
      ErrorCode.INVALID_CREDENTIALS
    );
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new BadRequestException(
      "Invalid credentials!",
      ErrorCode.INVALID_CREDENTIALS
    );
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new ForbiddenException(
      "Your account is inactive. Please contact support.",
      ErrorCode.ACCOUNT_INACTIVE
    );
  }
  if (user.status === UserStatus.PENDING) {
    throw new ForbiddenException(
      "Your account is pending approval. Please contact support.",
      ErrorCode.ACCOUNT_PENDING
    );
  }

  generateToken({ id: user.id.toString(), role: user.role }, res);

  const { password: hashedPassword, ...rest } = user;
  console.log(
    `LOG_BOOK ${user.username} LOG IN at ${new Date().toLocaleString()}`
  );
  res.status(200).json({ user: rest });
};

export const SignOut = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully!" });
}