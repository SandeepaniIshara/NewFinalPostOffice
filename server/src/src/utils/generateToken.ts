import jwt from "jsonwebtoken";
import { Response } from "express";

interface UserPayload {
  id: string | number; 
  role: string;
}

const generateToken = (data: UserPayload, res: Response): string => {
  const payload = {
    id: data.id,
    role: data.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 1 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });

  return token;
};

export default generateToken;
