import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { JWT_SECRET } from "../secrets";
import { prisma } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { UserRole, UserStatus } from "@prisma/client";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      username: string;
      role: string;
    };
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    throw new UnauthorizedException(
      "Token is required! SIGNIN Again!",
      ErrorCode.TOKEN_REQUIRED
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: (decoded as any).id,
      username: "",
      role: (decoded as any).role,
    };
    const user = await prisma.employee.findUnique({
      where: {
        id: Number(req.user.id),
      },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new NotFoundException("User not found!", ErrorCode.USER_NOT_FOUND);
    }

    req.user = {
      id: user.id.toString(),
      username: user.username,
      role: user.role,
    };
    next();
  } catch (error) {
    throw new UnauthorizedException(
      "Invalid or expired token!",
      ErrorCode.INVALID_TOKEN
    );
  }
};

export const requirePostal = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== UserRole.POSTALCLERK) {
    throw new UnauthorizedException(
      "You are not authorized to access this resource!",
      ErrorCode.UNAUTHORIZED
    );
  }
  next();
};
