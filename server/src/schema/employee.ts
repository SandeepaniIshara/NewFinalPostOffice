import { z } from "zod";

export const EmployeeSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  address: z.string().min(1, { message: "Address is required" }),
  phoneNum: z.string().min(1, { message: "Phone number is required" }),
  role: z.enum(["MAIL_DELIVERER", "POSTALCLERK"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
  status: z.enum(["ACTIVE", "INACTIVE"], {
    errorMap: () => ({ message: "Status is required" }),
  }),
});
