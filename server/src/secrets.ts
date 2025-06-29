import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

export const IP = process.env.IP || "localhost";
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3030; 
export const JWT_SECRET = process.env.JWT_SECRET!;
export const NODE_ENV = process.env.NODE_ENV!;
